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

const PermisHeader = ({ steps, currentStep, getStepProgress, onReset }) => (
    <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    SOUMETTRE UN DOSSIER DE PERMIS DE CONSTRUIRE
                </h1>
                <p className="text-gray-600">Complétez votre demande étape par étape</p>
            </div>
            <div className="mb-8">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progression</span>
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
                    <div key={step.id} className="flex flex-col items-center">
                        <div className="flex items-center">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${currentStep === step.id
                                    ? 'bg-[#269745] text-white shadow-lg'
                                    : currentStep > step.id
                                        ? 'bg-green-100 text-[#269745]'
                                        : 'bg-gray-200 text-gray-500'
                                }`}>
                                {currentStep > step.id
                                    ? iconMap.check
                                    : iconMap[step.icon] || <PersonIcon fontSize="small" />}
                            </div>
                            {idx < steps.length - 1 && (
                                <div className={`w-16 h-1 ml-4 ${currentStep > step.id ? 'bg-[#269745]' : 'bg-gray-200'
                                    }`} />
                            )}
                        </div>
                        <span className={`mt-3 text-sm font-medium text-center max-w-24 ${currentStep === step.id ? 'text-[#269745]' : 'text-gray-600'
                            }`}>
                            {step.title}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export default PermisHeader;
