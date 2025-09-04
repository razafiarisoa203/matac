const ServicesSection = () => {
  const services = [
    {
      title: "Déposez votre dossier en ligne",
      description: "Grâce à un fenêtre de système vous permettra de déposer et rester votre demande de permis de construire dans un délai très court.",
      image: "/dossiers.png"
    },
    {
      title: "Suivez l'évolution de votre demande",
      description: "Pour vous permettre de suivre votre demande vous recevrez des alertes et notification par email vous nous allons également l'envoyer pour vous aider.",
      image: "/demander-de-laide.png"
    },
    {
      title: "Votre dossier sera traité en ligne",
      description: "Votre permis est géré en sécurité et vous pouvez y avoir accès en tout moment.",
      image: "/immeuble-de-bureaux.png"
    },
    {
      title: "Votre demande est archivée et en sécurité",
      description: "Votre permis est géré en sécurité et vous pouvez y avoir accès en tout moment.",
      image: "/verifier.png"
    }
  ];

  return (
    <div id="services" className="min-h-screen bg-white flex flex-col">
      {/* En-tête avec titre SERVICES */}
      <div className="pt-8 pb-4">
        <div className="flex items-center mb-8">
          <div className="w-24 h-20 bg-gray-700"></div>
          <div className="bg-[#9BC53D] px-12 py-6">
            <h2 className="text-white text-5xl font-bold">SERVICES</h2>
          </div>
        </div>
      </div>

      {/* Grille des services - Occupe l'espace principal */}
      <div className="flex-1 flex items-center justify-center px-8 py-8">
        <div className="w-full max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 h-full">
            {services.map((service, index) => (
              <div 
                key={index}
                className="bg-white border-2 border-gray-200 overflow-hidden shadow-lg hover:shadow-xl transition-shadow flex flex-col"
              >
                <div className="h-64 bg-gray-100 flex items-center justify-center">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-32 h-32 object-contain"
                  />
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-[#9BC53D] text-xl font-bold mb-4">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-base leading-relaxed flex-1">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer MATAC */}
      <div className="mt-auto">
        <div className="bg-[#9BC53D] py-20">
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-left">
              <h3 className="text-white text-7xl font-bold mb-6">MATAC</h3>
              <p className="text-white text-xl mb-10 max-w-lg">
                Ministère en charge de l'Aménagement du Territoire<br/>
                Autorisation de Construire
              </p>
              <div className="flex space-x-6">
                <div className="w-5 h-5 bg-white  -full"></div>
                <div className="w-5 h-5 bg-white  -full opacity-50"></div>
                <div className="w-5 h-5 bg-white  -full opacity-50"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesSection;
