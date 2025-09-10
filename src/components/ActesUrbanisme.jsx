const ActesUrbanisme = () => {
  return (
    <div
      id="actes-urbanisme"
      className="bg-white pt-48 pb-32 relative min-h-screen"
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Titre centré */}
        <div className="text-center mb-20">
          <h2 className="text-6xl font-bold text-gray-800 mb-16">
            ACTE D'URBANISME
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          {/* Section texte */}
          <div className="space-y-8">
            <div className="space-y-6 text-gray-700 leading-relaxed text-lg mt-8">
              <p>
                Quiconque désire entreprendre une construction, doit, au
                préalable, obtenir un permis de construire. Cette obligation
                s'impose aux services publics et concerne uniquement les
                services publics, comme aux personnes privées.
              </p>
              <p>
                De même, quiconque désire entreprendre des travaux d'extension,
                de transformation, de réparation ou de démolition de plan
                d'urbanisme doit au préalable obtenir une autorisation délivrée
                par les autorités compétentes. Le même permis est exigé pour les
                clôtures, les modifications extérieures apportées aux
                constructions existantes, les changements de destination et
                d'usage de toute ou partie de construction existante, ainsi que
                pour les travaux entrainant une modification de la distribution
                intérieure des bâtiments et des similaires.
              </p>
            </div>
          </div>

          {/* Section PERMIS DE CONSTRUIRE */}
          <div className="flex justify-center">
            <div className="bg-white  -lg shadow-lg p-10 max-w-lg border border-gray-200 mt-8">
              <div className="text-center">
                <h3 className="text-3xl font-semibold text-green-600 mb-8">
                  PERMIS DE CONSTRUIRE
                </h3>
                <div className="mt-6 mb-6">
                  <img
                    src="/api/placeholder/300/200"
                    alt="Consultation urbanisme"
                    className=" -lg w-full h-48 object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Formes géométriques décoratives */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-gray-200  -full opacity-50"></div>
        <div className="absolute bottom-20 left-10 w-24 h-24 bg-gray-300 transform rotate-45 opacity-30"></div>

        {/* Indicateurs de pagination */}
        <div className="flex justify-center mt-16 space-x-3">
          <div className="w-3 h-3 bg-green-500  -full"></div>
          <div className="w-3 h-3 bg-gray-300  -full"></div>
          <div className="w-3 h-3 bg-gray-300  -full"></div>
          <div className="w-3 h-3 bg-gray-300  -full"></div>
        </div>
      </div>
    </div>
  );
};

export default ActesUrbanisme;
