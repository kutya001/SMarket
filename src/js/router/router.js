import { renderHomePage } from '../pages/home.js';
import { renderCatalogPage } from '../pages/catalog.js';
import { renderFavoritesPage } from '../pages/favorites.js';
import { renderProductPage } from '../pages/product.js';
import { renderSellerPage } from '../pages/seller.js';
import { renderOfferPage } from '../pages/offer.js';
import { renderProfilePage } from '../pages/profile.js';

export function navigate(path) {
  window.location.hash = path;
}

export function getCurrentRoute() {
  const hash = window.location.hash.slice(1) || '/';
  return hash;
}

export function getRouteParams() {
  const hash = window.location.hash.slice(1) || '/';
  const parts = hash.split('?');
  const path = parts[0];
  const params = {};
  if (parts[1]) {
    parts[1].split('&').forEach(p => {
      const [k, v] = p.split('=');
      if (k) params[k] = decodeURIComponent(v || '');
    });
  }
  return { path, params };
}

export function renderPage() {
  // Clear maps on page change
  if (window._homeMap) {
    window._homeMap.remove();
    window._homeMap = null;
  }
  if (window._currentProductMap) {
    window._currentProductMap.remove();
    window._currentProductMap = null;
  }
  window._currentMapMarkersDict = {};

  const { path, params } = getRouteParams();
  const app = document.getElementById('app');
  window.scrollTo({ top: 0, behavior: 'instant' });

  if (path === '/' || path === '') {
    renderHomePage(app);
  } else if (path === '/catalog') {
    renderCatalogPage(app, params);
  } else if (path === '/favorites') {
    renderFavoritesPage(app);
  } else if (path === '/profile') {
    renderProfilePage(app);
  } else if (path.startsWith('/product/')) {
    const slug = path.replace('/product/', '');
    renderProductPage(app, slug, params);
  } else if (path.startsWith('/seller/')) {
    const id = path.replace('/seller/', '');
    renderSellerPage(app, id, params);
  } else if (path.startsWith('/offer/')) {
    const id = path.replace('/offer/', '');
    renderOfferPage(app, id, params);
  } else {
    renderHomePage(app);
  }
}

export function renderCurrentPage() {
  const { path, params } = getRouteParams();
  const app = document.getElementById('app');
  
  if (path === '/catalog') {
    renderCatalogPage(app, params);
  } else if (path.startsWith('/product/')) {
    const slug = path.replace('/product/', '');
    renderProductPage(app, slug, params);
  } else if (path.startsWith('/seller/')) {
    const id = path.replace('/seller/', '');
    renderSellerPage(app, id, params);
  } else if (path.startsWith('/offer/')) {
    const id = path.replace('/offer/', '');
    renderOfferPage(app, id, params);
  } else if (path === '/favorites') {
    renderFavoritesPage(app);
  } else if (path === '/profile') {
    renderProfilePage(app);
  } else {
    renderHomePage(app);
  }
}

export function initRouter() {
  window.addEventListener('hashchange', () => {
    renderPage();
  });
}
