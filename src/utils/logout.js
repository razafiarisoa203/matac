import { ssoApi } from "../services/api/ssoApi";
import { clearAppToken } from "../services/api/tokenStorage";
import keycloak from "../auth/keycloak";

/**
 * Déconnexion SSO complète :
 * 1. Appel POST /serviceauth/auth/logout avec le header Authorization
 * 2. Vidage de sessionStorage (JWT applicatif)
 * 3. keycloak.logout() avec redirection vers l'origine de l'application
 */
export const logout = async () => {
  try {
    await ssoApi.logout();
  } catch (err) {
    console.error("[logout] Erreur lors de l'appel /logout:", err);
  } finally {
    clearAppToken();

    try {
      await keycloak.logout({
        redirectUri: window.location.origin,
      });
    } catch (err) {
      console.error("[logout] Erreur Keycloak logout:", err);
      window.location.href = window.location.origin;
    }
  }
};

export default logout;
