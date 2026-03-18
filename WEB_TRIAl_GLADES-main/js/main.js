/* ============================================================
   GLADES INTERNATIONAL -- UNIFIED MAIN.JS v3.0
   Merged: main.js + script.js + inline scripts from index1.html
   Tasks: Merged JS, Quote Modal, Privacy Modal, Performance
   ============================================================ */
'use strict';

const TRANSITION_MS = 280;

/* ============================================================
   DOM READY
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initScrollAnimations();
  initActiveNav();
  initStickyHeader();
  initContactForm();
  initSuccessHashHandler();
  initFooterYear();
  initCounterAnimation();
  initFacilityTabs();
  initProductCustomizer();
  initScrollReveal();
  initCertScrollReveal();
  initQuoteButtons();
  initContactPrivacyGate();
  preloadImages();
  initShowcaseAutoStart();
});

/* ============================================================
   WINDOW LOAD
   ============================================================ */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) { loader.style.opacity = '0'; setTimeout(() => loader.style.display = 'none', 400); }
});

/* ============================================================
   MOBILE MENU
   ============================================================ */
function initMobileMenu() {
  const btn = document.querySelector('.mobile-menu-btn');
  const nav = document.querySelector('.nav-links');
  if (!btn || !nav) return;

  const open  = () => { nav.classList.add('active'); btn.innerHTML = '<i class="fas fa-times"></i>'; document.body.style.overflow = 'hidden'; };
  const close = () => { nav.classList.remove('active'); btn.innerHTML = '<i class="fas fa-bars"></i>'; document.body.style.overflow = ''; };

  btn.addEventListener('click', () => nav.classList.contains('active') ? close() : open());
  nav.querySelectorAll('a').forEach(l => l.addEventListener('click', close));
  document.addEventListener('click', e => { if (!btn.contains(e.target) && !nav.contains(e.target)) close(); });
}

/* ============================================================
   SCROLL ANIMATIONS
   ============================================================ */
function initScrollAnimations() {
  const els = document.querySelectorAll('.fade-in');
  if (!els.length) return;
  const check = () => els.forEach(el => { if (el.getBoundingClientRect().top < window.innerHeight - 72) el.classList.add('visible'); });
  check();
  window.addEventListener('scroll', check, { passive: true });
}

/* ============================================================
   SCROLL REVEAL -- IntersectionObserver
   ============================================================ */
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = +entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.glass-card, .product-card,.facility-card,.facility-detail-card').forEach((el, i) => {
    if (!el.dataset.revealed) {
      el.dataset.revealed = '1';
      el.style.opacity = '0';
      el.style.transform = 'translateY(22px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      el.dataset.delay = i * 75;
      observer.observe(el);
    }
  });
}

/* ============================================================
   CERT SCROLL REVEAL (index1)
   ============================================================ */
function initCertScrollReveal() {
  function makeIO(cb, opts) {
    if (!('IntersectionObserver' in window)) return null;
    return new IntersectionObserver(cb, Object.assign({ threshold: 0.12, rootMargin: '0px 0px -28px 0px' }, opts || {}));
  }

  const certCards = document.querySelectorAll('.cert-card');
  certCards.forEach(c => c.classList.add('sr-prep'));
  const cIO = makeIO(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const d = +(e.target.dataset.srDelay || 0);
      setTimeout(() => { e.target.classList.remove('sr-prep'); e.target.classList.add('sr-in'); }, d);
      cIO && cIO.unobserve(e.target);
    });
  });
  if (cIO) certCards.forEach(c => cIO.observe(c));
  else certCards.forEach(c => c.classList.remove('sr-prep'));

  const bIO = makeIO(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.remove('sr-prep'); e.target.classList.add('sr-in');
      bIO && bIO.unobserve(e.target);
    });
  }, { threshold: 0.1 });

  ['certReg', 'certStats'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.add('sr-prep');
    if (bIO) bIO.observe(el); else el.classList.remove('sr-prep');
  });

  const panels = document.querySelectorAll('.summary-panel');
  panels.forEach(p => p.classList.add('sr-prep'));
  const pIO = makeIO(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.remove('sr-prep'); e.target.classList.add('sr-visible');
      pIO && pIO.unobserve(e.target);
    });
  });
  if (pIO) panels.forEach(p => pIO.observe(p));
  else panels.forEach(p => p.classList.remove('sr-prep'));

  // Cert big number counters
  const nIO = makeIO(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting || e.target.dataset.counted) return;
      if (e.target.dataset.certCount !== undefined) animateCounter(e.target, +(e.target.dataset.certCount), '');
      if (e.target.dataset.certPct   !== undefined) animateCounter(e.target, +(e.target.dataset.certPct),   '%');
      nIO && nIO.unobserve(e.target);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-cert-count],[data-cert-pct]').forEach(n => { if (nIO) nIO.observe(n); });

  // Dark bg text fix
  document.querySelectorAll('.capabilities-section .cap-item-title').forEach(el => el.style.color = '#fff');
  document.querySelectorAll('.capabilities-section .cap-item-desc').forEach(el => { el.style.color = 'rgba(255,255,255,0.62)'; el.style.opacity = '1'; });

  // Cert card icon hover
  certCards.forEach(c => {
    const ic = c.querySelector('.cert-card-icon i');
    if (!ic) return;
    c.addEventListener('mouseenter', () => { ic.style.transform = 'scale(1.22) rotate(10deg)'; ic.style.transition = 'transform 0.3s cubic-bezier(.23,1,.32,1)'; });
    c.addEventListener('mouseleave', () => { ic.style.transform = ''; });
  });

  // Summary cert badge hover
  document.querySelectorAll('.summary-cert-badge').forEach(b => {
    b.addEventListener('mouseenter', function() { this.style.transform = 'translateY(-2px) scale(1.05)'; });
    b.addEventListener('mouseleave', function() { this.style.transform = ''; });
  });
}

