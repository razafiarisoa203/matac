import { useState } from 'react';

export function usePermisConstruction() {
  const [currentStep, setCurrentStep] = useState(1);
  const [currentSection, setCurrentSection] = useState(1);
  const [formData, setFormData] = useState({
    natureTravaux: 'Nouvelle construction',
    typeAffectation: 'Habitation minime importance',
    numeroReference: '',
    qualiteDemandeur: '',
    civiliteDemandeur: '',
    nom: '',
    prenom: '',
    telephoneDemandeur: '',
    adresseDemandeur: '',
    email: '',
    CIN_PassePort: '',
    nomProprietaire: '',
    prenomProprietaire: '',
    adresseProprietaire: '',
    numeroTerrain: '',
    adresseTerrain: '',
    superficieTerrain: ''
  });

  const steps = [
    { id: 1, title: 'INFORMATION GENERALE' },
    { id: 2, title: "INFORMATION RELATIVE A L'OUVRAGE" },
    { id: 3, title: 'EVALUATION TECHNIQUE' },
    { id: 4, title: 'DOCUMENTS A FOURNIR' }
  ];

  const sidebarItems = {
    1: [
      { id: 1, title: 'Choix de construction' },
      { id: 2, title: 'Référence alignement' },
      { id: 3, title: 'Renseignement du Demandeur' },
      { id: 4, title: 'Coordonnées du propriétaire' },
      { id: 5, title: 'Identité du Terrain' },
    ],
    2: [
      { id: 1, title: "Acteur de l'ouvrage" },
      { id: 2, title: 'Renseignement sur les travaux' },
      { id: 3, title: 'Renseignement du projet' },
    ],
    3: [
      { id: 1, title: 'Surface & volumes' },
      { id: 2, title: 'Distance de projet' },
      { id: 3, title: 'Equipement au terrain' },
      { id: 4, title: 'Caractéristiques des pièces' },
      { id: 5, title: "Equipement de l'ouvrage" },
      { id: 6, title: 'Assainissement' },
    ],
    4: [
      { id: 1, title: 'Document administratif' },
      { id: 2, title: 'Document technique' }
    ]
  };

  const getCurrentSidebarItems = () => {
    return sidebarItems[currentStep] || [];
  };

  const handleNext = () => {
    const currentStepItems = getCurrentSidebarItems();
    if (currentSection < currentStepItems.length) {
      setCurrentSection(currentSection + 1);
    } else if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      setCurrentSection(1);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
    } else if (currentStep > 1) {
      const previousStepItems = sidebarItems[currentStep - 1] || [];
      setCurrentStep(currentStep - 1);
      setCurrentSection(previousStepItems.length);
    }
  };

  const handleSidebarClick = (itemId) => {
    setCurrentSection(itemId);
  };
const [additionalDocuments, setAdditionalDocuments] = useState([]);
const handleAddDocument = () => {
  setAdditionalDocuments((prev) => [...prev, {}]); // Ajoute un nouveau document vide
};

  const getCurrentStepTitle = () => {
    const step = steps.find(s => s.id === currentStep);
    return step ? step.title : '';
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const [pieces, setPieces] = useState([
    { niveau: 0, destination: 'Sejour', surface: 12, surfaceOuverture: 2, hauteurLinteau: 2.1, hauteurSousPlafond: 2.5 },
    { niveau: 0, destination: 'Cuisine', surface: 9, surfaceOuverture: 2, hauteurLinteau: 2.1, hauteurSousPlafond: 2.5 }
  ]);
  const [equipementOuvrage, setEquipementOuvrage] = useState({
    implantationVH: true,
    veranda: true,
    couloir: true,
    terrasse: false,
    escalier: true,
    gardeCorp: false,
    servitudeVoie: true,
    distanceVeranda: 1,
    distanceCouloir: 1,
    distanceEscalier: 1,
    distanceVoieAcces: 3
  });
  const [assainissement, setAssainissement] = useState({
    branchementReseau: true,
    utilisationFosse: true,
    typeFosse: 'beton',
    nombreUsager: 5,
    capaciteFosse: 3,
    utilisationPuisard: true,
    puissardFondation: 4,
    presentationGoutieres: true,
    presentationRegards: true
  });
  const [documentsAdmin, setDocumentsAdmin] = useState([]);
  const [documentsTechnique, setDocumentsTechnique] = useState([
    { name: '1.dwg', type: 'dwg' },
    { name: '1-PLAN_IMMEUBLE+R+3.pdf', type: 'pdf' },
    { name: '1-FACADE.pdf', type: 'pdf' },
    { name: '1-PLAN_IMMEUBLE+R+3_RDC.pdf', type: 'pdf' }
  ]);

  const addPiece = () => {
    setPieces([...pieces, {
      niveau: 0,
      destination: '',
      surface: 0,
      surfaceOuverture: 0,
      hauteurLinteau: 0,
      hauteurSousPlafond: 0
    }]);
  };
  const removePiece = (index) => {
    setPieces(pieces.filter((_, i) => i !== index));
  };
  const updatePiece = (index, field, value) => {
    const updated = [...pieces];
    updated[index][field] = value;
    setPieces(updated);
  };

  return {
    currentStep,
    setCurrentStep,
    currentSection,
    setCurrentSection,
    formData,
    setFormData,
    steps,
    sidebarItems,
    getCurrentSidebarItems,
    handleNext,
    handlePrevious,
    handleSidebarClick,
    getCurrentStepTitle,
    handleInputChange,
    pieces,
    setPieces,
    addPiece,
    removePiece,
    updatePiece,
    equipementOuvrage,
    setEquipementOuvrage,
    assainissement,
    setAssainissement,
    documentsAdmin,
    setDocumentsAdmin,
    documentsTechnique,
    setDocumentsTechnique
  };
}
