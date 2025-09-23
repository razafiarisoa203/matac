const Indicateurs = () => {
  // Fonction pour gérer les clics (à adapter avec vos URLs)
  const handleClick = (destination) => {
    // Exemple de redirection - À adapter avec vos routes réelles
    switch (destination) {
      case "indicateur":
        window.location.href = "/indicateurs";
        break;
      case "cartographie":
        window.location.href = "/cartographie";
        break;
      case "documentation":
        window.location.href = "/documentation";
        break;
      default:
        break;
    }
  };

  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-center items-center gap-20 md:gap-32">
          {/* INDICATEUR */}
          <div
            className="bg-white rounded-lg shadow-md p-6 border border-gray-200 w-80 transition-all duration-300 hover:shadow-xl hover:border-[#269745] hover:-translate-y-1 cursor-pointer"
            onClick={() => handleClick("indicateur")}
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <img
                  src="/Indicateur.png"
                  alt="Indicateur"
                  className="w-8 h-8"
                  style={{
                    filter:
                      "invert(38%) sepia(64%) saturate(80%) hue-rotate(40deg) brightness(94%) contrast(87%)",
                  }}
                />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-[#269745] mb-2">
                  INDICATEUR
                </h3>

                <div className="mt-4 text-[#269745] text-sm font-medium flex items-center">
                  En savoir plus
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* CARTOGRAPHIE */}
          <div
            className="bg-white rounded-lg shadow-md p-6 border border-gray-200 w-80 transition-all duration-300 hover:shadow-xl hover:border-[#269745] hover:-translate-y-1 cursor-pointer"
            onClick={() => handleClick("cartographie")}
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <img
                  src="/Cartographie.png"
                  alt="Cartographie"
                  className="w-8 h-8"
                  style={{
                    filter:
                      "invert(38%) sepia(64%) saturate(80%) hue-rotate(40deg) brightness(94%) contrast(87%)",
                  }}
                />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-[#269745] mb-2">
                  CARTOGRAPHIE
                </h3>

                <div className="mt-4 text-[#269745] text-sm font-medium flex items-center">
                  En savoir plus
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* DOCUMENTATION */}
          <div
            className="bg-white rounded-lg shadow-md p-6 border border-gray-200 w-80 transition-all duration-300 hover:shadow-xl hover:border-[#269745] hover:-translate-y-1 cursor-pointer"
            onClick={() => handleClick("documentation")}
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <img
                  src="/Documentation.png"
                  alt="Documentation"
                  className="w-8 h-8"
                  style={{
                    filter:
                      "invert(38%) sepia(64%) saturate(80%) hue-rotate(40deg) brightness(94%) contrast(87%)",
                  }}
                />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-[#269745] mb-2">
                  DOCUMENTATION
                </h3>

                <div className="mt-4 text-[#269745] text-sm font-medium flex items-center">
                  En savoir plus
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Indicateurs;
