import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ssoApi } from "../services/api/ssoApi";
import { clearAppToken, getAppToken } from "../services/api/tokenStorage";

/**
 * Hook de route protégée.
 * Vérifie la validité du JWT applicatif via GET /serviceauth/auth/verify-token
 * et redirige vers l'écran de connexion si la réponse n'est pas OK.
 */
export const useProtectedRoute = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    const check = async () => {
      if (!getAppToken()) {
        clearAppToken();
        if (active) navigate("/login", { replace: true });
        return;
      }

      const res = await ssoApi.verifyToken();
      if (!active) return;

      if (!res.ok) {
        clearAppToken();
        navigate("/login", { replace: true });
      }
      setLoading(false);
    };

    check();
    return () => {
      active = false;
    };
  }, [navigate]);

  return { loading };
};

export default useProtectedRoute;
