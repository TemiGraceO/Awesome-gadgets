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
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = navLinks.classList.toggle('active');
      menuBtn.setAttribute('aria-expanded', isActive);
      navLinks.setAttribute('aria-hidden', !isActive);
    });

    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !menuBtn.contains(e.target)) closeMenu();
    });

    document.addEventListener('keyup', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* =====================
     AUTH LOGIC
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
  let users = JSON.parse(localStorage.getItem('awesomeUsers')) || [];

  const setAuthMode = (mode) => {
    currentMode = mode;
    const isSignup = mode === 'signup';

    authTitle.textContent = isSignup ? 'Sign Up' : 'Sign In';
    toggleAuthLink.textContent = isSignup ? 'Sign In' : 'Sign Up';

    authForm.innerHTML = isSignup
      ? `
        <input type="text" id="username" placeholder="Username" required>
        <input type="email" id="email" placeholder="Email" required>
        <input type="password" id="password" placeholder="Password" required>
        <button type="submit">Create Account</button>
      `
      : `
        <input type="text" id="username" placeholder="Username" required>
        <input type="password" id="password" placeholder="Password" required>
        <button type="submit">Login</button>
      `;
  };

  const openAuthModal = (mode = 'signin') => {
    setAuthMode(mode);
    hero.classList.add('slide-out');
    authSection.classList.add('active');
    setTimeout(() => (hero.style.display = 'none'), 500);
  };

  const closeAuthModal = () => {
    hero.style.display = 'flex';
    hero.classList.remove('slide-out');
    hero.classList.add('slide-in');
    authSection.classList.remove('active');
  };

  [shopBtn, signinBtn, signupBtn].forEach((btn) => {
    btn?.addEventListener('click', (e) => {
      e.preventDefault();
      openAuthModal(btn.classList.contains('signup-btn') ? 'signup' : 'signin');
    });
  });

  closeAuth?.addEventListener('click', closeAuthModal);

  toggleAuthLink?.addEventListener('click', (e) => {
    e.preventDefault();
    setAuthMode(currentMode === 'signin' ? 'signup' : 'signin');
  });

  /* =====================
     AUTH FORM SUBMISSION
  ===================== */
  authForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = authForm.querySelector('#username').value.trim();
    const password = authForm.querySelector('#password').value.trim();
    const emailInput = authForm.querySelector('#email');
    const email = emailInput ? emailInput.value.trim() : null;

    let message = '';
    const submitBtn = authForm.querySelector('button');
    submitBtn.disabled = true;
    submitBtn.textContent = currentMode === 'signup' ? 'Creating...' : 'Logging in...';

    setTimeout(() => {
      if (currentMode === 'signup') {
        const existing = users.find(u => u.username === username);
        if (existing) {
          message = '⚠️ Username already exists.';
        } else {
          users.push({ username, email, password });
          localStorage.setItem('awesomeUsers', JSON.stringify(users));
          message = '✅ Account created successfully! Please sign in.';
          setAuthMode('signin');
        }
      } else {
        const found = users.find(u => u.username === username && u.password === password);
        if (found) {
          message = `🎉 Welcome back, ${found.username}! Redirecting...`;
          localStorage.setItem('awesomeLoggedUser', JSON.stringify(found));
          setTimeout(() => {
            window.location.href = 'pages/home.html';
          }, 1000);
        } else {
          message = '❌ Invalid username or password.';
        }
      }

      alert(message);
      submitBtn.disabled = false;
      submitBtn.textContent = currentMode === 'signup' ? 'Create Account' : 'Login';
    }, 800);
  });
});
