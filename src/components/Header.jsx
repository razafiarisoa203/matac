import MDAT from "../assets/logo/MDAT.jpeg";
import OATF from "../assets/logo/OATF.jpg";
import pnudlogo from "../assets/logo/pnudlogo.png";
import REPUBLIQUE from "../assets/logo/REPUBLIQUE.png";
import uf from "../assets/logo/logoUF.webp";

const Header = () => {
  return (
    <header className="flex h-20 w-full">
      {/* Bande blanche : logos */}
      <div className="flex w-1/2 items-center justify-around bg-white px-4 md:px-12">
        <img src={MDAT} alt="MDAT logo" className="h-12 w-12 object-contain" />
        <img src={REPUBLIQUE} alt="République logo" className="h-12 w-12 object-contain" />
        <img src={uf} alt="Logo UF" className="h-12 w-12 object-contain" />
        <img src={OATF} alt="OATF" className="h-12 w-12 object-contain" />
        <img src={pnudlogo} alt="PNUD logo" className="h-12 w-12 object-contain" />
      </div>

      {/* Bande verte : titre */}
      <div className="flex w-1/2 items-center bg-[#269745] px-4 text-white md:px-12">
        <p className="text-sm leading-snug sm:text-base md:text-xl">
          Ministère en charge de l'Aménagement du Territoire
          <br />
          Autorisation de Construire
        </p>
      </div>
    </header>
  );
};

export default Header;