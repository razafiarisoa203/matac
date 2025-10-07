import React from 'react';

const Sidebar = ({ steps, currentStep, handleStepClick }) => {
  return (
    <div className="w-80 border-transparent bg-gray-50">
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-700 mb-6">
          INFORMATION GENERALE
        </h3>
        <div className="space-y-4">
          {steps.map((step) => (
            <button
              key={step.number}
              onClick={() => handleStepClick(step.number)}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors text-left ${
                step.number === currentStep
                  ? "bg-green-500 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step.number === currentStep
                    ? "bg-white text-green-500"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {step.number}
              </div>
              <span className="text-sm font-medium">{step.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;