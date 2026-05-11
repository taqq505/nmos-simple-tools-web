(function () {
  // Scroll reveal
  const observer = new IntersectionObserver(
    (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
    { threshold: 0.08, rootMargin: '0px 0px -32px 0px' }
  );
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Nav: highlight active anchor on scroll
  const navLinks = document.querySelectorAll('.nav__links a[href^="#"]');
  if (navLinks.length) {
    const sections = Array.from(navLinks).map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
    const onScroll = () => {
      const y = window.scrollY + 80;
      let active = sections[0];
      sections.forEach(s => { if (s.offsetTop <= y) active = s; });
      navLinks.forEach(a => a.classList.toggle('nav-active', a.getAttribute('href') === '#' + active.id));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }
})();
