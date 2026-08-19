const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.nav');
const header = document.querySelector('.site-header');
const langButton = document.querySelector('.lang-button');
let language = localStorage.getItem('siteLanguage') || 'ja';

menuButton?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.nav a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
  });
});

window.addEventListener('scroll', () => {
  header?.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

function applyLanguage() {
  document.documentElement.lang = language;
  document.querySelectorAll('[data-ja][data-en]').forEach((el) => {
    el.innerHTML = el.dataset[language];
  });
  const current = langButton?.querySelector('.lang-current');
  if (current) current.textContent = language === 'ja' ? 'JP' : 'EN';
  if (langButton) langButton.setAttribute('aria-label', language === 'ja' ? 'Switch language to English' : '言語を日本語に切り替える');
  const other = langButton?.querySelectorAll('span')[2];
  if (other) other.textContent = language === 'ja' ? 'EN' : 'JP';
}

applyLanguage();

langButton?.addEventListener('click', () => {
  language = language === 'ja' ? 'en' : 'ja';
  localStorage.setItem('siteLanguage', language);
  applyLanguage();
});

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReducedMotion) {
  document.querySelectorAll('.reveal').forEach((el) => el.classList.add('visible'));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.10 });
  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}


// v5 publication theme filters
const pubFilters = document.querySelectorAll('.pub-filter');
const pubItems = document.querySelectorAll('.pub-list-v5 .pub-item');
pubFilters.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter || 'all';
    pubFilters.forEach((b) => {
      const active = b === button;
      b.classList.toggle('active', active);
      b.setAttribute('aria-pressed', String(active));
    });
    pubItems.forEach((item) => {
      const show = filter === 'all' || item.dataset.theme === filter;
      item.classList.toggle('is-filtered-out', !show);
    });
  });
});


document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    nav?.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
  }
});
window.addEventListener('resize', () => {
  if (window.innerWidth > 1000) { nav?.classList.remove('open'); menuButton?.setAttribute('aria-expanded','false'); }
});


// Close mobile navigation when clicking outside the header.
document.addEventListener('click', (event) => {
  if (!header || !nav?.classList.contains('open')) return;
  if (!header.contains(event.target)) {
    nav.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
  }
});


// v10.66: compact full publication record on mobile.
const pubMobileToggle = document.querySelector('.pub-mobile-toggle');
const completePubList = document.querySelector('.complete-pub-list');
function setMobilePublicationExpanded(expanded) {
  if (!pubMobileToggle || !completePubList) return;
  completePubList.classList.toggle('mobile-expanded', expanded);
  pubMobileToggle.setAttribute('aria-expanded', String(expanded));
  const isJa = document.documentElement.lang !== 'en';
  pubMobileToggle.textContent = expanded
    ? (isJa ? '業績リストを閉じる' : 'Collapse publication list')
    : (isJa ? '全18件の業績を見る' : 'Show all 18 publications');
}
pubMobileToggle?.addEventListener('click', () => {
  setMobilePublicationExpanded(!completePubList?.classList.contains('mobile-expanded'));
});
pubFilters.forEach((button) => {
  button.addEventListener('click', () => {
    if (window.innerWidth <= 760 && button.dataset.filter !== 'all') {
      setMobilePublicationExpanded(true);
    }
  });
});
window.addEventListener('resize', () => {
  if (window.innerWidth > 760) setMobilePublicationExpanded(false);
});
