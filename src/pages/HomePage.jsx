import React from "react";
import HeroSection from "../components/HeroSection";
import ServicesSection from "../components/ServicesSection";
import ObjectifsSection from "../components/ObjectifsSection";
import ActesUrbanisme from "../components/ActesUrbanisme";
import Indicateurs from "../components/Indicateurs";
import Header from "../components/Header";
import Footer from "../components/Footer";

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <ServicesSection />
        <ActesUrbanisme />
        <ObjectifsSection />
        <Indicateurs />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
