import { describe, it, expect } from 'vitest';
import { parseFrontMatter, stringifyFrontMatter } from '../src/engines/FrontMatter.js';

describe('meDoc Studio — FrontMatter', () => {
  it('parses valid YAML front matter with strings, numbers, booleans, and lists', () => {
    const raw = `---
title: System Blueprint
author: Metha
version: 1.0.0
draft: false
rating: 4.8
tags: [markdown, katex, rust]
---

# Document Starts Here
Body text...`;

    const parsed = parseFrontMatter(raw);
    expect(parsed.hasFrontMatter).toBe(true);
    expect(parsed.data.title).toBe('System Blueprint');
    expect(parsed.data.author).toBe('Metha');
    expect(parsed.data.version).toBe('1.0.0');
    expect(parsed.data.draft).toBe(false);
    expect(parsed.data.rating).toBe(4.8);
    expect(parsed.data.tags).toEqual(['markdown', 'katex', 'rust']);
    expect(parsed.content.trim()).toBe('# Document Starts Here\nBody text...');
  });

  it('parses multi-line lists in front matter correctly', () => {
    const raw = `---
categories:
  - Documentation
  - Engineering
---
Content here`;

    const parsed = parseFrontMatter(raw);
    expect(parsed.hasFrontMatter).toBe(true);
    expect(parsed.data.categories).toEqual(['Documentation', 'Engineering']);
  });

  it('returns hasFrontMatter=false when markdown lacks front matter delimiters', () => {
    const raw = '# Title Without Front Matter\nJust standard markdown.';
    const parsed = parseFrontMatter(raw);
    expect(parsed.hasFrontMatter).toBe(false);
    expect(parsed.data).toEqual({});
    expect(parsed.content).toBe(raw);
  });

  it('handles null, undefined, or empty markdown gracefully', () => {
    const parsed = parseFrontMatter('');
    expect(parsed.hasFrontMatter).toBe(false);
    expect(parsed.content).toBe('');
  });

  it('stringifies metadata object and content into YAML front matter string', () => {
    const data = {
      title: 'Guide',
      pages: 12,
      tags: ['alpha', 'beta'],
    };
    const content = '# Body Text';
    const output = stringifyFrontMatter(data, content);
    expect(output).toContain('---');
    expect(output).toContain('title: Guide');
    expect(output).toContain('pages: 12');
    expect(output).toContain('tags:');
    expect(output).toContain('# Body Text');
  });

  it('preserves roundtrip parsing and stringification', () => {
    const original = `---
title: Roundtrip Document
author: Test Author
tags:
  - test1
  - test2
---

# Content`;

    const parsed = parseFrontMatter(original);
    const serialized = stringifyFrontMatter(parsed.data, parsed.content.trim());
    const reParsed = parseFrontMatter(serialized);

    expect(reParsed.data.title).toBe(parsed.data.title);
    expect(reParsed.data.author).toBe(parsed.data.author);
    expect(reParsed.data.tags).toEqual(parsed.data.tags);
    expect(reParsed.content.trim()).toBe(parsed.content.trim());
  });
});
