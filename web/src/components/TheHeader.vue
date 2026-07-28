<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();
const router = useRouter();

function handleLogout(): void {
  auth.logout();
  void router.push('/login');
}
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <RouterLink class="navbar-brand" to="/">GTA Portal</RouterLink>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#primary-nav"
        aria-controls="primary-nav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- This id is referenced by the toggler's data-bs-target above, which
           is how Bootstrap knows what to collapse. It must be unique. -->
      <div id="primary-nav" class="collapse navbar-collapse">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <RouterLink class="nav-link" to="/">Home</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/info">Info</RouterLink>
          </li>
          <li v-if="auth.isAuthenticated && !auth.isAdmin" class="nav-item">
            <RouterLink class="nav-link" to="/apply">Apply</RouterLink>
          </li>
          <li v-if="auth.isAuthenticated" class="nav-item">
            <RouterLink class="nav-link" to="/dashboard">Dashboard</RouterLink>
          </li>
        </ul>

        <ul class="navbar-nav align-items-lg-center">
          <template v-if="auth.isAuthenticated">
            <li class="nav-item">
              <span class="navbar-text me-3">{{ auth.fullName }}</span>
            </li>
            <li class="nav-item">
              <!-- A plain button, not a link: logging out is an action, and it
                   decides where to navigate afterwards itself. -->
              <button
                type="button"
                class="btn btn-outline-light btn-sm"
                @click="handleLogout"
              >
                Log out
              </button>
            </li>
          </template>
          <li v-else class="nav-item">
            <RouterLink class="nav-link" to="/login">Login</RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
