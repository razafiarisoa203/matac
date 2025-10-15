import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { territoireService } from "../../services/api/territoireService";

const Step1Implantation = ({
  regions: parentRegions = [],
  communes: parentCommunes = [],
  selectedRegion,
  selectedCommune,
  setSelectedRegion,
  setSelectedCommune
}) => {
  const [regions, setRegions] = useState(parentRegions);
  const [communes, setCommunes] = useState(parentCommunes);

  // Charger toutes les régions au montage
  useEffect(() => {
    const loadRegions = async () => {
      try {
        const regionsData = await territoireService.getRegions();
        setRegions(regionsData.data || []);
      } catch (error) {
        console.error("Erreur lors du chargement des régions :", error);
        setRegions([]);
      }
    };
    loadRegions();
  }, []);

  // Charger les communes lorsque la région change
  useEffect(() => {
    if (!selectedRegion) {
      setCommunes([]);
      return;
    }

    const loadCommunes = async () => {
      try {
        const communesData = await territoireService.getCommunesByRegion(selectedRegion);
        setCommunes(communesData.data || []);
      } catch (error) {
        console.error("Erreur lors du chargement des communes :", error);
        setCommunes([]);
      }
    };
    loadCommunes();
  }, [selectedRegion]);

  return (
    <>
      <h3 className="text-xl font-medium text-gray-800 mb-8">
        Choix d'implantation
      </h3>
      <div className="space-y-6">
        {/* Région */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Spécifiez la Région
          </label>
          <div className="relative">
            {!selectedRegion && (
              <span className="absolute top-3 left-3 text-gray-400 pointer-events-none">
                Sélectionnez la Région
              </span>
            )}
            <select
              value={selectedRegion || ""}
              onChange={(e) => {
                setSelectedRegion(e.target.value);
                setSelectedCommune(""); // reset commune
              }}
              className="w-full p-3 border border-gray-300 rounded-md appearance-none bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="" hidden></option>
              {regions.map((reg) => (
                <option key={reg.region_id} value={reg.formatted_id}>
                  {reg.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Commune */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Spécifiez la Commune
          </label>
          <div className="relative">
            {!selectedCommune && (
              <span className="absolute top-3 left-3 text-gray-400 pointer-events-none">
                Sélectionnez la commune
              </span>
            )}
            <select
              value={selectedCommune || ""}
              onChange={(e) => setSelectedCommune(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md appearance-none bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              disabled={!selectedRegion}
            >
              <option value="" hidden></option>
              {communes.map((commune) => (
                <option key={commune.commune_id} value={commune.commune_id}>
                  {commune.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Step1Implantation;