import { showToast } from './toast.js';
import { renderCurrentPage } from '../../router/router.js';
import { REVIEWS, CATEGORIES, BRANDS, CLASSES } from '../../data/mockData.js';
import { openAuthModal } from '../../auth.js';

export function updateProfileButton() {
  const State = window.State;
  const btn = document.getElementById('profileBtn');
  const btnMobile = document.getElementById('profileBtnMobile');
  
  const renderUser = State.user ? `<div class="w-8 h-8 bg-gradient-to-br from-primary-500 to-amber-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm uppercase">${State.user.name ? State.user.name[0] : (State.user.phone ? State.user.phone[State.user.phone.length - 1] : 'U')}</div>` : null;
  const renderIcon = `<svg class="w-6 h-6 text-surface-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>`;
  const renderIconMobile = `<svg class="w-5 h-5 text-surface-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>`;

  if (btn) {
    btn.innerHTML = State.user ? renderUser : renderIcon;
  }
  if (btnMobile) {
    btnMobile.innerHTML = State.user ? `<div class="w-6 h-6 bg-gradient-to-br from-primary-500 to-amber-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm uppercase">${State.user.name ? State.user.name[0] : (State.user.phone ? State.user.phone[State.user.phone.length - 1] : 'U')}</div>` : renderIconMobile;
  }
}

export function handleLogout() {
  const State = window.State;
  State.user = null;
  window.saveState();
  window.closeAuthModal(); // Will error if closeAuthModal from modals isn't defined, but we moved it to auth.js, we will use it from window
  showToast('Вы вышли из аккаунта', 'info');
  updateProfileButton();
  if (window.location.hash === '#/profile') {
    window.location.hash = '#/';
  }
}

export function openReviewModal(productId) {
  const State = window.State;
  if (!State.user) {
    openAuthModal();
    showToast('Для оставления отзыва необходимо войти', 'warning');
    return;
  }
  const modal = document.getElementById('authModal');
  const content = document.getElementById('authModalContent');
  content.innerHTML = `
    <h2 class="text-xl font-bold text-surface-800 mb-4">Оставить отзыв</h2>
    <form onsubmit="window.submitReview(event, '${productId}')" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-surface-700 mb-1">Оценка</label>
        <div class="flex gap-1" id="reviewStars">
          ${[1,2,3,4,5].map(i => `<button type="button" onclick="window.setReviewRating(${i})" class="review-star w-8 h-8 text-surface-300 hover:text-amber-400 transition-colors" data-rating="${i}"><svg fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg></button>`).join('')}
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium text-surface-700 mb-1">Достоинства</label>
        <input type="text" id="reviewPros" class="w-full px-4 py-3 border border-surface-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent">
      </div>
      <div>
        <label class="block text-sm font-medium text-surface-700 mb-1">Недостатки</label>
        <input type="text" id="reviewCons" class="w-full px-4 py-3 border border-surface-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent">
      </div>
      <div>
        <label class="block text-sm font-medium text-surface-700 mb-1">Комментарий</label>
        <textarea id="reviewComment" rows="3" class="w-full px-4 py-3 border border-surface-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"></textarea>
      </div>
      <button type="submit" class="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors">Отправить отзыв</button>
    </form>
  `;
  modal.classList.remove('hidden');
  window._reviewRating = 0;
}

export function setReviewRating(rating) {
  window._reviewRating = rating;
  document.querySelectorAll('.review-star').forEach((star, i) => {
    star.classList.toggle('text-amber-400', i < rating);
    star.classList.toggle('text-surface-300', i >= rating);
  });
}

export function submitReview(e, productId) {
  const State = window.State;
  e.preventDefault();
  if (!window._reviewRating) {
    showToast('Пожалуйста, поставьте оценку', 'warning');
    return;
  }
  const review = {
    productId,
    author: State.user.name,
    date: new Date().toISOString().split('T')[0],
    rating: window._reviewRating,
    pros: document.getElementById('reviewPros').value,
    cons: document.getElementById('reviewCons').value,
    comment: document.getElementById('reviewComment').value,
  };
  REVIEWS.push(review);
  closeAuthModal();
  showToast('Отзыв опубликован!', 'success');
  renderCurrentPage();
}

