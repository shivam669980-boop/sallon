// Register ScrollTrigger with GSAP
gsap.registerPlugin(ScrollTrigger);

// 1. DYNAMIC PRELOADER CANVAS PARTICLES
const canvas = document.getElementById('preloader-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  for (let i = 0; i < 40; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.5 + 0.8,
      alpha: Math.random() * 0.4 + 0.2,
      speed: Math.random() * 0.4 + 0.1
    });
  }

  function drawPreloaderParticles() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, true);
      ctx.fillStyle = `rgba(212, 175, 55, ${p.alpha})`;
      ctx.fill();

      // update coordinates (stars drift upward slowly)
      p.y -= p.speed;
      if (p.y < 0) {
        p.y = height;
        p.x = Math.random() * width;
      }
    });
    requestAnimationFrame(drawPreloaderParticles);
  }
  drawPreloaderParticles();
}


// 2. PRELOADER & INITIAL INTRO ANIMATION TIMELINE
window.addEventListener('load', () => {
  const preloaderTimeline = gsap.timeline({
    onComplete: () => {
      document.body.style.overflow = 'auto';
      const preloader = document.getElementById('preloader');
      if (preloader) preloader.style.display = 'none';
    }
  });

  document.body.style.overflow = 'hidden';

  // Draw labels
  preloaderTimeline.to('.preloader-lbl', {
    opacity: 1,
    y: 0,
    duration: 1.0,
    stagger: 0.3,
    ease: 'power2.out',
    delay: 0.5
  });

  // Scale logo and fade out preloader overlay
  preloaderTimeline.to('#preloader svg', {
    scale: 1.15,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.inOut',
    delay: 0.8
  })
  .to('#preloader', {
    opacity: 0,
    duration: 0.9,
    ease: 'power4.inOut'
  }, '-=0.4')
  
  // Hero reveals with premium easing curve (Power4.out)
  .from('#hero-parallax-bg', {
    scale: 1.15,
    duration: 2.0,
    ease: 'power3.out'
  }, '-=0.9')
  .from('#hero-title', {
    opacity: 0,
    y: 60,
    duration: 1.4,
    ease: 'power4.out'
  }, '-=1.2')
  .from('#home p, #home .inline-flex', {
    opacity: 0,
    y: 30,
    duration: 1.1,
    stagger: 0.2,
    ease: 'power3.out'
  }, '-=1.0')
  .from('#home button, #home a', {
    opacity: 0,
    y: 20,
    duration: 0.8,
    stagger: 0.1,
    ease: 'power3.out'
  }, '-=0.8')
  .from('#hero-interactive-container', {
    opacity: 0,
    scale: 0.95,
    y: 45,
    duration: 1.4,
    ease: 'power4.out'
  }, '-=1.0')
  .from('#hero-floating-card-1', {
    opacity: 0,
    x: -40,
    duration: 1.0,
    ease: 'power3.out'
  }, '-=0.8')
  .from('#hero-floating-card-2', {
    opacity: 0,
    x: 40,
    duration: 1.0,
    ease: 'power3.out'
  }, '-=0.9')
  .from('header nav', {
    y: -50,
    opacity: 0,
    duration: 1.2,
    ease: 'power3.out'
  }, '-=1.4');
});


// 3. LENIS SMOOTH INERTIAL SCROLLING
const lenis = new Lenis({
  duration: 1.4,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Bind Lenis scroll states with GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);


// 4. CUSTOM INTERACTIVE CURSOR AND BACK LIGHT
const cursor = document.getElementById('custom-cursor');
const cursorGlow = document.getElementById('custom-cursor-glow');
const mouseGlow = document.getElementById('mouse-glow-1');

document.addEventListener('mousemove', (e) => {
  // Move custom pointers
  if (cursor && cursorGlow) {
    gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.05 });
    gsap.to(cursorGlow, { x: e.clientX, y: e.clientY, duration: 0.15 });
  }
  // Move responsive ambient spotlight
  if (mouseGlow) {
    gsap.to(mouseGlow, {
      x: e.clientX - 250,
      y: e.clientY - 250,
      duration: 0.4,
      ease: 'power2.out'
    });
  }
});

