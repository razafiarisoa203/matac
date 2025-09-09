import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import Header from "../components/Header";
import NavigationBar from "../components/NavigationBar";
import bgImage from "../assets/image/construction-bg.jpeg";
import { loginService } from "../services/api";
import axios from "axios";
const API_BASE_AUTH = import.meta.env.VITE_API_SERVICEAUTH;
const API_BASE_CITIZEN = import.meta.env.VITE_API_SERVICECITOYEN;
import { useDispatch } from "react-redux";
import { setUser } from "../store/userSlice";
import {jwtDecode} from "jwt-decode";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ user: "", password: "" });
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      setError("Veuillez entrer une adresse user valide");
      return;
    }

    setIsLoading(true);
    setIsSubmitting(true);
    setError("");

    try {
      const response = loginService.login({user_email: formData.user, user_password: formData.password});
      const data = await response;
      const decodedUser = jwtDecode(data.access_token);
      localStorage.setItem("token", JSON.stringify(data));
      if (!data) {
        throw new Error(data.message || "Échec de l'authentification");
      }
      
      if (data) {
        console.log(decodedUser)
        const citizenResponse = await axios(
          `${API_BASE_CITIZEN}/citizens/getCitizenById/${decodedUser.id_citizen}`
        );
        if (citizenResponse) {
          const citizenData = await citizenResponse.data;
          dispatch(setUser({user: decodedUser, citizens: citizenData}));
          console.log({user: decodedUser, citizens: citizenData})
          navigate("/dashboard");
        } else {
          navigate("/dashboard");
        }
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
      <Header />
      <NavigationBar />

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

              {/* Formulaire simplifié */}
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse user
                  </label>
                  <div className="relative">
                    <User className="absolute inset-y-0 left-3 h-4 w-4 text-gray-400 my-auto" />
                    <input
                      name="user"
                      type="user"
                      required
                      disabled={isSubmitting}
                      value={formData.user}
                      onChange={handleInputChange}
                      className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-green-500 focus:border-green-500 text-sm"
                      placeholder="votre@user.com"
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
                  className="w-full flex justify-center items-center py-2.5 px-4 rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition"
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