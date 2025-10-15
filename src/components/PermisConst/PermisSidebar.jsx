// ...existing code...
import React from 'react';
import CheckIcon from '@mui/icons-material/Check';
import PersonIcon from '@mui/icons-material/Person';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import EngineeringIcon from '@mui/icons-material/Engineering';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import StraightenIcon from '@mui/icons-material/Straighten';
import GroupsIcon from '@mui/icons-material/Groups';
import ConstructionIcon from '@mui/icons-material/Construction';
import ApartmentIcon from '@mui/icons-material/Apartment';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import SocialDistanceIcon from '@mui/icons-material/SocialDistance';
import PlumbingIcon from '@mui/icons-material/Plumbing';
import RoomPreferencesIcon from '@mui/icons-material/RoomPreferences';
import HvacIcon from '@mui/icons-material/Hvac';
import WaterDropIcon from '@mui/icons-material/WaterDrop';

const iconMap = {
    person: <PersonIcon fontSize="small" />,
    architecture: <AccountBalanceIcon fontSize="small" />,
    engineering: <EngineeringIcon fontSize="small" />,
    attach_file: <AttachFileIcon fontSize="small" />,
    check: <CheckIcon fontSize="small" />,
    home_work: <HomeWorkIcon fontSize="small" />,
    straighten: <StraightenIcon fontSize="small" />,
    groups: <GroupsIcon fontSize="small" />,
    construction: <ConstructionIcon fontSize="small" />,
    apartment: <ApartmentIcon fontSize="small" />,
    square_foot: <SquareFootIcon fontSize="small" />,
    social_distance: <SocialDistanceIcon fontSize="small" />,
    plumbing: <PlumbingIcon fontSize="small" />,
    room_preferences: <RoomPreferencesIcon fontSize="small" />,
    hvac: <HvacIcon fontSize="small" />,
    water_drop: <WaterDropIcon fontSize="small" />,
};

const PermisSidebar = ({ steps, currentStep, currentSection, sidebarItems, completedSections, onSectionChange }) => (
    <div className="w-full md:w-80 bg-gray-50 border-r border-gray-200">
        <div className="p-4 md:p-6 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 flex items-center">
                <span className="mr-2">
                    {iconMap[steps[currentStep - 1]?.icon] || <PersonIcon fontSize="small" />}
                </span>
                <span className="text-sm md:text-base">{steps[currentStep - 1]?.title}</span>
            </h3>
        </div>
        <div className="p-3 md:p-4 space-y-2">
            <div className="grid grid-cols-1 gap-2">
                {sidebarItems[currentStep]?.map(item => (
                    <button
                        key={item.id}
                        onClick={() => onSectionChange(item.id)}
                        className={`w-full flex items-center p-3 rounded-lg text-left transition-all ${item.id === currentSection
                                ? 'bg-[#269745] text-white shadow-md'
                                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                            }`}
                    >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${item.id === currentSection
                                ? 'bg-white bg-opacity-20 text-white'
                                : completedSections[`${currentStep}-${item.id}`]
                                    ? 'bg-green-100 text-green-600'
                                    : 'bg-gray-100 text-gray-600'
                            }`}>
                            {completedSections[`${currentStep}-${item.id}`]
                                ? iconMap.check
                                : iconMap[item.icon] || <PersonIcon fontSize="small" />}
                        </div>
                        <span className="font-medium text-sm leading-tight">{item.title}</span>
                    </button>
                ))}
            </div>
        </div>
    </div>
);

export default PermisSidebar;
// ...existing code...