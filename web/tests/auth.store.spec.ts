import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { client } from '@/api/client';
import { useAuthStore } from '@/stores/auth';
import type { AuthResponse } from '@/types';

const studentResponse: AuthResponse = {
  accessToken: 'test-token',
  user: {
    id: 2,
    umkcId: '20000001',
    email: 'avery@example.edu',
    role: 'student',
    firstName: 'Avery',
    lastName: 'Nakamura',
  },
};

describe('auth store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
    delete client.defaults.headers.common.Authorization;
    vi.restoreAllMocks();
  });

  it('starts unauthenticated', () => {
    const auth = useAuthStore();
    expect(auth.isAuthenticated).toBe(false);
    expect(auth.isAdmin).toBe(false);
  });

  it('login stores the token and user and sets the axios header', async () => {
    vi.spyOn(client, 'post').mockResolvedValue({ data: studentResponse });

    const auth = useAuthStore();
    await auth.login('avery@example.edu', 'Password123!');

    expect(auth.token).toBe('test-token');
    expect(auth.user?.email).toBe('avery@example.edu');
    expect(auth.isAuthenticated).toBe(true);
    expect(auth.fullName).toBe('Avery Nakamura');
    expect(client.defaults.headers.common.Authorization).toBe(
      'Bearer test-token',
    );
  });

  // The old Vuex logout only reset the store, so the header stayed attached.
  it('logout clears token, user, storage and the axios header', async () => {
    vi.spyOn(client, 'post').mockResolvedValue({ data: studentResponse });

    const auth = useAuthStore();
    await auth.login('avery@example.edu', 'Password123!');
    auth.logout();

    expect(auth.token).toBeNull();
    expect(auth.user).toBeNull();
    expect(auth.isAuthenticated).toBe(false);
    expect(client.defaults.headers.common.Authorization).toBeUndefined();
    expect(localStorage.getItem('gta-portal-auth')).toBeNull();
  });

  it('isAdmin is true only for the admin role', async () => {
    vi.spyOn(client, 'post').mockResolvedValue({
      data: {
        ...studentResponse,
        user: { ...studentResponse.user, role: 'admin' as const },
      },
    });

    const auth = useAuthStore();
    await auth.login('admin@example.edu', 'Password123!');
    expect(auth.isAdmin).toBe(true);
  });

  it('register never sends a role, so privilege cannot be requested', async () => {
    const post = vi
      .spyOn(client, 'post')
      .mockResolvedValue({ data: studentResponse });

    const auth = useAuthStore();
    await auth.register({
      email: 'new@example.edu',
      umkcId: '20000099',
      password: 'Password123!',
      firstName: 'New',
      lastName: 'User',
    });

    const body = post.mock.calls[0]?.[1] as Record<string, unknown>;
    expect(body).not.toHaveProperty('role');
    expect(body).not.toHaveProperty('isAdmin');
  });

  it('restores a persisted session on construction', async () => {
    vi.spyOn(client, 'post').mockResolvedValue({ data: studentResponse });
    const first = useAuthStore();
    await first.login('avery@example.edu', 'Password123!');

    // A fresh Pinia stands in for a page reload.
    setActivePinia(createPinia());
    const restored = useAuthStore();

    expect(restored.isAuthenticated).toBe(true);
    expect(restored.user?.email).toBe('avery@example.edu');
    expect(client.defaults.headers.common.Authorization).toBe(
      'Bearer test-token',
    );
  });
});
