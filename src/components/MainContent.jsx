import { useNavigate } from "react-router-dom";

const MainContent = () => {
  const navigate = useNavigate();
  return (
    <>
      {/* Contenu principal avec padding-top réduit */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-between min-h-[70vh] pt-20">
        {" "}
        {/* Réduction de pt-32 à pt-20 */}
        {/* Section gauche - Texte et boutons */}
        <div className="w-1/2 pr-8">
          {/* Titre principal */}
          <h1 className="text-5xl md:text-6xl text-[#131313] mb-6 leading-tight">
            Amélioration,
            <br />
            transparence et
            <br />
            efficacité
          </h1>

          {/* Description */}
          <p className="text-lg text-[#131313] mb-8 max-w-lg leading-relaxed opacity-90">
            Conçus pour le Ministère en charge de l'urbanisme, les Communes
            Malagasy, les services techniques communaux, les mandataires ainsi
            que les usagers.
          </p>

          {/* Boutons  */}
          <div className="flex space-x-4 mb-12">
            <button
              className="text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300"
              style={{ backgroundColor: "#269745" }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#1e7a38")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#269745")}
              onClick={() => navigate("/login")}
            >
              Se connecter
            </button>
            <button className="px-6 py-3 rounded-lg font-semibold transition-all duration-300 border-2 border-[#269745] bg-white text-[#269745] hover:bg-[#269745] hover:text-white">
              Contactez-nous
            </button>
          </div>

          {/* Statistiques avec nouveau vert */}
          <div className="flex space-x-8">
            <div className="text-center">
              <div
                className="text-3xl font-bold mb-2"
                style={{ color: "#269745" }}
              >
                +150
              </div>
              <div className="text-sm text-[#131313] opacity-75">
                Clients satisfaits
              </div>
            </div>
            <div className="text-center">
              <div
                className="text-3xl font-bold mb-2"
                style={{ color: "#269745" }}
              >
                +400
              </div>
              <div className="text-sm text-[#131313] opacity-75">
                Dossiers traités
              </div>
            </div>
            <div className="text-center">
              <div
                className="text-3xl font-bold mb-2"
                style={{ color: "#269745" }}
              >
                5 ans
              </div>
              <div className="text-sm text-[#131313] opacity-75">
                D'expérience
              </div>
            </div>
          </div>
        </div>
        {/* Section droite - Image */}
        <div className="w-1/2 flex justify-center items-center">
          <img
            src="/Image droite.png"
            alt="Illustration de l'urbanisme"
            className="max-w-full h-auto rounded-lg shadow-xl"
          />
        </div>
      </div>
    </>
  );
};
export default MainContent;
