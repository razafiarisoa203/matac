import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import keycloak from "../../auth/keycloak";
import { handleSsoLogin } from "../../auth/ssoFlow";

/**
 * Page de callback appelée par Keycloak après authentification.
 * Attend que keycloak-js soit bien authentifié (et que le token soit dispo)
 * avant de lancer le flux SSO, pour éviter toute redirection parasite vers
 * /login ou la page d'accueil pendant le chargement.
 */
export default function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    const process = async () => {
      // Attendre que keycloak-js ait fini de traiter le retour (code/state)
      // et soit authentifié avec un token disponible.
      const started = Date.now();
      while (!keycloak.authenticated || !keycloak.token) {
        if (!active) return;
        // Garde-fou : si Keycloak n'a pas authenticifié sous 15s, abandonner.
        if (Date.now() - started > 15000) {
          if (active) navigate("/login", { replace: true });
          return;
        }
        await new Promise((r) => setTimeout(r, 100));
      }

      try {
        const result = await handleSsoLogin(keycloak.token);

        if (!active) return;
        if ("needsCitizenForm" in result) {
          navigate("/register-complete", { replace: true });
        } else if (result.loggedIn) {
          navigate("/dashboard", { replace: true });
        }
      } catch (err) {
        console.error("[Callback] Erreur SSO:", err);
        if (active) navigate("/login", { replace: true });
      }
    };

    process();

    return () => {
      active = false;
    };
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Connexion en cours...</p>
      </div>
    </div>
  );
}
