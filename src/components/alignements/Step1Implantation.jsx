import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const [regions, setRegions] = useState(parentRegions);
  const [communes, setCommunes] = useState(parentCommunes);
  const [isMobile, setIsMobile] = useState(false);

  // Détecter la taille de l'écran
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Charger toutes les régions au montage
  useEffect(() => {
    const loadRegions = async () => {
      try {
        const regionsData = await territoireService.getRegions();
        setRegions(regionsData.data || []);
      } catch (error) {
        console.error(t('alignment.erreur_chargement_regions'), error);
        setRegions([]);
      }
    };
    loadRegions();
  }, [t]);

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
        console.error(t('alignment.erreur_chargement_communes'), error);
        setCommunes([]);
      }
    };
    loadCommunes();
  }, [selectedRegion, t]);

  return (
    <div className="w-full">
      <h3 className="text-lg sm:text-xl font-medium text-gray-800 mb-4 sm:mb-6 md:mb-8">
        {t('alignment.choix_implantation')}
      </h3>
      
      <div className="space-y-4 sm:space-y-6">
        {/* Région */}
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            {t('alignment.choix_implantation')}
          </label>
          <div className="relative w-full">
            {!selectedRegion && (
              <span className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400 pointer-events-none text-sm sm:text-base">
                {t('alignment.selectionnez_region')}
              </span>
            )}
            <select
              value={selectedRegion || ""}
              onChange={(e) => {
                setSelectedRegion(e.target.value);
                setSelectedCommune(""); // reset commune
              }}
              className="w-full p-2 sm:p-3 pr-10 border border-gray-300 rounded-md appearance-none bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
              style={{
                height: isMobile ? '44px' : '48px'
              }}
            >
              <option value="" hidden></option>
              {regions.map((reg) => (
                <option 
                  key={reg.region_id} 
                  value={reg.formatted_id}
                  className="text-sm sm:text-base"
                >
                  {reg.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Commune */}
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            {t('alignment.specifiez_commune')}
          </label>
          <div className="relative w-full">
            {!selectedCommune && (
              <span className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400 pointer-events-none text-sm sm:text-base">
                {t('alignment.selectionnez_commune')}
              </span>
            )}
            <select
              value={selectedCommune || ""}
              onChange={(e) => setSelectedCommune(e.target.value)}
              className="w-full p-2 sm:p-3 pr-10 border border-gray-300 rounded-md appearance-none bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
              disabled={!selectedRegion}
              style={{
                height: isMobile ? '44px' : '48px'
              }}
            >
              <option value="" hidden></option>
              {communes.map((commune) => (
                <option 
                  key={commune.commune_id} 
                  value={commune.commune_id}
                  className="text-sm sm:text-base"
                >
                  {commune.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none" />
          </div>
          
          {/* Message d'information si région non sélectionnée */}
          {!selectedRegion && (
            <p className="mt-1 text-xs text-gray-500">
              {t('alignment.select_region_first') || "Veuillez d'abord sélectionner une région"}
            </p>
          )}
        </div>
      </div>
      
      {/* Indicateur de chargement pour mobile */}
      {isMobile && selectedRegion && communes.length === 0 && (
        <div className="mt-2 flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500 mr-2"></div>
          <span className="text-xs text-gray-500">
            {t('alignment.loading_communes') || "Chargement des communes..."}
          </span>
        </div>
      )}
    </div>
  );
};

export default Step1Implantation;