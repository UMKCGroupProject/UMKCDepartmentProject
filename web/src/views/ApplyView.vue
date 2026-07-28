<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { client, toErrorMessage } from '@/api/client';
import AcademicFields from '@/components/apply/AcademicFields.vue';
import CoursePreferenceFields from '@/components/apply/CoursePreferenceFields.vue';
import PersonalInfoFields from '@/components/apply/PersonalInfoFields.vue';
import AppLayout from '@/layouts/AppLayout.vue';
import { useAuthStore } from '@/stores/auth';
import type { Application, Course, CurrentLevel, Position } from '@/types';

const auth = useAuthStore();
const router = useRouter();

const courses = ref<Course[]>([]);
const loadError = ref('');
const formError = ref('');
const errors = ref<Record<string, string>>({});
const submitting = ref(false);

const form = ref({
  currLevel: '' as CurrentLevel | '',
  gradSemester: '',
  gpa: '',
  hrsCompleted: '',
  degree: '',
  currMajor: '',
  courseId: '' as number | '',
  position: '' as Position | '',
  certificationTerm: '',
  prevDegree: false,
});

onMounted(async () => {
  try {
    const { data } = await client.get<Course[]>('/courses');
    courses.value = data;
  } catch (error) {
    loadError.value = toErrorMessage(error);
  }
});

function validate(): boolean {
  const f = form.value;
  const next: Record<string, string> = {};

  if (!f.currLevel) next.currLevel = 'Select your current level';
  if (!f.gradSemester) next.gradSemester = 'Select your graduating semester';

  const gpa = Number(f.gpa);
  if (f.gpa === '' || Number.isNaN(gpa)) {
    next.gpa = 'Enter your GPA';
  } else if (gpa < 0 || gpa > 4) {
    next.gpa = 'GPA must be between 0 and 4.0';
  }

  const hours = Number(f.hrsCompleted);
  if (f.hrsCompleted === '' || Number.isNaN(hours)) {
    next.hrsCompleted = 'Enter your completed hours';
  } else if (!Number.isInteger(hours) || hours < 0 || hours > 400) {
    next.hrsCompleted = 'Hours must be a whole number between 0 and 400';
  }

  if (!f.degree.trim()) next.degree = 'Enter your degree, or None';
  if (!f.currMajor.trim()) next.currMajor = 'Enter your current major';
  if (f.courseId === '') next.courseId = 'Select a course';
  if (!f.position) next.position = 'Select a position';

  errors.value = next;
  return Object.keys(next).length === 0;
}

async function handleSubmit(): Promise<void> {
  formError.value = '';
  if (!validate()) return;

  submitting.value = true;
  try {
    // No userId in the payload — the API reads it from the JWT.
    await client.post<Application>('/applications', {
      courseId: Number(form.value.courseId),
      gpa: Number(form.value.gpa),
      hrsCompleted: Number(form.value.hrsCompleted),
      currLevel: form.value.currLevel,
      gradSemester: form.value.gradSemester,
      degree: form.value.degree.trim(),
      currMajor: form.value.currMajor.trim(),
      position: form.value.position,
      certificationTerm: form.value.certificationTerm.trim() || undefined,
      prevDegree: form.value.prevDegree,
    });
    await router.push('/dashboard');
  } catch (error) {
    formError.value = toErrorMessage(error);
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <AppLayout>
    <section class="app-section">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-8">
            <h1 class="app-heading mb-4">Apply for a GTA position</h1>

            <p v-if="loadError" class="app-error" role="alert">
              {{ loadError }}
            </p>

            <div class="app-card p-4 p-md-5">
              <form novalidate @submit.prevent="handleSubmit">
                <PersonalInfoFields
                  v-model:curr-level="form.currLevel"
                  v-model:grad-semester="form.gradSemester"
                  :full-name="auth.fullName"
                  :umkc-id="auth.user?.umkcId ?? ''"
                  :email="auth.user?.email ?? ''"
                  :errors="errors"
                />

                <AcademicFields
                  v-model:gpa="form.gpa"
                  v-model:hrs-completed="form.hrsCompleted"
                  v-model:degree="form.degree"
                  v-model:curr-major="form.currMajor"
                  :errors="errors"
                />

                <CoursePreferenceFields
                  v-model:course-id="form.courseId"
                  v-model:position="form.position"
                  v-model:certification-term="form.certificationTerm"
                  v-model:prev-degree="form.prevDegree"
                  :courses="courses"
                  :errors="errors"
                />

                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="submitting"
                >
                  {{ submitting ? 'Submitting…' : 'Submit application' }}
                </button>

                <p v-if="formError" class="app-error mt-3 mb-0" role="alert">
                  {{ formError }}
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  </AppLayout>
</template>
