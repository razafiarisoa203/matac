 import { loginWithYaho, registerWithYaho } from "../auth/authActions";

const InfoCard = ({ title, icon, items }) => {
  const handleLinkClick = (item) => {
    if (item.text === "Connexion") {
      loginWithYaho();
    } else if (item.text === "Inscrivez-vous") {
      registerWithYaho();
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm  -lg shadow-lg border border-green-100">
      <div className="p-5">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-green-600  -lg flex items-center justify-center mr-3">
            <span className="text-white text-sm">{icon}</span>
          </div>
          <h3 className="font-bold text-gray-800 text-lg">{title}</h3>
        </div>
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="text-sm">
              {item.isLink ? (
                <button
                  onClick={() => handleLinkClick(item)}
                  className="text-green-600 hover:text-green-700 font-medium transition-colors hover:underline text-left"
                >
                  {item.text}
                </button>
              ) : (
                <span className="text-gray-700">{item.text}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InfoCard;