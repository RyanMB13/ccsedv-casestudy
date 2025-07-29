// src/api.js
import axios from "axios";
import { logoutUser } from "../utils/authHelpers";

const api = axios.create({
  baseURL: "http://localhost:5050/api",
  withCredentials: true,
});

// Automatically attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto logout on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      logoutUser(); // remove token and redirect
    }
    return Promise.reject(error);
  }
);

export default api;