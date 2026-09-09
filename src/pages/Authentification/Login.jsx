import keycloak from "../../auth/keycloak";
import { loginWithYaho, registerWithYaho } from "../../auth/authActions";
import { ENV } from "../../config/env";
import Header from "../../components/Header";
import bgImage from "../../assets/image/construction-bg.jpeg";

/**
 * Écran de connexion SSO.
 * L'utilisateur est redirigé vers Keycloak (realm IAHO) pour s'authentifier
 * ou s'inscrire. Aucun mot de passe n'est géré côté MATAC.
 *
 * handleLogin est exécuté UNIQUEMENT au clic sur le bouton « Connexion » :
 * aucune exécution automatique au chargement de la page.
 */
const Login = () => {
  const handleForgotPassword = () => {
    keycloak.login({
      redirectUri: ENV.KEYCLOAK_REDIRECT_URI,
      action: "UPDATE_PASSWORD",
    });
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed flex flex-col"
      style={{
        backgroundImage: `linear-gradient(rgba(15,23,42,0.75), rgba(15,23,42,0.75)), url(${bgImage})`,
      }}
    >
      <div className="fixed top-0 left-0 right-0 z-50 bg-white">
        <Header />
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="px-8 py-10">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">MATAC</h1>
                <h2 className="text-lg text-gray-700 mt-2 font-medium">
                  Connexion à votre espace
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  L'authentification est gérée par la plateforme YAHO (Keycloak).
                </p>
              </div>

              <button
                onClick={loginWithYaho}
                className="w-full flex justify-center items-center py-2.5 px-4 rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition"
              >
                Se connecter avec YAHO
              </button>

              <div className="flex items-center my-4">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="px-3 text-xs text-gray-500">ou</span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>

              <button
                onClick={registerWithYaho}
                className="w-full flex justify-center items-center py-2.5 px-4 rounded-md text-sm font-medium text-white bg-gray-700 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition"
              >
                Créer un compte (S'inscrire)
              </button>

              <button
                onClick={handleForgotPassword}
                className="w-full mt-3 flex justify-center items-center py-2.5 px-4 rounded-md text-sm font-medium text-gray-700 bg-transparent border border-gray-300 hover:bg-gray-100 focus:outline-none transition"
              >
                Mot de passe oublié
              </button>

              <p className="text-center text-xs text-gray-400 mt-4">
                Votre compte est géré par la plateforme YAHO (Keycloak) : connexion,
                inscription et récupération de mot de passe s'y font en toute sécurité.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
