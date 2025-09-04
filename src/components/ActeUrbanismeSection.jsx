import React from "react";

const ActeUrbanismeSection = () => {
  return (
    <section id="acte" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center mb-12">
          <div className="bg-gray-800 text-white px-8 py-4">
            <h2 className="text-2xl font-bold">ACTE D'URBANISME</h2>
          </div>
          <div className="bg-lime-400 w-64 h-16"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              Les autorisations d'urbanisme à Madagascar
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Les autorisations d'urbanisme sont des actes administratifs qui
              permettent aux autorités compétentes de vérifier la conformité des
              travaux par rapport aux règles d'urbanisme en vigueur. À
              Madagascar, ces autorisations sont essentielles pour tout projet
              de construction, de rénovation ou d'aménagement du territoire.
            </p>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Notre plateforme vous accompagne dans vos démarches d'obtention
              d'autorisation d'urbanisme en vous offrant un suivi en temps réel
              de votre dossier et en simplifiant les échanges avec
              l'administration.
            </p>
            <button className="bg-lime-400 hover:bg-lime-500 text-gray-900 font-medium py-3 px-6 rounded-md transition duration-300">
              En savoir plus
            </button>
          </div>

          {/* Container avec forme de permis/carte officielle */}
          <div className="relative flex justify-center items-center">
            {/* Forme rectangulaire avec coin coupé comme un permis */}
            <div
              className="relative w-80 h-64 bg-gradient-to-br from-lime-200 via-lime-300 to-lime-400 shadow-2xl transform hover:scale-105 transition-transform duration-500"
              style={{
                clipPath:
                  "polygon(0% 0%, 85% 0%, 100% 20%, 100% 100%, 0% 100%)",
              }}
            >
              {/* Image à l'intérieur de la forme */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{
                  clipPath:
                    "polygon(0% 0%, 85% 0%, 100% 20%, 100% 100%, 0% 100%)",
                }}
              >
                <img
                  src="src/assets/image/urbanisme.jpeg"
                  alt="Autorisation d'urbanisme"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Effet de brillance */}
              <div
                className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent opacity-50"
                style={{
                  clipPath:
                    "polygon(0% 0%, 85% 0%, 100% 20%, 100% 100%, 0% 100%)",
                }}
              ></div>
            </div>

            {/* Éléments décoratifs flottants neutres */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-gray-400 rounded-full opacity-70 animate-bounce"></div>
            <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-gray-300 rounded-full opacity-50 animate-pulse"></div>
            <div className="absolute top-10 -left-8 w-6 h-6 bg-gray-500 rounded-full opacity-60 animate-ping"></div>

            {/* Ombre portée personnalisée neutre */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-64 h-16 bg-gray-400/20 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ActeUrbanismeSection;
