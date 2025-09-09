import { useState, useEffect } from "react";
import { ArrowRight, Loader2 } from "lucide-react";

export default function CINVerificationForm({ onVerify, isVerifying, verificationError }) {
  const [cin, setCin] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset loading state when verificationError changes
  useEffect(() => {
    if (verificationError) {
      setError(verificationError);
      setIsSubmitting(false);
    }
  }, [verificationError]);

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Remove non-digits
    if (value.length <= 12) {
      setCin(value);
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (cin.length !== 12) {
      setError("Le numéro CIN doit contenir 12 chiffres");
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError("");
      await onVerify(cin);
    } catch (err) {
      console.error("Verification error:", err);
      setError("Une erreur est survenue lors de la vérification");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-white mb-2">Vérification CIN</h2>
        <p className="text-sm text-blue-100">
          Veuillez entrer votre numéro de carte d'identité nationale
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="cin" className="block text-sm font-medium text-white mb-1">
            Numéro CIN <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="cin"
            value={cin}
            onChange={handleChange}
            placeholder="Entrez votre numéro CIN"
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isSubmitting || isVerifying}
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={12}
            required
          />
          {error && (
            <p className="mt-1 text-sm text-red-300">{error}</p>
          )}
        </div>

        <div>
          <button
            type="submit"
            disabled={isSubmitting || isVerifying}
            className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting || isVerifying ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                Vérification en cours...
              </>
            ) : (
              <>
                Vérifier mon identité
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </button>
        </div>

        <p className="text-xs text-center text-blue-100 mt-4">
          En continuant, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
        </p>
      </form>
    </div>
  );
}
