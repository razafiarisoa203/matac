const Header = () => {
  return (
    <header
      className="py-12  top-0 left-0 w-full z-50"
      style={{ backgroundColor: "#A9CD2E" }}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center space-x-8 ml-16">
          <img
            src="src/assets/logo/MDAT.jpeg"
            alt="MADT LOGO"
            className="h-20 w-auto"
          />
          <img
            src="src/assets/logo/REPUBLIQUE.png"
            alt="REPUBLIQUE LOGO"
            className="h-20 w-auto"
          />
          <img
            src="src/assets/logo/OATF.jpg"
            alt="REPUBLIQUE LOGO"
            className="h-20 w-auto"
          />
        </div>
        <div className="flex-1 flex justify-end text-right ml-12 mr-16">
          <div>
            <h1 className="text-gray-800 text-3xl font-semibold leading-tight">
              Ministère en charge de l'Aménagement du Territoire
            </h1>
            <h2 className="text-gray-700 text-2xl font-medium">
              Autorisation de Construire
            </h2>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
