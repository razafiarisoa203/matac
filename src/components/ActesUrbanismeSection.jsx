import React from 'react';

const ActesUrbanismeSection = () => {
  return (
    <section id="acte" className="py-16 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            ACTE D'URBANISME
          </h2>
          <div className="w-24 h-1 bg-lime-400 mx-auto"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-gray-700 leading-relaxed">
              Quiconque désire entreprendre une construction, doit, au
              préalable, obtenir un permis de construire. Cette obligation
              s'impose aux services publics et concessionnaires de services
              publics, comme aux personnes privées.
            </p>
            <p className="text-gray-700 leading-relaxed">
              De même, quiconque désire entreprendre des travaux modifiant la
              configuration du sol dans une agglomération dotée de plan
              d'urbanisme doit au préalable obtenir une autorisation délivrée
              par les autorités compétentes. Le même permis est exigé pour les
              clôtures, les modifications extérieures apportées aux
              constructions existantes, les reprises et réparations des gros
              œuvres, les surélévations, le changement de destination et
              d'usage de toute ou partie de construction existante, ainsi que
              pour les travaux entraînant une modification de la distribution
              intérieure des bâtiments et des sanitaires.
            </p>
            <div className="mt-8">
              <button className="bg-lime-400 text-gray-800 px-6 py-3  -lg hover:bg-lime-500 font-medium transition-colors duration-200">
                En savoir plus
              </button>
            </div>
          </div>

          <div className="bg-lime-50 p-8  -xl shadow-md">
            <div className="bg-white p-6  -lg shadow-inner border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                PERMIS DE CONSTRUIRE
              </h3>
              <div className="bg-gray-100 p-4  -lg">
                <img
                  src="src/assets/image/construction-bg.jpeg"
                  alt="Permis de construire"
                  className="w-full h-64 object-cover  -lg"
                />
              </div>
              <div className="mt-6 text-center">
                <p className="text-gray-600 mb-4">
                  Téléchargez le formulaire de demande de permis de construire
                </p>
                <button className="bg-gray-800 text-white px-6 py-2  -lg hover:bg-gray-700 transition-colors duration-200">
                  Télécharger
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Pagination dots */}
        <div className="flex justify-center mt-12 space-x-2">
          {[1, 2, 3, 4].map((dot) => (
            <div
              key={dot}
              className={`w-3 h-3  -full ${dot === 2 ? 'bg-lime-400' : 'bg-gray-300'}`}
            ></div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ActesUrbanismeSection;
