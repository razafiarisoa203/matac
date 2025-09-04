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
        "Mettre en place un outil de suivi des dossiers accessible aux usagers (avancement de l'instruction, demande d'avis, etc.)",
    },
    {
      number: "05",
      title:
        "Promouvoir la transparence dans le processus d'instruction des autorisations d'urbanisme à Madagascar",
    },
  ];

  return (
    <section id="objectifs" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête de section */}
        <div className="flex items-center mb-12">
          <div className="bg-gray-800 text-white px-8 py-4">
            <h2 className="text-2xl font-bold">OBJECTIFS</h2>
          </div>
          <div className="bg-lime-400 w-64 h-16"></div>
        </div>

        {/* Liste des objectifs */}
        <div className="space-y-12">
          {objectives.map((objective, index) => (
            <div
              key={index}
              className={`flex items-center ${index % 2 === 0 ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`flex items-center max-w-2xl ${
                  index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                } group cursor-pointer`}
              >
                {/* Numéro de l'objectif */}
                <div
                  className={`w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-xl font-bold text-gray-700 ${
                    index % 2 === 0 ? "mr-6" : "ml-6"
                  } transition-all duration-300 group-hover:bg-lime-400 group-hover:text-white group-hover:scale-110 group-hover:shadow-lg`}
                >
                  {objective.number}
                </div>

                {/* Carte de l'objectif */}
                <div className="flex-1">
                  <div
                    className={`bg-white p-6 rounded-lg shadow-sm ${
                      index % 2 === 0 ? "mr-8" : "ml-8"
                    } transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-2 group-hover:bg-gray-50`}
                  >
                    <div className="flex items-start">
                      <div className="grid grid-cols-3 gap-1 mr-4 mt-1">
                        {[...Array(9)].map((_, i) => (
                          <div
                            key={i}
                            className="w-2 h-2 bg-gray-800 rounded-sm transition-colors duration-300 group-hover:bg-lime-400"
                          ></div>
                        ))}
                      </div>
                      <p className="text-gray-700 leading-relaxed transition-colors duration-300 group-hover:text-gray-800">
                        {objective.title}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`h-2 bg-lime-400 mt-4 ${
                      index % 2 === 0 ? "mr-8" : "ml-8"
                    } transition-all duration-300 group-hover:shadow-md group-hover:bg-green-500`}
                    style={{ width: "60%" }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ObjectifsSection;
