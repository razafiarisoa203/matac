import React, { createContext, useState, useEffect, useCallback } from "react";
import keycloak from "../auth/keycloak";
import { logout as ssoLogout } from "../utils/logout";
import { getAppToken } from "../services/api/tokenStorage";
import { ssoApi } from "../services/api/ssoApi";
import { ENV } from "../config/env";
import { authService } from "../services/api/authService";
import { getProfileCompletion } from "../utils/profileUtils";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Vérifie si toutes les informations obligatoires
   * du profil citoyen sont présentes.
   */
  const checkProfileComplete = useCallback((profile) => {
    return getProfileCompletion(profile).complete;
  }, []);

  const refreshUser = useCallback(async () => {
    if (!getAppToken()) {
      setUser(null);
      return null;
    }

    const res = await ssoApi.verifyToken();

    if (!res.ok) {
      authService.clearUserProfile();
      setUser(null);
      return null;
    }

    const tokenUser = authService.getUserInfo();

    const profile = await authService.getUserProfile();

    const resolvedProfile =
      profile?.user ||
      profile?.data ||
      profile;

    if (resolvedProfile && typeof resolvedProfile === "object") {
      authService.setUserProfile(resolvedProfile);
    }

    const resolvedUser = {
      ...tokenUser,
      ...(resolvedProfile || {}),
      user_id:
        resolvedProfile?.user_id ||
        tokenUser?.user_id ||
        tokenUser?.sub ||
        null,
    };

    setUser(resolvedUser);
    return resolvedUser;
  }, []);

  useEffect(() => {
    const init = async () => {
      await refreshUser();
      setLoading(false);
    };

    init();
  }, [refreshUser]);

  const login = useCallback(async () => {
    await keycloak.login({
      redirectUri: ENV.KEYCLOAK_REDIRECT_URI,
    });
  }, []);

  const logout = useCallback(async () => {
    await ssoLogout();
    setUser(null);
  }, []);

  const isAuthenticated = useCallback(() => {
    return !!getAppToken() && !!user;
  }, [user]);

  /**
   * Profil complet ou non.
   */
  const isProfileComplete = checkProfileComplete(user);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated,
        refreshUser,
        isProfileComplete,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};