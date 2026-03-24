import fs from 'node:fs';

const dictFile = 'src/data/words.json';
const updatesFile = 'updates_full.json';

const dict = JSON.parse(fs.readFileSync(dictFile, 'utf8'));
const updates = JSON.parse(fs.readFileSync(updatesFile, 'utf8'));

// The user provided the entire _meta structure and 29 words!
// Merge _meta properties
dict._meta = { ...dict._meta, ...updates._meta };

// Merge narrative_segments securely into existing words
for (const key of Object.keys(updates.words)) {
  const update = updates.words[key];
  if (dict.words[key]) {
      dict.words[key] = { ...dict.words[key], ...update };
  } else {
      dict.words[key] = update;
  }
}

fs.writeFileSync(dictFile, JSON.stringify(dict, null, 2));
console.log('Successfully fully merged dictionary with all narrative_segments!');
