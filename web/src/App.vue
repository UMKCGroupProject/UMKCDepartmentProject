<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { setUnauthorizedHandler } from '@/api/client';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();
const router = useRouter();

// Tell the axios client what to do when the API rejects a token as expired or
// invalid: clear the session and send the user to the login page, rather than
// leaving them on a screen that silently fails to load anything.
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
