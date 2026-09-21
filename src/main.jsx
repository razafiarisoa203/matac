import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { store } from "./services/store/store";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import CustomToast from "./components/customToast";
import keycloak, { keycloakInitOptions } from "./auth/keycloak";
import { handleSsoLogin } from "./auth/ssoFlow";
import { ENV } from "./config/env";
import { clearAppToken } from "./services/api/tokenStorage";

console.log("========== MATAC MAIN.JSX CHARGE ==========");
console.log("[MATAC] URL:", window.location.href);

const bootEnv = ENV; 


const initAuth = async () => {
  try {
    console.log("[bootstrap] Initialisation Keycloak...");
    console.log("[bootstrap] URL actuelle:", window.location.href);
    console.log("[bootstrap] Options:", keycloakInitOptions);

    const authenticated = await keycloak.init(keycloakInitOptions);

    console.log("[bootstrap] Keycloak initialisé");
    console.log("[bootstrap] authenticated:", authenticated);
    console.log("[bootstrap] keycloak.authenticated:", keycloak.authenticated);
    console.log("[bootstrap] token présent:", !!keycloak.token);
    console.log("[bootstrap] tokenParsed:", keycloak.tokenParsed);
    console.log("[bootstrap] subject:", keycloak.subject);


    if (authenticated && keycloak.token) {
      try {
        const result = await handleSsoLogin(keycloak.token);

        console.log("[bootstrap] handleSsoLogin:", result);
      } catch (err) {
        console.error(
          "[bootstrap] Erreur handleSsoLogin:",
          err
        );
      }
    }

  } catch (err) {
    console.error(
      "[bootstrap] Erreur d'init Keycloak:",
      err
    );
  }

  keycloak.onTokenExpired = async () => {
    try {
      const refreshed = await keycloak.updateToken(60);

      if (refreshed && keycloak.token) {
        await handleSsoLogin(keycloak.token);
      }
    } catch (err) {
      console.error(
        "[bootstrap] Rafraîchissement du token Keycloak échoué:",
        err
      );

      clearAppToken();
    }
  };
};


const bootstrap = async () => {
  await initAuth();

  createRoot(document.getElementById("root")).render(
      <StrictMode>
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <ThemeProvider>
              <AuthProvider>
                <App />
                <CustomToast />
              </AuthProvider>
            </ThemeProvider>
          </I18nextProvider>
        </Provider>
      </StrictMode>
    );
};

bootstrap();
