const NavigationBar = () => {
  return (
    <div className="fixed top-20 left-0 right-0 bg-white border-b-2 border-green-100 py-3 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 flex justify-end items-center space-x-4">
        <span className="text-gray-700 font-medium">Connexion :</span>
        <a
          href="#"
          className="text-green-600 hover:text-green-700 font-semibold transition-colors"
        >
          Espace Client
        </a>
        <span className="text-green-300">|</span>
        <a
          href="#"
          className="text-green-600 hover:text-green-700 font-semibold transition-colors"
        >
          Espace de Traitement
        </a>
        <span className="text-green-300">|</span>
        <a
          href="#"
          className="text-green-600 hover:text-green-700 font-semibold transition-colors"
        >
          Espace Administration
        </a>
      </div>
    </div>
  );
};

export default NavigationBar;
