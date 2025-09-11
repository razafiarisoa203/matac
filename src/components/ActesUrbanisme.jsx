import React, { useState, useEffect } from "react";

const ActesUrbanisme = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTitleHovered, setIsTitleHovered] = useState(false);

  const slides = [
    {
      title: "PRESCRIPTION D'URBANISME",
      description:
        "Ils sont construits par des règlements en matière d'occupation de sol et les règlements techniques fixant le projet de construction. Il définit les différents modes d'occupation de sol d'une ville donnée.",
      image: "/Prescription d'Urbanisme.png",
      alt: "Prescription d'urbanisme - Illustration",
    },
    {
      title: "PERMIS DE CONSTRUIRE",
      description:
        "Quiconque désire entreprendre une construction, doit, au préalable, obtenir un permis de construire. Cette obligation s'impose aux services publics et concerne uniquement les services publics, comme aux personnes privées. De même, quiconque désire entreprendre des travaux modifiant la configuration du sol dans une agglomération dotée de plan d'urbanisme doit au préalable obtenir une autorisation délivrée par les autorités compétentes. Le même permis est exigé pour les clôtures, les modifications extérieures apportées aux constructions existantes, les reprises et réparations des gros œuvres, les surélévations, le changement de destination et d'usage de toute ou partie de construction existante, ainsi que pour les travaux entraînant une modification de la distribution intérieure des bâtiments et des sanitaires.",
      image: "/permis construire .png",
      alt: "Permis de construire - Illustration",
    },
    {
      title: "ALIGNEMENT",
      description:
        "Il s'agit de l'alignement des voies publiques ou projetées demandé par le propriétaire du droit de sa propriété. C'est la limite séparative entre les voies publiques et les propriétés riveraines.",
      image: "/Alignement.png",
      alt: "Alignement - Illustration",
    },
    {
      title: "CERTIFICAT DE CONFORMITÉ",
      description:
        "Le certificat de conformité est un acte administratif ayant pour but de valider la conformité d'une construction achevée vis-à-vis des instructions techniques délivrées.",
      image: "/Certificat de conformité.png",
      alt: "Certificat de conformité - Illustration",
    },
  ];

  const totalSlides = slides.length;

  // Défilement automatique
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000); // Change de slide toutes les 5 secondes

    return () => clearInterval(interval);
  }, [totalSlides]);

  const goToSlide = (slideIndex) => {
    setCurrentSlide(slideIndex);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  return (
    <div
      id="actes-urbanisme"
      className="bg-white pt-16 pb-32 relative min-h-screen"
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Titre fixe ACTE D'URBANISME avec animation de soulignement */}
        <div className="text-left mb-12">
          <div
            className="relative inline-block"
            onMouseEnter={() => setIsTitleHovered(true)}
            onMouseLeave={() => setIsTitleHovered(false)}
          >
            <h2 className="text-4xl font-bold text-[#269745]">
              ACTE D'URBANISME
            </h2>
            {/* Ligne noire animée */}
            <div
              className={`absolute bottom-0 left-0 h-1 bg-black transition-all duration-300 ${
                isTitleHovered ? "w-full" : "w-0"
              }`}
              style={{ bottom: "-8px" }}
            ></div>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative w-full">
          {/* Carousel wrapper */}
          <div className="relative h-[500px] overflow-hidden">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
                  index === currentSlide
                    ? "translate-x-0"
                    : index < currentSlide
                      ? "-translate-x-full"
                      : "translate-x-full"
                }`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start h-full">
                  {/* Section gauche - Description et titre du slide */}
                  <div className="space-y-8">
                    {/* Description */}
                    <div className="space-y-4 text-gray-700 leading-relaxed text-base">
                      <p>{slide.description}</p>
                    </div>

                    {/* Titre du slide avec flèche SVG */}
                    <div className="mt-12 flex items-center">
                      <svg
                        className="w-6 h-6 text-[#269745] mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                      <h3 className="text-3xl font-bold text-[#269745]">
                        {slide.title}
                      </h3>
                    </div>
                  </div>

                  {/* Section droite - Image */}
                  <div className="flex justify-center mt-12">
                    <div className="text-center">
                      <img
                        src={slide.image}
                        alt={slide.alt}
                        className="w-full h-full object-contain max-h-80"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Slider indicators - Positionné plus bas */}
          <div className="absolute z-30 flex -translate-x-1/2 bottom-0 left-1/2 space-x-3 mt-8">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                type="button"
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? "bg-black" : "bg-gray-300"
                }`}
                aria-current={index === currentSlide}
                aria-label={`Slide ${index + 1}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>

          {/* Slider controls - Previous déplacé plus à gauche */}
          <button
            type="button"
            className="absolute top-1/2 -left-8 z-30 flex items-center justify-center w-10 h-10 -translate-y-1/2 cursor-pointer group focus:outline-none"
            onClick={goToPrevSlide}
          >
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/80 group-hover:bg-white group-focus:ring-4 group-focus:ring-white group-focus:outline-none shadow-md">
              <svg
                className="w-6 h-6 text-gray-800"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 1 1 5l4 4"
                />
              </svg>
              <span className="sr-only">Previous</span>
            </span>
          </button>

          {/* Slider controls - Next */}
          <button
            type="button"
            className="absolute top-1/2 -right-8 z-30 flex items-center justify-center w-10 h-10 -translate-y-1/2 cursor-pointer group focus:outline-none"
            onClick={goToNextSlide}
          >
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/80 group-hover:bg-white group-focus:ring-4 group-focus:ring-white group-focus:outline-none shadow-md">
              <svg
                className="w-6 h-6 text-gray-800"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
              <span className="sr-only">Next</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActesUrbanisme;
