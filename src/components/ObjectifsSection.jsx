import React from "react";

const ObjectifsSection = () => {
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
        "Mettre en place un outil de suivi des dossiers accessible aux usagers  (avancement de l'instruction, demande d'avis, etc.)",
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
        <div className="text-center mb-5">
          <div className="inline-flex items-center mb-6">
            <div className="w-16 h-1 bg-lime-400 rounded-full mr-4"></div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 via-gray-900 to-black bg-clip-text text-transparent">
              OBJECTIFS
            </h2>
            <div className="w-16 h-1  bg-lime-400 rounded-full ml-4"></div>
          </div>
        </div>

        {/* Objectifs */}
        <div className="space-y-16">
          {objectives.map((objective, index) => (
            <div
              key={index}
              className={`flex items-center ${
                index % 2 === 0 ? "justify-start" : "justify-end"
              } group`}
            >
              {/* Bloc gauche ou droite */}
              <div
                className={`flex items-center max-w-4xl ${
                  index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                }`}
              >
                {/* Carte améliorée */}
                <div className="border-2 border-gray-300 hover:border-lime-400 bg-white p-8 flex-1 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-start">
                    {/* Icone carrés améliorée */}
                    <div className="grid grid-cols-3 gap-1.5 mr-6 mt-1">
                      {[...Array(9)].map((_, i) => (
                        <div
                          key={i}
                          className="w-2.5 h-2.5 bg-gray-800 rounded-sm transition-all duration-300 group-hover:bg-lime-500 group-hover:scale-110"
                          style={{ 
                            transitionDelay: `${i * 50}ms`,
                          }}
                        ></div>
                      ))}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800 leading-relaxed text-lg">
                        {objective.title}
                      </p>
                      {/* Ligne décorative qui apparaît au hover */}
                      <div className="w-0 group-hover:w-20 h-0.5 bg-lime-300 mt-4 transition-all duration-500"></div>
                    </div>
                  </div>
                </div>

                {/* Ligne + numéro améliorés */}
                <div
                  className={`flex items-center ${
                    index % 2 === 0 ? "ml-8" : "mr-8"
                  }`}
                >
                  {/* Ligne avec dégradé */}
                  <div className="h-1.5 w-12  bg-lime-300 rounded-full"></div>
                  
                  {/* Numéro avec design moderne */}
                  <div className="ml-2 mr-2 w-16 h-16 rounded-full bg-lime-300 flex items-center justify-center font-bold text-white text-lg shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-110 border-4 border-white">
                    {objective.number}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Ligne de connexion verticale subtile */}
        <div className="absolute left-1/2 top-32 bottom-32 w-0.5 bg-gradient-to-b from-transparent via-gray-200 to-transparent hidden lg:block"></div>
      </div>
    </section>
  );
};

export default ObjectifsSection;