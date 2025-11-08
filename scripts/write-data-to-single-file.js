import { writeFile } from 'fs/promises';
import gcse from './gcse/gcse.json' with { type: 'json' };
import ukmt from './ukmt/ukmt.json' with { type: 'json' };
import m from './modules.json' with { type: 'json' };

const data = {
  papers: [...gcse, ...ukmt],
  modules: m.modules,
};

await writeFile('./database.json', JSON.stringify(data, null, 2));
