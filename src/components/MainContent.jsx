import { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { loginWithYaho, registerWithYaho } from "../auth/authActions";
import { AuthContext } from "../context/AuthContext";
import { Building2, Map, Moon, Sun, Languages, CircleHelp, ArrowRight } from "lucide-react";

import mdat from "../assets/logo/MDAT.webp";
import logoUF from "../assets/logo/logoUF.webp";
import oatf from "../assets/logo/OATF.webp";
import pnud from "../assets/logo/pnudlogo.webp";
import republique from "../assets/logo/REPUBLIQUE.webp";

const GREEN = "#269745";

const FONT = { fontFamily: "'Space Grotesk', system-ui, sans-serif" };

// Image de fond du panneau gauche (dans /public) : adaptez le nom du fichier
const BG_IMAGE = "/batiment.webp"

// Chiffres statiques : à remplacer par l'API si besoin
const METRICS = [
  { value: "1.2k+", key: "communes", fallback: "Communes" },
  { value: "24k", key: "permits", fallback: "Permis Délivrés" },
];

const FEATURES = [
  {
    key: "f1",
    icon: Building2,
    title: "Gestion des Autorisations",
    desc: "Destiné aux ministères en charge de l'urbanisme et aux communes malgaches pour centraliser les demandes d'alignement et de construction.",
    tags: [
      { key: "efficiency", fallback: "Efficacité" },
      { key: "transparency", fallback: "Transparence" },
    ],
  },
  {
    key: "f2",
    icon: Map,
    title: "Cadastre & Territoire",
    desc: "Accédez aux services techniques régionaux et aux outils SIG pour une vision précise de l'occupation des sols.",
    tags: [
      { key: "gis", fallback: "SIG" },
      { key: "precision", fallback: "Précision" },
    ],
  },
];

// Partenaires : noms d'affichage à ajuster si besoin
const PARTNERS = [
  { label: "MDAT", logo: mdat },
  { label: "UF", logo: logoUF },
  { label: "OATF", logo: oatf },
  { label: "PNUD", logo: pnud },
  { label: "République", logo: republique },
];

const MainContent = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [helpOpen, setHelpOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const actionsRef = useRef(null);

  // Ferme les menus (langue, aide) au clic à l'extérieur
  useEffect(() => {
    const onClickOutside = (e) => {
      if (actionsRef.current && !actionsRef.current.contains(e.target)) {
        setLangOpen(false);
        setHelpOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);
  const [dark, setDark] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  // Police du design (Space Grotesk), chargée une seule fois
  useEffect(() => {
    const id = "font-space-grotesk";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
  }, []);

  const { user } = useContext(AuthContext);

  const userName =
    user?.user_pseudo ||
    user?.username ||
    user?.name ||
    [user?.citizen_name, user?.citizen_lastname].filter(Boolean).join(" ") ||
    t("common.connected");

  // Connecté : tableau de bord. Sinon : Keycloak (retour sur VITE_KEYCLOAK_REDIRECT_URI)
  const handleLogin = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      loginWithYaho();
    }
  };

  const toggleTheme = () => {
    const next = !dark;
    localStorage.setItem("darkMode", String(next));
    setDark(next);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setLangOpen(false);
  };

  const currentLang = (i18n.language || "fr").slice(0, 2);

  const iconBtn =
    "inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-[#269745] dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white";

  return (
    <div
      
      className="flex min-h-screen flex-col bg-white text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-white lg:flex-row"
    >
      {/* Panneau gauche */}
      <aside
        className="relative flex flex-col justify-between overflow-hidden bg-slate-900 px-8 py-10 text-white lg:w-[30%] lg:min-w-[340px] lg:px-12"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(15,23,42,.18), rgba(15,23,42,.55)), url('${BG_IMAGE}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div>
          <h2 className="text-4xl font-bold tracking-tight">MATAC.</h2>
          <p className="mt-2 text-[10px] uppercase tracking-wide text-slate-200">
            {t("portal.brandSubtitle", "Aménagement du territoire & urbanisme")}
          </p>
          <div className="mt-2 h-0.5 w-10" style={{ backgroundColor: GREEN }} />
        </div>

        <div className="my-10">
          <p className="max-w-sm text-xl font-medium leading-relaxed lg:text-2xl">
            {t("portal.sideDescription")}
          </p>

          <div className="mt-8 rounded-xl border border-white/30 bg-white/10 p-5 backdrop-blur-md">
            <p className="text-[10px] uppercase tracking-wide text-slate-100">
              {t("portal.statistics", "Métriques du système")}
            </p>
            <div className="mt-3 flex justify-between gap-6">
              {METRICS.map((m) => (
                <div key={m.key}>
                  <div className="text-3xl font-semibold">{m.value}</div>
                  <div className="text-[11px] text-slate-100">
                    {t(`portal.${m.key}`, m.fallback)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="text-[10px] text-slate-200">
          © {new Date().getFullYear()} MATAC - République de Madagascar
        </p>
      </aside>

      {/* Panneau droit */}
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between px-6 py-5 lg:px-12">
          <span className="text-[11px] font-medium uppercase tracking-wide text-slate-700 dark:text-slate-300">
            {t("portal.overview", "Présentation du portail")}
          </span>
          <div ref={actionsRef} className="flex items-center gap-1">
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setLangOpen((v) => !v);
                  setHelpOpen(false);
                }}
                aria-expanded={langOpen}
                aria-label={t("common.language", "Langue")}
                className={iconBtn}
              >
                <Languages size={16} />
                <span className="uppercase">{currentLang}</span>
              </button>
              {langOpen && (
                <ul
                  role="menu"
                  className="absolute right-0 top-full z-20 mt-2 w-44 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 text-sm shadow-lg dark:border-slate-700 dark:bg-slate-900"
                >
                  {[
                    { code: "mg", label: "Malagasy" },
                    { code: "fr", label: "Français" },
                  ].map((l) => (
                    <li key={l.code} role="none">
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => changeLanguage(l.code)}
                        className={`block w-full px-4 py-2 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 ${
                          currentLang === l.code
                            ? "font-semibold text-[#269745]"
                            : "text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {l.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              className={iconBtn}
              aria-label={dark ? "Activer le thème clair" : "Activer le thème sombre"}
            >
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setHelpOpen((v) => !v);
                  setLangOpen(false);
                }}
                aria-expanded={helpOpen}
                className={iconBtn}
              >
                <CircleHelp size={16} />
                {t("portal.help", "Aide")}
              </button>
              {helpOpen && (
                <div
                  role="dialog"
                  className="absolute right-0 top-full z-20 mt-2 w-72 rounded-lg border border-slate-200 bg-white p-4 text-xs leading-relaxed text-slate-600 shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                >
                  {t(
                    "portal.helpMessage",
                    "Bienvenue sur le portail MATAC. Choisissez une langue ou connectez-vous pour continuer."
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        <section className="flex-1 px-6 pb-10 pt-6 lg:px-12 lg:pt-12">
          <div>
            <p className="mb-3 text-[11px] font-medium uppercase tracking-wide" style={{ color: GREEN }}>
              {t("portal.tagline", "Le service public, simplement.")}
            </p>
            <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-[44px]">
              {t("portal.title1", "Un territoire mieux organisé.")}
              <br />
              {t("portal.title2", "Des démarches plus claires.")}
            </h1>

            <div className="mt-10 divide-y divide-slate-200 dark:divide-slate-800">
              {FEATURES.map(({ key, icon: Icon, title, desc, tags }) => (
                <article key={key} className="flex gap-5 py-6 first:pt-0">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                    style={{ backgroundColor: "rgba(38,151,69,.12)", color: GREEN }}
                  >
                    <Icon size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{t(`portal.${key}Title`, title)}</h3>
                    <p className="mt-1 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                      {t(`portal.${key}Text`, desc)}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {tags.map((tag, i) => (
                        <span
                          key={tag.key}
                          className="rounded-md px-2 py-0.5 text-[11px] font-medium"
                          style={{ backgroundColor: "rgba(38,151,69,.12)", color: "#1e7a38" }}
                        >
                          {t(`portal.${key}Tag${i + 1}`, tag.fallback)}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="border-t border-slate-200 pt-6 dark:border-slate-800">
              <p className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {t("portal.partners", "Nos partenaires institutionnels")}
              </p>
              <ul className="mt-4 grid grid-cols-3 justify-items-center gap-4 sm:grid-cols-5">
                {PARTNERS.map((p) => (
                  <li key={p.label} className="flex flex-col items-center gap-2 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-slate-100 p-2 dark:bg-slate-100">
                      <img src={p.logo} alt={p.label} className="h-full w-full object-contain" />
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">{p.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <footer className="flex items-center justify-between border-t border-slate-200 px-6 py-5 dark:border-slate-800 lg:px-12">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="h-0.5 w-6 rounded" style={{ backgroundColor: GREEN }} />
            <span className="h-0.5 w-3 rounded bg-slate-200 dark:bg-slate-700" />
            <span className="h-0.5 w-3 rounded bg-slate-200 dark:bg-slate-700" />
          </div>
          <div className="flex items-center gap-3">
            {!user && (
              <button
                type="button"
                onClick={registerWithYaho}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-[#269745] dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
              >
                {t("portal.register", "Inscription")}
              </button>
            )}
            <button
              type="button"
              onClick={handleLogin}
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1e7a38] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#269745]"
              style={{ backgroundColor: GREEN }}
            >
              {user ? userName : t("portal.login", "Se connecter")}
              <ArrowRight size={14} />
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default MainContent;