<script setup lang="ts">
import AdminView from '@/views/AdminView.vue';
import StudentView from '@/views/StudentView.vue';
import { useAuthStore } from '@/stores/auth';

/**
 * /dashboard is one route that renders a different view per role, so neither
 * side has to know the other's URL.
 */
const auth = useAuthStore();
</script>

<template>
  <!--
    The isAuthenticated check matters as much as the role check. logout()
    clears the token immediately, but the router only navigates away on the
    next tick. Without this outer guard, logging out of the admin view would
    flip isAdmin to false first, mounting StudentView for a moment — long
    enough for it to fire a request with no token attached.
  -->
  <template v-if="auth.isAuthenticated">
    <AdminView v-if="auth.isAdmin" />
    <StudentView v-else />
  </template>
</template>
