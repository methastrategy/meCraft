/**
 * @file DocxEngine.ts
 * Native OpenXML (.docx) Parser & Generator for meDocs Studio
 * 100% In-Device Client-Side Processing using JSZip
 */

import JSZip from 'jszip';

export interface DocxMetadata {
  title?: string;
  creator?: string;
  lastModified?: number;
}

const CONTENT_TYPES_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
</Types>`;

const ROOT_RELS_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

const DOCUMENT_RELS_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`;

const STYLES_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:docDefaults>
    <w:rPrDefault>
      <w:rPr>
        <w:rFonts w:ascii="TH Sarabun New" w:hAnsi="TH Sarabun New" w:cs="TH Sarabun New"/>
        <w:sz w:val="32"/>
        <w:szCs w:val="32"/>
        <w:lang w:val="th-TH"/>
      </w:rPr>
    </w:rPrDefault>
    <w:pPrDefault>
      <w:pPr>
        <w:spacing w:line="280" w:lineRule="auto" w:after="120"/>
      </w:pPr>
    </w:pPrDefault>
  </w:docDefaults>
  <w:style w:type="paragraph" w:default="1" w:styleId="Normal">
    <w:name w:val="Normal"/>
    <w:qFormat/>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading1">
    <w:name w:val="heading 1"/>
    <w:basedOn w:val="Normal"/>
    <w:next w:val="Normal"/>
    <w:qFormat/>
    <w:pPr>
      <w:spacing w:before="240" w:after="160"/>
    </w:pPr>
    <w:rPr>
      <w:b/>
      <w:sz w:val="48"/>
      <w:szCs w:val="48"/>
    </w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading2">
    <w:name w:val="heading 2"/>
    <w:basedOn w:val="Normal"/>
    <w:next w:val="Normal"/>
    <w:qFormat/>
    <w:pPr>
      <w:spacing w:before="180" w:after="120"/>
    </w:pPr>
    <w:rPr>
      <w:b/>
      <w:sz w:val="40"/>
      <w:szCs w:val="40"/>
    </w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading3">
    <w:name w:val="heading 3"/>
    <w:basedOn w:val="Normal"/>
    <w:next w:val="Normal"/>
    <w:qFormat/>
    <w:pPr>
      <w:spacing w:before="140" w:after="80"/>
    </w:pPr>
    <w:rPr>
      <w:b/>
      <w:sz w:val="36"/>
      <w:szCs w:val="36"/>
    </w:rPr>
  </w:style>
</w:styles>`;

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Converts rich HTML content (from WYSIWYG paper editor) into standard OpenXML (.docx) bytes
 */
export async function exportHtmlToDocx(
  htmlContent: string,
  metadata: DocxMetadata = {}
): Promise<Uint8Array> {
  const zip = new JSZip();

  // Root relations and content types
  zip.file('[Content_Types].xml', CONTENT_TYPES_XML);
  zip.file('_rels/.rels', ROOT_RELS_XML);

  // Word package
  const word = zip.folder('word')!;
  word.file('_rels/document.xml.rels', DOCUMENT_RELS_XML);
  word.file('styles.xml', STYLES_XML);

  // Build document.xml from HTML
  const bodyXml = convertHtmlToOpenXmlBody(htmlContent);
  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
            xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <w:body>
    ${bodyXml}
    <w:sectPr>
      <w:pgSz w:w="11906" w:h="16838" w:orient="portrait"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"
               w:header="720" w:footer="720" w:gutter="0"/>
      <w:cols w:space="720"/>
      <w:docGrid w:linePitch="360"/>
    </w:sectPr>
  </w:body>
</w:document>`;

  word.file('document.xml', documentXml);

  return await zip.generateAsync({
    type: 'uint8array',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });
}

/**
 * Parses binary .docx data (ArrayBuffer or Uint8Array) into clean HTML for WYSIWYG editing
 */
export async function parseDocxToHtml(data: ArrayBuffer | Uint8Array): Promise<string> {
  const zip = await JSZip.loadAsync(data);
  const docXmlFile = zip.file('word/document.xml');
  if (!docXmlFile) {
    throw new Error('Invalid DOCX package: missing word/document.xml');
  }

  const xmlText = await docXmlFile.async('text');
  return convertOpenXmlToHtml(xmlText);
}

/**
 * Internal converter: HTML -> OpenXML Body
 */
