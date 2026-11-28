/**
 * @file TocEngine.ts
 * meDocs Studio — Table of Contents Extraction & Anchor Slug Engine
 * Zero-dependency In-Device Engine
 */

export interface TocItem {
  id: string;
  text: string;
  level: number;
  line: number;
}

export interface TocTreeNode extends TocItem {
  children: TocTreeNode[];
}

/**
 * Generates URL-friendly slug from heading text
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s\u0E00-\u0E7F-]/g, '') // Keep alphanumeric, Thai Unicode range, and hyphens
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Strips markdown inline markup from heading text
 */
export function cleanHeadingText(raw: string): string {
  return raw
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // [link](url) -> link
    .replace(/[*_~`]/g, '') // formatting symbols
    .trim();
}

/**
 * Extracts all headings (# H1 through ###### H6) from markdown source
 * Correctly skips headings inside fenced code blocks
 */
export function extractHeadings(markdown: string): TocItem[] {
  if (!markdown || typeof markdown !== 'string') {
    return [];
  }

  const lines = markdown.split(/\r?\n/);
  const items: TocItem[] = [];
  const slugCounts: Record<string, number> = {};

  let insideCodeBlock = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Toggle fenced code block
    if (trimmed.startsWith('```') || trimmed.startsWith('~~~')) {
      insideCodeBlock = !insideCodeBlock;
      continue;
    }

    if (insideCodeBlock) {
      continue;
    }

    // Match ATX heading (# H1 .. ###### H6)
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const rawText = match[2].trim();
      const text = cleanHeadingText(rawText);

      if (!text) continue;

      let baseSlug = slugify(text) || `heading-${items.length + 1}`;
      let finalSlug = baseSlug;

      if (slugCounts[baseSlug] !== undefined) {
        slugCounts[baseSlug]++;
        finalSlug = `${baseSlug}-${slugCounts[baseSlug]}`;
      } else {
        slugCounts[baseSlug] = 0;
      }

      items.push({
        id: finalSlug,
        text,
        level,
        line: i + 1,
      });
    }
  }

  return items;
}

/**
 * Formats extracted TOC items into Markdown list format
 */
export function generateTocMarkdown(items: TocItem[], maxLevel: number = 3): string {
  const filtered = items.filter(item => item.level <= maxLevel);
  if (filtered.length === 0) return '';

  const minLevel = Math.min(...filtered.map(i => i.level));

  return filtered.map(item => {
    const indent = '  '.repeat(Math.max(0, item.level - minLevel));
    return `${indent}- [${item.text}](#${item.id})`;
  }).join('\n');
}

/**
 * Builds a nested tree structure for hierarchical sidebar rendering
 */
export function buildTocTree(items: TocItem[]): TocTreeNode[] {
  const root: TocTreeNode[] = [];
  const stack: { node: TocTreeNode; level: number }[] = [];

  for (const item of items) {
    const treeNode: TocTreeNode = { ...item, children: [] };

    while (stack.length > 0 && stack[stack.length - 1].level >= item.level) {
      stack.pop();
    }

    if (stack.length === 0) {
      root.push(treeNode);
    } else {
      stack[stack.length - 1].node.children.push(treeNode);
    }

    stack.push({ node: treeNode, level: item.level });
  }

  return root;
}
