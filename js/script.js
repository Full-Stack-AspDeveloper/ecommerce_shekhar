/* ==================== SHREE VASTRA — script.js ==================== */

(function () {
  'use strict';

  /* ── Header scroll ── */
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  /* ── Mobile nav toggle ── */
  const navToggle = document.getElementById('nav-toggle');
  const mainNav   = document.getElementById('main-nav');
  navToggle.addEventListener('click', () => {
    const open = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
    // Animate hamburger → X
    const spans = navToggle.querySelectorAll('span');
    if (open) {
      spans[0].style.cssText = 'transform:translateY(7px) rotate(45deg)';
      spans[1].style.cssText = 'opacity:0';
      spans[2].style.cssText = 'transform:translateY(-7px) rotate(-45deg)';
    } else {
      spans.forEach(s => s.style.cssText = '');
    }
  });

  // Close nav on link click
  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      document.body.style.overflow = '';
      navToggle.querySelectorAll('span').forEach(s => s.style.cssText = '');
    });
  });

  /* ── Category tabs ── */
  const catTabs   = document.querySelectorAll('.cat-tab');
  const catGrids  = document.querySelectorAll('.cat-grid');
  catTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      catTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = 'cat-' + tab.dataset.cat;
      catGrids.forEach(g => {
        g.classList.toggle('hidden', g.id !== target);
      });
    });
  });

  /* ── Animated counters ── */
  function animateCounter(el, target, duration) {
    let start = 0;
    const step = target / (duration / 16);
    const tick = () => {
      start = Math.min(start + step, target);
      el.textContent = Math.floor(start);
      if (start < target) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  const counters = document.querySelectorAll('.stat-num');
  let countersStarted = false;
  const counterObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !countersStarted) {
      countersStarted = true;
      counters.forEach(c => animateCounter(c, parseInt(c.dataset.target), 1800));
    }
  }, { threshold: 0.4 });

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) counterObserver.observe(statsSection);

  /* ── FAQ accordion ── */
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-q');
    const ans = item.querySelector('.faq-a');
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-a').style.maxHeight = '0';
      });
      if (!isOpen) {
        item.classList.add('open');
        ans.style.maxHeight = ans.scrollHeight + 'px';
      }
    });
  });

  /* ── Gallery lightbox ── */
  const lightbox  = document.getElementById('lightbox');
  const lbClose   = document.getElementById('lb-close');
  const lbImgArea = document.getElementById('lb-img-area');
  const lbCaption = document.getElementById('lb-caption');

  document.querySelectorAll('.gal-item').forEach(item => {
    item.addEventListener('click', () => {
      const bg    = item.style.background;
      const label = item.dataset.label;
      lbImgArea.style.cssText = `background:${bg}; width:100%; max-width:500px; height:320px; border-radius:16px; margin:0 auto 16px;`;
      lbCaption.textContent   = label;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
  lbClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

  /* ── Inquiry form ── */
  const form        = document.getElementById('inquiry-form');
  const formSuccess = document.getElementById('form-success');

  function showError(id, msg) {
    const el = document.getElementById(id);
    if (el) el.textContent = msg;
  }
  function clearErrors() {
    document.querySelectorAll('.err-msg').forEach(e => e.textContent = '');
  }

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      clearErrors();

      const name     = form.name.value.trim();
      const mobile   = form.mobile.value.trim();
      const city     = form.city.value.trim();
      const category = form.category.value;
      let valid = true;

      if (!name) { showError('err-name', 'Please enter your name.'); valid = false; }
      if (!mobile || !/^[6-9]\d{9}$/.test(mobile.replace(/\D/g, ''))) {
        showError('err-mobile', 'Please enter a valid 10-digit Indian mobile number.'); valid = false;
      }
      if (!city) { showError('err-city', 'Please enter your city.'); valid = false; }
      if (!category) { showError('err-category', 'Please select a product category.'); valid = false; }

      if (!valid) return;

      // Build WhatsApp prefill message
      const msg = `Hi Shree Vastra,%0aName: ${encodeURIComponent(name)}%0aMobile: ${encodeURIComponent(mobile)}%0aCity: ${encodeURIComponent(city)}%0aCategory: ${encodeURIComponent(category)}%0aQty: ${encodeURIComponent(form.quantity.value || 'Not specified')}%0aMessage: ${encodeURIComponent(form.message.value || 'Inquiry from website')}`;

      // Show success & auto-redirect to WhatsApp in 1.5s
      form.style.display = 'none';
      formSuccess.style.display = 'block';
      setTimeout(() => {
        window.open(`https://wa.me/918470891902?text=${msg}`, '_blank');
      }, 1500);
    });
  }

  /* ── Scroll-reveal animations ── */
  const revealEls = document.querySelectorAll(
    '.cat-card, .prod-card, .why-card, .testi-card, .stat-item, .gal-item'
  );
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = entry.target.style.transform
          ? entry.target.style.transform.replace('translateY(28px)', 'translateY(0)')
          : 'translateY(0)';
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = `opacity 0.5s ease ${(i % 6) * 0.07}s, transform 0.5s ease ${(i % 6) * 0.07}s`;
    revealObserver.observe(el);
  });

  /* ── Active nav link on scroll ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.main-nav a');
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const link = document.querySelector(`.main-nav a[href="#${entry.target.id}"]`);
        if (link) link.classList.add('active');
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => sectionObserver.observe(s));

  /* ── Show float call button always on mobile ── */
  function handleFloatCall() {
    const floatCall = document.getElementById('float-call');
    if (!floatCall) return;
    if (window.innerWidth <= 600) floatCall.style.display = 'flex';
    else floatCall.style.display = 'none';
  }
  handleFloatCall();
  window.addEventListener('resize', handleFloatCall, { passive: true });

  /* ── Smooth scroll for all anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

})();