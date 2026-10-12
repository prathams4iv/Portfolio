/**
 * ===================================================================
 * PRATHAM SRIVASTAVA - PORTFOLIO INTERACTIVITY ENGINE
 * Modern Vanilla JavaScript (ES6+), High Performance, Zero Dependencies
 * ===================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  // -----------------------------------------------------------------
  // 1. THEME & PALETTE CONTROLLER (LIGHT/DARK & BACKGROUND PALETTES)
  // -----------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');
  const body = document.body;
  const html = document.documentElement;
  const STORAGE_KEY = 'pratham-portfolio-theme';
  const PALETTE_KEY = 'pratham-portfolio-palette';

  const getPreferredTheme = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  };

  const applyTheme = (theme) => {
    body.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
  };

  applyTheme(getPreferredTheme());

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = body.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} mode`);
    });
  }

  // Background Palette Switcher
  const paletteBtn = document.getElementById('palette-btn');
  const paletteDropdown = document.getElementById('palette-dropdown');
  const paletteOptions = document.querySelectorAll('.palette-option');

  const applyPalette = (palette) => {
    body.setAttribute('data-palette', palette);
    html.setAttribute('data-palette', palette);
    localStorage.setItem(PALETTE_KEY, palette);
    paletteOptions.forEach((opt) => {
      if (opt.getAttribute('data-color') === palette) {
        opt.classList.add('active');
      } else {
        opt.classList.remove('active');
      }
    });
  };

  const initialPalette = localStorage.getItem(PALETTE_KEY) || 'cyber';
  applyPalette(initialPalette);

  if (paletteBtn && paletteDropdown) {
    paletteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      paletteDropdown.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
      if (!paletteDropdown.contains(e.target) && !paletteBtn.contains(e.target)) {
        paletteDropdown.classList.remove('show');
      }
    });

    paletteOptions.forEach((btn) => {
      btn.addEventListener('click', () => {
        const selectedColor = btn.getAttribute('data-color');
        if (selectedColor) {
          applyPalette(selectedColor);
          paletteDropdown.classList.remove('show');
          const name = btn.querySelector('span:last-child')?.textContent || selectedColor;
          showToast(`Applied ${name} background`);
        }
      });
    });
  }


  // -----------------------------------------------------------------
  // 2. TOAST NOTIFICATION UTILITY
  // -----------------------------------------------------------------
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  let toastTimer = null;

  function showToast(message, duration = 3000) {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = message;
    toast.classList.remove('hidden');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.add('hidden');
    }, duration);
  }


  // -----------------------------------------------------------------
  // 3. COPY TO CLIPBOARD BUTTONS
  // -----------------------------------------------------------------
  const copyButtons = document.querySelectorAll('.copy-email-btn');

  copyButtons.forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const email = btn.getAttribute('data-email') || 'prathamsrivastava63@gmail.com';
      try {
        await navigator.clipboard.writeText(email);
        showToast('Email address copied to clipboard!');
      } catch (err) {
        // Fallback for older environments
        const textArea = document.createElement('textarea');
        textArea.value = email;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast('Email address copied to clipboard!');
      }
    });
  });


  // -----------------------------------------------------------------
  // 4. MOUSE-FOLLOWING SPOTLIGHT GLOW ON CARDS (LINEAR / VERCEL STYLE)
  // -----------------------------------------------------------------
  const glowCards = document.querySelectorAll('.bento-card, .project-item-card, .skill-spec-card, .achieve-banner-card, .cert-sub-card, .form-container-card, .contact-glass-card');

  glowCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });


  // -----------------------------------------------------------------
  // 5. MOBILE DRAWER NAVIGATION
  // -----------------------------------------------------------------
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  const toggleMobileNav = () => {
    const isOpen = navMenu.classList.toggle('open');
    hamburgerBtn.classList.toggle('active', isOpen);
    hamburgerBtn.setAttribute('aria-expanded', isOpen.toString());
  };

  const closeMobileNav = () => {
    if (navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      hamburgerBtn.classList.remove('active');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
    }
  };

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileNav();
    });

    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
        closeMobileNav();
      }
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        closeMobileNav();
      });
    });
  }


  // -----------------------------------------------------------------
  // 6. TYPEWRITER EFFECT IN HERO SECTION
  // -----------------------------------------------------------------
  const typewriterElement = document.getElementById('typewriter');
  const roles = [
    'Front End Developer',
    'B.Tech CSE Student',
    'Python & C Enthusiast',
    'Problem Solver'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  const typeSpeed = 85;
  const deleteSpeed = 40;
  const waitTime = 1800;

  function runTypewriter() {
    if (!typewriterElement) return;

    const currentRole = roles[roleIdx];

    if (isDeleting) {
      charIdx--;
      typewriterElement.textContent = currentRole.substring(0, charIdx);
    } else {
      charIdx++;
      typewriterElement.textContent = currentRole.substring(0, charIdx);
    }

    let delay = isDeleting ? deleteSpeed : typeSpeed;

    if (!isDeleting && charIdx === currentRole.length) {
      delay = waitTime;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      delay = 350;
    }

    setTimeout(runTypewriter, delay);
  }

  runTypewriter();


  // -----------------------------------------------------------------
  // 7. ACTIVE LINK SCROLLSPY
  // -----------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');

  function updateScrollSpy() {
    const scrollPos = window.pageYOffset + 140;

    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      const navLink = document.querySelector(`.nav-link[href="#${id}"]`);

      if (navLink) {
        if (scrollPos >= top && scrollPos < top + height) {
          navLink.classList.add('active');
        } else {
          navLink.classList.remove('active');
        }
      }
    });
  }

  window.addEventListener('scroll', updateScrollSpy, { passive: true });
  updateScrollSpy();


  // -----------------------------------------------------------------
  // 8. INTERACTIVE SKILLS FILTERING
  // -----------------------------------------------------------------
  const skillTabs = document.querySelectorAll('.filter-tab');
  const skillCards = document.querySelectorAll('.skill-spec-card');

  skillTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      skillTabs.forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const filter = tab.getAttribute('data-filter');

      skillCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
          // Re-trigger bar animation if visible
          const bar = card.querySelector('.skill-bar');
          if (bar) {
            const progress = bar.getAttribute('data-progress');
            bar.style.width = progress || '0%';
          }
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });


  // -----------------------------------------------------------------
  // 9. INTERACTIVE PROJECTS FILTERING
  // -----------------------------------------------------------------
  const projectFilterBtns = document.querySelectorAll('.p-filter-btn');
  const projectCards = document.querySelectorAll('.project-item-card');

  projectFilterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      projectFilterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });


  // -----------------------------------------------------------------
  // 10. SCROLL REVEAL & SKILL PROGRESS BARS (INTERSECTION OBSERVER)
  // -----------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal');
  const skillProgressBars = document.querySelectorAll('.skill-bar');

  const activateSkillBars = () => {
    skillProgressBars.forEach((bar) => {
      const val = bar.getAttribute('data-progress');
      if (val) bar.style.width = val;
    });
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          if (entry.target.closest('#education-skills')) {
            activateSkillBars();
          }
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach((el) => observer.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('active'));
    activateSkillBars();
  }


  // -----------------------------------------------------------------
  // 11. BACK TO TOP SCROLL
  // -----------------------------------------------------------------
  const backToTopBtn = document.getElementById('back-to-top');

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }


  // -----------------------------------------------------------------
  // 12. CLIENT-SIDE CONTACT FORM VALIDATION & HANDLING
  // -----------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const formAlert = document.getElementById('form-alert');
  const submitBtn = document.getElementById('submit-btn');

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());
  };

  const markError = (input, errorSpan, msg) => {
    const group = input.closest('.form-input-group');
    if (group) group.classList.add('has-error');
    if (errorSpan) errorSpan.textContent = msg;
  };

  const clearError = (input, errorSpan) => {
    const group = input.closest('.form-input-group');
    if (group) group.classList.remove('has-error');
    if (errorSpan) errorSpan.textContent = '';
  };

  if (contactForm) {
    const nameIn = document.getElementById('contact-name');
    const emailIn = document.getElementById('contact-email');
    const subjectIn = document.getElementById('contact-subject');
    const messageIn = document.getElementById('contact-message');

    const nameErr = document.getElementById('name-error');
    const emailErr = document.getElementById('email-error');
    const subjectErr = document.getElementById('subject-error');
    const messageErr = document.getElementById('message-error');

    nameIn?.addEventListener('input', () => clearError(nameIn, nameErr));
    emailIn?.addEventListener('input', () => clearError(emailIn, emailErr));
    subjectIn?.addEventListener('input', () => clearError(subjectIn, subjectErr));
    messageIn?.addEventListener('input', () => clearError(messageIn, messageErr));

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      // Validate name
      if (!nameIn.value.trim() || nameIn.value.trim().length < 2) {
        markError(nameIn, nameErr, 'Please provide your full name (min 2 characters).');
        valid = false;
      } else {
        clearError(nameIn, nameErr);
      }

      // Validate email
      if (!emailIn.value.trim() || !isValidEmail(emailIn.value.trim())) {
        markError(emailIn, emailErr, 'Please provide a valid email address.');
        valid = false;
      } else {
        clearError(emailIn, emailErr);
      }

      // Validate subject
      if (!subjectIn.value.trim() || subjectIn.value.trim().length < 3) {
        markError(subjectIn, subjectErr, 'Please provide a subject line (min 3 characters).');
        valid = false;
      } else {
        clearError(subjectIn, subjectErr);
      }

      // Validate message
      if (!messageIn.value.trim() || messageIn.value.trim().length < 10) {
        markError(messageIn, messageErr, 'Message must be at least 10 characters.');
        valid = false;
      } else {
        clearError(messageIn, messageErr);
      }

      if (!valid) {
        formAlert.className = 'form-alert-banner alert-error';
        formAlert.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Please resolve the highlighted input fields above.';
        formAlert.classList.remove('hidden');
        return;
      }

      // Visual submission state
      const origBtnContent = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Preparing Message...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = origBtnContent;

        formAlert.className = 'form-alert-banner alert-success';
        formAlert.innerHTML = `<i class="fa-solid fa-circle-check"></i> Thank you, <strong>${encodeURIComponent(nameIn.value.trim())}</strong>! Your message is ready. Opening your default mail client...`;
        formAlert.classList.remove('hidden');

        showToast('Message ready! Redirecting to email client...');

        // Trigger mailto fallback
        const mailtoUri = `mailto:prathamsrivastava63@gmail.com?subject=${encodeURIComponent(subjectIn.value.trim())}&body=${encodeURIComponent("Sender Name: " + nameIn.value.trim() + "\nSender Email: " + emailIn.value.trim() + "\n\nMessage:\n" + messageIn.value.trim())}`;

        setTimeout(() => {
          window.location.href = mailtoUri;
        }, 900);

        contactForm.reset();

        setTimeout(() => {
          formAlert.classList.add('hidden');
        }, 9000);
      }, 600);
    });
  }

});