// Add hover scaling triggers on all interactive anchors
document.querySelectorAll('a, button, [role="button"], select, input, .service-selector-btn, .stylist-selector-btn').forEach(el => {
  el.addEventListener('mouseenter', () => {
    if (cursor && cursorGlow) {
      cursor.classList.add('scale-150');
      cursorGlow.style.borderColor = 'white';
      cursorGlow.style.width = '50px';
      cursorGlow.style.height = '50px';
    }
  });
  el.addEventListener('mouseleave', () => {
    if (cursor && cursorGlow) {
      cursor.classList.remove('scale-150');
      cursorGlow.style.borderColor = 'var(--accent-gold)';
      cursorGlow.style.width = '36px';
      cursorGlow.style.height = '36px';
    }
  });
});


// 5. THEME spectrum SPECS (LOCALSTORAGE PREFERENCE)
const htmlElement = document.documentElement;
const themeToggleDesktop = document.getElementById('theme-toggle');
const themeToggleMobile = document.getElementById('theme-toggle-mobile');
const sunIcon = document.getElementById('theme-toggle-sun');
const moonIcon = document.getElementById('theme-toggle-moon');

function applyTheme(theme) {
  if (theme === 'light') {
    htmlElement.setAttribute('data-theme', 'light');
    htmlElement.classList.add('light');
    if (sunIcon) sunIcon.classList.remove('hidden');
    if (moonIcon) moonIcon.classList.add('hidden');
  } else {
    htmlElement.setAttribute('data-theme', 'dark');
    htmlElement.classList.remove('light');
    if (sunIcon) sunIcon.classList.add('hidden');
    if (moonIcon) moonIcon.classList.remove('hidden');
  }
}

const savedTheme = localStorage.getItem('theme');
const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
let activeTheme = savedTheme || (prefersLight ? 'light' : 'dark');
applyTheme(activeTheme);

if (themeToggleDesktop) {
  themeToggleDesktop.addEventListener('click', () => {
    activeTheme = activeTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', activeTheme);
    applyTheme(activeTheme);
  });
}

if (themeToggleMobile) {
  themeToggleMobile.addEventListener('click', () => {
    activeTheme = activeTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', activeTheme);
    applyTheme(activeTheme);
  });
}


// 6. HERO INTERACTIVE PARALLAX DRIFT
const interactiveContainer = document.getElementById('hero-interactive-container');
const mainCard = document.getElementById('hero-main-card');
const floatingCard1 = document.getElementById('hero-floating-card-1');
const floatingCard2 = document.getElementById('hero-floating-card-2');

if (interactiveContainer && mainCard && floatingCard1 && floatingCard2) {
  interactiveContainer.addEventListener('mousemove', (e) => {
    const rect = interactiveContainer.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const normX = x / (rect.width / 2);
    const normY = y / (rect.height / 2);

    gsap.to(mainCard, {
      rotateY: normX * 8,
      rotateX: -normY * 8,
      x: normX * 10,
      y: normY * 10,
      duration: 0.5,
      ease: 'power2.out'
    });

    gsap.to(floatingCard1, {
      x: normX * -30,
      y: normY * -30,
      duration: 0.6,
      ease: 'power2.out'
    });

    gsap.to(floatingCard2, {
      x: normX * 35,
      y: normY * 35,
      duration: 0.6,
      ease: 'power2.out'
    });
  });

  interactiveContainer.addEventListener('mouseleave', () => {
    gsap.to([mainCard, floatingCard1, floatingCard2], {
      rotateY: 0,
      rotateX: 0,
      x: 0,
      y: 0,
      duration: 0.8,
      ease: 'power3.out'
    });
  });
}


// 7. SCROLL-LINKED HERO BG PARALLAX
gsap.to('#hero-parallax-bg', {
  scrollTrigger: {
    trigger: '#home',
    start: 'top top',
    end: 'bottom top',
    scrub: true
  },
  yPercent: 12,
  ease: 'none'
});


