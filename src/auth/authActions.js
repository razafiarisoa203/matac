import keycloak from "./keycloak";
import { ENV } from "../config/env";

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