import { describe, it, expect } from 'vitest';
import {
  extractHeadings,
  slugify,
  cleanHeadingText,
  generateTocMarkdown,
  buildTocTree,
} from '../src/engines/TocEngine.js';

describe('meDoc Studio — TocEngine', () => {
  describe('slugify & cleanHeadingText', () => {
    it('creates URL friendly slug for standard and mixed titles', () => {
      expect(slugify('1. Executive Summary')).toBe('1-executive-summary');
      expect(slugify('High Performance Computing! & Math')).toBe('high-performance-computing-math');
    });

    it('supports Thai language characters in slugs', () => {
      expect(slugify('บทที่ 1 บทนำ')).toBe('บทท-1-บทนำ');
    });

    it('cleans inline markdown links, bolding, and code markers', () => {
      expect(cleanHeadingText('**Bold Title** with [Link](http://example.com)')).toBe('Bold Title with Link');
      expect(cleanHeadingText('`code` and *italic*')).toBe('code and italic');
    });
  });

  describe('extractHeadings', () => {
    it('extracts H1, H2, H3 headings with correct levels and line numbers', () => {
      const md = `# First H1
Some text
## Second H2
Text
### Third H3`;

      const headings = extractHeadings(md);
      expect(headings).toHaveLength(3);
      expect(headings[0]).toEqual({
        id: 'first-h1',
        text: 'First H1',
        level: 1,
        line: 1,
      });
      expect(headings[1]).toEqual({
        id: 'second-h2',
        text: 'Second H2',
        level: 2,
        line: 3,
      });
      expect(headings[2]).toEqual({
        id: 'third-h3',
        text: 'Third H3',
        level: 3,
        line: 5,
      });
    });

    it('completely ignores headings inside fenced code blocks', () => {
      const md = `# Real Heading
\`\`\`markdown
# Fake Heading in Code
## Another Fake
\`\`\`
## Another Real Heading`;

      const headings = extractHeadings(md);
      expect(headings).toHaveLength(2);
      expect(headings[0].text).toBe('Real Heading');
      expect(headings[1].text).toBe('Another Real Heading');
    });

    it('disambiguates duplicate heading titles with numbered suffixes', () => {
      const md = `## Features
Content
## Features
More content
## Features`;

      const headings = extractHeadings(md);
      expect(headings).toHaveLength(3);
      expect(headings[0].id).toBe('features');
      expect(headings[1].id).toBe('features-1');
      expect(headings[2].id).toBe('features-2');
    });
  });

  describe('generateTocMarkdown & buildTocTree', () => {
    it('generates a formatted markdown list representation of headings', () => {
      const items = [
        { id: 'h1', text: 'H1', level: 1, line: 1 },
        { id: 'h2', text: 'H2', level: 2, line: 3 },
      ];
      const tocMd = generateTocMarkdown(items);
      expect(tocMd).toBe('- [H1](#h1)\n  - [H2](#h2)');
    });

    it('builds a hierarchical tree from flat heading items', () => {
      const items = [
        { id: 'h1', text: 'Section 1', level: 1, line: 1 },
        { id: 'h1-1', text: 'Subsection 1.1', level: 2, line: 5 },
        { id: 'h2', text: 'Section 2', level: 1, line: 10 },
      ];
      const tree = buildTocTree(items);
      expect(tree).toHaveLength(2);
      expect(tree[0].children).toHaveLength(1);
      expect(tree[0].children[0].text).toBe('Subsection 1.1');
      expect(tree[1].text).toBe('Section 2');
      expect(tree[1].children).toHaveLength(0);
    });
  });
});
