// components/PermisConst/PermisHeader.jsx
import CheckIcon from '@mui/icons-material/Check';
import PersonIcon from '@mui/icons-material/Person';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import EngineeringIcon from '@mui/icons-material/Engineering';
import AttachFileIcon from '@mui/icons-material/AttachFile';

const iconMap = {
    person: <PersonIcon fontSize="small" />,
    architecture: <AccountBalanceIcon fontSize="small" />,
    engineering: <EngineeringIcon fontSize="small" />,
    attach_file: <AttachFileIcon fontSize="small" />,
    check: <CheckIcon fontSize="small" />,
};

const PermisHeader = ({ steps, currentStep, getStepProgress, onReset, onStepChange }) => (
    <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            <div className="text-center mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                    SOUMETTRE UN DOSSIER DE PERMIS DE CONSTRUIRE
                </h1>
                <p className="text-gray-600 text-sm sm:text-base">Complétez votre demande étape par étape</p>
            </div>

            <div className="mb-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm text-gray-600 mb-3">
                    <span className="mb-2 sm:mb-0">Progression</span>
                    <div className="flex items-center space-x-4">
                        <span>{getStepProgress()}%</span>
                        <button onClick={onReset} className="text-red-500 hover:text-red-700 text-xs underline">
                            Réinitialiser
                        </button>
                    </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-[#269745] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getStepProgress()}%` }} />
                </div>
            </div>
            <div className="flex justify-between">
                {steps.map((step, idx) => (
                    <button
                        key={step.id}
                        onClick={() => onStepChange && onStepChange(step.id)}
                        className="flex flex-col items-center focus:outline-none"
                    >
                        <div className="flex items-center flex-col">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all cursor-pointer ${
                                currentStep === step.id
                                    ? 'bg-[#269745] text-white shadow-lg'
                                    : currentStep > step.id
                                        ? 'bg-green-100 text-[#269745] hover:bg-green-200'
                                        : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                            }`}>
                                {currentStep > step.id
                                    ? iconMap.check
                                    : iconMap[step.icon] || <PersonIcon fontSize="small" />}
                            </div>
                            <span className={`mt-2 text-xs sm:text-sm font-medium text-center ${currentStep === step.id ? 'text-[#269745]' : 'text-gray-600'}`}>
                                {step.title}
                            </span>
                        </div>
                        <span className={`mt-3 text-sm font-medium text-center max-w-24 ${
                            currentStep === step.id ? 'text-[#269745]' : 'text-gray-600'
                        }`}>
                         
                        </span>
                    </button>
                ))}
            </div>
        </div>
    </div>
);

export default PermisHeader;
