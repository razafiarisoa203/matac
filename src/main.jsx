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
import { getAppToken, clearAppToken } from "./services/api/tokenStorage";

// La config ENV est résolue ici volontairement pour lever une erreur explicite
// au démarrage si une variable d'environnement obligatoire est absente.
const bootEnv = ENV; // eslint-disable-line no-unused-vars

const initAuth = async () => {
  // onLoad absent : Keycloak ne redirige PAS automatiquement vers la page
  // YAHO au chargement. La redirection ne se produit que lorsqu'on appelle
  // keycloak.login()/keycloak.register() (boutons des écrans
  // login / inscription / mot de passe oublié). Les autres pages publiques
  // de la plateforme MATAC ne sont donc pas détournées vers Keycloak.
  // onLoad: 'check-sso' (conforme guide officiel) : ne force PAS de redirection
  // systématique vers Keycloak. L'utilisateur non connecté reste sur la page
  // d'accueil MATAC et n'est redirigé vers YAHO qu'au clic sur un bouton de
  // connexion/inscription (Login.jsx). La redirection massive précédente venait
  // du logout() automatique dans NavigationBar, désormais supprimé.
  const authenticated = await keycloak.init({
    onLoad: "check-sso",
    pkceMethod: "S256",
    checkLoginIframe: false,
  });

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

  // Si une session Keycloak est déjà détectée au chargement et qu'aucun
  // JWT applicatif n'est présent, on exécute le flux SSO.
  if (authenticated && keycloak.token && !getAppToken()) {
    try {
      const result = await handleSsoLogin(keycloak.token);
      if ("needsCitizenForm" in result) {
        window.location.href = "/register-complete";
      }
    } catch (err) {
      console.error("[bootstrap] Erreur lors du flux SSO:", err);
    }
  }
};

initAuth().then(() => {
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
});
