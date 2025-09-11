const AnimatedIcons = () => {
  return (
    <>
      {/* Icône Settings 1 en bas à gauche - rotation permanente */}
      <div className="group cursor-pointer absolute bottom-16 left-16 z-10">
        <div className="w-40 h-40 transform -rotate-12 animate-[spin_8s_linear_infinite]">
          <img
            src="/Setting 1.png"
            alt="Setting 1"
            className="w-full h-full transform group-hover:scale-110 transition-all duration-300"
          />
        </div>
      </div>

      {/* Icône Settings 2 - rotation permanente inverse */}
      <div className="group cursor-pointer absolute bottom-48 left-48 z-10">
        <div className="w-32 h-32 transform rotate-12 animate-[spin_8s_linear_infinite_reverse]">
          <img
            src="/Setting 2.png"
            alt="Setting 2"
            className="w-full h-full transform group-hover:scale-110 transition-all duration-300"
          />
        </div>
      </div>

      {/* Icône de fichier à gauche inclinée vers la gauche */}
      <div className="group cursor-pointer absolute top-2/5 left-1/4 z-10">
        <div className="w-32 h-32 transform -rotate-6 animate-[bounce_2s_infinite]">
          <img
            src="/File.png"
            alt="File"
            className="w-full h-full transform group-hover:scale-110 transition-all duration-300"
          />
        </div>
      </div>

      {/* Icône de liste à droite inclinée vers la droite */}
      <div className="group cursor-pointer absolute top-1/4 right-1/4 z-10">
        <div className="w-32 h-32 transform rotate-6 animate-[bounce_2s_infinite]">
          <img
            src="/ClipFile.png"
            alt="List"
            className="w-full h-full transform group-hover:scale-110 transition-all duration-300"
          />
        </div>
      </div>

      {/* Styles CSS pour les animations personnalisées */}
      <style jsx>{`
        @keyframes spin_reverse {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(-360deg);
          }
        }
        .animate-[spin_8s_linear_infinite_reverse] {
          animation: spin_reverse 8s linear infinite;
        }
      `}</style>
    </>
  );
};

export default AnimatedIcons;
