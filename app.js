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
  const ctaParallaxImg = document.querySelector('.cta--video img.cta-bg-video');
  const ctaSection = ctaParallaxImg ? ctaParallaxImg.closest('.cta--video') : null;
  const zigzag = document.querySelector('.zigzag-timeline');
  const zigzagSection = document.querySelector('.timeline-section');
  const zzSpark = zigzag ? zigzag.querySelector('.zigzag-spark') : null;
  const zzMilestones = zigzag ? Array.from(zigzag.querySelectorAll('.zigzag-milestone')) : [];
  const zzRows = zigzag ? Array.from(zigzag.querySelectorAll('.zigzag-row')) : [];
  const zzSvg = zigzag ? zigzag.querySelector('.zigzag-path') : null;
  var zzPathLen = 0;
  var zzTrackPath = null;
  var zzFillPath = null;

  // Pre-cache scroll-text sections and their lines
  const scrollTextData = [];
  document.querySelectorAll('.scroll-text-section').forEach(section => {
    const lines = section.querySelectorAll('.scroll-text-line');
    if (lines.length) scrollTextData.push({ section, lines });
  });

  // Zigzag timeline setup — build SVG path through dot centers, ending at last dot
  function zzBuildPath() {
    if (!zigzag || !zzSvg || zzMilestones.length < 2) return;
    var rect = zigzag.getBoundingClientRect();
    var w = rect.width;
    var h = rect.height;
    zzSvg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
    zzSvg.setAttribute('width', w);
    zzSvg.setAttribute('height', h);

    // Collect center points of each milestone dot
    var pts = [];
    var zigRect = zigzag.getBoundingClientRect();
    zzMilestones.forEach(function(ms) {
      var dot = ms.querySelector('.zigzag-dot');
      var dr = dot.getBoundingClientRect();
      pts.push({
        x: dr.left + dr.width / 2 - zigRect.left,
        y: dr.top + dr.height / 2 - zigRect.top
      });
    });

    if (pts.length < 2) return;

    // Build path: start at first dot, curve through each, STOP at last dot
    var d = 'M ' + pts[0].x + ' ' + pts[0].y;

    for (var i = 1; i < pts.length; i++) {
      var prev = pts[i - 1];
      var p = pts[i];
      // Smooth S-curve between dots
      var midY = (prev.y + p.y) / 2;
      d += ' C ' + prev.x + ' ' + midY + ', ' + p.x + ' ' + midY + ', ' + p.x + ' ' + p.y;
    }
    // Path ends at the last dot — no extension

    zzSvg.innerHTML = '<defs><linearGradient id="zzGradient" x1="0" y1="0" x2="0" y2="1">'
      + '<stop offset="0%" stop-color="var(--blue-light)"/>'
      + '<stop offset="50%" stop-color="var(--blue)"/>'
      + '<stop offset="100%" stop-color="var(--blue-dark)"/>'
      + '</linearGradient></defs>'
      + '<path class="zz-track" d="' + d + '"/>'
      + '<path class="zz-fill" d="' + d + '"/>';

    zzTrackPath = zzSvg.querySelector('.zz-track');
    zzFillPath = zzSvg.querySelector('.zz-fill');
    zzPathLen = zzFillPath.getTotalLength();
    zzFillPath.style.strokeDasharray = zzPathLen;
    zzFillPath.style.strokeDashoffset = zzPathLen;
  }

  if (zigzag) {
    zzBuildPath();
    window.addEventListener('resize', function() {
      // Reset and rebuild on resize
      zzMilestones.forEach(function(ms) { ms.classList.remove('zz-visible'); });
      zigzag.classList.remove('zz-active');
      zzBuildPath();
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

      // CTA background image parallax
      if (ctaParallaxImg && ctaSection) {
        const rect = ctaSection.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, 1 - rect.bottom / (vh + rect.height)));
        const yShift = (progress - 0.5) * 15;
        ctaParallaxImg.style.transform = `translateY(${yShift}%)`;
      }

      // Scroll-text reveal (reversible)
      // Progress tracks how far the user has scrolled THROUGH the section,
      // not just when the top enters the viewport.
      scrollTextData.forEach(({ section, lines }) => {
        const rect = section.getBoundingClientRect();
        const scrolledPast = (vh * 0.8) - rect.top;
        const totalTravel = rect.height;
        const progress = Math.min(1, Math.max(0, scrolledPast / totalTravel));
        // Each line gets a smooth 0→1 progress for gradual color fade
        const n = lines.length;
        const spread = 1 / n;
        lines.forEach((line, i) => {
          const lineStart = i * spread;
          const lineEnd = (i === n - 1) ? 1 : lineStart + spread * 2; // last line completes at progress=1
          const lineProg = Math.min(1, Math.max(0, (progress - lineStart) / (lineEnd - lineStart)));
          // Interpolate from faint (0.12 alpha) to full white
          const alpha = 0.12 + (lineProg * 0.88);
          line.style.color = 'rgba(255,255,255,' + alpha.toFixed(2) + ')';
          line.style.opacity = 0.3 + (lineProg * 0.7);
          line.style.transform = 'translateY(' + ((1 - lineProg) * 8) + 'px)';
        });
      });

      // Zigzag timeline spark + path progress
      if (zigzag && zigzagSection && zzSpark && zzFillPath && zzPathLen > 0) {
        var sRect = zigzagSection.getBoundingClientRect();
        var scrolledInto = vh - sRect.top;
        var totalScroll = sRect.height + vh * 0.3;
        var progress = Math.min(Math.max(scrolledInto / totalScroll, 0), 1);

        // Draw the colored path
        var offset = zzPathLen * (1 - progress);
        zzFillPath.style.strokeDashoffset = offset;
        if (progress > 0) zigzag.classList.add('zz-active');

        // Position spark at the tip of the drawn path
        if (progress > 0 && progress <= 1) {
          var pt = zzFillPath.getPointAtLength(progress * zzPathLen);
          zzSpark.style.transform = 'translate(' + pt.x + 'px, ' + pt.y + 'px)';
        }

        // Reveal milestones when spark passes their position on the path
        zzMilestones.forEach(function(ms) {
          if (ms.classList.contains('zz-visible')) return;
          var dot = ms.querySelector('.zigzag-dot');
          if (!dot) return;
          var dr = dot.getBoundingClientRect();
          var dotCenterY = dr.top + dr.height / 2;
          var zigRect = zigzag.getBoundingClientRect();
          var dotRelY = dotCenterY - zigRect.top;
          var sparkPt = zzFillPath.getPointAtLength(progress * zzPathLen);
          if (sparkPt.y >= dotRelY - 10) {
            ms.classList.add('zz-visible');
          }
        });
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

/* ========== VALUES STAGGERED SCROLL REVEAL ========== */
(function () {
  var cards = document.querySelectorAll('.value-card');
  if (!cards.length) return;
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  cards.forEach(function (card) { observer.observe(card); });
})();

/* ========== PARTNER CARD TOGGLE ========== */
(function () {
  var cards = document.querySelectorAll('.partner-card');
  if (!cards.length) return;
  cards.forEach(function (card) {
    card.addEventListener('click', function () {
      card.classList.toggle('active');
    });
  });
})();

/* ========== GALLERY SLIDER ========== */
(function(){
  const slider = document.getElementById('gallerySlider');
  if (!slider) return;
  const track = slider.querySelector('.gallery-slider-track');
  const slides = Array.from(track.children);
  const prevBtn = slider.querySelector('.gallery-slider-prev');
  const nextBtn = slider.querySelector('.gallery-slider-next');
  if (!slides.length) return;

  let index = 0;
  const gap = 16;

  function getMaxOffset() {
    return Math.max(0, track.scrollWidth - track.parentElement.offsetWidth);
  }

  function getSlideOffset(i) {
    if (i <= 0) return 0;
    var offset = 0;
    for (var s = 0; s < i && s < slides.length; s++) {
      offset += slides[s].offsetWidth + gap;
    }
    var max = getMaxOffset();
    return Math.min(offset, max);
  }

  function update() {
    track.style.transform = 'translateX(' + -getSlideOffset(index) + 'px)';
  }

  function move(dir) {
    index += dir;
    if (index >= slides.length) index = 0;
    if (index < 0) index = slides.length - 1;
    // If we're near the end and offset would be same as max, wrap around
    var offset = getSlideOffset(index);
    var max = getMaxOffset();
    if (dir > 0 && offset >= max && index !== 0) {
      index = 0;
    }
    update();
  }

  prevBtn.addEventListener('click', function(){ move(-1); });
  nextBtn.addEventListener('click', function(){ move(1); });

  // Swipe support
  let startX = 0;
  track.addEventListener('touchstart', function(e){ startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', function(e){
    var diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) move(diff > 0 ? 1 : -1);
  });

  // Recalc on resize
  window.addEventListener('resize', function(){
    var max = getMaxOffset();
    if (getSlideOffset(index) > max) {
      index = 0;
    }
    update();
  });
})();

/* ========== PROGRAM OTHER SLIDER ========== */
(function(){
  var slider = document.getElementById('programSlider');
  if (!slider) return;
  var track = slider.querySelector('.program-other-track');
  var wrap = slider.querySelector('.program-other-track-wrap');
  var cards = Array.from(track.children);
  var prevBtn = slider.querySelector('.program-other-prev');
  var nextBtn = slider.querySelector('.program-other-next');
  if (!cards.length) return;

  var idx = 0;

  function getGap() {
    var s = getComputedStyle(track);
    return parseInt(s.gap) || 24;
  }

  function visibleCount() {
    var w = window.innerWidth;
    if (w <= 480) return 1;
    if (w <= 768) return 2;
    return 3;
  }

  function maxIdx() {
    var m = cards.length - visibleCount();
    return m > 0 ? m : 0;
  }

  function update() {
    var cw = cards[0].offsetWidth + getGap();
    track.style.transform = 'translateX(' + -(idx * cw) + 'px)';
    // Toggle left fade only when scrolled past start
    if (idx > 0) {
      wrap.classList.add('has-prev');
    } else {
      wrap.classList.remove('has-prev');
    }
  }

  function move(dir) {
    idx += dir;
    if (idx > maxIdx()) idx = 0;
    if (idx < 0) idx = maxIdx();
    update();
  }

  prevBtn.addEventListener('click', function(){ move(-1); });
  nextBtn.addEventListener('click', function(){ move(1); });

  // Swipe
  var startX = 0;
  track.addEventListener('touchstart', function(e){ startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', function(e){
    var diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) move(diff > 0 ? 1 : -1);
  });

  // Recalc on resize
  window.addEventListener('resize', function(){
    if (idx > maxIdx()) idx = 0;
    update();
  });
})();

