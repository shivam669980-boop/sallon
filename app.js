// Register ScrollTrigger with GSAP if available
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all features
  initTheme();
  initPreloader();
  initHeaderScroll();
  initMobileMenu();
  initCustomCursor();
  initHeroTilt();
  initBeforeAfterSlider();
  initGalleryFilter();
  initLightbox();
  initAccordionFAQ();
  initLeafletMap();
  initBookingWizard();
  initNewsletterForm();
  initInquiryForm();
});

/* =============================================
   1. THEME INITIALIZATION & TOGGLE
   ============================================= */
function initTheme() {
  const htmlEl = document.documentElement;
  const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
  
  const applyTheme = (theme) => {
    htmlEl.setAttribute('data-theme', theme);
    localStorage.setItem('chandan-theme', theme);
    
    // Toggle icon representations
    toggleBtns.forEach(btn => {
      const sunIcon = btn.querySelector('.sun-icon');
      const moonIcon = btn.querySelector('.moon-icon');
      if (theme === 'light') {
        if (sunIcon) sunIcon.style.display = 'block';
        if (moonIcon) moonIcon.style.display = 'none';
      } else {
        if (sunIcon) sunIcon.style.display = 'none';
        if (moonIcon) moonIcon.style.display = 'block';
      }
    });
  };

  // Determine starting theme
  const savedTheme = localStorage.getItem('chandan-theme');
  const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  const initialTheme = savedTheme || (systemPrefersLight ? 'light' : 'dark');
  applyTheme(initialTheme);

  // Bind click events
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = htmlEl.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      applyTheme(newTheme);
    });
  });
}

