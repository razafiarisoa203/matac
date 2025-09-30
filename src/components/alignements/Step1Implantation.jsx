import { ChevronDown } from "lucide-react";

const Step1Implantation = ({ regions, communes, selectedRegion, selectedCommune, setSelectedRegion, setSelectedCommune }) => {
  return (
    <>
      <h3 className="text-xl font-medium text-gray-800 mb-8">
        Choix d'implantation
      </h3>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Spécifiez la Région
          </label>
          <div className="relative">
            {!selectedRegion && (
              <span className="absolute top-3 left-3 text-gray-400 pointer-events-none transition-opacity duration-200">
                Sélectionnez la Région
              </span>
            )}
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md appearance-none bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="" hidden></option>
              {regions.map((region) => (
                <option key={region.region_id} value={region.region_id}>
                  {region.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Spécifiez la Commune
          </label>
          <div className="relative">
            {!selectedCommune && (
              <span className="absolute top-3 left-3 text-gray-400 pointer-events-none transition-opacity duration-200">
                Sélectionnez la commune
              </span>
            )}
            <select
              value={selectedCommune}
              onChange={(e) => setSelectedCommune(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md appearance-none bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              disabled={!selectedRegion}
            >
              <option value="" hidden></option>
              {communes.map((commune) => (
                <option key={commune.commune_id} value={commune.commune_id}>
                  {commune.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Step1Implantation;