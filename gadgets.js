document.addEventListener('DOMContentLoaded', () => {
  /* =====================
     MOBILE NAV MENU
  ===================== */
  const menuBtn = document.getElementById('menuBtn');
  const navLinks = document.getElementById('navLinks');

  const closeMenu = () => {
    navLinks.classList.remove('active');
    menuBtn.setAttribute('aria-expanded', 'false');
    navLinks.setAttribute('aria-hidden', 'true');
  };

  if (menuBtn && navLinks) {
    // Toggle dropdown
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = navLinks.classList.toggle('active');
      menuBtn.setAttribute('aria-expanded', isActive);
      navLinks.setAttribute('aria-hidden', !isActive);
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !menuBtn.contains(e.target)) {
        closeMenu();
      }
    });

    // Close menu with ESC key
    document.addEventListener('keyup', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* =====================
     AUTH MODAL LOGIC
  ===================== */
  const hero = document.getElementById('hero');
  const authSection = document.getElementById('authSection');
  const closeAuth = document.getElementById('closeAuth');
  const shopBtn = document.querySelector('.shop-btn');
  const signinBtn = document.querySelector('.signin-btn');
  const signupBtn = document.querySelector('.signup-btn');
  const authTitle = document.getElementById('authTitle');
  const authForm = document.getElementById('authForm');
  const toggleAuthLink = document.getElementById('toggleAuthLink');

  let currentMode = 'signin';

  const setAuthMode = (mode) => {
    currentMode = mode;
    const isSignup = mode === 'signup';

    authTitle.textContent = isSignup ? 'Sign Up' : 'Sign In';
    toggleAuthLink.textContent = isSignup ? 'Sign In' : 'Sign Up';

    authForm.innerHTML = isSignup
      ? `
        <input type="text" placeholder="Username" required>
        <input type="email" placeholder="Email" required>
        <input type="password" placeholder="Password" required>
        <button type="submit">Create Account</button>
      `
      : `
        <input type="text" placeholder="Username" required>
        <input type="password" placeholder="Password" required>
        <button type="submit">Login</button>
      `;
  };

  const openAuthModal = (mode = 'signin') => {
    setAuthMode(mode);
    hero.classList.add('slide-out');
    authSection.classList.add('active');

    // hide hero after slide animation
    setTimeout(() => (hero.style.display = 'none'), 500);
  };

  const closeAuthModal = () => {
    hero.style.display = 'flex';
    hero.classList.remove('slide-out');
    hero.classList.add('slide-in');
    authSection.classList.remove('active');
  };

  // Event Listeners for opening
  [shopBtn, signinBtn, signupBtn].forEach((btn) => {
    btn?.addEventListener('click', (e) => {
      e.preventDefault();
      openAuthModal(btn.classList.contains('signup-btn') ? 'signup' : 'signin');
    });
  });

  // Close modal
  closeAuth?.addEventListener('click', closeAuthModal);

  // Switch between sign-in / sign-up
  toggleAuthLink?.addEventListener('click', (e) => {
    e.preventDefault();
    setAuthMode(currentMode === 'signin' ? 'signup' : 'signin');
  });

  // Redirect on form submit
  authForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitBtn = authForm.querySelector('button');
    submitBtn.textContent = currentMode === 'signup' ? 'Creating...' : 'Logging in...';
    submitBtn.disabled = true;

    setTimeout(() => {
      window.location.href = 'pages/home.html';
    }, 1000);
  });
});
