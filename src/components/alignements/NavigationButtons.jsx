const NavigationButtons = ({ currentStep, setCurrentStep, handleNext, handleSubmit, isSubmitting, selectedRegion, selectedCommune }) => {
  const isNextDisabled = currentStep === 1 && (!selectedRegion || !selectedCommune);

  return (
    <div className="flex justify-between mt-8">
      {currentStep > 1 && (
        <button
          onClick={() => setCurrentStep(currentStep - 1)}
          className="px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded-md hover:bg-gray-400"
        >
          Précédent
        </button>
      )}
      <div className="flex gap-4">
        {currentStep < 6 && (
          <button
            onClick={handleNext}
            disabled={isNextDisabled}
            className={`px-4 py-2 font-semibold rounded-md ${
              isNextDisabled
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-green-500 text-white hover:bg-green-600"
            }`}
          >
            Suivant
          </button>
        )}
        {currentStep === 6 && (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`px-4 py-2 font-semibold rounded-md ${
              isSubmitting
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-green-500 text-white hover:bg-green-600"
            }`}
          >
            {isSubmitting ? "Soumission..." : "Soumettre"}
          </button>
        )}
      </div>
    </div>
  );
};

export default NavigationButtons;