/* ============================================================
   ACTIVE NAV
   ============================================================ */
function initActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === page));
}

/* ============================================================
   STICKY HEADER
   ============================================================ */
function initStickyHeader() {
  const header = document.querySelector('header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.style.boxShadow = window.scrollY > 72 ? '0 5px 24px rgba(14,58,93,0.14)' : '0 2px 20px rgba(14,58,93,0.10)';
  }, { passive: true });
}

/* ============================================================
   CONTACT FORM
   ============================================================ */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!validateForm(form)) return;

    const inquiryType = form.querySelector('#inquiryType, [name="inquiry_type"]');
    const dynSubject  = form.querySelector('#dynamicSubject, [name="_subject"]');
    const iType = inquiryType ? inquiryType.value : '';
    if (dynSubject) dynSubject.value = (iType || 'General') + ' Inquiry - Glades International';

    const emailRoutes = {
      'Investment Opportunity': 'gladesoppotunity@gmail.com',
      'Partnership':            'gladesoppotunity@gmail.com',
      'Product Inquiry':        'gladesinquiry@gmail.com',
      'General Inquiry':        'gladesinquiry@gmail.com',
      'Company Information':    'gladesgeneralinquiry@gmail.com',
      'Other':                  'gladesgeneralinquiry@gmail.com'
    };

    form.action = 'https://formsubmit.co/' + (emailRoutes[iType] || 'gladesgeneralinquiry@gmail.com');
    submitForm(form, 'Thank you for your message! Our team will contact you within 24 hours.', 'contact.html');
  });
}

/* ============================================================
   TASK 4: Contact Page Privacy Gate
   ============================================================ */
function initContactPrivacyGate() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const submitBtn = form.querySelector('button[type="submit"]');
  if (!submitBtn) return;

  submitBtn.addEventListener('click', function(e) {
    if (!form.dataset.privacyAccepted) {
      e.preventDefault();
      if (!validateForm(form)) return;
      showContactPrivacyModal(form);
    }
  });
}

