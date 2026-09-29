(() => {
  const body = document.body;
  const header = document.querySelector('[data-header]');
  const progressBar = document.querySelector('#progressBar');
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('[data-nav]');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const setWhatsAppLinks = () => {
    const phone = '5532999153338';
    document.querySelectorAll('[data-wa-message]').forEach((link) => {
      const message = link.getAttribute('data-wa-message') || 'Olá, Jacque! Vim pelo seu mini site.';
      link.href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
      link.target = '_blank';
      link.rel = 'noopener';
    });
  };

  const updateScrollState = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    if (progressBar) progressBar.style.width = `${progress}%`;
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 18);
  };

  const closeMenu = () => {
    if (!menuToggle || !nav) return;
    menuToggle.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
  };

  menuToggle?.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!open));
    menuToggle.classList.toggle('is-open', !open);
    nav?.classList.toggle('is-open', !open);
  });
  nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const observer = new IntersectionObserver((entries, instance) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          instance.unobserve(entry.target);
        }
      });
    }, { threshold: .12 });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  const viewport = document.querySelector('[data-gallery-viewport]');
  const track = document.querySelector('[data-gallery-track]');
  const currentLabel = document.querySelector('[data-gallery-current]');
  const galleryItems = [...document.querySelectorAll('.gallery-item')];
  let autoScroll;
  let currentIndex = 0;
  let isPaused = false;

  const setGalleryIndex = (nextIndex) => {
    if (!viewport || !galleryItems.length) return;
    currentIndex = (nextIndex + galleryItems.length) % galleryItems.length;
    const item = galleryItems[currentIndex];
    const left = item.offsetLeft - 18;
    viewport.scrollTo({ left: Math.max(0, left), behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    if (currentLabel) currentLabel.textContent = String(currentIndex + 1).padStart(2, '0');
  };

  document.querySelector('[data-gallery="prev"]')?.addEventListener('click', () => setGalleryIndex(currentIndex - 1));
  document.querySelector('[data-gallery="next"]')?.addEventListener('click', () => setGalleryIndex(currentIndex + 1));

  const startAutoScroll = () => {
    if (prefersReducedMotion || !viewport || galleryItems.length < 2) return;
    clearInterval(autoScroll);
    autoScroll = window.setInterval(() => {
      if (!isPaused) setGalleryIndex(currentIndex + 1);
    }, 3800);
  };
  const pauseGallery = () => { isPaused = true; };
  const resumeGallery = () => { isPaused = false; };
  viewport?.addEventListener('mouseenter', pauseGallery);
  viewport?.addEventListener('mouseleave', resumeGallery);
  viewport?.addEventListener('focusin', pauseGallery);
  viewport?.addEventListener('focusout', resumeGallery);
  startAutoScroll();

  document.querySelector('#year').textContent = new Date().getFullYear();
  setWhatsAppLinks();
  updateScrollState();
  window.addEventListener('scroll', updateScrollState, { passive: true });
  window.addEventListener('resize', () => setGalleryIndex(currentIndex), { passive: true });
})();
