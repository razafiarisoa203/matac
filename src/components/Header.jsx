import { Menu, User, X, ChevronDown } from "lucide-react";

// Header Component
const Header = () => {
  return (
  <header className="w-full bg-white shadow-sm z-50">
      {/* Bandeau supérieur avec logo + texte vert */}
      <div className="w-full flex items-center justify-between bg-white">
        {/* Logos à gauche */}
        <div className="flex justify-around px-4 w-[30%]">
          <div className="w-12 h-20 flex items-center justify-center">
            <img
              src="src/assets/logo/MDAT.jpeg"
              alt="MDAT"
              className="w-12 h-12 object-cover"
            />
          </div>
          <div className="w-12 h-20 flex items-center justify-center">
            <img
              src="src/assets/logo/REPUBLIQUE.png"
              alt="Republique"
              className="w-12 h-12 object-cover"
            />
          </div>
          <div className="w-12 h-20 flex items-center justify-center">
            <img
              src="src/assets/logo/OATF.jpg"
              alt="OATF"
              className="w-12 h-12 object-cover"
            />
          </div>
          <div className="w-12 h-20 flex items-center justify-center">
            <img
              src="src/assets/logo/logoUF.webp"
              alt="OATF"
              className="w-12 h-20 scale-65 object-cover"
            />
          </div>
          <div className="w-12 h-20 flex items-center justify-center">
            <img
              src="src/assets/logo/pnudlogo.png"
              alt="OATF"
              className="w-12 h-20 scale-75 object-cover"
            />
          </div>
        </div>

        {/* Bande verte à droite avec nouveau code couleur */}
        <div className="flex-1 text-right py-4 px-6">
          <h3 className="text-3xl font-bold text-[#269745] mb-1">MATAC</h3>
        </div>
      </div>
    </header>
  );
};

export default Header;
