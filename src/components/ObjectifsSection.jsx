import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const ObjectifsSection = () => {
  const { t } = useTranslation();
  const [isTitleHovered, setIsTitleHovered] = useState(false);

  // Récupérer objectives et forcer en tableau
  const objectivesRaw = t('objectives.objectivesList', { returnObjects: true }) || [];
  const objectives = Array.isArray(objectivesRaw) ? objectivesRaw : Object.values(objectivesRaw);

  return (
    <section id="objectifs" className="py-16 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* En-tête */}
        <div className="text-left mb-12">
          <div
            className="relative inline-block"
            onMouseEnter={() => setIsTitleHovered(true)}
            onMouseLeave={() => setIsTitleHovered(false)}
          >
            <h2 className="text-4xl font-bold text-[#269745] dark:text-green-400">
              {t('objectives.title')}
            </h2>
            <div
              className={`absolute bottom-0 left-0 h-1 bg-black dark:bg-green-400 transition-all duration-300 ${
                isTitleHovered ? "w-full" : "w-0"
              }`}
              style={{ bottom: "-8px" }}
            ></div>
          </div>
        </div>

        {/* Grille des objectifs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {objectives.map((objective, index) => (
            <div
              key={index}
              className={`group flex flex-col items-center text-center w-full max-w-sm
                ${index >= 3 ? "lg:col-span-1" : ""}
              `}
            >
              <div className="border-2 border-gray-300 dark:border-gray-600 
                              bg-white dark:bg-gray-800 
                              p-6 rounded-lg shadow-md 
                              hover:border-[#269745] dark:hover:border-green-500 
                              hover:shadow-xl 
                              transition-all duration-300 hover:-translate-y-2 
                              relative w-full h-64">
                
                {/* Numéro */}
                <div className="absolute top-2 left-2 w-10 h-10 rounded-full 
                                bg-[#269745] dark:bg-green-600 
                                flex items-center justify-center 
                                font-bold text-white text-sm shadow-lg 
                                transition-all duration-300 group-hover:scale-105 
                                border-2 border-white dark:border-gray-800">
                  {objective.number}
                </div>

                {/* Contenu */}
                <div className="flex flex-col items-center space-y-4 h-full justify-center">
                  <svg
                    className="w-6 h-6 text-[#269745] dark:text-green-400 
                               group-hover:scale-110 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>

                  <p className="text-gray-800 dark:text-gray-200 leading-relaxed text-lg text-center px-2">
                    {objective.title}
                  </p>

                  <div className="w-0 group-hover:w-16 h-0.5 bg-[#269745] dark:bg-green-400 mt-2 transition-all duration-500"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Centrage des 2 dernières cartes sur grand écran */}
        {objectives.length > 3 && (
          <style>{`
            @media (min-width: 1024px) {
              #objectifs .grid > div:nth-child(4) {
                grid-column: 1 / 2;
                justify-self: end;
              }
              #objectifs .grid > div:nth-child(5) {
                grid-column: 2 / 3;
                justify-self: start;
              }
            }
          `}</style>
        )}
      </div>
    </section>
  );
};

export default ObjectifsSection;