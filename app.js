/* ========== FOOTER REVEAL (margin-bottom sync) ========== */
const pageContent = document.querySelector('.page-content');
const siteFooter = document.querySelector('.site-footer');
function syncFooterSpace() {
  if (pageContent && siteFooter) {
    pageContent.style.marginBottom = siteFooter.offsetHeight + 'px';
  }
}
syncFooterSpace();
window.addEventListener('resize', syncFooterSpace, { passive: true });
document.fonts?.ready?.then(syncFooterSpace);

/* ========== HERO VIDEO FALLBACK ========== */
const heroVideo = document.querySelector('.hero-video');
if (heroVideo) {
  heroVideo.addEventListener('playing', () => heroVideo.classList.add('is-playing'));
  heroVideo.addEventListener('error', () => heroVideo.style.display = 'none');
}

/* ========== MOBILE NAV ========== */
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  mainNav.classList.toggle('open');
  document.body.style.overflow = mainNav.classList.contains('open') ? 'hidden' : '';
});

mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    if (mainNav.classList.contains('open')) {
      navToggle.classList.remove('active');
      mainNav.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
});

/* ========== REVEAL ON SCROLL (single observer for all .reveal elements) ========== */
(function() {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  // Homepage auto-reveal elements
  document.querySelectorAll(
    '.section-eyebrow, .section-title, .section-sub, .mission-text, .mission-images, .number-card, .program-tile, .map-wrap, .cta-inner'
  ).forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });

  // Subpage .reveal elements
  document.querySelectorAll('.reveal:not(.visible)').forEach(el => revealObserver.observe(el));

  // Safety fallback
  setTimeout(() => {
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => el.classList.add('visible'));
  }, 4000);
})();

/* ========== MISSION IMAGE CYCLE ========== */
(function() {
  const imgs = document.querySelectorAll('.mission-img');
  if (imgs.length < 2) return;
  let current = 0;
  setInterval(() => {
    imgs[current].classList.remove('active');
    current = (current + 1) % imgs.length;
    imgs[current].classList.add('active');
  }, 3500);
})();

/* ========== PROGRAM TILE IMAGE CYCLING ========== */
(function() {
  const tiles = document.querySelectorAll('.program-tile');
  tiles.forEach((tile, tileIndex) => {
    const imgs = tile.querySelectorAll('.program-img');
    if (imgs.length < 2) return;
    let current = 0;
    const baseInterval = 2800;
    const offset = tileIndex * 700;
    setTimeout(() => {
      setInterval(() => {
        imgs[current].classList.remove('active');
        current = (current + 1) % imgs.length;
        imgs[current].classList.add('active');
      }, baseInterval);
    }, offset);
  });
})();

