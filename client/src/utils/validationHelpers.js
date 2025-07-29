// utils/validationHelpers.js

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return typeof email === "string" && email.length <= 100 && emailRegex.test(email);
}

function isReasonablePasswordLength(password) {
  return typeof password === "string" && password.length >= 8 && password.length <= 128;
}

function isStrongPassword(password) {
  // At least one uppercase, one lowercase, one digit, and one special character
  const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])/;
  return strongRegex.test(password);
}

module.exports = {
  isValidEmail,
  isReasonablePasswordLength,
  isStrongPassword,
};