import React from 'react';
import PersonIcon from '@mui/icons-material/Person';
import ArchitectureIcon from '@mui/icons-material/Architecture';
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

const iconsMap = {
    person: PersonIcon,
    architecture: ArchitectureIcon,
    engineering: EngineeringIcon,
    attach_file: AttachFileIcon,
    home_work: HomeWorkIcon,
    straighten: StraightenIcon,
    groups: GroupsIcon,
    construction: ConstructionIcon,
    apartment: ApartmentIcon,
    square_foot: SquareFootIcon,
    social_distance: SocialDistanceIcon,
    plumbing: PlumbingIcon,
    room_preferences: RoomPreferencesIcon,
    hvac: HvacIcon,
    water_drop: WaterDropIcon,
};

const MaterialIcon = ({ name, size = 24, className = '', bgColor = '' }) => {
    const Icon = iconsMap[name];
    if (!Icon) return null;

    // Détecte si le fond est vert pour mettre l'icône en blanc
    const isGreenBackground = bgColor.includes('green');
    const color = isGreenBackground ? '#ffffff' : '#269745'; // blanc si fond vert, sinon vert

    return <Icon style={{ fontSize: size, color }} className={className} />;
};

export default MaterialIcon;
