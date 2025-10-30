// Dieta Positiva Main JS

// ===== Sticky Header =====
const header = document.getElementById('site-header');
let lastScrollY = 0;
window.addEventListener('scroll', () => {
  if(window.scrollY > 30){
    header.classList.add('solid');
  } else {
    header.classList.remove('solid');
  }
});

// ===== Smooth Anchor Scroll =====
function scrollToTarget(target, options = {behavior:'smooth'}){
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if(!el) return;
  const y = el.getBoundingClientRect().top + window.pageYOffset - (header?.offsetHeight || 0);
  window.scrollTo({ top: y, ...options });
}
document.querySelectorAll('[data-scroll-to], .nav__link[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const hash = link.dataset.scrollTo || link.getAttribute('href');
    if(hash && hash.startsWith('#')){
      e.preventDefault();
      scrollToTarget(hash);
      document.querySelectorAll('.nav__link').forEach(a=>a.classList.remove('active'));
      if(link.classList.contains('nav__link')) link.classList.add('active');
    }
  });
});

// ===== IntersectionObserver for [data-animate] =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){ entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  });
},{ threshold: 0.25 });
document.querySelectorAll('[data-animate]').forEach(el=> observer.observe(el));

// ===== Hero Parallax Effect =====
const parallaxText = document.querySelector('.hero__title .parallax');
let lastParallaxY = 0;
window.addEventListener('scroll', () => {
  if(parallaxText && window.scrollY < window.innerHeight){
    parallaxText.style.transform = `translateY(${window.scrollY*0.18}px)`;
  }
}, {passive:true});

// ===== Calendly Modal: Open/Close =====
const calendlyTriggers = document.querySelectorAll('[data-calendly]');
const calendlyModal = document.getElementById('calendly-modal');
if(calendlyModal){
  calendlyTriggers.forEach(btn => {
    btn.addEventListener('click', e => {
      document.body.style.overflow = 'hidden';
      calendlyModal.classList.add('open');
      calendlyModal.setAttribute('aria-hidden', 'false');
      calendlyModal.querySelector('.modal__content').focus();
    });
  });
  calendlyModal.querySelectorAll('[data-close-modal], .modal__close').forEach(el=>{
    el.addEventListener('click', e => {
      calendlyModal.classList.remove('open');
      calendlyModal.setAttribute('aria-hidden','true');
      document.body.style.overflow = '';
    });
  });
  window.addEventListener('keydown', e=>{
    if(e.key==='Escape' && calendlyModal.classList.contains('open')){
      calendlyModal.classList.remove('open');
      calendlyModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  });
}

// ===== Testimonials: Horizontal Scroll Animation =====
if(document.querySelector('.testimonials__list')){
  const testis = document.querySelectorAll('.testimonial-card');
  function checkTestisVisible(){
    testis.forEach(card=>{
      const rect = card.getBoundingClientRect();
      if(rect.left < window.innerWidth && rect.right > 0){
        card.classList.add('visible');
      }
    });
  }
  checkTestisVisible();
  document.querySelector('.testimonials__list').addEventListener('scroll', checkTestisVisible);
  window.addEventListener('resize', checkTestisVisible);
}

// ===== Accessibility: Focus-Trap for Modal =====
function trapFocus(element){
  const focusable = element.querySelectorAll('a, button, textarea, input, select, [tabindex]:not([tabindex="-1"])');
  const first = focusable[0], last = focusable[focusable.length-1];
  element.addEventListener('keydown', function(e){
    if(e.key==='Tab'){
      if(e.shiftKey && document.activeElement===first){ e.preventDefault(); last.focus(); }
      else if(!e.shiftKey && document.activeElement===last){ e.preventDefault(); first.focus(); }
    }
  });
}
if(calendlyModal) trapFocus(calendlyModal.querySelector('.modal__content'));

// ===== Prefers-Reduced-Motion =====
if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.body.classList.add('reduced-motion');
}
