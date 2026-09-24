import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const AuthenticatedRoute = ({ children }) => {
  const auth = useContext(AuthContext);

  if (!auth) {
    return null;
  }

  const {
    isAuthenticated,
    isProfileComplete,
  } = auth;

  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  // L'utilisateur est déjà complet :
  // inutile de lui afficher RegisterComplete.
  if (isProfileComplete) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AuthenticatedRoute;