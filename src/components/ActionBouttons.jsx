const ActionButtons = () => {
  const buttons = [
    { icon: "", text: "INDICATEUR" },
    { icon: "", text: "CARTOGRAPHIE" },
    { icon: "", text: "DOCUMENTATION" },
  ];

  return (
    <div className="bg-white py-12 border-t-4 border-green-500">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {buttons.map((button, index) => (
            <button
              key={index}
              className="h-20 text-xl font-semibold border-2 border-green-500 text-gray-800 hover:bg-green-50 bg-white  -lg transition-all duration-200 hover:shadow-lg hover:border-green-600 flex items-center justify-center space-x-3"
            >
              <span className="text-2xl">{button.icon}</span>
              <span>{button.text}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};


export default ActionButtons;
