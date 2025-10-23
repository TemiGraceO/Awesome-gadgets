// dropdown toggle - uses class toggle so CSS animations remain intact
document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.getElementById('menuBtn');
  const navLinks = document.getElementById('navLinks');

  if (!menuBtn || !navLinks) return;

  menuBtn.addEventListener('click', () => {
    const isActive = navLinks.classList.toggle('active');
    // accessibility attributes
    menuBtn.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    navLinks.setAttribute('aria-hidden', isActive ? 'false' : 'true');
  });

  // close menu if clicking outside (mobile)
  document.addEventListener('click', (e) => {
    if (!navLinks.classList.contains('active')) return;
    if (e.target === menuBtn || navLinks.contains(e.target)) return;
    navLinks.classList.remove('active');
    menuBtn.setAttribute('aria-expanded', 'false');
    navLinks.setAttribute('aria-hidden', 'true');
  });

  // close menu on ESC
  document.addEventListener('keyup', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('active')) {
      navLinks.classList.remove('active');
      menuBtn.setAttribute('aria-expanded', 'false');
      navLinks.setAttribute('aria-hidden', 'true');
    }
  });
});
