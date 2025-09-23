import React, { useState } from "react";

const ObjectifsSection = () => {
  const [isTitleHovered, setIsTitleHovered] = useState(false);
  const objectives = [
    {
      number: "01",
      title:
        "Réduire le délai de transmission des dossiers au sein de chaque fonction publique, mais aussi entre administration territoriale et administration de l'État",
    },
    {
      number: "02",
      title: "Assurer une meilleure sécurité et traçabilité des dossiers",
    },
    {
      number: "03",
      title:
        "Promouvoir et développer l'usage du numérique dans le traitement et archivage des dossiers",
    },
    {
      number: "04",
      title:
        "Mettre en place un outil de suivi des dossiers accessible aux usagers (avancement de l'instruction, demande d'avis, etc.)",
    },
    {
      number: "05",
      title:
        "Promouvoir la transparence dans le processus d'instruction des autorisations d'urbanisme à Madagascar.",
    },
  ];

  return (
    <section id="objectifs" className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-left mb-12">
          <div
            className="relative inline-block"
            onMouseEnter={() => setIsTitleHovered(true)}
            onMouseLeave={() => setIsTitleHovered(false)}
          >
            <h2 className="text-4xl font-bold text-[#269745]">
              OBJECTIFS
            </h2>
            {/* Ligne noire animée */}
            <div
              className={`absolute bottom-0 left-0 h-1 bg-black transition-all duration-300 ${isTitleHovered ? "w-full" : "w-0"}`}
              style={{ bottom: "-8px" }}
            ></div>
          </div>
        </div>

        {/* Objectifs en grille centrée */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {objectives.slice(0, 3).map((objective, index) => (
            <div
              key={index}
              className="group flex flex-col items-center text-center"
            >
              {/* Carte améliorée avec taille fixe */}
              <div className="border-2 border-gray-300 bg-white p-6 rounded-lg shadow-md hover:border-[#269745] hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative w-full h-64">
                {/* Numéro en haut à gauche */}
                <div className="absolute top-2 left-2 w-10 h-10 rounded-full bg-[#269745] flex items-center justify-center font-bold text-white text-sm shadow-lg transition-all duration-300 group-hover:scale-105 border-2 border-white">
                  {objective.number}
                </div>
                <div className="flex flex-col items-center space-y-4 h-full justify-center">
                  {/* Icône de coche */}
                  <svg
                    className="w-6 h-6 text-[#269745] group-hover:scale-110 transition-transform duration-300"
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
                  <p className="text-gray-800 leading-relaxed text-lg text-center px-2">
                    {objective.title}
                  </p>
                  {/* Ligne décorative qui apparaît au hover */}
                  <div className="w-0 group-hover:w-16 h-0.5 bg-[#269745] mt-2 transition-all duration-500"></div>
                </div>
              </div>
            </div>
          ))}
          {/* Centrer les deux dernières cartes sur large écran */}
          <div className="lg:col-span-3 flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {objectives.slice(3).map((objective, index) => (
                <div
                  key={index + 3}
                  className="group flex flex-col items-center text-center"
                >
                  {/* Carte améliorée avec taille fixe */}
                  <div className="border-2 border-gray-300 bg-white p-6 rounded-lg shadow-md hover:border-[#269745] hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative w-full h-64">
                    {/* Numéro en haut à gauche */}
                    <div className="absolute top-2 left-2 w-10 h-10 rounded-full bg-[#269745] flex items-center justify-center font-bold text-white text-sm shadow-lg transition-all duration-300 group-hover:scale-105 border-2 border-white">
                      {objective.number}
                    </div>
                    <div className="flex flex-col items-center space-y-4 h-full justify-center">
                      {/* Icône de coche */}
                      <svg
                        className="w-6 h-6 text-[#269745] group-hover:scale-110 transition-transform duration-300"
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
                      <p className="text-gray-800 leading-relaxed text-lg text-center px-2">
                        {objective.title}
                      </p>
                      {/* Ligne décorative qui apparaît au hover */}
                      <div className="w-0 group-hover:w-16 h-0.5 bg-[#269745] mt-2 transition-all duration-500"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ObjectifsSection;