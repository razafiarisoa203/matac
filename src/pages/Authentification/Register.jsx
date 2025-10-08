import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useTranslation } from "react-i18next";
import usePageTitle from "../../hooks/usePageTitle";
import CINVerificationStep from "../../components/Authentification/CINVerificationStep";
import RegistrationForm from "../../components/Authentification/RegistrationForm";
import { citoyenService } from "../../services/api/citoyenService";
import Header from "../../components/Header";
import "react-toastify/dist/ReactToastify.css";
import bgImage from "../../assets/image/construction-bg.jpeg";
import mdatLogo from "../../assets/logo/MDAT.jpeg";


export default function Register() {
  usePageTitle("Création de compte utilisateur");
  const navigate = useNavigate();
  const [step, setStep] = useState("verification");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedCin, setVerifiedCin] = useState("");
  const [error, setError] = useState("");
  const { t } = useTranslation();

  const handleVerifyCIN = async (cin) => {
    console.log('handleVerifyCIN appelé avec CIN:', cin);
    setIsVerifying(true);
    setVerifiedCin(cin);
    setError("");
  
    try {
      // Vérifier si CIN vide
      if (!cin || cin.trim() === "") {
        setError("Veuillez saisir un numéro CIN valide");
        setIsVerifying(false);
        return;
      }
  
      const result = await citoyenService.checkCIN(cin);
      console.log("Résultat de checkCIN:", result);
  
      // Si le CIN n'existe pas, on passe à l'inscription
      if (!result.exists) {
        console.log("CIN non trouvé → passage à l'inscription");
        setStep("registration");
        setIsVerifying(false);
        return;
      }
  
      // Si le CIN existe déjà, redirection vers la page de connexion
      if (result.exists) {
        console.log("CIN existe déjà → redirection vers /login");
        toast.info("Ce numéro CIN est déjà enregistré. Veuillez vous connecter.");
        setIsVerifying(false);
        navigate("/login");
        return;
      }
  
    } catch (error) {
      console.error("Erreur lors de la vérification du CIN:", error);
      setError("Erreur serveur, veuillez réessayer plus tard.");
      setIsVerifying(false);
    }
  };
  

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed flex flex-col"
      style={{
        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.7)), url(${bgImage})`,
      }}
    >
      <Header />

      {/* Conteneur central */}
      <div className="flex-1 flex items-center justify-center mt-40 px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-max max-w-7xl">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="px-8 py-10">
              {/* Logo MDAT en haut */}
              <div className="flex justify-center mb-6">
                <img
                  src={mdatLogo}
                  alt="Logo MDAT"
                  className="h-20 w-auto object-contain"
                />
              </div>

              {/* Message d'erreur */}
              {error && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
                  {error}
                </div>
              )}

              {/* Contenu de l'étape actuelle */}
              {step === "verification" ? (
  <CINVerificationStep 
    onVerify={handleVerifyCIN} 
    isVerifying={isVerifying}
    error={error}
  />
) : (
  <RegistrationForm cin={verifiedCin} />
)}

              {/* Lien de connexion */}
              <div className="text-center text-sm text-gray-600 mt-6">
                {t('register.haveAccount')} {" "}
                <Link
                  to="/login"
                  className="font-medium text-green-600 hover:text-green-700"
                >
                  {t('login.submit')}
                </Link>
              </div>

              {/* Retour accueil */}
              <div className="text-center mt-4">
                <button
                  onClick={() => navigate("/")}
                  className="inline-flex items-center text-sm text-green-600 hover:text-green-500"
                >
                  <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  {t('login.backToHome')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast notifications */}
      <ToastContainer
        position="top-center"
        autoClose={4000}
        hideProgressBar={false}
      />
    </div>
  );
}