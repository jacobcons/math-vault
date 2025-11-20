<script setup lang="ts">
import type { Question } from '@/types/database.types';
import { type QuestionUiState } from '@/types/question.types';
import { database } from '@/utils/database.utils';
import { nextTick, ref, toRefs, watch, watchEffect } from 'vue';

const props = withDefaults(
  defineProps<{
    questions?: Question[];
    showQuestionCount?: boolean;
    showOtherPartsButton?: boolean;
  }>(),
  {
    questions: () => [],
    showQuestionCount: true,
    showOtherPartsButton: false,
  },
);
const { questions, showQuestionCount, showOtherPartsButton } = toRefs(props);
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

function prefixAssetPathToImgSrcs(s: string): string {
  return s.replaceAll(/src="(.+?)"/g, (match, p1) => `src="assets/${p1}"`);
}

function generateLinkToDFM(q: Question): string {
  const subskillLetter = q.subskill?.letter;
  return `https://www.drfrost.org/explorer.php?skid=${extractInternalSkillId(q)}${subskillLetter ? `#subskillLetter=${subskillLetter}` : ''}`;
}

function extractInternalSkillId(q: Question): number | undefined {
  return q.subskill?.skid || q.skillscache?.[0];
}

function extractDetails(q: Question): string {
  const publicSkillId =
    database.publicSkillIdByInternalSkillId[Number(extractInternalSkillId(q))] ?? '';
  const subskillLetter = q.subskill?.letter ?? '';
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

async function copyPromptToGenerateSimilarQuestions(q: Question) {
  const prompt = `// FIXED
Task:

- Generate N questions
- They must be in an edexcel maths gcse style
- They must be similar to the example provided below (however dont copy the formatting of the example, you must come up with your own formatting), and follow the specific advice given below
- If the example contains realworld context you must come up with a different context for each question

Formatting:

- The output should be markdown
- Make the formatting of the <question> nice, and similar to how it would look in a real edexcel maths gcse exam (not like in the example)

Exact format (dont output anything else):

### Question <n>

<question>

etc...

// CUSTOM
Example:

${q.content}

Specific advice:

- N = 10
- Things to randomize in questions = ...
- General abstraction of question = ...
`;
  await navigator.clipboard.writeText(prompt);
}

function hasMultipleParts(q: Question): boolean {
  return /\d+[a-z]/.test(q.content);
}

function extractQuestionNumbers(q: Question): number[] {
  return [...q.content.matchAll(/Q(\d+)/g)].map((m) => Number(m[1]));
}

function isArrayEqual<T>(as: T[], bs: T[]): boolean {
  return as.length === bs.length && as.every((a) => bs.includes(a));
}

const showModal = ref<boolean>(false);
const modalQuestions = ref<Question[]>([]);

function openModalWithAllQuestionParts(selectedQuestion: Question): void {
  const paperContainingQuestion = database.papers.find((p) =>
    p.questions.some((q) => q.qid === selectedQuestion.qid),
  )!;

  const selectedQuestionNumbers = extractQuestionNumbers(selectedQuestion);

  const questionParts =
    paperContainingQuestion.questions.filter((q) =>
      isArrayEqual(extractQuestionNumbers(q), selectedQuestionNumbers),
    ) ?? [];

  modalQuestions.value = questionParts;
  showModal.value = true;
}

function closeModalWithAllQuestionParts(): void {
  modalQuestions.value = [];
  showModal.value = false;
}
</script>
<template>
  <div>
    <p class="mb-3" v-if="showQuestionCount">
      Found <b>{{ questions.length }}</b> matching questions
    </p>
    <div class="flex flex-col gap-y-8">
      <div
        v-for="q in questions"
        :key="q.qid"
        class="card bg-base-100 js-question max-w-full p-8 shadow-sm"
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
            <p v-if="q.marks">
              <b>({{ q.marks }} marks)</b>
            </p>
          </div>
          <template v-if="uiStateByQid[q.qid]?.showAnswer">
            <div
              v-html="prefixAssetPathToImgSrcs(q.response)"
              v-if="q.response"
              class="max-w-2xl"
            ></div>
            <p v-if="q.answer.correctAnswer">
              {{ JSON.stringify(q.answer.correctAnswer, null, 2) }}
            </p>
          </template>
        </div>
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p class="!m-0 flex flex-wrap gap-2" v-html="extractDetails(q)"></p>
          </div>
          <div class="flex flex-wrap gap-2">
            <button class="btn btn-primary" @click="toggleShowAnswer(q)">Answer</button>
            <a :href="generateLinkToDFM(q)" target="_blank" rel="noopener noreferrer">
              <button class="btn btn-info">DFM</button>
            </a>
            <button class="btn btn-warning" @click="copyPromptToGenerateSimilarQuestions(q)">
              Prompt
            </button>
            <button
              class="btn btn-success"
              v-if="showOtherPartsButton && hasMultipleParts(q)"
              @click="openModalWithAllQuestionParts(q)"
            >
              Other parts
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      class="fixed top-0 right-0 left-0 h-full overflow-y-scroll overscroll-contain bg-black/10 bg-cover bg-center"
      v-if="showModal"
      @click.self="closeModalWithAllQuestionParts()"
    >
      <div class="m-auto my-12 w-[90%] max-w-6xl">
        <QuestionList
          :questions="modalQuestions"
          :showQuestionCount="false"
          :showOtherPartsButton="false"
        />
      </div>
    </div>
  </div>
</template>
