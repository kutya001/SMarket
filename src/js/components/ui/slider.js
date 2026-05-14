export let heroInterval = null;

export function initSlider() {
  clearInterval(heroInterval);
  window.State.heroSlide = 0;
  heroInterval = setInterval(nextSlide, 5000);
}

export function goToSlide(idx) {
  window.State.heroSlide = idx;
  updateSlider();
  clearInterval(heroInterval);
  heroInterval = setInterval(nextSlide, 5000);
}

export function nextSlide() {
  const slides = document.querySelectorAll('.hero-slide');
  if (!slides.length) return;
  window.State.heroSlide = (window.State.heroSlide + 1) % slides.length;
  updateSlider();
}

export function prevSlide() {
  const slides = document.querySelectorAll('.hero-slide');
  if (!slides.length) return;
  window.State.heroSlide = (window.State.heroSlide - 1 + slides.length) % slides.length;
  updateSlider();
}

export function updateSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('[data-dot]');
  slides.forEach((slide, i) => {
    slide.style.transform = i === window.State.heroSlide ? 'translateX(0)' : 'translateX(100%)';
  });
  dots.forEach((dot, i) => {
    dot.className = `w-2.5 h-2.5 rounded-full transition-all ${i === window.State.heroSlide ? 'bg-white w-8' : 'bg-white/40 hover:bg-white/70'}`;
  });
}
