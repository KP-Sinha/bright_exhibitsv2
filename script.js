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

  // =========================================================
  // 1. STICKY HEADER SCROLL SHADOW & BLUR TRANSITION
  // =========================================================
  const stickyHeader = document.querySelector('.sticky-header');
  if (stickyHeader) {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        stickyHeader.classList.add('scrolled');
      } else {
        stickyHeader.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // =========================================================
  // 2. HERO CINEMATIC ENTRANCE ANIMATION
  // =========================================================
  const heroAnimItems = document.querySelectorAll('.hero-anim-item');
  if (heroAnimItems.length > 0) {
    // If GSAP is loaded, use GSAP for cinematic staggered spring reveal
    if (window.gsap) {
      gsap.to(heroAnimItems, {
        opacity: 1,
        y: 0,
        duration: 1.1,
        stagger: 0.12,
        ease: 'power3.out',
        clearProps: 'transform'
      });
    } else {
      // Fallback CSS trigger
      heroAnimItems.forEach((el) => el.classList.add('is-visible'));
    }
  }

  // =========================================================
  // 3. SCROLL-TRIGGERED REVEAL OBSERVER (IntersectionObserver / GSAP)
  // =========================================================
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (revealElements.length > 0) {
    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      });

      revealElements.forEach((el) => revealObserver.observe(el));
    } else {
      revealElements.forEach((el) => el.classList.add('is-revealed'));
    }
  }

  // =========================================================
  // 4. INTERACTIVE 3D CARD TILT ON POINTER DEVICES
  // =========================================================
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const cards = document.querySelectorAll('.product-card');
    cards.forEach((card) => {
      let isHovered = false;

      card.addEventListener('mouseenter', () => {
        isHovered = true;
      });

      card.addEventListener('mousemove', (e) => {
        if (!isHovered) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-8px)`;
      });

      card.addEventListener('mouseleave', () => {
        isHovered = false;
        card.style.transform = '';
      });
    });
  }

  // =========================================================
  // 5. LENIS SMOOTH SCROLL (Only when supported and compatible)
  // =========================================================
  if (typeof window.Lenis !== 'undefined' && !prefersReducedMotion && window.innerWidth > 850) {
    try {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        smoothTouch: false
      });

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    } catch (err) {
      console.warn('Lenis smooth scroll skipped:', err);
    }
  }

  // =========================================================
  // 6. THREE.JS SPATIAL EXHIBITION HERO SCENE
  // =========================================================
  const canvas = document.getElementById('hero-3d-canvas');
  if (canvas && typeof THREE !== 'undefined' && !prefersReducedMotion) {
    try {
      const container = canvas.parentElement;
      const scene = new THREE.Scene();

      const camera = new THREE.PerspectiveCamera(
        45,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
      );
      camera.position.z = 38;

      const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(container.clientWidth, container.clientHeight);

      // Exhibition Lighting Rig & Geometric Spatial Frames
      const group = new THREE.Group();
      scene.add(group);

      // Primary Warm Terracotta / Copper Ring Frame
      const torusGeometry = new THREE.TorusGeometry(12, 0.28, 16, 80);
      const torusMaterial = new THREE.MeshBasicMaterial({
        color: 0xc85a32,
        wireframe: true,
        transparent: true,
        opacity: 0.35
      });
      const torus = new THREE.Mesh(torusGeometry, torusMaterial);
      torus.rotation.x = Math.PI / 3;
      group.add(torus);

      // Secondary Architectural Gold Frame (Icosahedron / Spatial Lattice)
      const icoGeometry = new THREE.IcosahedronGeometry(15, 1);
      const icoMaterial = new THREE.MeshBasicMaterial({
        color: 0x9e2a2b,
        wireframe: true,
        transparent: true,
        opacity: 0.18
      });
      const icoMesh = new THREE.Mesh(icoGeometry, icoMaterial);
      group.add(icoMesh);

      // Ambient Glowing Particles representing exhibition spotlights & lighting dust
      const particleCount = 45;
      const particleGeometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 60;
        positions[i + 1] = (Math.random() - 0.5) * 40;
        positions[i + 2] = (Math.random() - 0.5) * 30;
      }

      particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const particleMaterial = new THREE.PointsMaterial({
        color: 0xd48834,
        size: 0.45,
        transparent: true,
        opacity: 0.55
      });
      const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
      group.add(particleSystem);

      // Position group slightly toward the right exhibition art area
      group.position.x = 8;
      group.position.y = 0;

      // Pointer interactive subtle reaction
      let mouseX = 0;
      let mouseY = 0;
      let targetX = 0;
      let targetY = 0;

      const onMouseMove = (e) => {
        const windowHalfX = window.innerWidth / 2;
        const windowHalfY = window.innerHeight / 2;
        mouseX = (e.clientX - windowHalfX) * 0.0006;
        mouseY = (e.clientY - windowHalfY) * 0.0006;
      };
      window.addEventListener('mousemove', onMouseMove, { passive: true });

      // Resize listener
      const onResize = () => {
        if (!container) return;
        const width = container.clientWidth;
        const height = container.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };
      window.addEventListener('resize', onResize, { passive: true });

      // Pause rendering when hero is scrolled out of viewport
      let isHeroVisible = true;
      if ('IntersectionObserver' in window) {
        const heroObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            isHeroVisible = entry.isIntersecting;
          });
        });
        heroObserver.observe(container);
      }

      // Animation Loop with restrained, elegant movement
      let animationFrameId;
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);

        if (!isHeroVisible) return;

        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;

        torus.rotation.x += 0.002;
        torus.rotation.y += 0.003;

        icoMesh.rotation.x -= 0.0015;
        icoMesh.rotation.y += 0.002;

        particleSystem.rotation.y += 0.0008;

        group.rotation.y = targetX * 1.5;
        group.rotation.x = targetY * 1.5;

        renderer.render(scene, camera);
      };
      animate();
    } catch (e) {
      console.warn('Three.js hero canvas skipped:', e);
      if (canvas) canvas.style.display = 'none';
    }
  }
});