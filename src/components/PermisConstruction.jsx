import React, { useEffect, useState } from 'react';
import { constructionService } from '../services/api';


// Composant d'icônes Material Design
const MaterialIcon = ({ name, size = 20, className = "" }) => (
  <span className={`material-icons-outlined ${className}`} style={{ fontSize: size }}>
    {name}
  </span>
);

// Input réutilisable avec validation
const InputField = ({ 
  label, 
  value, 
  onChange, 
  type = 'text', 
  placeholder, 
  options, 
  readonly, 
  required = false,
  error,
  helperText 
}) => {
  if (options) {
    return (
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <select
          value={value || ''}
          onChange={onChange}
          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#269745] focus:border-[#269745] outline-none bg-white transition-all ${
            error ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300'
          }`}
        >
          <option value="">-- Sélectionner --</option>
          {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        {helperText && <p className="text-gray-500 text-sm mt-1">{helperText}</p>}
      </div>
    );
  }

  if (type === 'radio') {
    return (
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="flex space-x-6">
          {placeholder.map(opt => (
            <label key={opt} className="flex items-center cursor-pointer group">
              <input
                type="radio"
                value={opt}
                checked={value === opt}
                onChange={onChange}
                className="w-4 h-4 text-[#269745] border-gray-300 focus:ring-[#269745]"
              />
              <span className="ml-2 text-gray-700 group-hover:text-gray-900">{opt}</span>
            </label>
          ))}
        </div>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    );
  }

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readonly}
        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#269745] focus:border-[#269745] outline-none transition-all ${
          readonly ? 'bg-green-50 cursor-not-allowed' : 'bg-white'
        } ${error ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300'}`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      {helperText && <p className="text-gray-500 text-sm mt-1">{helperText}</p>}
    </div>
  );
};

