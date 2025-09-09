import { useState } from "react";
import { Link } from "react-router-dom";
import { authService } from "../../services/api";
import bgImage from "../../assets/image/construction-bg.jpeg";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    try {
      await authService.forgotPassword(email);
      setMessage("Un email de réinitialisation a été envoyé si l'adresse existe.");
    } catch (err) {
      setError("Erreur lors de la demande. Vérifiez l'adresse email.");
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
          <h2 className="text-2xl font-bold mb-6 text-center">Mot de passe oublié</h2>
          {message && <div className="mb-4 text-green-600">{message}</div>}
          {error && <div className="mb-4 text-red-600">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
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
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700"
            >
              {loading ? "Envoi..." : "Envoyer"}
            </button>
          </form>
          <div className="mt-4 text-center">
            <Link to="/login" className="text-green-600 hover:underline">Retour à la connexion</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
