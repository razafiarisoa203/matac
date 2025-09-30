// components/PermisConstruction.jsx
import React, { useEffect, useState } from 'react';
import { steps } from './PermisConst/stepsConfig';
import { sidebarItems } from './PermisConst/sidebarItemsConfig';
import { validateField } from './PermisConst/validation';
import MaterialIcon from './PermisConst/MaterialIcon';
import PermisSidebar from './PermisConst/PermisSidebar';
import PermisHeader from './PermisConst/PermisHeader';
import FileUpload from './PermisConst/FileUpload';
import DynamicPieceManager from './PermisConst/DynamicPieceManager';
import InputField from './PermisConst/InputField';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { constructionService } from '../services/api';

const PermisConstruction = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [currentSection, setCurrentSection] = useState(1);
  const [formData, setFormData] = useState({});
  const [completedSections, setCompletedSections] = useState({});
  const [errors, setErrors] = useState({});
  const [files, setFiles] = useState({});
  const [pieces, setPieces] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);

  // Charger les données sauvegardées
  useEffect(() => {
    const saved = localStorage.getItem('permis_construction_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(parsed.formData || {});
        setCompletedSections(parsed.completedSections || {});
        setCurrentStep(parsed.currentStep || 1);
        setCurrentSection(parsed.currentSection || 1);
        setFiles(parsed.files || {});
        setPieces(parsed.pieces || []);
      } catch (error) {
        console.error('Erreur lors du chargement des données sauvegardées:', error);
      }
    }
  }, []);

  // Sauvegarder les données automatiquement
  useEffect(() => {
    const dataToSave = {
      formData,
      completedSections,
      currentStep,
      currentSection,
      files,
      pieces,
      lastSaved: new Date().toISOString()
    };
    
    try {
      localStorage.setItem('permis_construction_data', JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des données:', error);
    }
  }, [formData, completedSections, currentStep, currentSection, files, pieces]);

  const handleChange = (name) => (e) => {
    const value = e.target ? e.target.value : e;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleFileAdd = (name) => (newFiles) => {
    setFiles(prev => ({ 
      ...prev, 
      [name]: [...(prev[name] || []), ...newFiles] 
    }));
  };

  const handleFileRemove = (name, index) => {
    setFiles(prev => {
      const updated = [...(prev[name] || [])];
      updated.splice(index, 1);
      return { ...prev, [name]: updated };
    });
  };

  // Fonction pour valider les pièces
  const validatePieces = (pieces) => {
    const errors = {};
    
    pieces.forEach((piece, index) => {
      if (!piece.destination || piece.destination.trim() === '') {
        errors[`pieces.${index}.destination`] = 'La destination est requise';
      }
      
      if (!piece.niveau || piece.niveau === '') {
        errors[`pieces.${index}.niveau`] = 'Le niveau est requis';
      }
      
      if (!piece.surface || piece.surface === '') {
        errors[`pieces.${index}.surface`] = 'La surface est requise';
      }
    });
    
    return errors;
  };

  // Fonction de validation principale (UNIQUEMENT CETTE DÉCLARATION)
  const validateCurrentSection = () => {
    const section = getCurrentSection();
    if (!section) return true;

    const newErrors = {};
    let valid = true;

    // Valider les champs de formulaire
    if (section.fields) {
      section.fields.forEach(field => {
        if (field.required || formData[field.name]) {
          const err = validateField(field.name, formData[field.name], field);
          if (err) {
            newErrors[field.name] = err;
            valid = false;
          }
        }
      });
    }

    // Valider les fichiers si section fichiers
    if (section.files) {
      section.files.forEach(file => {
        if (file.required && (!files[file.name] || files[file.name].length === 0)) {
          newErrors[file.name] = `${file.label} est requis`;
          valid = false;
        }
      });
    }

    // Valider les pièces si section dynamique
    if (section.isDynamic) {
      if (pieces.length === 0) {
        newErrors.pieces = 'Au moins une pièce doit être ajoutée';
        valid = false;
      } else {
        const pieceErrors = validatePieces(pieces);
        Object.assign(newErrors, pieceErrors);
        if (Object.keys(pieceErrors).length > 0) {
          valid = true;
        }
      }
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // Préparer les données complètes pour l'envoi
      const permisData = {
        formData,
        pieces,
        files
      };

      console.log('Envoi des données au backend:', permisData);

      // Validation finale avant envoi
      if (!validateCurrentSection()) {
        throw new Error('Veuillez corriger les erreurs de validation avant de soumettre');
      }

      // Appel au service backend
      const result = await constructionService.submitPermisConstruction(permisData);
      
      console.log('Réponse du serveur:', result);
      
      // Sauvegarde finale avec les informations de soumission
      const finalData = {
        ...permisData,
        submittedAt: new Date().toISOString(),
        submissionId: result.id || result.data?.id,
        reference: result.reference || result.data?.reference,
        serverResponse: result
      };

      localStorage.setItem('permis_construction_data_final', JSON.stringify(finalData));
      localStorage.removeItem('permis_construction_data');

      // Afficher la confirmation
      setSubmissionResult({
        success: true,
        reference: result.reference || `REF-${Date.now()}`,
        message: result.message || 'Dossier soumis avec succès',
        submissionId: result.id || result.data?.id
      });
      setShowConfirmation(true);

    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      
      let errorMessage = 'Erreur lors de l\'envoi du dossier. ';
      
      if (error.response) {
        const serverError = error.response.data;
        errorMessage += `Code: ${error.response.status}. `;
        
        if (serverError.message) {
          errorMessage += `Message: ${serverError.message}`;
        } else if (serverError.errors) {
          const validationErrors = Object.values(serverError.errors).join(', ');
          errorMessage += `Erreurs: ${validationErrors}`;
        }
      } else if (error.request) {
        errorMessage += 'Impossible de contacter le serveur. Vérifiez votre connexion internet.';
      } else {
        errorMessage += error.message;
      }
      
      setSubmissionResult({
        success: false,
        message: errorMessage
      });
      setShowConfirmation(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    if (submissionResult?.success) {
      setFormData({});
      setCompletedSections({});
      setFiles({});
      setPieces([]);
      setCurrentStep(1);
      setCurrentSection(1);
    }
  };

  const getCurrentSection = () => {
    return sidebarItems[currentStep]?.[currentSection - 1];
  };

  const renderSection = () => {
    const section = getCurrentSection();
    if (!section) return null;

    const commonHeader = (
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-12 h-12 bg-[#269745] bg-opacity-10 rounded-lg flex items-center justify-center">
          <MaterialIcon name={section.icon} size={24} className="text-[#269745]" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
          <p className="text-gray-600">
            {section.files
              ? 'Téléchargez les documents requis'
              : section.isDynamic
                ? 'Ajoutez les caractéristiques de chaque pièce'
                : 'Remplissez les informations demandées'}
          </p>
        </div>
      </div>
    );

    if (section.files) {
      return (
        <div className="space-y-6">
          {commonHeader}
          {section.files.map(file => (
            <div key={file.name} className="border rounded-lg p-4 bg-gray-50">
              <label className="block text-gray-700 font-medium mb-3">
                {file.label}
                {file.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <FileUpload
                onFilesAdd={handleFileAdd(file.name)}
                onFileRemove={(index) => handleFileRemove(file.name, index)}
                acceptedFiles={files[file.name] || []}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                multiple={true}
              />
              {files[file.name]?.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-2">
                    {files[file.name].length} fichier(s) téléchargé(s)
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }

    if (section.isDynamic) {
      return (
        <div className="space-y-6">
          {commonHeader}
          <DynamicPieceManager
            pieces={pieces}
            onPiecesChange={setPieces}
            errors={errors}
          />
          <div className="mb-4 p-4 border rounded-lg bg-gray-50">
            <label className="block text-gray-700 font-medium mb-2">Sous-sol</label>
            <div className="flex gap-6">
              {['Oui', 'Non'].map(option => (
                <label key={option} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="pieceSousSol"
                    value={option}
                    checked={formData.pieceSousSol === option}
                    onChange={handleChange('pieceSousSol')}
                    className="accent-green-500 w-4 h-4"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
            {errors.pieceSousSol && (
              <p className="text-red-500 text-sm mt-1">{errors.pieceSousSol}</p>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {commonHeader}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {section.fields?.map(field => {
            if (field.type === 'radio') {
              return (
                <div key={field.name} className="md:col-span-2 p-4 border rounded-lg bg-gray-50">
                  <label className="block text-gray-700 font-medium mb-3">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  <div className="flex gap-6 flex-wrap">
                    {field.placeholder.map(option => (
                      <label key={option} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name={field.name}
                          value={option}
                          checked={formData[field.name] === option}
                          onChange={handleChange(field.name)}
                          className="accent-green-500 w-4 h-4"
                        />
                        <span className="text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                  {errors[field.name] && (
                    <p className="text-red-500 text-sm mt-2">{errors[field.name]}</p>
                  )}
                </div>
              );
            }

            return (
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
                className="p-4 border rounded-lg bg-gray-50"
              />
            );
          })}
        </div>
      </div>
    );
  };

  const getStepProgress = () => {
    const total = Object.values(sidebarItems).flat().length;
    const done = Object.keys(completedSections).length;
    return total > 0 ? Math.round((done / total) * 100) : 0;
  };

  const handleNext = async () => {
    if (!validateCurrentSection()) {
      return;
    }

    setCompletedSections(prev => ({
      ...prev,
      [`${currentStep}-${currentSection}`]: true
    }));

    const isLastStep = currentStep === steps.length;
    const isLastSection = currentSection === (sidebarItems[currentStep]?.length || 1);

    if (isLastStep && isLastSection) {
      await handleSubmit();
    } else {
      const maxSections = sidebarItems[currentStep]?.length || 0;
      if (currentSection < maxSections) {
        setCurrentSection(currentSection + 1);
      } else if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
        setCurrentSection(1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
    } else if (currentStep > 1) {
      const previousStep = currentStep - 1;
      const maxSections = sidebarItems[previousStep]?.length || 1;
      setCurrentStep(previousStep);
      setCurrentSection(maxSections);
    }
  };

  const clearAllData = () => {
    if (window.confirm('Êtes-vous sûr de vouloir effacer toutes les données ? Cette action est irréversible.')) {
      localStorage.removeItem('permis_construction_data');
      localStorage.removeItem('permis_construction_data_final');
      setFormData({});
      setCompletedSections({});
      setFiles({});
      setPieces([]);
      setCurrentStep(1);
      setCurrentSection(1);
      setErrors({});
    }
  };

  const ConfirmationModal = () => {
    if (!showConfirmation) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-auto">
          <div className="text-center">
            {submissionResult?.success ? (
              <>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Dossier soumis avec succès !</h2>
                <p className="text-gray-600 mb-4">{submissionResult.message}</p>
                {submissionResult.reference && (
                  <div className="bg-gray-50 rounded p-3 mb-4">
                    <p className="text-sm text-gray-600">Numéro de référence</p>
                    <p className="font-mono text-lg font-bold text-gray-900">
                      {submissionResult.reference}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Erreur de soumission</h2>
                <p className="text-gray-600 mb-4">{submissionResult?.message}</p>
              </>
            )}
            
            <button
              onClick={handleConfirmationClose}
              className={`w-full py-2 px-4 rounded font-medium transition-colors ${
                submissionResult?.success 
                  ? 'bg-green-500 text-white hover:bg-green-600' 
                  : 'bg-gray-500 text-white hover:bg-gray-600'
              }`}
            >
              {submissionResult?.success ? 'Fermer' : 'Réessayer'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PermisHeader
        steps={steps}
        currentStep={currentStep}
        getStepProgress={getStepProgress}
        onReset={clearAllData}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="flex flex-col lg:flex-row min-h-[600px]">
            <PermisSidebar
              steps={steps}
              currentStep={currentStep}
              currentSection={currentSection}
              sidebarItems={sidebarItems}
              completedSections={completedSections}
              onSectionChange={setCurrentSection}
            />
            
            <div className="flex-1 p-6 lg:p-8">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Demande de Permis de Construction
                </h1>
                <p className="text-gray-600">
                  Remplissez toutes les sections pour soumettre votre demande
                </p>
              </div>

              {renderSection()}

              <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 1 && currentSection === 1}
                  className="flex items-center gap-2 px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowBackIcon />
                  Précédent
                </button>

                <div className="text-center">
                  <span className="text-gray-700 font-medium">
                    Étape {currentStep} sur {steps.length} • 
                    Section {currentSection} sur {sidebarItems[currentStep]?.length || 1}
                  </span>
                </div>

                <button
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className={`flex items-center gap-2 px-6 py-2 text-white rounded-lg transition-colors ${
                    isSubmitting 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-green-500 hover:bg-green-600'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      {currentStep === steps.length && currentSection === (sidebarItems[currentStep]?.length || 1)
                        ? 'Soumettre le dossier'
                        : 'Suivant'}
                      <ArrowForwardIcon />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationModal />
    </div>
  );
};

export default PermisConstruction;