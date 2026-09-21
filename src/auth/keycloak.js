import Keycloak from "keycloak-js";
import { ENV } from "../config/env";

console.log("[Keycloak config]", {
  url: ENV.KEYCLOAK_URL,
  realm: ENV.KEYCLOAK_REALM,
  clientId: ENV.KEYCLOAK_CLIENT_ID,
});

const keycloak = new Keycloak({
  url: ENV.KEYCLOAK_URL,
  realm: ENV.KEYCLOAK_REALM,
  clientId: ENV.KEYCLOAK_CLIENT_ID,
});


export const keycloakInitOptions = {
  onLoad: "login-required",
  pkceMethod: "S256",
  checkLoginIframe: false,
  locale: "fr",
};

export default keycloak;