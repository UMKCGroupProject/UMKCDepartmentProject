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

const email = ref('');
const password = ref('');
const errors = ref<{ email?: string; password?: string }>({});
const formError = ref('');
const submitting = ref(false);

function validate(): boolean {
  errors.value = {};
  if (!email.value.trim()) {
    errors.value.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errors.value.email = 'Enter a valid email address';
  }
  if (!password.value) {
    errors.value.password = 'Password is required';
  }
  return Object.keys(errors.value).length === 0;
}

async function handleSubmit(): Promise<void> {
  formError.value = '';
  if (!validate()) return;

  submitting.value = true;
  try {
    await auth.login(email.value.trim(), password.value);
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
            <h1 class="app-heading">GTA Login</h1>
          </div>
        </div>

        <div class="row justify-content-center">
          <div class="col-md-6 col-lg-5">
            <div class="app-card p-4 p-md-5">
              <form novalidate @submit.prevent="handleSubmit">
                <FormField
                  v-slot="{ id, invalid, describedBy }"
                  label="Email"
                  :error="errors.email"
                  required
                >
                  <input
                    :id="id"
                    v-model="email"
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
                  :error="errors.password"
                  required
                >
                  <input
                    :id="id"
                    v-model="password"
                    type="password"
                    autocomplete="current-password"
                    class="form-control"
                    :class="{ 'is-invalid': invalid }"
                    :aria-describedby="describedBy"
                  />
                </FormField>

                <button
                  type="submit"
                  class="btn btn-primary w-100"
                  :disabled="submitting"
                >
                  {{ submitting ? 'Signing in…' : 'Login' }}
                </button>

                <p v-if="formError" class="app-error mt-3 mb-0" role="alert">
                  {{ formError }}
                </p>

                <p class="mt-4 mb-0">
                  Don't have an account?
                  <RouterLink to="/register" class="app-link fw-bold">
                    Sign up
                  </RouterLink>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  </AppLayout>
</template>
