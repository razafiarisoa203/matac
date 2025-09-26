import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const ActesUrbanisme = () => {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTitleHovered, setIsTitleHovered] = useState(false);

  // Récupération des slides depuis la traduction
  const slidesRaw = t('urbanismActs.slides', { returnObjects: true }) || [];
  const slidesArray = Array.isArray(slidesRaw) ? slidesRaw : Object.values(slidesRaw);

  // Ajout des images et alt
  const slides = slidesArray.map((slide, index) => ({
    ...slide,
    image: [
      "/Prescription d'Urbanisme.png",
      "/permis construire .png",
      "/Alignement.png",
      "/Certificat de conformité.png"
    ][index] || "/default.png",
    alt: `${slide.title || "Slide"} - Sary an'ohatra`
  }));

  const totalSlides = slides.length;

  useEffect(() => {
    if (totalSlides === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(interval);
  }, [totalSlides]);

  const goToSlide = (slideIndex) => setCurrentSlide(slideIndex);
  const goToPrevSlide = () => setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  const goToNextSlide = () => setCurrentSlide((prev) => (prev + 1) % totalSlides);

  if (totalSlides === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-3xl font-bold text-[#269745]">
          {t('urbanismActs.title')}
        </h2>
        <p className="mt-4 text-gray-600">Aucun slide disponible.</p>
      </div>
    );
  }

  return (
    <div id="actes-urbanisme" className="bg-white pt-16 pb-32 relative min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        {/* Titre */}
        <div className="text-left mb-12">
          <div
            className="relative inline-block"
            onMouseEnter={() => setIsTitleHovered(true)}
            onMouseLeave={() => setIsTitleHovered(false)}
          >
            <h2 className="text-4xl font-bold text-[#269745]">
              {t('urbanismActs.title')}
            </h2>
            <div
              className={`absolute bottom-0 left-0 h-1 bg-black transition-all duration-300 ${
                isTitleHovered ? "w-full" : "w-0"
              }`}
              style={{ bottom: "-8px" }}
            />
          </div>
        </div>

        {/* Carousel */}
        <div className="relative w-full">
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
                  <div className="space-y-8">
                    <div className="space-y-4 text-gray-700 leading-relaxed text-base">
                      <p>{slide.description || "Pas de description."}</p>
                    </div>
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
                        {slide.title || "Titre inconnu"}
                      </h3>
                    </div>
                  </div>
                  <div className="flex justify-center mt-12">
                    <img
                      src={slide.image}
                      alt={slide.alt}
                      className="w-full h-full object-contain max-h-80"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Indicateurs */}
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

          {/* Controls */}
          <button
            type="button"
            className="absolute top-1/2 -left-8 z-30 flex items-center justify-center w-10 h-10 -translate-y-1/2 cursor-pointer group focus:outline-none"
            onClick={goToPrevSlide}
          >
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/80 shadow-md group-hover:bg-white">
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
            </span>
          </button>

          <button
            type="button"
            className="absolute top-1/2 -right-8 z-30 flex items-center justify-center w-10 h-10 -translate-y-1/2 cursor-pointer group focus:outline-none"
            onClick={goToNextSlide}
          >
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/80 shadow-md group-hover:bg-white">
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
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActesUrbanisme;
