<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
  <header>
    <div class="bg-base-100 shadow-sm">
      <div class="m-auto flex w-[90%] max-w-6xl items-center justify-between py-4">
        <RouterLink to="/" class="text-3xl font-bold">MathVault</RouterLink>
        <ul class="menu menu-horizontal px-1">
          <li><RouterLink to="/question-browser">Question Browser</RouterLink></li>
          <li><RouterLink to="/paper-browser">Paper Browser</RouterLink></li>
        </ul>
      </div>
    </div>
  </header>
  <div class="m-auto my-12 w-[90%] max-w-6xl">
    <RouterView />
  </div>
</template>
