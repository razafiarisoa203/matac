// import ApartmentIcon from '@mui/icons-material/Apartment';
import { Menu, User, X } from "lucide-react";

const Header = () => {
  return (
    <header className="w-full fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      {/* Bandeau supérieur avec logo + texte vert */}
      <div className="w-full flex items-center justify-between">
        {/* Logos à gauche */}
        <div className="flex justify-around px-4 bg-white w-[30%]">
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

        {/* Bande verte à droite */}
        <div className="flex-1 bg-white-300 text-right py-5 px-6">
          <span className="block text-gray-700 text-lg">
            <span className="text-[#098E00]">M</span>inistère en charge de l'
            <span className="text-[#098E00]">A</span>ménagement du{" "}
            <span className="text-[#098E00]">T</span>erritoire
          </span>
          <span className="block text-gray-700 text-lg">
            <span className="text-[#098E00]">A</span>utorisation de{" "}
            <span className="text-[#098E00]">C</span>onstruire
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