export function openCityModal() {
  const modal = document.getElementById('authModal');
  const content = document.getElementById('authModalContent');
  const cities = ['Бишкек', 'Ош', 'Джалал-Абад', 'Каракол', 'Токмок', 'Нарын', 'Талас', 'Баткен'];
  content.innerHTML = `
    <h2 class="text-xl font-bold text-surface-800 mb-4">Выберите город</h2>
    <div class="space-y-2 max-h-60 overflow-y-auto">
      ${cities.map(city => `
        <button onclick="window.selectCity('${city}')" class="w-full text-left px-4 py-3 rounded-xl hover:bg-primary-50 text-surface-700 font-medium transition-colors ${document.getElementById('selectedCity')?.textContent === city ? 'bg-primary-50 text-primary-700' : ''}">
          ${city}
        </button>
      `).join('')}
    </div>
  `;
  modal.classList.remove('hidden');
}

export function selectCity(city) {
  document.getElementById('selectedCity').textContent = city;
  closeAuthModal();
  showToast(`Город изменён: ${city}`, 'info');
}

export function showUsedPhotos(images) {
  const modal = document.getElementById('usedPhotosModal');
  const content = document.getElementById('usedPhotosContent');
  content.innerHTML = `
    <h3 class="text-lg font-bold text-white mb-4">Фото реального устройства</h3>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      ${images.map(img => `<img src="${img}" alt="Фото б/у устройства" class="rounded-xl w-full h-48 object-contain bg-surface-100">`).join('')}
    </div>
  `;
  modal.classList.remove('hidden');
}

export function closeUsedPhotosModal() {
  document.getElementById('usedPhotosModal').classList.add('hidden');
}

export function openOffcanvas() {
  const overlay = document.getElementById('offcanvasOverlay');
  overlay.classList.remove('hidden');
  setTimeout(() => {
    overlay.classList.remove('opacity-0');
    document.getElementById('offcanvasPanel').style.transform = 'translateX(0)';
  }, 10);
}

export function closeOffcanvas() {
  document.getElementById('offcanvasPanel').style.transform = 'translateX(100%)';
  const overlay = document.getElementById('offcanvasOverlay');
  overlay.classList.add('opacity-0');
  const btn = document.getElementById('hamburgerBtn');
  if (btn) btn.classList.remove('hamburger-open');
  setTimeout(() => {
    overlay.classList.add('hidden');
  }, 300);
}

