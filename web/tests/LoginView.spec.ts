import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import router from '@/router';
import { useAuthStore } from '@/stores/auth';
import LoginView from '@/views/LoginView.vue';

describe('LoginView', () => {
  beforeEach(async () => {
    setActivePinia(createPinia());
    localStorage.clear();
    vi.restoreAllMocks();
    await router.replace('/login');
    await router.isReady();
  });

  const mountView = () => mount(LoginView, { global: { plugins: [router] } });

  it('shows field errors instead of calling the API on an empty submit', async () => {
    const auth = useAuthStore();
    const login = vi.spyOn(auth, 'login');

    const wrapper = mountView();
    await wrapper.get('form').trigger('submit');

    const alerts = wrapper.findAll('[role="alert"]').map((a) => a.text());
    expect(alerts).toContain('Email is required');
    expect(alerts).toContain('Password is required');
    expect(login).not.toHaveBeenCalled();
  });

  it('rejects a malformed email', async () => {
    const wrapper = mountView();
    await wrapper.get('input[type="email"]').setValue('not-an-email');
    await wrapper.get('input[type="password"]').setValue('Password123!');
    await wrapper.get('form').trigger('submit');

    expect(wrapper.findAll('[role="alert"]').map((a) => a.text())).toContain(
      'Enter a valid email address',
    );
  });

  it('calls the store with trimmed credentials when valid', async () => {
    const auth = useAuthStore();
    const login = vi.spyOn(auth, 'login').mockResolvedValue();

    const wrapper = mountView();
    await wrapper.get('input[type="email"]').setValue('  avery@example.edu  ');
    await wrapper.get('input[type="password"]').setValue('Password123!');
    await wrapper.get('form').trigger('submit');

    expect(login).toHaveBeenCalledWith('avery@example.edu', 'Password123!');
  });

  it('surfaces a failed login as a readable message', async () => {
    const auth = useAuthStore();
    vi.spyOn(auth, 'login').mockRejectedValue(new Error('Invalid credentials'));

    const wrapper = mountView();
    await wrapper.get('input[type="email"]').setValue('avery@example.edu');
    await wrapper.get('input[type="password"]').setValue('WrongPassword1!');
    await wrapper.get('form').trigger('submit');
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(wrapper.text()).toContain('Invalid credentials');
  });
});
