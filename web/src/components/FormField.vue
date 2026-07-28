<script setup lang="ts">
import { useId } from 'vue';

/**
 * Wires a label to its control and renders the field's error. Every input in
 * the old app had `for=""` on its label — around fifteen of them — so none
 * were announced by a screen reader or clickable to focus.
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
      :described-by="[hint ? hintId : '', error ? errorId : ''].filter(Boolean).join(' ') || undefined"
    />

    <div v-if="hint" :id="hintId" class="form-text">{{ hint }}</div>
    <p v-if="error" :id="errorId" class="app-error mb-0 mt-1" role="alert">
      {{ error }}
    </p>
  </div>
</template>