function showContactPrivacyModal(form) {
  let overlay = document.getElementById('contactPrivacyOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'contactPrivacyOverlay';
    overlay.className = 'privacy-overlay';
    overlay.innerHTML = ` <div class="privacy-modal" role="dialog" aria-modal="true" aria-labelledby="cpTitle"> <div class="privacy-modal-header"> <i class="fas fa-shield-alt"></i> <div> <h3 id="cpTitle">Data Privacy Notice</h3> <p>Republic Act 10173 -- Data Privacy Act of 2012</p> </div> </div> <div class="privacy-modal-body"> <div class="privacy-scroll"> <h4>Data Privacy Act of 2012 Compliance</h4> <p>Glades International Corporation ("Glades") is committed to protecting your personal information in accordance with <strong>Republic Act No. 10173</strong>, also known as the <em>Data Privacy Act of 2012</em> of the Philippines.</p> <h4>Information We Collect</h4> <p>When you submit this inquiry form, we collect your name, email address, phone number, company name, and message. This information is used solely to respond to your inquiry and to provide you with information about our products and services.</p> <h4>How We Use Your Information</h4> <p>Your personal data will be used to: (1) process and respond to your inquiries; (2) provide relevant product/service information; (3) maintain records of communications; and (4) comply with legal obligations.</p> <h4>Data Retention</h4> <p>Your personal data will be retained for no longer than necessary for the purposes stated above, or as required by applicable law.</p> <h4>Your Rights</h4> <p>Under the Data Privacy Act of 2012, you have the right to: be informed, object, access, rectify, erase or block, port data, file a complaint, and claim damages. To exercise these rights, contact us at info@gladesinternational.com.</p> <h4>Security</h4> <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p> </div> <label class="privacy-checkbox-row" id="contactPrivacyRow"> <input type="checkbox" id="contactPrivacyCb"> <label for="contactPrivacyCb">I have read and agree to the collection and processing of my personal data by Glades International Corporation in accordance with the <strong>Data Privacy Act of 2012 (RA 10173)</strong>. I understand my data will be used to process my inquiry.</label> </label> <div class="privacy-modal-footer" style="padding:0;"> <button class="privacy-decline-btn" id="contactPrivacyDecline"><i class="fas fa-times"></i> Decline</button> <button class="privacy-accept-btn" id="contactPrivacyAccept"><i class="fas fa-check"></i> I Agree & Submit</button> </div> </div> </div>`;
    document.body.appendChild(overlay);
  }

  requestAnimationFrame(() => overlay.classList.add('show'));

  const cb = overlay.querySelector('#contactPrivacyCb');
  const acceptBtn = overlay.querySelector('#contactPrivacyAccept');
  const declineBtn = overlay.querySelector('#contactPrivacyDecline');
  const row = overlay.querySelector('#contactPrivacyRow');

  cb.addEventListener('change', function() {
    if (this.checked) { acceptBtn.classList.add('enabled'); row.classList.add('checked'); }
    else { acceptBtn.classList.remove('enabled'); row.classList.remove('checked'); }
  });

  acceptBtn.addEventListener('click', () => {
    if (!cb.checked) return;
    overlay.classList.remove('show');
    form.dataset.privacyAccepted = '1';

    const inquiryType = form.querySelector('#inquiryType, [name="inquiry_type"]');
    const dynSubject  = form.querySelector('#dynamicSubject, [name="_subject"]');
    const iType = inquiryType ? inquiryType.value : '';
    if (dynSubject) dynSubject.value = `${iType || 'General'} Inquiry - Glades International`;

    const emailRoutes = {
      'Investment Opportunity': 'gladesoppotunity@gmail.com',
      'Partnership':            'gladesoppotunity@gmail.com',
      'Product Inquiry':        'gladesinquiry@gmail.com',
      'General Inquiry':        'gladesinquiry@gmail.com',
      'Company Information':    'gladesgeneralinquiry@gmail.com',
      'Other':                  'gladesgeneralinquiry@gmail.com'
    };

    const targetEmail = emailRoutes[iType] || 'gladesgeneralinquiry@gmail.com';
    form.action = 'https://formsubmit.co/' + targetEmail;
    submitForm(form, 'Thank you for your message! Our team will contact you within 24 hours.', 'contact.html');
  });

  declineBtn.addEventListener('click', () => { overlay.classList.remove('show'); });
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.classList.remove('show'); });
}

/* ============================================================
   TASK 3: Quote Request Buttons (product.html)
   ============================================================ */
function initQuoteButtons() {
  document.querySelectorAll('.request-quote-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const productName = this.dataset.product || 'Product';
      showQuoteModal(productName);
    });
  });
}

