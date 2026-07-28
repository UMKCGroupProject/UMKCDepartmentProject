<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
</script>

<template>
  <AppLayout>
    <section class="app-section">
      <div class="container text-center">
        <h1 class="app-heading">Page not found</h1>
        <p>That page doesn't exist.</p>
        <RouterLink to="/" class="btn btn-primary">Back to home</RouterLink>
      </div>
    </section>
  </AppLayout>
</template>
