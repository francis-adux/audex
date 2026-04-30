// Batch convert docx files into Astro blog markdown entries
// Usage: node tools/process-articles.mjs <source-folder> <output-folder>

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import os from 'node:os';

const SRC_DIR = process.argv[2];
const OUT_DIR = process.argv[3];

if (!SRC_DIR || !OUT_DIR) {
  console.error('Usage: node tools/process-articles.mjs <src> <out>');
  process.exit(1);
}

// ----- Tag mapping (more precise) -----
const tagRules = [
  { match: /testament|d[ée]volution|liquidateur|h[ée]ritage|succession/i, tags: ['Droit civil', 'Succession'] },
  { match: /m[ée]diation/i, tags: ['Droit familial', 'Médiation'] },
  { match: /\bs[ée]paration de corps|\bs[ée]paration\b|garde d['’]enfants?|conjoint(?: de fait)?|union (?:civile|de fait)|patrimoine familial|copropri[ée]t[ée]\s+(?:indivise|en copropri)|sauvegarde|divorce/i, tags: ['Droit familial'] },
  { match: /mens rea|actus reus|infraction|criminel|p[ée]nal\b|m[ée]fait|intoxication|l[ée]gitime d[ée]fense|huis[\s-]?clos|d[ée]tention provisoire|arrestation|mise en libert[ée]|complice|preuve criminelle|proc[èe]s criminel|stade.*criminel|procureur|culpabilit[ée]/i, tags: ['Droit criminel'] },
  { match: /\bvente immobili[èe]re|promesse d['’]achat|vices? cach[ée]s?\b/i, tags: ['Droit civil', 'Immobilier'] },
  { match: /garde en [ée]tablissement|hospitalisation forc[ée]e|psychiatrique/i, tags: ['Droit civil', 'Santé'] },
  { match: /ordre public/i, tags: ['Droit civil'] },
  { match: /crimes? [ée]conomiques?|fraude|fausses repr[ée]sentations|recel|blanchiment/i, tags: ['Droit criminel', 'Crimes économiques'] },
];

function autoTags(title, content) {
  const blob = (title + ' ' + content).toLowerCase();
  const found = new Set();
  for (const rule of tagRules) {
    if (rule.match.test(blob)) {
      for (const t of rule.tags) found.add(t);
    }
  }
  // Limit to 3 most relevant tags max
  const arr = Array.from(found);
  if (arr.length === 0) arr.push('Droit');
  return arr.slice(0, 3);
}

// ----- Slug helpers -----
function slugify(s) {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[''’]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

function normalizeForCompare(s) {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[*:.\-—]/g, '')
    .replace(/[''’]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// ----- Date parsing -----
function parseDateFromFilename(filename) {
  const m = filename.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  return null;
}

// ----- Extract docx text + structure -----
function extractDocx(docxPath) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'docx-'));
  try {
    execSync(`unzip -o "${docxPath}" word/document.xml -d "${tmpDir}"`, { stdio: 'pipe' });
  } catch (e) {
    throw new Error(`Failed to unzip ${docxPath}: ${e.message}`);
  }
  const xml = fs.readFileSync(path.join(tmpDir, 'word', 'document.xml'), 'utf-8');
  fs.rmSync(tmpDir, { recursive: true, force: true });
  return xml;
}

const decode = (s) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");

function xmlToMarkdown(xml) {
  const paragraphs = [];
  const pRegex = /<w:p\b[^>]*>([\s\S]*?)<\/w:p>/g;
  let m;
  while ((m = pRegex.exec(xml)) !== null) {
    const inner = m[1];
    const styleMatch = inner.match(/<w:pStyle w:val="([^"]+)"/);
    const style = styleMatch ? styleMatch[1] : null;
    const isList = /<w:numPr\b/.test(inner);

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
      if (!runText) continue;

      if (isBold && isItalic) parts.push({ kind: 'bi', text: runText });
      else if (isBold) parts.push({ kind: 'b', text: runText });
      else if (isItalic) parts.push({ kind: 'i', text: runText });
      else parts.push({ kind: 'p', text: runText });
    }

    const merged = [];
    for (const part of parts) {
      const last = merged[merged.length - 1];
      if (last && last.kind === part.kind) {
        last.text += part.text;
      } else {
        merged.push({ ...part });
      }
    }

    const text = merged
      .map((p) => {
        const t = p.text.replace(/\s+/g, ' ');
        if (p.kind === 'bi') return `***${t.trim()}***`;
        if (p.kind === 'b') return `**${t.trim()}**`;
        if (p.kind === 'i') return `*${t.trim()}*`;
        return t;
      })
      .join(' ')
      .replace(/\s+/g, ' ')
      .replace(/\*\*\s*\*\*/g, '')
      .replace(/\*\s*\*/g, '')
      .trim();

    paragraphs.push({ style, isList, text, isAllBold: merged.length > 0 && merged.every((p) => p.kind === 'b' || p.kind === 'bi') });
  }

  const lines = [];
  for (const p of paragraphs) {
    if (!p.text) continue;

    const styleLower = (p.style || '').toLowerCase();

    if (/heading1|titre1|^title$/.test(styleLower)) {
      lines.push('', `# ${stripFormatting(p.text)}`, '');
    } else if (/heading2|titre2/.test(styleLower)) {
      lines.push('', `## ${stripFormatting(p.text)}`, '');
    } else if (/heading3|titre3/.test(styleLower)) {
      lines.push('', `### ${stripFormatting(p.text)}`, '');
    } else if (/heading4|titre4/.test(styleLower)) {
      lines.push('', `#### ${stripFormatting(p.text)}`, '');
    } else if (p.isList) {
      lines.push(`- ${p.text}`);
    } else {
      // Promote short bold paragraphs to H2 (they are likely sub-headings)
      if (p.isAllBold && p.text.length < 100) {
        lines.push('', `## ${stripFormatting(p.text)}`, '');
      } else if (/^\*\*[^*]+\*\*[\s:.]*$/.test(p.text) && p.text.length < 100) {
        const stripped = p.text.replace(/^\*\*|\*\*[\s:.]*$/g, '').trim();
        lines.push('', `## ${stripped}`, '');
      } else {
        lines.push(p.text, '');
      }
    }
  }

  return lines
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function stripFormatting(s) {
  return s.replace(/\*+/g, '').replace(/^[\s:]+|[\s:.]+$/g, '').trim();
}

// ----- Extract title + description -----
function extractTitleAndDescription(markdown, fallbackTitle) {
  const lines = markdown.split('\n').map((l) => l.trim());

  let title = null;
  let titleIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (/^#{1,2}\s+/.test(l)) {
      title = l.replace(/^#{1,2}\s+/, '').trim();
      titleIdx = i;
      break;
    }
  }

  if (!title) title = fallbackTitle;

  // Find first meaningful paragraph that isn't the title
  const titleNorm = title ? normalizeForCompare(title) : '';
  let description = '';
  for (let i = titleIdx + 1; i < lines.length; i++) {
    const l = lines[i];
    if (!l) continue;
    if (/^#{1,4}\s+/.test(l)) continue;
    if (l.startsWith('-') || l.startsWith('>')) continue;

    const cleaned = l
      .replace(/\*+/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .trim();

    // Skip if this looks like the title repeated
    if (titleNorm && normalizeForCompare(cleaned) === titleNorm) continue;
    // Skip very short lines (probably sub-titles)
    if (cleaned.length < 60) continue;

    description = cleaned;
    if (description.length > 200) {
      // Cut at the last full sentence that fits
      const cut = description.slice(0, 200);
      const lastDot = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('? '), cut.lastIndexOf('! '));
      description = lastDot > 100 ? cut.slice(0, lastDot + 1) : cut.replace(/\s+\S+$/, '') + '...';
    }
    break;
  }

  return { title, description };
}

// ----- Convert any "Avis : ..." paragraph into a blockquote -----
function applyLegalNotice(markdown) {
  // Match any line that starts (after optional bold/space) with "Avis :"
  // and convert the entire line into a blockquote
  return markdown.replace(/^(?:\*{0,2}\s*)Avis\s*:\s*([^\n]+?)(?:\*{0,2})\s*$/gm, (_match, content) => {
    const cleaned = content.replace(/\*+/g, '').trim();
    return `\n---\n\n> **Avis : ${cleaned}**\n`;
  });
}

// ----- Process a single docx -----
function processFile(filePath) {
  const filename = path.basename(filePath);

  // Compute fallback title from filename
  let fallbackTitle = filename
    .replace(/\.docx$/i, '')
    .replace(/^\d{4}-\d{2}-\d{2}\s*-?\s*/, '')
    .replace(/^Projet d['’]article sur\s+/i, '')
    .replace(/^Texte informatif sur\s+/i, '')
    .trim();
  fallbackTitle = fallbackTitle.charAt(0).toUpperCase() + fallbackTitle.slice(1);

  const xml = extractDocx(filePath);
  let markdown = xmlToMarkdown(xml);

  const { title: extractedTitle, description: extractedDescription } = extractTitleAndDescription(
    markdown,
    fallbackTitle
  );

  // Final title cleanup
  let title = (extractedTitle || fallbackTitle)
    .replace(/^Projet d['’]article sur\s+/i, '')
    .replace(/^Texte informatif sur\s+/i, '')
    .replace(/[\s:]+$/, '')
    .trim();

  // Date
  let date = parseDateFromFilename(filename);
  if (!date) {
    const stats = fs.statSync(filePath);
    const d = stats.mtime;
    date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  // Description
  const description =
    extractedDescription ||
    `Article juridique d'AUDEX Avocats sur le sujet « ${title} ».`;

  // Tags
  const tags = autoTags(title, markdown);

  // Slug
  const slug = `${date}-${slugify(title)}`;

  // Strip duplicate title from body (heading or first plain paragraph)
  const titleNorm = normalizeForCompare(title);
  const bodyLines = markdown.split('\n');
  for (let i = 0; i < Math.min(bodyLines.length, 8); i++) {
    const l = bodyLines[i].trim();
    if (!l) continue;

    // Heading that matches the title
    if (/^#{1,2}\s+/.test(l)) {
      const cleaned = l.replace(/^#{1,2}\s+/, '').trim();
      if (normalizeForCompare(cleaned) === titleNorm) {
        bodyLines.splice(i, 1);
        if (bodyLines[i] === '') bodyLines.splice(i, 1);
        i--;
      }
      continue;
    }

    // Plain paragraph that matches the title
    const cleaned = l.replace(/\*+/g, '').replace(/[\s:.]+$/, '').trim();
    if (normalizeForCompare(cleaned) === titleNorm) {
      bodyLines.splice(i, 1);
      if (bodyLines[i] === '') bodyLines.splice(i, 1);
      i--;
      continue;
    }

    // Stop after first non-title content
    if (l.length > 30 && normalizeForCompare(cleaned) !== titleNorm) break;
  }

  let body = bodyLines.join('\n').trim();

  // Convert legal notice to blockquote
  body = applyLegalNotice(body);

  // Build frontmatter
  const fm =
    `---\n` +
    `title: ${JSON.stringify(title)}\n` +
    `description: ${JSON.stringify(description)}\n` +
    `publishDate: ${date}\n` +
    `author: "Équipe AUDEX"\n` +
    `tags: ${JSON.stringify(tags)}\n` +
    `draft: false\n` +
    `---\n\n`;

  const out = fm + body + '\n';
  const outPath = path.join(OUT_DIR, `${slug}.md`);
  fs.writeFileSync(outPath, out, 'utf-8');

  return { slug, title, date, tags, outPath };
}

// ----- Main -----
const files = [];
function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.name.startsWith('~$')) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full);
    else if (e.name.toLowerCase().endsWith('.docx')) files.push(full);
  }
}
walk(SRC_DIR);

console.log(`Found ${files.length} .docx files`);
fs.mkdirSync(OUT_DIR, { recursive: true });

const results = [];
for (const file of files) {
  try {
    const r = processFile(file);
    console.log(`✓ ${r.slug}`);
    console.log(`    Title: ${r.title}`);
    console.log(`    Tags: ${r.tags.join(', ')}`);
    results.push(r);
  } catch (e) {
    console.error(`✗ Failed: ${file}`);
    console.error(`  ${e.message}`);
  }
}

console.log(`\nDone. ${results.length}/${files.length} articles processed.`);
