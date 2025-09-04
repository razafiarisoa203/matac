import React from 'react';

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
              Les autorisations d'urbanisme sont des actes administratifs qui permettent aux autorités compétentes de vérifier la conformité des travaux par rapport aux règles d'urbanisme en vigueur. À Madagascar, ces autorisations sont essentielles pour tout projet de construction, de rénovation ou d'aménagement du territoire.
            </p>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Notre plateforme vous accompagne dans vos démarches d'obtention d'autorisation d'urbanisme en vous offrant un suivi en temps réel de votre dossier et en simplifiant les échanges avec l'administration.
            </p>
            <button className="bg-lime-400 hover:bg-lime-500 text-gray-900 font-medium py-3 px-6  -md transition duration-300">
              En savoir plus
            </button>
          </div>
          <div className="bg-gray-100  -lg overflow-hidden">
            <img 
              src="/src/assets/images/urbanisme.jpg" 
              alt="Autorisation d'urbanisme"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ActeUrbanismeSection;
