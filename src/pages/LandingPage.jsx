import Header from "../components/Header";
import NavigationBar from "../components/NavigationBar";
import HeroSection from "../components/HeroSection";
import ActeUrbanismeSection from "../components/ActeUrbanismeSection";
import ServicesSection from "../components/ServicesSection";
import ObjectifsSection from "../components/ObjectifsSection";
import Footer from "../components/Footer";

const LandingPage = () => {
  return (
    <div className="bg-gray-50">
      <Header />
      <NavigationBar />
      {/* Ajout d'un padding-top pour compenser la hauteur des éléments fixes */}
      <div className="pt-32">
        <HeroSection />
        <ActeUrbanismeSection />
        <ServicesSection />
        <ObjectifsSection />
        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;
