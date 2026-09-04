import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import keycloak from "../../auth/keycloak";
import { handleSsoLogin } from "../../auth/ssoFlow";

/**
 * Page de callback appelée par Keycloak après authentification.
 * Tente le flux SSO (étape 1/2) et redirige selon le résultat.
 */
export default function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    const process = async () => {
      try {
        if (!keycloak.authenticated || !keycloak.token) {
          navigate("/login", { replace: true });
          return;
        }

        const result = await handleSsoLogin(keycloak.token);

        if ("needsCitizenForm" in result) {
          navigate("/register-complete", { replace: true });
        } else if (result.loggedIn) {
          navigate("/dashboard", { replace: true });
        }
      } catch (err) {
        console.error("[Callback] Erreur SSO:", err);
        navigate("/login", { replace: true });
      }
    };

    process();
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
