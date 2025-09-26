import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import Header from "../../components/Header";
import NavigationBar from "../../components/NavigationBar";
import bgImage from "../../assets/image/construction-bg.jpeg";
import { loginService } from "../../services/api";
import { getUserRolesForApp } from "../../services/roleService";
import axios from "axios";
const API_BASE_AUTH = import.meta.env.VITE_API_SERVICEAUTH;
const API_BASE_CITIZEN = import.meta.env.VITE_API_SERVICECITOYEN;
// ID de l'application actuelle depuis les variables d'environnement
const APP_ID = import.meta.env.VITE_APP_ID || 'matac-frontend';
import { useDispatch } from "react-redux";
import { setUser } from "../../store/userSlice";
import { jwtDecode } from "jwt-decode";
import AdminAccessDialog from "../../components/AdminAccessDialog";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ user: "", password: "" });
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdminDialog, setShowAdminDialog] = useState(false);
  const [userData, setUserData] = useState(null);

  const dispatch = useDispatch();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.user || !formData.password) {
      setError("Veuillez remplir tous les champs obligatoires");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.user)) {
      setError("Veuillez entrer une adresse email valide");
      return;
    }

    setIsLoading(true);
    setIsSubmitting(true);
    setError("");

    try {
      const response = await loginService.login({
        user_email: formData.user,
        user_password: formData.password
      });
      const data = await response;

      //console.log('Réponse complète de connexion:', JSON.stringify(data, null, 2));

      if (!data || !data.access_token) {
        console.error('Échec de la connexion - Pas de token reçu:', data);
        throw new Error(data?.message || "Échec de l'authentification");
      }

      const decodedUser = jwtDecode(data.access_token);
      //console.log('Token décodé:', decodedUser);

      // Store the token in localStorage
      localStorage.setItem("token", data.access_token);

      // Extraire les rôles de différentes parties de la réponse
      let userRoles = [];

      // 1. Vérifier dans data.user.roles
      if (data.user?.roles) {
        userRoles = Array.isArray(data.user.roles) ? data.user.roles : [data.user.roles];
        // console.log('Rôles trouvés dans data.user.roles:', userRoles);
      }
      // 2. Vérifier dans data.roles
      else if (data.roles) {
        userRoles = Array.isArray(data.roles) ? data.roles : [data.roles];
        // console.log('Rôles trouvés dans data.roles:', userRoles);
      }
      // 3. Vérifier dans le token décodé
      else {
        if (decodedUser.roles) {
          userRoles = Array.isArray(decodedUser.roles) ? decodedUser.roles : [decodedUser.roles];
          //console.log('Rôles trouvés dans le token décodé:', userRoles);
        } else {
          // 4. Essayer de récupérer via l'API des rôles
          //console.log('Aucun rôle trouvé dans la réponse, tentative de récupération via API...');
          //console.log('APP_ID utilisé:', APP_ID);
          try {
            const apiRoles = await getUserRolesForApp(APP_ID, data.access_token);
            userRoles = Array.isArray(apiRoles) ? apiRoles : [apiRoles];
            //console.log('Rôles récupérés via API:', userRoles);
          } catch (roleError) {
            console.error('Erreur lors de la récupération des rôles via API:', roleError);
            userRoles = [];
          }
        }
      }

      // console.log('Rôles récupérés pour l\'application:', userRoles);

      // Vérifier si l'utilisateur est admin
      const isAdmin = Array.isArray(userRoles) &&
        userRoles.some(role => {
          const roleValue = role.role_slug || role.role_name || role;
          return ['admin', 'Admin', 'ADMIN', 'super_admin', 'SUPER_ADMIN', 'administrator', 'ADMINISTRATOR']
            .some(adminRole =>
              String(roleValue).toLowerCase() === adminRole.toLowerCase()
            );
        });

      //console.log('Est admin?', isAdmin, 'Rôles vérifiés:', userRoles);

      // Préparer les données utilisateur complètes
      const userInfo = {
        ...decodedUser,
        token: data.access_token,
        roles: userRoles,
        isAdmin: isAdmin
      };

      // Récupérer les données du citoyen si elles existent
      let citizenData = null;
      if (decodedUser.id_citizen) {
        try {
          const citizenResponse = await axios.get(
            `${API_BASE_CITIZEN}/citizens/getCitizenById/${decodedUser.id_citizen}`,
            {
              headers: {
                'Authorization': `Bearer ${data.access_token}`
              }
            }
          );
          citizenData = citizenResponse.data;
          userInfo.citizenData = citizenData;
          // console.log('Données du citoyen récupérées:', citizenData);
        } catch (err) {
          console.error("Erreur lors de la récupération des données du citoyen:", err);
        }
      }

      // Stocker toutes les données dans localStorage
      const userDataForStorage = {
        user: userInfo,
        citizen: citizenData,
        token: data.access_token
      };
      localStorage.setItem("userData", JSON.stringify(userDataForStorage));

      // Dispatch to Redux
      dispatch(setUser({
        user: userInfo,
        citizens: citizenData,
        token: data.access_token
      }));

      //console.log('Vérification finale - isAdmin:', isAdmin);
      //console.log('UserInfo final:', userInfo);

      // Si l'utilisateur est admin, afficher la boîte de dialogue
      if (isAdmin) {
        //console.log('Utilisateur admin détecté, affichage de la boîte de dialogue');
        setUserData(userInfo);
        setShowAdminDialog(true);
        // Ne pas rediriger immédiatement, laisser le dialog gérer la redirection
      } else {
        // console.log('Utilisateur normal, redirection vers dashboard');
        // Rediriger vers le tableau de bord client
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Erreur de connexion:", err);
      setError(err.message || "Une erreur est survenue lors de la connexion");
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed flex flex-col"
      style={{
        backgroundImage: `linear-gradient(rgba(15,23,42,0.75), rgba(15,23,42,0.75)), url(${bgImage})`,
      }}
    >

      {/* Boîte de dialogue admin */}
      {showAdminDialog && userData && (
        <AdminAccessDialog
          onClose={() => setShowAdminDialog(false)}
          token={userData.token}
          userData={userData}
        />
      )}

      <div className="flex-1 flex items-center justify-center mt-40 px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="px-8 py-10">
              {/* En-tête simplifié */}
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">
                  Plateforme MATAC
                </h1>
                <h2 className="text-lg text-gray-700 mt-2 font-medium">
                  Bienvenue sur MATAC
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  Connectez-vous pour accéder à votre espace personnel
                </p>
              </div>

              {/* Affichage des erreurs */}
              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                  {error}
                </div>
              )}

              {/* Formulaire simplifié */}
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse email
                  </label>
                  <div className="relative">
                    <User className="absolute inset-y-0 left-3 h-4 w-4 text-gray-400 my-auto" />
                    <input
                      name="user"
                      type="email"
                      required
                      disabled={isSubmitting}
                      value={formData.user}
                      onChange={handleInputChange}
                      className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-green-500 focus:border-green-500 text-sm"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute inset-y-0 left-3 h-4 w-4 text-gray-400 my-auto" />
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      disabled={isSubmitting}
                      value={formData.password}
                      onChange={handleInputChange}
                      className="block w-full pl-9 pr-10 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-green-500 focus:border-green-500 text-sm"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      disabled={isSubmitting}
                      className="absolute inset-y-0 right-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                      Se souvenir de moi
                    </label>
                  </div>
                  <div className="text-sm">
                    <Link to="/forgot-password" className="font-medium text-green-600 hover:text-green-500">
                      Mot de passe oublié?
                    </Link>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || isSubmitting}
                  className="w-full flex justify-center items-center py-2.5 px-4 rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Connexion..." : "Connexion"}
                </button>
              </form>

              <div className="text-center mt-6">
                <p className="text-sm text-gray-600">
                  Pas encore de compte?{" "}
                  <Link to="/register" className="font-medium text-green-600 hover:text-green-500">
                    Créer un compte
                  </Link>
                </p>
              </div>

              <div className="text-center mt-4">
                <button
                  onClick={() => navigate("/")}
                  className="inline-flex items-center text-sm text-green-600 hover:text-green-500"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Retour à l'accueil
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;