<script setup lang="ts">
import type { Question } from '@/types/database.types';
import type { QuestionUiState } from '@/types/question.types';
import { publicSkillIdByInternalSkillId } from '@/utils/database.utils';
import { nextTick, ref, toRefs, watch, watchEffect } from 'vue';

const props = defineProps<{
  questions: Question[];
}>();
const { questions } = toRefs(props);
const uiStateByQid = ref<Record<number, QuestionUiState>>({});
watchEffect(() => {
  for (const q of questions.value) {
    uiStateByQid.value[q.qid] = { showAnswer: false };
  }
});

// render mathjax when questions changes
watch(
  questions,
  async () => {
    await nextTick();
    await MathJax.typesetPromise(['.js-question']);
  },
  {
    immediate: true,
  },
);

// 0 based index
function getNthLetterOfAlphabet(n: number): string {
  const A_CHARCODE = 65;
  return String.fromCharCode(A_CHARCODE + n);
}

function prefixAssetPathToImgSrcs(s: string) {
  return s.replaceAll(/src="(.+?)"/g, (match, p1) => `src="assets/${p1}"`);
}

function generateLinkToDFM(q: Question): string {
  const subskillLetter = q.subskill?.letter;
  return `https://www.drfrost.org/explorer.php?skid=${extractQInternalSkillId(q)}${subskillLetter ? `#subskillLetter=${subskillLetter}` : ''}`;
}

function extractQInternalSkillId(q: Question): number | undefined {
  return q.subskill?.skid || q.skillscache?.[0];
}

function extractQDetails(q: Question): string {
  const publicSkillId =
    publicSkillIdByInternalSkillId.get(Number(extractQInternalSkillId(q))) || '';
  const subskillLetter = q.subskill?.letter || '';
  const details = {
    id: q.qid,
    skillId: `${publicSkillId}${subskillLetter}`,
    difficulty: q.difficulty,
  };
  return Object.entries(details)
    .map(([k, v]) => `${k}=${v}`)
    .join(', ');
}

function toggleShowAnswer(q: Question) {
  const uiState = uiStateByQid.value[q.qid];
  if (uiState) uiState.showAnswer = !uiState.showAnswer;
}
</script>
<template>
  <div>
    <p class="mb-3">
      Found <b>{{ questions.length }}</b> matching questions
    </p>
    <div
      v-for="q in questions"
      :key="q.qid"
      class="card bg-base-100 js-question mb-8 max-w-full p-8 shadow-sm"
    >
      <div class="mb-4 flex flex-wrap justify-between gap-8 border-b-[2px] pb-4 align-top">
        <div>
          <div
            class="mb-4 flex flex-col gap-y-4"
            v-html="prefixAssetPathToImgSrcs(q.content)"
          ></div>
          <ul v-if="q.answer.data?.options">
            <li v-for="(option, i) in q.answer.data.options" v-bind:key="option">
              <b>{{ getNthLetterOfAlphabet(i) }}</b>
              {{ option }}
            </li>
          </ul>
          <p>
            <b>({{ q.marks }} marks)</b>
          </p>
        </div>
        <template v-if="uiStateByQid[q.qid]?.showAnswer">
          <div
            v-html="prefixAssetPathToImgSrcs(q.response)"
            v-if="q.response"
            class="max-w-2xl"
          ></div>
          <p v-if="q.answer.correctAnswer">{{ JSON.stringify(q.answer.correctAnswer, null, 2) }}</p>
        </template>
      </div>
      <div class="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p class="!m-0 flex flex-wrap gap-2" v-html="extractQDetails(q)"></p>
        </div>
        <div class="flex flex-wrap gap-2">
          <button class="btn btn-primary" @click="toggleShowAnswer(q)">Toggle Answer</button>
          <a :href="generateLinkToDFM(q)" target="_blank" rel="noopener noreferrer">
            <button class="btn btn-info">DFM</button>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
