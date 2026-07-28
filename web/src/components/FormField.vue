<script setup lang="ts">
import { useId } from 'vue';

/**
 * Wraps one form control with its label, hint and error message.
 *
 * The component generates a unique id and hands it to the control through a
 * slot prop, so the `<label for>` and the input's `id` always match. That is
 * what lets a screen reader announce the field, and what makes clicking the
 * label focus the input.
 *
 * Usage:
 *   <FormField label="Email" :error="errors.email" v-slot="{ id, invalid }">
 *     <input :id="id" v-model="email" :class="{ 'is-invalid': invalid }" />
 *   </FormField>
 */
withDefaults(
  defineProps<{
    label: string;
    error?: string;
    hint?: string;
    required?: boolean;
  }>(),
  { error: '', hint: '', required: false },
);

// Stable unique id, shared with the control through the slot prop.
const fieldId = useId();
const errorId = `${fieldId}-error`;
const hintId = `${fieldId}-hint`;
</script>

<template>
  <div class="mb-3">
    <label :for="fieldId" class="form-label">
      {{ label }}
      <span v-if="required" aria-hidden="true">*</span>
    </label>

    <slot
      :id="fieldId"
      :invalid="Boolean(error)"
      :described-by="
        [hint ? hintId : '', error ? errorId : ''].filter(Boolean).join(' ') ||
        undefined
      "
    />

    <div v-if="hint" :id="hintId" class="form-text">{{ hint }}</div>
    <p v-if="error" :id="errorId" class="app-error mb-0 mt-1" role="alert">
      {{ error }}
    </p>
  </div>
</template>