/* ========== HOMEPAGE PROGRAMS SLIDER ========== */
(function(){
  var slider = document.getElementById('programsHomeSlider');
  if (!slider) return;
  var track = slider.querySelector('.programs-slider-track');
  var wrap = slider.querySelector('.programs-slider-track-wrap');
  var cards = Array.from(track.children);
  var prevBtn = slider.querySelector('.programs-slider-prev');
  var nextBtn = slider.querySelector('.programs-slider-next');
  if (!cards.length) return;

  var idx = 0;

  function getGap() {
    return parseInt(getComputedStyle(track).gap) || 20;
  }

  function visibleCount() {
    var w = window.innerWidth;
    if (w <= 768) return 2;
    if (w <= 1024) return 3;
    return 4;
  }

  function maxIdx() {
    var m = cards.length - visibleCount();
    return m > 0 ? m : 0;
  }

  function update() {
    var cw = cards[0].offsetWidth + getGap();
    track.style.transform = 'translateX(' + -(idx * cw) + 'px)';
    if (idx > 0) {
      wrap.classList.add('has-prev');
    } else {
      wrap.classList.remove('has-prev');
    }
  }

  function move(dir) {
    idx += dir;
    if (idx > maxIdx()) idx = 0;
    if (idx < 0) idx = maxIdx();
    update();
  }

  prevBtn.addEventListener('click', function(){ move(-1); });
  nextBtn.addEventListener('click', function(){ move(1); });

  var startX = 0;
  track.addEventListener('touchstart', function(e){ startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', function(e){
    var diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) move(diff > 0 ? 1 : -1);
  });

  window.addEventListener('resize', function(){
    if (idx > maxIdx()) idx = 0;
    update();
  });
})();