// Composant pour les champs dynamiques (pièces)
const DynamicPieceManager = ({ pieces, onPiecesChange, errors }) => {
  const addPiece = () => {
    const newPieces = [...pieces, {
      id: Date.now(),
      niveau: '',
      destination: '',
      surface: '',
      surfaceOuverture: '',
      hauteurLinteaux: '',
      hauteurPlafond: ''
    }];
    onPiecesChange(newPieces);
  };

  const updatePiece = (id, field, value) => {
    const updatedPieces = pieces.map(piece => 
      piece.id === id ? { ...piece, [field]: value } : piece
    );
    onPiecesChange(updatedPieces);
  };

  const removePiece = (id) => {
    const filteredPieces = pieces.filter(piece => piece.id !== id);
    onPiecesChange(filteredPieces);
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Caractéristiques des pièces
        </label>
        <button
          type="button"
          onClick={addPiece}
          className="flex items-center space-x-2 px-4 py-2 bg-[#269745] text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          <MaterialIcon name="add" size={16} />
          <span>Ajouter une pièce</span>
        </button>
      </div>

      {pieces.map((piece, index) => (
        <div key={piece.id} className="mb-6 p-4 border rounded-lg bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-gray-800">Pièce {index + 1}</h4>
            <button
              type="button"
              onClick={() => removePiece(piece.id)}
              className="text-red-500 hover:text-red-700"
            >
              <MaterialIcon name="delete" size={20} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Niveau"
              type="number"
              value={piece.niveau}
              onChange={(e) => updatePiece(piece.id, 'niveau', e.target.value)}
              error={errors[`pieces_${piece.id}_niveau`]}
            />
            <InputField
              label="Destination"
              value={piece.destination}
              onChange={(e) => updatePiece(piece.id, 'destination', e.target.value)}
              error={errors[`pieces_${piece.id}_destination`]}
            />
            <InputField
              label="Surface (m²)"
              type="number"
              value={piece.surface}
              onChange={(e) => updatePiece(piece.id, 'surface', e.target.value)}
              error={errors[`pieces_${piece.id}_surface`]}
            />
            <InputField
              label="Surface ouverture (m²)"
              type="number"
              value={piece.surfaceOuverture}
              onChange={(e) => updatePiece(piece.id, 'surfaceOuverture', e.target.value)}
              error={errors[`pieces_${piece.id}_surfaceOuverture`]}
            />
            <InputField
              label="Hauteur linteaux (m)"
              type="number"
              value={piece.hauteurLinteaux}
              onChange={(e) => updatePiece(piece.id, 'hauteurLinteaux', e.target.value)}
              error={errors[`pieces_${piece.id}_hauteurLinteaux`]}
            />
            <InputField
              label="Hauteur sous plafond (m)"
              type="number"
              value={piece.hauteurPlafond}
              onChange={(e) => updatePiece(piece.id, 'hauteurPlafond', e.target.value)}
              error={errors[`pieces_${piece.id}_hauteurPlafond`]}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

// Upload de fichiers amélioré
const FileUpload = ({ label, files, onChange, onRemove, required = false, acceptedTypes = [] }) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      {files.map((file, idx) => (
        <div key={idx} className="flex items-center justify-between p-3 mb-2 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <MaterialIcon name="description" size={24} className="text-green-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">{file.name}</p>
              <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              type="button"
              className="p-1 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-full transition-colors"
              title="Prévisualiser"
            >
              <MaterialIcon name="visibility" size={20} />
            </button>
            <button 
              type="button"
              onClick={() => onRemove(idx)}
              className="p-1 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors"
              title="Supprimer"
            >
              <MaterialIcon name="delete" size={20} />
            </button>
          </div>
        </div>
      ))}
      
      <label className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#269745] hover:bg-green-50 transition-all">
        <div className="flex items-center space-x-2 text-gray-600">
          <MaterialIcon name="add" size={24} />
          <span className="font-medium">Ajouter un document</span>
        </div>
        <input 
          type="file" 
          className="hidden" 
          onChange={onChange}
          accept={acceptedTypes.length > 0 ? acceptedTypes.join(',') : undefined}
        />
      </label>
      
      {acceptedTypes.length > 0 && (
        <p className="text-xs text-gray-500 mt-1">
          Formats acceptés: {acceptedTypes.join(', ')}
        </p>
      )}
    </div>
  );
};

const PermisConstruction = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [currentSection, setCurrentSection] = useState(1);
  const [formData, setFormData] = useState({});
  const [files, setFiles] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedSections, setCompletedSections] = useState({});
  const [pieces, setPieces] = useState([]);

  // Chargement des icônes Material et des données localStorage
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons+Outlined';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Chargement depuis localStorage
    const savedData = localStorage.getItem('permis_construction_data');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData(parsedData.formData || {});
        setCompletedSections(parsedData.completedSections || {});
        setPieces(parsedData.pieces || []);
        setCurrentStep(parsedData.currentStep || 1);
        setCurrentSection(parsedData.currentSection || 1);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      }
    }

    return () => document.head.removeChild(link);
  }, []);

  // Sauvegarde automatique dans localStorage
  useEffect(() => {
    const dataToSave = {
      formData,
      completedSections,
      pieces,
      currentStep,
      currentSection,
      lastSaved: new Date().toISOString()
    };
    
    localStorage.setItem('permis_construction_data', JSON.stringify(dataToSave));
  }, [formData, completedSections, pieces, currentStep, currentSection]);

  // Configuration des étapes
  const steps = [
    { id: 1, title: 'IDENTIFICATION', icon: 'person' },
    { id: 2, title: 'RENSEIGNEMENT ARCHITECTURAL', icon: 'architecture' },
    { id: 3, title: 'RENSEIGNEMENT TECHNIQUE', icon: 'engineering' },
    { id: 4, title: 'PIÈCES JOINTES', icon: 'attach_file' }
  ];

  // Configuration des sections avec validation
  const sidebarItems = {
    1: [
      { 
        id: 1, 
        title: 'Choix de construction', 
        icon: 'home_work',
        fields: [
          { 
            label: 'Spécifier la nature du travaux', 
            name: 'natureTravaux', 
            type: 'select',
            options: ['Nouvelle construction', 'Continuez un travaux', 'Rennovation'],
            required: false 
          },
          { 
            label: 'Type d\'affectation', 
            name: 'typeAffectation', 
            type: 'select',
            options: ['Maison individuelle', 'Habitation minime important', 'Commerce', 'Industrie'],
            required: false 
          },
        ] 
      },
      { 
        id: 2, 
        title: 'Référence alignement', 
        icon: 'straighten',
        fields: [{ 
          label: 'Référence d\'alignement', 
          name: 'referenceAlignement', 
          type: 'text',
          placeholder: 'Ex: REF-2024-001',
          required: false 
        }] 
      },
      { 
        id: 3, 
        title: 'Renseignement du Propriétaire', 
        icon: 'straighten',
        fields: [
          { label: 'Civilité', name: 'civiliteProprietaire', type: 'radio', placeholder: ['Madame', 'Monsieur'], required: false },
          { label: 'Nom complet', name: 'nomProprietaire', type: 'text', required: false },
          { label: 'Téléphone', name: 'telProprietaire', type: 'tel', required: false },
          { label: 'Email', name: 'emailProprietaire', type: 'email', required: false },
          { label: 'CIN', name: 'cinProprietaire', type: 'number', required: false },
          { label: 'Adresse', name: 'adresseProprietaire', type: 'text', required: false }
        ] 
      },
    ],
    2: [
      { 
        id: 1, 
        title: 'Auteur de l\'ouvrage', 
        icon: 'groups',
        fields: [
          { label: 'Auteur de l\'ouvrage', name: 'auteurOuvrage', type: 'radio', placeholder: ['Architecte', 'Ingénieur BTP / Déssinateur agréer'], required: false },
          { label: 'Nom', name: 'nomAuteur', type: 'text', required: false },
          { label: 'Fonction', name: 'fonctionAuteur', type: 'text', required: false },
          { label: 'Numéro d\'ordre', name: 'numeroOrdreAuteur', type: 'text', required: false },
          { label: 'Téléphone', name: 'telAuteur', type: 'tel', required: false },
          { label: 'Email', name: 'emailAuteur', type: 'email', required: false },
          { label: 'Adresse', name: 'adresseAuteur', type: 'text', required: false },
        ] 
      },
      { 
        id: 2, 
        title: 'Renseignement sur les travaux', 
        icon: 'construction',
        fields: [
          { label: 'Zone d\'implantation', name: 'zoneImplantation', type: 'select', options: ['Zone à construire', 'Zone de lotissement', 'Zone soumise au remblai', 'ZPPAUP'], required: false },
          { label: 'Matériaux', name: 'materiaux', type: 'text', required: false },
          { label: 'Durée (Mois)', name: 'dureeTravaux', type: 'number', required: false },
          { label: 'Montant (Ar)', name: 'montantTravaux', type: 'number', required: false }
        ] 
      },
      { 
        id: 3, 
        title: 'Caractéristique du projet', 
        icon: 'apartment',
        fields: [
          { label: 'Longueur', name: 'longueurProjet', type: 'number', required: false },
          { label: 'Largeur / profondeur', name: 'largeurProjet', type: 'number', required: false },
          { label: 'Hauteur (m)', name: 'hauteurProjet', type: 'number', required: false },
        ] 
      }
    ],
    3: [
      { 
        id: 1, 
        title: 'Surface & volumes', 
        icon: 'square_foot',
        fields: [
          { label: 'Surface du terrain (m²)', name: 'surfaceTerrain', type: 'number', required: false },
          { label: 'Emprise au sol existant (m²)', name: 'empriseSolExistant', type: 'number', required: false },
          { label: 'Emprise au sol (m²)', name: 'empriseSol', type: 'number', required: false },
          { label: 'CES du projet', name: 'cesProjet', type: 'number', required: false },
          { label: 'Surface de plancher des batiments existant (m²)', name: 'surfacePlancherExistant', type: 'number', required: false },
          { label: 'Surface de plancher du projet (m²)', name: 'surfacePlancherProjet', type: 'number', required: false },
          { label: 'Surface verte (m²)', name: 'surfaceVerte', type: 'number', required: false },
          { label: 'Niveau projet R+ (m³)', name: 'niveauRPlus', type: 'number', required: false }
        ] 
      },
      { 
        id: 2, 
        title: 'Distance relative du projet par rapport à l\'axe', 
        icon: 'social_distance',
        fields: [
          { label: 'Chemin public', name: 'distanceCheminPublic', type: 'number', required: false },
          { label: 'Sentier public', name: 'distanceSentierPublic', type: 'number', required: false },
          { label: 'Route Nationale', name: 'distanceRouteNationale', type: 'number', required: false },
          { label: 'Cours d\'eau / Rivière', name: 'distanceRiviere', type: 'number', required: false },
          { label: 'Canal public', name: 'distanceCanalPublic', type: 'number', required: false },
          { label: 'Installation de transport d\'énergie', name: 'distanceInstallationEnergie', type: 'number', required: false },
          { label: 'Ligne éléctrique à haute tension', name: 'distanceLigneElectrique', type: 'number', required: false },
          { label: 'Implantation du projet par rapport aux limite de la propriété (m)', name: 'distanceProjetLimitePropriete', type: 'number', required: false },
          { label: 'Distance minimale entre le projet et une construction éxistante', name: 'distanceMinimaleProjetConstructionExistante', type: 'number', required: false },
        ] 
      },
      { 
        id: 3, 
        title: 'Équipement terrain', 
        icon: 'plumbing',
        fields: [
          { label: 'Raccordement eau', name: 'equipementEau', type: 'radio', placeholder: ['Oui', 'Non'], required: false },
          { label: 'Raccordement électricité', name: 'equipementElectricite', type: 'radio', placeholder: ['Oui', 'Non'], required: false },
          { label: 'Assainissement', name: 'equipementAssainissement', type: 'radio', placeholder: ['Oui', 'Non'], required: false },
          { label: 'Voie d\'accès', name: 'equipementVoieAcces', type: 'radio', placeholder: ['Oui', 'Non'], required: false }
        ] 
      },
      { 
        id: 4, 
        title: 'Caractéristiques des pièces', 
        icon: 'room_preferences',
        isDynamic: true // Indication spéciale pour les champs dynamiques
      },      
      { 
        id: 5, 
        title: 'Équipement de l\'ouvrage', 
        icon: 'hvac',
        fields: [
          { label: 'Implémentation du VH / VB au niveau du toilette, cuisine, fosse eptique', name: 'existantVhVb', type: 'radio', placeholder: ['Oui', 'Non'], required: false },
          { label: 'Terasse', name: 'existantTerasse', type: 'radio', placeholder: ['Oui', 'Non'], required: false },
          { label: 'Garde Corp', name: 'existantGardeCorp', type: 'radio', placeholder: ['Oui', 'Non'], required: false },
          { label: 'Nombre veranda (m)', name: 'nbrVeranda', type: 'number', required: false },
          { label: 'Nombre couloir (m)', name: 'nbrCouloir', type: 'number', required: false },
          { label: 'Nombre escalier (m)', name: 'nbrEscalier', type: 'number', required: false },
          { label: 'Nombre Servitude / Voie d\'acces (m)', name: 'nbrServitude', type: 'number', required: false },
        ] 
      },
      { 
        id: 6, 
        title: 'Assainissement', 
        icon: 'water_drop',
        fields: [
          { label: 'Branchement au réseau public pour l\'écoulement des eaux (EU, FV, FP)', name: 'existantBranchementEauPublic', type: 'radio', placeholder: ['Oui', 'Non'], required: false },
          { label: 'Utilisation de la fosse éptique', name: 'utilisationFosseEptique', type: 'radio', placeholder: ['Oui', 'Non'], required: false },
          { label: 'Si oui', name: 'typeFosseEptique', type: 'radio', placeholder: ['Fosse en béton armé', 'Fosse en plastique'], required: false },
          { label: 'Implantation des fosses séptiques par rapport à la fondation', name: 'evacuationEauxPluviales', type: 'number', required: false },
          { label: 'Nombre d\'usager', name: 'nbrUsageFosse', type: 'number', required: false },
          { label: 'Capacité de la fosse', name: 'capaciteFosse', type: 'number', required: false },
          { label: 'Utilisation d\'un puisard', name: 'utilisationPuisard', type: 'radio', placeholder: ['Oui', 'Non'], required: false },
          { label: 'Si oui Implantation du puisard par rapport à la fondation', name: 'puisardAuFondation', type: 'number', required: false },
          { label: 'Présentation du goutière et déscentes d\'EP', name: 'presentationGoutiere', type: 'radio', placeholder: ['Oui', 'Non'], required: false },
          { label: 'Présentation des regards de collecte des eaux sur le plan d\'implantation du fondation', name: 'presentationRegardCollecte', type: 'radio', placeholder: ['Oui', 'Non'], required: false }
        ] 
      }
    ],
    4: [
     
      { 
        id: 1, 
        title: 'Documents techniques', 
        icon: 'engineering',
        files: [
          { name: 'planTerrain', label: 'Plan de situation du terrain', required: false },
          { name: 'droitPropriete', label: 'Titre de propriété', required: false },
          { name: 'planLimiteTerrain', label: 'Plan des limites du terrain', required: false },
          { name: 'planMasse', label: 'Plan de masse', required: false },
          { name: 'planFacade', label: 'Plan des façades', required: false }
        ] 
      }
    ]
  };

  // Validation des champs
  const validateField = (name, value, field) => {
    if (field.required && (!value || value.toString().trim() === '')) {
      return `${field.label} est requis`;
    }
    
    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Format email invalide';
      }
    }
    
    if (field.type === 'tel' && value) {
      const telRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
      if (!telRegex.test(value)) {
        return 'Format téléphone invalide';
      }
    }
    
    if (field.type === 'number' && value && isNaN(value)) {
      return 'Valeur numérique requise';
    }
    
    return null;
  };

  // Validation d'une section
  const validateSection = (stepId, sectionId) => {
    const section = sidebarItems[stepId][sectionId - 1];
    if (!section) return true;

    const newErrors = {};
    let isValid = true;

    if (section.fields) {
      section.fields.forEach(field => {
        const error = validateField(field.name, formData[field.name], field);
        if (error) {
          newErrors[field.name] = error;
          isValid = false;
        }
      });
    }

    if (section.files) {
      section.files.forEach(file => {
        if (file.required && (!files[file.name] || files[file.name].length === 0)) {
          newErrors[file.name] = `${file.label} est requis`;
          isValid = false;
        }
      });
    }

    setErrors(prev => ({ ...prev, ...newErrors }));
    return isValid;
  };

  const handleChange = (name) => (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Effacer l'erreur si le champ devient valide
    if (errors[name]) {
      const field = getCurrentSection()?.fields?.find(f => f.name === name);
      if (field && !validateField(name, value, field)) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    }
  };

  const handleFileAdd = (field) => (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setFiles(prev => ({
      ...prev,
      [field]: prev[field] ? [...prev[field], file] : [file]
    }));
    
    // Effacer l'erreur de fichier si présente
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleFileRemove = (field, idx) => {
    setFiles(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== idx)
    }));
  };

  const getCurrentSection = () => sidebarItems[currentStep][currentSection - 1];

  const handleNext = () => {
    // Valider la section actuelle
    if (!validateSection(currentStep, currentSection)) {
      return;
    }

    // Marquer la section comme complétée
    setCompletedSections(prev => ({
      ...prev,
      [`${currentStep}-${currentSection}`]: true
    }));

    const maxSection = sidebarItems[currentStep].length;
    if (currentSection < maxSection) {
      setCurrentSection(currentSection + 1);
    } else if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      setCurrentSection(1);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setCurrentSection(sidebarItems[currentStep - 1].length);
    }
  };

