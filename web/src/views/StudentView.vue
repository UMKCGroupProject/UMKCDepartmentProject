<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { client, toErrorMessage } from '@/api/client';
import DataTable, { type Column } from '@/components/DataTable.vue';
import AppLayout from '@/layouts/AppLayout.vue';
import { useAuthStore } from '@/stores/auth';
import type { Application } from '@/types';

const auth = useAuthStore();

// An empty array, not an empty object — the template iterates over this and
// reads .length, both of which need a real array before the fetch resolves.
const applications = ref<Application[]>([]);
const loading = ref(true);
const error = ref('');

const columns: Column<Application>[] = [
  { key: 'course', label: 'Course', value: (a) => a.course?.courseNo ?? '—' },
  { key: 'section', label: 'Section', value: (a) => a.course?.section ?? '—' },
  { key: 'position', label: 'Position', value: (a) => a.position },
  { key: 'gpa', label: 'GPA', value: (a) => a.gpa.toFixed(2) },
  { key: 'hrsCompleted', label: 'Hours', value: (a) => a.hrsCompleted },
  { key: 'status', label: 'Status', value: (a) => a.status },
  {
    key: 'appliedAt',
    label: 'Applied',
    value: (a) => new Date(a.appliedAt).toLocaleDateString(),
  },
];

// Load the user's applications once the component is on screen. `loading`
// drives the table's placeholder row, and `finally` makes sure it is cleared
// whether the request succeeded or failed.
onMounted(async () => {
  try {
    const { data } = await client.get<Application[]>('/applications/mine');
    applications.value = data;
  } catch (err) {
    error.value = toErrorMessage(err);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <AppLayout>
    <section class="app-section">
      <div class="container">
        <h1 class="app-heading mb-4">Welcome, {{ auth.user?.firstName }}</h1>

        <div class="app-card p-4 mb-5">
          <h2 class="h4">Apply for a position</h2>
          <p>Applications are reviewed by the department each semester.</p>
          <RouterLink to="/apply" class="btn btn-primary">
            Start an application
          </RouterLink>
          <p class="mt-3 mb-0">
            Do you qualify?
            <RouterLink to="/info" class="app-link fw-bold">
              View the criteria
            </RouterLink>
          </p>
        </div>

        <h2 class="h4 app-heading">Your applications</h2>
        <p v-if="error" class="app-error" role="alert">{{ error }}</p>
        <DataTable
          :columns="columns"
          :rows="applications"
          :loading="loading"
          empty-message="You haven't applied to any courses yet."
        />
      </div>
    </section>
  </AppLayout>
</template>