// 8. BENTO CARDS 3D DRIFT INTERACTIONS
document.querySelectorAll('.bento-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const normX = x / (rect.width / 2);
    const normY = y / (rect.height / 2);

    gsap.to(card, {
      rotateY: normX * 5,
      rotateX: -normY * 5,
      duration: 0.4,
      ease: 'power2.out'
    });
  });

  card.addEventListener('mouseleave', () => {
    gsap.to(card, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.6,
      ease: 'power3.out'
    });
  });
});


// 9. INTERACTIVE BEFORE & AFTER SLIDER
const comparisonSlider = document.getElementById('comparison-slider');
const sliderHandle = document.getElementById('slider-drag-handle');
const afterContainer = document.getElementById('slider-after-container');
const afterImg = document.getElementById('slider-after-img');

if (comparisonSlider && sliderHandle && afterContainer && afterImg) {
  const syncImageSize = () => {
    afterImg.style.width = `${comparisonSlider.offsetWidth}px`;
  };
  
  window.addEventListener('resize', syncImageSize);
  syncImageSize();

  const handleDrag = (clientX) => {
    const rect = comparisonSlider.getBoundingClientRect();
    let percentage = ((clientX - rect.left) / rect.width) * 100;
    
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;

    sliderHandle.style.left = `${percentage}%`;
    afterContainer.style.width = `${percentage}%`;
  };

  const onMouseMove = (e) => {
    handleDrag(e.clientX);
  };
  const onTouchMove = (e) => {
    if (e.touches && e.touches[0]) {
      handleDrag(e.touches[0].clientX);
    }
  };

  sliderHandle.addEventListener('mousedown', () => {
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  sliderHandle.addEventListener('touchstart', () => {
    document.addEventListener('touchmove', onTouchMove);
    document.addEventListener('touchend', onTouchEnd);
  });

  const onMouseUp = () => {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };
  const onTouchEnd = () => {
    document.removeEventListener('touchmove', onTouchMove);
    document.removeEventListener('touchend', onTouchEnd);
  };
}


// 10. FILTERABLE GALLERY PORTFOLIO
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Remove active formatting
    filterBtns.forEach(b => b.classList.remove('active', 'border-accentGold', 'text-accentGold'));
    filterBtns.forEach(b => b.classList.add('border-borderTheme'));
    
    btn.classList.add('active', 'border-accentGold', 'text-accentGold');
    btn.classList.remove('border-borderTheme');

    const filterValue = btn.getAttribute('data-filter');

    portfolioItems.forEach(item => {
      if (filterValue === 'all' || item.classList.contains(filterValue)) {
        gsap.to(item, { scale: 1, opacity: 1, duration: 0.4, display: 'block' });
      } else {
        gsap.to(item, { scale: 0.9, opacity: 0, duration: 0.4, display: 'none' });
      }
    });
  });
});


// 11. LIGHTBOX DYNAMIC GALLERY
const lightboxModal = document.getElementById('lightbox-modal');
const lightboxImg = document.getElementById('lightbox-img');

window.openLightbox = function(src) {
  if (lightboxModal && lightboxImg) {
    lightboxImg.src = src;
    lightboxModal.classList.remove('pointer-events-none', 'opacity-0');
    lightboxModal.classList.add('opacity-100');
  }
};

window.closeLightbox = function() {
  if (lightboxModal) {
    lightboxModal.classList.add('pointer-events-none');
    lightboxModal.classList.remove('opacity-100');
    lightboxModal.classList.add('opacity-0');
  }
};


// 12. SWIPER TESTIMONIAL CAROUSEL
const testimonialSwiper = new Swiper('.testimonialSwiper', {
  slidesPerView: 1,
  spaceBetween: 30,
  loop: true,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true
  },
  breakpoints: {
    768: {
      slidesPerView: 1.5
    },
    1024: {
      slidesPerView: 2
    }
  }
});


// 13. ACCORDION FAQ CONTROLLER
window.toggleAccordion = function(button) {
  const item = button.parentElement;
  const isActive = item.classList.contains('active');
  
  document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));
  
  if (!isActive) {
    item.classList.add('active');
  }
};


