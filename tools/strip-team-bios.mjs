// Remove the "bio" field from every team member JSON file
import fs from 'node:fs';
import path from 'node:path';

const DIR = process.argv[2];
if (!DIR) {
  console.error('Usage: node strip-team-bios.mjs <team-folder>');
  process.exit(1);
}

let changed = 0;
for (const name of fs.readdirSync(DIR)) {
  if (!name.endsWith('.json')) continue;
  const full = path.join(DIR, name);
  const raw = fs.readFileSync(full, 'utf-8');
  const data = JSON.parse(raw);
  if ('bio' in data) {
    delete data.bio;
    fs.writeFileSync(full, JSON.stringify(data, null, 2) + '\n', 'utf-8');
    console.log(`  bio removed in ${name}`);
    changed++;
  }
}
console.log(`\nDone. ${changed} file(s) updated.`);
