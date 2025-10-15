import { useEffect, useState } from "react";
import { territoireService } from "../../services/api/territoireService";
import { Loader2 } from "lucide-react";

const Step1Implantation = ({
  selectedRegion,
  selectedCommune,
  setSelectedRegion,
  setSelectedCommune,
}) => {
  const [regions, setRegions] = useState({});
  const [communes, setCommunes] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCommunes = async () => {
      try {
        setLoading(true);
        const data = await territoireService.getUserCommuneName();
        console.log("Communes chargées :", data);

        if (data) {
          setCommunes(data);
          setSelectedCommune(data.name);
          setRegions(data.region);
          setSelectedRegion(data.region?.name);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des communes :", error);
        setCommunes({});
      } finally {
        setLoading(false);
      }
    };

    loadCommunes();
  }, [setSelectedCommune, setSelectedRegion]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <Loader2 className="w-10 h-10 animate-spin text-green-600 mb-3" />
        <p className="text-gray-600">Chargement en cours...</p>
      </div>
    );
  }

  return (
    <>
      <h3 className="text-xl font-medium text-gray-800 mb-8">
        Implantation
      </h3>

      <div className="space-y-6">
        {/* Région */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Région du compte
          </label>
          <input
            type="text"
            value={regions.name || ""}
            readOnly
            className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 
              focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* Commune */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Commune enregistré
          </label>
          <input
            type="text"
            value={communes.name || ""}
            readOnly
            className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 
              focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>
    </>
  );
};

export default Step1Implantation;