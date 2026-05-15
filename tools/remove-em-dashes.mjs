// Replace " — " (em-dash with spaces) with " : " across the site
// Skips blog articles (client did not request changes there)
// Skips line-starting em-dashes (citations like "— Client vérifié")

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.argv[2];
if (!ROOT) {
  console.error('Usage: node remove-em-dashes.mjs <root>');
  process.exit(1);
}

const SKIP_DIRS = new Set(['blog', 'node_modules', 'dist', '.astro']);
const EXTENSIONS = new Set(['.astro', '.md', '.ts', '.mjs', '.json', '.yml', '.css', '.html']);

let totalChanges = 0;
let filesChanged = 0;

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
    } else if (EXTENSIONS.has(path.extname(entry.name))) {
      processFile(full);
    }
  }
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  if (!content.includes('—')) return;

  const lines = content.split(/(\r?\n)/);
  let changed = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.includes('—')) continue;

    // Skip lines that start with "— " (citation prefix)
    if (/^[\s>]*— /.test(line)) continue;

    // Replace " — " with " : " inside the line
    const newLine = line.replace(/ — /g, ' : ');
    if (newLine !== line) {
      changed += (line.match(/ — /g) || []).length;
      lines[i] = newLine;
    }
  }

  if (changed > 0) {
    const newContent = lines.join('');
    fs.writeFileSync(filePath, newContent, 'utf-8');
    console.log(`  ${changed} replacement(s) in ${path.relative(ROOT, filePath)}`);
    totalChanges += changed;
    filesChanged++;
  }
}

walk(ROOT);
console.log(`\nDone. ${totalChanges} replacement(s) in ${filesChanged} file(s).`);
