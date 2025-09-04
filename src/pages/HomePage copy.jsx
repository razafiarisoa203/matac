import React, { useState } from "react";
import {
  Menu,
  X,
  User,
  Building,
  FileText,
  Target,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const MatacWebsite = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const services = [
    {
      title: "Déposez votre dossier en ligne",
      description:
        "Grâce à sa flexibilité, ce système vous permet ainsi de déposer et suivre votre demande de permis de construire dans un délai très court.",
      image: "/api/placeholder/300/200",
    },
    {
      title: "Suivez l'évolution de votre demande",
      description:
        "Pour vous permettre de suivre votre dossier, vous recevez des alertes et notification par Email, nous vous offrons un service interactif pour mieux vous servir.",
      image: "/api/placeholder/300/200",
    },
    {
      title: "Votre dossier sera traité en ligne",
      description:
        "Votre dossier sera traité en ligne et vous pouvez avoir accès en tout moment.",
      image: "/api/placeholder/300/200",
    },
    {
      title: "Votre demande est archivée et en sécurité",
      description:
        "Votre permis est géré en sécurité et vous pouvez avoir accès en tout moment.",
      image: "/api/placeholder/300/200",
    },
  ];

  const objectives = [
    {
      number: "01",
      title:
        "Réduire le délai de transmission des dossiers au sein de chaque fonction publique, mais aussi entre administration territoriale et administration de l'État",
    },
    {
      number: "02",
      title: "Assurer une meilleure sécurité et traçabilité des dossiers",
    },
    {
      number: "03",
      title:
        "Promouvoir et développer l'usage du numérique dans le traitement et archivage des dossiers",
    },
    {
      number: "04",
      title:
        "Mettre en place un outil de suivi des dossiers accessible aux usagers (avancement de l'instruction, demande d'avis, etc.)",
    },
    {
      number: "05",
      title:
        "Promouvoir la transparence dans le processus d'instruction des autorisations d'urbanisme à Madagascar",
    },
  ];

  return (
    <div>
      hello
    </div>
  );
};

export default MatacWebsite;
