<script setup lang="ts">
const { title, options } = defineProps<{
  title: string;
  options: { value: number; text: string }[];
}>();

const checkedValues = defineModel<number[]>();
</script>

<template>
  <fieldset class="fieldset bg-base-100 border-base-300 rounded-box flex-auto border p-4">
    <legend class="fieldset-legend text-xl">{{ title }}</legend>
    <label v-for="{ value, text } in options" :key="value" class="cursor-pointer">
      <input type="checkbox" class="checkbox" :value="value" v-model="checkedValues" />
      {{ text }}
    </label>
  </fieldset>
</template>
