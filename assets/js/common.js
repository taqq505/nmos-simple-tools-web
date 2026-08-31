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

  // Screenshot carousel: arrow buttons + dots, synced to manual scroll/swipe.
  document.querySelectorAll('.screenshot-carousel').forEach((carousel) => {
    const track = carousel.querySelector('.screenshot-carousel__track');
    const slides = Array.from(track.children);
    if (slides.length <= 1) {
      carousel.classList.add('screenshot-carousel--single');
      return;
    }

    const prevBtn = carousel.querySelector('.screenshot-carousel__btn--prev');
    const nextBtn = carousel.querySelector('.screenshot-carousel__btn--next');
    const dotsWrap = carousel.querySelector('.screenshot-carousel__dots');

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'screenshot-carousel__dot' + (i === 0 ? ' is-active' : '');
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });
    const dots = Array.from(dotsWrap.children);

    function currentIndex() {
      return Math.round(track.scrollLeft / track.clientWidth);
    }

    function goTo(i) {
      const clamped = Math.max(0, Math.min(slides.length - 1, i));
      track.scrollTo({ left: clamped * track.clientWidth, behavior: 'smooth' });
    }

    function updateActive() {
      const i = currentIndex();
      dots.forEach((d, di) => d.classList.toggle('is-active', di === i));
      prevBtn.disabled = i === 0;
      nextBtn.disabled = i === slides.length - 1;
    }

    prevBtn.addEventListener('click', () => goTo(currentIndex() - 1));
    nextBtn.addEventListener('click', () => goTo(currentIndex() + 1));
    track.addEventListener('scroll', () => {
      window.clearTimeout(track._scrollTimer);
      track._scrollTimer = window.setTimeout(updateActive, 80);
    }, { passive: true });

    updateActive();
  });
})();

// ─── Cookie Consent (Google Consent Mode v2) + Google Analytics ───
(function () {
  var STORAGE_KEY = 'nmos_cookie_consent'; // 'granted' | 'denied'
  var GA_MEASUREMENT_ID = 'G-MCJQKLR5P4';

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  // Default: deny non-essential storage until the visitor chooses.
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied'
  });

  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID);

  // Load gtag.js itself. It reads the queued consent/config commands above
  // once it arrives, so this can be appended any time after they're queued.
  var gaScript = document.createElement('script');
  gaScript.async = true;
  gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
  document.head.appendChild(gaScript);

  function getConsent() {
    try { return window.localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }

  function setConsent(value) {
    try { window.localStorage.setItem(STORAGE_KEY, value); } catch (e) {}
    gtag('consent', 'update', {
      ad_storage: value === 'granted' ? 'granted' : 'denied',
      ad_user_data: value === 'granted' ? 'granted' : 'denied',
      ad_personalization: value === 'granted' ? 'granted' : 'denied',
      analytics_storage: value === 'granted' ? 'granted' : 'denied'
    });
  }

  // Re-apply a stored choice on every page load (consent 'default' above always starts denied).
  var stored = getConsent();
  if (stored === 'granted' || stored === 'denied') setConsent(stored);

  function privacyHref() {
    var m = window.location.pathname.match(/^(.*\/(ja|en)\/)/);
    return m ? m[1] + 'privacy/' : '/en/privacy/';
  }

  var isJa = document.documentElement.lang === 'ja';
  var COPY = isJa ? {
    text: 'このサイトはアクセス解析のためにCookieを使用します。詳細は<a href="' + privacyHref() + '">プライバシーポリシー</a>をご覧ください。',
    accept: '同意する',
    decline: '拒否する'
  } : {
    text: 'This site uses cookies for analytics. See our <a href="' + privacyHref() + '">Privacy Policy</a> for details.',
    accept: 'Accept',
    decline: 'Decline'
  };

  var banner = null;

  function showBanner() {
    if (banner) return;
    banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.innerHTML =
      '<div class="cookie-banner__inner">' +
        '<p class="cookie-banner__text">' + COPY.text + '</p>' +
        '<div class="cookie-banner__actions">' +
          '<button type="button" data-action="decline">' + COPY.decline + '</button>' +
          '<button type="button" class="cookie-banner__accept" data-action="accept">' + COPY.accept + '</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(banner);
    banner.addEventListener('click', function (e) {
      var action = e.target.getAttribute('data-action');
      if (!action) return;
      setConsent(action === 'accept' ? 'granted' : 'denied');
      hideBanner();
    });
  }

  function hideBanner() {
    if (!banner) return;
    banner.remove();
    banner = null;
  }

  if (!stored) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', showBanner);
    } else {
      showBanner();
    }
  }

  // Exposed so the Privacy Policy page can offer a "change my choice" control.
  window.NMOSCookieConsent = {
    get: getConsent,
    set: setConsent,
    reopen: function () { hideBanner(); showBanner(); }
  };
})();
