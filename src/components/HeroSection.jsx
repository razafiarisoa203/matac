import { Link } from "react-router-dom";
import bgConst from "../assets/image/construction-bg.jpeg";

const HeroSection = () => {
  return (
<section
  id="accueil"
  className="relative h-screen bg-cover bg-center"
  style={{
    backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url(${bgConst})`,
    backgroundAttachment: "fixed",
  }}
>
  {/* Overlay sombre */}
  <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/50"></div>

  {/* Contenu */}
  <div className="relative z-10 max-w-7xl mx-auto px-2 lg:px-8 h-full flex items-center">
    <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 w-full">
      
      {/* Texte à gauche */}
      <div className="text-white max-w-2xl">
        <h1 className="text-5xl md:text-9xl font-bold mb-3">MATAC</h1>
        <p className="text-sm leading-relaxed font-light">
          Ce site est conçu spécialement pour le Ministère en charge de
          l'urbanisme, les Communes Malagasy, les services techniques
          communaux, les mandataires ainsi que les usagers. Notre objectif
          commun consiste à améliorer la qualité des services publics et à
          moderniser l'action publique dans un esprit de transparence et
          d'efficacité tout en améliorant les relations entre
          l'administration et ses administrés.
        </p>
      </div>

      {/* Bouton à droite */}
      <div className="flex md:justify-end mt-40">
        <Link
          to="/login"
          className="inline-flex items-center justify-center bg-lime-300 text-gray-900 px-20 py-4 hover:bg-lime-500 text-lg font-semibold shadow-lg transition duration-300"
        >
          
          <p>Découvrir</p>
        </Link>
      </div>

    </div>
  </div>
</section>

  );
};

export default HeroSection;
