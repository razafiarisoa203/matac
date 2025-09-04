export const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

export const handleNavClick = (e, sectionId) => {
  e.preventDefault();
  scrollToSection(sectionId);
  // Fermer le menu mobile si ouvert
  const mobileMenu = document.querySelector('.mobile-menu-button');
  if (mobileMenu && mobileMenu.getAttribute('aria-expanded') === 'true') {
    mobileMenu.click();
  }
};
