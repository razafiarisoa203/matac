const HeroSection = () => {
  return (
    <section
      className="relative h-96 bg-cover bg-center bg-no-repeat -mt-4"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/src/assets/images/construction-background.jpeg')`,
      }}
    >
      <div className="absolute inset-0 flex items-end pb-8">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="max-w-3xl ml-96">
            <h1 className="text-white text-9xl font-bold mb-10 leading-tight ml-40">
              MATAC
            </h1>
            <p className="text-white text-xl leading-relaxed mb-10 max-w-2xl ml-44">
              Ce site est conçu spécialement pour le Ministère en charge de
              l'urbanisme, les Communes Malagasy, les services techniques
              communaux, les mandataires ainsi que les usagers. Notre objectif
              commun consiste à améliorer la qualité des services publics et à
              moderniser l'action publique dans un esprit de transparence et
              d'efficacité tout en améliorant les relations entre
              l'administration et ses administrés.
            </p>
            <button className="bg-lime-400 text-gray-800 px-10 py-5  rounded-lg font-semibold hover:bg-lime-500 transition-colors duration-200 flex items-center space-x-4 text-xl ml-48">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path
                  d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Découvrir</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
