<script setup lang="ts">
import FormField from '@/components/FormField.vue';

defineProps<{ errors: Record<string, string> }>();

// GPA and hours were type="text" with no validation at all. They are now
// numeric inputs with bounds that mirror the server's CreateApplicationDto.
const gpa = defineModel<string>('gpa', { required: true });
const hrsCompleted = defineModel<string>('hrsCompleted', { required: true });
const degree = defineModel<string>('degree', { required: true });
const currMajor = defineModel<string>('currMajor', { required: true });
</script>

<template>
  <fieldset class="mb-4">
    <legend class="h5">Academic record</legend>

    <div class="row">
      <div class="col-md-6">
        <FormField
          v-slot="{ id, invalid, describedBy }"
          label="UMKC cumulative GPA"
          hint="Between 0 and 4.0."
          :error="errors.gpa"
          required
        >
          <input
            :id="id"
            v-model="gpa"
            type="number"
            min="0"
            max="4"
            step="0.01"
            class="form-control"
            :class="{ 'is-invalid': invalid }"
            :aria-describedby="describedBy"
          />
        </FormField>
      </div>

      <div class="col-md-6">
        <FormField
          v-slot="{ id, invalid, describedBy }"
          label="Hours completed at UMKC"
          :error="errors.hrsCompleted"
          required
        >
          <input
            :id="id"
            v-model="hrsCompleted"
            type="number"
            min="0"
            max="400"
            step="1"
            class="form-control"
            :class="{ 'is-invalid': invalid }"
            :aria-describedby="describedBy"
          />
        </FormField>
      </div>
    </div>

    <FormField
      v-slot="{ id, invalid, describedBy }"
      label="Undergraduate degree"
      hint="For example BSCS, BTEC, IT. Enter None if not applicable."
      :error="errors.degree"
      required
    >
      <input
        :id="id"
        v-model="degree"
        type="text"
        class="form-control"
        :class="{ 'is-invalid': invalid }"
        :aria-describedby="describedBy"
      />
    </FormField>

    <FormField
      v-slot="{ id, invalid, describedBy }"
      label="Current major"
      :error="errors.currMajor"
      required
    >
      <input
        :id="id"
        v-model="currMajor"
        type="text"
        class="form-control"
        :class="{ 'is-invalid': invalid }"
        :aria-describedby="describedBy"
      />
    </FormField>
  </fieldset>
</template>
