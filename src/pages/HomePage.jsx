import React from "react";
import ServicesSection from "../components/ServicesSection";
import ObjectifsSection from "../components/ObjectifsSection";
import ActesUrbanisme from "../components/ActesUrbanisme";
import Indicateurs from "../components/Indicateurs";
import Footer from "../components/Footer";
import NavigationBar from "../components/NavigationBar";
import Header from "../components/Header";
import MainContent from "../components/MainContent";

const HomePage = () => {
  const [activeSection, setActiveSection] = useState("accueil");

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { id: "accueil", element: document.getElementById("accueil") },
        { id: "indicateurs", element: document.getElementById("indicateurs") },
        { id: "actes-urbanisme", element: document.getElementById("actes-urbanisme") },
        { id: "objectifs", element: document.getElementById("objectifs") },
        { id: "services", element: document.getElementById("services") }
      ];

      const scrollPosition = window.scrollY + 100; // Offset pour la navbar fixe

      // Trouver la section active
      let currentSection = "accueil";
      
      for (const section of sections) {
        if (section.element) {
          const sectionTop = section.element.offsetTop;
          const sectionHeight = section.element.offsetHeight;
          
          if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.id;
            break;
          }
        }
      }

      setActiveSection(currentSection);
    };

    // Ajouter l'écouteur d'événement
    window.addEventListener("scroll", handleScroll);
    
    // Déclencher une fois au chargement pour définir la section initiale
    handleScroll();

    // Nettoyer l'écouteur
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Conteneur fixe pour Header puis NavigationBar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white">
        <div>
          <Header />
        </div>
        <div>
          <NavigationBar activeSection={activeSection} setActiveSection={setActiveSection} />
        </div>
      </div>

      {/* Contenu principal avec padding réduit pour compenser la hauteur du Header et de la NavigationBar */}
      <main className="flex-grow pt-32">
        <div>
          {/* Semi-transparent overlay for readability */}
          <div className="absolute inset-0 bg-white bg-opacity-75"></div>
          <div className="relative z-10">
            <section id="accueil">
              <MainContent />
            </section>
            <section id="indicateurs">
              <Indicateurs />
            </section>
            <section id="actes-urbanisme">
              <div className="my-32"></div>
              <ActesUrbanisme />
            </section>
          </div>
        </div>
        <section id="objectifs">
          <div className="my-16"></div>
          <ObjectifsSection />
        </section>
        <section id="services">
          <div className="my-16"></div>
          <ServicesSection />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;