function showQuoteModal(productName) {
  const existing = document.getElementById('quoteOverlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'quoteOverlay';
  overlay.className = 'quote-overlay';
  overlay.innerHTML = `
    <div class="quote-modal" role="dialog" aria-modal="true">
      <div class="quote-modal-header">
        <div>
          <h3>Request a Quote</h3>
          <p id="quoteProductLabel">${productName} inquiry</p>
        </div>
        <button class="quote-modal-close" id="quoteModalClose" aria-label="Close"><i class="fas fa-times"></i></button>
      </div>
      <div class="quote-modal-body">
        <div class="quote-product-badge" id="quoteProductBadge">
          <i class="fas fa-box"></i> <span>${productName}</span>
        </div>
        <form id="quoteForm" method="POST" action="https://formsubmit.co/gladesinquiry@gmail.com" target="_blank">
          <input type="hidden" name="_subject" value="Quote Request: ${productName} - Glades International">
          <input type="hidden" name="_template" value="table">
          <input type="hidden" name="_captcha" value="false">
          <input type="hidden" name="_autoresponse" value="Thank you for your quote request! Our team will contact you within 24 hours.">
          <input type="hidden" name="product" value="${productName}">
          <div class="form-group">
            <label><i class="fas fa-user"></i> Full Name <span class="required">*</span></label>
            <input type="text" name="name" class="form-control" id="quoteName" placeholder="Your full name">
            <span class="error-message" id="quoteNameErr"></span>
          </div>
          <div class="form-group">
            <label><i class="fas fa-envelope"></i> Email Address <span class="required">*</span></label>
            <input type="email" name="email" class="form-control" id="quoteEmail" placeholder="your@email.com">
            <span class="error-message" id="quoteEmailErr"></span>
          </div>
          <div class="form-group">
            <label><i class="fas fa-building"></i> Company <span class="required">*</span></label>
            <input type="text" name="company" class="form-control" id="quoteCompany" placeholder="Your company name">
            <span class="error-message" id="quoteCompanyErr"></span>
          </div>
          <div class="form-group">
            <label><i class="fas fa-comment"></i> Additional Details</label>
            <textarea name="details" class="form-control" id="quoteDetails" rows="3" placeholder="Quantity, specifications, or other details..."></textarea>
          </div>
          <div class="quote-privacy-box">
            <label class="quote-privacy-check" id="quotePrivacyRow">
              <input type="checkbox" id="quotePrivacyCb">
              <span>I agree to the collection and processing of my personal data by Glades International Corporation in accordance with the <strong>Data Privacy Act of 2012 (RA 10173)</strong>.</span>
            </label>
          </div>
          <button type="submit" class="quote-submit-btn" id="quoteSubmitBtn" disabled>
            <i class="fas fa-paper-plane"></i> Send Quote Request
          </button>
        </form>
      </div>
    </div>`;

  document.body.appendChild(overlay);

  overlay.querySelector('#quoteModalClose').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });

  const cb        = overlay.querySelector('#quotePrivacyCb');
  const submitBtn = overlay.querySelector('#quoteSubmitBtn');
  const privacyRow = overlay.querySelector('#quotePrivacyRow');

  cb.addEventListener('change', function() {
    submitBtn.disabled = !this.checked;
    submitBtn.classList.toggle('enabled', this.checked);
    privacyRow.classList.toggle('checked', this.checked);
  });

  const quoteForm = overlay.querySelector('#quoteForm');
  quoteForm.addEventListener('submit', function(e) {
    const name    = overlay.querySelector('#quoteName').value.trim();
    const email   = overlay.querySelector('#quoteEmail').value.trim();
    const company = overlay.querySelector('#quoteCompany').value.trim();
    let valid = true;

    [
      { id: '#quoteName',    errId: '#quoteNameErr',    val: name,    msg: 'Please enter your name.' },
      { id: '#quoteEmail',   errId: '#quoteEmailErr',   val: email,   msg: 'Please enter a valid email.' },
      { id: '#quoteCompany', errId: '#quoteCompanyErr', val: company, msg: 'Please enter your company.' },
    ].forEach(({ id, errId, val, msg }) => {
      const field = overlay.querySelector(id);
      const err   = overlay.querySelector(errId);
      field.classList.remove('error');
      if (err) { err.textContent = ''; err.classList.remove('show'); }
      const emailInvalid = field.type === 'email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
      if (!val || emailInvalid) {
        field.classList.add('error');
        if (err) { err.textContent = msg; err.classList.add('show'); }
        if (valid) field.focus();
        valid = false;
      }
    });

    if (!valid) { e.preventDefault(); return; }

    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    setTimeout(() => overlay.remove(), 400);
  });

  requestAnimationFrame(() => overlay.classList.add('show'));
}

/* ============================================================
   FORM SUBMIT HELPER
   ============================================================ */
function submitForm(form, successMsg, redirect) {
  const btn = form.querySelector('button[type="submit"]');
  const orig = btn?.innerHTML;
  if (btn) { btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...'; btn.disabled = true; }

  fetch(form.action, { method: 'POST', body: new FormData(form) })
    .then(() => { showSuccessPopup(redirect, successMsg); form.reset(); delete form.dataset.privacyAccepted; })
    .catch(() => form.submit())
    .finally(() => { if (btn) { btn.innerHTML = orig; btn.disabled = false; } });
}

/* ============================================================
   FORM VALIDATION
   ============================================================ */
function validateForm(form) {
  let valid = true;
  form.querySelectorAll('.error-message').forEach(el => { el.classList.remove('show'); el.textContent = ''; });
  form.querySelectorAll('.form-control').forEach(el => el.classList.remove('error'));

  form.querySelectorAll('[required]').forEach(field => {
    const val  = field.value.trim();
    const errEl = field.closest('.form-group')?.querySelector('.error-message');
    if (!val) {
      field.classList.add('error');
      if (errEl) { errEl.textContent = 'This field is required.'; errEl.classList.add('show'); }
      if (valid) field.focus();
      valid = false;
    } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      field.classList.add('error');
      if (errEl) { errEl.textContent = 'Please enter a valid email address.'; errEl.classList.add('show'); }
      if (valid) field.focus();
      valid = false;
    }
  });

  return valid;
}

