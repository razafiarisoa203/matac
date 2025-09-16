import { useState, useEffect, useCallback } from "react";
import { ChevronDown, User, ArrowBigLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import bgConst from "../assets/image/construction-bg.jpeg";
import { useFormData } from "../hooks/useFormData";
import { useFileUpload } from "../hooks/useFileUpload";
import { useRegionsCommunes } from "../hooks/useRegionsCommunes";
import { authService, alignmentService, TEMP_USER_ID } from "../services/api";
import { validateTerrainForm, validateAlignmentForm } from "../utils/validation";

function Allignement() {
  const navigate = useNavigate();
  const { regions, communes, selectedRegion, selectedCommune, setSelectedRegion, setSelectedCommune } = useRegionsCommunes();
  const { files, isUploadingFile, fileInputRef, uploadFile, clearFiles, setFiles } = useFileUpload();

  const [statutTerrain, setStatutTerrain] = useState("titre");
  const [currentStep, setCurrentStep] = useState(1);
  const [statutProprietaire, setStatutProprietaire] = useState("particulier");
  const [qualiteDemandeur, setQualiteDemandeur] = useState("proprietaire");

  const { formData, setFormData, handleInputChange, updateFormData } = useFormData({
    id_mandataire: "",
    status_proprietaire: "",
    qualite_demandeur: "",
    nif: "",
    id_cert_sit_jur: "",
    id_plan_off: "",
    id_terrain: null,
    // Terrain data
    num_titre: "",
    indice: "",
    nom_proprietaire: "",
    adresse: "",
    superficie: "",
    num_parcelle: "",
    section_dite: "",
    canton: "",
    num_karatany: "",
    fokotany: "",
    longitude: "",
    latitude: "",
    statut_terrain: 1, // Default to "titre"
    // Keep personal info for UI display but separate from backend submission
    civilite: "",
    nom: "",
    prenoms: "",
    cinPasseport: "",
    fonction: "",
    nationalite: "",
    raisonSociale: "",
    carteStatistique: "",
    civiliteRepresentant: "",
    nomRepresentant: "",
    prenomsRepresentant: "",
    adresseRepresentant: "",
    cinPasseportRepresentant: "",
    // Additional fields for step 3
    adresse_proprietaire: "",
    contact_proprietaire: "",
    email_proprietaire: "",
    // Additional fields for mandataire section
    age: "",
    // Additional coordinate fields
    xv_laborde: "",
    yv_laborde: "",
    yv_laborde_cadastre: "",
    // Second person fields for mandataire (FAHAROA)
    civilite2: "",
    nom2: "",
    prenoms2: "",
    cinPasseport2: "",
    fonction2: "",
    nationalite2: "",
    age2: "",
  });

  const [isLoadingUserData, setIsLoadingUserData] = useState(false);
  const [userDataLoaded, setUserDataLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  // Enhanced loadUserData function with all required fields
  const loadUserData = useCallback(async () => {
    if (isLoadingUserData || userDataLoaded) return;

    setIsLoadingUserData(true);
    try {
      // Get user data from localStorage that was set during login
      const userData = JSON.parse(localStorage.getItem('userData'));

      if (!userData) {
        console.log('No user data found in localStorage');
        return;
      }

      console.log('User data from localStorage:', userData);

      // Extract user and citizen data from the stored structure
      const userInfo = userData.user || {};
      const citizenData = userData.citizen || {};

      // Format the data for the form - mapping to the correct field names
      const formattedData = {
        civilite: 'M', 
        nom: citizenData.citizen_lastname || '', 
        prenoms: citizenData.citizen_name || '',
        cinPasseport: String(citizenData.citizen_national_card_number || ''),
        fonction: citizenData.citizen_work || 'Particulier',
        nationalite: 'Malagasy', 
        adresse: citizenData.citizen_adress || '', 
        email: userInfo.user_email || '',
        telephone: '', 

        // Additional fields for step 3 that can be pre-filled
        adresse_proprietaire: citizenData.citizen_adress || '',
        contact_proprietaire: '',
        email_proprietaire: userInfo.user_email || '', 

        // Keep other fields as they were
        age: formData.age || '',
      };

      console.log('Formatted user data for form:', formattedData);

      // Update the form data with user information using setFormData directly
      setFormData(prev => ({
        ...prev,
        ...formattedData
      }));

      setUserDataLoaded(true);
      console.log('User data loaded successfully');
      console.log('Updated formData will have:', formattedData);
    } catch (error) {
      console.error('Error loading user data:', error);
      // Fallback to required empty values if there's an error
      const fallbackData = {
        civilite: 'M',
        nom: '',
        prenoms: '',
        cinPasseport: '',
        fonction: 'Particulier',
        nationalite: 'Malagasy',
        adresse: '',
        telephone: '',
        adresse_proprietaire: '',
        contact_proprietaire: '',
        email_proprietaire: ''
      };

      setFormData(prev => ({
        ...prev,
        ...fallbackData
      }));
      setUserDataLoaded(true);
    } finally {
      setIsLoadingUserData(false);
    }
  }, [isLoadingUserData, userDataLoaded, setFormData, formData.age]);
  // Replace the existing useEffect with this improved version
  // Replace your existing useEffect with this corrected version
  useEffect(() => {
    const shouldAutoFill = statutProprietaire === "particulier" &&
      qualiteDemandeur === "proprietaire" &&
      !userDataLoaded &&
      !isLoadingUserData;

    console.log('useEffect triggered:', {
      statutProprietaire,
      qualiteDemandeur,
      userDataLoaded,
      isLoadingUserData,
      shouldAutoFill
    });

    if (shouldAutoFill) {
      console.log('Calling loadUserData...');
      loadUserData();
    }
  }, [statutProprietaire, qualiteDemandeur, userDataLoaded, isLoadingUserData]);

  // Remove loadUserData from the dependency array to prevent infinite loops
  // Also add a manual trigger button for debugging (optional)
  const handleManualLoad = () => {
    setUserDataLoaded(false); // Reset the flag
    loadUserData();
  };

  // Validate personal form data
  const validatePersonalForm = useCallback(() => {
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
  }, [statutProprietaire, qualiteDemandeur, formData]);

  const handleNext = () => {
    if (currentStep === 1 && selectedRegion && selectedCommune) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 2 && validatePersonalForm()) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 3) {
      // Step 3 has no required validation, just move to next step
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 4 && validateTerrainForm(formData, statutTerrain)) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 5 && validateAlignmentForm(formData)) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 6) {
      // Documents step, no validation needed to proceed
      setCurrentStep(currentStep + 1);
    }
  };

  const handleStepClick = (stepNumber) => {
    setCurrentStep(stepNumber);
  };


  // Function to handle file upload to backend
  const handleFileUpload = async (file) => {
    try {
      const result = await uploadFile(file);
      setSubmitMessage("Fichier uploadé avec succès!");
      // Clear success message after 3 seconds
      setTimeout(() => setSubmitMessage(""), 3000);
      return result;
    } catch (error) {
      setSubmitMessage(`Erreur lors de l'upload du fichier: ${error.message}`);
      throw error;
    }
  };


  // Form submission handler
  const handleSubmit = async () => {
    if (!validateAlignmentForm(formData)) {
      setSubmitMessage("Veuillez remplir tous les champs d'alignement obligatoires.");
      return;
    }

    if (!validateTerrainForm(formData, statutTerrain)) {
      setSubmitMessage("Veuillez remplir tous les champs de terrain obligatoires.");
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      // Step 1: Create terrain first - Map to backend expected fields
      const baseTerrainData = {
        adresse: formData.adresse,
        superficie: parseFloat(formData.superficie),
        longitude: parseFloat(formData.longitude),
        latitude: parseFloat(formData.latitude),
        statut_terrain: statutTerrain // Backend expects string: "titre", "cadastre", "certificat-foncier"
      };

      let terrainData = { ...baseTerrainData };

      if (statutTerrain === "titre") {
        // Required fields for backend CreateTerrainDto
        terrainData.num_titre = formData.num_titre || "";
        terrainData.nom_proprietaire = formData.nom_proprietaire || "";
        terrainData.num_parcelle = formData.num_parcelle || "";
        terrainData.section_dite = formData.section_dite || "";
        terrainData.canton = formData.canton || "";
        // Optional fields
        if (formData.indice) {
          terrainData.indice = formData.indice;
        }
      } else if (statutTerrain === "cadastre") {
        // Required fields for backend - generate defaults if missing
        terrainData.num_titre = formData.num_titre || "CADASTRE-" + Date.now();
        terrainData.nom_proprietaire = formData.nom_proprietaire || "Propriétaire cadastre";
        terrainData.num_parcelle = formData.num_parcelle || "PARC-" + Date.now();
        terrainData.section_dite = formData.section_dite || "Section cadastre";
        terrainData.canton = formData.canton || "Canton";
      } else if (statutTerrain === "certificat-foncier") {
        // Required fields for backend - generate defaults if missing
        terrainData.num_titre = formData.num_titre || "CERT-FONCIER-" + Date.now();
        terrainData.nom_proprietaire = formData.nom_proprietaire || "Propriétaire certificat foncier";
        terrainData.num_parcelle = formData.num_parcelle || "CF-" + Date.now();
        terrainData.section_dite = formData.section_dite || "Section CF";
        terrainData.canton = formData.canton || "Canton";
        // Optional fields specific to certificat-foncier
        if (formData.num_karatany) {
          terrainData.num_karatany = formData.num_karatany;
        }
        if (formData.fokotany) {
          terrainData.fokotany = formData.fokotany;
        }
      }

      console.log('Terrain data being sent:', terrainData);
      console.log('Statut terrain:', statutTerrain);

      const terrainResult = await alignmentService.createTerrain(terrainData);
      console.log('Terrain créé:', terrainResult);

      // Step 2: Create alignment with terrain ID - Map to backend expected fields
      const alignmentData = {
        id_mandataire: TEMP_USER_ID, // Use the temp user ID from API service
        status_proprietaire: statutProprietaire, // Use the selected status
        qualite_demandeur: qualiteDemandeur, // Use the selected quality
        nif: formData.nif || "000000000000", // Default NIF if not provided
        id_cert_sit_jur: formData.id_cert_sit_jur || "CERT-" + Date.now(),
        id_plan_off: formData.id_plan_off || "PLAN-" + Date.now(),
        id_terrain: terrainResult.id_terrain
      };

      const alignmentResult = await alignmentService.createAlignment(alignmentData);
      console.log('Alignement créé:', alignmentResult);

      // Step 3: Create piece jointes for already uploaded files
      if (files && files.length > 0) {
        console.log('Creating piece jointes for uploaded files...');

        for (const file of files) {
          try {
            // Skip if file is not uploaded yet or doesn't have upload result
            if (!file.uploaded || !file.uploadResult) {
              console.log('Skipping file not uploaded:', file.name);
              continue;
            }

            // Create piece jointe record with existing upload info
            const pieceJointeData = {
              nom_piece: file.name,
              filename: file.uploadResult.filename,
              mimetype: file.uploadResult.mimetype,
              size: file.uploadResult.size,
              url: file.uploadResult.url,
              id_align: alignmentResult.id_align
            };

            const pieceJointeResult = await alignmentService.createPieceJointe(pieceJointeData);
            console.log('Piece jointe created:', pieceJointeResult);
          } catch (fileError) {
            console.error('Erreur lors du traitement du fichier:', file.name, fileError);
            // Continue with other files even if one fails
          }
        }
      }

      setSubmitMessage("Terrain, alignement et pièces jointes créés avec succès!");

      // Reset form after successful submission
      setTimeout(() => {
        setCurrentStep(1);
        clearFiles();
        setSubmitMessage("");
        // Optionally navigate to alignment list
        // navigate('/alignment-list');
      }, 3000);

    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      setSubmitMessage(`Erreur: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Improved resetFormData function that preserves auto-filled data when appropriate
  const resetFormData = () => {
    // Only reset if switching away from proprietaire mode
    const shouldPreserveData = statutProprietaire === "particulier" && qualiteDemandeur === "proprietaire";

    if (!shouldPreserveData) {
      updateFormData({
        civilite: "",
        nom: "",
        prenoms: "",
        cinPasseport: "",
        fonction: "",
        nationalite: "",
        raisonSociale: "",
        carteStatistique: "",
        nif: "",
        civiliteRepresentant: "",
        nomRepresentant: "",
        prenomsRepresentant: "",
        adresseRepresentant: "",
        cinPasseportRepresentant: "",
        civilite2: "",
        nom2: "",
        prenoms2: "",
        cinPasseport2: "",
        fonction2: "",
        nationalite2: "",
        age: "",
        age2: "",
      });
      setUserDataLoaded(false);
    }
  };

  // Update the qualiteDemandeur onChange handler
  const handleQualiteDemandeurChange = (e) => {
    const newValue = e.target.value;
    setQualiteDemandeur(newValue);

    if (newValue === "proprietaire" && statutProprietaire === "particulier") {
      // Don't reset, let the useEffect handle loading
      setUserDataLoaded(false); // This will trigger the useEffect to load data
    } else if (newValue === "mandataire") {
      resetFormData();
    }
  };

  const steps = [
    { number: 1, title: "Choix d'implantation", active: true },
    { number: 2, title: "Renseignement du Demandeur", active: false },
    { number: 3, title: "Coordonnées du propriétaire", active: false },
    { number: 4, title: "Identité du Terrain", active: false },
    { number: 5, title: "Informations Alignement", active: false },
    { number: 6, title: "Documents administratifs", active: false },
  ];

  const renderFormContent = () => {
    return (
      <div className="space-y-6">
        {/* Particulier  + propriétaire */}
        {statutProprietaire === "particulier" && qualiteDemandeur === "proprietaire" && (
          <>
            {isLoadingUserData && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200  -md">
                <div className="flex items-center">
                  <div className="animate-spin  -full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  <span className="text-sm text-blue-700">Chargement des informations utilisateur...</span>
                </div>
              </div>
            )}
            {userDataLoaded && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200  -md">
                <span className="text-sm text-green-700">✓ Informations utilisateur chargées automatiquement</span>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Civilité *
              </label>
              <div className="flex flex-col space-y-3 bg-transparent">
                {["M", "Mme"].map((option) => (
                  <label
                    key={option}
                    className="flex items-center cursor-pointer p-2"
                  >
                    <input
                      type="radio"
                      name="civilite"
                      value={option}
                      checked={formData.civilite === option}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300"
                    />
                    <span className="ml-3 text-sm text-gray-700 font-medium">
                      {option === "M" ? "Monsieur" : option === "Mme" ? "Madame" : "Mademoiselle"}
                    </span>
                  </label>
                ))}
                {formData.civilite === "" && (
                  <p className="text-red-500 text-xs mt-1">Ce champ est requis</p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom *
              </label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300  -md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Entrez votre nom"
              />
              {formData.nom === "" && (
                <p className="text-red-500 text-xs mt-1">Ce champ est requis</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prénoms *
              </label>
              <input
                type="text"
                name="prenoms"
                value={formData.prenoms}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300  -md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Entrez vos prénoms"
              />
              {formData.prenoms === "" && (
                <p className="text-red-500 text-xs mt-1">Ce champ est requis</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CIN ou Passeport *
              </label>
              <input
                type="text"
                name="cinPasseport"
                value={formData.cinPasseport}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300  -md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Numéro de CIN ou Passeport"
              />
              {formData.cinPasseport === "" && (
                <p className="text-red-500 text-xs mt-1">Ce champ est requis</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fonction
              </label>
              <input
                type="text"
                name="fonction"
                value={formData.fonction}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300  -md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Entrez votre fonction (facultatif)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nationalité *
              </label>
              <input
                type="text"
                name="nationalite"
                value={formData.nationalite}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300  -md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Entrez votre nationalité"
              />
              {formData.nationalite === "" && (
                <p className="text-red-500 text-xs mt-1">Ce champ est requis</p>
              )}
            </div>
          </>
        )}
        {/* Particulier + mandataire */}
        {statutProprietaire === "particulier" && qualiteDemandeur === "mandataire" && (
          <>
            <div>
              {/* <h3 className="text-lg font-semibold">VOALOHANY</h3> */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Civilité *
                </label>
                <div className="flex flex-col space-y-3 bg-transparent">
                  {["M", "Mme"].map((option) => (
                    <label
                      key={option}
                      className="flex items-center cursor-pointer p-2"
                    >
                      <input
                        type="radio"
                        name="civilite"
                        value={option}
                        checked={formData.civilite === option}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300"
                      />
                      <span className="ml-3 text-sm text-gray-700 font-medium">
                        {option === "M" ? "Monsieur" : option === "Mme" ? "Madame" : "Mademoiselle"}
                      </span>
                    </label>
                  ))}
                  {formData.civilite === "" && (
                    <p className="text-red-500 text-xs mt-1">Ce champ est requis</p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom *
                </label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300  -md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Entrez votre nom"
                />
                {formData.nom === "" && (
                  <p className="text-red-500 text-xs mt-1">Ce champ est requis</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prénoms *
                </label>
                <input
                  type="text"
                  name="prenoms"
                  value={formData.prenoms}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300  -md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Entrez vos prénoms"
                />
                {formData.prenoms === "" && (
                  <p className="text-red-500 text-xs mt-1">Ce champ est requis</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CIN ou Passeport *
                </label>
                <input
                  type="text"
                  name="cinPasseport"
                  value={formData.cinPasseport}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300  -md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Numéro de CIN ou Passeport"
                />
                {formData.cinPasseport === "" && (
                  <p className="text-red-500 text-xs mt-1">Ce champ est requis</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fonction
                </label>
                <input
                  type="text"
                  name="fonction"
                  value={formData.fonction}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300  -md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Entrez votre fonction (facultatif)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nationalité *
                </label>
                <input
                  type="text"
                  name="nationalite"
                  value={formData.nationalite}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300  -md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Entrez votre nationalité"
                />
                {formData.nationalite === "" && (
                  <p className="text-red-500 text-xs mt-1">Ce champ est requis</p>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Identité du demandeur Mandataire</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Civilité *
                </label>
                <div className="flex flex-col space-y-3 bg-transparent">
                  {["M", "Mme"].map((option) => (
                    <label
                      key={option}
                      className="flex items-center cursor-pointer p-2"
                    >
                      <input
                        type="radio"
                        name="civilite2"
                        value={option}
                        checked={formData.civilite2 === option}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300"
                      />
                      <span className="ml-3 text-sm text-gray-700 font-medium">
                        {option === "M" ? "Monsieur" : option === "Mme" ? "Madame" : "Mademoiselle"}
                      </span>
                    </label>
                  ))}
                  {formData.civilite2 === "" && (
                    <p className="text-red-500 text-xs mt-1">Ce champ est requis</p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom *
                </label>
                <input
                  type="text"
                  name="nom2"
                  value={formData.nom2}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300  -md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Entrez le nom"
                />
                {formData.nom2 === "" && (
                  <p className="text-red-500 text-xs mt-1">Ce champ est requis</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prénoms *
                </label>
                <input
                  type="text"
                  name="prenoms2"
                  value={formData.prenoms2}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300  -md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Entrez les prénoms"
                />
                {formData.prenoms2 === "" && (
                  <p className="text-red-500 text-xs mt-1">Ce champ est requis</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CIN ou Passeport *
                </label>
                <input
                  type="text"
                  name="cinPasseport2"
                  value={formData.cinPasseport2}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300  -md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Numéro de CIN ou Passeport"
                />
                {formData.cinPasseport2 === "" && (
                  <p className="text-red-500 text-xs mt-1">Ce champ est requis</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fonction
                </label>
                <input
                  type="text"
                  name="fonction2"
                  value={formData.fonction2}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300  -md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Entrez la fonction (facultatif)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nationalité *
                </label>
                <input
                  type="text"
                  name="nationalite2"
                  value={formData.nationalite2}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300  -md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Entrez la nationalité"
                />
                {formData.nationalite2 === "" && (
                  <p className="text-red-500 text-xs mt-1">Ce champ est requis</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age
                </label>
                <input
                  type="number"
                  name="age2"
                  value={formData.age2}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300  -md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Entrez l'âge"
                />
              </div>
            </div>
          </>
        )}


        {statutProprietaire === "personne-morale" && (
          <>
            <h1>Personne morale</h1>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Raison sociale *
              </label>
              <input
                type="text"
                name="raisonSociale"
                value={formData.raisonSociale}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300  -md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Entrez la raison sociale"
              />
              {formData.raisonSociale === "" && (
                <p className="text-red-500 text-xs mt-1">Ce champ est requis</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Numéro de carte statistique *
              </label>
              <input
                type="text"
                name="carteStatistique"
                value={formData.carteStatistique}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300  -md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Entrez le numéro de carte statistique"
              />
              {formData.carteStatistique === "" && (
                <p className="text-red-500 text-xs mt-1">Ce champ est requis</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                NIF *
              </label>
              <input
                type="text"
                name="nif"
                value={formData.nif}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300  -md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Entrez le NIF"
              />
              {formData.nif === "" && (
                <p className="text-red-500 text-xs mt-1">Ce champ est requis</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Civilité du représentant *
              </label>
              <div className="flex flex-col space-y-3 bg-transparent">
                {["M", "Mme", "Mlle"].map((option) => (
                  <label
                    key={option}
                    className="flex items-center cursor-pointer p-2"
                  >
                    <input
                      type="radio"
                      name="civiliteRepresentant"
                      value={option}
                      checked={formData.civiliteRepresentant === option}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300"
                    />
                    <span className="ml-3 text-sm text-gray-700 font-medium">
                      {option === "M" ? "Monsieur" : option === "Mme" ? "Madame" : "Mademoiselle"}
                    </span>
                  </label>
                ))}
                {formData.civiliteRepresentant === "" && (
                  <p className="text-red-500 text-xs mt-1">Ce champ est requis</p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du représentant *
              </label>
              <input
                type="text"
                name="nomRepresentant"
                value={formData.nomRepresentant}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300  -md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Entrez le nom du représentant"
              />
              {formData.nomRepresentant === "" && (
                <p className="text-red-500 text-xs mt-1">Ce champ est requis</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prénoms du représentant *
              </label>
              <input
                type="text"
                name="prenomsRepresentant"
                value={formData.prenomsRepresentant}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300  -md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Entrez les prénoms du représentant"
              />
              {formData.prenomsRepresentant === "" && (
                <p className="text-red-500 text-xs mt-1">Ce champ est requis</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse du représentant *
              </label>
              <input
                type="text"
                name="adresseRepresentant"
                value={formData.adresseRepresentant}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300  -md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Entrez l'adresse du représentant"
              />
              {formData.adresseRepresentant === "" && (
                <p className="text-red-500 text-xs mt-1">Ce champ est requis</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CIN ou Passeport du représentant *
              </label>
              <input
                type="text"
                name="cinPasseportRepresentant"
                value={formData.cinPasseportRepresentant}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300  -md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Numéro de CIN ou Passeport du représentant"
              />
              {formData.cinPasseportRepresentant === "" && (
                <p className="text-red-500 text-xs mt-1">Ce champ est requis</p>
              )}
            </div>
          </>
        )}
      </div>
    );
  };


  {/* Return to dashborad*/ }
  const handleReturnToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${bgConst})`,
      }}>
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white  -lg shadow-sm">
          {/* return to dashboard button like the primary button*/}
          <div>
            <button onClick={handleReturnToDashboard} className="bg-gray-300 absolute top-5 text-gray-800 font-semibold left-5 px-4 py-2  -md hover:bg-gray-400">Retour au dashboard</button>
          </div>
          {/* Main Title */}
          <div className="text-center py-8 border-transparent">
            <h2 className="text-2xl font-light text-gray-800 font-semibold">
              SOUMETTRE UN DOSSIER D'ALIGNEMENT
            </h2>
          </div>

          <div className="flex">
            {/* Sidebar */}
            <div className="w-80 border-transparent bg-gray-50">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-700 mb-6">
                  INFORMATION GENERALE
                </h3>
                <div className="space-y-4">
                  {steps.map((step) => (
                    <button
                      key={step.number}
                      onClick={() => handleStepClick(step.number)}
                      className={`w-full flex items-center space-x-3 p-3  -lg transition-colors text-left ${step.number === currentStep
                        ? "bg-green-500 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                      <div
                        className={`w-8 h-8  rounded-full flex items-center justify-center text-sm font-medium ${step.number === currentStep
                          ? "bg-white text-green-500"
                          : "bg-gray-200 text-gray-600"
                          }`}
                      >
                        {step.number}
                      </div>
                      <span className="text-sm font-medium">{step.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-9">
              <div className="max-w-md">
                {/* Success/Error Message */}
                {submitMessage && (
                  <div className={`mb-6 p-4  -md ${submitMessage.includes('succès')
                    ? 'bg-green-50 border border-green-200 text-green-700'
                    : 'bg-red-50 border border-red-200 text-red-700'
                    }`}>
                    {submitMessage}
                  </div>
                )}
                {/* Step 1: Choix d'implantation */}
                {currentStep === 1 && (
                  <>
                    <h3 className="text-xl font-medium text-gray-800 mb-8">
                      Choix d'implantation
                    </h3>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Spécifiez la Région
                        </label>
                        <div className="relative">
                          {!selectedRegion && (
                            <span className="absolute top-3 left-3 text-gray-400 pointer-events-none transition-opacity duration-200">
                              Sélectionnez la Région
                            </span>
                          )}
                          <select
                            value={selectedRegion}
                            onChange={(e) => setSelectedRegion(e.target.value)}
                            className="w-full p-3 border border-gray-300  -md appearance-none bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          >
                            <option value="" hidden></option>
                            {regions.map((region) => (
                              <option key={region.region_id} value={region.region_id}>
                                {region.name}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Spécifiez la Commune
                        </label>
                        <div className="relative">
                          {!selectedCommune && (
                            <span className="absolute top-3 left-3 text-gray-400 pointer-events-none transition-opacity duration-200">
                              Sélectionnez la commune
                            </span>
                          )}
                          <select
                            value={selectedCommune}
                            onChange={(e) => setSelectedCommune(e.target.value)}
                            className="w-full p-3 border border-gray-300  -md appearance-none bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                )}

                {/* Step 2: Renseignement du Demandeur */}
                {currentStep === 2 && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-6">
                      Renseignement du demandeur
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 p-6 bg-white border border-gray-200  -lg">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-4">
                          Spécifiez le Statut du propriétaire *
                        </label>
                        <div className="space-y-3">
                          <label className="flex items-center cursor-pointer p-2   hover:bg-gray-50 transition-colors">
                            <input
                              type="radio"
                              name="statutProprietaire"
                              value="particulier"
                              checked={statutProprietaire === "particulier"}
                              onChange={(e) => setStatutProprietaire(e.target.value)}
                              className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300"
                            />
                            <span className="ml-3 text-sm text-gray-700 font-medium">
                              Particulier
                            </span>
                          </label>
                          <label className="flex items-center cursor-pointer p-2   hover:bg-gray-50 transition-colors">
                            <input
                              type="radio"
                              name="statutProprietaire"
                              value="personne-morale"
                              checked={statutProprietaire === "personne-morale"}
                              onChange={(e) => setStatutProprietaire(e.target.value)}
                              className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300"
                            />
                            <span className="ml-3 text-sm text-gray-700 font-medium">
                              Personne morale
                            </span>
                          </label>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-4">
                          Spécifiez la Qualité du demandeur *
                        </label>
                        <div className="space-y-3">
                          <label
                            className={`flex items-center p-2   transition-colors ${statutProprietaire === "personne-morale"
                              ? "cursor-not-allowed bg-gray-50"
                              : "cursor-pointer hover:bg-gray-50"
                              }`}
                          >
                            <input
                              type="radio"
                              name="qualiteDemandeur"
                              value="proprietaire"
                              checked={qualiteDemandeur === "proprietaire"}
                              onChange={(e) => {
                                setQualiteDemandeur(e.target.value);
                                if (e.target.value === "proprietaire" && statutProprietaire === "particulier") {
                                  loadUserData();
                                } else if (e.target.value === "mandataire") {
                                  resetFormData();
                                }
                              }}
                              disabled={statutProprietaire === "personne-morale"}
                              className={`w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 ${statutProprietaire === "personne-morale" ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                            />
                            <span
                              className={`ml-3 text-sm font-medium ${statutProprietaire === "personne-morale" ? "text-gray-400" : "text-gray-700"
                                }`}
                            >
                              Propriétaire
                            </span>
                            {statutProprietaire === "personne-morale" && (
                              <span className="ml-2 text-xs text-gray-400 italic">
                                (non disponible)
                              </span>
                            )}
                          </label>
                          <label className="flex items-center cursor-pointer p-2   hover:bg-gray-50 transition-colors">
                            <input
                              type="radio"
                              name="qualiteDemandeur"
                              value="mandataire"
                              checked={qualiteDemandeur === "mandataire"}
                              onChange={(e) => {
                                setQualiteDemandeur(e.target.value);
                                if (e.target.value === "mandataire") {
                                  resetFormData();
                                }
                              }}
                              className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300"
                            />
                            <span className="ml-3 text-sm text-gray-700 font-medium">
                              Mandataire
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                    {renderFormContent()}
                  </div>
                )}


                {/* Step 3: Coordonnées du propriétaire */}
                {currentStep === 3 && (
                  <>
                    <h3 className="text-xl font-medium text-gray-800 mb-8">
                      Coordonnées du propriétaire
                    </h3>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Adresse
                        </label>
                        <input
                          type="text"
                          name="adresse_proprietaire"
                          value={formData.adresse_proprietaire}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300  -md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Adresse"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Contact du propriétaire
                        </label>
                        <input
                          type="tel"
                          name="contact_proprietaire"
                          value={formData.contact_proprietaire}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300  -md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Numéro de contact"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Adresse electronique
                        </label>
                        <textarea
                          name="email_proprietaire"
                          value={formData.email_proprietaire}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300  -md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          rows="1"
                          placeholder="Adresse electronique"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Step 4: Identité du Terrain */}
                {currentStep === 4 && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-6">
                      Identité du Terrain
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 p-6 bg-white border border-gray-200  -lg">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-4">
                          Spécifiez le statut du terrain : *
                        </label>
                        <div className="space-y-3">
                          <label className="flex items-center cursor-pointer p-2   hover:bg-gray-50 transition-colors">
                            <input
                              type="radio"
                              name="statutTerrain"
                              value="titre"
                              checked={statutTerrain === "titre"}
                              onChange={(e) => setStatutTerrain(e.target.value)}
                              className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300"
                            />
                            <span className="ml-3 text-sm text-gray-700 font-medium">
                              Titre
                            </span>
                          </label>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-4">
                          &nbsp;
                        </label>
                        <div className="space-y-3">
                          <label className="flex items-center cursor-pointer p-2   hover:bg-gray-50 transition-colors">
                            <input
                              type="radio"
                              name="statutTerrain"
                              value="cadastre"
                              checked={statutTerrain === "cadastre"}
                              onChange={(e) => setStatutTerrain(e.target.value)}
                              className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300"
                            />
                            <span className="ml-3 text-sm text-gray-700 font-medium">
                              Cadastre
                            </span>
                          </label>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-4">
                          &nbsp;
                        </label>
                        <div className="space-y-3">
                          <label className="flex items-center cursor-pointer p-2   hover:bg-gray-50 transition-colors">
                            <input
                              type="radio"
                              name="statutTerrain"
                              value="certificat-foncier"
                              checked={statutTerrain === "certificat-foncier"}
                              onChange={(e) => setStatutTerrain(e.target.value)}
                              className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300"
                            />
                            <span className="ml-3 text-sm text-gray-700 font-medium">
                              Certificat foncier
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {/* Titre */}
                      {statutTerrain === "titre" && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Numéro du titre *
                            </label>
                            <input
                              type="text"
                              name="num_titre"
                              value={formData.num_titre}
                              onChange={handleInputChange}
                              className="w-full p-3 border border-gray-300  -md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="Numéro du titre"
                            />
                            {formData.num_titre === "" && (
                              <p className="text-red-500 text-xs mt-1">Ce champ est requis</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Indice *
                            </label>
                            <input
                              type="text"
                              name="indice"
                              value={formData.indice}
                              onChange={handleInputChange}
                              className="w-full p-3 border border-gray-300  -md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="Indice"
                            />
                            {formData.indice === "" && (
                              <p className="text-red-500 text-xs mt-1">Ce champ est requis</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Nom du propriétaire *
                            </label>
                            <input
                              type="text"
                              name="nom_proprietaire"
                              value={formData.nom_proprietaire}
                              onChange={handleInputChange}
                              className="w-full p-3 border border-gray-300  -md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="Nom du propriétaire"
                            />
                            {formData.nom_proprietaire === "" && (
                              <p className="text-red-500 text-xs mt-1">Ce champ est requis</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Adresse du terrain *
                            </label>
                            <input
                              type="text"
                              name="adresse"
                              value={formData.adresse}
                              onChange={handleInputChange}
                              className="w-full p-3 border border-gray-300  -md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="Adresse du terrain"
                            />
                            {formData.adresse === "" && (
                              <p className="text-red-500 text-xs mt-1">Ce champ est requis</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Numéro de parcelle *
                            </label>
                            <input
                              type="text"
                              name="num_parcelle"
                              value={formData.num_parcelle}
                              onChange={handleInputChange}
                              className="w-full p-3 border border-gray-300  -md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="Numéro de parcelle"
                            />
                            {formData.num_parcelle === "" && (
                              <p className="text-red-500 text-xs mt-1">Ce champ est requis</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Section dite *
                            </label>
                            <input
                              type="text"
                              name="section_dite"
                              value={formData.section_dite}
                              onChange={handleInputChange}
                              className="w-full p-3 border border-gray-300  -md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="Section dite"
                            />
                            {formData.section_dite === "" && (
                              <p className="text-red-500 text-xs mt-1">Ce champ est requis</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Canton *
                            </label>
                            <input
                              type="text"
                              name="canton"
                              value={formData.canton}
                              onChange={handleInputChange}
                              className="w-full p-3 border border-gray-300  -md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="Canton"
                            />
                            {formData.canton === "" && (
                              <p className="text-red-500 text-xs mt-1">Ce champ est requis</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Numéro Karatany (optionnel)
                            </label>
                            <input
                              type="text"
                              name="num_karatany"
                              value={formData.num_karatany}
                              onChange={handleInputChange}
                              className="w-full p-3 border border-gray-300  -md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="Numéro Karatany"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Fokotany (optionnel)
                            </label>
                            <input
                              type="text"
                              name="fokotany"
                              value={formData.fokotany}
                              onChange={handleInputChange}
                              className="w-full p-3 border border-gray-300  -md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="Fokotany"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Longitude *
                              </label>
                              <input
                                type="number"
                                step="0.000001"
                                name="longitude"
                                value={formData.longitude}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300  -md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Longitude"
                              />
                              {formData.longitude === "" && (
                                <p className="text-red-500 text-xs mt-1">Ce champ est requis</p>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Latitude *
                              </label>
                              <input
                                type="number"
                                step="0.000001"
                                name="latitude"
                                value={formData.latitude}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300  -md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Latitude"
                              />
                              {formData.latitude === "" && (
                                <p className="text-red-500 text-xs mt-1">Ce champ est requis</p>
                              )}
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Superficie (m²) *
                            </label>
                            <input
                              type="number"
                              name="superficie"
                              value={formData.superficie}
                              onChange={handleInputChange}
                              className="w-full p-3 border border-gray-300  -md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="Superficie en mètres carrés"
                            />
                            {formData.superficie === "" && (
                              <p className="text-red-500 text-xs mt-1">Ce champ est requis</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              XV (Laborde) *
                            </label>
                            <input
                              type="text"
                              name="xv_laborde"
                              value={formData.xv_laborde || ""}
                              onChange={handleInputChange}
                              className="w-full p-3 border border-gray-300  -md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="Coordonnée XV Laborde"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              YV (Laborde) *
                            </label>
                            <input
                              type="text"
                              className="w-full p-3 border border-gray-300  -md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="Coordonnée YV Laborde"
                            />
                          </div>
                        </>
                      )}

                      {/* Cadastre */}
                      {statutTerrain === "cadastre" && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Numéro parcelle *
                            </label>
                            <input
                              type="text"
                              name="num_parcelle"
                              value={formData.num_parcelle}
                              onChange={handleInputChange}
                              className="w-full p-3 border border-gray-300  -md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="Numéro de parcelle"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Section *
                            </label>
                            <input
                              type="text"
                              name="section_dite"
                              value={formData.section_dite}
                              onChange={handleInputChange}
                              className="w-full p-3 border border-gray-300  -md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="Section"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Canton *
                            </label>
                            <input
                              type="text"
                              name="canton"
                              value={formData.canton}
                              onChange={handleInputChange}
                              className="w-full p-3 border border-gray-300  -md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="Canton"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Situé à *
                            </label>
                            <input
                              type="text"
                              name="adresse"
                              value={formData.adresse}
                              onChange={handleInputChange}
                              className="w-full p-3 border border-gray-300  -md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="Localisation"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Superficie *
                            </label>
                            <input
                              type="number"
                              name="superficie"
                              value={formData.superficie}
                              onChange={handleInputChange}
                              className="w-full p-3 border border-gray-300  -md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="Superficie en mètres carrés"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              XV (Laborde) *
                            </label>
                            <input
                              type="text"
                              name="longitude"
                              value={formData.longitude}
                              onChange={handleInputChange}
                              className="w-full p-3 border border-gray-300  -md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="Coordonnée XV Laborde"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              YV (Laborde) *
                            </label>
                            <input
                              type="text"
                              name="latitude"
                              value={formData.latitude}
                              onChange={handleInputChange}
                              className="w-full p-3 border border-gray-300  -md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="Coordonnée YV Laborde"
                            />
                          </div>
                        </>
                      )}

                      {/* Certificat foncier */}
                      {statutTerrain === "certificat-foncier" && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Numéro KT *
                            </label>
                            <input
                              type="text"
                              name="num_karatany"
                              value={formData.num_karatany}
                              onChange={handleInputChange}
                              className="w-full p-3 border border-gray-300  -md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="Numéro KT"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Lieu dit *
                            </label>
                            <input
                              type="text"
                              name="adresse"
                              value={formData.adresse}
                              onChange={handleInputChange}
                              className="w-full p-3 border border-gray-300  -md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="Lieu dit"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Fokontany *
                            </label>
                            <input
                              type="text"
                              name="fokotany"
                              value={formData.fokotany}
                              onChange={handleInputChange}
                              className="w-full p-3 border border-gray-300  -md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="Fokontany"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Commune *
                            </label>
                            <input
                              type="text"
                              name="canton"
                              value={formData.canton}
                              onChange={handleInputChange}
                              className="w-full p-3 border border-gray-300  -md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="Commune"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Superficie *
                            </label>
                            <input
                              type="number"
                              name="superficie"
                              value={formData.superficie}
                              onChange={handleInputChange}
                              className="w-full p-3 border border-gray-300  -md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="Superficie en mètres carrés"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              XV *
                            </label>
                            <input
                              type="text"
                              name="longitude"
                              value={formData.longitude}
                              onChange={handleInputChange}
                              className="w-full p-3 border border-gray-300  -md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="Coordonnée XV"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              YV *
                            </label>
                            <input
                              type="text"
                              name="latitude"
                              value={formData.latitude}
                              onChange={handleInputChange}
                              className="w-full p-3 border border-gray-300  -md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="Coordonnée YV"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 5: Informations Alignement */}
                {currentStep === 5 && (
                  <>
                    <h3 className="text-xl font-medium text-gray-800 mb-8">
                      Informations Alignement
                    </h3>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ID Mandataire *
                        </label>
                        <input
                          type="text"
                          name="id_mandataire"
                          value={formData.id_mandataire}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300  -md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Entrez l'ID du mandataire"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Statut Propriétaire *
                        </label>
                        <input
                          type="text"
                          name="status_proprietaire"
                          value={formData.status_proprietaire}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300  -md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Statut du propriétaire"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Qualité Demandeur *
                        </label>
                        <input
                          type="text"
                          name="qualite_demandeur"
                          value={formData.qualite_demandeur}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300  -md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Qualité du demandeur"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          NIF *
                        </label>
                        <input
                          type="text"
                          name="nif"
                          value={formData.nif}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300  -md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Numéro d'Identification Fiscale"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ID Certificat Situation Juridique *
                        </label>
                        <input
                          type="text"
                          name="id_cert_sit_jur"
                          value={formData.id_cert_sit_jur}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300  -md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="ID du certificat de situation juridique"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ID Plan Officiel *
                        </label>
                        <input
                          type="text"
                          name="id_plan_off"
                          value={formData.id_plan_off}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300  -md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="ID du plan officiel"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ID Terrain (optionnel)
                        </label>
                        <input
                          type="number"
                          name="id_terrain"
                          value={formData.id_terrain || ""}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            id_terrain: e.target.value ? parseInt(e.target.value) : null
                          }))}
                          className="w-full p-3 border border-gray-300  -md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="ID du terrain associé"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Step 6: Documents administratifs */}
                {currentStep === 6 && (
                  <>
                    <h3 className="text-xl font-medium text-gray-800 mb-8">
                      Documents administratifs
                    </h3>
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <label className="w-64 text-sm font-medium text-gray-700">
                          Pièce justifiant le droit de propriété
                        </label>
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          accept=".pdf,.jpg,.png,.jpeg,.doc,.docx"
                          onChange={async (e) => {
                            if (e.target.files[0]) {
                              const newFile = e.target.files[0];
                              await handleFileUpload(newFile);
                            }
                            e.target.value = "";
                          }}
                        />
                        <button
                          className="p-2 bg-green-500 text-white  -md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => fileInputRef.current.click()}
                          disabled={isUploadingFile}
                        >
                          {isUploadingFile ? (
                            <div className="animate-spin  -full h-4 w-4 border-b-2 border-white"></div>
                          ) : (
                            "+"
                          )}
                        </button>
                      </div>
                      <div className="mt-4 space-y-2">
                        {files.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50  -md">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2  -full bg-green-500"></div>
                              <span className="text-sm text-gray-700">{file.name}</span>
                              {file.uploaded && (
                                <span className="text-xs text-green-600 bg-green-100 px-2 py-1  ">
                                  Enregistré
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              <a
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-green-600 text-sm hover:underline"
                              >
                                Voir
                              </a>
                              <button
                                onClick={() => {
                                  setFiles(prev => prev.filter((_, i) => i !== index));
                                }}
                                className="text-red-500 text-sm hover:text-red-700"
                              >
                                Supprimer
                              </button>
                            </div>
                          </div>
                        ))}
                        {files.length === 0 && (
                          <p className="text-gray-500 text-sm italic">
                            Aucun document ajouté. Cliquez sur le bouton "+" pour ajouter des pièces justificatives.
                          </p>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* Navigation Buttons */}
                <div className="pt-6 flex justify-between">
                  {currentStep > 1 && (
                    <button
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="py-3 px-6  -md font-medium text-white transition-colors ml-auto bg-green-500 hover:bg-green-600"
                    >
                      PRÉCÉDENT
                    </button>
                  )}
                  {currentStep < 5 && (
                    <button
                      onClick={handleNext}
                      disabled={currentStep === 1 && (!selectedRegion || !selectedCommune)}
                      className={`py-3 px-6  -md font-medium text-white transition-colors ml-auto ${(currentStep === 1 && selectedRegion && selectedCommune) || currentStep > 1
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-gray-300 cursor-not-allowed"
                        }`}
                    >
                      SUIVANT
                    </button>
                  )}
                  {currentStep === 5 && (
                    <button
                      onClick={handleNext}
                      className="py-3 px-6  -md font-medium text-white bg-green-500 hover:bg-green-600 transition-colors ml-auto"
                    >
                      SUIVANT
                    </button>
                  )}
                  {currentStep === 6 && (
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className={`py-3 px-6  -md font-medium text-white transition-colors ml-auto ${isSubmitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-500 hover:bg-green-600"
                        }`}
                    >
                      {isSubmitting ? "SOUMISSION..." : "SOUMETTRE"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Allignement;