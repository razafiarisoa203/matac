const AccueilSection = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat relative" 
         style={{
           backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/src/assets/image/construction-bg.jpeg')`
         }}>
      
      {/* Header avec logos et navigation */}
      <header className="w-full">
        {/* Bande verte avec titre du ministère */}
        <div className="bg-[#9BC53D] py-4">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <img
                src="src/assets/logo/MDAT.jpeg"
                alt="MDAT LOGO"
                className="h-16 w-auto"
              />
              <img
                src="src/assets/logo/REPUBLIQUE.png"
                alt="REPUBLIQUE LOGO"
                className="h-16 w-auto"
              />
              <img
                src="src/assets/logo/OATF.jpg"
                alt="OATF LOGO"
                className="h-16 w-auto"
              />
            </div>
            <div className="text-right">
              <h1 className="text-gray-800 text-xl font-semibold">
                Ministère en charge de l'Aménagement du Territoire
              </h1>
              <h2 className="text-gray-700 text-lg font-medium">
                Autorisation de Construire
              </h2>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="bg-gray-700 py-3">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between">
              <div className="flex space-x-8">
                <button onClick={() => onNavigate('accueil')} className="text-white hover:text-[#9BC53D] transition-colors">
                  Accueil
                </button>
                <button onClick={() => onNavigate('actes-urbanisme')} className="text-white hover:text-[#9BC53D] transition-colors">
                  Acte d'urbanisme
                </button>
                <button onClick={() => onNavigate('services')} className="text-white hover:text-[#9BC53D] transition-colors">
                  Services
                </button>
                <button onClick={() => onNavigate('objectifs')} className="text-white hover:text-[#9BC53D] transition-colors">
                  Objectif
                </button>
              </div>
              <div className="flex items-center space-x-4">
                <button className="bg-[#9BC53D] text-gray-800 px-4 py-2   flex items-center space-x-2 hover:bg-[#8FB524] transition-colors">
                  <img src="/utilisateur.png" alt="Connexion" className="w-4 h-4" />
                  <span>Connexion</span>
                </button>
                <div className="text-white">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7V10C2 16 6 20.5 12 22C18 20.5 22 16 22 10V7L12 2Z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Section Hero - Contenu principal */}
      <div className="flex-1 flex items-center justify-start px-4 py-16">
        <div className="max-w-7xl mx-auto w-full">
          <div className="max-w-2xl">
            <h1 className="text-white text-8xl font-bold mb-8 leading-tight">
              MATAC
            </h1>
            <p className="text-white text-lg leading-relaxed mb-12 max-w-xl">
              Ce site est conçu spécialement pour le Ministère en charge de 
              l'urbanisme, les Communes Malagasy, les services techniques 
              communaux, les mandataires ainsi que les usagers. Notre 
              objectif commun consiste à améliorer la qualité des services 
              publics et à moderniser l'action publique dans un esprit de 
              transparence et d'efficacité tout en améliorant les relations 
              entre l'administration et ses administrés.
            </p>
            <button className="bg-[#9BC53D] text-gray-800 px-8 py-4  -lg font-semibold hover:bg-[#8FB524] transition-colors duration-200 flex items-center space-x-3 text-lg">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" 
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Découvrir</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccueilSection;
