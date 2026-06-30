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

/* ========== HEADER SCROLL STATE ========== */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ========== MOBILE NAV ========== */
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  mainNav.classList.toggle('open');
  document.body.style.overflow = mainNav.classList.contains('open') ? 'hidden' : '';
});

// Close mobile nav on link click
mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    if (mainNav.classList.contains('open')) {
      navToggle.classList.remove('active');
      mainNav.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
});

/* ========== REVEAL ON SCROLL ========== */
const revealElements = document.querySelectorAll(
  '.section-eyebrow, .section-title, .section-sub, .mission-text, .mission-images, .number-card, .program-tile, .map-wrap, .cta-inner'
);

revealElements.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

// Safety fallback
setTimeout(() => {
  document.querySelectorAll('.reveal:not(.visible)').forEach(el => el.classList.add('visible'));
}, 4000);

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

/* ========== MISSION IMAGE PARALLAX ========== */
(function() {
  const stack = document.querySelector('.mission-img-stack');
  if (!stack) return;
  const imgs = stack.querySelectorAll('.mission-img');
  function updateParallax() {
    const rect = stack.getBoundingClientRect();
    const vh = window.innerHeight;
    // progress: 0 when section enters bottom, 1 when it exits top
    const progress = 1 - (rect.bottom / (vh + rect.height));
    const clamped = Math.max(0, Math.min(1, progress));
    // Shift from +8% to -8% as you scroll through
    const yShift = 16 * (0.5 - clamped); // range: +8 to -8
    imgs.forEach(img => {
      img.style.transform = `translateY(${yShift}%)`;
    });
  }
  window.addEventListener('scroll', updateParallax, { passive: true });
  updateParallax();
})();

/* ========== PROGRAM TILE IMAGE CYCLING ========== */
(function() {
  const tiles = document.querySelectorAll('.program-tile');
  tiles.forEach((tile, tileIndex) => {
    const imgs = tile.querySelectorAll('.program-img');
    if (imgs.length < 2) return;
    let current = 0;
    // Stagger each tile's interval so they don't all change at once
    const baseInterval = 2800;
    const offset = tileIndex * 700; // 700ms stagger between tiles
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

      // Format large numbers with commas
      function formatNumber(n) {
        return n.toLocaleString('en-US');
      }

      function easeOutExpo(t) {
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      }

      function step(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutExpo(progress);
        const currentValue = Math.round(start + easedProgress * (target - start));

        el.textContent = formatNumber(currentValue) + suffix;

        if (progress < 1) {
          requestAnimationFrame(step);
        }
      }

      requestAnimationFrame(step);
    });
  }

  // Observe any numbers section (homepage or subpages)
  const numbersSections = document.querySelectorAll('#numbers, #aboutNumbers');
  numbersSections.forEach(section => {
    const numbersObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateNumbers();
          numbersObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    numbersObserver.observe(section);
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
      function formatNumber(n) { return n.toLocaleString('en-US'); }
      function easeOutExpo(t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); }
      function step(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentValue = Math.round(easeOutExpo(progress) * target);
        el.textContent = formatNumber(currentValue) + suffix;
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
    function formatNumber(n) { return n.toLocaleString('en-US'); }
    function easeOutExpo(t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); }
    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      el.textContent = formatNumber(Math.round(easeOutExpo(progress) * target)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Animate all mini-stat-count elements within this card
        entry.target.querySelectorAll('.mini-stat-count').forEach(animateMiniCount);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.program-area-card').forEach(card => obs.observe(card));
})();

/* ========== SCROLL-HIGHLIGHT TEXT (dark section, line-by-line) ========== */
(function() {
  const scrollSections = document.querySelectorAll('.scroll-text-section');
  if (!scrollSections.length) return;

  scrollSections.forEach(section => {
    const lines = section.querySelectorAll('.scroll-text-line');
    if (!lines.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Animate lines one by one
          lines.forEach((line, i) => {
            setTimeout(() => {
              line.classList.add('highlighted');
            }, i * 300);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    observer.observe(section);
  });
})();

/* ========== TIMELINE SCROLL ANIMATION ========== */
(function() {
  const timeline = document.querySelector('.timeline');
  if (!timeline) return;

  const items = timeline.querySelectorAll('.timeline-item');
  if (!items.length) return;

  // Stagger each item with IntersectionObserver
  const tlObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('tl-visible');
        tlObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -60px 0px' });

  items.forEach((item, i) => {
    // Add staggered delay so they cascade one after another
    item.style.transitionDelay = `${i * 0.08}s`;
    item.querySelector('.timeline-dot').style.transitionDelay = `${i * 0.08 + 0.1}s`;
    item.querySelector('.timeline-card').style.transitionDelay = `${i * 0.08 + 0.2}s`;
    tlObserver.observe(item);
  });

  // Draw the vertical line progressively as user scrolls through the section
  const section = document.querySelector('.timeline-section');
  function updateLineProgress() {
    const rect = section.getBoundingClientRect();
    const sectionTop = rect.top;
    const sectionHeight = rect.height;
    const viewportHeight = window.innerHeight;

    // Calculate how far through the section we've scrolled
    const scrolledInto = viewportHeight - sectionTop;
    const totalScroll = sectionHeight + viewportHeight * 0.3;
    const progress = Math.min(Math.max(scrolledInto / totalScroll, 0), 1) * 100;

    timeline.style.setProperty('--tl-progress', progress + '%');

    if (progress > 0 && !timeline.classList.contains('tl-active')) {
      timeline.classList.add('tl-active');
    }
  }

  window.addEventListener('scroll', updateLineProgress, { passive: true });
  updateLineProgress(); // Initial check
})();

/* ========== ALSO REVEAL .reveal ELEMENTS INSIDE SUBPAGES ========== */
(function() {
  const subpageReveals = document.querySelectorAll('.reveal:not(.visible)');
  if (!subpageReveals.length) return;

  const revObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  subpageReveals.forEach(el => revObs.observe(el));
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

  // Light tile layer
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
    maxZoom: 19
  }).addTo(map);

  // Custom marker icon
  const blueIcon = L.divIcon({
    className: 'map-marker',
    html: '<div class="marker-dot"></div><div class="marker-pulse"></div>',
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });

  // Locations
  const locations = [
    {
      name: 'Mara, Zulia',
      desc: 'Main operations hub — education, agriculture, water distribution, and community programs.',
      coords: [10.95, -71.75]
    },
    {
      name: 'Maracaibo, Venezuela',
      desc: 'Coordination center for humanitarian aid and logistics.',
      coords: [10.6544, -71.6370]
    },
    {
      name: 'La Guajira, Colombia',
      desc: 'Cross-border programs serving Wayuu communities on the Colombian side.',
      coords: [11.75, -72.35]
    },
    {
      name: 'Apüna Farm',
      desc: 'Sustainable agroecology farm producing food for local communities.',
      coords: [10.80, -71.60]
    },
    {
      name: 'Mirabello Farm',
      desc: 'Second agricultural site supporting the food security program.',
      coords: [10.88, -71.68]
    }
  ];

  locations.forEach(loc => {
    const marker = L.marker(loc.coords, { icon: blueIcon }).addTo(map);
    marker.bindPopup(`
      <div class="map-popup">
        <strong>${loc.name}</strong>
        <p>${loc.desc}</p>
      </div>
    `);
  });

  // Fit map to show all markers
  const group = L.featureGroup(locations.map(l => L.marker(l.coords)));
  map.fitBounds(group.getBounds().pad(0.3));
})();
