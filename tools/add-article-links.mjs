// Add an in-text link to the relevant service page in each blog article
// Inserts the link sentence at the end of the first non-empty content paragraph

import fs from 'node:fs';
import path from 'node:path';

const ARTICLES_DIR = process.argv[2];
if (!ARTICLES_DIR) {
  console.error('Usage: node add-article-links.mjs <articles-dir>');
  process.exit(1);
}

// Map tag → { url, name }
const TAG_TO_SERVICE = {
  'Droit familial': { url: '/services/droit-familial', name: 'droit familial' },
  Médiation: { url: '/services/mediation-familiale', name: 'médiation familiale' },
  'Droit civil': { url: '/services/droit-civil-general', name: 'droit civil général' },
  'Droit commercial': { url: '/services/droit-commercial', name: 'droit commercial' },
  'Droit criminel': { url: '/services/droit-criminel-penal', name: 'droit criminel et pénal' },
  'Crimes économiques': { url: '/services/droit-criminel-penal', name: 'droit criminel et pénal' },
  'Droit administratif': { url: '/services/droit-administratif', name: 'droit administratif' },
  'Droit municipal': { url: '/services/droit-municipal', name: 'droit municipal' },
  'Droit du travail': { url: '/services/droit-emploi-travail', name: 'droit du travail' },
  Succession: { url: '/services/droit-civil-general', name: 'droit civil général' },
  Immobilier: { url: '/services/droit-civil-general', name: 'droit civil général' },
  Santé: { url: '/services/droit-civil-general', name: 'droit civil général' },
};

// Articles I've already manually enriched, do not double-link
const ALREADY_ENRICHED = new Set([
  '2024-04-11-les-regles-de-la-devolution-legale-et-limportance-davoir-un-testament.md',
  '2024-03-27-lordre-public.md',
  '2024-08-07-les-crimes-dintentions-generales-et-specifiques.md',
  '2024-08-29-la-legitime-defense.md',
  '2024-09-05-le-huis-clos.md',
]);

function getServiceForTags(tags) {
  for (const tag of tags) {
    if (TAG_TO_SERVICE[tag]) return TAG_TO_SERVICE[tag];
  }
  return null;
}

function parseFrontmatter(raw) {
  // Normalize line endings
  const normalized = raw.replace(/\r\n/g, '\n');
  const m = normalized.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) return null;
  const fm = m[1];
  const body = m[2];
  const tagsMatch = fm.match(/^tags:\s*(\[.*\])/m);
  const tags = tagsMatch ? JSON.parse(tagsMatch[1].replace(/'/g, '"')) : [];
  return { fm, body, tags };
}

let modified = 0;
for (const file of fs.readdirSync(ARTICLES_DIR)) {
  if (!file.endsWith('.md')) continue;
  if (ALREADY_ENRICHED.has(file)) {
    console.log(`  skip (already enriched): ${file}`);
    continue;
  }

  const full = path.join(ARTICLES_DIR, file);
  const raw = fs.readFileSync(full, 'utf-8');
  const parsed = parseFrontmatter(raw);
  if (!parsed) {
    console.log(`  skip (no frontmatter): ${file}`);
    continue;
  }

  const service = getServiceForTags(parsed.tags);
  if (!service) {
    console.log(`  skip (no tag match): ${file}`);
    continue;
  }

  // Already contains a link to the service page?
  if (parsed.body.includes(service.url)) {
    console.log(`  skip (already linked to ${service.url}): ${file}`);
    continue;
  }

  // Find first non-empty content paragraph (not a heading, not a list item)
  const lines = parsed.body.split('\n');
  let targetIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    if (line.startsWith('#')) continue;
    if (line.startsWith('-') || line.startsWith('>')) continue;
    if (line.startsWith('*') && line.endsWith('*') && !line.includes(' ')) continue;
    targetIdx = i;
    break;
  }

  if (targetIdx === -1) {
    console.log(`  skip (no target paragraph): ${file}`);
    continue;
  }

  const sentence = ` Pour des conseils adaptés à votre situation, consultez notre page [${service.name}](${service.url}).`;
  lines[targetIdx] = lines[targetIdx].trimEnd() + sentence;

  const newBody = lines.join('\n');
  const newRaw = `---\n${parsed.fm}\n---\n${newBody}`;
  fs.writeFileSync(full, newRaw, 'utf-8');
  console.log(`  ✓ linked to ${service.url}: ${file}`);
  modified++;
}

console.log(`\nDone. ${modified} article(s) modified.`);
