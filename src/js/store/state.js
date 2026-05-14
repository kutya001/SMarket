import { showToast } from '../components/ui/toast.js';

export const State = {
  favorites: JSON.parse(localStorage.getItem('tm_favorites') || '[]'),
  user: JSON.parse(localStorage.getItem('tm_user') || 'null'),
  filters: { class: [], category: [], brand: [], seller: [], priceMin: 0, priceMax: 999999, condition: 'all', storage: 'all', color: 'all', search: '' },
  sort: 'popular',
  catalogView: 'products',
  catalogPage: 1,
  catalogLoaded: false,
  heroSlide: 0,
  searchTimeout: null,
};

export function saveState() {
  localStorage.setItem('tm_favorites', JSON.stringify(State.favorites));
  localStorage.setItem('tm_user', JSON.stringify(State.user));
}

export function toggleFavorite(productId) {
  const idx = State.favorites.indexOf(productId);
  if (idx === -1) {
    State.favorites.push(productId);
    showToast('Товар добавлен в избранное', 'success');
  } else {
    State.favorites.splice(idx, 1);
    showToast('Товар удалён из избранного', 'info');
  }
  saveState();
  updateFavBadge();
  window.renderCurrentPage && window.renderCurrentPage();
}

export function isFavorite(productId) {
  return State.favorites.includes(productId);
}

export function updateFavBadge() {
  const bdgs = [
    document.getElementById('favBadge'), 
    document.getElementById('mobileFavBadge'),
    document.getElementById('mobileTopFavBadge')
  ];
  bdgs.forEach(badge => {
    if (!badge) return;
    if (State.favorites.length > 0) {
      badge.textContent = State.favorites.length;
      badge.classList.remove('hidden');
      badge.classList.add('flex');
    } else {
      badge.classList.add('hidden');
      badge.classList.remove('flex');
    }
  });
}
