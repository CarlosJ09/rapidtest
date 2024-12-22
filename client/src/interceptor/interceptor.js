import axios from "axios";
import { SESSION_KEY } from "../constants/session";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKENDHOST,
});

api.interceptors.request.use(
  async (config) => {
    const session = window.sessionStorage.getItem(SESSION_KEY);
    const token = session ? JSON.parse(session).token : null;

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return error?.response;
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      window.sessionStorage.removeItem(SESSION_KEY);
      window.location.href = "/auth/sign-in";
    }
    return error.response;
  }
);

export default api;
