import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useFormData } from "../hooks/useFormData";
import { useFileUpload } from "../hooks/useFileUpload";
import { alignmentService } from "../services/api/alignmentService";

import Sidebar from "../components/alignements/Sidebar";
import Step1Implantation from "../components/alignements/Step1Implantation";
import Step2Demandeur from "../components/alignements/Step2Demandeur";
import Step3Proprietaire from "../components/alignements/Step3Proprietaire";
import Step4Terrain from "../components/alignements/Step4Terrain";
import Step6Documents from "../components/alignements/Step6Documents";
import NavigationButtons from "../components/alignements/NavigationButtons";
import MessageDisplay from "../components/alignements/MessageDisplay";

import { citoyenService } from "../services/api/citoyenService";
import { ArrowLeft } from "lucide-react";
import { authService } from "../services/api/authService";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";

function Allignement() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // ============================================================
  // FICHIERS
  // ============================================================

  const {
    files,
    isUploadingFile,
    fileInputRef,
    uploadFile,
    clearFiles,
    setFiles,
  } = useFileUpload();

  // ============================================================
  // ÉTATS
  // ============================================================

  const [statutTerrain, setStatutTerrain] = useState("titre");

  const [currentStep, setCurrentStep] = useState(1);

  const [statutProprietaire, setStatutProprietaire] =
    useState("particulier");

  const [qualiteDemandeur, setQualiteDemandeur] =
    useState("proprietaire");

  const [regions, setRegions] = useState([]);
  const [communes, setCommunes] = useState([]);

  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedCommune, setSelectedCommune] = useState("");

  const [isLoadingUserData, setIsLoadingUserData] =
    useState(false);

  const [userDataLoaded, setUserDataLoaded] =
    useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [submitMessage, setSubmitMessage] =
    useState("");

  // ============================================================
  // FORMULAIRE
  // ============================================================

  const {
    formData,
    setFormData,
    handleInputChange,
    updateFormData,
  } = useFormData({
    id_mandataire: null,
    status_proprietaire: null,
    qualite_demandeur: null,
    nif: null,
    id_cert_sit_jur: null,
    id_plan_off: null,
    id_terrain: null,

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

    statut_terrain: 1,

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

    adresse_proprietaire: "",
    contact_proprietaire: "",
    email_proprietaire: "",

    age: "",

    xv_laborde: "",
    yv_laborde: "",
    yv_laborde_cadastre: "",

    civilite2: "",
    nom2: "",
    prenoms2: "",
    cinPasseport2: "",
    fonction2: "",
    nationalite2: "",
    age2: "",
  });

  // ============================================================
  // INFORMATIONS UTILISATEUR
  // ============================================================

  const userData = authService.getUserInfo();
  const id_citizen = userData?.id_citizen;

  // ============================================================
  // CHARGEMENT DES INFORMATIONS CITOYEN
  // ============================================================

  const loadUserData = useCallback(async () => {
    if (
      isLoadingUserData ||
      userDataLoaded ||
      !id_citizen
    ) {
      return;
    }

    setIsLoadingUserData(true);

    try {
      const citizenData =
        await citoyenService.getCitizenData(id_citizen);

      const formattedData = {
        civilite: "M",

        nom:
          citizenData?.citizen_lastname || "",

        prenoms:
          citizenData?.citizen_name || "",

        cinPasseport: String(
          citizenData?.citizen_national_card_number || ""
        ),

        fonction:
          citizenData?.citizen_work ||
          "Particulier",

        nationalite: "Malagasy",

        adresse:
          citizenData?.citizen_adress || "",

        email:
          citizenData?.user_email || "",

        telephone: "",

        adresse_proprietaire:
          citizenData?.citizen_adress || "",

        contact_proprietaire:
          userData?.user_phone || "",

        email_proprietaire:
          userData?.user_email || "",

        age: "",

        nom_demandaire: "",
        prenom_mandataire: "",
        cin_passeport_demandaire: "",
        adresse_demandaire: "",
        fonction_demandaire: "",
        age_demandaire: "",
        nationalite_demandaire: "",
      };

      setFormData((prev) => ({
        ...prev,
        ...formattedData,
      }));

      setUserDataLoaded(true);

    } catch (error) {
      console.error(
        "Erreur lors du chargement des données citoyen :",
        error
      );

      const fallbackData = {
        civilite: "M",
        nom: "",
        prenoms: "",
        cinPasseport: "",
        fonction: "Particulier",
        nationalite: "Malagasy",
        adresse: "",
        telephone: "",
        adresse_proprietaire: "",
        contact_proprietaire: "",
        email_proprietaire: "",
        age: "",
      };

      setFormData((prev) => ({
        ...prev,
        ...fallbackData,
      }));

      setUserDataLoaded(true);

    } finally {
      setIsLoadingUserData(false);
    }
  }, [
    isLoadingUserData,
    userDataLoaded,
    id_citizen,
    setFormData,
    userData?.user_phone,
    userData?.user_email,
  ]);

  // ============================================================
  // CHARGEMENT AUTOMATIQUE DES DONNÉES
  // ============================================================

  useEffect(() => {
    const shouldAutoFill =
      statutProprietaire === "particulier" &&
      qualiteDemandeur === "proprietaire" &&
      !userDataLoaded &&
      !isLoadingUserData;

    if (shouldAutoFill) {
      loadUserData();
    }
  }, [
    statutProprietaire,
    qualiteDemandeur,
    userDataLoaded,
    isLoadingUserData,
    loadUserData,
  ]);

  // ============================================================
  // VALIDATION DU FORMULAIRE
  // ============================================================

  const validatePersonalForm = useCallback(() => {
    if (statutProprietaire === "particulier") {
      if (qualiteDemandeur === "proprietaire") {
        return (
          formData.civilite &&
          formData.nom &&
          formData.prenoms &&
          formData.cinPasseport &&
          formData.nationalite
        );
      }

      if (qualiteDemandeur === "mandataire") {
        return (
          formData.civilite &&
          formData.nom &&
          formData.prenoms &&
          formData.cinPasseport &&
          formData.nationalite &&
          formData.civilite2 &&
          formData.nom2 &&
          formData.prenoms2 &&
          formData.cinPasseport2 &&
          formData.nationalite2
        );
      }
    }

    if (statutProprietaire === "personne_morale") {
      return (
        formData.raisonSociale &&
        formData.carteStatistique &&
        formData.civiliteRepresentant &&
        formData.nomRepresentant &&
        formData.prenomsRepresentant &&
        formData.cinPasseportRepresentant
      );
    }

    return false;
  }, [
    statutProprietaire,
    qualiteDemandeur,
    formData,
  ]);

  // ============================================================
  // NAVIGATION
  // ============================================================

  const handleNext = () => {
    switch (currentStep) {
      case 1:
        if (
          selectedRegion &&
          selectedCommune
        ) {
          setCurrentStep(currentStep + 1);
        }
        break;

      case 2:
        if (validatePersonalForm()) {
          setCurrentStep(currentStep + 1);
        }
        break;

      case 3:
      case 4:
      case 5:
        setCurrentStep(currentStep + 1);
        break;

      default:
        break;
    }
  };

  // ============================================================
  // CLIC SUR UNE ÉTAPE
  // ============================================================

  const handleStepClick = (stepNumber) => {
    setCurrentStep(stepNumber);
  };

  // ============================================================
  // UPLOAD FICHIER
  // ============================================================

  const handleFileUpload = async (file) => {
    try {
      const result = await uploadFile(file);

      console.log(
        "Fichier uploadé :",
        result
      );

      setSubmitMessage(
        "Fichier uploadé avec succès !"
      );

      setTimeout(() => {
        setSubmitMessage("");
      }, 3000);

      return result;

    } catch (error) {
      console.error(
        "Erreur lors de l'upload :",
        error
      );

      setSubmitMessage(
        `Erreur lors de l'upload du fichier : ${
          error.message
        }`
      );

      throw error;
    }
  };

  // ============================================================
  // SOUMISSION DU DOSSIER
  // ============================================================

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      // ========================================================
      // 1. DONNÉES DU TERRAIN
      // ========================================================

      const baseTerrainData = {
        adresse:
          formData.adresse ||
          "Adresse par défaut",

        superficie:
          parseFloat(formData.superficie) || 0,

        longitude:
          formData.longitude
            ? parseFloat(formData.longitude)
            : 0,

        latitude:
          formData.latitude
            ? parseFloat(formData.latitude)
            : 0,

        statut_terrain:
          statutTerrain,
      };

      let terrainData = {
        ...baseTerrainData,
      };

      // ========================================================
      // 2. TERRAIN AVEC TITRE
      // ========================================================

      if (statutTerrain === "titre") {
        terrainData.num_titre =
          formData.num_titre ||
          `TITRE-${Date.now()}`;

        terrainData.nom_proprietaire =
          formData.nom_proprietaire ||
          "Propriétaire";

        terrainData.num_parcelle =
          formData.num_parcelle ||
          `PARC-${Date.now()}`;

        terrainData.section_dite =
          formData.section_dite ||
          "Section";

        terrainData.canton =
          formData.canton ||
          "Canton";

        terrainData.indice =
          formData.indice || "";
      }

      // ========================================================
      // 3. TERRAIN CADASTRE
      // ========================================================

      else if (
        statutTerrain === "cadastre"
      ) {
        terrainData.num_titre =
          formData.num_titre ||
          `CADASTRE-${Date.now()}`;

        terrainData.nom_proprietaire =
          formData.nom_proprietaire ||
          "Propriétaire cadastre";

        terrainData.num_parcelle =
          formData.num_parcelle ||
          `PARC-${Date.now()}`;

        terrainData.section_dite =
          formData.section_dite ||
          "Section cadastre";

        terrainData.canton =
          formData.canton ||
          "Canton";
      }

      // ========================================================
      // 4. CERTIFICAT FONCIER
      // ========================================================

      else if (
        statutTerrain ===
        "certificat-foncier"
      ) {
        terrainData.num_titre =
          formData.num_titre ||
          `CERT-FONCIER-${Date.now()}`;

        terrainData.nom_proprietaire =
          formData.nom_proprietaire ||
          "Propriétaire certificat foncier";

        terrainData.num_parcelle =
          formData.num_parcelle ||
          `CF-${Date.now()}`;

        terrainData.section_dite =
          formData.section_dite ||
          "Section CF";

        terrainData.canton =
          formData.canton ||
          "Canton";

        terrainData.num_karatany =
          formData.num_karatany || "";

        terrainData.fokotany =
          formData.fokotany || "";
      }

      console.log(
        "Données terrain :",
        terrainData
      );

      // ========================================================
      // 5. CRÉATION DU TERRAIN
      // ========================================================

      const terrainResult =
        await alignmentService.createTerrain(
          terrainData
        );

      console.log(
        "Terrain créé :",
        terrainResult
      );

      if (!terrainResult) {
        throw new Error(
          "Impossible de créer le terrain."
        );
      }

      // ========================================================
      // 6. RÉCUPÉRATION DES FICHIERS
      // ========================================================

      const certFile = files.find(
        (file) =>
          file.type === "certificat"
      );

      const planFile = files.find(
        (file) =>
          file.type === "plan"
      );

      // ========================================================
      // 7. DONNÉES DE L'ALIGNEMENT
      // ========================================================

      const alignmentData = {
        id_mandataire:
          id_citizen || " ",

        status_proprietaire:
          statutProprietaire || " ",

        qualite_demandeur:
          qualiteDemandeur || " ",

        nif:
          "000000000000",

        id_cert_sit_jur:
          certFile
            ? certFile.name
            : null,

        id_plan_off:
          planFile
            ? planFile.name
            : null,

        id_terrain:
          formData.id_terrain,

        nom_demandaire:
          formData.nom || " ",

        prenom_mandataire:
          formData.prenoms || " ",

        cin_passeport_demandaire:
          formData.cinPasseport || " ",
      };

      console.log(
        "Données alignement :",
        alignmentData
      );

      // ========================================================
      // 8. CRÉATION DE L'ALIGNEMENT
      // ========================================================

      const alignmentResult =
        await alignmentService.createAlignment(
          alignmentData
        );

      console.log(
        "Alignement créé :",
        alignmentResult
      );

      if (!alignmentResult) {
        throw new Error(
          "Impossible de créer l'alignement."
        );
      }

      // ========================================================
      // 9. SWEETALERT SUCCÈS
      // ========================================================

      setSubmitMessage("");

      Swal.fire({
        icon: "success",
        title: "Soumission réussie",
        text: "Votre dossier a été créé avec succès.",
        confirmButtonText: "OK",
        confirmButtonColor: "#2563eb",

        width: "360px",
        padding: "1.2rem",

        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then(() => {
        setCurrentStep(1);

        clearFiles();

        setSubmitMessage("");

        navigate("/alignement-list");
      });

    } catch (error) {

      // ========================================================
      // ERREUR DE SOUMISSION
      // ========================================================

      console.error(
        "Erreur lors de la soumission :",
        error
      );

      setSubmitMessage("");

      Swal.fire({
        icon: "error",
        title: "Soumission échouée",
        text: "Impossible de soumettre votre dossier. Veuillez réessayer.",
        confirmButtonText: "Fermer",
        confirmButtonColor: "#dc2626",

        width: "360px",
        padding: "1.2rem",

        allowOutsideClick: true,
        allowEscapeKey: true,
      });

    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================================
  // RESET DES DONNÉES
  // ============================================================

  const resetFormData = () => {
    const shouldPreserveData =
      statutProprietaire === "particulier" &&
      qualiteDemandeur === "proprietaire";

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

  // ============================================================
  // ÉTAPES
  // ============================================================

  const steps = [
    {
      number: 1,
      title: t(
        "alignment.choix_implantation"
      ),
      active: true,
    },
    {
      number: 2,
      title: t(
        "alignment.renseignement_demandeur"
      ),
      active: false,
    },
    {
      number: 3,
      title: t(
        "alignment.coordonnees_proprietaire"
      ),
      active: false,
    },
    {
      number: 4,
      title: t(
        "alignment.identite_terrain"
      ),
      active: false,
    },
    {
      number: 5,
      title: t(
        "alignment.documents_administratifs"
      ),
      active: false,
    },
  ];

  // ============================================================
  // AFFICHAGE
  // ============================================================

  return (
    <div className="min-h-screen">

      <div className="max-w-6xl mx-auto p-6">

        <div className="bg-white rounded-lg shadow-sm">

          {/* ==================================================
              BOUTON RETOUR
          ================================================== */}

          <button
            type="button"
            onClick={() =>
              navigate("/alignement-list")
            }
            className="bg-gray-300 absolute top-5 left-5 p-2 rounded-md hover:bg-gray-400 transition"
            title="Retour à la liste des alignements"
          >
            <ArrowLeft className="text-gray-800 w-5 h-5" />
          </button>

          {/* ==================================================
              TITRE
          ================================================== */}

          <div className="text-center py-8 border-transparent">

            <h2 className="text-2xl font-light text-gray-800 font-semibold">
              {t(
                "alignment.soumettre_dossier"
              )}
            </h2>

          </div>

          {/* ==================================================
              CONTENU
          ================================================== */}

          <div className="flex">

            {/* =================================================
                SIDEBAR
            ================================================= */}

            <Sidebar
              steps={steps}
              currentStep={currentStep}
              handleStepClick={handleStepClick}
            />

            {/* =================================================
                FORMULAIRE
            ================================================= */}

            <div className="flex-1 p-9">

              <div className="max-w-md">

                {/* MESSAGE */}
                <MessageDisplay
                  submitMessage={submitMessage}
                />

                {/* =================================================
                    ÉTAPE 1
                ================================================= */}

                {currentStep === 1 && (
                  <Step1Implantation
                    regions={regions}
                    communes={communes}
                    selectedRegion={
                      selectedRegion
                    }
                    selectedCommune={
                      selectedCommune
                    }
                    setSelectedRegion={
                      setSelectedRegion
                    }
                    setSelectedCommune={
                      setSelectedCommune
                    }
                  />
                )}

                {/* =================================================
                    ÉTAPE 2
                ================================================= */}

                {currentStep === 2 && (
                  <Step2Demandeur
                    statutProprietaire={
                      statutProprietaire
                    }
                    setStatutProprietaire={
                      setStatutProprietaire
                    }
                    qualiteDemandeur={
                      qualiteDemandeur
                    }
                    setQualiteDemandeur={
                      setQualiteDemandeur
                    }
                    formData={formData}
                    handleInputChange={
                      handleInputChange
                    }
                    isLoadingUserData={
                      isLoadingUserData
                    }
                    userDataLoaded={
                      userDataLoaded
                    }
                    resetFormData={
                      resetFormData
                    }
                    loadUserData={
                      loadUserData
                    }
                  />
                )}

                {/* =================================================
                    ÉTAPE 3
                ================================================= */}

                {currentStep === 3 && (
                  <Step3Proprietaire
                    formData={formData}
                    handleInputChange={
                      handleInputChange
                    }
                  />
                )}

                {/* =================================================
                    ÉTAPE 4
                ================================================= */}

                {currentStep === 4 && (
                  <Step4Terrain
                    statutTerrain={
                      statutTerrain
                    }
                    setStatutTerrain={
                      setStatutTerrain
                    }
                    formData={formData}
                    setFormData={setFormData}
                    handleInputChange={
                      handleInputChange
                    }
                  />
                )}

                {/* =================================================
                    ÉTAPE 5
                ================================================= */}

                {currentStep === 5 && (
                  <Step6Documents
                    files={files}
                    isUploadingFile={
                      isUploadingFile
                    }
                    fileInputRef={
                      fileInputRef
                    }
                    handleFileUpload={
                      handleFileUpload
                    }
                    setFiles={setFiles}
                  />
                )}

                {/* =================================================
                    BOUTONS DE NAVIGATION
                ================================================= */}

                <NavigationButtons
                  currentStep={currentStep}
                  setCurrentStep={
                    setCurrentStep
                  }
                  handleNext={handleNext}
                  handleSubmit={
                    handleSubmit
                  }
                  isSubmitting={
                    isSubmitting
                  }
                  selectedRegion={
                    selectedRegion
                  }
                  selectedCommune={
                    selectedCommune
                  }
                />

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Allignement;