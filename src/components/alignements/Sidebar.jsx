import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, X, ChevronRight } from 'lucide-react';

const Sidebar = ({ steps, currentStep, handleStepClick }) => {
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Détecter la taille de l'écran
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleStepClickWithClose = (stepNumber) => {
    handleStepClick(stepNumber);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Bouton hamburger pour mobile - positionné pour éviter les superpositions */}
      {isMobile && (
        <button
          onClick={() => setSidebarOpen(true)}
          className={`fixed z-50 bg-[#269745] text-white p-3 rounded-lg shadow-lg lg:hidden transition-all duration-300 ${
            sidebarOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
          style={{
            top: '80px', // Ajustez cette valeur selon la hauteur de votre header
            left: '16px'
          }}
          aria-label="Ouvrir le menu"
        >
          <Menu size={24} />
        </button>
      )}

      {/* Overlay pour mobile */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <div className={`
        ${isMobile ? 'fixed' : 'sticky'} top-0 left-0 h-screen z-40 lg:z-auto
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        w-64 lg:w-72 xl:w-80
      `}>
        <div className="h-full border-r border-gray-200 bg-white lg:bg-gray-50 overflow-y-auto">
          {/* En-tête de la sidebar pour mobile */}
          {isMobile && (
            <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
              <h3 className="text-base font-medium text-gray-700">
                {t('alignment.information')}
              </h3>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
                aria-label="Fermer le menu"
              >
                <X size={20} />
              </button>
            </div>
          )}

          {/* Contenu de la sidebar */}
          <div className={`p-4 lg:p-6 ${isMobile ? 'pt-0' : ''}`}>
            {!isMobile && (
              <h3 className="text-base lg:text-lg font-medium text-gray-700 mb-4 lg:mb-6">
                {t('alignment.information')}
              </h3>
            )}
            
            <div className="space-y-2 lg:space-y-4">
              {steps.map((step) => (
                <button
                  key={step.number}
                  onClick={() => handleStepClickWithClose(step.number)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors text-left group ${
                    step.number === currentStep
                      ? "bg-[#269745] text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-100 hover:shadow-sm"
                  }`}
                >
                  <div
                    className={`w-7 h-7 lg:w-8 lg:h-8 rounded-full flex items-center justify-center text-xs lg:text-sm font-medium flex-shrink-0 ${
                      step.number === currentStep
                        ? "bg-white text-green-500"
                        : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                    }`}
                  >
                    {step.number}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm lg:text-sm font-medium block truncate">
                      {step.title}
                    </span>
                    {step.subtitle && (
                      <span className={`text-xs mt-0.5 block ${
                        step.number === currentStep 
                          ? 'text-green-100' 
                          : 'text-gray-500'
                      }`}>
                        {step.subtitle}
                      </span>
                    )}
                  </div>
                  <ChevronRight 
                    className={`w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0 ${
                      step.number === currentStep 
                        ? 'text-white' 
                        : 'text-gray-400 group-hover:text-gray-600'
                    }`} 
                  />
                </button>
              ))}
            </div>

            {/* Indicateur de progression pour mobile */}
            {isMobile && (
              <div className="mt-6 p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                  <span>Progression</span>
                  <span>{currentStep}/{steps.length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-[#269745] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(currentStep / steps.length) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;