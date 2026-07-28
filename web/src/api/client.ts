import axios, { AxiosError } from 'axios';

/**
 * The single axios instance every request in the app goes through.
 *
 * Having one instance means the base URL, the auth header and the 401 handling
 * are configured in exactly one place, instead of being repeated in each
 * component that happens to call the API.
 */
export const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  headers: { 'Content-Type': 'application/json' },
});

/**
 * Turns anything a failed request throws into a string worth showing a user.
 *
 * Handles the three cases separately: the API replied with a message (possibly
 * an array of validation errors), the request never reached the server at all,
 * or something non-axios was thrown. Reading `error.response.data.message`
 * directly would itself throw in the second case.
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

// App.vue registers a callback here at startup. Doing it this way round means
// this file doesn't have to import the auth store, and the store doesn't have
// to import this file's interceptor — which would be a circular import.
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
