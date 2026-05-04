/* ══════════════════════════════
   HAMBURGER / MOBILE MENU
══════════════════════════════ */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

// Toggle menu open/close on hamburger click
hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
});

// Close mobile menu when any link is clicked
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

/* ══════════════════════════════
   CAROUSEL
══════════════════════════════ */
const track    = document.getElementById('track');
const dotsWrap = document.getElementById('dots');
const slides   = track.querySelectorAll('.slide');
const total    = slides.length;

let current   = 0;   // index of currently visible slide
let autoTimer = null;

// ── Build indicator dots dynamically ──
slides.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.className = 'dot' + (i === 0 ? ' active' : '');
  dot.setAttribute('aria-label', `Перейти до слайду ${i + 1}`);
  dot.addEventListener('click', () => {
    goTo(i);
    resetAuto();
  });
  dotsWrap.appendChild(dot);
});

// ── Update active dot ──
function updateDots() {
  dotsWrap.querySelectorAll('.dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === current);
  });
}

// ── Move carousel to given slide index ──
function goTo(index) {
  current = (index + total) % total;           // wrap around
  track.style.transform = `translateX(-${current * 100}%)`;
  updateDots();
}

function nextSlide() { goTo(current + 1); }
function prevSlide() { goTo(current - 1); }

// ── Arrow buttons ──
document.getElementById('nextBtn').addEventListener('click', () => {
  nextSlide();
  resetAuto();
});

document.getElementById('prevBtn').addEventListener('click', () => {
  prevSlide();
  resetAuto();
});

// ── Auto-play ──
function startAuto() {
  autoTimer = setInterval(nextSlide, 3500);
}

function resetAuto() {
  clearInterval(autoTimer);
  startAuto();
}

startAuto();

// Pause auto-play while user hovers over carousel
const carouselWrap = document.querySelector('.carousel-wrap');
carouselWrap.addEventListener('mouseenter', () => clearInterval(autoTimer));
carouselWrap.addEventListener('mouseleave', startAuto);

// ── Touch / swipe support (mobile) ──
let touchStartX = 0;

track.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
}, { passive: true });

track.addEventListener('touchend', (e) => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 40) {          // minimum swipe distance
    diff > 0 ? nextSlide() : prevSlide();
    resetAuto();
  }
});

/* ══════════════════════════════
   ACTIVE NAV LINK ON SCROLL
══════════════════════════════ */
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav-menu a, .mobile-menu a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        const isActive = link.getAttribute('href') === '#' + entry.target.id;
        link.classList.toggle('active', isActive);
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(section => sectionObserver.observe(section));