const handleSubmit = async () => {
    if (!validateSection(currentStep, currentSection)) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Préparer toutes les données pour l'envoi
      const allData = {
        formData,
        pieces,
        files: Object.keys(files).reduce((acc, key) => {
          acc[key] = files[key].map(file => ({
            name: file.name,
            size: file.size,
            type: file.type,
            // ⚠️ à adapter si tu veux envoyer réellement le fichier (base64 ou upload séparé)
          }));
          return acc;
        }, {}),
        metadata: {
          submittedAt: new Date().toISOString(),
          totalSections: Object.values(sidebarItems).flat().length,
          completedSections: Object.keys(completedSections).length,
        },
      };

      // Appel API backend
      const response = await constructionService.createConstruction(allData);

      // Sauvegarde locale (optionnelle)
      localStorage.setItem('permis_construction_submitted', JSON.stringify(response));

      alert('Dossier soumis avec succès !');
    } catch (error) {
      console.error(error);
      alert('Erreur lors de la soumission');
    } finally {
      setIsSubmitting(false);
    }
  };


  const renderSection = () => {
    const section = getCurrentSection();
    if (!section) return null;

    if (section.files) {
      return (
        <div className="space-y-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-[#269745] bg-opacity-10 rounded-lg flex items-center justify-center">
              <MaterialIcon name={section.icon} size={24} className="text-[#269745]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
              <p className="text-gray-600">Téléchargez les documents requis</p>
            </div>
          </div>
          
          {section.files.map(file => (
            <FileUpload
              key={file.name}
              label={file.label}
              files={files[file.name] || []}
              onChange={handleFileAdd(file.name)}
              onRemove={(idx) => handleFileRemove(file.name, idx)}
              required={file.required}
              acceptedTypes={['.pdf', '.jpg', '.jpeg', '.png']}
            />
          ))}
        </div>
      );
    }

    // Section spéciale pour les pièces dynamiques
    if (section.isDynamic) {
      return (
        <div className="space-y-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-[#269745] bg-opacity-10 rounded-lg flex items-center justify-center">
              <MaterialIcon name={section.icon} size={24} className="text-[#269745]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
              <p className="text-gray-600">Ajoutez les caractéristiques de chaque pièce</p>
            </div>
          </div>
          
          <DynamicPieceManager
            pieces={pieces}
            onPiecesChange={setPieces}
            errors={errors}
          />
          
          <InputField
            label="Sous-sol"
            type="radio"
            value={formData.pieceSousSol}
            onChange={handleChange('pieceSousSol')}
            placeholder={['Oui', 'Non']}
            required={false}
            error={errors.pieceSousSol}
          />
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-12 h-12 bg-[#269745] bg-opacity-10 rounded-lg flex items-center justify-center">
            <MaterialIcon name={section.icon} size={24} className="text-[#269745]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
            <p className="text-gray-600">Remplissez les informations demandées</p>
          </div>
        </div>
        
        {section.fields.map(field => (
          <InputField
            key={field.name}
            label={field.label}
            type={field.type === 'select' ? 'select' : field.type}
            value={formData[field.name] || ''}
            onChange={handleChange(field.name)}
            placeholder={field.placeholder}
            options={field.options}
            required={field.required}
            error={errors[field.name]}
          />
        ))}
      </div>
    );
  };

  const getStepProgress = () => {
    const totalSections = Object.values(sidebarItems).flat().length;
    const completedCount = Object.keys(completedSections).length;
    return Math.round((completedCount / totalSections) * 100);
  };

  // Fonction pour effacer toutes les données
  const clearAllData = () => {
    if (confirm('Êtes-vous sûr de vouloir effacer toutes les données ?')) {
      localStorage.removeItem('permis_construction_data');
      localStorage.removeItem('permis_construction_submitted');
      setFormData({});
      setFiles({});
      setErrors({});
      setCompletedSections({});
      setPieces([]);
      setCurrentStep(1);
      setCurrentSection(1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              SOUMETTRE UN DOSSIER DE PERMIS DE CONSTRUIRE
            </h1>
            <p className="text-gray-600">Complétez votre demande étape par étape</p>
          </div>

          {/* Barre de progression */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progression</span>
              <div className="flex items-center space-x-4">
                <span>{getStepProgress()}%</span>
                <button
                  onClick={clearAllData}
                  className="text-red-500 hover:text-red-700 text-xs underline"
                  title="Effacer toutes les données"
                >
                  Réinitialiser
                </button>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-[#269745] h-2 rounded-full transition-all duration-300"
                style={{ width: `${getStepProgress()}%` }}
              ></div>
            </div>
          </div>

          {/* Steps */}
          <div className="flex justify-between">
            {steps.map((step, idx) => (
              <div key={step.id} className="flex flex-col items-center">
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                    currentStep === step.id 
                      ? 'bg-[#269745] text-white shadow-lg' 
                      : currentStep > step.id
                      ? 'bg-green-100 text-[#269745]'
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {currentStep > step.id ? (
                      <MaterialIcon name="check" size={20} />
                    ) : (
                      <MaterialIcon name={step.icon} size={20} />
                    )}
                  </div>
                  {idx < steps.length - 1 && (
                    <div className={`w-16 h-1 ml-4 ${
                      currentStep > step.id ? 'bg-[#269745]' : 'bg-gray-200'
                    }`}></div>
                  )}
                </div>
                <span className={`mt-3 text-sm font-medium text-center max-w-24 ${
                  currentStep === step.id ? 'text-[#269745]' : 'text-gray-600'
                }`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="flex min-h-[700px]">
            {/* Sidebar */}
            <div className="w-80 bg-gray-50 border-r border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <MaterialIcon name={steps[currentStep - 1]?.icon} size={20} className="mr-2" />
                  {steps[currentStep - 1]?.title}
                </h3>
              </div>
              
              <div className="p-4 space-y-2">
                {sidebarItems[currentStep]?.map(item => (
                  <button 
                    key={item.id} 
                    onClick={() => setCurrentSection(item.id)}
                    className={`w-full flex items-center p-4 rounded-lg text-left transition-all ${
                      item.id === currentSection 
                        ? 'bg-[#269745] text-white shadow-md' 
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 ${
                      item.id === currentSection 
                        ? 'bg-white bg-opacity-20 text-white' 
                        : completedSections[`${currentStep}-${item.id}`]
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {completedSections[`${currentStep}-${item.id}`] ? (
                        <MaterialIcon name="check" size={16} />
                      ) : (
                        <MaterialIcon name={item.icon} size={16} />
                      )}
                    </div>
                    <span className="font-medium text-sm leading-tight">{item.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Form Content */}
            <div className="flex-1 p-8">
              {renderSection()}

              {/* Navigation */}
              <div className="mt-12 pt-8 border-t border-gray-200 flex justify-between items-center">
                <button 
                  onClick={handlePrevious} 
                  disabled={currentStep === 1 && currentSection === 1}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                    currentStep === 1 && currentSection === 1 
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  <MaterialIcon name="arrow_back" size={20} />
                  <span>PRÉCÉDENT</span>
                </button>

                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">
                    Section {currentSection} sur {sidebarItems[currentStep]?.length}
                  </span>
                  
                  {currentStep === 4 && currentSection === sidebarItems[4].length ? (
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className={`flex items-center space-x-2 px-8 py-3 rounded-lg font-medium transition-all ${
                        isSubmitting
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-[#269745] hover:bg-green-600 text-white shadow-lg'
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>ENVOI EN COURS...</span>
                        </>
                      ) : (
                        <>
                          <span>ENVOYER LE DOSSIER</span>
                          <MaterialIcon name="send" size={20} />
                        </>
                      )}
                    </button>
                  ) : (
                    <button 
                      onClick={handleNext}
                      className="flex items-center space-x-2 px-6 py-3 bg-[#269745] hover:bg-green-600 text-white rounded-lg font-medium transition-all shadow-md"
                    >
                      <span>SUIVANT</span>
                      <MaterialIcon name="arrow_forward" size={20} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section d'aide */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <MaterialIcon name="info" size={24} className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Besoin d'aide ?</h3>
              <p className="text-blue-800 text-sm mb-3">
                Pour toute question concernant votre dossier de permis de construire, 
                vous pouvez consulter notre guide ou contacter nos services.
              </p>
              <div className="flex space-x-4">
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                  <MaterialIcon name="help" size={16} />
                  <span>Guide d'aide</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-white hover:bg-blue-50 text-blue-600 border border-blue-300 rounded-lg text-sm font-medium transition-colors">
                  <MaterialIcon name="support_agent" size={16} />
                  <span>Contacter le support</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sauvegarde automatique */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500 flex items-center justify-center space-x-2">
            <MaterialIcon name="cloud_done" size={16} className="text-green-500" />
            <span>Vos données sont automatiquement sauvegardées localement</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PermisConstruction;