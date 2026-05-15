import { SELLERS, CLASSES, CATEGORIES, BRANDS } from './data/mockData.js';
import { State, saveState, toggleFavorite, isFavorite, updateFavBadge } from './store/state.js';
import { trackEvent } from './utils/analytics.js';
import { showToast } from './components/ui/toast.js';
import { navigate, initRouter, renderPage, renderCurrentPage } from './router/router.js';
import { initSlider, goToSlide, nextSlide, prevSlide } from './components/ui/slider.js';
import { handleHomeMapSearch, updateHomeMapMarkers, focusMapMarker } from './utils/map.js';
import { setCatalogView, updateFilter, removeFilter, applyFilters, resetAllFilters } from './pages/catalog.js';
import { handleSearch } from './components/ui/search.js';
import { 
  handleLogout, updateProfileButton, openReviewModal, 
  setReviewRating, submitReview, openCityModal, selectCity, showUsedPhotos, 
  closeUsedPhotosModal, openOffcanvas, closeOffcanvas, renderOffcanvasFilters, 
  applyOffcanvasFilters, toggleMobileMenu 
} from './components/ui/modals.js';
import {
  openAuthModal, closeAuthModal, renderPhoneStep, handlePhoneSubmit, renderCodeStep,
  handleCodeSubmit, renderPasswordStep, handlePasswordSubmit, finishAuth,
  continueVerification
} from './auth.js';
import { switchProfileTab, handleProfileUpdate } from './pages/profile.js';
import { switchConditionTab, changeMainImage } from './pages/product.js';
import { showMegaMenu, hideMegaMenu } from './components/ui/megamenu.js';

// Expose state to window for deeply nested functions
window.State = State;

// Expose functions to window for inline HTML onclick handlers
window.saveState = saveState;
window.toggleFavorite = toggleFavorite;
window.isFavorite = isFavorite;
window.updateFavBadge = updateFavBadge;
window.trackEvent = trackEvent;
window.showToast = showToast;
window.navigate = navigate;
window.renderPage = renderPage;
window.renderCurrentPage = renderCurrentPage;
window.initSlider = initSlider;
window.goToSlide = goToSlide;
window.nextSlide = nextSlide;
window.prevSlide = prevSlide;
window.handleHomeMapSearch = handleHomeMapSearch;
window.updateHomeMapMarkers = updateHomeMapMarkers;
window.focusMapMarker = focusMapMarker;
window.setCatalogView = setCatalogView;
window.updateFilter = updateFilter;
window.removeFilter = removeFilter;
window.applyFilters = applyFilters;
window.resetAllFilters = resetAllFilters;
window.handleSearch = handleSearch;

// Auth
window.openAuthModal = openAuthModal;
window.closeAuthModal = closeAuthModal;
window.renderPhoneStep = renderPhoneStep;
window.handlePhoneSubmit = handlePhoneSubmit;
window.renderCodeStep = renderCodeStep;
window.handleCodeSubmit = handleCodeSubmit;
window.renderPasswordStep = renderPasswordStep;
window.handlePasswordSubmit = handlePasswordSubmit;
window.finishAuth = finishAuth;
window.continueVerification = continueVerification;
window.switchProfileTab = switchProfileTab;
window.handleProfileUpdate = handleProfileUpdate;

