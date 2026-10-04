import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { loginWithYaho } from "../auth/authActions";
import { useTheme } from "../context/ThemeContext";

const ServicesSection = () => {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const [isTitleHovered, setIsTitleHovered] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  // Récupérer les services traduits
  const servicesRaw = t('services.servicesList', { returnObjects: true }) || [];
  const services = Array.isArray(servicesRaw) ? servicesRaw : Object.values(servicesRaw);
  return (
    <div
      id="services"
      className="min-h-screen dark:bg-[#1a202c] flex flex-col relative overflow-hidden py-16"
    >
      {/* Éléments décoratifs d'arrière-plan */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-20 right-10 w-40 h-40 bg-[#269745]/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 left-10 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* En-tête avec titre SERVICES - ALIGNÉ À GAUCHE */}
      <div className="relative z-10 mb-16">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-left">
            <div
              className="relative inline-block"
              onMouseEnter={() => setIsTitleHovered(true)}
              onMouseLeave={() => setIsTitleHovered(false)}
            >
              <h2 className="text-4xl font-bold text-[#269745]">{t('services.title')}</h2>
              {/* Ligne noire animée identique à OBJECTIFS */}
              <div
                className={`absolute bottom-0 left-0 h-1 bg-black transition-all duration-300 ${isTitleHovered ? "w-full" : "w-0"}`}
                style={{ bottom: "-8px" }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Grille des services avec section à droite */}
      <div className="flex-1 relative z-10">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Grille des 4 cartes de services (2 colonnes) */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {services.map((service, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group cursor-pointer border border-gray-100 h-full flex flex-col"
                  >
                    {/* Icône sans arrière-plan et agrandie */}
                    <div className="mb-4">
                      <img
                        src={service.icon}
                        alt={service.title}
                        className="w-16 h-16 text-[#269745] mx-auto" // Icônes agrandies et centrées
                      />
                    </div>

                    {/* Titre */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-[#269745] transition-colors duration-300 text-center">
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 text-xs leading-relaxed mb-4 flex-grow text-center">
                      {service.description}
                    </p>

                    {/* Bouton avec flèche */}
                    <div className="flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-[#269745] flex items-center justify-center group-hover:bg-[#1e7a3a] transition-colors duration-300">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section SERVICE REPONDS À VOTRE BESOIN à droite */}
            <div className="lg:col-span-1 flex items-center">
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 w-full">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {t('services.meetYourNeeds')}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6 text-sm">
                  {t('services.platformDescription')}
                </p>
                <button
                  onClick={loginWithYaho}
                  className="bg-[#269745] text-white px-6 py-3 rounded-full hover:bg-[#1e7a3a] transition-colors duration-300 flex items-center gap-2 text-sm font-semibold"
                >
                  {t('services.myPlatform')}
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div
            id="service-contact-form"
            className={`mt-20 max-w-5xl mx-auto rounded-3xl border p-8 sm:p-10 lg:p-12 transition-all duration-300 ${
              isDarkMode
                ? 'bg-slate-900 border-slate-700 shadow-[0_20px_50px_rgba(15,23,42,0.45)]'
                : 'bg-gradient-to-br from-white to-green-50 border-green-100 shadow-[0_20px_50px_rgba(38,151,69,0.12)]'
            }`}
          >
            <div className="mb-8 text-center md:text-left">
              <p className={`text-sm font-semibold uppercase tracking-[0.2em] mb-3 ${isDarkMode ? 'text-green-400' : 'text-[#269745]'}`}>
                {t('contact.title')}
              </p>
              <h3 className={`text-3xl sm:text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {t('contact.subtitle')}
              </h3>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert(t('contact.success'));
                setFormData({ name: "", email: "", message: "" });
              }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-200' : 'text-gray-700'}`}>
                    {t('contact.fullName')}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={t('contact.namePlaceholder')}
                    className={`w-full border rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#269745] shadow-sm ${
                      isDarkMode
                        ? 'border-slate-600 bg-slate-800 text-white placeholder:text-slate-400'
                        : 'border-gray-300 bg-white text-gray-900 placeholder:text-gray-400'
                    }`}
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-200' : 'text-gray-700'}`}>
                    {t('contact.email')}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={t('contact.emailPlaceholder')}
                    className={`w-full border rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#269745] shadow-sm ${
                      isDarkMode
                        ? 'border-slate-600 bg-slate-800 text-white placeholder:text-slate-400'
                        : 'border-gray-300 bg-white text-gray-900 placeholder:text-gray-400'
                    }`}
                    required
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-200' : 'text-gray-700'}`}>
                  {t('contact.message')}
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={t('contact.messagePlaceholder')}
                  rows="7"
                  className={`w-full border rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#269745] shadow-sm resize-none ${
                    isDarkMode
                      ? 'border-slate-600 bg-slate-800 text-white placeholder:text-slate-400'
                      : 'border-gray-300 bg-white text-gray-900 placeholder:text-gray-400'
                  }`}
                  required
                />
              </div>

              <div className="flex justify-center md:justify-start">
                <button
                  type="submit"
                  className="w-full md:w-auto bg-[#269745] text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-[#1e7a38] transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  {t('contact.submit')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesSection;
