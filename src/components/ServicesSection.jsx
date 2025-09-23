import React, { useState } from "react";
import { Link } from "react-router-dom";

const ServicesSection = () => {
  const [isTitleHovered, setIsTitleHovered] = useState(false);
  const services = [
    {
      title: "Déposition de dossier",
      description:
        "Grâce à notre plateforme vous permettra de déposer et suivre votre demande de permis de construire en ligne avec nous.",
      icon: "/Bank Building.png",
      color: "bg-[#269745]",
    },
    {
      title: "Suivie de l'évolution",
      description:
        "Pour vous permettre de suivre votre demande vous recevez des alertes de notification par Email, nous vous offrons un service innovant pour mieux vous servir.",
      icon: "/Follow.png",
      color: "bg-[#269745]",
    },
    {
      title: "Dossier traité en ligne",
      description:
        "Archivé et garantie un traitement et suivi par l'administration de vos systèmes.",
      icon: "/Check.png",
      color: "bg-[#269745]",
    },
    {
      title: "Archivé et sécurisé",
      description:
        "Votre permis est géré en sécurisé et vous bénéficiez d'avoir accès et tout moment.",
      icon: "/Secure Server.png",
      color: "bg-[#269745]",
    },
  ];

  return (
    <div
      id="services"
      className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col relative overflow-hidden py-16"
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
              <h2 className="text-4xl font-bold text-[#269745]">SERVICES</h2>
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
                  SERVICE REPONDS À VOTRE BESOIN
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6 text-sm">
                  Notre plateforme innovante vous permet de gérer toutes vos
                  démarches d'urbanisme en ligne, avec un suivi en temps réel et
                  une sécurité garantie pour tous vos documents.
                </p>
                <Link
                  to="/login"
                  className="bg-[#269745] text-white px-6 py-3 rounded-full hover:bg-[#1e7a3a] transition-colors duration-300 flex items-center gap-2 text-sm font-semibold"
                >
                  Mon plateforme
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
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesSection;
