import { Menu, User, X, ChevronDown } from "lucide-react";

// Header Component
import MDAT from "../assets/logo/MDAT.jpeg";
import OATF from "../assets/logo/OATF.jpg";
import pnudlogo from "../assets/logo/pnudlogo.png";
import REPUBLIQUE from "../assets/logo/REPUBLIQUE.png";
import uf from "../assets/logo/logoUF.webp"
const Header = () => {
  return (
    <header className="w-full bg-white shadow-sm z-50">
      {/* Bandeau supérieur avec logo + texte vert */}
      <div className="w-full flex items-center justify-between bg-white">
        {/* Logos à gauche */}
        <div className="flex justify-around px-4 w-[30%]">
          <div className="w-12 h-20 flex items-center justify-center">
            <img
              src={MDAT}
              alt="MDAT logo "
              className="w-12 h-12 object-cover"
            />
          </div>
          <div className="w-12 h-20 flex items-center justify-center">
            <img
              src={REPUBLIQUE}
              alt="Republique logo"
              className="w-12 h-12 object-cover"
            />
          </div>
          <div className="w-12 h-20 flex items-center justify-center">
            <img
              src={uf}
              alt="logo uf"
              className="w-12 h-12 object-cover"
            />
          </div>
          <div className="w-12 h-20 flex items-center justify-center">
            <img
              src={OATF}
              alt="OATF"
              className="w-12 h-20 scale-65 object-cover"
            />
          </div>
          <div className="w-12 h-20 flex items-center justify-center">
            <img
              src={pnudlogo}
              alt="PNUD logo"
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
