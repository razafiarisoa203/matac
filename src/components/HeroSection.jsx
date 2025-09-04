import { Link } from "react-router-dom";
import bgConst from "../assets/image/construction-bg.jpeg";

const HeroSection = () => {
  return (
    <section
      id="accueil"
      className="relative h-screen bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${bgConst})`,
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-700 opacity-80"></div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div className="max-w-2xl text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">MATAC</h1>
          <p className="text-xl mb-8 leading-relaxed">
            Ce site est conçu spécialement pour le Ministère en charge de
            l'urbanisme, les Communes Malagasy, les services techniques
            communaux, les mandataires ainsi que les usagers. Notre objectif
            commun consiste à améliorer la qualité des services publics et à
            moderniser l'action publique dans un esprit de transparence et
            d'efficacité tout en améliorant les relations entre
            l'administration et ses administrés.
          </p>
          <Link
            to="/login"
            className="inline-block bg-lime-400 text-gray-800 px-8 py-4  -lg hover:bg-lime-500 text-lg font-semibold transition-colors duration-200"
          >
            Découvrir
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
