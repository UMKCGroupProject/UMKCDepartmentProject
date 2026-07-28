import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { client } from '@/api/client';
import router from '@/router';
import { useAuthStore } from '@/stores/auth';

describe('router guards', () => {
  beforeEach(async () => {
    setActivePinia(createPinia());
    localStorage.clear();
    vi.restoreAllMocks();
    await router.replace('/');
    await router.isReady();
  });

  it('redirects an unauthenticated visit to /apply', async () => {
    await router.push('/apply');
    expect(router.currentRoute.value.name).toBe('login');
    expect(router.currentRoute.value.query.redirect).toBe('/apply');
  });

  it('redirects an unauthenticated visit to /dashboard', async () => {
    await router.push('/dashboard');
    expect(router.currentRoute.value.name).toBe('login');
  });

  it('allows public routes while logged out', async () => {
    await router.push('/info');
    expect(router.currentRoute.value.name).toBe('info');
  });

  it('sends an authenticated user away from /login', async () => {
    vi.spyOn(client, 'post').mockResolvedValue({
      data: {
        accessToken: 't',
        user: {
          id: 2,
          umkcId: '20000001',
          email: 'a@example.edu',
          role: 'student',
          firstName: 'A',
          lastName: 'B',
        },
      },
    });
    await useAuthStore().login('a@example.edu', 'Password123!');

    await router.push('/login');
    expect(router.currentRoute.value.name).toBe('dashboard');
  });

  it('renders a 404 route for an unknown path', async () => {
    await router.push('/no-such-page');
    expect(router.currentRoute.value.name).toBe('not-found');
  });

  it('sets the document title from route meta', async () => {
    await router.push('/info');
    expect(document.title).toBe('GTA Qualification Information');
  });
});
