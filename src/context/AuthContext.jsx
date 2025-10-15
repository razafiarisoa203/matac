import React, { createContext, useState, useEffect } from "react";
import { authService } from "../services/api/authService";

export const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = () => {
            try {
                if (authService.isAuthenticated()) {
                    const userInfo = authService.getUserInfo();
                    setUser(userInfo);
                    localStorage.setItem("user", JSON.stringify(userInfo));
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("[AuthContext] Erreur lors de l'initialisation :", error);
                authService.logout();
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        initAuth();
    }, []);

    const login = async (user_email, user_password) => {
        try {
            const success = await authService.login(user_email, user_password);
            if (success) {
                const userInfo = authService.getUserInfo();
                setUser(userInfo);
                return true;
            }
            console.warn("[AuthContext] Login échoué pour :", user_email);
            return false;
        } catch (error) {
            console.error("[AuthContext] Erreur de login :", error);
            return false;
        }
    };

    const logout = async () => {
        await authService.logout();
        setUser(null);
    };

    useEffect(() => {
    }, [user]);

    if (loading) {
        return <div>Chargement...</div>;
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: authService.isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};