<script setup lang="ts">
import { Calc } from '@/types/filter.types';
import CheckboxFieldset from './CheckboxFieldset.vue';

const EXAM_OPTIONS = {
  gcse: [
    { value: 12, text: 'GCSE Foundation' },
    { value: 13, text: 'GCSE Higher' },
    { value: 9, text: 'GCSE Foundation (Legacy)' },
    { value: 11, text: 'GCSE Higher (Legacy)' },
    { value: 12894, text: 'IGCSE Foundation' },
    { value: 12898, text: 'IGCSE Higher' },
  ],
  ukmt: [
    { value: 45, text: 'JMC' },
    { value: 46, text: 'IMC' },
    { value: 47, text: 'SMC' },
    { value: 50, text: 'Junior Kangaroo' },
    { value: 51, text: 'Intermediate Kangaroo' },
    { value: 19431, text: 'Senior Kangaroo' },
    { value: 48, text: 'JMO' },
    { value: 49, text: 'IMO' },
  ],
};
const DIFFICULTY_OPTIONS = [
  { value: 1, text: '1' },
  { value: 2, text: '2' },
  { value: 3, text: '3' },
  { value: 4, text: '4' },
];
const MARK_OPTIONS = [
  { value: 1, text: '1' },
  { value: 2, text: '2' },
  { value: 3, text: '3' },
  { value: 4, text: '4' },
  { value: 5, text: '5' },
  { value: 6, text: '6' },
];

const selectedExamIds = defineModel<number[]>('selectedExamIds');
const selectedDifficulties = defineModel<number[]>('selectedDifficulties');
const selectedMarks = defineModel<number[]>('selectedMarks');
const selectedCalc = defineModel<Calc>('selectedCalc');
const skillsInputText = defineModel<string>('skillsInputText');
</script>

<template>
  <div class="flex flex-wrap gap-8">
    <CheckboxFieldset title="GCSE" :options="EXAM_OPTIONS.gcse" v-model="selectedExamIds" />
    <CheckboxFieldset title="UKMT" :options="EXAM_OPTIONS.ukmt" v-model="selectedExamIds" />
    <CheckboxFieldset title="Marks" :options="MARK_OPTIONS" v-model="selectedMarks" />
    <CheckboxFieldset
      title="Difficulty"
      :options="DIFFICULTY_OPTIONS"
      v-model="selectedDifficulties"
    />

    <div class="flex-1">
      <h3 class="mb-3">Calculator:</h3>
      <select class="select" v-model="selectedCalc">
        <option :value="Calc.Both">Both</option>
        <option :value="Calc.Calc">Calc</option>
        <option :value="Calc.NonCalc">Non-Calc</option>
      </select>
    </div>

    <div class="min-w-[200px] flex-1">
      <h3 class="mb-3">Skills:</h3>
      <input type="text" class="input" v-model="skillsInputText" />
    </div>
  </div>
</template>
