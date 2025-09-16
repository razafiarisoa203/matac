import { useNavigate } from "react-router-dom";

const MainContent = () => {
  const navigate = useNavigate();
  return (
    <>
      {/* Contenu principal avec padding-top réduit */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12">
          {/* Section gauche - Texte et boutons */}
          <div className="w-full lg:w-1/2 lg:pr-8">
          {/* Titre principal */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl text-[#131313] mb-4 sm:mb-6 leading-tight">
            Amélioration,
            <br />
            transparence et
            <br />
            efficacité
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-[#131313] mb-6 sm:mb-8 max-w-lg leading-relaxed opacity-90">
            Conçus pour le Ministère en charge de l'urbanisme, les Communes
            Malagasy, les services techniques communaux, les mandataires ainsi
            que les usagers.
          </p>

          {/* Boutons  */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-12">
            <button
              className="text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-colors duration-300 w-full sm:w-auto text-sm sm:text-base"
              style={{ backgroundColor: "#269745" }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#1e7a38")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#269745")}
              onClick={() => navigate("/login")}
            >
              Se connecter
            </button>
            <button className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all duration-300 border-2 border-[#269745] bg-white text-[#269745] hover:bg-[#269745] hover:text-white w-full sm:w-auto text-sm sm:text-base">
              Contactez-nous
            </button>
          </div>

          {/* Statistiques avec nouveau vert */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 lg:gap-8">
            <div className="text-center p-2 sm:p-3 bg-white/50 rounded-lg">
              <div
                className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2"
                style={{ color: "#269745" }}
              >
                +150
              </div>
              <div className="text-xs sm:text-sm text-[#131313] opacity-75">
                Clients satisfaits
              </div>
            </div>
            <div className="text-center p-2 sm:p-3 bg-white/50 rounded-lg">
              <div
                className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2"
                style={{ color: "#269745" }}
              >
                +400
              </div>
              <div className="text-xs sm:text-sm text-[#131313] opacity-75">
                Dossiers traités
              </div>
            </div>
            <div className="text-center p-2 sm:p-3 bg-white/50 rounded-lg">
              <div
                className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2"
                style={{ color: "#269745" }}
              >
                5 ans
              </div>
              <div className="text-xs sm:text-sm text-[#131313] opacity-75">
                D'expérience
              </div>
            </div>
          </div>
        </div>
        {/* Section droite - Image */}
        <div className="w-full lg:w-1/2 flex justify-center items-center mt-8 lg:mt-0">
          <img
            src="/Image droite.png"
            alt="Illustration de l'urbanisme"
            className="w-full max-w-lg h-auto rounded-lg"
          />
        </div>
      </div>
      </div>
    </>
  );
};
export default MainContent;