/* ========== DONATE PAGE SLIDESHOW ========== */
(function(){
  var wrap = document.getElementById('donateSlideshow');
  if (!wrap) return;
  var slides = wrap.querySelectorAll('.donate-slide');
  if (slides.length < 2) return;
  var cur = 0;
  setInterval(function(){
    slides[cur].classList.remove('active');
    cur = (cur + 1) % slides.length;
    slides[cur].classList.add('active');
  }, 3000);
})();

/* ========== HASTA LOS HUESOS LANGUAGE TABS ========== */
document.querySelectorAll('.hasta-lang-tabs').forEach(function(tabBar) {
  var desc = tabBar.closest('.hasta-description');
  var tabs = tabBar.querySelectorAll('.hasta-lang-tab');
  var panels = desc.querySelectorAll('.hasta-lang-panel');
  tabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      var lang = tab.getAttribute('data-lang');
      tabs.forEach(function(t) { t.classList.remove('active'); });
      panels.forEach(function(p) { p.classList.remove('active'); });
      tab.classList.add('active');
      desc.querySelector('[data-lang-panel="' + lang + '"]').classList.add('active');
    });
  });
});

/* ========== TAB ACCORDION ========== */
document.querySelectorAll('.tab-accordion').forEach(function(accordion) {
  var tabs = accordion.querySelectorAll('.tab-accordion-tab');
  var panels = accordion.querySelectorAll('.tab-accordion-panel');
  tabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      var target = tab.getAttribute('data-tab');
      tabs.forEach(function(t) { t.classList.remove('active'); });
      panels.forEach(function(p) { p.classList.remove('active'); });
      tab.classList.add('active');
      accordion.querySelector('[data-panel="' + target + '"]').classList.add('active');
    });
  });
});

