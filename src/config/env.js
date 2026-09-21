/**
 * Module de configuration centralisé.
 * Lit les variables d'environnement VITE_* et lève une erreur explicite
 * au démarrage si l'une des variables requises est absente.
 */

const getEnv = (key) => {
  const value = import.meta.env[key];
  if (!value) {
    throw new Error(
      `[CONFIG] Variable d'environnement manquante : ${key}. ` +
        `Renseignez-la dans le fichier .env (voir .env.example).`
    );
  }
  return value;
};

export const ENV = {
  KEYCLOAK_URL: getEnv("VITE_KEYCLOAK_URL"),
  KEYCLOAK_REALM: getEnv("VITE_KEYCLOAK_REALM"),
  KEYCLOAK_CLIENT_ID: getEnv("VITE_KEYCLOAK_CLIENT_ID"),
  KEYCLOAK_REDIRECT_URI: getEnv("VITE_KEYCLOAK_REDIRECT_URI"),
  API_BASE_URL: getEnv("VITE_API_URL"),
};

export default ENV;
