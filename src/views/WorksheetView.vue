<script setup lang="ts">
import QuestionList from '@/components/QuestionList.vue';
import type { Question } from '@/types/database.types';
import { database } from '@/utils/database.utils';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const qidsParam = route.query.qids as string | undefined;
const qids = qidsParam?.split(',').map((qid) => Number(qid)) || [];
const questions = computed<Question[]>(() => {
  const qs = [];
  const seenQIds = new Set();
  for (const p of database.papers) {
    for (const q of p.questions) {
      if (seenQIds.has(q.qid)) continue;
      if (!qids.includes(q.qid)) continue;
      qs.push(q);
      seenQIds.add(q.qid);
    }
  }
  return qs.sort((a, b) => qids.indexOf(a.qid) - qids.indexOf(b.qid));
});
</script>
<template>
  <QuestionList :questions="questions" />
</template>
