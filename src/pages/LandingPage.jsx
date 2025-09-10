import AnimatedIcons from "../components/AnimatedIcons";
import MainContent from "../components/MainContent";
import DiscoverButton from "../components/DiscoverButton";
import Header from "../components/Header";

const LandingPage = () => {
  return (
    <section
      id="accueil"
      className="relative min-h-screen bg-black overflow-hidden"
      style={{
        backgroundImage: `url('/construction-bg.jpeg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Header />
      <MainContent />

      <div className="absolute bottom-40 left-1/2 transform -translate-x-1/2 z-20">
        <DiscoverButton to="/HomePage" className="mb-0" />
      </div>
    </section>
  );
};

export default LandingPage;
