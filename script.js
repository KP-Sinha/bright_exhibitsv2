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
});