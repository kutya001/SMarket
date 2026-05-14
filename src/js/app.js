import { SELLERS } from './data/mockData.js';
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

function init() {
  updateFavBadge();
  updateProfileButton();
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