// 14. INTERACTIVE LEAFLET MAP DARK ATELIER
const mapContainer = document.getElementById('contact-map');
if (mapContainer) {
  const locationPosition = [51.509865, -0.134321];
  const map = L.map('contact-map', {
    scrollWheelZoom: false
  }).setView(locationPosition, 15);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
  }).addTo(map);

  const markerHtml = `<div class="w-4 h-4 rounded-full bg-[#D4AF37] border-2 border-white shadow-lg animate-pulse"></div>`;
  const goldMarker = L.divIcon({
    className: 'custom-gold-marker',
    html: markerHtml,
    iconSize: [16, 16]
  });

  L.marker(locationPosition, { icon: goldMarker }).addTo(map)
    .bindPopup(`<div class="text-xs font-bold text-[#060608]">Chandan Salon Atelier</div><div class="text-[10px] text-gray-500">104 Mayfair Promenade</div>`)
    .openPopup();
}


// 15. DYNAMIC MULTI-STEP BOOKING WIZARD
let wizardState = {
  step: 1,
  service: '',
  price: '',
  stylist: '',
  date: '',
  time: ''
};

const bookingModal = document.getElementById('booking-modal');
const bookingModalCard = document.getElementById('booking-modal-card');
const dateGrid = document.getElementById('date-grid-container');
const timeGrid = document.getElementById('time-grid-container');
const summaryService = document.getElementById('summary-service');
const summaryStylist = document.getElementById('summary-stylist');
const summaryDateTime = document.getElementById('summary-datetime');
const step3NextBtn = document.getElementById('step-3-next-btn');

window.openBookingModal = function(preselectedService = '') {
  wizardState = {
    step: 1,
    service: preselectedService,
    price: '',
    stylist: '',
    date: '',
    time: ''
  };

  populateBookingDates();
  populateBookingTimes();

  document.querySelectorAll('.wizard-step').forEach(step => step.classList.remove('active'));
  document.getElementById('step-1').classList.add('active');
  updateIndicators();

  if (bookingModal && bookingModalCard) {
    bookingModal.classList.remove('pointer-events-none', 'opacity-0');
    bookingModal.classList.add('opacity-100');
    bookingModalCard.classList.remove('scale-95');
    bookingModalCard.classList.add('scale-100');
    document.body.style.overflow = 'hidden';

    gsap.from('#booking-modal-card', {
      y: 30,
      opacity: 0,
      duration: 0.5,
      ease: 'power4.out'
    });
  }
};

window.closeBookingModal = function() {
  if (bookingModal && bookingModalCard) {
    bookingModal.classList.add('pointer-events-none');
    bookingModal.classList.remove('opacity-100');
    bookingModal.classList.add('opacity-0');
    bookingModalCard.classList.remove('scale-100');
    bookingModalCard.classList.add('scale-95');
    document.body.style.overflow = 'auto';
  }
};

window.goToStep = function(stepNum) {
  document.querySelectorAll('.wizard-step').forEach(step => step.classList.remove('active'));
  document.getElementById(`step-${stepNum}`).classList.add('active');
  wizardState.step = stepNum;
  updateIndicators();
};

window.nextStep = function() {
  if (wizardState.step < 5) goToStep(wizardState.step + 1);
};

window.prevStep = function() {
  if (wizardState.step > 1) goToStep(wizardState.step - 1);
};

window.selectService = function(category, name) {
  wizardState.service = name;
  nextStep();
};

window.selectStylist = function(name) {
  wizardState.stylist = name;
  nextStep();
};

function populateBookingDates() {
  if (!dateGrid) return;
  dateGrid.innerHTML = '';

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let added = 0;
  let counter = 0;

  while (added < 6) {
    const date = new Date();
    date.setDate(date.getDate() + counter);
    if (date.getDay() !== 0) {
      const dayName = days[date.getDay()];
      const dayNum = date.getDate();
      const monthName = months[date.getMonth()];
      const dateText = `${dayName}, ${monthName} ${dayNum}`;

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'date-btn border border-borderTheme p-2 rounded-lg text-center text-xs bg-bgSecondary/20 hover:border-accentGold transition-colors text-textPrimary';
      btn.innerHTML = `<span class="block font-bold">${dayName}</span><span class="text-[9px] text-textSecondary">${dayNum} ${monthName}</span>`;
      
      btn.addEventListener('click', () => {
        document.querySelectorAll('.date-btn').forEach(b => b.classList.remove('border-accentGold', 'bg-accentGold/10'));
        btn.classList.add('border-accentGold', 'bg-accentGold/10');
        wizardState.date = dateText;
        validateStep3();
      });

      dateGrid.appendChild(btn);
      added++;
    }
    counter++;
  }
}

