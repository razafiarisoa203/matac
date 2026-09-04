import React, { createContext, useState, useEffect, useCallback } from "react";
import keycloak from "../auth/keycloak";
import { logout as ssoLogout } from "../utils/logout";
import { getAppToken } from "../services/api/tokenStorage";
import { ssoApi } from "../services/api/ssoApi";
import { ENV } from "../config/env";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    if (!getAppToken()) {
      setUser(null);
      return;
    }
    const res = await ssoApi.verifyToken();
    setUser(res.ok ? keycloak?.profile || null : null);
  }, []);

  useEffect(() => {
    const init = async () => {
      await refreshUser();
      setLoading(false);
    };
    init();
  }, [refreshUser]);

  const login = useCallback(async () => {
    keycloak.login({
      redirectUri: ENV.KEYCLOAK_REDIRECT_URI,
    });
  }, []);

  const logout = useCallback(async () => {
    await ssoLogout();
    setUser(null);
  }, []);

  const isAuthenticated = useCallback(() => {
    return !!getAppToken() && keycloak.authenticated === true;
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
