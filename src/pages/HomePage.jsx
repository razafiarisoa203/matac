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
  return (
    <div className="min-h-screen flex flex-col">
      {/* Conteneur fixe pour Header puis NavigationBar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white">
        <div>
          <Header />
        </div>
        <div>
          <NavigationBar />
        </div>
      </div>

      {/* Contenu principal avec padding réduit pour compenser la hauteur du Header et de la NavigationBar */}
      <main className="flex-grow p-20 py-30">
        <div>
          {/* Semi-transparent overlay for readability */}
          <div className="absolute inset-0 bg-white bg-opacity-75"></div>
          <div className="relative z-10">
            <div id="accueil">
              <MainContent />
            </div>
            <div className=""></div>
            <Indicateurs />
            <div className="my-32"></div>
            <ActesUrbanisme />
          </div>
        </div>
        <div className="my-16"></div>
        <ObjectifsSection />
        <div className="my-16"></div>
        <ServicesSection />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