/* ============================================================
   SUCCESS POPUP
   ============================================================ */
function showSuccessPopup(redirectPage, message) {
  let overlay = document.getElementById('successOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'successOverlay';
    overlay.className = 'success-overlay';
    overlay.innerHTML = `<div class="success-modal"><div class="success-icon"><i class="fas fa-check"></i></div><h3>Successfully Sent!</h3><p id="successMessage"></p><p class="success-timer" id="successTimer"></p></div>`;
    document.body.appendChild(overlay);
  }

  const msgEl   = document.getElementById('successMessage');
  const timerEl = document.getElementById('successTimer');
  if (msgEl) msgEl.textContent = message;
  overlay.classList.add('show');

  let countdown = 4;
  if (timerEl) timerEl.textContent = redirectPage ? `Redirecting in ${countdown}s...` : '';

  const iv = setInterval(() => {
    countdown--;
    if (timerEl && redirectPage) timerEl.textContent = `Redirecting in ${countdown}s...`;
    if (countdown <= 0) {
      clearInterval(iv); overlay.classList.remove('show');
      if (redirectPage) setTimeout(() => window.location.href = redirectPage, 300);
    }
  }, 1000);

  overlay.addEventListener('click', e => { if (e.target === overlay) { clearInterval(iv); overlay.classList.remove('show'); } });
}

/* ============================================================
   SUCCESS HASH HANDLER
   ============================================================ */
function initSuccessHashHandler() {
  if (window.location.hash === '#success') {
    history.replaceState(null, null, ' ');
    showSuccessPopup(null, 'Your inquiry has been sent successfully. We will contact you within 24 hours.');
    const form = document.getElementById('contactForm') || document.getElementById('investorForm');
    if (form) form.reset();
  }
}

/* ============================================================
   FOOTER YEAR
   ============================================================ */
function initFooterYear() {
  const yr = new Date().getFullYear();
  const yrEl = document.getElementById('footer-year');
  if (yrEl) { yrEl.textContent = yr; return; }
  document.querySelectorAll('.copyright p').forEach(el => el.innerHTML = el.innerHTML.replace(/\d{4}/, yr));
}

/* ============================================================
   COUNTER ANIMATION
   ============================================================ */
function initCounterAnimation() {
  const counters = document.querySelectorAll('.counter-value,[data-counter]');
  if (!counters.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = '1';
        const raw    = entry.target.textContent.replace(/[^0-9]/g, '');
        const target = +(entry.target.dataset.target || raw);
        const suffix = entry.target.dataset.suffix || (entry.target.textContent.includes('+') ? '+' : '');
        animateCounter(entry.target, target, suffix);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => io.observe(c));
}

function animateCounter(el, target, suffix = '') {
  if (el.dataset.counted && el.dataset.counted !== '1') return;
  el.dataset.counted = 'done';
  const duration = 1500, start = performance.now();
  const step = now => {
    const t = Math.min((now - start) / duration, 1);
    el.textContent = Math.round((1 - Math.pow(1 - t, 3)) * target) + suffix;
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* ============================================================
   SUMMARY STAT COUNTERS
   ============================================================ */
(function() {
  const sIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting || e.target.dataset.counted) return;
      animateCounter(e.target, +(e.target.dataset.target || 0), e.target.dataset.suffix || '');
      sIO.unobserve(e.target);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.summary-stat-val').forEach(v => sIO.observe(v));
})();

/* ============================================================
   FACILITY TABS
   ============================================================ */
function initFacilityTabs() {
  const tabs   = document.querySelectorAll('.facility-tab-btn');
  const panels = document.querySelectorAll('.facility-panel');
  if (!tabs.length) return;

  tabs.forEach(btn => btn.addEventListener('click', () => {
    tabs.forEach(b => b.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    const panel = document.getElementById(`facility-${btn.dataset.facility}`);
    if (panel) panel.classList.add('active');
    document.querySelector('.facilities-section')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }));
}

/* ============================================================
   PRODUCT CUSTOMIZER -- IMPROVED ALGORITHM
   ============================================================ */
function initProductCustomizer() {
  const cards = document.querySelectorAll('.prod-card');
  if (!cards.length) return;

  if (!document.getElementById('_customizerKF')) {
    const s = document.createElement('style');
    s.id = '_customizerKF';
    s.textContent = ` @keyframes ripple {0%{transform:translate(-50%,-50%)scale(0);opacity:1} 100%{transform:translate(-50%,-50%)scale(4);opacity:0} } @keyframes cardShake {0%,100%{transform:translateY(-14px)scale(1.03)rotateZ(1deg)} 25%{transform:translateY(-18px)scale(1.04)rotateZ(2deg)} 50%{transform:translateY(-12px)scale(1.02)rotateZ(0deg)} 75%{transform:translateY(-16px)scale(1.035)rotateZ(1.5deg)} } `;
    document.head.appendChild(s);
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; io.unobserve(e.target); }
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -50px 0px' });

  cards.forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(28px)';
    card.style.transition = `opacity 0.6s ease ${i * 0.08}s, transform 0.6s ease ${i * 0.08}s`;
    io.observe(card);

    const imgWrap = card.querySelector('.product-image');
    if (!imgWrap) return;

    card.querySelectorAll('.options > div').forEach(swatch => {
      swatch.setAttribute('tabindex', '0');
      swatch.setAttribute('role', 'button');
      swatch.setAttribute('aria-label', `Select ${swatch.dataset.color || swatch.title || ''} color`);

      const activate = () => selectColor(card, imgWrap, swatch);
      swatch.addEventListener('click', activate);
      swatch.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); }
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          const siblings = [...card.querySelectorAll('.options >div')];
          const next = e.key === 'ArrowRight' ? siblings[siblings.indexOf(swatch) + 1] : siblings[siblings.indexOf(swatch) - 1];
          if (next) { next.focus(); selectColor(card, imgWrap, next); }
        }
      });
    });

    card.addEventListener('mouseenter', () => applyHover(imgWrap, true));
    card.addEventListener('mouseleave', () => applyHover(imgWrap, false));
    card.addEventListener('mousemove', e => applyParallax(card, imgWrap, e));
  });
}

