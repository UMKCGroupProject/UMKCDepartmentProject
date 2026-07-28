<script setup lang="ts">
import TheFooter from '@/components/TheFooter.vue';
import TheHeader from '@/components/TheHeader.vue';
</script>

<template>
  <!--
    One layout for every page. Replaces Home/Header.vue,
    Admin/AdminHeader.vue and Student/StudentHeader.vue (~90% identical) plus
    the two near-duplicate footers — one of which read
    "Copyrighted by Charusat.", left over from an unrelated tutorial.
  -->
  <div class="d-flex flex-column min-vh-100">
    <TheHeader />
    <main class="flex-grow-1">
      <slot />
    </main>
    <TheFooter />
  </div>
</template>
