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
import keycloak from "./auth/keycloak";
import { handleSsoLogin } from "./auth/ssoFlow";
import { ENV } from "./config/env";
import { clearAppToken } from "./services/api/tokenStorage";

// La config ENV est résolue ici volontairement pour lever une erreur explicite
// au démarrage si une variable d'environnement obligatoire est absente.
const bootEnv = ENV; // eslint-disable-line no-unused-vars

const initAuth = async () => {
  // onLoad: 'check-sso' (conforme guide officiel) : ne force PAS de redirection
  // systématique vers Keycloak. L'utilisateur non connecté reste sur la page
  // d'accueil MATAC et n'est redirigé vers YAHO qu'au clic sur un bouton de
  // connexion/inscription (Login.jsx).
  //
  // silentCheckSsoRedirectUri : indispensable pour que 'check-sso' s'exécute en
  // arrière-plan (iframe silencieuse public/silent-check-sso.html) SANS
  // rechargement complet de la page. Sans lui, keycloak-js fait un aller-retour
  // complet vers Keycloak -> la page "revient sur l'accueil" et le chargement
  // devient long après la connexion.
  try {
    await keycloak.init({
      onLoad: "check-sso",
      pkceMethod: "S256",
      silentCheckSsoRedirectUri:
        window.location.origin + "/silent-check-sso.html",
      checkLoginIframe: false,
    });
  } catch (err) {
    console.error("[bootstrap] Erreur d'init Keycloak:", err);
  }

  keycloak.onTokenExpired = async () => {
    try {
      const refreshed = await keycloak.updateToken(30);
      if (refreshed && keycloak.token) {
        await handleSsoLogin(keycloak.token);
      }
    } catch (err) {
      console.error("[bootstrap] Rafraîchissement du token Keycloak échoué:", err);
      clearAppToken();
    }
  };
};

// L'application est rendue immédiatement ; l'init Keycloak s'exécute en
// arrière-plan sans bloquer le premier affichage (évite l'écran blanc / le
// chargement long perçu après la connexion).
initAuth();

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
