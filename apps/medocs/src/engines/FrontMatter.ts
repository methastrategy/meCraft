/**
 * @file FrontMatter.ts
 * meDocs Studio — Fast, Lightweight YAML Front Matter Parser & Stringifier
 * Zero-dependency In-Device Engine
 */

export interface ParsedDocument<T = Record<string, any>> {
  data: T;
  content: string;
  hasFrontMatter: boolean;
}

/**
 * Parses a simple YAML scalar value
 */
function parseYamlValue(rawVal: string): any {
  const val = rawVal.trim();

  // Boolean
  if (val.toLowerCase() === 'true') return true;
  if (val.toLowerCase() === 'false') return false;

  // Null
  if (val.toLowerCase() === 'null' || val === '~') return null;

  // Numbers
  if (/^-?\d+$/.test(val)) return parseInt(val, 10);
  if (/^-?\d+\.\d+$/.test(val)) return parseFloat(val);

  // Quoted string
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    return val.slice(1, -1);
  }

  // Inline array: [item1, item2, item3]
  if (val.startsWith('[') && val.endsWith(']')) {
    const inner = val.slice(1, -1).trim();
    if (!inner) return [];
    return inner.split(',').map(s => parseYamlValue(s.trim()));
  }

  return val;
}

/**
 * Parses Markdown document front matter
 */
export function parseFrontMatter<T = Record<string, any>>(markdown: string): ParsedDocument<T> {
  if (!markdown || typeof markdown !== 'string') {
    return { data: {} as T, content: '', hasFrontMatter: false };
  }

  const trimmed = markdown.trimStart();
  if (!trimmed.startsWith('---')) {
    return { data: {} as T, content: markdown, hasFrontMatter: false };
  }

  // Find closing ---
  const match = trimmed.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    return { data: {} as T, content: markdown, hasFrontMatter: false };
  }

  const rawYaml = match[1];
  const content = match[2];
  const data: Record<string, any> = {};

  const lines = rawYaml.split(/\r?\n/);
  let currentListKey: string | null = null;

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith('#')) {
      continue;
    }

    // Check for list item: - value
    if (trimmedLine.startsWith('- ') && currentListKey) {
      const itemVal = parseYamlValue(trimmedLine.slice(2));
      if (Array.isArray(data[currentListKey])) {
        data[currentListKey].push(itemVal);
      }
      continue;
    }

    // Key-value pair: key: value
    const colonIdx = trimmedLine.indexOf(':');
    if (colonIdx !== -1) {
      const key = trimmedLine.slice(0, colonIdx).trim();
      const rawVal = trimmedLine.slice(colonIdx + 1).trim();

      if (rawVal === '') {
        // Might be beginning of a multi-line list
        data[key] = [];
        currentListKey = key;
      } else {
        data[key] = parseYamlValue(rawVal);
        currentListKey = null;
      }
    }
  }

  return {
    data: data as T,
    content,
    hasFrontMatter: true,
  };
}

/**
 * Serializes data object and markdown content back into YAML front matter document
 */
export function stringifyFrontMatter(data: Record<string, any>, content: string): string {
  const keys = Object.keys(data || {});
  if (keys.length === 0) {
    return content;
  }

  const lines: string[] = ['---'];

  for (const key of keys) {
    const val = data[key];
    if (val === undefined) continue;

    if (Array.isArray(val)) {
      if (val.length === 0) {
        lines.push(`${key}: []`);
      } else {
        lines.push(`${key}:`);
        for (const item of val) {
          lines.push(`  - ${typeof item === 'string' && (item.includes(':') || item.includes(' ')) ? `"${item}"` : item}`);
        }
      }
    } else if (typeof val === 'string') {
      if (val.includes('\n') || val.includes(':') || val.includes('"')) {
        lines.push(`${key}: "${val.replace(/"/g, '\\"')}"`);
      } else {
        lines.push(`${key}: ${val}`);
      }
    } else {
      lines.push(`${key}: ${val}`);
    }
  }

  lines.push('---');
  lines.push('');
  lines.push(content);

  return lines.join('\n');
}
