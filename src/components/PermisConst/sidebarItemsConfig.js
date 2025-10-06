// sidebarConfig.js
export const steps = [
    { id: 1, title: 'IDENTIFICATION', icon: 'person' },
    { id: 2, title: 'RENSEIGNEMENT ARCHITECTURAL', icon: 'architecture' },
    { id: 3, title: 'RENSEIGNEMENT TECHNIQUE', icon: 'engineering' },
    { id: 4, title: 'PIÈCES JOINTES', icon: 'attach_file' }
];

export const sidebarItems = {
    1: [
        {
            id: 1,
            title: 'Choix de construction',
            icon: 'home_work',
            fields: [
                { label: 'Spécifier la nature du travaux', name: 'natureTravaux', type: 'select', options: ['Nouvelle construction', 'Continuez un travaux', 'Rennovation'], required: true },
                { label: 'Type d\'affectation', name: 'typeAffectation', type: 'select', options: ['Maison individuelle', 'Habitation minime important', 'Commerce', 'Industrie'], required: true },
            ]
        },
        {
            id: 2,
            title: 'Référence alignement',
            icon: 'straighten',
            fields: [{ label: 'Référence d\'alignement', name: 'referenceAlignement', type: 'text', placeholder: 'Ex: REF-2024-001', required: false, pattern: '^[A-Za-z0-9]+$', title: 'Lettres et chiffres uniquement' }]
        },
        {
            id: 3,
            title: 'Renseignement du Propriétaire',
            icon: 'straighten',
            fields: [
                { label: 'Civilité', name: 'civiliteProprietaire', type: 'radio', placeholder: ['Madame', 'Monsieur'], required: true },
                { label: 'Nom complet', name: 'nomProprietaire', type: 'text', required: true },
                { label: 'Téléphone', name: 'telProprietaire', type: 'tel', required: true, inputMode: 'numeric' },
                { label: 'Email', name: 'emailProprietaire', type: 'email', required: true },
                { label: 'CIN', name: 'cinProprietaire', type: 'number', required: true, inputMode: 'numeric' },
                { label: 'Adresse', name: 'adresseProprietaire', type: 'text', required: true, pattern: '^[A-Za-z0-9]+$', title: 'Lettres et chiffres uniquement' }
            ]
        },
    ],
    2: [
        {
            id: 1,
            title: 'Auteur de l\'ouvrage',
            icon: 'groups',
            fields: [
                { label: 'Auteur de l\'ouvrage', name: 'auteurOuvrage', type: 'radio', placeholder: ['Architecte', 'Ingénieur BTP / Déssinateur agréer'], required: true },
                { label: 'Nom', name: 'nomAuteur', type: 'text', required: true, pattern: '^[A-Za-z]+$', title: 'Lettres uniquement' },
                { label: 'Fonction', name: 'fonctionAuteur', type: 'text', required: true },
                { label: 'Numéro d\'ordre', name: 'numeroOrdreAuteur', type: 'text', required: true, inputMode: 'numeric' },
                { label: 'Téléphone', name: 'telAuteur', type: 'tel', required: true, inputMode: 'numeric' },
                { label: 'Email', name: 'emailAuteur', type: 'email', required: true },
                { label: 'Adresse', name: 'adresseAuteur', type: 'text', required: true },
            ]
        },
        {
            id: 2,
            title: 'Renseignement sur les travaux',
            icon: 'construction',
            fields: [
                { label: 'Zone d\'implantation', name: 'zoneImplantation', type: 'select', options: ['Zone à construire', 'Zone de lotissement', 'Zone soumise au remblai', 'ZPPAUP'], required: true },
                { label: 'Matériaux', name: 'materiaux', type: 'text', required: true },
                { label: 'Durée (Mois)', name: 'dureeTravaux', type: 'number', required: true },
                { label: 'Montant (Ar)', name: 'montantTravaux', type: 'number', required: true }
            ]
        },
        {
            id: 3,
            title: 'Caractéristique du projet',
            icon: 'apartment',
            fields: [
                { label: 'Longueur', name: 'longueurProjet', type: 'number', required: true },
                { label: 'Largeur / profondeur', name: 'largeurProjet', type: 'number', required: true },
                { label: 'Hauteur (m)', name: 'hauteurProjet', type: 'number', required: true },
            ]
        }
    ],
    3: [
        {
            id: 1,
            title: 'Surface & volumes',
            icon: 'square_foot',
            fields: [
                { label: 'Surface du terrain (m²)', name: 'surfaceTerrain', type: 'number', required: true },
                { label: 'Emprise au sol existant (m²)', name: 'empriseSolExistant', type: 'number', required: true },
                { label: 'Emprise au sol (m²)', name: 'empriseSol', type: 'number', required: true },
                { label: 'CES du projet', name: 'cesProjet', type: 'number', required: true },
                { label: 'Surface de plancher des batiments existant (m²)', name: 'surfacePlancherExistant', type: 'number', required: true },
                { label: 'Surface de plancher du projet (m²)', name: 'surfacePlancherProjet', type: 'number', required: true },
                { label: 'Surface verte (m²)', name: 'surfaceVerte', type: 'number', required: true },
                { label: 'Niveau projet R+ (m³)', name: 'niveauRPlus', type: 'number', required: true }
            ]
        },
        {
            id: 2,
            title: 'Distance relative du projet par rapport à l\'axe',
            icon: 'social_distance',
            fields: [
                { label: 'Chemin public', name: 'distanceCheminPublic', type: 'number', required: true },
                { label: 'Sentier public', name: 'distanceSentierPublic', type: 'number', required: true },
                { label: 'Route Nationale', name: 'distanceRouteNationale', type: 'number', required: true },
                { label: 'Cours d\'eau / Rivière', name: 'distanceRiviere', type: 'number', required: true },
                { label: 'Canal public', name: 'distanceCanalPublic', type: 'number', required: true },
                { label: 'Installation de transport d\'énergie', name: 'distanceInstallationEnergie', type: 'number', required: true },
                { label: 'Ligne éléctrique à haute tension', name: 'distanceLigneElectrique', type: 'number', required: true },
                { label: 'Implantation du projet par rapport aux limite de la propriété (m)', name: 'distanceProjetLimitePropriete', type: 'number', required: true },
                { label: 'Distance minimale entre le projet et une construction éxistante', name: 'distanceMinimaleProjetConstructionExistante', type: 'number', required: true },
            ]
        },
        {
            id: 3,
            title: 'Équipement terrain',
            icon: 'plumbing',
            fields: [
                { label: 'Raccordement eau', name: 'equipementEau', type: 'radio', placeholder: ['Oui', 'Non'], required: true },
                { label: 'Raccordement électricité', name: 'equipementElectricite', type: 'radio', placeholder: ['Oui', 'Non'], required: true },
                { label: 'Assainissement', name: 'equipementAssainissement', type: 'radio', placeholder: ['Oui', 'Non'], required: true },
                { label: 'Voie d\'accès', name: 'equipementVoieAcces', type: 'radio', placeholder: ['Oui', 'Non'], required: true }
            ]
        },
        { id: 4, title: 'Caractéristiques des pièces', icon: 'room_preferences', isDynamic: true },
        {
            id: 5,
            title: 'Équipement de l\'ouvrage',
            icon: 'hvac',
            fields: [
                { label: 'Implémentation du VH / VB au niveau du toilette, cuisine, fosse eptique', name: 'existantVhVb', type: 'radio', placeholder: ['Oui', 'Non'], required: true },
                { label: 'Terasse', name: 'existantTerasse', type: 'radio', placeholder: ['Oui', 'Non'], required: true },
                { label: 'Garde Corp', name: 'existantGardeCorp', type: 'radio', placeholder: ['Oui', 'Non'], required: true },
                { label: 'Nombre veranda (m)', name: 'nbrVeranda', type: 'number', required:  true, inputMode: 'numeric' },
                { label: 'Nombre couloir (m)', name: 'nbrCouloir', type: 'number', required:  true, inputMode: 'numeric' },
                { label: 'Nombre escalier (m)', name: 'nbrEscalier', type: 'number', required:  true, inputMode: 'numeric' },
                { label: 'Nombre Servitude / Voie d\'acces (m)', name: 'nbrServitude', type: 'number', required:  true, inputMode: 'numeric' },
            ]
        },
        {
            id: 6,
            title: 'Assainissement',
            icon: 'water_drop',
            fields: [
                { label: 'Branchement au réseau public pour l\'écoulement des eaux (EU, FV, FP)', name: 'existantBranchementEauPublic', type: 'radio', placeholder: ['Oui', 'Non'], required:  true },
                { label: 'Utilisation de la fosse éptique', name: 'utilisationFosseEptique', type: 'radio', placeholder: ['Oui', 'Non'], required:  true },
                { label: 'Si oui', name: 'typeFosseEptique', type: 'radio', placeholder: ['Fosse en béton armé', 'Fosse en plastique'], required:  true },
                { label: 'Implantation des fosses séptiques par rapport à la fondation', name: 'evacuationEauxPluviales', type: 'number', required:  true },
                { label: 'Nombre d\'usager', name: 'nbrUsageFosse', type: 'number', required:  true },
                { label: 'Capacité de la fosse', name: 'capaciteFosse', type: 'number', required:  true },
                { label: 'Utilisation d\'un puisard', name: 'utilisationPuisard', type: 'radio', placeholder: ['Oui', 'Non'], required:  true },
                { label: 'Si oui Implantation du puisard par rapport à la fondation', name: 'puisardAuFondation', type: 'number', required:  true },
                { label: 'Présentation du goutière et déscentes d\'EP', name: 'presentationGoutiere', type: 'radio', placeholder: ['Oui', 'Non'], required:  true },
                { label: 'Présentation des regards de collecte des eaux sur le plan d\'implantation du fondation', name: 'presentationRegardCollecte', type: 'radio', placeholder: ['Oui', 'Non'], required:  true }
            ]
        }
    ],
    4: [
        {
            id: 1,
            title: 'Documents techniques',
            icon: 'engineering',
            files: [
                { name: 'planTerrain', label: 'Plan de situation du terrain', required:  false },
                { name: 'droitPropriete', label: 'Titre de propriété', required:  false },
                { name: 'planLimiteTerrain', label: 'Plan des limites du terrain', required:  false },
                { name: 'planMasse', label: 'Plan de masse', required:  false },
                { name: 'planFacade', label: 'Plan des façades', required:  false }
            ]
        }
    ]
};
