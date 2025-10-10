import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../services/api/authService";
import bgImage from "../../assets/image/construction-bg.jpeg";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);
  const [showVerification, setShowVerification] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [resendEnabled, setResendEnabled] = useState(true);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const resendCode = async () => {
    try {
      setError("");
      setMessage("");
      setLoading(true);
      if (!email || !/\S+@\S+\.\S+/.test(email)) {
        throw new Error("Veuillez entrer une adresse email valide");
      }
      await authService.forgotPassword(email);
      setShowVerification(true);
      setMessage("Un nouveau code de vérification a été envoyé à votre adresse email.");
      setResendEnabled(false);
      setCountdown(60);
    } catch (err) {
      console.error('Erreur (renvoi code):', err);
      setError(err.message || "Impossible d'envoyer le code. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  // Gérer le compte à rebours pour le renvoi du code
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0 && !resendEnabled) {
      setResendEnabled(true);
    }
    return () => clearTimeout(timer);
  }, [countdown, resendEnabled]);

  const handleCodeChange = (index, value) => {
    if (value === "" || /^[0-9]$/.test(value)) {
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);
      
      // Passer au champ suivant si une valeur a été saisie
      if (value !== "" && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && verificationCode[index] === "" && index > 0) {
      // Revenir au champ précédent sur backspace
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    
    try {
      if (!showVerification) {
        // Étape 1: Demander le code de vérification
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
          throw new Error("Veuillez entrer une adresse email valide");
        }
        
        try {
          await authService.forgotPassword(email);
          setShowVerification(true);
          setMessage("Un code de vérification à 6 chiffres a été envoyé à votre adresse email.");
          setResendEnabled(false);
          setCountdown(60); // 60 secondes avant de pouvoir renvoyer le code
        } catch (err) {
          // Si l'erreur est due à un utilisateur non trouvé, on affiche un message générique pour des raisons de sécurité
          if (err.message && (err.message.includes("not found") || err.message.includes("n'existe pas"))) {
            setMessage("Si un compte existe avec cette adresse email, vous recevrez bientôt un email avec les instructions pour réinitialiser votre mot de passe.");
          } else {
            throw err;
          }
        }
      } else {
        // Étape 2: Vérifier le code
        const code = verificationCode.join("");
        if (code.length !== 6) {
          throw new Error("Veuillez entrer le code à 6 chiffres");
        }
        
        // Rediriger vers la page de réinitialisation avec le code
        navigate(`/reset-password?code=${code}&email=${encodeURIComponent(email)}`);
      }
    } catch (err) {
      console.error('Erreur:', err);
      setError(err.response?.data?.message || err.message || "Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed flex flex-col"
      style={{
        backgroundImage: `linear-gradient(rgba(15,23,42,0.75), rgba(15,23,42,0.75)), url(${bgImage})`,
      }}
    >
      <div className="flex-1 flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white p-8 rounded shadow">
          <h2 className="text-2xl font-bold mb-6 text-center">
            {showVerification ? 'Vérification' : 'Mot de passe oublié'}
          </h2>
          
          {message && (
            <div className={`mb-4 p-3 rounded ${showVerification ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'}`}>
              {message}
            </div>
          )}
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {!showVerification ? (
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  placeholder="Votre email"
                  disabled={loading}
                />
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Entrez le code à 6 chiffres envoyé à <span className="font-medium">{email}</span>
                </p>
                <div className="flex justify-between space-x-2">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      maxLength={1}
                      value={verificationCode[index]}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      className="w-10 h-12 text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      autoFocus={index === 0}
                      disabled={loading}
                    />
                  ))}
                </div>
                <div className="text-sm text-center">
                  <button
                    type="button"
                    onClick={resendCode}
                    disabled={!resendEnabled || loading}
                    className={`text-green-600 hover:text-green-800 ${!resendEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {resendEnabled ? 'Renvoyer le code' : `Réessayer dans ${countdown}s`}
                  </button>
                </div>
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading || (showVerification && verificationCode.join('').length !== 6)}
              className={`w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                (loading || (showVerification && verificationCode.join('').length !== 6)) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                'Traitement...'
              ) : showVerification ? (
                'Vérifier le code'
              ) : (
                'Envoyer le code de vérification'
              )}
            </button>
          </form>
          
          <div className="mt-4 text-center">
            <Link 
              to="/login" 
              className="text-green-600 hover:text-green-800 text-sm font-medium"
            >
              Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
