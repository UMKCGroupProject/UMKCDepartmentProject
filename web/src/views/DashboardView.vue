<script setup lang="ts">
import AdminView from '@/views/AdminView.vue';
import StudentView from '@/views/StudentView.vue';
import { useAuthStore } from '@/stores/auth';

/**
 * Picks the dashboard for the signed-in role.
 *
 * Replaces Landing.vue, which read `this.user.isAdmin` in its template (`this.`
 * is invalid in a Vue 3 template) and only populated `user` in mounted(), so
 * the first render always saw `{}` and both dashboards were briefly hidden.
 * The store getter resolves synchronously, so there is no such gap.
 */
const auth = useAuthStore();
</script>

<template>
  <!--
    Guard on isAuthenticated as well as the role. logout() clears the token
    synchronously, but the router navigates away on the next tick — without
    this, logging out of the admin view flips isAdmin to false first, mounting
    StudentView just long enough to fire an unauthenticated /applications/mine.
  -->
  <template v-if="auth.isAuthenticated">
    <AdminView v-if="auth.isAdmin" />
    <StudentView v-else />
  </template>
</template>
