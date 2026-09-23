(() => {
  const header = document.querySelector('.masthead');
  const toggle = header?.querySelector('.nav-toggle');
  const nav = header?.querySelector('#site-nav');
  if (!toggle || !nav) return;

  const mobile = window.matchMedia('(max-width: 47rem)');
  const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';
  const setOpen = (open, restoreFocus = false) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
    if (restoreFocus) toggle.focus();
  };

  toggle.addEventListener('click', () => setOpen(!isOpen()));
  nav.addEventListener('click', (event) => {
    if (mobile.matches && event.target.closest('a')) setOpen(false, true);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && mobile.matches && isOpen()) {
      event.preventDefault();
      setOpen(false, true);
    }
  });
  document.addEventListener('click', (event) => {
    if (mobile.matches && isOpen() && !header.contains(event.target)) {
      setOpen(false, nav.contains(document.activeElement));
    }
  });
  header.addEventListener('focusout', (event) => {
    if (mobile.matches && !header.contains(event.relatedTarget)) setOpen(false);
  });
  mobile.addEventListener('change', () => {
    const active = document.activeElement;
    setOpen(false);
    if (mobile.matches && nav.contains(active)) toggle.focus();
    if (!mobile.matches && active === toggle) nav.querySelector('a')?.focus();
  });
  window.addEventListener('pageshow', () => setOpen(false));
  header.setAttribute('data-nav-ready', '');
})();