export function renderOffcanvasFilters() {
  const State = window.State;
  const container = document.getElementById('offcanvasFilters');
  if (!container) return;
  document.getElementById('offcanvasTitle').textContent = 'Фильтры';
  document.getElementById('offcanvasFooter').classList.remove('hidden');
  container.innerHTML = `
    <div class="p-4 space-y-5 pb-safe">
      <!-- Class & Category -->
      <div>
        <h4 class="text-sm font-semibold text-surface-700 mb-2">Класс / Тип</h4>
        <div class="space-y-4">
          ${CLASSES.filter(cls => State.filters.class.length === 0 || State.filters.class.includes(cls.id)).map(cls => {
            const catList = CATEGORIES.filter(c => c.classId === cls.id);
            if (catList.length === 0) return '';
            return `
              <div class="border border-transparent rounded-lg overflow-hidden">
                <button onclick="this.nextElementSibling.classList.toggle('hidden'); this.querySelector('.chevron').classList.toggle('rotate-180')" class="w-full flex items-center justify-between bg-surface-50 p-2 text-sm font-bold text-surface-800 hover:bg-surface-100 transition-colors">
                  <span class="flex items-center gap-2 text-primary-600">${cls.name}</span>
                  <svg class="chevron w-4 h-4 text-surface-400 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                </button>
                <div class="px-3 py-2 space-y-1 bg-surface-0 border-t border-transparent">
                  ${catList.map(cat => `
                    <label class="flex items-center gap-2 cursor-pointer text-sm font-bold text-surface-600 py-1 hover:text-surface-800 transition-colors">
                      <input type="checkbox" ${State.filters.category.includes(cat.id)?'checked':''} onchange="window.updateFilter('category','${cat.id}',this.checked)" class="rounded border-surface-300 text-primary-600 focus:ring-primary-500 w-4 h-4">
                      <span class="flex-1 uppercase text-[10px] tracking-tight">${cat.name}</span>
                    </label>
                  `).join('')}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
      <!-- Brand -->
      <div>
        <h4 class="text-sm font-semibold text-surface-700 mb-2">Бренд</h4>
        <div class="space-y-1 max-h-56 overflow-y-auto pr-2 custom-scrollbar">
          ${BRANDS.map(brand => `
            <label class="flex items-center gap-2 py-1.5 cursor-pointer text-sm text-surface-600 hover:text-surface-800 transition-colors">
              <input type="checkbox" ${State.filters.brand.includes(brand.id)?'checked':''} onchange="window.updateFilter('brand','${brand.id}',this.checked)" class="rounded border-surface-300 text-primary-600 focus:ring-primary-500 w-4 h-4">
              ${brand.icon} <span class="flex-1">${brand.name}</span>
            </label>
          `).join('')}
        </div>
      </div>
      <!-- Price -->
      <div>
        <h4 class="text-sm font-semibold text-surface-700 mb-2">Цена, сом</h4>
        <div class="flex gap-2 mb-3">
          <input type="number" placeholder="От" value="${State.filters.priceMin||''}" onchange="window.updateFilter('priceMin',this.value)" class="w-full px-3 py-2 border border-surface-200 rounded-lg text-sm">
          <input type="number" placeholder="До" value="${State.filters.priceMax<999999?State.filters.priceMax:''}" onchange="window.updateFilter('priceMax',this.value)" class="w-full px-3 py-2 border border-surface-200 rounded-lg text-sm">
        </div>
      </div>
      <!-- Condition -->
      <div>
        <h4 class="text-sm font-semibold text-surface-700 mb-2">Состояние</h4>
        <label class="flex items-center gap-2 py-1.5 cursor-pointer text-sm text-surface-600">
          <input type="radio" name="mobile_condition" value="all" ${(!State.filters.condition || State.filters.condition === 'all') ? 'checked' : ''} onchange="window.updateFilter('condition', this.value, this.checked)" class="text-primary-600 focus:ring-primary-500">
          Все
        </label>
        <label class="flex items-center gap-2 py-1.5 cursor-pointer text-sm text-surface-600">
          <input type="radio" name="mobile_condition" value="new" ${State.filters.condition === 'new' ? 'checked' : ''} onchange="window.updateFilter('condition', this.value, this.checked)" class="text-primary-600 focus:ring-primary-500">
          Новые
        </label>
        <label class="flex items-center gap-2 py-1.5 cursor-pointer text-sm text-surface-600">
          <input type="radio" name="mobile_condition" value="used" ${State.filters.condition === 'used' ? 'checked' : ''} onchange="window.updateFilter('condition', this.value, this.checked)" class="text-primary-600 focus:ring-primary-500">
          Б/У
        </label>
      </div>
    </div>
  `;
}

export function applyOffcanvasFilters() {
  const State = window.State;
  window.trackEvent('filter_apply', State.filters);
  closeOffcanvas();
  setTimeout(() => window.renderCurrentPage(), 300);
}

export function toggleMobileMenu() {
  const btn = document.getElementById('hamburgerBtn');
  if (btn) btn.classList.add('hamburger-open'); // We open it from bottom nav, ignore true state of hamburger actually
  openOffcanvas();
  const container = document.getElementById('offcanvasFilters');
  document.getElementById('offcanvasTitle').textContent = 'Меню';
  document.getElementById('offcanvasFooter').classList.add('hidden');
  
  const classCards = CLASSES.map(cls => {
    let icon = '📱';
    if(cls.id === 'accessories') icon = '🎧';
    if(cls.id === 'services') icon = '🛠️';
    if(cls.id === 'parts') icon = '⚙️';
    
    return `
      <a href="#/catalog?class=${cls.id}" onclick="window.closeOffcanvas()" class="ui-island-element flex flex-col items-center justify-center p-4 !rounded-2xl">
        <span class="text-3xl mb-2">${icon}</span>
        <span class="text-xs font-semibold text-surface-700 text-center">${cls.name}</span>
      </a>
    `;
  }).join('');

  container.innerHTML = `
    <div class="px-4 py-4 space-y-6 pb-24">
      
      <div class="ui-island !p-5 !rounded-3xl">
        <div class="flex items-center gap-3 mb-4">
          <h4 class="text-base font-bold text-surface-800 uppercase tracking-tight">Бренды</h4>
        </div>
        <div class="grid grid-cols-3 gap-3">
          <a href="#/catalog?brand=apple" onclick="window.closeOffcanvas()" class="ui-island-element flex flex-col items-center justify-center p-3 !rounded-[1.2rem]">
            <span class="text-[10px] sm:text-xs font-bold text-surface-700 uppercase">Apple</span>
          </a>
          <a href="#/catalog?brand=samsung" onclick="window.closeOffcanvas()" class="ui-island-element flex flex-col items-center justify-center p-3 !rounded-[1.2rem]">
            <span class="text-[10px] sm:text-xs font-bold text-surface-700 uppercase">Samsung</span>
          </a>
          <a href="#/catalog?brand=xiaomi" onclick="window.closeOffcanvas()" class="ui-island-element flex flex-col items-center justify-center p-3 !rounded-[1.2rem]">
            <span class="text-[10px] sm:text-xs font-bold text-surface-700 uppercase">Xiaomi</span>
          </a>
        </div>
      </div>

      <!-- Devices Island -->
      <div class="ui-island !p-5 !rounded-3xl">
        <div class="flex items-center gap-3 mb-4">
          <h4 class="text-base font-bold text-surface-800 uppercase tracking-tight">Устройства</h4>
        </div>
        <div class="grid grid-cols-2 gap-3 mb-3">
          <a href="#/catalog?category=smartphones" onclick="window.closeOffcanvas()" class="ui-island-element flex flex-col items-center justify-center p-3 !rounded-[1.2rem]">
             <span class="text-xs font-bold text-surface-700 uppercase">Смартфоны</span>
          </a>
          <a href="#/catalog?category=phones" onclick="window.closeOffcanvas()" class="ui-island-element flex flex-col items-center justify-center p-3 !rounded-[1.2rem]">
             <span class="text-xs font-bold text-surface-700 uppercase">Кнопочные</span>
          </a>
        </div>
        
        <div class="grid grid-cols-3 gap-2">
          <a href="#/catalog?class=accessories" onclick="window.closeOffcanvas()" class="ui-island-element flex flex-col items-center justify-center p-2 !rounded-xl !bg-surface-0/30">
            <span class="text-[10px] font-bold text-surface-600 uppercase">Аксессуары</span>
          </a>
          <a href="#/catalog?class=services" onclick="window.closeOffcanvas()" class="ui-island-element flex flex-col items-center justify-center p-2 !rounded-xl !bg-surface-0/30">
            <span class="text-[10px] font-bold text-surface-600 uppercase">Услуги</span>
          </a>
          <a href="#/catalog?class=parts" onclick="window.closeOffcanvas()" class="ui-island-element flex flex-col items-center justify-center p-2 !rounded-xl !bg-surface-0/30">
            <span class="text-[10px] font-bold text-surface-600 uppercase">Запчасти</span>
          </a>
        </div>
      </div>

      <!-- Stores Island -->
      <div class="ui-island !p-5 !rounded-3xl">
        <div class="flex items-center gap-3 mb-4">
          <h4 class="text-base font-bold text-surface-800 uppercase tracking-tight">Магазины</h4>
        </div>
        <div class="grid grid-cols-2 gap-3 mb-2">
          <a href="#/catalog?view=sellers" onclick="window.closeOffcanvas()" class="ui-island-element flex flex-col items-center justify-center p-3 !rounded-[1.2rem]">
            <span class="text-sm font-bold text-surface-800 uppercase">iStore</span>
          </a>
          <a href="#/catalog?view=sellers" onclick="window.closeOffcanvas()" class="ui-island-element flex flex-col items-center justify-center p-3 !rounded-[1.2rem]">
            <span class="text-sm font-bold text-surface-800 uppercase">MiStore</span>
          </a>
        </div>
        <a href="#/catalog?view=sellers" onclick="window.closeOffcanvas()" class="block text-center text-xs font-black text-primary-600 py-2 uppercase tracking-widest hover:underline transition-all">Все магазины →</a>
      </div>

      <!-- Categories Small Cards -->
      <div class="ui-island !p-5 !rounded-3xl">
         <h4 class="text-sm font-bold text-surface-800 mb-4 px-1 uppercase tracking-tight">Все категории</h4>
         <div class="grid grid-cols-2 gap-2">
            ${CATEGORIES.map(cat => `
              <a href="#/catalog?category=${cat.id}" onclick="window.closeOffcanvas()" class="ui-island-element flex items-center justify-center p-3 !rounded-xl !bg-surface-0/30">
                <span class="text-[10px] font-bold text-surface-700 leading-tight uppercase text-center">${cat.name}</span>
              </a>
            `).join('')}
         </div>
      </div>

    </div>
  `;
}
