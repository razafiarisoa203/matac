import { useTranslation } from 'react-i18next';
import { ChevronDown, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { territoireService } from "../../services/api/territoireService";
import Select from "react-select";

const Step1Implantation = ({
  selectedRegion,
  selectedCommune,
  setSelectedRegion,
  setSelectedCommune
}) => {
  const { t } = useTranslation();
  const [regions, setRegions] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [loadingRegions, setLoadingRegions] = useState(true);
  const [loadingCommunes, setLoadingCommunes] = useState(false);
  const [error, setError] = useState('');

  // Charger les régions
  useEffect(() => {
    const loadRegions = async () => {
      try {
        setLoadingRegions(true);
        setError('');
        
        const regionsData = await territoireService.getRegions();
        console.log('Régions chargées:', regionsData.length);
        
        if (regionsData.length === 0) {
          setError('Aucune région disponible');
        }
        
        setRegions(regionsData);
        
      } catch (err) {
        console.error('Erreur chargement régions:', err);
        setError('Erreur lors du chargement des régions');
        setRegions([]);
      } finally {
        setLoadingRegions(false);
      }
    };
    
    loadRegions();
  }, []);

  // Charger les communes quand la région change
  useEffect(() => {
    if (!selectedRegion) {
      setCommunes([]);
      setSelectedCommune('');
      return;
    }
    
    const loadCommunes = async () => {
      try {
        setLoadingCommunes(true);
        setError('');
        
        console.log('Chargement communes pour région:', selectedRegion);
        
        const communesData = await territoireService.getCommunesByRegion(selectedRegion);
        console.log('Communes chargées:', communesData.length);
        
        // Si aucune commune, chercher le nom de la région pour le message
        if (communesData.length === 0) {
          const regionName = regions.find(r => 
            r.formatted_id === selectedRegion || 
            r.region_id === selectedRegion
          )?.name || selectedRegion;
          
          setError(`Aucune commune trouvée pour la région: ${regionName}`);
        }
        
        setCommunes(communesData);
        setSelectedCommune('');
        
      } catch (err) {
        console.error('Erreur chargement communes:', err);
        setError('Erreur lors du chargement des communes');
        setCommunes([]);
      } finally {
        setLoadingCommunes(false);
      }
    };
    
    // Délai pour éviter les appels trop rapides
    const timer = setTimeout(loadCommunes, 300);
    return () => clearTimeout(timer);
    
  }, [selectedRegion, regions, setSelectedCommune]);

  return (
    <div className="w-full">
      <h3 className="text-lg sm:text-xl font-medium text-gray-800 mb-6">
        {t('alignment.choix_implantation') || "Choix d'implantation"}
      </h3>
      
      {/* Message d'erreur global */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      
      <div className="space-y-6">

      {/* Sélection Région */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Région *
        </label>

        {loadingRegions ? (
          <div className="flex items-center h-12 border border-green-300 rounded-md px-3 bg-green-50">
            <Loader2 className="animate-spin h-5 w-5 text-green-500 mr-2" />
            <span className="text-sm text-gray-600">Chargement des régions...</span>
          </div>
        ) : (
          <Select 
            options={regions.map(region => ({
              value: region.formatted_id || region.region_id || region.id,
              label: region.name
            }))}
            onChange={(option) => {
              console.log("Région sélectionnée:", option.value);
              setSelectedRegion(option.value);
            }}
            placeholder="Sélectionnez une région"
            isSearchable
            classNamePrefix="react-select"
          />
        )}
      </div>
        
      {/* Sélection Commune */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Commune *
        </label>

        {!selectedRegion ? (
          <div className="h-12 border border-green-300 rounded-md bg-green-50 flex items-center justify-center">
            <span className="text-sm text-gray-500">
              Sélectionnez d'abord une région
            </span>
          </div>
        ) : loadingCommunes ? (
          <div className="flex items-center h-12 border border-green-300 rounded-md px-3 bg-green-50">
            <Loader2 className="animate-spin h-5 w-5 text-green-500 mr-2" />
            <span className="text-sm text-gray-600">
              Chargement des communes...
            </span>
          </div>
        ) : communes.length === 0 ? (
          <div className="h-12 border border-green-200 rounded-md bg-green-50 flex items-center justify-center">
            <span className="text-sm text-yellow-700">
              Aucune commune disponible pour cette région
            </span>
          </div>
        ) : (
          <Select
            options={communes.map(commune => ({
              value: commune.formatted_id || commune.commune_id || commune.id,
              label: commune.name
            }))}
            value={
              selectedCommune
                ? {
                    value: selectedCommune,
                    label: communes.find(c =>
                      (c.formatted_id || c.commune_id || c.id) === selectedCommune
                    )?.name
                  }
                : null
            }
            onChange={(option) => {
              console.log("Commune sélectionnée:", option.value);
              setSelectedCommune(option.value);
            }}
            placeholder="Sélectionnez une commune"
            isSearchable
            isDisabled={!selectedRegion}
            classNamePrefix="react-select"
          />
        )}
      </div>

      </div>
    
    </div>
  );
};

export default Step1Implantation;