/* ========== BY THE NUMBERS — COUNTING ANIMATION ========== */
(function() {
  const numberValues = document.querySelectorAll('.number-value');
  let counted = false;

  function animateNumbers() {
    if (counted) return;
    counted = true;
    numberValues.forEach(el => {
      const target = parseInt(el.dataset.target, 10);
      const start = parseInt(el.dataset.start || '0', 10);
      const suffix = el.dataset.suffix || '';
      const duration = 2200;
      const startTime = performance.now();
      function easeOutExpo(t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); }
      function step(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentValue = Math.round(start + easeOutExpo(progress) * (target - start));
        el.textContent = currentValue.toLocaleString('en-US') + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  const numbersSections = document.querySelectorAll('#numbers, #aboutNumbers');
  numbersSections.forEach(section => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { animateNumbers(); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.3 });
    obs.observe(section);
  });
})();

/* ========== PROGRAM PAGE — STAT COUNTERS ========== */
(function() {
  const programStats = document.querySelectorAll('.program-stat-value');
  if (!programStats.length) return;
  let counted = false;

  function animateProgramNumbers() {
    if (counted) return;
    counted = true;
    programStats.forEach(el => {
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 2200;
      const startTime = performance.now();
      function easeOutExpo(t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); }
      function step(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        el.textContent = Math.round(easeOutExpo(progress) * target).toLocaleString('en-US') + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  const section = document.querySelector('#programNumbers');
  if (section) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { animateProgramNumbers(); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.3 });
    obs.observe(section);
  }
})();

/* ========== FOCUS AREA CARD — MINI STAT COUNTERS ========== */
(function() {
  const miniCounts = document.querySelectorAll('.mini-stat-count');
  if (!miniCounts.length) return;

  function animateMiniCount(el) {
    if (el.dataset.counted) return;
    el.dataset.counted = '1';
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const startTime = performance.now();
    function easeOutExpo(t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); }
    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      el.textContent = Math.round(easeOutExpo(progress) * target).toLocaleString('en-US') + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.mini-stat-count').forEach(animateMiniCount);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.program-area-card').forEach(card => obs.observe(card));
})();

/* ========== UNIFIED SCROLL HANDLER (rAF-throttled) ========== */
(function() {
  const header = document.getElementById('header');
  const missionStack = document.querySelector('.mission-img-stack');
  const missionImgs = missionStack ? missionStack.querySelectorAll('.mission-img') : [];
  const timeline = document.querySelector('.timeline');
  const timelineSection = document.querySelector('.timeline-section');

  // Pre-cache scroll-text sections and their lines
  const scrollTextData = [];
  document.querySelectorAll('.scroll-text-section').forEach(section => {
    const lines = section.querySelectorAll('.scroll-text-line');
    if (lines.length) scrollTextData.push({ section, lines });
  });

  // Timeline items (one-time setup)
  if (timeline && timelineSection) {
    const items = timeline.querySelectorAll('.timeline-item');
    const tlObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('tl-visible');
          tlObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -60px 0px' });
    items.forEach((item, i) => {
      item.style.transitionDelay = `${i * 0.08}s`;
      item.querySelector('.timeline-dot').style.transitionDelay = `${i * 0.08 + 0.1}s`;
      item.querySelector('.timeline-card').style.transitionDelay = `${i * 0.08 + 0.2}s`;
      tlObserver.observe(item);
    });
  }

  let ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const vh = window.innerHeight;

      // Header scroll state
      if (header) header.classList.toggle('scrolled', window.scrollY > 60);

      // Mission image parallax
      if (missionStack && missionImgs.length) {
        const rect = missionStack.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, 1 - rect.bottom / (vh + rect.height)));
        const yShift = 16 * (0.5 - progress);
        missionImgs.forEach(img => { img.style.transform = `translateY(${yShift}%)`; });
      }

      // Scroll-text reveal (reversible)
      // Progress tracks how far the user has scrolled THROUGH the section,
      // not just when the top enters the viewport.
      scrollTextData.forEach(({ section, lines }) => {
        const rect = section.getBoundingClientRect();
        // How far the section has scrolled past the viewport top
        // 0 = section top just reached 80% down the viewport
        // 1 = section bottom just reached 20% up the viewport
        const scrolledPast = (vh * 0.8) - rect.top;
        const totalTravel = rect.height - (vh * 0.4);
        const progress = Math.min(1, Math.max(0, scrolledPast / totalTravel));
        const revealCount = Math.round(progress * lines.length);
        lines.forEach((line, i) => {
          line.classList.toggle('highlighted', i < revealCount);
        });
      });

      // Timeline line progress
      if (timeline && timelineSection) {
        const rect = timelineSection.getBoundingClientRect();
        const scrolledInto = vh - rect.top;
        const totalScroll = rect.height + vh * 0.3;
        const progress = Math.min(Math.max(scrolledInto / totalScroll, 0), 1) * 100;
        timeline.style.setProperty('--tl-progress', progress + '%');
        if (progress > 0) timeline.classList.add('tl-active');
      }

      ticking = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ========== INTERACTIVE MAP (LEAFLET) ========== */
(function() {
  const mapEl = document.getElementById('map');
  if (!mapEl) return;

  const map = L.map('map', {
    center: [11.0, -71.5],
    zoom: 7,
    scrollWheelZoom: true,
    zoomControl: true
  });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
    maxZoom: 19
  }).addTo(map);

  const blueIcon = L.divIcon({
    className: 'map-marker',
    html: '<div class="marker-dot"></div><div class="marker-pulse"></div>',
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });

  const locations = [
    { name: 'Mara, Zulia', desc: 'Main operations hub — education, agriculture, water distribution, and community programs.', coords: [10.95, -71.75] },
    { name: 'Maracaibo, Venezuela', desc: 'Coordination center for humanitarian aid and logistics.', coords: [10.6544, -71.6370] },
    { name: 'La Guajira, Colombia', desc: 'Cross-border programs serving Wayuu communities on the Colombian side.', coords: [11.75, -72.35] },
    { name: 'Apüna Farm', desc: 'Sustainable agroecology farm producing food for local communities.', coords: [10.80, -71.60] },
    { name: 'Mirabello Farm', desc: 'Second agricultural site supporting the food security program.', coords: [10.88, -71.68] }
  ];

  locations.forEach(loc => {
    L.marker(loc.coords, { icon: blueIcon }).addTo(map)
      .bindPopup(`<div class="map-popup"><strong>${loc.name}</strong><p>${loc.desc}</p></div>`);
  });

  const group = L.featureGroup(locations.map(l => L.marker(l.coords)));
  map.fitBounds(group.getBounds().pad(0.3));
})();

/* ========== WORD CARD AUDIO PRONUNCIATION ========== */
(function () {
  const audioCards = document.querySelectorAll('.word-card--audio');
  if (!audioCards.length) return;
  let currentAudio = null;

  audioCards.forEach(card => {
    const src = card.dataset.audio;
    const btn = card.querySelector('.word-listen');
    if (!src || !btn) return;

    btn.addEventListener('click', () => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        document.querySelectorAll('.word-listen.playing').forEach(b => b.classList.remove('playing'));
      }
      const audio = new Audio(src);
      currentAudio = audio;
      btn.classList.add('playing');
      audio.addEventListener('ended', () => { btn.classList.remove('playing'); currentAudio = null; });
      audio.addEventListener('error', () => { btn.classList.remove('playing'); currentAudio = null; });
      audio.play().catch(() => { btn.classList.remove('playing'); currentAudio = null; });
    });
  });
})();

/* ========== REVEAL CARDS — TAP TO TOGGLE ON TOUCH ========== */
(function () {
  const cards = document.querySelectorAll('.reveal-card');
  if (!cards.length) return;

  cards.forEach(function (card) {
    card.addEventListener('click', function (e) {
      if (!matchMedia('(pointer: coarse)').matches) return;
      e.preventDefault();
      const wasActive = card.classList.contains('active');
      cards.forEach(function (c) { c.classList.remove('active'); });
      if (!wasActive) card.classList.add('active');
    });
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.reveal-card')) {
      cards.forEach(function (c) { c.classList.remove('active'); });
    }
  });
})();

/* ========== CHALLENGE CARD TAP-TO-REVEAL (touch devices) ========== */
(function () {
  var cards = document.querySelectorAll('.challenge-card');
  if (!cards.length) return;

  cards.forEach(function (card) {
    card.addEventListener('click', function () {
      var isActive = card.classList.contains('active');
      cards.forEach(function (c) { c.classList.remove('active'); });
      if (!isActive) card.classList.add('active');
    });
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.challenge-card')) {
      cards.forEach(function (c) { c.classList.remove('active'); });
    }
  });
})();
