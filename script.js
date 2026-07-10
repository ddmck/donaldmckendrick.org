(() => {
  const THEME_STORAGE_KEY = 'donald-theme';
  const root = document.documentElement;
  const body = document.body;
  const themeQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const mobileQuery = window.matchMedia('(max-width: 560px)');
  const themeToggle = document.querySelector('.theme-toggle');

  function readStoredTheme() {
    try {
      const theme = localStorage.getItem(THEME_STORAGE_KEY);
      return theme === 'light' || theme === 'dark' ? theme : null;
    } catch {
      return null;
    }
  }

  function storeTheme(theme) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {}
  }

  function systemTheme() {
    return themeQuery.matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    const isDark = theme === 'dark';
    root.dataset.theme = isDark ? 'dark' : 'light';

    if (!themeToggle) return;

    themeToggle.setAttribute('aria-pressed', String(isDark));
    themeToggle.title = isDark ? 'Switch to light mode' : 'Switch to dark mode';
  }

  const storedTheme = readStoredTheme();
  let hasExplicitTheme = Boolean(storedTheme);

  applyTheme(root.dataset.theme || storedTheme || systemTheme());

  themeToggle?.addEventListener('click', () => {
    const theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    hasExplicitTheme = true;
    applyTheme(theme);
    storeTheme(theme);
  });

  themeQuery.addEventListener('change', (event) => {
    if (!hasExplicitTheme) applyTheme(event.matches ? 'dark' : 'light');
  });

  const header = document.querySelector('.site-header');
  const brand = header?.querySelector('.brand');
  const menuToggle = header?.querySelector('.menu-toggle');
  const navigation = header?.querySelector('.site-nav');
  const main = document.querySelector('main');
  const footer = document.querySelector('.site-footer');

  if (!header || !brand || !menuToggle || !navigation || !main || !footer) return;

  const links = Array.from(navigation.querySelectorAll('a'));

  function setPageInert(inert) {
    main.inert = inert;
    footer.inert = inert;

    if (inert) {
      main.setAttribute('aria-hidden', 'true');
      footer.setAttribute('aria-hidden', 'true');
    } else {
      main.removeAttribute('aria-hidden');
      footer.removeAttribute('aria-hidden');
    }
  }

  function closeMenu({ restoreFocus = false } = {}) {
    body.classList.remove('menu-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open menu');
    setPageInert(false);

    if (restoreFocus) menuToggle.focus();
  }

  function openMenu() {
    if (!mobileQuery.matches) return;

    body.classList.add('menu-open');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Close menu');
    setPageInert(true);
    links[0]?.focus();
  }

  menuToggle.addEventListener('click', () => {
    if (body.classList.contains('menu-open')) {
      closeMenu({ restoreFocus: true });
    } else {
      openMenu();
    }
  });

  navigation.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (!link) return;

    closeMenu({ restoreFocus: link.target === '_blank' });
  });

  document.addEventListener('keydown', (event) => {
    if (!body.classList.contains('menu-open')) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu({ restoreFocus: true });
      return;
    }

    if (event.key !== 'Tab') return;

    const focusable = [brand, themeToggle, menuToggle, ...links].filter(Boolean);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  mobileQuery.addEventListener('change', (event) => {
    if (!event.matches) closeMenu();
  });

  function prepareClosedMenu() {
    root.classList.remove('menu-ready');
    closeMenu();
    window.requestAnimationFrame(() => root.classList.add('menu-ready'));
  }

  window.addEventListener('pageshow', prepareClosedMenu);
  prepareClosedMenu();
})();
