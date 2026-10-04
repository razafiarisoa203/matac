import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ObjectifsSection from "../components/ObjectifsSection";
import ActesUrbanisme from "../components/ActesUrbanisme";
import Indicateurs from "../components/Indicateurs";
import Footer from "../components/Footer";
import NavigationBar from "../components/NavigationBar";
import Header from "../components/Header";
import MainContent from "../components/MainContent";

const HomePage = () => {
  const { t } = useTranslation();
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              id="service-contact-form"
              className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-lg transition-colors duration-300 dark:border-slate-700 dark:bg-slate-900 dark:shadow-slate-950/50"
            >
              <div className="mb-6 text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#269745] mb-3">
                  {t('contact.title')}
                </p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{t('contact.subtitle')}</h3>
              </div>

              <form className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-slate-200">
                      {t('contact.fullName')}
                    </label>
                    <input
                      type="text"
                      placeholder={t('contact.namePlaceholder')}
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#269745] dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-slate-200">
                      {t('contact.email')}
                    </label>
                    <input
                      type="email"
                      placeholder={t('contact.emailPlaceholder')}
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#269745] dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-slate-200">
                    {t('contact.message')}
                  </label>
                  <textarea
                    rows="6"
                    placeholder={t('contact.messagePlaceholder')}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#269745] dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400"
                  />
                </div>

                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="w-full md:w-auto bg-[#269745] text-white font-semibold px-8 py-3 rounded-xl hover:bg-[#1e7a38] transition-colors duration-300"
                  >
                    {t('contact.submit')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;