window.handleSellerContact = function(type, phone, sellerId) {
  const State = window.State;
  if (!State.user) {
    window.openAuthModal();
    window.showToast('Для связи с продавцом необходимо войти или зарегистрироваться', 'warning');
    return;
  }
  
  // Track contact in history
  if (!State.user.history) State.user.history = { purchases: [], contacts: [], browsing: [], chats: [] };
  State.user.history.contacts.push({ sellerId, date: new Date().toISOString().split('T')[0] });
  window.saveState();
  
  if (type === 'whatsapp') {
    window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}`, '_blank');
  } else if (type === 'phone') {
    window.location.href = `tel:${phone.replace(/\\s+/g, '')}`;
  }
};

window.handleLogout = handleLogout;
window.updateProfileButton = updateProfileButton;
window.openReviewModal = openReviewModal;
window.setReviewRating = setReviewRating;
window.submitReview = submitReview;
window.openCityModal = openCityModal;
window.selectCity = selectCity;
window.showUsedPhotos = showUsedPhotos;
window.closeUsedPhotosModal = closeUsedPhotosModal;
window.openOffcanvas = openOffcanvas;
window.closeOffcanvas = closeOffcanvas;
window.renderOffcanvasFilters = renderOffcanvasFilters;
window.applyOffcanvasFilters = applyOffcanvasFilters;
window.toggleMobileMenu = toggleMobileMenu;
window.switchConditionTab = switchConditionTab;
window.changeMainImage = changeMainImage;
window.showMegaMenu = showMegaMenu;
window.hideMegaMenu = hideMegaMenu;

function renderDesktopNav() {
  const desktopNav = document.getElementById('desktopNav');
  if (!desktopNav) return;

  let html = '';

  // 1. Classes -> Categories
  CLASSES.forEach(cls => {
    const classCats = CATEGORIES.filter(c => c.classId === cls.id);
    if (classCats.length === 0) return;
    
    html += `
      <div class="group relative">
        <a href="#/catalog?class=${cls.id}" class="flex items-center justify-center px-3 py-1.5 rounded-full text-sm font-bold text-surface-700 hover:bg-surface-200/50 transition-colors">
          ${cls.name}
        </a>
        <div class="absolute left-1/2 -translate-x-1/2 top-full pt-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-48 z-[60]">
          <div class="floating-dropdown shadow-2xl rounded-2xl p-1.5 flex flex-col gap-0.5 bg-surface-0 border border-surface-200/50">
            ${classCats.map(cat => `
              <a href="#/catalog?category=${cat.id}" class="px-3 py-2 rounded-xl text-xs font-bold text-surface-700 hover:bg-surface-200/40 transition-colors">${cat.name}</a>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  });

  html += `<div class="w-px h-4 bg-surface-200 mx-1 hidden lg:block"></div>`;

  // 2. Brands
  const topBrands = BRANDS.slice(0, 3);
  html += `
    <div class="group relative">
      <a href="#/catalog?view=brands" class="flex items-center justify-center px-3 py-1.5 rounded-full text-sm font-bold text-surface-700 hover:bg-surface-200/50 transition-colors">
        Бренды
      </a>
      <div class="absolute left-1/2 -translate-x-1/2 top-full pt-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-44 z-[60]">
        <div class="floating-dropdown shadow-2xl rounded-2xl p-1.5 flex flex-col gap-0.5 bg-surface-0 border border-surface-200/50">
          ${topBrands.map(b => `
            <a href="#/catalog?brand=${b.id}" class="px-3 py-2 rounded-xl text-xs font-bold text-surface-700 hover:bg-surface-200/40 transition-colors">${b.name}</a>
          `).join('')}
          <a href="#/catalog?view=brands" class="px-3 py-2 mt-1 rounded-xl text-xs font-black text-primary-600 hover:bg-primary-50 transition-colors text-center border-t border-surface-200/10">Все бренды</a>
        </div>
      </div>
    </div>
  `;

  // 3. Sellers
  // Show standard stores plus Mvideo
  const topSellers = SELLERS.filter(s => ['s1', 's2', 's13', 's14'].includes(s.id));
  html += `
    <div class="group relative">
      <a href="#/catalog?view=sellers" class="flex items-center justify-center px-3 py-1.5 rounded-full text-sm font-bold text-surface-700 hover:bg-surface-200/50 transition-colors">
        Магазины
      </a>
      <div class="absolute left-1/2 -translate-x-1/2 top-full pt-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-52 z-[60]">
        <div class="floating-dropdown shadow-2xl rounded-2xl p-1.5 flex flex-col gap-0.5 bg-surface-0 border border-surface-200/50">
          ${topSellers.map(s => `
            <a href="#/seller/${s.id}" class="px-3 py-2 rounded-xl text-xs font-bold text-surface-700 hover:bg-surface-200/40 transition-colors">${s.name}</a>
          `).join('')}
          <a href="#/catalog?view=sellers" class="px-3 py-2 mt-1 rounded-xl text-xs font-black text-amber-600 hover:bg-amber-50 transition-colors text-center border-t border-surface-200/10">Посмотреть все</a>
        </div>
      </div>
    </div>
  `;

  desktopNav.innerHTML = html;
}

function init() {
  updateFavBadge();
  updateProfileButton();
  renderDesktopNav();
  initRouter();
  renderPage();

  document.addEventListener('click', (e) => {
    if (!e.target.closest('#searchContainer')) {
      const dropdown = document.getElementById('searchDropdown');
      if(dropdown) dropdown.classList.remove('show');
    }
    if (!e.target.closest('#mobileSearchContainer')) {
      const mobileDropdown = document.getElementById('mobileSearchDropdown');
      if(mobileDropdown) mobileDropdown.classList.remove('show');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      window.closeAuthModal();
      window.closeUsedPhotosModal();
      window.closeOffcanvas();
    }
  });

  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const header = document.getElementById('mainHeader');
    if (header) {
      if (window.scrollY > 10) {
        header.classList.add('shadow-md');
      } else {
        header.classList.remove('shadow-md');
      }
    }
    lastScroll = window.scrollY;
  }, { passive: true });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
