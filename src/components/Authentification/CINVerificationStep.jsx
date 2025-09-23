import { useState } from "react";
import { User, ArrowRight } from "lucide-react";

export default function CINVerificationStep({ onVerify, isVerifying, error: propError }) {
  const [cin, setCin] = useState("");
  const [localError, setLocalError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cin.trim()) {
      setLocalError("Veuillez saisir votre numéro CIN");
      return;
    }
    if (!/^[A-Za-z0-9]+$/.test(cin)) {
      setLocalError("Le numéro CIN ne doit contenir que des lettres et des chiffres");
      return;
    }
    onVerify(cin);
  };

  const handleChange = (e) => {
  const value = e.target.value;
  
  // N'autoriser que les chiffres
  const numericValue = value.replace(/[^0-9]/g, '');
  
  // Limiter à 12 caractères maximum
  if (numericValue.length <= 12) {
    setCin(numericValue);
    setLocalError(""); // Effacer les erreurs locales quand l'utilisateur tape
  }
}
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Vérification d'identité</h2>
        <p className="mt-2 text-gray-600">
          Veuillez saisir votre numéro de carte d'identité nationale
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="cin" className="block text-sm font-medium text-gray-700 mb-1">
            Numéro CIN <span className="text-red-500">*</span>
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="cin"
              value={cin}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Votre numéro CIN"
              autoComplete="off"
            />
          </div>
          {(propError || localError) && (
            <p className="mt-1 text-sm text-red-600">
              {propError || localError}
            </p>
          )}
        </div>

        <div>
          <button
            type="submit"
            disabled={isVerifying}
            className="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isVerifying ? (
              "Vérification en cours..."
            ) : (
              <>
                Vérifier mon identité
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </form>

      <div className="text-center text-sm text-gray-500 mt-4">
        <p>Cette vérification permet de sécuriser votre inscription.</p>
      </div>
    </div>
  );
}