/* ========== INTRO SLIDESHOWS (auto-rotate every 3s) ========== */
document.querySelectorAll('.intro-slideshow').forEach(function(container) {
  var slides = container.querySelectorAll('.intro-slide');
  if (slides.length < 2) return;
  var idx = 0;
  setInterval(function() {
    slides[idx].classList.remove('active');
    idx = (idx + 1) % slides.length;
    slides[idx].classList.add('active');
  }, 3000);
});

/* ========== NEWS TIMELINE REVEAL ========== */
(function() {
  var items = document.querySelectorAll('.timeline-item[data-reveal]');
  if (!items.length) return;
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  items.forEach(function(item) { observer.observe(item); });
})();

/* ========== NEWS PAGE — GRID, FILTERS, PAGINATION ========== */
(function() {
  if (typeof newsData === 'undefined') return;
  var grid = document.getElementById('newsGrid');
  var pagWrap = document.getElementById('newsPagination');
  var noResults = document.getElementById('newsNoResults');
  var featWrap = document.getElementById('newsFeatured');
  if (!grid) return;

  var PER_PAGE = 9;
  var currentFilter = 'all';
  var currentPage = 1;

  function filtered() {
    if (currentFilter === 'all') return newsData;
    return newsData.filter(function(p) { return p.category === currentFilter; });
  }

  function fmtDate(d) {
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var parts = d.split('-');
    return months[parseInt(parts[1],10)-1] + ' ' + parseInt(parts[2],10) + ', ' + parts[0];
  }

  function renderFeatured() {
    if (!featWrap) return;
    var post = newsData[0]; // latest
    featWrap.innerHTML = '<div class="container"><div class="news-featured-card">' +
      '<div class="news-featured-image">' +
        '<span class="news-featured-badge">Latest</span>' +
        '<img src="' + post.image + '" alt="' + post.title.replace(/"/g,'&quot;') + '" loading="lazy" />' +
      '</div>' +
      '<div class="news-featured-body">' +
        '<span class="news-date">' + fmtDate(post.date) + '</span> ' +
        '<span class="news-cat">' + post.category + '</span>' +
        '<h2>' + post.title + '</h2>' +
        '<p>' + post.summary + '</p>' +
      '</div>' +
    '</div></div>';
  }

  function renderGrid() {
    var posts = filtered();
    // Skip featured (first post) if showing all
    var display = currentFilter === 'all' ? posts.slice(1) : posts;
    var total = Math.ceil(display.length / PER_PAGE) || 1;
    if (currentPage > total) currentPage = total;
    var start = (currentPage - 1) * PER_PAGE;
    var page = display.slice(start, start + PER_PAGE);

    if (page.length === 0) {
      grid.innerHTML = '';
      pagWrap.innerHTML = '';
      noResults.style.display = 'block';
      return;
    }
    noResults.style.display = 'none';

    var html = '';
    page.forEach(function(p) {
      html += '<article class="news-card" data-category="' + p.category + '">' +
        '<div class="news-card-image">' +
          '<span class="news-cat">' + p.category + '</span>' +
          '<img src="' + p.image + '" alt="' + p.title.replace(/"/g,'&quot;') + '" loading="lazy" />' +
        '</div>' +
        '<div class="news-card-body">' +
          '<span class="news-date">' + fmtDate(p.date) + '</span>' +
          '<h3>' + p.title + '</h3>' +
          '<p>' + p.summary + '</p>' +
        '</div>' +
      '</article>';
    });
    grid.innerHTML = html;

    // Pagination
    if (total <= 1) { pagWrap.innerHTML = ''; return; }
    var pHtml = '<button class="news-page-btn news-prev" ' + (currentPage <= 1 ? 'disabled' : '') + '>&larr; Prev</button>';
    for (var i = 1; i <= total; i++) {
      pHtml += '<button class="news-page-btn' + (i === currentPage ? ' active' : '') + '" data-page="' + i + '">' + i + '</button>';
    }
    pHtml += '<button class="news-page-btn news-next" ' + (currentPage >= total ? 'disabled' : '') + '>Next &rarr;</button>';
    pagWrap.innerHTML = pHtml;
  }

  // Filter clicks
  document.querySelectorAll('.news-filter-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelector('.news-filter-btn.active').classList.remove('active');
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-filter');
      currentPage = 1;
      renderGrid();
      grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Pagination clicks (delegated)
  pagWrap.addEventListener('click', function(e) {
    var btn = e.target.closest('.news-page-btn');
    if (!btn || btn.disabled) return;
    if (btn.classList.contains('news-prev')) { currentPage--; }
    else if (btn.classList.contains('news-next')) { currentPage++; }
    else { currentPage = parseInt(btn.getAttribute('data-page'), 10); }
    renderGrid();
    grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  renderFeatured();
  renderGrid();
})();

/* ========== H2 STAT COUNTER (scroll-triggered count-up) ========== */
(function() {
  var statEls = document.querySelectorAll('.h2-stat-number[data-h2-target]');
  if (!statEls.length) return;

  function formatAbbr(n) {
    if (n >= 1000000) return (n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + 'K';
    return n.toLocaleString();
  }

  function animateCounter(el) {
    var target = parseInt(el.dataset.h2Target, 10);
    var suffix = el.dataset.h2Suffix || '';
    var useAbbr = el.dataset.h2Format === 'abbr';
    var duration = 1800;
    var start = performance.now();

    function step(now) {
      var elapsed = now - start;
      var progress = Math.min(elapsed / duration, 1);
      // ease out cubic
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.round(eased * target);

      if (useAbbr) {
        el.textContent = formatAbbr(current) + suffix;
      } else {
        el.textContent = current.toLocaleString() + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  statEls.forEach(function(el) { observer.observe(el); });
})();

/* ========== IMPACT STAT SLIDESHOW ========== */
(function() {
  var slideshows = document.querySelectorAll('.h2-stat-slideshow');
  if (!slideshows.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  slideshows.forEach(function(container) {
    var slides = container.querySelectorAll('.h2-slide');
    if (slides.length < 2) return;
    var current = 0;
    var interval = parseInt(container.getAttribute('data-interval')) || 3000;

    setInterval(function() {
      slides[current].classList.remove('active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('active');
    }, interval);
  });
})();
