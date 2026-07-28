import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { client, setAuthToken } from '@/api/client';
import type { AuthResponse, User } from '@/types';

const STORAGE_KEY = 'gta-portal-auth';

interface PersistedAuth {
  token: string;
  user: User;
}

function readPersisted(): PersistedAuth | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PersistedAuth) : null;
  } catch {
    // Corrupt or unavailable storage should never stop the app booting.
    return null;
  }
}

export const useAuthStore = defineStore('auth', () => {
  const persisted = readPersisted();

  const token = ref<string | null>(persisted?.token ?? null);
  const user = ref<User | null>(persisted?.user ?? null);

  // Re-attach the saved token to axios as soon as the store is created.
  // Without this, refreshing the page would leave the user apparently logged in
  // while every request went out unauthenticated.
  setAuthToken(token.value);

  const isAuthenticated = computed(() => token.value !== null);
  const isAdmin = computed(() => user.value?.role === 'admin');
  const fullName = computed(() =>
    user.value ? `${user.value.firstName} ${user.value.lastName}` : '',
  );

  function persist(): void {
    if (token.value && user.value) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ token: token.value, user: user.value }),
      );
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  function setSession(auth: AuthResponse): void {
    token.value = auth.accessToken;
    user.value = auth.user;
    setAuthToken(auth.accessToken);
    persist();
  }

  async function login(email: string, password: string): Promise<void> {
    const { data } = await client.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    setSession(data);
  }

  async function register(payload: {
    email: string;
    umkcId: string;
    password: string;
    firstName: string;
    lastName: string;
    contactNo?: string;
  }): Promise<void> {
    const { data } = await client.post<AuthResponse>('/auth/register', payload);
    setSession(data);
  }

  /**
   * Ends the session. All three of these matter: the in-memory state, the
   * persisted copy in localStorage, and the axios Authorization header. Leaving
   * any one of them set would keep the user partly logged in.
   */
  function logout(): void {
    token.value = null;
    user.value = null;
    setAuthToken(null);
    persist();
  }

  return {
    token,
    user,
    isAuthenticated,
    isAdmin,
    fullName,
    login,
    register,
    logout,
  };
});
