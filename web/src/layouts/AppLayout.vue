<script setup lang="ts">
import TheFooter from '@/components/TheFooter.vue';
import TheHeader from '@/components/TheHeader.vue';
</script>

<template>
  <!--
    The shell every page sits inside: header, page content, footer.
    Views wrap their markup in <AppLayout> rather than each rendering their own
    header and footer, so the navigation only exists in one place.

    min-vh-100 plus flex-grow-1 on <main> keeps the footer at the bottom of the
    viewport even when a page is short on content.
  -->
  <div class="d-flex flex-column min-vh-100">
    <TheHeader />
    <main class="flex-grow-1">
      <slot />
    </main>
    <TheFooter />
  </div>
</template>
