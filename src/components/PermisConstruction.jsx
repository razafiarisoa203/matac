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

const PermisConstruction = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [currentSection, setCurrentSection] = useState(1);
  const [formData, setFormData] = useState({});
  const [completedSections, setCompletedSections] = useState({});
  const [errors, setErrors] = useState({});
  const [files, setFiles] = useState({});
  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('permis_construction_data');
    if (saved) {
      const parsed = JSON.parse(saved);
      setFormData(parsed.formData || {});
      setCompletedSections(parsed.completedSections || {});
      setCurrentStep(parsed.currentStep || 1);
      setCurrentSection(parsed.currentSection || 1);
      setFiles(parsed.files || {});
      setPieces(parsed.pieces || []);
    }
  }, []);

 useEffect(() => {
    localStorage.setItem('permis_construction_data', JSON.stringify({
      formData, completedSections, currentStep, currentSection, files, pieces
    }));
  }, [formData, completedSections, currentStep, currentSection, files, pieces]);

  const handleChange = (name) => (e) => {
    const value = e.target ? e.target.value : e;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleSubmit = () => {
    // On récupère les données complètes
    const dataToSave = {
      formData,
      completedSections,
      currentStep,
      currentSection,
      files,
      pieces
    };

    // Sauvegarde finale dans localStorage
    localStorage.setItem('permis_construction_data_final', JSON.stringify(dataToSave));

    alert('Dossier envoyé avec succès !');

    // Optionnel : réinitialiser le formulaire
    setFormData({});
    setCompletedSections({});
    setFiles({});
    setPieces([]);
    setCurrentStep(1);
    setCurrentSection(1);
  };


  const handleFileAdd = (name) => (newFiles) => {
    setFiles(prev => ({ ...prev, [name]: [...(prev[name] || []), ...newFiles] }));
  };

  const handleFileRemove = (name, index) => {
    setFiles(prev => {
      const updated = [...(prev[name] || [])];
      updated.splice(index, 1);
      return { ...prev, [name]: updated };
    });
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

    // Section avec fichiers
    if (section.files) {
      return (
        <div className="space-y-6">
          {commonHeader}
          {section.files.map(file => (
            <div key={file.name}>
              <label className="block text-gray-700 font-medium mb-2">{file.label}</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                multiple
                onChange={(e) => {
                  const selectedFiles = Array.from(e.target.files);
                  setFiles(prev => ({ ...prev, [file.name]: [...(prev[file.name] || []), ...selectedFiles] }));
                  setFormData(prev => ({ ...prev, [file.name]: [...(prev[file.name] || []), ...selectedFiles] }));
                }}
                className="block w-full text-sm text-gray-500 border rounded px-3 py-2"
              />
              {files[file.name]?.length > 0 && (
                <ul className="mt-2">
                  {files[file.name].map((f, idx) => (
                    <li key={idx} className="flex justify-between items-center bg-gray-100 px-2 py-1 rounded mb-1">
                      <span>{f.name}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setFiles(prev => {
                            const updated = [...(prev[file.name] || [])];
                            updated.splice(idx, 1);
                            return { ...prev, [file.name]: updated };
                          });
                          setFormData(prev => {
                            const updated = [...(prev[file.name] || [])];
                            updated.splice(idx, 1);
                            return { ...prev, [file.name]: updated };
                          });
                        }}
                        className="text-red-500 text-sm"
                      >
                        Supprimer
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      );
    }


    // Section dynamique
    if (section.isDynamic) {
      return (
        <div className="space-y-6">
          {commonHeader}
          <DynamicPieceManager
            pieces={pieces}
            onPiecesChange={setPieces}
            errors={errors}
          />
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Sous-sol</label>
            <div className="flex gap-4">
              {['Oui', 'Non'].map(option => (
                <label key={option} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="pieceSousSol"
                    value={option}
                    checked={formData.pieceSousSol === option}
                    onChange={handleChange('pieceSousSol')}
                    className="accent-green-500"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
            {errors.pieceSousSol && <p className="text-red-500 text-sm mt-1">{errors.pieceSousSol}</p>}
          </div>
        </div>
      );
    }

    // Section normale avec champs
    return (
      <div className="space-y-6">
        {commonHeader}
        {section.fields?.map(field => {
          if (field.type === 'radio') {
            return (
              <div key={field.name} className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">{field.label}</label>
                <div className="flex gap-4">
                  {field.placeholder.map(option => (
                    <label key={option} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={field.name}
                        value={option}
                        checked={formData[field.name] === option}
                        onChange={handleChange(field.name)}
                        className="accent-green-500"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
                {errors[field.name] && <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>}
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
            />
          );
        })}
      </div>
    );
  };


  const getStepProgress = () => {
    const total = Object.values(sidebarItems).flat().length;
    const done = Object.keys(completedSections).length;
    return Math.round((done / total) * 100);
  };

  const handleNext = () => {
    const section = sidebarItems[currentStep]?.[currentSection - 1];
    if (!section) return;

    const newErrors = {};
    let valid = true;

    if (section.fields) {
      section.fields.forEach(field => {
        const err = validateField(field.name, formData[field.name], field);
        if (err) { newErrors[field.name] = err; valid = false; }
      });
    }

    if (!valid) { setErrors(newErrors); return; }

    setCompletedSections(prev => ({ ...prev, [`${currentStep}-${currentSection}`]: true }));

    const isLastStep = currentStep === steps.length;
    const isLastSection = currentSection === (sidebarItems[currentStep]?.length || 1);

    if (isLastStep && isLastSection) {
      // Dernière section du dernier step => envoyer le dossier
      handleSubmit();
    } else {
      // Sinon passer à la section ou step suivant
      const max = sidebarItems[currentStep]?.length || 0;
      if (currentSection < max) setCurrentSection(currentSection + 1);
      else if (currentStep < steps.length) { setCurrentStep(currentStep + 1); setCurrentSection(1); }
    }
  };

  const handlePrevious = () => {
    if (currentSection > 1) setCurrentSection(currentSection - 1);
    else if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setCurrentSection(sidebarItems[currentStep - 1]?.length || 1);
    }
  };

  const clearAllData = () => {
    if (confirm('Effacer toutes les données ?')) {
      localStorage.removeItem('permis_construction_data');
      setFormData({}); setCompletedSections({}); setFiles({}); setPieces([]);
      setCurrentStep(1); setCurrentSection(1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PermisHeader
        steps={steps}
        currentStep={currentStep}
        getStepProgress={getStepProgress}
        onReset={clearAllData}
      />
      <div className="max-w-7xl mx-auto px-6 py-8 bg-white rounded-xl shadow-sm">
        <div className="flex min-h-[700px]">
          <PermisSidebar
            steps={steps}
            currentStep={currentStep}
            currentSection={currentSection}
            sidebarItems={sidebarItems}
            completedSections={completedSections}
            onSectionChange={setCurrentSection}
          />
          <div className="flex-1 p-8">
            {renderSection()}
            <div className="mt-6 flex items-center justify-between">
              <button
                onClick={handlePrevious}
                className="flex items-center gap-2 px-4 py-2 bg-gray-300 rounded"
              >
                <ArrowBackIcon />
                Précédent
              </button>

              <span className="text-gray-700 font-medium">
                Section {currentSection} sur {sidebarItems[currentStep]?.length || 1}
              </span>

              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-4 py-2 bg-[#269745] text-white rounded"
              >
                {currentStep === steps.length && currentSection === (sidebarItems[currentStep]?.length || 1)
                  ? 'Envoyer le dossier'
                  : 'Suivant'}
                <ArrowForwardIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermisConstruction;
