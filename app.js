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
        const currentValue = Math.round(easedProgress * target);

        el.textContent = formatNumber(currentValue) + suffix;

        if (progress < 1) {
          requestAnimationFrame(step);
        }
      }

      requestAnimationFrame(step);
    });
  }

  const numbersSection = document.getElementById('numbers');
  if (numbersSection) {
    const numbersObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateNumbers();
          numbersObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    numbersObserver.observe(numbersSection);
  }
})();

/* ========== INTERACTIVE MAP (LEAFLET) ========== */
(function() {
  const mapEl = document.getElementById('map');
  if (!mapEl) return;

  const map = L.map('map', {
    center: [11.0, -71.5],
    zoom: 7,
    scrollWheelZoom: false,
    zoomControl: true
  });

  // Dark / blue-toned tile layer
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
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