function selectColor(card, imgWrap, swatch) {
  const color   = swatch.dataset.color;
  const current = imgWrap.querySelector('img.active');
  const target  = color ? imgWrap.querySelector(`img[data-color="${color}"]`) : null;

  if (!target || current === target) return;

  card.querySelectorAll('.options > div').forEach(s => s.classList.remove('active'));
  setTimeout(() => swatch.classList.add('active'), 60);

  card.style.animation = 'cardShake 0.4s ease';
  setTimeout(() => { card.style.animation = ''; }, 420);

  if (current) {
    current.classList.add('fade-out');
    setTimeout(() => { current.classList.remove('active', 'fade-out'); current.style.transform = ''; }, TRANSITION_MS + 180);
  }

  setTimeout(() => {
    target.style.animation = 'none';
    requestAnimationFrame(() => requestAnimationFrame(() => { target.style.animation = ''; target.classList.add('active'); }));
  }, TRANSITION_MS);

  createRipple(swatch);
  createParticleBurst(swatch);
}

window.changeProductColor = function(element, color) {
  const card    = element.closest('.prod-card');
  if (!card) return;
  const imgWrap = card.querySelector('.product-image');
  if (!imgWrap) return;
  element.dataset.color = color;
  selectColor(card, imgWrap, element);
};

function applyHover(imgWrap, entering) {
  const img = imgWrap.querySelector('img.active');
  if (!img) return;
  if (entering) {
    img.style.transform  = 'scale(1.12) translateY(-12px)';
    img.style.filter     = 'drop-shadow(0 25px 50px rgba(0,0,0,.35))';
    img.style.transition = 'all 0.5s cubic-bezier(.23,1,.32,1)';
  } else {
    img.style.transform  = 'scale(1) translateY(0) perspective(1000px)rotateX(0) rotateY(0) translateZ(0)';
    img.style.filter     = 'drop-shadow(0 20px 40px rgba(0,0,0,.25))';
    img.style.transition = 'all 0.5s cubic-bezier(.23,1,.32,1)';
  }
}

