<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { client, toErrorMessage } from '@/api/client';
import DataTable, { type Column } from '@/components/DataTable.vue';
import AppLayout from '@/layouts/AppLayout.vue';
import type {
  Application,
  ApplicationSortBy,
  ApplicationStatus,
  Course,
  Paginated,
  SortOrder,
} from '@/types';

const courses = ref<Course[]>([]);
const applications = ref<Application[]>([]);
const selectedCourseId = ref<number | ''>('');
const sortBy = ref<ApplicationSortBy>('gpa');
const order = ref<SortOrder>('DESC');
const total = ref(0);
const loading = ref(true);
const error = ref('');

/**
 * Fetches the applications for the current filter and sort settings.
 *
 * One function covers every combination: changing the course filter, clicking
 * a different column, or flipping the direction all just update the refs below
 * and call this again.
 */
async function loadApplications(): Promise<void> {
  loading.value = true;
  error.value = '';
  try {
    const { data } = await client.get<Paginated<Application>>('/applications', {
      params: {
        courseId: selectedCourseId.value === '' ? undefined : selectedCourseId.value,
        sortBy: sortBy.value,
        order: order.value,
        limit: 100,
      },
    });
    applications.value = data.data;
    total.value = data.total;
  } catch (err) {
    error.value = toErrorMessage(err);
  } finally {
    loading.value = false;
  }
}

function handleSort(key: string): void {
  const column = key as ApplicationSortBy;
  if (sortBy.value === column) {
    order.value = order.value === 'ASC' ? 'DESC' : 'ASC';
  } else {
    sortBy.value = column;
    order.value = 'DESC';
  }
  void loadApplications();
}

async function updateStatus(
  application: Application,
  status: ApplicationStatus,
): Promise<void> {
  try {
    const { data } = await client.patch<Application>(
      `/applications/${application.id}/status`,
      { status },
    );
    application.status = data.status;
  } catch (err) {
    error.value = toErrorMessage(err);
  }
}

watch(selectedCourseId, () => void loadApplications());

onMounted(async () => {
  try {
    const { data } = await client.get<Course[]>('/courses');
    courses.value = data;
  } catch (err) {
    error.value = toErrorMessage(err);
  }
  await loadApplications();
});

const columns: Column<Application>[] = [
  {
    key: 'firstName',
    label: 'First name',
    sortable: true,
    value: (a) => a.user?.firstName ?? '—',
  },
  {
    key: 'lastName',
    label: 'Last name',
    sortable: true,
    value: (a) => a.user?.lastName ?? '—',
  },
  { key: 'umkcId', label: 'UMKC ID', value: (a) => a.user?.umkcId ?? '—' },
  { key: 'course', label: 'Course', value: (a) => a.course?.courseNo ?? '—' },
  { key: 'currMajor', label: 'Major', value: (a) => a.currMajor },
  {
    key: 'hrsCompleted',
    label: 'Credits passed',
    sortable: true,
    value: (a) => a.hrsCompleted,
  },
  { key: 'gpa', label: 'GPA', sortable: true, value: (a) => a.gpa.toFixed(2) },
];
</script>

<template>
  <AppLayout>
    <section class="app-section">
      <div class="container">
        <h1 class="app-heading mb-4">Applicant review</h1>

        <div class="app-card p-4 mb-4">
          <label for="course-filter" class="form-label">
            Filter by course
          </label>
          <select
            id="course-filter"
            v-model="selectedCourseId"
            class="form-select"
          >
            <option value="">All courses</option>
            <option v-for="course in courses" :key="course.id" :value="course.id">
              {{ course.courseNo }} {{ course.section }} —
              {{ course.courseName }}
            </option>
          </select>
        </div>

        <p v-if="error" class="app-error" role="alert">{{ error }}</p>

        <p class="app-heading">{{ total }} application(s)</p>

        <DataTable
          :columns="columns"
          :rows="applications"
          :sort-by="sortBy"
          :order="order"
          :loading="loading"
          empty-message="No applications for this course."
          @sort="handleSort"
        />

        <!-- Accept/reject actions. Updating the row object in place is enough
             for the table above to re-render, since it is the same object. -->
        <div v-if="applications.length" class="app-card p-4">
          <h2 class="h5 mb-3">Review</h2>
          <ul class="list-unstyled mb-0">
            <li
              v-for="application in applications"
              :key="application.id"
              class="d-flex flex-wrap align-items-center gap-2 mb-2"
            >
              <span class="flex-grow-1">
                {{ application.user?.firstName }}
                {{ application.user?.lastName }} —
                {{ application.course?.courseNo }}
                <span
                  class="app-status"
                  :class="`app-status--${application.status}`"
                >
                  ({{ application.status }})
                </span>
              </span>
              <button
                type="button"
                class="btn btn-sm btn-success"
                @click="updateStatus(application, 'accepted')"
              >
                Accept
              </button>
              <button
                type="button"
                class="btn btn-sm btn-outline-danger"
                @click="updateStatus(application, 'rejected')"
              >
                Reject
              </button>
            </li>
          </ul>
        </div>
      </div>
    </section>
  </AppLayout>
</template>
