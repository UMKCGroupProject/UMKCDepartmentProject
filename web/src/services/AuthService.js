import axios from 'axios';

// Single source of truth for the API base URL. The old code repeated the
// literal 'http://localhost:3000/api/' in three separate files.
// In development this stays '/api' and goes through the Vite dev proxy.
export const API_URL = import.meta.env.VITE_API_URL ?? '/api';

export default {
  login(credentials) {
    return axios
      .post(`${API_URL}/login/`, credentials)
      .then((response) => response.data);
  },
  signUp(credentials) {
    return axios
      .post(`${API_URL}/register/`, credentials)
      .then((response) => response.data);
  },
  getSecretContent() {
    return axios
      .get(`${API_URL}/secret-route/`)
      .then((response) => response.data);
  },
  postStudent(credentials) {
    return axios
      .post(`${API_URL}/register/student`, credentials)
      .then((response) => response.data);
  },
  postApp(credentials) {
    return axios
      .post(`${API_URL}/send/app`, credentials)
      .then((response) => response.data);
  },
};
