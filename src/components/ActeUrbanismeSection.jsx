import { Building2, Clock, FileText, Zap } from "lucide-react";
import React, { useCallback } from "react";

const ActeUrbanismeCard = () => {
  // Données avec icônes améliorées
  const actes = [
    {
      id: 1,
      title: "Les autorisations d'urbanisme à Madagascar",
      desc: "Les autorisations d'urbanisme permettent aux autorités compétentes de vérifier la conformité des travaux par rapport aux règles en vigueur.",
      icon: Building2,
      gradient: "via-gray-950",
      bgPattern: "bg-gradient-to-br from-emerald-50 to-lime-50"
    },
    {
      id: 2,
      title: "Rénovations et aménagements",
      desc: "Les projets de rénovation et d'aménagement nécessitent un suivi administratif rigoureux pour garantir la conformité aux normes urbaines.",
      icon: FileText,
      gradient: "via-gray-950",
      bgPattern: "bg-gradient-to-br from-emerald-50 to-lime-50"
    },
    {
      id: 3,
      title: "Suivi en temps réel des dossiers",
      desc: "Notre plateforme permet aux usagers de suivre en temps réel l'avancement de leur dossier et d'améliorer la transparence.",
      icon: Clock,
      gradient: "via-gray-950",
      bgPattern: "bg-gradient-to-br from-emerald-50 to-lime-50"
    },
    {
      id: 4,
      title: "Simplification des démarches",
      desc: "Nous facilitons les échanges entre citoyens et administration afin de réduire les délais et moderniser l'action publique.",
      icon: Zap,
      gradient: "via-gray-950",
      bgPattern: "bg-gradient-to-br from-emerald-50 to-lime-50"
    },
  ];

  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [isAnimating, setIsAnimating] = React.useState(false);

  const nextSlide = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % actes.length);
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating, actes.length]);


  const goToSlide = (index) => {
    if (isAnimating || index === currentSlide) return;
    setIsAnimating(true);
    setCurrentSlide(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  // Auto-play
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) {
        nextSlide();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [isAnimating, nextSlide]);

  const currentActe = actes[currentSlide];
  const IconComponent = currentActe.icon;

  return (
    <section id="acte" className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Éléments décoratifs d'arrière-plan */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-10 w-32 h-32 bg-lime-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-emerald-200/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/3 w-20 h-20 bg-cyan-200/20 rounded-full blur-2xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Titre principal amélioré */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center mb-6">
            <div className="w-16 h-1 bg-lime-400 rounded-full mr-4"></div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 via-gray-900 to-black bg-clip-text text-transparent">
              ACTES D'URBANISME
            </h2>
            <div className="w-16 h-1  bg-lime-400 rounded-full ml-4"></div>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Découvrez nos services d'accompagnement pour vos projets d'urbanisme à Madagascar
          </p>
        </div>

        {/* Conteneur principal de la carte */}
        <div className="relative max-w-full mx-auto">
          {/* Carte principale */}
          <div className={`relative ${currentActe.bgPattern}  overflow-hidden transform transition-all duration-500 `}>
            <div className="relative h-96 md:h-80">
              {/* Forme géométrique d'arrière-plan */}
              <div className={`absolute inset-0 bg-gradient-to-br ${currentActe.gradient} opacity-90`}>
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                {/* Motifs géométriques */}
                <div className="absolute top-8 right-8 w-24 h-24 border-2 border-white/30 rounded-full"></div>
                <div className="absolute bottom-8 left-8 w-16 h-16 border-2 border-white/20 rounded-lg rotate-45"></div>
                <div className="absolute top-1/2 left-8 w-32 h-32 border border-white/20 rounded-full"></div>
              </div>

              {/* Contenu de la carte */}
              <div className="relative z-10 p-8 md:p-12 h-full flex flex-col justify-center">
                <div className="flex items-start space-x-6">
                  {/* Icône */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Contenu textuel */}
                  <div className="flex-1">
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
                      {currentActe.title}
                    </h3>
                    <p className="text-white/90 text-lg leading-relaxed mb-6">
                      {currentActe.desc}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Boutons de navigation */}
          {/* <button 
            onClick={prevSlide}
            disabled={isAnimating}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm hover:bg-white shadow-xl rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed z-20"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          
          <button 
            onClick={nextSlide}
            disabled={isAnimating}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm hover:bg-white shadow-xl rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed z-20"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button> */}

          {/* Indicateurs de pagination */}
          <div className="flex justify-center space-x-3 mt-8">
            {actes.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-blue-950 scale-125' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ActeUrbanismeCard;