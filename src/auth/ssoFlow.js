import { ssoApi } from "../services/api/ssoApi";
import { setAppToken } from "../services/api/tokenStorage";

/**
 * Orchestrateur du flux SSO Keycloak côté Service Auth.
 *
 * Étape 1 : POST /auth/sso/token { sso_token }
 *   - 200/201 : utilisateur connu -> JWT applicatif
 *   - 401     : utilisateur inconnu -> étape 2
 * Étape 2 : POST /auth/sso/register { sso_token, ... }
 *   - 200/201 : utilisateur créé -> JWT applicatif
 *   - 400     : données citoyen manquantes -> { needsCitizenForm: true }
 * Étape 3 (via completeCitizenRegistration) : POST /auth/sso/register-complete
 *   -> puis rappel systématique de l'étape 1 pour le JWT final.
 */

const extractAppToken = (data) =>
  data?.app_token || data?.access_token || data?.token || data?.jwt;

export const handleSsoLogin = async (sso_token, citizenExtras = {}) => {
  // Étape 1
  let res = await ssoApi.ssoToken(sso_token);
  if (res.ok && extractAppToken(res.data)) {
    setAppToken(extractAppToken(res.data));
    return { loggedIn: true };
  }

  if (res.status === 401 || res.networkError) {
    // Étape 2
    res = await ssoApi.ssoRegister({ sso_token, ...citizenExtras });
    if (res.ok && extractAppToken(res.data)) {
      setAppToken(extractAppToken(res.data));
      return { loggedIn: true };
    }
    if (res.status === 400) {
      return { needsCitizenForm: true };
    }
    if (res.status === 409) {
      // Conflit éventuel : utilisateur existant mais sans keycloak_id
      throw new Error(
        res.data?.message || "Compte existant non lié à votre identité SSO"
      );
    }
  }

  throw new Error(
    res.data?.message || `Erreur SSO (étapes 1/2) : statut ${res.status || "inconnu"}`
  );
};

export const completeCitizenRegistration = async (sso_token, citizenData) => {
  // Étape 3
  const res = await ssoApi.ssoRegisterComplete({ sso_token, ...citizenData });
  if (!res.ok) {
    throw new Error(
      res.data?.message || `Erreur SSO (étape 3) : statut ${res.status || "inconnu"}`
    );
  }

  // Rappel systématique de l'étape 1 pour récupérer le JWT final
  const final = await ssoApi.ssoToken(sso_token);
  if (!final.ok || !extractAppToken(final.data)) {
    throw new Error("Échec de récupération du JWT après inscription complète");
  }

  setAppToken(extractAppToken(final.data));
  return { loggedIn: true };
};

export default { handleSsoLogin, completeCitizenRegistration };
