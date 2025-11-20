import { writeFile } from 'node:fs/promises';
import gcse from './gcse/gcse.json' with { type: 'json' };
import m from '../data/modules.json' with { type: 'json' };
import ukmt from './ukmt/ukmt.json' with { type: 'json' };
import path from 'node:path';

const papers = [...gcse, ...ukmt];
const modules = m.modules;

const internalSkillIdByPublicSkillId = Object.fromEntries(
  modules
    .flatMap((module) => module.units)
    .flatMap((unit) => unit.skills)
    .map((skill) => [skill.publicid, skill.skid]),
);

const publicSkillIdByInternalSkillId = Object.fromEntries(
  modules
    .flatMap((module) => module.units)
    .flatMap((unit) => unit.skills)
    .map((skill) => [skill.skid, skill.publicid]),
);

const database = {
  papers,
  modules,
  internalSkillIdByPublicSkillId,
  publicSkillIdByInternalSkillId,
};

await writeFile(
  path.join(import.meta.dirname, '..', 'src', 'database.json'),
  JSON.stringify(database, null, 2),
);
