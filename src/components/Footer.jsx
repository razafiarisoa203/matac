const Footer = () => {
  return (
    <footer className="bg-[#098E00] text-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-semibold">MATAC Madagascar</h3>
            <p className="mt-2 text-sm">
              Ministère en charge de l'Aménagement du Territoire
            </p>
          </div>

          <div className="flex space-x-6">
            <a
              href="#"
              className="hover:text-gray-300 transition-colors duration-300"
            >
              Mentions légales
            </a>
            <a
              href="#"
              className="hover:text-gray-300 transition-colors duration-300"
            >
              Contact
            </a>
            <a
              href="#"
              className="hover:text-gray-300 transition-colors duration-300"
            >
              Aide
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/20 text-center text-sm">
          <p>
            © {new Date().getFullYear()} MATAC Madagascar. Tous droits
            réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
