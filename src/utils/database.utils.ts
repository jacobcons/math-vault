import raw from '@/database.json';
import { type Database } from '@/types/database.types';

export const database = raw as Database;

export const internalSkillIdByPublicSkillId = new Map<number, number>(
  database.modules
    .flatMap((module) => module.units)
    .flatMap((unit) => unit.skills)
    .map((skill) => [skill.publicid, skill.skid]),
);

export const publicSkillIdByInternalSkillId = new Map<number, number>(
  database.modules
    .flatMap((module) => module.units)
    .flatMap((unit) => unit.skills)
    .map((skill) => [skill.skid, skill.publicid]),
);
