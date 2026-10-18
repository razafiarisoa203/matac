import axiosConfig from "./axios.config";

export const constructionService = {
  async getConstructionMandataire(id_mandataire) {
    if (!id_mandataire || id_mandataire === "undefined" || id_mandataire === "null") {
      console.warn("[constructionService] id_mandataire invalide:", id_mandataire);
      return [];
    }

    try {
      const response = await axiosConfig.get(
        `/serviceconstruction/construction/by-mandataire/${encodeURIComponent(id_mandataire)}`
      );
      const data = response.data;
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.constructions)) return data.constructions;
      if (Array.isArray(data?.data)) return data.data;
      return [];
    } catch (error) {
      if (error.response?.status === 404) {
        return [];
      }
      console.error("Erreur lors de la récupération des constructions:", error);
      throw error;
    }
  },
  
  async getConstructionDetails(id) {
    try {
      const response = await axiosConfig.get(`/serviceconstruction/construction/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des détails:', error);
      throw error;
    }
  },

  async generateConstructionPDF(id) {
    try {
      const response = await axiosConfig.get(`/serviceconstruction/construction/${id}/pdf`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      throw error;
    }
  },

  async updateConstructionStatus(id, status) {
    try {
      const response = await axiosConfig.patch(`/serviceconstruction/construction/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      throw error;
    }
  },

  async createConstruction(constructionData) {
    try {
      const response = await axiosConfig.post('/serviceconstruction/construction', constructionData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la construction:', error);
      throw error;
    }
  },

  async getConstructionById(id) {
    try {
      const response = await axiosConfig.get(`/serviceconstruction/construction/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de la construction:', error);
      throw error;
    }
  },

  async getConstructionByReferenceAlignement(referenceAlignement) {
    if (!referenceAlignement) return null;

    try {
      const response = await axiosConfig.get(
        `/serviceconstruction/construction/by-reference/${encodeURIComponent(referenceAlignement)}`
      );
      return response.data?.data ?? response.data ?? null;
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      console.error("Erreur lors de la récupération de la construction:", error);
      throw error;
    }
  },

  async updateConstruction(id, constructionData) {
    try {
      const response = await axiosConfig.put(`/serviceconstruction/construction/${id}`, constructionData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la construction:', error);
      throw error;
    }
  },

  async deleteConstruction(id) {
    try {
      const response = await axiosConfig.delete(`/serviceconstruction/construction/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression de la construction:', error);
      throw error;
    }
  },

  async submitPermisConstruction(permisData) {
    try {
      console.log('Envoi des données de permis de construction:', permisData);

      const submissionData = this.prepareConstructionData(permisData);
      this.validateConstructionData(submissionData);

      const response = await axiosConfig.post('/serviceconstruction/construction', submissionData);

      console.log('Réponse du serveur:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la soumission du permis:', error);
      throw error;
    }
  },

  prepareConstructionData(permisData) {
    // Supporte à la fois un format imbriqué { formData, pieces, uploadedFiles } ou plat
    const formData = permisData.formData || permisData;
    const pieces = permisData.pieces || formData.pieces || [];
    const uploadedFiles = permisData.uploadedFiles || formData.uploadedFiles || {};

    const transformRadioToBoolean = (value) => {
      if (value === 'Oui') return true;
      if (value === 'Non') return false;
      return value;
    };

    const cleanedPieces = pieces
      .filter(piece =>
        piece.destination || piece.niveau || piece.surface ||
        piece.surfaceOuverture || piece.hauteurLinteaux || piece.hauteurPlafond
      )
      .map((piece) => ({
        niveau: piece.niveau ? parseInt(piece.niveau) || 0 : 0,
        destination: piece.destination || 'Non spécifié',
        surface: piece.surface ? parseFloat(piece.surface) || 0 : 0,
        surfaceOuverture: piece.surfaceOuverture ? parseFloat(piece.surfaceOuverture) || 0 : 0,
        hauteurLinteaux: piece.hauteurLinteaux ? parseFloat(piece.hauteurLinteaux) || 0 : 0,
        hauteurPlafond: piece.hauteurPlafond ? parseFloat(piece.hauteurPlafond) || 0 : 0
      }));

    const cleanNumber = (value) => {
      if (value === '' || value === null || value === undefined) return undefined;
      const num = parseFloat(value);
      return isNaN(num) ? undefined : num;
    };

    const getUploadedFilenames = (fileType) => {
      if (!uploadedFiles[fileType] || !Array.isArray(uploadedFiles[fileType])) {
        return [];
      }
      return uploadedFiles[fileType]
        .map(file => file.filename || file.name)
        .filter(filename => filename && filename.trim() !== '');
    };

    const baseData = {
      natureTravaux: formData.natureTravaux,
      typeAffectation: formData.typeAffectation,
      referenceAlignement: formData.referenceAlignement,

      civiliteProprietaire: formData.civiliteProprietaire,
      nomProprietaire: formData.nomProprietaire,
      telProprietaire: formData.telProprietaire,
      emailProprietaire: formData.emailProprietaire,
      cinProprietaire: formData.cinProprietaire,
      adresseProprietaire: formData.adresseProprietaire,

      auteurOuvrage: formData.auteurOuvrage,
      nomAuteur: formData.nomAuteur,
      fonctionAuteur: formData.fonctionAuteur,
      numeroOrdreAuteur: formData.numeroOrdreAuteur,
      telAuteur: formData.telAuteur,
      emailAuteur: formData.emailAuteur,
      adresseAuteur: formData.adresseAuteur,
      zoneImplantation: formData.zoneImplantation,
      materiaux: formData.materiaux,
      dureeTravaux: cleanNumber(formData.dureeTravaux),
      montantTravaux: cleanNumber(formData.montantTravaux),
      longueurProjet: cleanNumber(formData.longueurProjet),
      largeurProjet: cleanNumber(formData.largeurProjet),
      hauteurProjet: cleanNumber(formData.hauteurProjet),

      surfaceTerrain: cleanNumber(formData.surfaceTerrain),
      empriseSolExistant: cleanNumber(formData.empriseSolExistant),
      empriseSol: cleanNumber(formData.empriseSol),
      cesProjet: cleanNumber(formData.cesProjet),
      surfacePlancherExistant: cleanNumber(formData.surfacePlancherExistant),
      surfacePlancherProjet: cleanNumber(formData.surfacePlancherProjet),
      surfaceVerte: cleanNumber(formData.surfaceVerte),
      niveauRPlus: cleanNumber(formData.niveauRPlus),

      distanceCheminPublic: cleanNumber(formData.distanceCheminPublic),
      distanceSentierPublic: cleanNumber(formData.distanceSentierPublic),
      distanceRouteNationale: cleanNumber(formData.distanceRouteNationale),
      distanceRiviere: cleanNumber(formData.distanceRiviere),
      distanceCanalPublic: cleanNumber(formData.distanceCanalPublic),
      distanceInstallationEnergie: cleanNumber(formData.distanceInstallationEnergie),
      distanceLigneElectrique: cleanNumber(formData.distanceLigneElectrique),
      distanceProjetLimitePropriete: cleanNumber(formData.distanceProjetLimitePropriete),
      distanceMinimaleProjetConstructionExistante: cleanNumber(formData.distanceMinimaleProjetConstructionExistante),

      equipementEau: transformRadioToBoolean(formData.equipementEau),
      equipementElectricite: transformRadioToBoolean(formData.equipementElectricite),
      equipementAssainissement: transformRadioToBoolean(formData.equipementAssainissement),
      equipementVoieAcces: transformRadioToBoolean(formData.equipementVoieAcces),

      pieces: cleanedPieces.length > 0 ? cleanedPieces : undefined,
      pieceSousSol: transformRadioToBoolean(formData.pieceSousSol),

      existantVhVb: transformRadioToBoolean(formData.existantVhVb),
      existantTerasse: transformRadioToBoolean(formData.existantTerasse),
      existantGardeCorp: transformRadioToBoolean(formData.existantGardeCorp),
      nbrVeranda: cleanNumber(formData.nbrVeranda),
      nbrCouloir: cleanNumber(formData.nbrCouloir),
      nbrEscalier: cleanNumber(formData.nbrEscalier),
      nbrServitude: cleanNumber(formData.nbrServitude),

      existantBranchementEauPublic: transformRadioToBoolean(formData.existantBranchementEauPublic),
      utilisationFosseEptique: transformRadioToBoolean(formData.utilisationFosseEptique),
      typeFosseEptique: formData.typeFosseEptique,
      evacuationEauxPluviales: cleanNumber(formData.evacuationEauxPluviales),
      nbrUsageFosse: cleanNumber(formData.nbrUsageFosse),
      capaciteFosse: cleanNumber(formData.capaciteFosse),
      utilisationPuisard: transformRadioToBoolean(formData.utilisationPuisard),
      puisardAuFondation: cleanNumber(formData.puisardAuFondation),
      presentationGoutiere: transformRadioToBoolean(formData.presentationGoutiere),
      presentationRegardCollecte: transformRadioToBoolean(formData.presentationRegardCollecte),

      planTerrain: getUploadedFilenames('planTerrain'),
      droitPropriete: getUploadedFilenames('droitPropriete'),
      planLimiteTerrain: getUploadedFilenames('planLimiteTerrain'),
      planMasse: getUploadedFilenames('planMasse'),
      planFacade: getUploadedFilenames('planFacade'),

      uploadedFilesInfo: this.prepareUploadedFilesInfo(uploadedFiles),

      id_align: 1,
      id_terrain: 1
    };

    // Ne supprimer que les propriétés non requises si elles sont vides/undefined
    Object.keys(baseData).forEach(key => {
      if (baseData[key] === undefined ||
        (baseData[key] === '' && !['nomProprietaire', 'cinProprietaire', 'natureTravaux', 'typeAffectation'].includes(key)) ||
        (Array.isArray(baseData[key]) && baseData[key].length === 0)) {
        delete baseData[key];
      }
    });

    console.log('Données préparées pour envoi:', baseData);
    return baseData;
  },

  prepareUploadedFilesInfo(uploadedFiles) {
    const filesInfo = {};

    Object.keys(uploadedFiles).forEach(fileType => {
      if (uploadedFiles[fileType] && Array.isArray(uploadedFiles[fileType])) {
        filesInfo[fileType] = uploadedFiles[fileType].map(file => ({
          originalName: file.name,
          serverFilename: file.filename,
          size: file.size,
          type: file.type,
          uploadDate: file.uploadDate || new Date().toISOString(),
          url: file.url
        }));
      }
    });

    return Object.keys(filesInfo).length > 0 ? filesInfo : undefined;
  },

  validateConstructionData(data) {
    console.log('Validation des données:', data);

    if (data.pieces && Array.isArray(data.pieces)) {
      data.pieces.forEach((piece, index) => {
        if (!piece.destination || typeof piece.destination !== 'string') {
          throw new Error(`La pièce ${index + 1} doit avoir une destination valide`);
        }
        if (typeof piece.niveau !== 'number' || isNaN(piece.niveau)) {
          throw new Error(`La pièce ${index + 1} doit avoir un niveau valide`);
        }
        if (typeof piece.surface !== 'number' || isNaN(piece.surface)) {
          throw new Error(`La pièce ${index + 1} doit avoir une surface valide`);
        }
      });
    }

    const requiredFields = ['nomProprietaire', 'cinProprietaire', 'natureTravaux', 'typeAffectation'];
    const missingFields = requiredFields.filter(field => !data[field]);

    if (missingFields.length > 0) {
      throw new Error(`Champs requis manquants: ${missingFields.join(', ')}`);
    }

    if (data.emailProprietaire && !this.isValidEmail(data.emailProprietaire)) {
      throw new Error('L\'email du propriétaire n\'est pas valide');
    }

    if (data.emailAuteur && !this.isValidEmail(data.emailAuteur)) {
      throw new Error('L\'email de l\'auteur n\'est pas valide');
    }

    return true;
  },

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
};