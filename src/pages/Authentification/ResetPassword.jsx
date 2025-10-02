import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authService } from "../../services/api";
import bgImage from "../../assets/image/construction-bg.jpeg";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  // Récupérer l'email et le code depuis l'URL
  useEffect(() => {
    const emailParam = searchParams.get('email');
    const codeParam = searchParams.get('code');
    
    if (!emailParam || !codeParam) {
      setError("Lien de réinitialisation invalide. Veuillez redemander un nouveau lien.");
      return;
    }
    
    setEmail(emailParam);
    setCode(codeParam);
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    
    try {
      // Validation des champs
      if (!password || password.length < 8) {
        throw new Error("Le mot de passe doit contenir au moins 8 caractères");
      }
      
      if (password !== confirmPassword) {
        throw new Error("Les mots de passe ne correspondent pas");
      }
      
      // Appeler le service de réinitialisation du mot de passe
      await authService.resetPassword(email, code, password);
      
      setMessage("Votre mot de passe a été réinitialisé avec succès. Vous allez être redirigé vers la page de connexion...");
      
      // Rediriger vers la page de connexion après 3 secondes
      setTimeout(() => {
        navigate("/login");
      }, 3000);
      
    } catch (err) {
      console.error('Erreur lors de la réinitialisation du mot de passe:', err);
      setError(err.response?.data?.message || err.message || "Une erreur est survenue lors de la réinitialisation du mot de passe.");
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
            Réinitialiser votre mot de passe
          </h2>
          
          {message && (
            <div className="mb-4 p-3 bg-green-50 text-green-700 rounded">
              {message}
            </div>
          )}
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded">
              {error}
            </div>
          )}
          
          {!message && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Nouveau mot de passe
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  placeholder="Entrez votre nouveau mot de passe"
                  disabled={loading}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Le mot de passe doit contenir au moins 8 caractères.
                </p>
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmez le mot de passe
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  placeholder="Confirmez votre nouveau mot de passe"
                  disabled={loading}
                />
              </div>
              
              <button
                type="submit"
                disabled={loading || !password || !confirmPassword || password !== confirmPassword}
                className={`w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                  (loading || !password || !confirmPassword || password !== confirmPassword) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Traitement...' : 'Réinitialiser le mot de passe'}
              </button>
            </form>
          )}
          
          {!message && (
            <div className="mt-4 text-center">
              <button
                onClick={() => navigate('/login')}
                className="text-green-600 hover:text-green-800 text-sm font-medium"
              >
                Retour à la connexion
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
