import DiscoverButton from "./DiscoverButton.jsx";

const MainContent = () => {
  return (
    <>
      {/* Header avec logos */}
      <div className="relative z-20 w-full py-8">
        <div className="max-w-7xl mx-auto px-4 flex justify-center">
          <div className="flex items-center space-x-12">
            <div className="flex items-center space-x-2">
              <div className="w-12 h-12 rounded flex items-center justify-center">
                <img
                  src="/src/assets/logo/MDAT.jpeg"
                  alt="MDAT LOGO"
                  className="w-12 h-12 object-contain"
                />
              </div>
            </div>

            <div className="w-12 h-12  flex items-center justify-center">
              <img
                src="/src/assets/logo/REPUBLIQUE.png"
                alt="REPUBLIQUE LOGO"
                className="w-12 h-12 object-contain "
              />
            </div>

            <div className="w-12 h-12  flex items-center justify-center">
              <img
                src="/src/assets/logo/OATF.jpg"
                alt="OATF LOGO"
                className="w-12 h-12 object-contain "
              />
            </div>

            <div className="w-12 h-12 flex items-center justify-center">
              <img
                src="/src/assets/logo/logoUF.webp"
                alt="UF LOGO"
                className="w-12 h-12 object-contain"
              />
            </div>

            <div className="w-12 h-12  flex items-center justify-center">
              <img
                src="/src/assets/logo/pnudlogo.png"
                alt="PNUD LOGO"
                className="w-12 h-12 object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-center min-h-[70vh]">
        <div className="text-center">
          {/* Titre principal */}
          <h1 className="text-8xl md:text-9xl font-bold text-white mb-6 tracking-tight">
            MATAC
          </h1>

          {/* Sous-titre */}
          <p className="text-lg text-white mb-12 max-w-2xl mx-auto leading-relaxed">
            Ce site est conçu spécialement pour le Ministère en charge de
            l’urbanisme, les Communes Malagasy, les services techniques
            communaux, les mandataires ainsi que les usagers. Notre objectif
            commun consiste à améliorer la qualité des services publics et à
            moderniser l’action publique dans un esprit de transparence et
            d'efficacité tout en améliorant les relations entre l’administration
            et ses administrés.
          </p>
        </div>
      </div>
    </>
  );
};

export default MainContent;
