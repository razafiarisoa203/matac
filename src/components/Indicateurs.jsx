const Indicateurs = () => {
  return (
    <div className="bg-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-center items-center gap-20">
          {/* INDICATEUR */}
          <div className="bg-white  -lg shadow-md p-8 border border-gray-200 w-80">
            <div className="flex items-start space-x-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  INDICATEUR
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam consectetur elit nec consectetur nec.
                </p>
              </div>
            </div>
          </div>

          {/* CARTOGRAPHIE */}
          <div className="bg-white  -lg shadow-md p-8 border border-gray-200 w-80">
            <div className="flex items-start space-x-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  CARTOGRAPHIE
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam consectetur elit nec consectetur nec.
                </p>
              </div>
            </div>
          </div>

          {/* DOCUMENTATION */}
          <div className="bg-white  -lg shadow-md p-8 border border-gray-200 w-80">
            <div className="flex items-start space-x-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  DOCUMENTATION
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam consectetur elit nec consectetur nec.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Indicateurs;
