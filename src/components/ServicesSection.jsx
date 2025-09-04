const ServicesSection = () => {
  const services = [
    {
      title: "Déposez votre dossier en ligne",
      description:
        "Grâce à notre interface intuitive, déposez votre demande de permis de construire en quelques minutes seulement.",
      image: "src/assets/image/dossiers.jpeg",
    },
    {
      title: "Suivez l'évolution de votre demande",
      description:
        "Recevez des notifications en temps réel sur l'avancement de votre dossier et soyez alerté de toute action requise.",
      image: "src/assets/image/demander-de-laide.jpeg",
    },
    {
      title: "Votre dossier sera traité en ligne",
      description:
        "Notre équipe d'experts traite votre demande avec célérité tout en garantissant une analyse minutieuse.",
      image: "src/assets/image/traiter.jpeg",
    },
    {
      title: "Obtenez une réponse rapide",
      description:
        "Bénéficiez d'un traitement accéléré de votre demande avec des délais réduits grâce à notre plateforme digitale.",
      image: "src/assets/image/relax.jpeg",
    },
  ];

  return (
    <div id="services" className="min-h-screen bg-white flex flex-col">
      {/* En-tête avec titre SERVICES */}
      <div className="pt-8 pb-4">
        <div className="flex items-center mb-8">
          <div className="w-24 h-20 bg-gray-700"></div>
          <div className="bg-[#9BC53D] px-12 py-6">
            <h2 className="text-white text-5xl font-bold">SERVICES</h2>
          </div>
        </div>
      </div>

      {/* Grille des services - Occupe l'espace principal */}
      <div className="flex-1 flex items-center justify-center px-8 py-8">
        <div className="w-full max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 h-full">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white border-2 border-gray-200 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:scale-105 flex flex-col group cursor-pointer hover:border-[#9BC53D]"
              >
                {/* Conteneur d'image modifié pour remplir l'espace */}
                <div className="h-64 bg-gray-100 overflow-hidden relative">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Overlay avec effet au survol */}
                  <div className="absolute inset-0 bg-[#9BC53D] opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                </div>
                <div className="p-8 flex-1 flex flex-col transition-all duration-300 group-hover:bg-gray-50">
                  <h3 className="text-[#9BC53D] text-xl font-bold mb-4 transition-all duration-300 group-hover:text-green-600 group-hover:scale-105">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-base leading-relaxed flex-1 transition-colors duration-300 group-hover:text-gray-700">
                    {service.description}
                  </p>
                  {/* Indicateur de survol */}
                  <div className="mt-4 w-0 h-1 bg-[#9BC53D] transition-all duration-500 group-hover:w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesSection;
