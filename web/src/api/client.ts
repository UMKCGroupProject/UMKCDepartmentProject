import axios, { AxiosError } from 'axios';

/**
 * The one axios instance the app uses. Replaces AuthService.js plus the ad-hoc
 * axios calls that were scattered through components, each with its own copy of
 * the base URL.
 */
export const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  headers: { 'Content-Type': 'application/json' },
});

/**
 * Turns anything thrown by axios into a readable string. Every old catch block
 * did `error.response.data.msg`, which itself throws on a network error or a
 * non-JSON response — so a failed request surfaced as a blank screen.
 */
export function toErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const err = error as AxiosError<{ message?: string | string[] }>;
    const message = err.response?.data?.message;
    if (Array.isArray(message)) return message.join(', ');
    if (typeof message === 'string') return message;
    if (!err.response) return 'Could not reach the server. Is the API running?';
    return err.message;
  }
  return error instanceof Error ? error.message : 'Something went wrong';
}

// Registered by the auth store at startup, so the 401 handler can log out
// without this module importing the store (which would be a cycle).
let onUnauthorized: (() => void) | null = null;

export function setUnauthorizedHandler(handler: () => void): void {
  onUnauthorized = handler;
}

export function setAuthToken(token: string | null): void {
  if (token) {
    client.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete client.defaults.headers.common.Authorization;
  }
}

client.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      onUnauthorized?.();
    }
    return Promise.reject(error);
  },
);
