import useProtectedRoute from "../../hooks/useProtectedRoute";

/**
 * Composant de route protégée : vérifie le JWT applicatif (verify-token)
 * et affiche un état de chargement pendant la vérification.
 */
const PrivateRoute = ({ children }) => {
  const { loading } = useProtectedRoute();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return children;
};

export default PrivateRoute;
