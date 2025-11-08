<script setup lang="ts">
import QuestionList from '@/components/QuestionList.vue';
import type { Question } from '@/types/database.types';
import { database } from '@/utils/database.utils';
import Fuse from 'fuse.js';
import { computed, ref } from 'vue';
const name = ref<string>('');

const questions = computed<Question[]>(() => {
  for (const p of database.papers) {
    if (p.name === name.value) {
      return p.questions;
    }
  }
  return [];
});

const fuse = new Fuse(database.papers, {
  ignoreLocation: true,
  shouldSort: true,
  keys: ['name'],
});
const isNameFocused = ref(false);
const showSuggestions = computed(() => isNameFocused.value && name.value);
const suggestions = computed<string[]>(() => {
  return fuse
    .search(name.value)
    .map(({ item }) => item.name)
    .slice(0, 15);
});
</script>

<template>
  <div class="mb-10">
    <h3 class="mb-3">Name:</h3>
    <input
      type="text"
      class="input w-full"
      v-model="name"
      tabindex="0"
      @focus="isNameFocused = true"
      @blur="isNameFocused = false"
    />
    <ul
      class="bg-base-100 rounded-box w-full p-4 shadow-sm"
      v-if="showSuggestions"
      ref="suggestions"
    >
      <li v-for="s in suggestions" :key="s" class="mb-1 cursor-pointer" @mousedown="name = s">
        {{ s }}
      </li>
    </ul>
  </div>

  <QuestionList :questions="questions" />
</template>
