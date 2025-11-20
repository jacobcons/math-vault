import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import mathData from '../data/database.json' with { type: 'json' };
const { papers, modules } = mathData;

const EXAM_GROUPS = [
  { name: 'GCSE Foundation', ids: [12] },
  { name: 'GCSE Higher', ids: [13] },
  { name: 'UKMT (JMC)', ids: [45] },
  { name: 'UKMT (IMC', ids: [45] },
];
const markingStatsForExams = [];

for (const examGroup of EXAM_GROUPS) {
  const totalMarkBySkillId = {};
  const totalQuestionsBySkillId = {};
  for (const paper of papers) {
    if (!examGroup.ids.includes(paper.parent)) continue;
    for (const question of paper.questions) {
      for (const skillId of question.skillscache) {
        const marksForQuestion = question.marks || 1;
        // if (marksForQuestion >= 4) continue;
        if (totalMarkBySkillId[skillId]) {
          totalMarkBySkillId[skillId] += marksForQuestion;
        } else {
          totalMarkBySkillId[skillId] = marksForQuestion;
        }

        if (totalQuestionsBySkillId[skillId]) {
          totalQuestionsBySkillId[skillId] += 1;
        } else {
          totalQuestionsBySkillId[skillId] = 1;
        }
      }
    }
  }

  const unitSummaries = [];
  const skillSummaries = [];
  for (const module of modules) {
    for (const unit of module.units) {
      let totalMarkForUnit = 0;
      const skillSummariesForUnit = [];
      for (const skill of unit.skills) {
        const totalMarkForSkill = totalMarkBySkillId[skill.skid];
        const totalQuestionsForSkill = totalQuestionsBySkillId[skill.skid];
        if (!totalMarkForSkill) continue;

        totalMarkForUnit += totalMarkForSkill;
        skillSummariesForUnit.push({
          id: skill.publicid,
          name: skill.name,
          totalMark: totalMarkForSkill,
          totalQuestions: totalQuestionsForSkill,
        });
        skillSummaries.push({
          id: skill.publicid,
          name: skill.name,
          totalMark: totalMarkForSkill,
          totalQuestions: totalQuestionsForSkill,
        });
      }
      if (totalMarkForUnit > 0) {
        unitSummaries.push({
          name: unit.name,
          totalMark: totalMarkForUnit,
          skills: skillSummariesForUnit.sort((a, b) => b.totalMark - a.totalMark),
        });
      }
    }
  }

  const sortedUnitSummaries = unitSummaries.sort((a, b) => b.totalMark - a.totalMark);
  const sortedSkillSummaries = skillSummaries.sort((a, b) => b.totalMark - a.totalMark);
  markingStatsForExams.push({
    name: examGroup.name,
    units: sortedUnitSummaries,
    skills: sortedSkillSummaries,
  });
}

await writeFile(
  path.join(import.meta.dirname, '..', 'data', `marking-stats-for-exams.json`),
  JSON.stringify(markingStatsForExams),
  'utf-8',
);
