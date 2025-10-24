document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu toggle
  const menuBtn = document.getElementById('menuBtn');
  const navLinks = document.getElementById('navLinks');
  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      const isActive = navLinks.classList.toggle('active');
      menuBtn.setAttribute('aria-expanded', isActive);
      navLinks.setAttribute('aria-hidden', !isActive);
    });
  }

  // Auth modal controls
  const hero = document.getElementById('hero');
  const authSection = document.getElementById('authSection');
  const closeAuth = document.getElementById('closeAuth');
  const shopBtn = document.querySelector('.shop-btn');
  const signinBtn = document.querySelector('.signin-btn');
  const signupBtn = document.querySelector('.signup-btn');
  const authTitle = document.getElementById('authTitle');
  const authForm = document.getElementById('authForm');
  const toggleAuthLink = document.getElementById('toggleAuthLink');

  const openAuth = (mode) => {
    hero.classList.add('slide-out');
    authSection.classList.add('active');
    setTimeout(() => hero.style.display = 'none', 500);
    setMode(mode);
  };

  const closeModal = () => {
    hero.style.display = 'flex';
    hero.classList.remove('slide-out');
    hero.classList.add('slide-in');
    authSection.classList.remove('active');
  };

  const setMode = (mode) => {
    if (mode === 'signup') {
      authTitle.textContent = 'Sign Up';
      authForm.innerHTML = `
        <input type="text" placeholder="Username" required>
        <input type="email" placeholder="Email" required>
        <input type="password" placeholder="Password" required>
        <button type="submit">Create Account</button>
      `;
      toggleAuthLink.textContent = 'Sign In';
    } else {
      authTitle.textContent = 'Sign In';
      authForm.innerHTML = `
        <input type="text" placeholder="Username" required>
        <input type="password" placeholder="Password" required>
        <button type="submit">Login</button>
      `;
      toggleAuthLink.textContent = 'Sign Up';
    }
  };

  shopBtn?.addEventListener('click', (e) => { e.preventDefault(); openAuth('signin'); });
  signinBtn?.addEventListener('click', (e) => { e.preventDefault(); openAuth('signin'); });
  signupBtn?.addEventListener('click', (e) => { e.preventDefault(); openAuth('signup'); });
  closeAuth?.addEventListener('click', closeModal);

  toggleAuthLink?.addEventListener('click', (e) => {
    e.preventDefault();
    setMode(authTitle.textContent === 'Sign In' ? 'signup' : 'signin');
  });
});
