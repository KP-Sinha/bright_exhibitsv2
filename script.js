// Bright Exhibits Interactive Navigation & Form Handling
document.addEventListener('DOMContentLoaded', () => {
  // Mobile Navigation Hamburger Toggle
  const toggleBtn = document.querySelector('.nav-toggle-btn');
  const mainNav = document.querySelector('.main-nav');

  if (toggleBtn && mainNav) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      mainNav.classList.toggle('show');
      const expanded = mainNav.classList.contains('show');
      toggleBtn.setAttribute('aria-expanded', expanded);
    });
  }

  // Dropdown Mobile / Touch Handling & Keyboard Accessibility
  const dropdowns = document.querySelectorAll('.nav-dropdown');

  dropdowns.forEach((dropdown) => {
    const trigger = dropdown.querySelector('.nav-dropdown-trigger');
    const menu = dropdown.querySelector('.dropdown-menu');

    if (trigger) {
      trigger.addEventListener('click', (e) => {
        // If on mobile or touch device, toggle open
        if (window.innerWidth <= 850 || ('ontouchstart' in window)) {
          e.preventDefault();
          e.stopPropagation();
          dropdown.classList.toggle('open');
          const isOpen = dropdown.classList.contains('open');
          trigger.setAttribute('aria-expanded', isOpen);
        }
      });

      // Keyboard navigation support
      trigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          dropdown.classList.toggle('open');
          const isOpen = dropdown.classList.contains('open');
          trigger.setAttribute('aria-expanded', isOpen);
          if (isOpen && menu) {
            const firstLink = menu.querySelector('a');
            if (firstLink) firstLink.focus();
          }
        } else if (e.key === 'Escape') {
          dropdown.classList.remove('open');
          trigger.setAttribute('aria-expanded', 'false');
          trigger.focus();
        }
      });
    }
  });

  // Nested Submenus (Digital Display Solution)
  const nestedDropdowns = document.querySelectorAll('.nested-dropdown');
  nestedDropdowns.forEach((nested) => {
    const nestedTrigger = nested.querySelector('.nested-trigger');
    if (nestedTrigger) {
      nestedTrigger.addEventListener('click', (e) => {
        if (window.innerWidth <= 850 || ('ontouchstart' in window)) {
          e.preventDefault();
          e.stopPropagation();
          nested.classList.toggle('open');
          const isOpen = nested.classList.contains('open');
          nestedTrigger.setAttribute('aria-expanded', isOpen);
        }
      });
    }
  });

  // Close menus when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.sticky-header')) {
      if (mainNav && mainNav.classList.contains('show') && window.innerWidth <= 850) {
        mainNav.classList.remove('show');
      }
      dropdowns.forEach((d) => d.classList.remove('open'));
      nestedDropdowns.forEach((nd) => nd.classList.remove('open'));
    }
  });

  // Dynamic Year in Footer
  const yearEl = document.querySelector('#current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Retail Displays Category Filter Tabs
  const filterBtns = document.querySelectorAll('.filter-btn');
  const displayCards = document.querySelectorAll('[data-category]');

  if (filterBtns.length > 0 && displayCards.length > 0) {
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');
        displayCards.forEach((card) => {
          if (filter === 'all' || card.getAttribute('data-category') === filter) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // Quote Form WhatsApp Redirect Integration
  const leadForm = document.querySelector('#leadForm');
  if (leadForm) {
    // Check for pre-filled product query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const productParam = urlParams.get('product');
    const productSelect = leadForm.querySelector('select[name="Product"], select[name="Service"]');
    const reqTextarea = leadForm.querySelector('textarea[name="Requirements"]');

    if (productParam) {
      if (reqTextarea && !reqTextarea.value) {
        reqTextarea.value = `Enquiry regarding: ${productParam}`;
      }
      if (productSelect) {
        for (let opt of productSelect.options) {
          if (opt.text.toLowerCase().includes(productParam.toLowerCase()) || productParam.toLowerCase().includes(opt.text.toLowerCase())) {
            opt.selected = true;
            break;
          }
        }
      }
    }

    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(leadForm);
      let text = 'Hello Bright Exhibits, I would like to request a quotation:\n';
      for (const [key, value] of formData.entries()) {
        if (value.trim()) {
          text += `• ${key}: ${value.trim()}\n`;
        }
      }
      const whatsappUrl = `https://wa.me/919886732346?text=${encodeURIComponent(text)}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    });
  }

  // Our Products 3-Card Carousel on Homepage
  const carousel = document.querySelector('[data-carousel="products"]');
  if (carousel) {
    const track = carousel.querySelector('.carousel-track');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    const dotsContainer = carousel.querySelector('.carousel-dots');

    if (track && slides.length > 0) {
      let currentIndex = 0;

      const getVisibleCount = () => {
        if (window.innerWidth <= 680) return 1;
        if (window.innerWidth <= 1024) return 2;
        return 3;
      };

      const getMaxIndex = () => {
        const visible = getVisibleCount();
        return Math.max(0, slides.length - visible);
      };

      const updateDots = () => {
        if (!dotsContainer) return;
        const maxIdx = getMaxIndex();
        dotsContainer.innerHTML = '';
        for (let i = 0; i <= maxIdx; i++) {
          const dot = document.createElement('button');
          dot.className = `carousel-dot ${i === currentIndex ? 'active' : ''}`;
          dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
          dot.addEventListener('click', () => {
            currentIndex = i;
            updateCarousel();
          });
          dotsContainer.appendChild(dot);
        }
      };

      const updateCarousel = () => {
        const maxIdx = getMaxIndex();
        if (currentIndex > maxIdx) currentIndex = maxIdx;
        if (currentIndex < 0) currentIndex = 0;

        const visible = getVisibleCount();
        const slideWidthPercent = 100 / visible;
        const offset = currentIndex * slideWidthPercent;
        track.style.transform = `translateX(-${offset}%)`;

        if (prevBtn) prevBtn.disabled = currentIndex === 0;
        if (nextBtn) nextBtn.disabled = currentIndex >= maxIdx;

        if (dotsContainer) {
          const dots = dotsContainer.querySelectorAll('.carousel-dot');
          dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentIndex);
          });
        }
      };

      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
          }
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          const maxIdx = getMaxIndex();
          if (currentIndex < maxIdx) {
            currentIndex++;
            updateCarousel();
          }
        });
      }

      window.addEventListener('resize', () => {
        updateDots();
        updateCarousel();
      });

      // Touch swipe support
      let touchStartX = 0;
      let touchEndX = 0;
      track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });
      track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
          if (diff > 0 && currentIndex < getMaxIndex()) {
            currentIndex++;
            updateCarousel();
          } else if (diff < 0 && currentIndex > 0) {
            currentIndex--;
            updateCarousel();
          }
        }
      }, { passive: true });

      updateDots();
      updateCarousel();
    }
  }
});