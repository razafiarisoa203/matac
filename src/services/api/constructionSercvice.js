import axiosConfig from "./axios.config";

// Service Construction (complété)
export const constructionService = {
    // Récupérer toutes les constructions
    async getConstruction() {
      try {
        const response = await axiosConfig.get('/serviceconstruction/construction');
        return response.data;
      } catch (error) {
        console.error('Erreur lors de la récupération des constructions:', error);
        throw error;
      }
    },
  
    // Récupérer une construction par ID avec tous les détails
    async getConstructionDetails(id) {
      try {
        const response = await axiosConfig.get(`/serviceconstruction/construction/${id}`);
        return response.data;
      } catch (error) {
        console.error('Erreur lors de la récupération des détails:', error);
        throw error;
      }
    },
  
    // Générer un PDF pour une construction
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
  
    // Mettre à jour le statut d'une construction
    async updateConstructionStatus(id, status) {
      try {
        const response = await axiosConfig.patch(`/serviceconstruction/construction/${id}/status`, { status });
        return response.data;
      } catch (error) {
        console.error('Erreur lors de la mise à jour du statut:', error);
        throw error;
      }
    },
  
    // Créer une nouvelle construction
    async createConstruction(constructionData) {
      try {
        const response = await axiosConfig.post('/serviceconstruction/construction', constructionData);
        return response.data;
      } catch (error) {
        console.error('Erreur lors de la création de la construction:', error);
        throw error;
      }
    },
  
    // Récupérer une construction par ID
    async getConstructionById(id) {
      try {
        const response = await axiosConfig.get(`/serviceconstruction/construction/${id}`);
        return response.data;
      } catch (error) {
        console.error('Erreur lors de la récupération de la construction:', error);
        throw error;
      }
    },
  
    // Mettre à jour une construction
    async updateConstruction(id, constructionData) {
      try {
        const response = await axiosConfig.put(`/serviceconstruction/construction/${id}`, constructionData);
        return response.data;
      } catch (error) {
        console.error('Erreur lors de la mise à jour de la construction:', error);
        throw error;
      }
    },
  
    // Supprimer une construction
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
  
        // Préparer les données pour l'API avec validation renforcée
        const submissionData = this.prepareConstructionData(permisData);
  
        // Valider les données avant envoi
        this.validateConstructionData(submissionData);
  
        const response = await axiosConfig.post('/serviceconstruction/construction', submissionData);
  
        console.log('Réponse du serveur:', response.data);
        return response.data;
      } catch (error) {
        console.error('Erreur lors de la soumission du permis:', error);
        throw error;
      }
    },
  
    // Méthode pour préparer les données au format attendu par le backend
    prepareConstructionData(permisData) {
      const {
        formData = {},
        pieces = [],
        uploadedFiles = {} // Maintenant on utilise uploadedFiles au lieu de files
      } = permisData;
  
      // Transformer les données radio en boolean
      const transformRadioToBoolean = (value) => {
        if (value === 'Oui') return true;
        if (value === 'Non') return false;
        return value;
      };
  
      // Nettoyer et valider les pièces - MAINTENANT OPTIONNEL
      const cleanedPieces = pieces
        .filter(piece =>
          // Ne garder que les pièces qui ont au moins un champ rempli
          piece.destination || piece.niveau || piece.surface ||
          piece.surfaceOuverture || piece.hauteurLinteaux || piece.hauteurPlafond
        )
        .map((piece, index) => {
          // S'assurer que toutes les propriétés requises existent
          const cleanedPiece = {
            niveau: piece.niveau ? parseInt(piece.niveau) || 0 : 0,
            destination: piece.destination || 'Non spécifié',
            surface: piece.surface ? parseFloat(piece.surface) || 0 : 0,
            surfaceOuverture: piece.surfaceOuverture ? parseFloat(piece.surfaceOuverture) || 0 : 0,
            hauteurLinteaux: piece.hauteurLinteaux ? parseFloat(piece.hauteurLinteaux) || 0 : 0,
            hauteurPlafond: piece.hauteurPlafond ? parseFloat(piece.hauteurPlafond) || 0 : 0
          };
  
          return cleanedPiece;
        });
  
      // Fonction pour nettoyer les valeurs numériques
      const cleanNumber = (value) => {
        if (value === '' || value === null || value === undefined) return undefined;
        const num = parseFloat(value);
        return isNaN(num) ? undefined : num;
      };
  
      // Fonction pour extraire les noms de fichiers uploadés
      const getUploadedFilenames = (fileType) => {
        if (!uploadedFiles[fileType] || !Array.isArray(uploadedFiles[fileType])) {
          return [];
        }
  
        return uploadedFiles[fileType]
          .map(file => file.filename || file.name) // Utiliser filename du serveur ou name du fichier
          .filter(filename => filename && filename.trim() !== ''); // Filtrer les noms vides
      };
  
      // Préparer les données de base
      const baseData = {
        // Section 1: Identification
        natureTravaux: formData.natureTravaux,
        typeAffectation: formData.typeAffectation,
        referenceAlignement: formData.referenceAlignement,
  
        // Propriétaire
        civiliteProprietaire: formData.civiliteProprietaire,
        nomProprietaire: formData.nomProprietaire,
        telProprietaire: formData.telProprietaire,
        emailProprietaire: formData.emailProprietaire,
        cinProprietaire: formData.cinProprietaire,
        adresseProprietaire: formData.adresseProprietaire,
  
        // Section 2: Renseignement architectural
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
  
        // Section 3: Renseignement technique
        surfaceTerrain: cleanNumber(formData.surfaceTerrain),
        empriseSolExistant: cleanNumber(formData.empriseSolExistant),
        empriseSol: cleanNumber(formData.empriseSol),
        cesProjet: cleanNumber(formData.cesProjet),
        surfacePlancherExistant: cleanNumber(formData.surfacePlancherExistant),
        surfacePlancherProjet: cleanNumber(formData.surfacePlancherProjet),
        surfaceVerte: cleanNumber(formData.surfaceVerte),
        niveauRPlus: cleanNumber(formData.niveauRPlus),
  
        // Distances
        distanceCheminPublic: cleanNumber(formData.distanceCheminPublic),
        distanceSentierPublic: cleanNumber(formData.distanceSentierPublic),
        distanceRouteNationale: cleanNumber(formData.distanceRouteNationale),
        distanceRiviere: cleanNumber(formData.distanceRiviere),
        distanceCanalPublic: cleanNumber(formData.distanceCanalPublic),
        distanceInstallationEnergie: cleanNumber(formData.distanceInstallationEnergie),
        distanceLigneElectrique: cleanNumber(formData.distanceLigneElectrique),
        distanceProjetLimitePropriete: cleanNumber(formData.distanceProjetLimitePropriete),
        distanceMinimaleProjetConstructionExistante: cleanNumber(formData.distanceMinimaleProjetConstructionExistante),
  
        // Équipements terrain
        equipementEau: transformRadioToBoolean(formData.equipementEau),
        equipementElectricite: transformRadioToBoolean(formData.equipementElectricite),
        equipementAssainissement: transformRadioToBoolean(formData.equipementAssainissement),
        equipementVoieAcces: transformRadioToBoolean(formData.equipementVoieAcces),
  
        // Caractéristiques des pièces (OPTIONNEL)
        pieces: cleanedPieces.length > 0 ? cleanedPieces : undefined,
  
        pieceSousSol: transformRadioToBoolean(formData.pieceSousSol),
  
        // Équipement de l'ouvrage
        existantVhVb: transformRadioToBoolean(formData.existantVhVb),
        existantTerasse: transformRadioToBoolean(formData.existantTerasse),
        existantGardeCorp: transformRadioToBoolean(formData.existantGardeCorp),
        nbrVeranda: cleanNumber(formData.nbrVeranda),
        nbrCouloir: cleanNumber(formData.nbrCouloir),
        nbrEscalier: cleanNumber(formData.nbrEscalier),
        nbrServitude: cleanNumber(formData.nbrServitude),
  
        // Assainissement
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
  
        // Documents (noms de fichiers uploadés) - OPTIONNEL
        planTerrain: getUploadedFilenames('planTerrain'),
        droitPropriete: getUploadedFilenames('droitPropriete'),
        planLimiteTerrain: getUploadedFilenames('planLimiteTerrain'),
        planMasse: getUploadedFilenames('planMasse'),
        planFacade: getUploadedFilenames('planFacade'),
  
        // Informations sur les fichiers uploadés (pour le backend)
        uploadedFilesInfo: this.prepareUploadedFilesInfo(uploadedFiles),
  
        // IDs requis (à adapter selon votre logique)
        id_align: 1, // À remplacer par l'ID d'alignement réel
        id_terrain: 1 // À remplacer par l'ID de terrain réel
      };
  
      // Nettoyer les données undefined et tableaux vides
      Object.keys(baseData).forEach(key => {
        if (baseData[key] === undefined ||
          baseData[key] === '' ||
          (Array.isArray(baseData[key]) && baseData[key].length === 0)) {
          delete baseData[key];
        }
      });
  
      console.log('Données préparées pour envoi:', baseData);
      return baseData;
    },
  
    // Préparer les informations détaillées sur les fichiers uploadés
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
            url: file.url // URL de téléchargement si disponible
          }));
        }
      });
  
      // Ne retourner que si on a des fichiers
      return Object.keys(filesInfo).length > 0 ? filesInfo : undefined;
    },
  
    // Validation des données avant envoi (plus flexible)
    validateConstructionData(data) {
      console.log('Validation des données:', data);
  
      // Valider les pièces seulement si elles existent
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
  
      // Validation pour les champs requis
      const requiredFields = ['nomProprietaire', 'cinProprietaire', 'natureTravaux', 'typeAffectation'];
      const missingFields = requiredFields.filter(field => !data[field]);
  
      if (missingFields.length > 0) {
        throw new Error(`Champs requis manquants: ${missingFields.join(', ')}`);
      }
  
      // Validation des emails si présents
      if (data.emailProprietaire && !this.isValidEmail(data.emailProprietaire)) {
        throw new Error('L\'email du propriétaire n\'est pas valide');
      }
  
      if (data.emailAuteur && !this.isValidEmail(data.emailAuteur)) {
        throw new Error('L\'email de l\'auteur n\'est pas valide');
      }
  
      return true;
    },
  
    // Méthode utilitaire pour valider les emails
    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }
  };