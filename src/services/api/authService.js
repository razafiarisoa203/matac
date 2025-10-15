import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import axiosConfig from "./axios.config";

const AUTH_TOKEN_KEY = "access_token";

const isSecure = () => window.location.protocol === "https:";

export const authService = {
    setToken: (token) => {
        try {
            const decodedToken = jwtDecode(token);
            if (!decodedToken) throw new Error("Invalid token");
            Cookies.set(AUTH_TOKEN_KEY, token, {
                expires: new Date(decodedToken.exp * 1000),
                secure: isSecure(),
                sameSite: "Strict",
                path: "/",
            });
            localStorage.setItem(AUTH_TOKEN_KEY, token);
            // Remove deprecated storage
            localStorage.removeItem("userId");
            localStorage.removeItem("username");
        } catch (error) {
            console.error("Error setting token:", error);
        }
    },

    getToken: () => {
        const token = localStorage.getItem(AUTH_TOKEN_KEY) || Cookies.get(AUTH_TOKEN_KEY);
        if (!token) return null;
        try {
            const decodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            if (decodedToken.exp < currentTime) {
                authService.logout();
                return null;
            }
            return token;
        } catch (error) {
            console.error("Error decoding token:", error);
            authService.logout();
            return null;
        }
    },

    decodedToken: () => {
        const token = authService.getToken();
        return token ? jwtDecode(token) : null;
    },

    isAuthenticated: () => {
        return !!authService.getToken();
    },

    getUserInfo: () => {
        return authService.decodedToken();
    },

    getUserId: () => {
        const decodedToken = authService.decodedToken();
        if (decodedToken) {
            return decodedToken.sub || decodedToken.user_id;
        }
        return null;
    },


    getUsername: () => {
        const decodedToken = authService.decodedToken();
        if (decodedToken) {
            return decodedToken.username || "";
        }
        return "";
    },

    getUserProfile: async () => {
        const token = authService.getToken();
        if (!token) return null;

        try {
            const response = await axiosConfig.get("/serviceauth/auth/profile", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data; // Retourne les infos complètes de l'utilisateur
        } catch (error) {
            console.error("Erreur lors de la récupération de l'utilisateur :", error);
            return null;
        }
    },

    updateUser: async ({ user_pseudo, user_email, user_phone, user_password }) => {
        const token = authService.getToken();
        if (!token) throw new Error("Token found");
        try {
            const payload = {
                ...(user_pseudo && { user_pseudo }),
                ...(user_email && { user_email }),
                ...(user_phone && { user_phone }),
                ...(user_password && { user_password }),
            };

            const response = await axiosConfig.put(
                "/serviceauth/auth/profile",
                payload,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            return response.data;
        } catch (error) {
            console.error("Error updating user profile:", error);
            throw error;
        }
    },


    logout: async () => {
        try {
            const token = authService.getToken();
            if (token) {
                await axiosConfig.post(
                    "/serviceauth/auth/logout",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            }
        } catch (error) {
            // Log but don't block logout
            console.error("Error logging out:", error);
        } finally {
            // Supprimer tous les cookies
            if (typeof document !== "undefined") {
                // Supprimer tous les cookies (même hors js-cookie)
                document.cookie.split(";").forEach((c) => {
                    const eqPos = c.indexOf("=");
                    const name = eqPos > -1 ? c.substr(0, eqPos) : c;
                    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
                });
            }
            // Supprimer tous les cookies js-cookie (sécurité, redondance)
            Object.keys(Cookies.get()).forEach(cookieName => Cookies.remove(cookieName, { path: "/" }));

            // Supprimer tout le localStorage et sessionStorage
            if (typeof localStorage !== "undefined") localStorage.clear();
            if (typeof sessionStorage !== "undefined") sessionStorage.clear();
        }
        return true;
    },

    login: async (user_email, user_password) => {
        try {
            const response = await axiosConfig.post("/serviceauth/auth/login", {
                user_email,
                user_password,
            });
            const { access_token } = response.data;
            if (access_token) {
                authService.setToken(access_token);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Login error:", error);
            return false;
        }
    },

    register: async (users) => {
        try {
            const formData = new FormData();
            formData.append("citizen_national_card_number", users.citizen_national_card_number);
            formData.append("citizen_name", users.citizen_name);
            formData.append("citizen_city", users.citizen_city);
            formData.append("citizen_national_card_date", users.citizen_national_card_date);
            formData.append("citizen_work", users.citizen_work);
            formData.append("user_email", users.user_email);
            formData.append("citizen_location_of_birth", users.citizen_location_of_birth);
            formData.append("citizen_adress", users.citizen_adress);
            formData.append("citizen_national_card_location", users.citizen_national_card_location);
            formData.append("user_password", users.user_password);
            formData.append("citizen_date_of_birth", users.citizen_date_of_birth);
            formData.append("user_pseudo", users.user_pseudo);
            formData.append("citizen_father", users.citizen_father);
            formData.append("fokotany_id", users.fokotany_id);
            formData.append("citizen_lastname", users.citizen_lastname);
            formData.append("citizen_mother", users.citizen_mother);
            formData.append("user_phone", users.user_phone);
            formData.append("citizen_photo", users.citizen_photo);
            formData.append("municipality_id", users.municipality_id);

            return await axiosConfig.post("/serviceauth/users/register-with-citizen", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
        } catch (e) {
            console.error("Erreur lors de l'enregistrement :", e);
            throw e;
        }
    },

    assignUserRoles: async (userId, roleIds) => {
        try {
            const token = authService.getToken();
            if (!token) throw new Error("No authentication token found");

            const response = await axiosConfig.post(
                `/serviceauth/users/${userId}/roles`,
                { role_ids: roleIds },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            return response.data;
        } catch (error) {
            console.error("Erreur lors de l'assignation des rôles:", error);
            throw error;
        }
    },

    registerUser: async (userData) => {
        try {
            const formData = new FormData();
            
            // Ajouter les champs utilisateur
            formData.append("user_pseudo", userData.user_pseudo);
            formData.append("user_email", userData.user_email);
            formData.append("user_password", userData.user_password);
            formData.append("user_phone", userData.user_phone);
            formData.append("municipality_id", userData.municipality_id);
            
            // Ajouter les champs citoyen
            if (userData.citizenData) {
                formData.append("citizen_name", userData.citizenData.citizen_name);
                formData.append("citizen_lastname", userData.citizenData.citizen_lastname);
                formData.append("citizen_national_card_number", userData.citizenData.citizen_national_card_number);
                formData.append("citizen_adress", userData.citizenData.citizen_adress);
                formData.append("citizen_national_card_location", userData.citizenData.citizen_national_card_location);
                formData.append("citizen_national_card_date", userData.citizenData.citizen_national_card_date);
                formData.append("fokotany_formatted_id", parseInt(userData.citizenData.fokotany_formatted_id));
                
                // Ajouter la photo si elle existe
                if (userData.citizenData.citizen_photo) {
                    if (userData.citizenData.citizen_photo instanceof File) {
                        // Si c'est un fichier, l'ajouter directement
                        formData.append("citizen_photo", userData.citizenData.citizen_photo);
                    } else if (typeof userData.citizenData.citizen_photo === 'string') {
                        // Si c'est une URL (après upload), l'ajouter comme citizen_photo (pas citizen_photo_url)
                        formData.append("citizen_photo", userData.citizenData.citizen_photo);
                    }
                }
            }

            console.log('Envoi de la requête d\'inscription avec FormData...');
            console.log('Données utilisateur:', {
                user_pseudo: userData.user_pseudo,
                user_email: userData.user_email,
                user_password: userData.user_password,
                user_phone: userData.user_phone,
                municipality_id: userData.municipality_id
            });
            console.log('Données citoyen:', {
                ...userData.citizenData,
                fokotany_formatted_id: parseInt(userData.citizenData.fokotany_formatted_id)
            });

            // Utiliser le nouvel endpoint
            const response = await axiosConfig.post("/serviceauth/users/register-with-citizen-short", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            return response.data;
        } catch (error) {
            console.error("Erreur lors de l'inscription:", error);
            console.error("Données reçues:", error.response?.data);
            
            // Handle specific error cases
            if (error.response?.status === 409) {
                const errorData = error.response.data;
                if (errorData.message?.includes("Keycloak")) {
                    throw new Error("Un utilisateur avec cette adresse email ou ce nom d'utilisateur existe déjà. Veuillez utiliser une autre adresse email ou contacter l'administrateur si vous pensez que c'est une erreur.");
                }
            }

            if (error.response?.status === 400) {
                const errorData = error.response.data;
                if (errorData.message?.includes("Keycloak") && errorData.message?.includes("409")) {
                    throw new Error("Un utilisateur avec cette adresse email existe déjà dans le système. Veuillez utiliser une autre adresse email ou contacter l'administrateur.");
                }
            }

            throw error;
        }
    },

    resetPassword: async (email, token, newPassword) => {
        try {
            const response = await axiosConfig.post("/serviceauth/auth/reset-password", {
                user_email: email,
                token: token,
                newPassword: newPassword,
            });
            return response.data;
        } catch (error) {
            console.error("Error resetting password:", error);
            throw error;
        }
    },

    forgotPassword: async (email) => {
        try {
            // Call the auth endpoint to register the forgot password request
            // This endpoint already sends the email automatically if the email exists
            const response = await axiosConfig.post("/serviceauth/auth/forgot-password", {
                user_email: email,
            });

            // The API response should indicate if email was sent
            return { success: true, emailSent: response.data?.emailSent || true };
        } catch (error) {
            console.error("Error in forgot password process:", error);
            throw error;
        }
    },
};