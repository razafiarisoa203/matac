const NavigationBar = ({ scrollToSection, isOverlay = false }) => {
  const navItems = [
    { name: "Accueil", id: "accueil" },
    { name: "Acte d'urbanisme", id: "actes-urbanisme" },
    { name: "Objectifs", id: "objectifs" },
    { name: "Services", id: "services" }
  ];

  const handleNavClick = (item) => {
    scrollToSection(item.id);
  };

  return (
    <nav className={`py-12 relative ${isOverlay ? 'mt-0' : 'mt-0'}`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex justify-center flex-1">
            <ul className="flex space-x-12">
              {navItems.map((item, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleNavClick(item)}
                    className={`text-lg hover:text-[#9BC53D] transition-colors duration-300 font-semibold relative group text-white ${
                      index === 0 ? 'text-[#9BC53D]' : ''
                    }`}
                  >
                    {item.name}
                    <span className={`absolute left-0 bottom-0 h-0.5 bg-[#9BC53D] transition-all duration-300 ${
                      index === 0 ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}></span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-shrink-0 ml-4">
            <button
              className="text-gray-800 px-10 py-4 font-bold transition-all duration-300 flex items-center space-x-3 text-lg hover:bg-[#8FB524] hover:scale-105"
              style={{ backgroundColor: "#9BC53D" }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              <span>Connexion</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
