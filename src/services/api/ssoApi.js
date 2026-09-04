import axios from "axios";
import { ENV } from "../../config/env";
import { authHeader } from "./tokenStorage";

/**
 * Service d'appel aux endpoints SSO du Service Auth.
 * Utilise VITE_API_BASE_URL comme base et gère proprement les statuts
 * 200/201/400/401/409/5xx sans faire planter l'application.
 */

const base = ENV.API_BASE_URL;

// Retourne toujours un objet { ok, status, data } au lieu de lever
// des erreurs axios, pour un pilotage propre du flux SSO.
const request = async (path, options = {}) => {
  try {
    const response = await axios({
      baseURL: base,
      url: path,
      method: options.method || "GET",
      data: options.body,
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
        ...(options.headers || {}),
      },
      validateStatus: () => true,
    });
    return { ok: response.status >= 200 && response.status < 300, status: response.status, data: response.data };
  } catch (error) {
    const status = error.response?.status || 0;
    const data = error.response?.data || {};
    console.error(`[SSO API] Erreur réseau ${path} (${status}):`, error.message);
    return { ok: false, status, data, networkError: true };
  }
};

export const ssoApi = {
  ssoToken: (sso_token) =>
    request("/serviceauth/auth/sso/token", {
      method: "POST",
      body: { sso_token },
    }),

  ssoRegister: (payload) =>
    request("/serviceauth/auth/sso/register", {
      method: "POST",
      body: payload,
    }),

  ssoRegisterComplete: (payload) =>
    request("/serviceauth/auth/sso/register-complete", {
      method: "POST",
      body: payload,
    }),

  verifyToken: () => request("/serviceauth/auth/verify-token", { method: "GET" }),

  logout: () => request("/serviceauth/auth/logout", { method: "POST" }),
};

export default ssoApi;
