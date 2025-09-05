import { Bell, check, Settings, Upload } from "lucide-react";
import React from "react";

const ServicesSection = () => {
  const services = [
    {
      title: "Déposez votre dossier en ligne",
      description:
        "Grâce à notre interface intuitive, déposez votre demande de permis de construire en quelques minutes seulement.",
      image: "src/assets/image/dossiers.jpeg",
      icon: Upload,
      color: "bg-lime-900",
      step: "01"
    },
    {
      title: "Suivez l'évolution de votre demande",
      description:
        "Recevez des notifications en temps réel sur l'avancement de votre dossier et soyez alerté de toute action requise.",
      image: "src/assets/image/demander-de-laide.jpeg",
      icon: Bell,
      color: "bg-lime-900",
      step: "02"
    },
    {
      title: "Votre dossier sera traité en ligne",
      description:
        "Notre équipe d'experts traite votre demande avec célérité tout en garantissant une analyse minutieuse.",
      image: "src/assets/image/traiter.jpeg",
      icon: Settings,
      color: "bg-lime-900",
      step: "03"
    },
    {
      title: "Obtenez une réponse rapide",
      description:
        "Bénéficiez d'un traitement accéléré de votre demande avec des délais réduits grâce à notre plateforme digitale.",
      image: "src/assets/image/relax.jpeg",
      icon: check,
      color: "bg-lime-900",
      step: "04"
    },
  ];

  return (
    <div id="services" className="min-h-screen mb-20 bg-gradient-to-b from-gray-50 to-white flex flex-col relative overflow-hidden">
      {/* Éléments décoratifs d'arrière-plan */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-20 right-10 w-40 h-40 bg-[#9BC53D]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* En-tête avec titre SERVICES amélioré */}
      <div className="pt-8 pb-4 relative z-10">
        <div className="max-w-7xl mx-auto px-8">
        {/* En-tête */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center mb-6">
            <div className="w-16 h-1 bg-lime-400 rounded-full mr-4"></div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 via-gray-900 to-black bg-clip-text text-transparent">
              SERVICES
            </h2>
            <div className="w-16 h-1  bg-lime-400 rounded-full ml-4"></div>
          </div>
        </div>
        </div>
      </div>

      {/* Grille des services - Occupe l'espace principal */}
      <div className="flex-1 flex items-center justify-center px-8 py-8 relative z-10">
        <div className="w-full max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 h-full">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <div
                  key={index}
                  className="bg-white border-2 border-gray-200 rounded overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 flex flex-col group cursor-pointer relative"
                >

                  {/* Conteneur d'image avec overlay amélioré */}
                  <div className="h-64 bg-gray-100 overflow-hidden relative">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Overlay avec dégradé */}
                    <div className={`absolute inset-0 bg-gradient-to-t ${service.color} opacity-0 group-hover:opacity-30 transition-opacity duration-500`}></div>
                    
                    {/* Icône qui apparaît au survol */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-75 group-hover:scale-100">
                      <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl">
                        <IconComponent className={`w-8 h-8 bg-gradient-to-br ${service.color} bg-clip-text text-transparent`} />
                      </div>
                    </div>
                  </div>

                  <div className="p-8 flex-1 flex flex-col transition-all duration-300 group-hover:bg-gradient-to-b group-hover:from-gray-50 group-hover:to-white">
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="text-[#9BC53D] text-xl font-bold transition-all duration-300 group-hover:text-blue-950 flex-1">
                        {service.title}
                      </h3>
                    </div>
                    
                    <p className="text-gray-600 text-base leading-relaxed flex-1 transition-colors duration-300 group-hover:text-gray-700">
                      {service.description}
                    </p>
                    
                    {/* Indicateur de survol amélioré */}
                    <div className="mt-6 flex items-center gap-2">
                      <div className={`h-1 bg-gradient-to-r ${service.color} rounded-full transition-all duration-500 w-0 group-hover:w-full`}></div>
                      <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 whitespace-nowrap">
                        En savoir plus
                      </span>
                    </div>
                  </div>

                  {/* Effet de bordure animée */}
                  <div className="absolute inset-0 rounded border-2 border-transparent group-hover:border-[#9BC53D] opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none"></div>
                </div>
              );
            })}
          </div>

          {/* Flèches de connexion entre les étapes */}
          <div className="hidden lg:block absolute inset-0 pointer-events-none">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className="absolute top-1/2 transform -translate-y-1/2 text-gray-300"
                style={{
                  left: `${25 + index * 25}%`,
                  transform: 'translateX(-50%) translateY(-50%)'
                }}
              >
                <div className="text-4xl animate-pulse">→</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesSection;