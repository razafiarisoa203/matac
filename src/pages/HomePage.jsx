import React from "react";
import ServicesSection from "../components/ServicesSection";
import ObjectifsSection from "../components/ObjectifsSection";
import ActesUrbanisme from "../components/ActesUrbanisme";
import Indicateurs from "../components/Indicateurs";
import Footer from "../components/Footer";
import NavigationBar from "../components/NavigationBar";

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Ajout d'un padding-top pour compenser la hauteur du header fixe */}
      <main className="flex-grow pt-16">
        <NavigationBar />
        <Indicateurs />
        <ActesUrbanisme />
        <ServicesSection />
        <ObjectifsSection />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
