<script setup lang="ts">
import QuestionFilters from '@/components/QuestionFilters.vue';
import QuestionList from '@/components/QuestionList.vue';
import type { Question } from '@/types/database.types';
import { Calc, type ParsedSkill } from '@/types/filter.types';
import { database } from '@/utils/database.utils';
import { computed, ref } from 'vue';

// question filters
const selectedExamIds = ref<number[]>([]);
const selectedDifficulties = ref<number[]>([1, 2, 3, 4]);
const selectedMarks = ref<number[]>([1, 2, 3, 4, 5, 6]);
const selectedCalc = ref<Calc>(Calc.Both);
const skillsInputText = ref<string>('');
const selectedSkills = computed<ParsedSkill[]>(() =>
  skillsInputText.value.split(',').flatMap((s) => {
    const m = s.trim().match(/(\d+)([a-z]|\*)?/);
    if (!m) return [];
    const publicSkillId = Number(m[1]);
    const skillId = database.internalSkillIdByPublicSkillId[publicSkillId];
    if (!skillId) return [];
    return [{ skillId, subskillChar: m[2] || null }];
  }),
);

// filter questions using user provided filters
const questions = computed<Question[]>(() => {
  const qs = [];
  const seenQIds = new Set();
  for (const p of database.papers) {
    // only include papers belonging to selected exams
    if (!selectedExamIds.value.includes(p.parent)) continue;

    for (const q of p.questions) {
      // only include questions matching all filters + dedupe questions
      if (seenQIds.has(q.qid)) continue;

      const hasMatchingCalc = selectedCalc.value === Calc.Both || selectedCalc.value === q.calc;
      if (!hasMatchingCalc) continue;

      const hasMatchingDifficulty = !q.difficulty
        ? true
        : selectedDifficulties.value.includes(q.difficulty);
      if (!hasMatchingDifficulty) continue;

      const hasMathcingMarks = !q.marks ? true : selectedMarks.value.includes(q.marks);
      if (!hasMathcingMarks) continue;

      const qSkillIds = q.skillscache || [];
      const qSubskillLetter = q.subskill?.letter || null;
      const hasMatchingSkill = selectedSkills.value.some(({ skillId, subskillChar }) => {
        const hasMatchingSkillId = qSkillIds.includes(skillId);
        const hasMatchingSubskillLetter = subskillChar === '*' || subskillChar === qSubskillLetter;
        return hasMatchingSkillId && hasMatchingSubskillLetter;
      });
      if (!hasMatchingSkill) continue;

      qs.push(q);
      seenQIds.add(q.qid);
    }
  }
  return qs;
});
</script>

<template>
  <QuestionFilters
    v-model:selectedExamIds="selectedExamIds"
    v-model:selectedDifficulties="selectedDifficulties"
    v-model:selectedMarks="selectedMarks"
    v-model:selectedCalc="selectedCalc"
    v-model:skillsInputText="skillsInputText"
    class="mb-10"
  />

  <QuestionList :questions="questions" :showQuestionCount="true" :showOtherPartsButton="true" />
</template>
