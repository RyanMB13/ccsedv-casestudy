// src/utils/authHelpers.js

export function logoutUser() {
  localStorage.removeItem("token");
  window.location.href = "/login"; // redirect to login
}