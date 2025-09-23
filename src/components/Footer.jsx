import AGVM from "../assets/logo/AGVM.png";
import logoUF from "../assets/logo/logoUF.webp";
import MDAT from "../assets/logo/MDAT.jpeg";
import OATF from "../assets/logo/OATF.jpg";
import pnudlogo from "../assets/logo/pnudlogo.png";
import REPUBLIQUE from "../assets/logo/REPUBLIQUE.png";

const Footer = () => {
  return (
    <footer className="bg-[#269745] text-white py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Section 1 : MATAC */}
          <div className="flex flex-col items-center md:items-start justify-start">
            <span className="text-2xl font-bold tracking-wide">MATAC</span>
          </div>

          {/* Section 2 : Navbar + copyright */}
          <div className="flex flex-col items-center">
            <nav className="flex flex-col md:flex-row gap-2 md:gap-6 mb-4">
              <a
                href="#"
                className="hover:text-gray-300 transition-colors duration-300"
              >
                Accueil
              </a>
              <a
                href="#"
                className="hover:text-gray-300 transition-colors duration-300"
              >
                Actes
              </a>
              <a
                href="#"
                className="hover:text-gray-300 transition-colors duration-300"
              >
                Services
              </a>
              <a
                href="#"
                className="hover:text-gray-300 transition-colors duration-300"
              >
                Objectifs
              </a>
            </nav>
            <div className="text-xs mt-2 opacity-80">
              © {new Date().getFullYear()} MATAC Madagascar- Cartographie
              Urbanisme
            </div>
          </div>

          {/* Section 3 : Logos */}
          <div className="flex flex-wrap justify-center md:justify-end items-center gap-4 md:gap-6">
            <img
              src={REPUBLIQUE}
              alt="République"
              className="h-10 md:h-12 bg-white rounded p-1"
            />
            <img
              src={logoUF}
              alt="logoUF"
              className="h-10 md:h-12 bg-white rounded p-1"
            />
            <img
              src={MDAT}
              alt="MDAT"
              className="h-10 md:h-12 bg-white rounded p-1"
            />
            <img
              src={OATF}
              alt="OATF"
              className="h-10 md:h-12 bg-white rounded p-1"
            />
            <img
              src={pnudlogo}
              alt="PNUD"
              className="h-10 md:h-12 bg-white rounded p-1"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
