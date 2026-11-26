use std::collections::HashMap;
use std::sync::{LazyLock, Mutex};
use std::time::Duration;
use tauri::ipc::Channel;
use tokio::{
    io::{AsyncBufReadExt, AsyncReadExt, AsyncWriteExt, BufReader},
    net::{TcpListener, TcpStream},
    sync::oneshot,
    time::{Instant, timeout, timeout_at},
};

#[derive(Clone, serde::Serialize)]
#[serde(tag = "status", rename_all = "snake_case")]
pub(crate) enum OAuthEvent {
    Code { code: String },
    Expired,
}

static PENDING: LazyLock<Mutex<HashMap<String, oneshot::Sender<bool>>>> =
    LazyLock::new(|| Mutex::new(HashMap::new()));
const WAIT: Duration = Duration::from_secs(180);

fn event_from_request(request: &str, state: &str) -> Option<OAuthEvent> {
    let mut line = request.lines().next()?.split_whitespace();
    if line.next()? != "GET" {
        return None;
    }
    let target = line.next()?;
    let (path, _) = target.split_once('?')?;
    if path != "/callback" {
        return None;
    }
    let url = reqwest::Url::parse(&format!("http://127.0.0.1{target}")).ok()?;
    let mut params = url.query_pairs();
    let returned_state = params.find(|(key, _)| key == "state")?.1;
    if returned_state != state {
        return None;
    }
    if url
        .query_pairs()
        .any(|(key, value)| key == "cancelled" && value == "1")
    {
        return Some(OAuthEvent::Expired);
    }
    let code = url.query_pairs().find(|(key, _)| key == "code")?.1;
    if code.is_empty() || code.len() > 1024 {
        return None;
    }
    Some(OAuthEvent::Code {
        code: code.into_owned(),
    })
}

async fn respond(stream: &mut TcpStream, ok: bool) {
    let (status, message) = if ok {
        ("200 OK", "Signed in to meCraft. Return to the app.")
    } else {
        (
            "400 Bad Request",
            "Sign-in could not be completed. Return to meCraft and try again.",
        )
    };
    let page = format!(
        "<!doctype html><html lang=en><meta charset=utf-8><title>meCraft</title><h1>{message}</h1></html>"
    );
    let response = format!(
        "HTTP/1.1 {status}\r\nContent-Type: text/html; charset=utf-8\r\nCache-Control: no-store\r\nReferrer-Policy: no-referrer\r\nConnection: close\r\nContent-Length: {}\r\n\r\n{page}",
        page.len()
    );
    let _ = stream.write_all(response.as_bytes()).await;
    let _ = stream.shutdown().await;
}

#[tauri::command]
pub(crate) async fn start_desktop_oauth(
    state: String,
    on_event: Channel<OAuthEvent>,
) -> Result<u16, String> {
    if state.len() != 64 || !state.bytes().all(|byte| byte.is_ascii_hexdigit()) {
        return Err("Invalid OAuth state".into());
    }
    let listener = TcpListener::bind("127.0.0.1:0")
        .await
        .map_err(|e| e.to_string())?;
    let port = listener.local_addr().map_err(|e| e.to_string())?.port();
    tokio::spawn(async move {
        let deadline = Instant::now() + WAIT;
        while let Ok(Ok((mut stream, _))) = timeout_at(deadline, listener.accept()).await {
            let mut request = Vec::new();
            let mut reader = BufReader::new(&mut stream).take(8192);
            if !matches!(
                timeout(
                    Duration::from_secs(2),
                    reader.read_until(b'\n', &mut request)
                )
                .await,
                Ok(Ok(_))
            ) || request.last() != Some(&b'\n')
            {
                continue;
            }
            let Some(event) = std::str::from_utf8(&request)
                .ok()
                .and_then(|text| event_from_request(text, &state))
            else {
                respond(&mut stream, false).await;
                continue;
            };
            if matches!(event, OAuthEvent::Expired) {
                let _ = on_event.send(event);
                respond(&mut stream, false).await;
                return;
            }
            let (sender, ack) = oneshot::channel();
            if let Ok(mut pending) = PENDING.lock() {
                pending.insert(state.clone(), sender);
            }
            let delivered = on_event.send(event).is_ok();
            let ok = delivered && matches!(timeout_at(deadline, ack).await, Ok(Ok(true)));
            respond(&mut stream, ok).await;
            if let Ok(mut pending) = PENDING.lock() {
                pending.remove(&state);
            }
            if !ok {
                let _ = on_event.send(OAuthEvent::Expired);
            }
            return;
        }
        let _ = on_event.send(OAuthEvent::Expired);
    });
    Ok(port)
}

#[tauri::command]
pub(crate) fn finish_desktop_oauth(state: String, success: bool) {
    if let Ok(mut pending) = PENDING.lock() {
        if let Some(sender) = pending.remove(&state) {
            let _ = sender.send(success);
        }
    }
}

#[cfg(test)]
mod tests {
    #[test]
    fn callback_requires_matching_state_and_path() {
        use super::{OAuthEvent, event_from_request};
        assert!(
            matches!(event_from_request("GET /callback?state=s&code=abc HTTP/1.1", "s"),
            Some(OAuthEvent::Code { code }) if code == "abc")
        );
        assert!(matches!(
            event_from_request("GET /callback?state=s&cancelled=1 HTTP/1.1", "s"),
            Some(OAuthEvent::Expired)
        ));
        assert!(event_from_request("GET /callback?state=wrong&code=abc HTTP/1.1", "s").is_none());
        assert!(event_from_request("GET /other?state=s&code=abc HTTP/1.1", "s").is_none());
    }
}
