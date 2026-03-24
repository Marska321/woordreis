import fs from 'node:fs';

const dictFile = 'src/data/words.json';
const updatesFile = 'updates.json';

const dict = JSON.parse(fs.readFileSync(dictFile, 'utf8'));
const updates = JSON.parse(fs.readFileSync(updatesFile, 'utf8'));

// The user snippet for the first 5 words omitted "stages", so let's preserve them from the original if they're missing or empty-looking `[ ... ]`.
for (const key of Object.keys(updates)) {
  const update = updates[key];
  if (dict.words[key]) {
     // If the stages array is empty or has a string "... " in it, keep the original stages.
     if (!update.stages || (update.stages[0] && typeof update.stages[0] === 'string' && update.stages[0] === '...')) {
        update.stages = dict.words[key].stages;
     }
  }
  
  dict.words[key] = { ...dict.words[key], ...update };
  
  // ensure stages are correct
  if (!update.stages || update.stages.length === 0) {
     if (dict.words[key].stages) {
        update.stages = dict.words[key].stages;
     }
  }
}

fs.writeFileSync(dictFile, JSON.stringify(dict, null, 2));
console.log('Successfully merged!');
