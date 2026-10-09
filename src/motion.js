const root = document.documentElement;
const directory = document.querySelector('#content-directory');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let view;
let articles = [];
let jumps = [];
let positions = [];
let revealElements = [];
let activeId = '';
let frame = 0;
let geometryDirty = true;
let stickyOffset = 0;
let scrollRange = 1;

const reveals = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
  entries.forEach(({target, isIntersecting}) => {
    if (!isIntersecting) return;
    target.classList.add('is-revealed');
    reveals.unobserve(target);
  });
}, {threshold: 0, rootMargin: '0px 0px -24px 0px'}) : null;

function measure() {
  const styles = getComputedStyle(root);
  stickyOffset = ['--header', '--tabs'].reduce((height, property) =>
    height + (parseFloat(styles.getPropertyValue(property)) || 0), 18);
  positions = articles.map(article => {
    const chapter = article.closest('.solution-chapter');
    const target = chapter?.querySelector('article.feature') === article ? chapter : article;
    return target.getBoundingClientRect().top + window.scrollY;
  });
  scrollRange = Math.max(1, root.scrollHeight - window.innerHeight);
  geometryDirty = false;
}

function update() {
  frame = 0;
  if (geometryDirty) measure();
  const progress = Math.max(0, Math.min(1, window.scrollY / scrollRange));
  root.style.setProperty('--reading-progress', progress.toFixed(4));
  let current = 0;
  const readingLine = window.scrollY + stickyOffset + 32;
  for (let index = positions.length - 1; index >= 0; index -= 1) {
    if (positions[index] <= readingLine) { current = index; break; }
  }
  if (progress >= .999 && articles.length) current = articles.length - 1;
  const id = articles[current]?.id || '';
  if (id === activeId) return;
  activeId = id;
  jumps.forEach(button => {
    if (button.dataset.featureTarget === id || button.dataset.featureChapter === articles[current]?.dataset.chapter) button.setAttribute('aria-current', 'location');
    else button.removeAttribute('aria-current');
  });
}

function schedule() {
  if (!frame) frame = requestAnimationFrame(update);
}

function invalidate() {
  geometryDirty = true;
  schedule();
}

const resizeObserver = 'ResizeObserver' in window ? new ResizeObserver(invalidate) : null;

function refresh() {
  reveals?.disconnect();
  resizeObserver?.disconnect();
  // Leaving a route must never leave its readable content awaiting an observer.
  revealElements.forEach(element => element.classList.add('is-revealed'));
  view = document.querySelector('.solution-view:not([hidden])');
  articles = view ? [...view.querySelectorAll('article.feature[id]')] : [];
  jumps = view ? [...view.querySelectorAll('.feature-jump[data-feature-target]'), ...directory.querySelectorAll('.feature-jump[data-feature-target]')] : [];
  revealElements = view ? [...view.querySelectorAll('.solution-heading, article.feature')] : [];
  activeId = '';
  revealElements.forEach(element => {
    if (reducedMotion.matches || !reveals) {
      element.classList.add('is-revealed');
      return;
    }
    element.classList.add('can-reveal');
    if (!element.classList.contains('is-revealed')) reveals.observe(element);
  });
  if (view) resizeObserver?.observe(view);
  invalidate();
}

document.addEventListener('click', event => {
  const button = event.target.closest?.('.feature-jump[data-feature-target]');
  if (!button || (!view?.contains(button) && !directory.contains(button))) return;
  const target = document.getElementById(button.dataset.featureTarget);
  if (!target || !view.contains(target)) return;
  event.preventDefault();
  const fromDirectory = directory.contains(button);
  if (directory.open) directory.close();
  if (geometryDirty) measure();
  target.classList.add('is-revealed');
  // Focus follows keyboard navigation without causing a second browser scroll.
  if (event.detail === 0 || fromDirectory) {
    if (!target.hasAttribute('tabindex')) {
      target.setAttribute('tabindex', '-1');
      target.addEventListener('blur', () => target.removeAttribute('tabindex'), {once: true});
    }
    target.focus({preventScroll: true});
  }
  window.scrollTo({
    top: Math.max(0, target.getBoundingClientRect().top + window.scrollY - stickyOffset),
    behavior: reducedMotion.matches ? 'instant' : 'smooth',
  });
});

window.addEventListener('scroll', schedule, {passive: true});
window.addEventListener('resize', invalidate, {passive: true});
document.addEventListener('load', invalidate, true);
document.addEventListener('solutionchange', refresh);
reducedMotion.addEventListener('change', refresh);
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', refresh, {once: true});
else refresh();
