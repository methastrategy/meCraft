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
 * High-speed single-pass token highlighter for code blocks
 * Immune to recursive HTML tag mangling
 */
export function highlightCode(code: string, language: string = ''): string {
  const lang = language.toLowerCase().trim();
  if (!lang || lang === 'text' || lang === 'plain') {
    return escapeHtml(code);
  }

  // Token regex for single-pass lexing
  const tokenRegex = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|#[^\n]*)|(["'`])(?:\\.|[^\\])*?\2|\b(\d+(?:\.\d+)?(?:e[+-]?\d+)?|0x[0-9a-fA-F]+)\b|\b(async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|false|finally|for|from|function|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|pub|public|return|static|super|switch|this|throw|true|try|typeof|type|var|void|while|with|yield|fn|def|struct|impl|match|select|where)\b|\b(boolean|number|string|symbol|any|unknown|never|void|object|Promise|Array|Map|Set|Record|Error|Math|JSON|console|document|window)\b/g;

  let result = '';
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(code)) !== null) {
    result += escapeHtml(code.slice(lastIndex, match.index));
    lastIndex = tokenRegex.lastIndex;

    const [full, comment, stringQuote, num, keyword, builtinType] = match;
    if (comment) {
      result += `<span class="hl-comment">${escapeHtml(comment)}</span>`;
    } else if (stringQuote) {
      result += `<span class="hl-string">${escapeHtml(full)}</span>`;
    } else if (num) {
      result += `<span class="hl-number">${escapeHtml(num)}</span>`;
    } else if (keyword) {
      result += `<span class="hl-keyword">${escapeHtml(keyword)}</span>`;
    } else if (builtinType) {
      result += `<span class="hl-type">${escapeHtml(builtinType)}</span>`;
    } else {
      result += escapeHtml(full);
    }
  }

  result += escapeHtml(code.slice(lastIndex));
  return result;
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
 * 2. Inline math: $ ... $ (ignoring currency and escaped \$)
 */
export function processMathInMarkdown(markdown: string): string {
  // Protect code blocks from math extraction
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

  // Replace Inline Math: $...$
  // Standard math invariant: opening $ not followed by space, closing $ not preceded by space
  processed = processed.replace(/(^|[^\$\\\w])\$([^\s\$](?:[^\$\n]*?[^\s\$])?)\$(?!\d)/g, (fullMatch, prefix, math) => {
    // If it looks purely like a number (e.g. $100$), treat as currency
    if (/^\d+(?:\.\d+)?$/.test(math.trim())) {
      return fullMatch;
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
