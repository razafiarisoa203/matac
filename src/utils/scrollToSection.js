// utils/scrollToSection.js
export const handleNavClick = (e, id) => {
  e.preventDefault();
  const element = document.getElementById(id);
  if (element) {
    // Calculer la position en prenant en compte la navbar fixe
    const offsetTop = element.offsetTop - 80; // 80px pour la hauteur de la navbar
    window.scrollTo({
      top: offsetTop,
      behavior: "smooth"
    });
  }
};