// Extract text + structure from a .docx file (already unzipped) into markdown
// Usage: node docx-to-md.mjs <path-to-document.xml>

import fs from 'node:fs';

const xmlPath = process.argv[2];
if (!xmlPath) {
  console.error('Usage: node docx-to-md.mjs <path-to-document.xml>');
  process.exit(1);
}

const xml = fs.readFileSync(xmlPath, 'utf-8');

const decode = (s) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");

// Extract each <w:p> ... </w:p> in order, capturing style + runs
const paragraphs = [];
const pRegex = /<w:p\b[^>]*>([\s\S]*?)<\/w:p>/g;
let m;
while ((m = pRegex.exec(xml)) !== null) {
  const inner = m[1];

  // Paragraph style
  const styleMatch = inner.match(/<w:pStyle w:val="([^"]+)"/);
  const style = styleMatch ? styleMatch[1] : null;

  // List detection: <w:numPr> means part of a list
  const isList = /<w:numPr\b/.test(inner);

  // Extract runs (each <w:r>) preserving bold/italic
  const runRegex = /<w:r\b[^>]*>([\s\S]*?)<\/w:r>/g;
  let rm;
  let parts = [];
  while ((rm = runRegex.exec(inner)) !== null) {
    const runInner = rm[1];
    const isBold = /<w:b\s*\/>|<w:b\s+w:val="(?:1|true)"\s*\/?>/.test(runInner);
    const isItalic = /<w:i\s*\/>|<w:i\s+w:val="(?:1|true)"\s*\/?>/.test(runInner);

    const tRegex = /<w:t[^>]*>([\s\S]*?)<\/w:t>/g;
    let tm;
    let runText = '';
    while ((tm = tRegex.exec(runInner)) !== null) {
      runText += tm[1];
    }
    runText = decode(runText);

    // Detect line breaks <w:br/>
    if (/<w:br\b/.test(runInner) && !runText) {
      parts.push('\n');
      continue;
    }

    if (!runText) continue;

    if (isBold && isItalic) parts.push(`***${runText}***`);
    else if (isBold) parts.push(`**${runText}**`);
    else if (isItalic) parts.push(`*${runText}*`);
    else parts.push(runText);
  }

  const text = parts.join('').trim();

  paragraphs.push({ style, isList, text });
}

// Now convert to markdown
const lines = [];
let prevWasList = false;

for (const p of paragraphs) {
  if (!p.text) {
    if (!prevWasList) lines.push('');
    prevWasList = false;
    continue;
  }

  const styleLower = (p.style || '').toLowerCase();

  if (/heading1|titre1|^title$/.test(styleLower)) {
    lines.push('');
    lines.push(`# ${p.text}`);
    lines.push('');
  } else if (/heading2|titre2/.test(styleLower)) {
    lines.push('');
    lines.push(`## ${p.text}`);
    lines.push('');
  } else if (/heading3|titre3/.test(styleLower)) {
    lines.push('');
    lines.push(`### ${p.text}`);
    lines.push('');
  } else if (/heading4|titre4/.test(styleLower)) {
    lines.push('');
    lines.push(`#### ${p.text}`);
    lines.push('');
  } else if (p.isList) {
    lines.push(`- ${p.text}`);
    prevWasList = true;
    continue;
  } else {
    lines.push(p.text);
    lines.push('');
  }
  prevWasList = false;
}

// Collapse multiple blank lines
const md = lines
  .join('\n')
  .replace(/\n{3,}/g, '\n\n')
  .trim();

process.stdout.write(md + '\n');
