// v10.82: prevent duplicated header name when HTML fragments from different versions coexist.
document.querySelectorAll('.brand-copy').forEach((brand) => {
  brand.querySelectorAll('.brand-name-ja').forEach((name, index) => {
    if (index > 0) name.remove();
  });
});

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
  renderPublicationToggle();
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


// Publication categories: one source of truth for active category and visibility.
const pubFilters = Array.from(document.querySelectorAll('.pub-filter'));
const pubItems = Array.from(document.querySelectorAll('.pub-list-v5 .pub-item'));
const pubMobileToggle = document.querySelector('.pub-mobile-toggle');
const completePubList = document.querySelector('.complete-pub-list');
const publicationMobileQuery = window.matchMedia('(max-width: 760px)');
let activePublicationFilter = 'all';

function renderPublicationToggle() {
  if (!pubMobileToggle || !completePubList) return;
  const isMobile = publicationMobileQuery.matches;
  const isCategory = activePublicationFilter !== 'all';
  const expanded = completePubList.classList.contains('mobile-expanded');
  pubMobileToggle.style.display = isMobile && isCategory ? 'none' : '';
  pubMobileToggle.setAttribute('aria-expanded', String(expanded));
  const isJa = document.documentElement.lang !== 'en';
  pubMobileToggle.textContent = expanded
    ? (isJa ? '業績リストを閉じる' : 'Collapse publication list')
    : (isJa ? '全18件の業績を見る' : 'Show all 18 publications');
}

function selectPublicationCategory(category) {
  activePublicationFilter = category;
  pubFilters.forEach((button) => {
    const active = button.dataset.filter === category;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  pubItems.forEach((item) => {
    const visible = category === 'all' || item.dataset.theme === category;
    item.classList.toggle('is-filtered-out', !visible);
    item.setAttribute('aria-hidden', String(!visible));
  });
  if (completePubList) {
    completePubList.classList.toggle('mobile-expanded', publicationMobileQuery.matches && category !== 'all');
  }
  renderPublicationToggle();
}

pubFilters.forEach((button) => {
  button.addEventListener('click', () => selectPublicationCategory(button.dataset.filter || 'all'));
});

pubMobileToggle?.addEventListener('click', () => {
  if (!publicationMobileQuery.matches || activePublicationFilter !== 'all' || !completePubList) return;
  completePubList.classList.toggle('mobile-expanded');
  renderPublicationToggle();
});

// A category chosen on desktop remains fully visible if the viewport becomes narrow.
publicationMobileQuery.addEventListener('change', () => {
  if (completePubList) {
    completePubList.classList.toggle('mobile-expanded', publicationMobileQuery.matches && activePublicationFilter !== 'all');
  }
  renderPublicationToggle();
});
selectPublicationCategory('all');

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