function populateBookingTimes() {
  if (!timeGrid) return;
  timeGrid.innerHTML = '';

  const slots = ['10:00 AM', '11:30 AM', '01:00 PM', '02:30 PM', '04:00 PM', '05:30 PM'];
  slots.forEach(slot => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'time-btn border border-borderTheme p-2 rounded-lg text-center text-[10px] bg-bgSecondary/20 hover:border-accentGold transition-colors text-textPrimary';
    btn.innerText = slot;

    btn.addEventListener('click', () => {
      document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('border-accentGold', 'bg-accentGold/10'));
      btn.classList.add('border-accentGold', 'bg-accentGold/10');
      wizardState.time = slot;
      validateStep3();
    });

    timeGrid.appendChild(btn);
  });
}

function validateStep3() {
  if (wizardState.date && wizardState.time) {
    step3NextBtn.disabled = false;
    summaryService.innerText = wizardState.service || 'Executive Grooming Service';
    summaryStylist.innerText = wizardState.stylist || 'Master Stylist';
    summaryDateTime.innerText = `${wizardState.date} @ ${wizardState.time}`;
  } else {
    step3NextBtn.disabled = true;
  }
}

function updateIndicators() {
  const indicators = document.querySelectorAll('.step-indicator');
  indicators.forEach((ind, idx) => {
    const num = idx + 1;
    ind.classList.remove('active', 'completed');
    if (num === wizardState.step) {
      ind.classList.add('active');
    } else if (num < wizardState.step) {
      ind.classList.add('completed');
      ind.innerHTML = '✓';
    } else {
      ind.innerHTML = num;
    }
  });
}

window.confirmAppointment = function(event) {
  event.preventDefault();
  const name = document.getElementById('book-name').value;
  const email = document.getElementById('book-email').value;
  const phone = document.getElementById('book-phone').value;
  if (name && email && phone) nextStep();
};


// 16. MOBILE MENU OVERLAY TRIGGER
const menuBtnIcon = document.getElementById('menu-btn-icon');
const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
let menuOpen = false;

window.toggleMobileMenu = function() {
  menuOpen = !menuOpen;
  if (menuOpen) {
    mobileMenuOverlay.classList.remove('pointer-events-none', 'opacity-0');
    mobileMenuOverlay.classList.add('opacity-100');
    menuBtnIcon.setAttribute('d', 'M6 18L18 6M6 6l12 12');
    document.body.style.overflow = 'hidden';

    gsap.from('#mobile-menu-overlay li', {
      y: 30,
      opacity: 0,
      stagger: 0.1,
      duration: 0.5,
      ease: 'power3.out'
    });
  } else {
    mobileMenuOverlay.classList.add('pointer-events-none');
    mobileMenuOverlay.classList.remove('opacity-100');
    mobileMenuOverlay.classList.add('opacity-0');
    menuBtnIcon.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
    document.body.style.overflow = 'auto';
  }
};

const mobileMenuBtn = document.getElementById('mobile-menu-btn');
if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener('click', toggleMobileMenu);
}


// 17. BACK TO TOP
window.scrollToTop = function() {
  lenis.scrollTo(0, { duration: 1.2 });
};


// 18. SIMULATED MICRO-INTERACTIONS
window.playAtelierVideo = function() {
  alert("Playing premium Mayfair Salon transformation video... [Cinematic Experience Simulation]");
};

window.toggleLanguage = function() {
  alert("Language toggled to French (FR). [Localization Simulation]");
};

window.subscribeNewsletter = function(e) {
  e.preventDefault();
  alert("Welcome to the Chandan Atelier inner circle. Luxury digest subscription confirmed.");
};
