import { describe, it, expect } from 'vitest';
import {
  renderMarkdown,
  processMathInMarkdown,
  renderMathExpression,
  highlightCode,
  computeDocumentStats,
  escapeHtml,
} from '../src/engines/MarkdownEngine.js';

describe('meDoc Studio — MarkdownEngine', () => {
  describe('HTML Escaping & Syntax Highlighting', () => {
    it('escapes HTML characters correctly', () => {
      const raw = '<div>"Hello" & \'World\' < 10</div>';
      const escaped = escapeHtml(raw);
      expect(escaped).toBe('&lt;div&gt;&quot;Hello&quot; &amp; &#39;World&#39; &lt; 10&lt;/div&gt;');
    });

    it('highlights keywords, strings, comments and numbers in code', () => {
      const code = 'const count = 42; // number of items\nreturn "success";';
      const highlighted = highlightCode(code, 'typescript');
      expect(highlighted).toContain('<span class="hl-keyword">const</span>');
      expect(highlighted).toContain('<span class="hl-number">42</span>');
      expect(highlighted).toContain('<span class="hl-comment">// number of items</span>');
      expect(highlighted).toContain('<span class="hl-keyword">return</span>');
      expect(highlighted).toContain('<span class="hl-string">&quot;success&quot;</span>');
    });

    it('returns escaped plain text when language is unknown or text', () => {
      const plain = 'Just plain text without syntax';
      expect(highlightCode(plain, 'text')).toBe(plain);
    });
  });

  describe('KaTeX Mathematical Typography', () => {
    it('renders inline math with katex classes', () => {
      const inlineMath = renderMathExpression('E = mc^2', false);
      expect(inlineMath).toContain('katex');
      expect(inlineMath).toContain('mord');
    });

    it('renders display block math with displayMode=true', () => {
      const displayMath = renderMathExpression('\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}', true);
      expect(displayMath).toContain('katex-display');
    });

    it('processes display math in markdown into container divs', () => {
      const md = '# Title\n\n$$\\frac{a}{b}$$\n\nEnd.';
      const processed = processMathInMarkdown(md);
      expect(processed).toContain('class="medoc-math-display"');
    });

    it('processes inline math into inline spans while ignoring currency', () => {
      const md = 'The price is $100 and formula is $x + y = z$.';
      const processed = processMathInMarkdown(md);
      expect(processed).toContain('$100');
      expect(processed).toContain('class="medoc-math-inline"');
    });

    it('protects code blocks from accidental math replacement', () => {
      const md = '```\nconst $a = 1;\nconst $b = 2;\n```';
      const processed = processMathInMarkdown(md);
      expect(processed).toContain('const $a = 1;');
    });
  });

  describe('Markdown Parsing & Integration', () => {
    it('renders headings, paragraphs, and lists into semantic HTML', async () => {
      const md = '# Main Title\n\nParagraph text.\n\n- Item 1\n- Item 2';
      const html = await renderMarkdown(md);
      expect(html).toContain('Main Title</h1>');
      expect(html).toContain('<p>Paragraph text.</p>');
      expect(html).toContain('<li>Item 1</li>');
    });

    it('renders tables with wrapper and custom styling classes', async () => {
      const tableMd = '| Head 1 | Head 2 |\n| --- | --- |\n| Cell 1 | Cell 2 |';
      const html = await renderMarkdown(tableMd);
      expect(html).toContain('class="medoc-table-wrapper"');
      expect(html).toContain('class="medoc-table"');
    });

    it('renders blockquotes with medoc-quote class', async () => {
      const quoteMd = '> Important note here.';
      const html = await renderMarkdown(quoteMd);
      expect(html).toContain('class="medoc-quote"');
    });

    it('renders mermaid code blocks into diagram containers', async () => {
      const mermaidMd = '```mermaid\ngraph TD\n  A --> B\n```';
      const html = await renderMarkdown(mermaidMd);
      expect(html).toContain('class="mermaid-container"');
      expect(html).toContain('class="mermaid"');
    });
  });

  describe('Telemetry & Stats Computation', () => {
    it('computes word count, character count, lines, and reading time', () => {
      const text = '# Chapter 1\n\nThis is a sample document for testing word telemetry.\nLine 3 here.';
      const stats = computeDocumentStats(text);
      expect(stats.words).toBeGreaterThan(5);
      expect(stats.lines).toBe(4);
      expect(stats.characters).toBe(text.length);
      expect(stats.readingTimeMinutes).toBeGreaterThanOrEqual(1);
    });

    it('computes word count accurately for mixed Thai and Latin text using Intl.Segmenter', () => {
      // "สวัสดีครับชาวไทยทุกคน" contains 6 segmented Thai words
      const thaiText = 'สวัสดีครับชาวไทยทุกคน Hello World';
      const stats = computeDocumentStats(thaiText);
      expect(stats.words).toBe(8); // 6 Thai words + 2 English words
    });

    it('returns 0 for empty or whitespace-only documents', () => {
      const stats = computeDocumentStats('   \n  \t ');
      expect(stats.words).toBe(0);
      expect(stats.lines).toBe(0);
      expect(stats.readingTimeMinutes).toBe(0);
    });
  });

  describe('XSS Defense & HTML Sanitization', () => {
    it('strips malicious script tags, iframes, and inline event handlers from rendered markdown', async () => {
      const maliciousMd = '# Safe Heading\n\n<script>alert("hacked")</script>\n\n<img src="x" onerror="stealCookies()">\n\n[Click me](javascript:evil())';
      const rendered = await renderMarkdown(maliciousMd);

      expect(rendered).toContain('Safe Heading');
      expect(rendered).not.toContain('<script>');
      expect(rendered).not.toContain('alert("hacked")');
      expect(rendered).not.toContain('onerror=');
      expect(rendered).not.toContain('javascript:');
    });
  });
});