function convertHtmlToOpenXmlBody(html: string): string {
  if (typeof DOMParser !== 'undefined') {
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<div>${html}</div>`, 'text/html');
    return convertDomNodesToOpenXml(doc.body.childNodes);
  }

  // Fallback regex parser for Node / non-browser test environment
  return convertHtmlByRegex(html);
}

function convertDomNodesToOpenXml(nodes: NodeListOf<ChildNode> | ChildNode[]): string {
  const xmlParts: string[] = [];

  for (const node of Array.from(nodes)) {
    if (node.nodeType === 3) {
      // Text node
      const text = node.textContent?.trim();
      if (text) {
        xmlParts.push(`<w:p><w:r><w:t xml:space="preserve">${escapeXml(text)}</w:t></w:r></w:p>`);
      }
      continue;
    }

    if (node.nodeType !== 1) continue;
    const el = node as HTMLElement;
    const tag = el.tagName.toLowerCase();

    if (tag === 'h1' || tag === 'h2' || tag === 'h3') {
      const styleId = tag === 'h1' ? 'Heading1' : tag === 'h2' ? 'Heading2' : 'Heading3';
      const align = el.style.textAlign || el.getAttribute('align') || '';
      const jcXml = align ? `<w:jc w:val="${mapHtmlAlignToOpenXml(align)}"/>` : '';
      const text = el.textContent || '';
      xmlParts.push(`
        <w:p>
          <w:pPr>
            <w:pStyle w:val="${styleId}"/>
            ${jcXml}
          </w:pPr>
          <w:r><w:t xml:space="preserve">${escapeXml(text)}</w:t></w:r>
        </w:p>
      `);
    } else if (tag === 'table') {
      xmlParts.push(convertTableToOpenXml(el));
    } else if (tag === 'ul' || tag === 'ol') {
      const isOrdered = tag === 'ol';
      const items = el.querySelectorAll('li');
      let idx = 1;
      items.forEach(li => {
        const bulletPrefix = isOrdered ? `${idx++}. ` : '• ';
        xmlParts.push(`
          <w:p>
            <w:pPr>
              <w:ind w:left="720" w:hanging="360"/>
            </w:pPr>
            <w:r><w:t xml:space="preserve">${escapeXml(bulletPrefix + (li.textContent || ''))}</w:t></w:r>
          </w:p>
        `);
      });
    } else if (tag === 'div' && el.classList.contains('medoc-paper-page')) {
      // Recurse into page container
      xmlParts.push(convertDomNodesToOpenXml(el.childNodes));
    } else {
      // Default paragraph / block
      const align = el.style.textAlign || el.getAttribute('align') || '';
      const jcXml = align ? `<w:jc w:val="${mapHtmlAlignToOpenXml(align)}"/>` : '';
      const runs = convertInlineNodesToRuns(el);
      xmlParts.push(`
        <w:p>
          ${jcXml ? `<w:pPr>${jcXml}</w:pPr>` : ''}
          ${runs}
        </w:p>
      `);
    }
  }

  return xmlParts.join('\n');
}

function convertInlineNodesToRuns(el: HTMLElement): string {
  const runs: string[] = [];

  for (const child of Array.from(el.childNodes)) {
    if (child.nodeType === 3) {
      const text = child.textContent || '';
      if (text) {
        runs.push(`<w:r><w:t xml:space="preserve">${escapeXml(text)}</w:t></w:r>`);
      }
    } else if (child.nodeType === 1) {
      const cEl = child as HTMLElement;
      const cTag = cEl.tagName.toLowerCase();
      const isBold = cTag === 'b' || cTag === 'strong' || cEl.style.fontWeight === 'bold';
      const isItalic = cTag === 'i' || cTag === 'em' || cEl.style.fontStyle === 'italic';
      const isUnderline = cTag === 'u' || cEl.style.textDecoration?.includes('underline');
      const isStrike = cTag === 's' || cTag === 'strike' || cTag === 'del';
      const text = cEl.textContent || '';

      const rPrParts: string[] = [];
      if (isBold) rPrParts.push('<w:b/>');
      if (isItalic) rPrParts.push('<w:i/>');
      if (isUnderline) rPrParts.push('<w:u w:val="single"/>');
      if (isStrike) rPrParts.push('<w:strike/>');

      const rPrXml = rPrParts.length > 0 ? `<w:rPr>${rPrParts.join('')}</w:rPr>` : '';
      runs.push(`<w:r>${rPrXml}<w:t xml:space="preserve">${escapeXml(text)}</w:t></w:r>`);
    }
  }

  return runs.length > 0 ? runs.join('') : `<w:r><w:t xml:space="preserve">${escapeXml(el.textContent || '')}</w:t></w:r>`;
}

function convertTableToOpenXml(table: HTMLElement): string {
  const rows = table.querySelectorAll('tr');
  const trXmlParts: string[] = [];

  rows.forEach(tr => {
    const cells = tr.querySelectorAll('th, td');
    const tcXmlParts: string[] = [];
    cells.forEach(tc => {
      const text = tc.textContent || '';
      const isHeader = tc.tagName.toLowerCase() === 'th';
      tcXmlParts.push(`
        <w:tc>
          <w:tcPr>
            <w:tcW w:w="2400" w:type="dxa"/>
            ${isHeader ? '<w:shd w:val="clear" w:color="auto" w:fill="F2F4F8"/>' : ''}
          </w:tcPr>
          <w:p>
            ${isHeader ? '<w:pPr><w:jc w:val="center"/></w:pPr>' : ''}
            <w:r>
              ${isHeader ? '<w:rPr><w:b/></w:rPr>' : ''}
              <w:t xml:space="preserve">${escapeXml(text)}</w:t>
            </w:r>
          </w:p>
        </w:tc>
      `);
    });

    trXmlParts.push(`
      <w:tr>
        ${tcXmlParts.join('')}
      </w:tr>
    `);
  });

  return `
    <w:tbl>
      <w:tblPr>
        <w:tblW w:w="9000" w:type="dxa"/>
        <w:tblBorders>
          <w:top w:val="single" w:sz="4" w:space="0" w:color="CCCCCC"/>
          <w:left w:val="single" w:sz="4" w:space="0" w:color="CCCCCC"/>
          <w:bottom w:val="single" w:sz="4" w:space="0" w:color="CCCCCC"/>
          <w:right w:val="single" w:sz="4" w:space="0" w:color="CCCCCC"/>
          <w:insideH w:val="single" w:sz="4" w:space="0" w:color="E0E0E0"/>
          <w:insideV w:val="single" w:sz="4" w:space="0" w:color="E0E0E0"/>
        </w:tblBorders>
      </w:tblPr>
      ${trXmlParts.join('')}
    </w:tbl>
  `;
}

function mapHtmlAlignToOpenXml(align: string): string {
  switch (align.toLowerCase()) {
    case 'center': return 'center';
    case 'right': return 'right';
    case 'justify': return 'both';
    case 'thai':
    case 'distributed': return 'distribute';
    default: return 'left';
  }
}

/**
 * Regex-based converter for Node / non-DOM environments with inline tag support
 */
function convertHtmlByRegex(html: string): string {
  const parts: string[] = [];
  const lines = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/h[1-6]>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Check heading tag
    const hMatch = /^<h([1-3])[^>]*>([\s\S]*?)<\/h\1>/i.exec(trimmed);
    if (hMatch) {
      const level = hMatch[1];
      const styleId = `Heading${level}`;
      const innerRuns = parseInlineHtmlToRuns(hMatch[2]);
      parts.push(`
        <w:p>
          <w:pPr><w:pStyle w:val="${styleId}"/></w:pPr>
          ${innerRuns}
        </w:p>
      `);
      continue;
    }

    const innerRuns = parseInlineHtmlToRuns(trimmed);
    if (innerRuns) {
      parts.push(`<w:p>${innerRuns}</w:p>`);
    }
  }

  return parts.length > 0 ? parts.join('\n') : '<w:p><w:r><w:t></w:t></w:r></w:p>';
}

function parseInlineHtmlToRuns(html: string): string {
  const runs: string[] = [];
  // Tokenize by inline formatting tags: <strong>, <b>, <em>, <i>, <u>, <s>
  const tagRegex = /<(strong|b|em|i|u|del|s)>([\s\S]*?)<\/\1>|([^<]+)/gi;
  let match: RegExpExecArray | null;

  while ((match = tagRegex.exec(html)) !== null) {
    if (match[1]) {
      const tag = match[1].toLowerCase();
      const text = match[2].replace(/<[^>]+>/g, '');
      const rPrParts: string[] = [];
      if (tag === 'strong' || tag === 'b') rPrParts.push('<w:b/>');
      if (tag === 'em' || tag === 'i') rPrParts.push('<w:i/>');
      if (tag === 'u') rPrParts.push('<w:u w:val="single"/>');
      if (tag === 'del' || tag === 's') rPrParts.push('<w:strike/>');

      const rPrXml = rPrParts.length > 0 ? `<w:rPr>${rPrParts.join('')}</w:rPr>` : '';
      runs.push(`<w:r>${rPrXml}<w:t xml:space="preserve">${escapeXml(text)}</w:t></w:r>`);
    } else if (match[3]) {
      const text = match[3];
      runs.push(`<w:r><w:t xml:space="preserve">${escapeXml(text)}</w:t></w:r>`);
    }
  }

  return runs.join('');
}

/**
 * Internal converter: OpenXML XML -> Clean HTML
 */
function convertOpenXmlToHtml(xmlText: string): string {
  const htmlParts: string[] = [];

  // Match paragraphs <w:p ...> ... </w:p>
  const pRegex = /<w:p(?:\s+[^>]*)?>([\s\S]*?)<\/w:p>/g;
  let pMatch: RegExpExecArray | null;

  while ((pMatch = pRegex.exec(xmlText)) !== null) {
    const pContent = pMatch[1];

    // Determine heading style
    let headingLevel = 0;
    const styleMatch = /<w:pStyle\s+w:val="([^"]+)"/i.exec(pContent);
    if (styleMatch) {
      const styleName = styleMatch[1].toLowerCase();
      if (styleName.includes('heading1') || styleName.includes('heading 1')) headingLevel = 1;
      else if (styleName.includes('heading2') || styleName.includes('heading 2')) headingLevel = 2;
      else if (styleName.includes('heading3') || styleName.includes('heading 3')) headingLevel = 3;
    }

    // Determine alignment
    let alignStyle = '';
    const jcMatch = /<w:jc\s+w:val="([^"]+)"/i.exec(pContent);
    if (jcMatch) {
      const jcVal = jcMatch[1].toLowerCase();
      if (jcVal === 'center') alignStyle = ' style="text-align: center;"';
      else if (jcVal === 'right') alignStyle = ' style="text-align: right;"';
      else if (jcVal === 'both') alignStyle = ' style="text-align: justify;"';
      else if (jcVal === 'distribute') alignStyle = ' style="text-align: justify; text-justify: inter-cluster;"';
    }

    // Extract runs <w:r>
    const runRegex = /<w:r(?:\s+[^>]*)?>([\s\S]*?)<\/w:r>/g;
    let runMatch: RegExpExecArray | null;
    let pInnerHtml = '';

    while ((runMatch = runRegex.exec(pContent)) !== null) {
      const runContent = runMatch[1];

      const isBold = /<w:b(?:\s*\/|\s+[^>]*>)/i.test(runContent);
      const isItalic = /<w:i(?:\s*\/|\s+[^>]*>)/i.test(runContent);
      const isUnderline = /<w:u(?:\s*\/|\s+[^>]*>)/i.test(runContent);
      const isStrike = /<w:strike(?:\s*\/|\s+[^>]*>)/i.test(runContent);

      // Extract text <w:t>
      const tRegex = /<w:t(?:\s+[^>]*)?>([^<]*)<\/w:t>/g;
      let tMatch: RegExpExecArray | null;
      let textChunk = '';

      while ((tMatch = tRegex.exec(runContent)) !== null) {
        textChunk += tMatch[1];
      }

      if (!textChunk) continue;

      let formatted = textChunk;
      if (isBold) formatted = `<strong>${formatted}</strong>`;
      if (isItalic) formatted = `<em>${formatted}</em>`;
      if (isUnderline) formatted = `<u>${formatted}</u>`;
      if (isStrike) formatted = `<del>${formatted}</del>`;

      pInnerHtml += formatted;
    }

    if (!pInnerHtml.trim()) {
      htmlParts.push('<p><br></p>');
      continue;
    }

    if (headingLevel > 0) {
      htmlParts.push(`<h${headingLevel}${alignStyle}>${pInnerHtml}</h${headingLevel}>`);
    } else {
      htmlParts.push(`<p${alignStyle}>${pInnerHtml}</p>`);
    }
  }

  // Also extract tables if present
  const tblRegex = /<w:tbl(?:\s+[^>]*)?>([\s\S]*?)<\/w:tbl>/g;
  let tblMatch: RegExpExecArray | null;
  while ((tblMatch = tblRegex.exec(xmlText)) !== null) {
    const tblContent = tblMatch[1];
    const trRegex = /<w:tr(?:\s+[^>]*)?>([\s\S]*?)<\/w:tr>/g;
    let trMatch: RegExpExecArray | null;
    let rowsHtml = '';

    while ((trMatch = trRegex.exec(tblContent)) !== null) {
      const trContent = trMatch[1];
      const tcRegex = /<w:tc(?:\s+[^>]*)?>([\s\S]*?)<\/w:tc>/g;
      let tcMatch: RegExpExecArray | null;
      let cellsHtml = '';

      while ((tcMatch = tcRegex.exec(trContent)) !== null) {
        const tcContent = tcMatch[1];
        // Extract paragraph text in cell
        const cellTextMatch = /<w:t(?:\s+[^>]*)?>([^<]*)<\/w:t>/g;
        let cText = '';
        let ct: RegExpExecArray | null;
        while ((ct = cellTextMatch.exec(tcContent)) !== null) {
          cText += ct[1];
        }
        cellsHtml += `<td>${cText}</td>`;
      }
      rowsHtml += `<tr>${cellsHtml}</tr>`;
    }
    if (rowsHtml) {
      htmlParts.push(`<table class="medoc-table">${rowsHtml}</table>`);
    }
  }

  return htmlParts.join('\n');
}
