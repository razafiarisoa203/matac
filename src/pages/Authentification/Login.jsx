import { useContext, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../context/AuthContext";
import { User, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import Header from "../../components/Header";
import AdminAccessDialog from "../../components/AdminAccessDialog";
import bgImage from "../../assets/image/construction-bg.jpeg";
import { authService } from "../../services/api/authService";
import roleService from "../../services/api/roleService";

// ID de l'application actuelle depuis les variables d'environnement
const APP_ID = import.meta.env.VITE_APP_ID || 'matac-frontend';


const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login } = useContext(AuthContext);


  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showAdminDialog, setShowAdminDialog] = useState(false);
  const [adminDialogProps, setAdminDialogProps] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  const handleSubmit = useCallback(async e => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const success = await login(formData.email, formData.password);
    setLoading(false);
    if (success) {
      // Récupérer le token et l'user info
      const token = authService.getToken();
      const userData = authService.getUserInfo();

      // Récupérer les rôles
      let roles = [];
      if (userData?.roles) {
        roles = userData.roles;
      } else if (userData?.sub) {
        // Si roles non inclus, requête API
        roles = await roleService.getUserRoles(userData.sub);
      }

      // Vérifier le rôle admin
      const hasAdminRole = Array.isArray(roles) && roles.some(role => {
        const roleValue = role.role_slug || role.role_name || role;
        return ['admin', 'super_admin', 'administrator'].some(adminRole =>
          String(roleValue).toLowerCase() === adminRole.toLowerCase()
        );
      });

      if (hasAdminRole) {
        // Afficher le dialog de choix
        setAdminDialogProps({ token, userData: { ...userData, roles } });
        setShowAdminDialog(true);
      } else {
        // Rediriger client classique
        navigate("/dashboard", { replace: true });
      }
    } else {
      setError(t("Identifiants invalides"));
    }
  }, [formData, login, navigate, t]);


  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed flex flex-col"
      style={{
        backgroundImage: `linear-gradient(rgba(15,23,42,0.75), rgba(15,23,42,0.75)), url(${bgImage})`,
      }}
    >
      <div className="fixed top-0 left-0 right-0 z-50 bg-white">
        <Header />
      </div>

{/* Modal admin */}
      {showAdminDialog && (
        <AdminAccessDialog
          token={adminDialogProps.token}
          userData={adminDialogProps.userData}
          onClose={() => setShowAdminDialog(false)}
        />
      )}


      <div className="flex-1 flex items-center justify-center mt-40 px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="px-8 py-10">
              {/* En-tête simplifié */}
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">
                  {t('login.title')}
                </h1>
                <h2 className="text-lg text-gray-700 mt-2 font-medium">
                  {t('login.welcome')}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  {t('login.subtitle')}
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
                    {t('login.email')}
                  </label>
                  <div className="relative">
                    <User className="absolute inset-y-0 left-3 h-4 w-4 text-gray-400 my-auto" />
                    <input
                      name="email"
                      type="email"
                      required
                      disabled={isSubmitting}
                      value={formData.email}
                      onChange={handleInputChange}
                      className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-green-500 focus:border-green-500 text-sm"
                      placeholder={t('login.emailPlaceholder')}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('login.password')}
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
                      placeholder={t('login.passwordPlaceholder')}
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
                      {t('login.rememberMe')}
                    </label>
                  </div>
                  <div className="text-sm">
                    <Link to="/forgot-password" className="font-medium text-green-600 hover:text-green-500">
                      {t('login.forgotPassword')}
                    </Link>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || isSubmitting}
                  className="w-full flex justify-center items-center py-2.5 px-4 rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? t('login.loggingIn') : t('login.submit')}
                </button>
              </form>

              <div className="text-center mt-6">
                <p className="text-sm text-gray-600">
                  {t('login.noAccount')}{" "}
                  <Link to="/register" className="font-medium text-green-600 hover:text-green-500">
                    {t('login.createAccount')}
                  </Link>
                </p>
              </div>

              <div className="text-center mt-4">
                <button
                  onClick={() => navigate("/")}
                  className="inline-flex items-center text-sm text-green-600 hover:text-green-500"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  {t('login.backToHome')}
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