import { useEffect, useState } from "react";
import { X, MapPinned, FileText, Building2, Loader2 } from "lucide-react";
import getPrescription from "../../services/api/prescriptionService";

const isOutsideZonage = (data) => {
  if (!data) return true;
  return !(
    data.zonage2035?.trim() ||
    data.reglement?.trim() ||
    data.region?.trim() ||
    data.commune?.trim() ||
    data.fokontany?.trim()
  );
};

export default function ZoneInfoModal({ isOpen, onClose, lng, lat }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Convertir lng/lat en nombres pour éviter des erreurs
  const parsedLng = parseFloat(lng);
  const parsedLat = parseFloat(lat);

  useEffect(() => {
    if (!isOpen || isNaN(parsedLng) || isNaN(parsedLat)) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setData(null);

      try {
        const result = await getPrescription(parsedLng, parsedLat);
        // Vérifier que c'est bien un objet
        if (result && typeof result === "object") {
          setData(result);
        } else {
          setData({});
        }
      } catch (err) {
        console.error("Erreur récupération zone :", err);
        setError("Impossible de récupérer les informations de la zone.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isOpen, parsedLng, parsedLat]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MapPinned size={24} />
            <h2 className="text-xl font-bold">Informations de la zone</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {loading && (
            <div className="flex flex-col items-center justify-center py-12 text-blue-600 gap-3">
              <Loader2 className="animate-spin" size={32} />
              <span className="text-sm">Chargement des informations...</span>
            </div>
          )}

          {!loading && error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded text-red-700">{error}</div>
          )}

          {!loading && data && isOutsideZonage(data) && (
            <div className="flex flex-col items-center justify-center text-center py-12">
              <MapPinned size={48} className="text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Aucune information sur la zone</h3>
              <p className="text-sm text-gray-500 max-w-md">
                Les coordonnées sélectionnées ne sont pas incluses dans un zonage réglementaire connu.
              </p>
            </div>
          )}

          {!loading && data && !isOutsideZonage(data) && (
            <div className="space-y-6">
              {data.zonage2035 && (
                <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 size={20} className="text-blue-600" />
                    <h3 className="font-semibold text-gray-800">Zonaging</h3>
                  </div>
                  <p className="text-lg font-medium text-blue-900">{data.zonage2035}</p>
                </div>
              )}

              {data.reglement && (
                <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded-r-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText size={20} className="text-green-600" />
                    <h3 className="font-semibold text-gray-800">Prescription d'urbanisme</h3>
                  </div>
                  <div className="space-y-2 text-gray-700">
                    {data.reglement.split(" / ").map((r, i) => (
                      <div key={i} className="flex gap-2">
                        <span className="text-green-600 font-bold">•</span>
                        <span>{r}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {["region", "commune", "fokontany"].map(
                  (key) =>
                    data[key] && (
                      <div key={key} className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-xs uppercase text-gray-500 font-semibold mb-1">{key}</p>
                        <p className="text-gray-800 font-medium">{data[key]}</p>
                      </div>
                    )
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
