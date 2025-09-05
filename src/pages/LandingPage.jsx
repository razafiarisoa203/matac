import ActeUrbanismeSection from "../components/ActeUrbanismeSection";
import Footer from "../components/Footer";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import NavigationBar from "../components/NavigationBar";
import ObjectifsSection from "../components/ObjectifsSection";
import ServicesSection from "../components/ServicesSection";

const LandingPage = () => {
  return (
    <div className="bg-gray-50">
      <Header />
      <NavigationBar />
      {/* Ajout d'un padding-top pour compenser la hauteur des éléments fixes */}
      <div className="pt-32">
        <HeroSection />
        <ActeUrbanismeSection />
        <ObjectifsSection />
        <ServicesSection />
        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;
