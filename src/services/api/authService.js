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

    registerUser: async (userData) => {
        try {
          const formData = new FormData();
      
          // === Citizen fields ===
          formData.append("citizen_name", userData.citizen_name || "");
          formData.append("citizen_lastname", userData.citizen_lastname || "");
          formData.append("citizen_national_card_number", userData.citizen_national_card_number || "");
          formData.append("citizen_adress", userData.citizen_adress || "");
          formData.append("citizen_national_card_location", userData.citizen_national_card_location || "");
          formData.append("citizen_national_card_date", userData.citizen_national_card_date || "");
          formData.append("fokotany_formatted_id", userData.fokotany_formatted_id || "");
          formData.append("municipality_id", userData.municipality_id || "");
      
          // === User fields ===
          formData.append("user_pseudo", userData.user_pseudo || "");
          formData.append("user_email", userData.user_email || "");
          formData.append("user_password", userData.user_password || "");
          formData.append("user_phone", userData.user_phone || "");
      
          // === Photo (optionnelle) ===
          if (userData.citizen_photo && userData.citizen_photo instanceof File) {
            formData.append("citizen_photo", userData.citizen_photo);
          }
      
        // === Roles: envoyer un rôle par champ FormData ===
        const roleIds = userData.role_ids || [27]; // rôle par défaut
        roleIds.forEach(id => formData.append("role_ids", id)); 

          // Debug: log des paires FormData
          console.log("---- registerUser formData entries ----");
          for (const pair of formData.entries()) {
            console.log(pair[0], pair[1]);
          }
      
          const response = await axiosConfig.post(
            "/serviceauth/users/register-with-citizen-short-role",
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );
      
          console.log("✅ registerUser response:", response?.data);
          return response.data;
      
        } catch (error) {
          const axiosData = error?.response?.data;
          console.error("❌ Erreur lors de l'inscription:", {
            message: axiosData?.message || error.message,
            status: error?.response?.status,
            data: axiosData,
          });
      
          throw {
            message: axiosData?.message || "Erreur lors de l'inscription",
            statusCode: error?.response?.status,
            data: axiosData,
            original: error
          };
        }
      },
                };

export default authService;