/* =============================================
   2. PRELOADER & INITIAL ANIMATION CANVAS
   ============================================= */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  const canvas = document.getElementById('preloader-canvas');
  if (!preloader) return;

  // Starry Particles Canvas
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    });

    const particles = [];
    const maxParticles = 40;

    for (let i = 0; i < maxParticles; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
        speed: Math.random() * 0.4 + 0.1
      });
    }

    function animateParticles() {
      if (!preloader || preloader.style.opacity === '0') return; // Stop drawing once hidden
      ctx.clearRect(0, 0, w, h);
      
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 55, ${p.alpha})`;
        ctx.fill();

        p.y -= p.speed;
        if (p.y < 0) {
          p.y = h;
          p.x = Math.random() * w;
        }
      });
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  // Preloader GSAP Timeline
  window.addEventListener('load', () => {
    document.body.style.overflow = 'hidden';

    if (typeof gsap !== 'undefined') {
      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = 'auto';
          preloader.style.display = 'none';
        }
      });

      tl.to('.preloader-title, .preloader-subtitle', {
        opacity: 1,
        y: 0,
        duration: 1.0,
        stagger: 0.2,
        ease: 'power2.out'
      })
      .to(preloader, {
        opacity: 0,
        duration: 0.8,
        ease: 'power3.inOut',
        delay: 0.8
      })
      // Trigger homepage reveals if on home page
      .from('.hero-badge', { opacity: 0, y: 30, duration: 1.0, ease: 'power3.out' }, '-=0.3')
      .from('.hero-title', { opacity: 0, y: 50, duration: 1.2, ease: 'power4.out' }, '-=0.8')
      .from('.hero-description', { opacity: 0, y: 20, duration: 1.0, ease: 'power3.out' }, '-=0.9')
      .from('.hero-buttons', { opacity: 0, y: 20, duration: 0.8, ease: 'power3.out' }, '-=0.8')
      .from('.hero-card-main', { opacity: 0, scale: 0.95, duration: 1.5, ease: 'power4.out' }, '-=1.2')
      .from('.hero-floating-card-1', { opacity: 0, x: -30, duration: 1.0, ease: 'power3.out' }, '-=1.0')
      .from('.hero-floating-card-2', { opacity: 0, x: 30, duration: 1.0, ease: 'power3.out' }, '-=1.0')
      .from('.luxury-header', { y: -50, opacity: 0, duration: 1.2, ease: 'power3.out' }, '-=1.4');
    } else {
      // Fallback in case GSAP fails to load
      setTimeout(() => {
        preloader.style.opacity = '0';
        document.body.style.overflow = 'auto';
        setTimeout(() => {
          preloader.style.display = 'none';
        }, 800);
      }, 2000);
    }
  });
}

/* =============================================
   3. HEADER / NAVBAR SCROLL EFFECT
   ============================================= */
function initHeaderScroll() {
  const header = document.querySelector('.luxury-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Run once at start
}

/* =============================================
   4. RESPONSIVE MOBILE NAVIGATION
   ============================================= */
function initMobileMenu() {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const overlay = document.querySelector('.mobile-menu-overlay');
  if (!menuBtn || !overlay) return;

  const toggleMenu = () => {
    const isActive = menuBtn.classList.contains('active');
    
    if (!isActive) {
      menuBtn.classList.add('active');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      
      // Animate overlay items
      if (typeof gsap !== 'undefined') {
        gsap.from('.mobile-menu-overlay li', {
          opacity: 0,
          y: 30,
          stagger: 0.1,
          duration: 0.5,
          ease: 'power3.out'
        });
      }
    } else {
      menuBtn.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  };

  menuBtn.addEventListener('click', toggleMenu);

  // Close menu if users click links
  overlay.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuBtn.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = 'auto';
    });
  });
}

/* =============================================
   5. CUSTOM CURSOR & AMBIENT SPOTLIGHT
   ============================================= */
function initCustomCursor() {
  const ambientBlob = document.querySelector('.ambient-glow');
  
  if (!ambientBlob) return;

  // Track mouse coordinates
  document.addEventListener('mousemove', (e) => {
    const x = e.clientX;
    const y = e.clientY;

    if (typeof gsap !== 'undefined') {
      gsap.to(ambientBlob, { x: x, y: y, duration: 0.45, ease: 'power2.out' });
    } else {
      // Fallback
      ambientBlob.style.left = `${x}px`;
      ambientBlob.style.top = `${y}px`;
    }
  });
}

/* =============================================
   6. HERO CARD PARALLAX DRIFT
   ============================================= */
function initHeroTilt() {
  const container = document.querySelector('.hero-card-container');
  const mainCard = document.querySelector('.hero-card-main');
  const floatCard1 = document.querySelector('.hero-floating-card-1');
  const floatCard2 = document.querySelector('.hero-floating-card-2');
  
  if (!container || !mainCard) return;

  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    const normX = x / (rect.width / 2);
    const normY = y / (rect.height / 2);

    if (typeof gsap !== 'undefined') {
      gsap.to(mainCard, {
        rotateY: normX * 8,
        rotateX: -normY * 8,
        x: normX * 8,
        y: normY * 8,
        duration: 0.5,
        ease: 'power2.out'
      });

      if (floatCard1) {
        gsap.to(floatCard1, {
          x: normX * -25,
          y: normY * -25,
          duration: 0.6,
          ease: 'power2.out'
        });
      }

      if (floatCard2) {
        gsap.to(floatCard2, {
          x: normX * 30,
          y: normY * 30,
          duration: 0.6,
          ease: 'power2.out'
        });
      }
    }
  });

  container.addEventListener('mouseleave', () => {
    if (typeof gsap !== 'undefined') {
      gsap.to([mainCard, floatCard1, floatCard2], {
        rotateX: 0,
        rotateY: 0,
        x: 0,
        y: 0,
        duration: 0.8,
        ease: 'power3.out'
      });
    }
  });
}

/* =============================================
   7. INTERACTIVE BEFORE/AFTER SLIDER
   ============================================= */
function initBeforeAfterSlider() {
  const slider = document.querySelector('.comparison-container');
  const handle = document.querySelector('.comparison-handle');
  const afterImgWrapper = document.querySelector('.comparison-after-container');
  const afterImg = document.querySelector('.comparison-after-container .comparison-image');

  if (!slider || !handle || !afterImgWrapper || !afterImg) return;

  // Handle image dimensions sync
  const syncImgSize = () => {
    afterImg.style.width = `${slider.offsetWidth}px`;
  };
  window.addEventListener('resize', syncImgSize);
  syncImgSize();

  const handleDrag = (clientX) => {
    const rect = slider.getBoundingClientRect();
    let position = clientX - rect.left;
    let percentage = (position / rect.width) * 100;

    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;

    handle.style.left = `${percentage}%`;
    afterImgWrapper.style.width = `${percentage}%`;
  };

  const onMouseMove = (e) => {
    handleDrag(e.clientX);
  };

  const onTouchMove = (e) => {
    if (e.touches && e.touches[0]) {
      handleDrag(e.touches[0].clientX);
    }
  };

  handle.addEventListener('mousedown', () => {
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  handle.addEventListener('touchstart', () => {
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

/* =============================================
   8. FILTERABLE PORTFOLIO SHOWCASE
   ============================================= */
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.gallery-filters .filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-masonry .gallery-item');

  if (filterBtns.length === 0 || galleryItems.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active states
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const itemCategories = item.className.split(' ');
        const isMatch = filter === 'all' || itemCategories.includes(filter);

        if (isMatch) {
          if (typeof gsap !== 'undefined') {
            gsap.to(item, {
              scale: 1,
              opacity: 1,
              duration: 0.4,
              display: 'block',
              ease: 'power2.out'
            });
          } else {
            item.style.display = 'block';
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }
        } else {
          if (typeof gsap !== 'undefined') {
            gsap.to(item, {
              scale: 0.9,
              opacity: 0,
              duration: 0.4,
              display: 'none',
              ease: 'power2.out'
            });
          } else {
            item.style.display = 'none';
            item.style.opacity = '0';
            item.style.transform = 'scale(0.9)';
          }
        }
      });
    });
  });
}

/* =============================================
   9. GALLERY LIGHTBOX MODAL
   ============================================= */
function initLightbox() {
  const modal = document.querySelector('.lightbox-modal');
  const modalImg = document.querySelector('.lightbox-content img');
  const closeBtn = document.querySelector('.lightbox-close-btn');
  const items = document.querySelectorAll('.gallery-item');

  if (!modal || !modalImg) return;

  items.forEach(item => {
    item.addEventListener('click', () => {
      const src = item.getAttribute('data-src') || item.querySelector('img').src;
      modalImg.src = src;
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

/* =============================================
   10. ACCORDION FAQ
   ============================================= */
function initAccordionFAQ() {
  const headers = document.querySelectorAll('.accordion-header');
  
  headers.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isActive = item.classList.contains('active');

      // Collapse all other items
      document.querySelectorAll('.accordion-item').forEach(i => {
        i.classList.remove('active');
        const content = i.querySelector('.accordion-content');
        if (content) content.style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add('active');
        const content = item.querySelector('.accordion-content');
        if (content) {
          content.style.maxHeight = `${content.scrollHeight}px`;
        }
      }
    });
  });
}

/* =============================================
   11. LEAFLET MAP (DARK MODE CONFIG)
   ============================================= */
function initLeafletMap() {
  const mapContainer = document.getElementById('contact-map');
  if (!mapContainer || typeof L === 'undefined') return;

  const latlng = [51.5074, -0.1278]; // Mayfair coordinates London
  const map = L.map('contact-map', {
    scrollWheelZoom: false,
    zoomControl: true
  }).setView(latlng, 15);

  // CartoDB Dark Matter tile layer
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
  }).addTo(map);

  // Custom Gold pulsing marker icon
  const pulseHtml = `<div class="w-4 h-4 rounded-full bg-[#d4af37] border-2 border-white shadow-lg animate-pulse" style="width: 14px; height: 14px; background-color: #d4af37; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px rgba(212,175,55,0.7);"></div>`;
  const customIcon = L.divIcon({
    className: 'custom-gold-marker',
    html: pulseHtml,
    iconSize: [14, 14]
  });

  L.marker(latlng, { icon: customIcon }).addTo(map)
    .bindPopup(`
      <div style="text-align:center; padding:5px 0;">
        <h5 style="margin:0 0 3px 0; font-family:'Playfair Display', serif; font-size:12px; font-weight:700; color:#12141a;">Chandan Salon Mayfair</h5>
        <p style="margin:0; font-size:10px; color:#718096;">104 Mayfair Promenade, Suite C</p>
      </div>
    `)
    .openPopup();
}

/* =============================================
   12. DYNAMIC BOOKING WIZARD & LOCALSTORAGE APPOINTMENTS
   ============================================= */
let bookingState = {
  step: 1,
  category: '',
  service: '',
  price: '',
  stylist: '',
  date: '',
  time: '',
  name: '',
  email: '',
  phone: '',
  notes: ''
};

function initBookingWizard() {
  const wizard = document.getElementById('booking-wizard');
  if (!wizard) return;

  const panels = wizard.querySelectorAll('.wizard-step-panel');
  const nextBtn = document.getElementById('wizard-next-btn');
  const prevBtn = document.getElementById('wizard-prev-btn');
  const submitBtn = document.getElementById('wizard-submit-btn');

  // Selectors inside steps
  const serviceCards = wizard.querySelectorAll('.booking-item-card');
  const stylistCards = wizard.querySelectorAll('.booking-stylist-card');
  
  // Date/Time UI containers
  const dateGrid = document.getElementById('booking-date-grid');
  const timeGrid = document.getElementById('booking-time-grid');

  // Summary fields
  const summaryService = document.getElementById('summary-service');
  const summaryStylist = document.getElementById('summary-stylist');
  const summaryDatetime = document.getElementById('summary-datetime');

  // Handle URL pre-selection queries
  const urlParams = new URLSearchParams(window.location.search);
  const queryService = urlParams.get('service');
  const queryStylist = urlParams.get('stylist');

  if (queryService) {
    serviceCards.forEach(card => {
      if (card.getAttribute('data-service') === queryService) {
        selectServiceCard(card);
      }
    });
  }

  if (queryStylist) {
    stylistCards.forEach(card => {
      if (card.getAttribute('data-stylist') === queryStylist) {
        selectStylistCard(card);
      }
    });
  }

  // Populate Dates & Times dynamically
  populateDates(dateGrid);
  populateTimes(timeGrid);

  // Card Selection Events
  serviceCards.forEach(card => {
    card.addEventListener('click', () => selectServiceCard(card));
  });

  stylistCards.forEach(card => {
    card.addEventListener('click', () => selectStylistCard(card));
  });

  function selectServiceCard(card) {
    serviceCards.forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    bookingState.service = card.getAttribute('data-service');
    bookingState.price = card.getAttribute('data-price');
    bookingState.category = card.querySelector('.category').innerText;
    validateWizardState();
  }

  function selectStylistCard(card) {
    stylistCards.forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    bookingState.stylist = card.getAttribute('data-stylist');
    validateWizardState();
  }

  function populateDates(container) {
    if (!container) return;
    container.innerHTML = '';
    
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let count = 0;
    let added = 0;

    while (added < 6) {
      const d = new Date();
      d.setDate(d.getDate() + count);

      // Exclude Sunday (Closed)
      if (d.getDay() !== 0) {
        const dayName = days[d.getDay()];
        const dayNum = d.getDate();
        const monthName = months[d.getMonth()];
        const dateString = `${dayName}, ${monthName} ${dayNum}`;

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'date-btn flex-center flex-direction-column';
        btn.innerHTML = `
          <span>${dayName}</span>
          <span class="day-num">${dayNum} ${monthName}</span>
        `;

        btn.addEventListener('click', () => {
          container.querySelectorAll('.date-btn').forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          bookingState.date = dateString;
          validateWizardState();
        });

        container.appendChild(btn);
        added++;
      }
      count++;
    }
  }

  function populateTimes(container) {
    if (!container) return;
    container.innerHTML = '';

    const slots = ['10:00 AM', '11:30 AM', '01:00 PM', '02:30 PM', '04:00 PM', '05:30 PM'];
    
    slots.forEach(slot => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'time-btn';
      btn.innerText = slot;

      btn.addEventListener('click', () => {
        container.querySelectorAll('.time-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        bookingState.time = slot;
        validateWizardState();
      });

      container.appendChild(btn);
    });
  }

  // Navigation handlers
  nextBtn.addEventListener('click', () => {
    if (bookingState.step < 4) {
      bookingState.step++;
      updateWizardPanels();
    }
  });

  prevBtn.addEventListener('click', () => {
    if (bookingState.step > 1) {
      bookingState.step--;
      updateWizardPanels();
    }
  });

  function updateWizardPanels() {
    panels.forEach((p, idx) => {
      if (idx + 1 === bookingState.step) {
        p.classList.add('active');
      } else {
        p.classList.remove('active');
      }
    });

    // Update wizard progress indicators
    const progressNodes = wizard.querySelectorAll('.wizard-step-node');
    progressNodes.forEach((node, idx) => {
      const nodeStep = idx + 1;
      node.classList.remove('active', 'completed');
      if (nodeStep === bookingState.step) {
        node.classList.add('active');
      } else if (nodeStep < bookingState.step) {
        node.classList.add('completed');
      }
    });

    // Sync summary in Step 4
    if (bookingState.step === 4) {
      if (summaryService) summaryService.innerText = `${bookingState.service} (${bookingState.category})`;
      if (summaryStylist) summaryStylist.innerText = bookingState.stylist || 'Any Master Stylist';
      if (summaryDatetime) summaryDatetime.innerText = `${bookingState.date} @ ${bookingState.time}`;
    }

    validateWizardState();
    
    // Smooth scroll to top of wizard on panel change
    wizard.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function validateWizardState() {
    let isValid = false;

    if (bookingState.step === 1) {
      isValid = bookingState.service !== '';
      nextBtn.style.display = 'inline-block';
      prevBtn.style.display = 'none';
      submitBtn.style.display = 'none';
    } 
    else if (bookingState.step === 2) {
      isValid = bookingState.stylist !== '';
      nextBtn.style.display = 'inline-block';
      prevBtn.style.display = 'inline-block';
      submitBtn.style.display = 'none';
    } 
    else if (bookingState.step === 3) {
      isValid = bookingState.date !== '' && bookingState.time !== '';
      nextBtn.style.display = 'inline-block';
      prevBtn.style.display = 'inline-block';
      submitBtn.style.display = 'none';
    } 
    else if (bookingState.step === 4) {
      const nameVal = document.getElementById('wizard-name').value.trim();
      const emailVal = document.getElementById('wizard-email').value.trim();
      const phoneVal = document.getElementById('wizard-phone').value.trim();
      
      isValid = nameVal !== '' && emailVal !== '' && phoneVal !== '';
      nextBtn.style.display = 'none';
      prevBtn.style.display = 'inline-block';
      submitBtn.style.display = 'inline-block';
    }

    nextBtn.disabled = !isValid;
    submitBtn.disabled = !isValid;
  }

  // Monitor form input changes in Step 4
  const inputs = wizard.querySelectorAll('#wizard-name, #wizard-email, #wizard-phone');
  inputs.forEach(input => {
    input.addEventListener('input', validateWizardState);
  });

  // Final Form Submit Action
  const form = document.getElementById('booking-wizard-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Capture details
      bookingState.name = document.getElementById('wizard-name').value.trim();
      bookingState.email = document.getElementById('wizard-email').value.trim();
      bookingState.phone = document.getElementById('wizard-phone').value.trim();
      bookingState.notes = document.getElementById('wizard-notes').value.trim();

      // Persist in localStorage
      const existingBookings = JSON.parse(localStorage.getItem('chandan-appointments') || '[]');
      existingBookings.push({
        id: Date.now(),
        service: bookingState.service,
        price: bookingState.price,
        stylist: bookingState.stylist,
        date: bookingState.date,
        time: bookingState.time,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('chandan-appointments', JSON.stringify(existingBookings));

      // Go to Step 5 (Success Panel)
      bookingState.step = 5;
      panels.forEach(p => p.classList.remove('active'));
      document.getElementById('wizard-step-5').classList.add('active');
      
      // Hide buttons
      nextBtn.style.display = 'none';
      prevBtn.style.display = 'none';
      submitBtn.style.display = 'none';
      
      // Set progress completed
      const progressNodes = wizard.querySelectorAll('.wizard-step-node');
      progressNodes.forEach(node => node.classList.add('completed'));
    });
  }

  // Trigger initial validation
  validateWizardState();
}

/* =============================================
   13. SUBSCRIPTION / NEWSLETTER
   ============================================= */
function initNewsletterForm() {
  const forms = document.querySelectorAll('.newsletter-form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = form.querySelector('input[type="email"]').value;
      alert(`Welcome to the Chandan Atelier inner circle. Exclusives digest confirmed for: ${email}`);
      form.reset();
    });
  });
}

/* =============================================
   14. CONTACT / INQUIRY FORM
   ============================================= */
function initInquiryForm() {
  const form = document.getElementById('inquiry-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('inquiry-name').value;
    alert(`Thank you, ${name}. Your bespoke luxury consultation inquiry has been forwarded to our atelier staff.`);
    form.reset();
  });
}
