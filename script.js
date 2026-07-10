(() => {
  const mobileQuery = window.matchMedia('(max-width: 560px)');
  const root = document.documentElement;
  const body = document.body;
  const header = document.querySelector('.site-header');
  const brand = header?.querySelector('.brand');
  const toggle = header?.querySelector('.menu-toggle');
  const navigation = header?.querySelector('.site-nav');
  const main = document.querySelector('main');
  const footer = document.querySelector('.site-footer');

  if (!header || !brand || !toggle || !navigation || !main || !footer) return;

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
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    setPageInert(false);

    if (restoreFocus) toggle.focus();
  }

  function openMenu() {
    if (!mobileQuery.matches) return;

    body.classList.add('menu-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
    setPageInert(true);
    links[0]?.focus();
  }

  toggle.addEventListener('click', () => {
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

    const focusable = [brand, toggle, ...links];
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
