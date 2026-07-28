<script setup lang="ts">
import FormField from '@/components/FormField.vue';
import type { Course, Position } from '@/types';

defineProps<{
  courses: Course[];
  errors: Record<string, string>;
}>();

const courseId = defineModel<number | ''>('courseId', { required: true });
const position = defineModel<Position | ''>('position', { required: true });
// Optional: only relevant to applicants who are already GTA certified, or who
// hold a previous US degree (which waives certification).
const certificationTerm = defineModel<string>('certificationTerm', {
  required: true,
});
const prevDegree = defineModel<boolean>('prevDegree', { required: true });

const positions: { value: Position; label: string }[] = [
  { value: 'grader', label: 'Grader' },
  { value: 'lab instructor', label: 'Lab instructor' },
  { value: 'both', label: 'Both' },
];
</script>

<template>
  <fieldset class="mb-4">
    <legend class="h5">Course preference</legend>

    <!-- Populated from GET /courses, so the value submitted is always a real
         course id rather than a hand-typed code. -->
    <FormField
      v-slot="{ id, invalid, describedBy }"
      label="Course"
      :error="errors.courseId"
      required
    >
      <select
        :id="id"
        v-model="courseId"
        class="form-select"
        :class="{ 'is-invalid': invalid }"
        :aria-describedby="describedBy"
      >
        <option value="">Select a course…</option>
        <option v-for="course in courses" :key="course.id" :value="course.id">
          {{ course.courseNo }} {{ course.section }} — {{ course.courseName }}
        </option>
      </select>
    </FormField>

    <FormField
      v-slot="{ id, invalid, describedBy }"
      label="Applying for"
      :error="errors.position"
      required
    >
      <select
        :id="id"
        v-model="position"
        class="form-select"
        :class="{ 'is-invalid': invalid }"
        :aria-describedby="describedBy"
      >
        <option value="">Select a position…</option>
        <option v-for="item in positions" :key="item.value" :value="item.value">
          {{ item.label }}
        </option>
      </select>
    </FormField>

    <FormField
      v-slot="{ id, describedBy }"
      label="GTA certification term"
      hint="Leave blank if you are not certified."
    >
      <input
        :id="id"
        v-model="certificationTerm"
        type="text"
        placeholder="e.g. Fall 2025"
        class="form-control"
        :aria-describedby="describedBy"
      />
    </FormField>

    <div class="form-check mb-3">
      <input
        id="prev-degree"
        v-model="prevDegree"
        type="checkbox"
        class="form-check-input"
      />
      <label class="form-check-label" for="prev-degree">
        I hold a previous degree from a US institution (this waives GTA
        certification)
      </label>
    </div>
  </fieldset>
</template>
