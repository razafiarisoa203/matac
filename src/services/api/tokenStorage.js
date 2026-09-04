/**
 * Stockage du JWT applicatif (celui retourné par le backend Service Auth,
 * PAS le sso_token Keycloak) dans sessionStorage.
 */

const APP_JWT_KEY = "app_jwt";

export const setAppToken = (token) => {
  if (token) sessionStorage.setItem(APP_JWT_KEY, token);
};

export const getAppToken = () => {
  return sessionStorage.getItem(APP_JWT_KEY);
};

export const clearAppToken = () => {
  sessionStorage.removeItem(APP_JWT_KEY);
};

export const authHeader = () => {
  const token = getAppToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export default { setAppToken, getAppToken, clearAppToken, authHeader };
