<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { toErrorMessage } from '@/api/client';
import FormField from '@/components/FormField.vue';
import AppLayout from '@/layouts/AppLayout.vue';
import umkcLogo from '@/assets/umkc.png';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();
const router = useRouter();

const form = ref({
  firstName: '',
  lastName: '',
  umkcId: '',
  email: '',
  password: '',
  contactNo: '',
});

type FieldErrors = Partial<Record<keyof typeof form.value, string>>;
const errors = ref<FieldErrors>({});
const formError = ref('');
const submitting = ref(false);

// Mirrors the server-side RegisterDto so the user gets feedback without a
// round trip. The server validates regardless — this is convenience, not
// security. Notably absent: anything that decides whether the user is an
// admin. The old Register.vue set `isAdmin = 1` when the ID was 9 digits.
function validate(): boolean {
  const f = form.value;
  const next: FieldErrors = {};

  if (!f.firstName.trim()) next.firstName = 'First name is required';
  if (!f.lastName.trim()) next.lastName = 'Last name is required';
  if (!/^\d{8}$/.test(f.umkcId)) next.umkcId = 'UMKC ID must be exactly 8 digits';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email))
    next.email = 'Enter a valid email address';
  if (f.password.length < 8)
    next.password = 'Password must be at least 8 characters';

  errors.value = next;
  return Object.keys(next).length === 0;
}

async function handleSubmit(): Promise<void> {
  formError.value = '';
  if (!validate()) return;

  submitting.value = true;
  try {
    await auth.register({
      firstName: form.value.firstName.trim(),
      lastName: form.value.lastName.trim(),
      umkcId: form.value.umkcId,
      email: form.value.email.trim(),
      password: form.value.password,
      contactNo: form.value.contactNo.trim() || undefined,
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
          <div class="col-md-6 text-center mb-4">
            <img :src="umkcLogo" alt="UMKC" height="150" width="275" />
            <h1 class="app-heading">Register</h1>
          </div>
        </div>

        <div class="row justify-content-center">
          <div class="col-lg-7">
            <div class="app-card p-4 p-md-5">
              <form novalidate @submit.prevent="handleSubmit">
                <div class="row">
                  <div class="col-md-6">
                    <FormField
                      v-slot="{ id, invalid, describedBy }"
                      label="First name"
                      :error="errors.firstName"
                      required
                    >
                      <input
                        :id="id"
                        v-model="form.firstName"
                        type="text"
                        autocomplete="given-name"
                        class="form-control"
                        :class="{ 'is-invalid': invalid }"
                        :aria-describedby="describedBy"
                      />
                    </FormField>
                  </div>
                  <div class="col-md-6">
                    <FormField
                      v-slot="{ id, invalid, describedBy }"
                      label="Last name"
                      :error="errors.lastName"
                      required
                    >
                      <input
                        :id="id"
                        v-model="form.lastName"
                        type="text"
                        autocomplete="family-name"
                        class="form-control"
                        :class="{ 'is-invalid': invalid }"
                        :aria-describedby="describedBy"
                      />
                    </FormField>
                  </div>
                </div>

                <FormField
                  v-slot="{ id, invalid, describedBy }"
                  label="UMKC ID"
                  hint="Eight digits, for example 20000009."
                  :error="errors.umkcId"
                  required
                >
                  <input
                    :id="id"
                    v-model="form.umkcId"
                    type="text"
                    inputmode="numeric"
                    maxlength="8"
                    class="form-control"
                    :class="{ 'is-invalid': invalid }"
                    :aria-describedby="describedBy"
                  />
                </FormField>

                <FormField
                  v-slot="{ id, invalid, describedBy }"
                  label="Email"
                  :error="errors.email"
                  required
                >
                  <input
                    :id="id"
                    v-model="form.email"
                    type="email"
                    autocomplete="email"
                    class="form-control"
                    :class="{ 'is-invalid': invalid }"
                    :aria-describedby="describedBy"
                  />
                </FormField>

                <FormField
                  v-slot="{ id, invalid, describedBy }"
                  label="Password"
                  hint="At least 8 characters."
                  :error="errors.password"
                  required
                >
                  <input
                    :id="id"
                    v-model="form.password"
                    type="password"
                    autocomplete="new-password"
                    class="form-control"
                    :class="{ 'is-invalid': invalid }"
                    :aria-describedby="describedBy"
                  />
                </FormField>

                <FormField
                  v-slot="{ id, describedBy }"
                  label="Contact number"
                  hint="Optional."
                >
                  <input
                    :id="id"
                    v-model="form.contactNo"
                    type="tel"
                    autocomplete="tel"
                    class="form-control"
                    :aria-describedby="describedBy"
                  />
                </FormField>

                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="submitting"
                >
                  {{ submitting ? 'Creating account…' : 'Register' }}
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