function applyParallax(card, imgWrap, e) {
  const img = imgWrap.querySelector('img.active');
  if (!img) return;
  const { left, top, width, height } = card.getBoundingClientRect();
  const rx = ((e.clientY - top  - height / 2) / (height / 2)) * 8;
  const ry = ((e.clientX - left - width  / 2) / (width  / 2)) * -8;
  img.style.transform  = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.12) translateY(-8px) translateZ(30px)`;
  img.style.transition = 'transform 0.12s ease-out, filter 0.3s ease';
  img.style.filter     = 'drop-shadow(0 30px 60px rgba(0,0,0,.4))';
}

function createRipple(el) {
  const r = document.createElement('span');
  const d = Math.max(el.clientWidth, el.clientHeight);
  Object.assign(r.style, {
    width: d + 'px', height: d + 'px', left: '50%', top: '50%',
    transform: 'translate(-50%,-50%)', position: 'absolute',
    borderRadius: '50%', background: 'rgba(255,255,255,0.7)',
    animation: 'ripple 0.6s ease-out', pointerEvents: 'none', zIndex: '10'
  });
  el.style.position = 'relative'; el.style.overflow = 'hidden';
  el.appendChild(r);
  setTimeout(() => r.remove(), 620);
}

function createParticleBurst(el) {
  const { left, top, width, height } = el.getBoundingClientRect();
  const cx = left + width / 2, cy = top + height / 2;
  const colors = ['#0E3A5D', '#2F7FB3', '#E53935', '#ffffff', getComputedStyle(el).backgroundColor];

  for (let i = 0; i < 8; i++) {
    const p = document.createElement('div');
    const angle = (Math.PI * 2 * i) / 8;
    const vel   = 48 + Math.random() * 32;
    Object.assign(p.style, {
      position: 'fixed', left: cx + 'px', top: cy + 'px',
      width: '6px', height: '6px', borderRadius: '50%',
      background: colors[i % colors.length], pointerEvents: 'none',
      zIndex: '1000', boxShadow: '0 0 6px currentColor'
    });
    document.body.appendChild(p);
    p.animate([
      { transform: 'translate(0,0) scale(1)', opacity: 1 },
      { transform: `translate(${Math.cos(angle)*vel}px,${Math.sin(angle)*vel}px) scale(0)`, opacity: 0 }
    ], { duration: 580 + Math.random() * 200, easing: 'cubic-bezier(0.4,0,0.2,1)' }).onfinish = () => p.remove();
  }
}

/* ============================================================
   PRODUCT CATEGORY FILTER
   ============================================================ */
(function initCategoryFilter() {
  const filterBtns   = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => btn.addEventListener('click', function() {
    filterBtns.forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    const cat = this.dataset.category;
    requestAnimationFrame(() => {
      productCards.forEach((card, i) => {
        const show = cat === 'all' || card.dataset.category === cat;
        if (show) {
          card.style.display   = 'flex';
          card.style.opacity   = '0';
          card.style.transform = 'translateY(14px)';
          card.style.transition = `opacity 0.35s ease ${i * 50}ms, transform 0.35s ease ${i * 50}ms`;
          requestAnimationFrame(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; });
        } else {
          card.style.display = 'none';
        }
      });
    });
  }));
})();

/* ============================================================
   PRELOAD IMAGES
   ============================================================ */
function preloadImages() {
  document.querySelectorAll('.product-image img,.prod-card.product-image img').forEach(img => {
    if (img.src) new Image().src = img.src;
  });
}

/* ============================================================
   INDEX1 SHOWCASE AUTO-START
   Polls until Three.js + initShowcase are both ready, then fires.
   Merged from the inline <script> in index1.html.
   ============================================================ */
function initShowcaseAutoStart() {
  if (!document.getElementById('showcase-canvas')) return;

  function tryInit(attempts) {
    if (typeof THREE !== 'undefined' && typeof window.initShowcase === 'function') {
      window.initShowcase();
    } else if (attempts < 60) {
      setTimeout(function () { tryInit(attempts + 1); }, 100);
    }
  }

  if (document.readyState === 'complete') {
    tryInit(0);
  } else {
    window.addEventListener('load', function () { tryInit(0); });
  }
}

/* ============================================================
   INDEX1 3D SHOWCASE (called by initShowcaseAutoStart)
   ============================================================ */
window.initShowcase = function() {
  var MODELS = [
    {file:'ASSET/model_box.glb', name:'Box Container'}
  ];

  var canvas   = document.getElementById('showcase-canvas');
  var dots     = Array.from(document.querySelectorAll('.mdot'));
  var renderer, scene, camera;
  var currentModel=null, currentIdx=0;
  var isHovered=false, isDragging=false;
  var prevMouse={x:0,y:0}, lastTouch=null;
  var timerStart=0, SWITCH_MS=10000, loaderReady=false, animRunning=true;

  if (!canvas) return;

  renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  renderer.outputEncoding = THREE.sRGBEncoding;

  scene  = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45,1,0.01,200);
  camera.position.set(0,0,4);

  scene.add(new THREE.AmbientLight(0xffffff,0.8));
  var d=new THREE.DirectionalLight(0xffffff,1.4); d.position.set(5,8,5); scene.add(d);
  var f=new THREE.DirectionalLight(0x7ab8d4,0.5); f.position.set(-4,-2,3); scene.add(f);

  var _rp=false;
  function resize(){
    if(_rp)return; _rp=true;
    requestAnimationFrame(function(){
      _rp=false; var w=canvas.offsetWidth,h=canvas.offsetHeight;
      if(!w||!h)return;
      renderer.setSize(w,h,false); camera.aspect=w/h; camera.updateProjectionMatrix();
    });
  }
  resize(); window.addEventListener('resize',resize,{passive:true});

  function makeFb(i){
    var gs=[new THREE.BoxGeometry(1.2,.8,1.6),new THREE.BoxGeometry(1.6,.6,1.2),
            new THREE.CylinderGeometry(.5,.42,1.3,32),new THREE.CylinderGeometry(.46,.38,1.1,32),
            new THREE.BoxGeometry(1.1,1.1,1.1)];
    var g=new THREE.Group();
    g.add(new THREE.Mesh(gs[i]||gs[0],new THREE.MeshStandardMaterial({color:0x1F5E8A,metalness:.35,roughness:.45})));
    return g;
  }

  function fitModel(o){
    var b=new THREE.Box3().setFromObject(o),s=b.getSize(new THREE.Vector3()),c=b.getCenter(new THREE.Vector3());
    var m=Math.max(s.x,s.y,s.z)||1; o.scale.setScalar(2.2/m);
    b.setFromObject(o); b.getCenter(c); o.position.sub(c);
  }

  function loadModel(i){
    if(typeof THREE==='undefined'||typeof THREE.GLTFLoader==='undefined'){swap(makeFb(i));return;}
    var L=new THREE.GLTFLoader();
    L.load(MODELS[i].file,function(g){swap(g.scene);},undefined,function(){swap(makeFb(i));});
  }

  function swap(n){if(currentModel){scene.remove(currentModel);currentModel=null;}fitModel(n);currentModel=n;scene.add(n);}

  function switchModel(i){
    currentIdx=((i%MODELS.length)+MODELS.length)%MODELS.length;
    timerStart=performance.now();
    dots.forEach(function(d,j){d.classList.toggle('active',j===currentIdx);});
    if(loaderReady)loadModel(currentIdx);
  }

  function ensureLoader(cb){
    if(typeof THREE!=='undefined' && typeof THREE.GLTFLoader!=='undefined'){loaderReady=true;cb();return;}
    var s=document.createElement('script');
    s.src='https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js';
    s.onerror = function() {
      var s2=document.createElement('script');
      s2.src='https://unpkg.com/three@0.128.0/examples/js/loaders/GLTFLoader.js';
      s2.onload=function(){loaderReady=true;cb();};
      s2.onerror=function(){loaderReady=false;swap(makeFb(currentIdx));};
      document.head.appendChild(s2);
    };
    s.onload=function(){loaderReady=true;cb();};
    s.onerror=function(){loaderReady=false;swap(makeFb(currentIdx));};
    document.head.appendChild(s);
  }

  canvas.addEventListener('mousedown',function(e){isDragging=true;prevMouse={x:e.clientX,y:e.clientY};});
  window.addEventListener('mouseup',function(){isDragging=false;});
  window.addEventListener('mousemove',function(e){
    if(!isDragging||!currentModel)return;
    currentModel.rotation.y+=(e.clientX-prevMouse.x)*.012;
    currentModel.rotation.x+=(e.clientY-prevMouse.y)*.012;
    prevMouse={x:e.clientX,y:e.clientY};
  });

  canvas.addEventListener('mouseenter',function(){isHovered=true;});
  canvas.addEventListener('mouseleave',function(){isHovered=false;isDragging=false;});
  canvas.addEventListener('touchstart',function(e){lastTouch=e.touches[0];},{passive:true});
  canvas.addEventListener('touchmove',function(e){
    if(!currentModel||!lastTouch)return;
    currentModel.rotation.y+=(e.touches[0].clientX-lastTouch.clientX)*.012;
    currentModel.rotation.x+=(e.touches[0].clientY-lastTouch.clientY)*.012;
    lastTouch=e.touches[0]; e.preventDefault();
  },{passive:false});
  canvas.addEventListener('touchend',function(){lastTouch=null;});

  dots.forEach(function(d){d.addEventListener('click',function(){switchModel(parseInt(d.getAttribute('data-i'),10));});});

  document.addEventListener('visibilitychange',function(){animRunning=!document.hidden;if(animRunning)requestAnimationFrame(animate);});

  function animate(now){
    if(!animRunning)return;
    requestAnimationFrame(animate);
    if(currentModel&&!isHovered&&!isDragging){currentModel.rotation.y+=.003;currentModel.rotation.x=Math.sin(now*.0005)*.12;}
    if(now-timerStart>=SWITCH_MS)switchModel(currentIdx+1);
    renderer.render(scene,camera);
  }

  ensureLoader(function(){switchModel(0);});
  requestAnimationFrame(animate);
};
