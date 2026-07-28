<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { setUnauthorizedHandler } from '@/api/client';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();
const router = useRouter();

// A rejected or expired token logs the user out and sends them to /login,
// instead of leaving the app in a half-authenticated state.
onMounted(() => {
  setUnauthorizedHandler(() => {
    auth.logout();
    void router.push({ name: 'login' });
  });
});
</script>

<template>
  <RouterView />
</template>
