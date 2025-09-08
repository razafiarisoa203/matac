import { useState, useEffect } from 'react';
import { territoireService } from '../services/api';

// Hook personnalisé pour gérer les régions et communes
export const useRegionsCommunes = () => {
  const [regions, setRegions] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedCommune, setSelectedCommune] = useState("");

  // Fetch regions au chargement
  useEffect(() => {
    const loadRegions = async () => {
      const regionsData = await territoireService.getRegions();
      setRegions(regionsData);
    };
    loadRegions();
  }, []);

  // Fetch communes quand une région est sélectionnée
  useEffect(() => {
    const loadCommunes = async () => {
      if (selectedRegion) {
        const communesData = await territoireService.getCommunes(selectedRegion);
        setCommunes(communesData);
      } else {
        setCommunes([]);
      }
    };
    loadCommunes();
  }, [selectedRegion]);

  return {
    regions,
    communes,
    selectedRegion,
    selectedCommune,
    setSelectedRegion,
    setSelectedCommune
  };
};
