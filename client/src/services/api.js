// src/api.js
import axios from "axios";
import { logoutUser } from "../utils/authHelpers";

const api = axios.create({
  baseURL: "http://localhost:5050/api",
  withCredentials: true,
});

// Automatically attach token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Automatically handle 401 (Unauthorized) globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized. Logging out...");
      logoutUser(); // Clear token and redirect
    } else if (error.response?.status === 403) {
      console.warn("Forbidden: You do not have access.");
    } else {
      console.error("API error:", error);
    }

    return Promise.reject(error);
  }
);

export default api;