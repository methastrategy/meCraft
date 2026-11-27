use base64::{Engine, engine::general_purpose::STANDARD};
use minisign_verify::{PublicKey, Signature};
use std::{env, fs, path::PathBuf};

// Run explicitly after building the signed preview installer.
#[test]
#[ignore = "requires a locally built and signed preview installer"]
fn signed_installer_matches_the_configured_key_and_version() {
    let root = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
    let config: serde_json::Value =
        serde_json::from_slice(&fs::read(root.join("tauri.conf.json")).unwrap()).unwrap();
    let version = env::var("MECRAFT_TEST_VERSION").unwrap_or_else(|_| config["version"].as_str().unwrap().to_string());
    let encoded_key = config["plugins"]["updater"]["pubkey"].as_str().unwrap();
    let public_key =
        PublicKey::decode(std::str::from_utf8(&STANDARD.decode(encoded_key).unwrap()).unwrap())
            .unwrap();
    let installer = env::var_os("MECRAFT_TEST_INSTALLER").map(PathBuf::from).unwrap_or_else(|| root
        .join("target/release/bundle/msi")
        .join(format!("meCraft_{version}_x64_en-US.msi")));
    let signed_data = fs::read(&installer).unwrap();
    let encoded_signature = fs::read_to_string(installer.with_extension("msi.sig")).unwrap();
    let decoded_signature = STANDARD.decode(encoded_signature.trim()).unwrap();
    let signature = Signature::decode(std::str::from_utf8(&decoded_signature).unwrap()).unwrap();

    public_key.verify(&signed_data, &signature, true).unwrap();
    assert!(
        signature
            .trusted_comment()
            .split('\t')
            .any(|field| field == format!("version:{version}"))
    );
    let mut corrupted = signed_data;
    corrupted[0] ^= 1;
    assert!(public_key.verify(&corrupted, &signature, true).is_err());
}
