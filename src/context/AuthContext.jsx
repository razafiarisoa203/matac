import React, { createContext, useState, useEffect } from "react";
import { authService } from "../services/api/authService";

export const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = () => {
            try {
                console.log("[AuthContext] Initialisation...");
                if (authService.isAuthenticated()) {
                    const userInfo = authService.getUserInfo();
                    setUser(userInfo);
                    localStorage.setItem("user", JSON.stringify(userInfo));
                    console.log("[AuthContext] Utilisateur connecté :", userInfo);
                } else {
                    setUser(null);
                    console.log("[AuthContext] Aucun utilisateur connecté (mode visiteur).");
                }
            } catch (error) {
                console.error("[AuthContext] Erreur lors de l'initialisation :", error);
                authService.logout();
                setUser(null);
            } finally {
                setLoading(false);
                console.log("[AuthContext] Loading terminé.");
            }
        };
        initAuth();
    }, []);

    const login = async (user_email, user_password) => {
        try {
            console.log("[AuthContext] Tentative de login pour :", user_email);
            const success = await authService.login(user_email, user_password);
            if (success) {
                const userInfo = authService.getUserInfo();
                setUser(userInfo);
                console.log("[AuthContext] Login réussi pour :", userInfo);
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
        console.log("[AuthContext] Déconnexion utilisateur :", user);
        await authService.logout();
        setUser(null);
        console.log("[AuthContext] Utilisateur déconnecté.");
    };

    useEffect(() => {
        console.log("[AuthContext] Changement de user :", user);
    }, [user]);

    if (loading) {
        console.log("[AuthContext] Affichage du loader (Chargement...)");
        return <div>Chargement...</div>;
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: authService.isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};