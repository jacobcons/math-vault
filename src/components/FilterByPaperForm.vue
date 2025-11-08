<script setup lang="ts">
import { useFilterByPaperOptions } from '@/stores/filter-options.store';


const filterByPaperOptions = useFilterByPaperOptions();
</script>

<template>
  <div class="min-w-[200px]">
        <h3 class="mb-3">Name:</h3>
        <input type="text" class="input w-full" v-model="filterByPaperOptions.paperName" />
      </div>
    </div>
</template>
