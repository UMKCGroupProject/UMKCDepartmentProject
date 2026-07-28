<script setup lang="ts">
import FormField from '@/components/FormField.vue';
import type { CurrentLevel } from '@/types';

/**
 * Identity is read from the signed-in account rather than typed in. The old
 * form asked for name, UMKC ID and email again and sent whatever was entered,
 * so an applicant could submit under someone else's ID.
 */
defineProps<{
  fullName: string;
  umkcId: string;
  email: string;
  errors: Record<string, string>;
}>();

const currLevel = defineModel<CurrentLevel | ''>('currLevel', {
  required: true,
});
const gradSemester = defineModel<string>('gradSemester', { required: true });

const levels: { value: CurrentLevel; label: string }[] = [
  { value: 'freshman', label: 'Freshman' },
  { value: 'sophomore', label: 'Sophomore' },
  { value: 'junior', label: 'Junior' },
  { value: 'senior', label: 'Senior' },
  { value: 'graduate', label: 'Graduate' },
];

const semesters = ['Spring', 'Summer', 'Fall'].flatMap((term) =>
  [2026, 2027, 2028, 2029].map((year) => `${term} ${year}`),
);
</script>

<template>
  <fieldset class="mb-4">
    <legend class="h5">Your details</legend>

    <p class="mb-3">
      Applying as <strong>{{ fullName }}</strong> ({{ umkcId }},
      {{ email }}).
    </p>

    <FormField
      v-slot="{ id, invalid, describedBy }"
      label="Current level"
      :error="errors.currLevel"
      required
    >
      <select
        :id="id"
        v-model="currLevel"
        class="form-select"
        :class="{ 'is-invalid': invalid }"
        :aria-describedby="describedBy"
      >
        <option value="">Select a level…</option>
        <option v-for="level in levels" :key="level.value" :value="level.value">
          {{ level.label }}
        </option>
      </select>
    </FormField>

    <FormField
      v-slot="{ id, invalid, describedBy }"
      label="Graduating semester"
      :error="errors.gradSemester"
      required
    >
      <select
        :id="id"
        v-model="gradSemester"
        class="form-select"
        :class="{ 'is-invalid': invalid }"
        :aria-describedby="describedBy"
      >
        <option value="">Select a semester…</option>
        <option v-for="semester in semesters" :key="semester" :value="semester">
          {{ semester }}
        </option>
      </select>
    </FormField>
  </fieldset>
</template>
