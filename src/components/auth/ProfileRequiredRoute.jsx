import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const ProfileRequiredRoute = ({ children }) => {
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

  if (!isProfileComplete) {
    return <Navigate to="/register-complete" replace />;
  }

  return children;
};

export default ProfileRequiredRoute;