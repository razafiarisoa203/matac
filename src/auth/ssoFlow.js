import { ssoApi } from "../services/api/ssoApi";
import { setAppToken } from "../services/api/tokenStorage";

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
