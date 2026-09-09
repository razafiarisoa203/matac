import keycloak from "./keycloak";
import { ENV } from "../config/env";

/**
 * Actions d'authentification YAHO (Keycloak) partagées entre la Landing Page
 * et la page /login. Redirigent directement vers le serveur YAHO, sans passer
 * par une route intermédiaire.
 */

export const loginWithYaho = () => {
  keycloak.login({
    redirectUri: ENV.KEYCLOAK_REDIRECT_URI,
  });
};

export const registerWithYaho = () => {
  keycloak.register({
    redirectUri: ENV.KEYCLOAK_REDIRECT_URI,
  });
};