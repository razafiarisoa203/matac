// Fonctions utilitaires pour la validation des formulaires

export const validateForm = (formData, statutProprietaire, qualiteDemandeur) => {
  if (statutProprietaire === "particulier") {
    if (qualiteDemandeur === "proprietaire") {
      return formData.civilite && formData.nom && formData.prenoms && 
             formData.cinPasseport && formData.nationalite;
    } else if (qualiteDemandeur === "mandataire") {
      return formData.civilite && formData.nom && formData.prenoms && 
             formData.cinPasseport && formData.nationalite &&
             formData.civilite2 && formData.nom2 && formData.prenoms2 && 
             formData.cinPasseport2 && formData.nationalite2;
    }
  } else if (statutProprietaire === "personne_morale") {
    return formData.raisonSociale && formData.carteStatistique &&
           formData.civiliteRepresentant && formData.nomRepresentant && 
           formData.prenomsRepresentant && formData.cinPasseportRepresentant;
  }
  return false;
};

export const validateTerrainForm = (formData, statutTerrain) => {
  const baseFields = formData.nom_proprietaire && formData.adresse && 
                    formData.superficie && formData.fokotany;
  
  if (statutTerrain === "titre") {
    return baseFields && formData.num_titre && formData.indice;
  } else if (statutTerrain === "cadastre") {
    return baseFields && formData.num_parcelle && formData.section_dite && 
           formData.canton;
  } else if (statutTerrain === "karatany") {
    return baseFields && formData.num_karatany;
  }
  return false;
};

export const validateAlignmentForm = (formData) => {
  return formData.longitude && formData.latitude;
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[0-9+\-\s()]+$/;
  return phoneRegex.test(phone) && phone.length >= 8;
};
