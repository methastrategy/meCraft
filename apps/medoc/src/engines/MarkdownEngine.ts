/**
 * @file MarkdownEngine.ts
 * meDoc Studio — Markdown, KaTeX Math & Mermaid Processing Engine
 * 100% In-Device Client-Side Execution
 */

import { marked } from 'marked';
import katex from 'katex';

export interface DocumentStats {
  words: number;
  characters: number;
  lines: number;
  readingTimeMinutes: number;
}

export interface RenderOptions {
  enableKaTeX?: boolean;
  enableMermaid?: boolean;
  enableSyntaxHighlight?: boolean;
}

/**
 * Escapes HTML characters for safe code display
 */
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * High-speed, zero-dependency token highlighter for common code blocks
 */
export function highlightCode(code: string, language: string = ''): string {
  const lang = language.toLowerCase().trim();
  const escaped = escapeHtml(code);

  if (!lang || lang === 'text' || lang === 'plain') {
    return escaped;
  }

  // Multi-language token regex patterns
  return escaped
    // Comments: // ... or # ... or /* ... */
    .replace(/(\/\/[^\n]*|\/\*[\s\S]*?\*\/|#[^\n]*)/g, '<span class="hl-comment">$1</span>')
    // String literals: "...", '...', `...`
    .replace(/(["'`])((?:\\.|[^\\])*?)\1/g, '<span class="hl-string">$1$2$1</span>')
    // Numeric constants
    .replace(/\b(\d+(?:\.\d+)?(?:e[+-]?\d+)?|0x[0-9a-fA-F]+)\b/g, '<span class="hl-number">$1</span>')
    // Common programming keywords
    .replace(/\b(async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|false|finally|for|from|function|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|pub|public|return|static|super|switch|this|throw|true|try|typeof|type|var|void|while|with|yield|fn|def|struct|impl|match|select|where)\b/g, '<span class="hl-keyword">$1</span>')
    // Builtin types and objects
    .replace(/\b(boolean|number|string|symbol|any|unknown|never|void|object|Promise|Array|Map|Set|Record|Error|Math|JSON|console|document|window)\b/g, '<span class="hl-type">$1</span>');
}

/**
 * Renders KaTeX math formula safely
 */
export function renderMathExpression(expr: string, displayMode: boolean): string {
  try {
    return katex.renderToString(expr.trim(), {
      displayMode,
      throwOnError: false,
      output: 'htmlAndMathml',
    });
  } catch (err) {
    const safeExpr = escapeHtml(expr);
    return `<span class="katex-error" title="${escapeHtml(String(err))}"><code>${safeExpr}</code></span>`;
  }
}

/**
 * Pre-processes LaTeX math formulas in Markdown source before passing to marked:
 * 1. Display math: $$ ... $$
 * 2. Inline math: $ ... $
 */
export function processMathInMarkdown(markdown: string): string {
  // First, temporarily protect code blocks from math extraction
  const codeBlocks: string[] = [];
  const protectedMd = markdown.replace(/(```[\s\S]*?```|`[^`\n]+`)/g, (match) => {
    codeBlocks.push(match);
    return `__CODE_BLOCK_${codeBlocks.length - 1}__`;
  });

  // Replace Display Math: $$ ... $$
  let processed = protectedMd.replace(/\$\$([\s\S]+?)\$\$/g, (_, math) => {
    const rendered = renderMathExpression(math, true);
    return `\n\n<div class="medoc-math-display">${rendered}</div>\n\n`;
  });

  // Replace Inline Math: $ ... $ (ensuring not followed or preceded by $ or digits e.g. $100)
  processed = processed.replace(/(^|[^\\])\$([^\$\n]+?)\$/g, (_, prefix, math) => {
    // If it looks like currency (e.g. $10 or $20.50), leave it intact
    if (/^\d+(?:\.\d+)?$/.test(math.trim())) {
      return `${prefix}$${math}$`;
    }
    const rendered = renderMathExpression(math, false);
    return `${prefix}<span class="medoc-math-inline">${rendered}</span>`;
  });

  // Restore code blocks
  processed = processed.replace(/__CODE_BLOCK_(\d+)__/g, (_, idx) => {
    return codeBlocks[parseInt(idx, 10)] || '';
  });

  return processed;
}

/**
 * Transforms Markdown into semantic HTML with KaTeX, Mermaid and Syntax Highlighting
 */
export async function renderMarkdown(markdown: string, options: RenderOptions = {}): Promise<string> {
  const {
    enableKaTeX = true,
    enableMermaid = true,
    enableSyntaxHighlight = true,
  } = options;

  let textToParse = markdown;

  // Process math before marked
  if (enableKaTeX) {
    textToParse = processMathInMarkdown(textToParse);
  }

  // Configure marked renderer
  const renderer = new marked.Renderer();

  // Custom code block rendering
  renderer.code = ({ text, lang }: { text: string; lang?: string }) => {
    const rawLang = (lang || '').trim();

    if (enableMermaid && rawLang === 'mermaid') {
      const cleanDiagram = escapeHtml(text);
      return `<div class="mermaid-container" data-raw-diagram="${cleanDiagram}">
        <div class="mermaid">${text}</div>
      </div>`;
    }

    const highlighted = enableSyntaxHighlight ? highlightCode(text, rawLang) : escapeHtml(text);
    const langClass = rawLang ? ` language-${rawLang}` : '';
    return `<pre class="medoc-code-block"><code class="${langClass}">${highlighted}</code></pre>`;
  };

  // Custom table styling
  renderer.table = ({ header, rows }: { header: string; rows: string }) => {
    return `<div class="medoc-table-wrapper"><table class="medoc-table"><thead>${header}</thead><tbody>${rows}</tbody></table></div>`;
  };

  // Custom blockquote styling
  renderer.blockquote = ({ text }: { text: string }) => {
    return `<blockquote class="medoc-quote">${text}</blockquote>`;
  };

  marked.setOptions({
    gfm: true,
    breaks: true,
  });

  const parsed = await marked.parse(textToParse, { renderer });
  return parsed;
}

/**
 * Computes word, char, line stats and reading time estimation
 */
export function computeDocumentStats(text: string): DocumentStats {
  if (!text || text.trim() === '') {
    return {
      words: 0,
      characters: 0,
      lines: 0,
      readingTimeMinutes: 0,
    };
  }

  const lines = text.split(/\r\n|\r|\n/).length;
  const characters = text.length;

  // Strip code blocks and markdown symbols for cleaner word counting
  const cleanText = text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]+`/g, ' ')
    .replace(/[#*>\-_~\[\]\(\)]/g, ' ')
    .trim();

  // Split on whitespace
  const wordsArray = cleanText.split(/\s+/).filter(w => w.length > 0);
  const words = wordsArray.length;

  // Average reading speed: 200 words per minute
  const readingTimeMinutes = Math.max(1, Math.ceil(words / 200));

  return {
    words,
    characters,
    lines,
    readingTimeMinutes,
  };
}
