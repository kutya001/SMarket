import { CATEGORIES, BRANDS, SELLERS, OFFERS, VARIANTS, PRODUCTS, CLASSES } from '../data/mockData.js';
import { renderProductCard, renderOfferCard } from '../components/ui/productCard.js';
import { renderCurrentPage } from '../router/router.js';
import { trackEvent } from '../utils/analytics.js';

export function renderCatalogPage(app, params) {
  const State = window.State;
  
  if (params.class) {
    if (!State.filters.class.includes(params.class)) {
      State.filters.category = []; // clear category if class changes
      State.filters.class = [params.class];
    }
    State.catalogView = 'products'; // automatically switch to products view when a class is selected
  } else if (!params.category && !params.brand && !params.seller && !params.search && !params.view) {
    // If no specific view or filter is provided, maybe keep it, or don't do anything
  }
  
  if (params.category) {
    State.filters.category = [params.category];
    const catObj = CATEGORIES.find(c => c.id === params.category);
    if (catObj) State.filters.class = [catObj.classId];
    State.catalogView = 'products';
  }
  if (params.brand) {
    State.filters.brand = [params.brand];
    State.catalogView = 'products';
  }
  if (params.seller) State.filters.seller = [params.seller];
  if (params.search) State.filters.search = params.search;
  if (params.view) State.catalogView = params.view;

  // Clear query params from URL so they don't override State on subsequent renderCurrentPage calls
  if (Object.keys(params).length > 0) {
    history.replaceState(null, '', '#/catalog');
  }

  const filteredProducts = getFilteredProducts();
  const sortedProducts = sortProducts(filteredProducts);
  
  const filteredOffers = getFilteredOffers();
  const sortedOffers = sortOffers(filteredOffers);

  const activeFilters = [];
  Object.entries(State.filters).forEach(([k,v]) => {
     if (k === 'priceMin' && v === 0) return;
     if (k === 'priceMax' && v === 999999) return;
     if (k === 'search' && v === '') return;
     if (k === 'condition' && v === 'all') return;
     if (v === '' || (Array.isArray(v) && v.length === 0)) return;
     
     if (Array.isArray(v)) {
       v.forEach(val => activeFilters.push([k, val]));
     } else {
       activeFilters.push([k, v]);
     }
  });

  const sellersList = SELLERS.sort((a,b) => b.rating - a.rating);

  app.innerHTML = `
    <!-- Breadcrumbs -->
    <div class="max-w-7xl mx-auto px-4 py-3">
      <nav class="flex items-center gap-2 text-sm text-surface-500">
        <a href="#/" class="hover:text-primary-600">Главная</a>
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        <a href="#/catalog" class="hover:text-primary-600">Каталог</a>
        ${params.category ? `
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          <span class="text-surface-800">${CATEGORIES.find(c=>c.id===params.category)?.name || params.category}</span>
        ` : ''}
      </nav>
    </div>

    <div class="max-w-7xl mx-auto px-4 pb-8">
      
      <!-- Catalog Tabs -->
      <div class="flex items-center gap-2 mb-6 bg-surface-100/50 backdrop-blur-xl p-1.5 rounded-xl w-max max-w-full overflow-x-auto border border-transparent custom-scrollbar">
        <button onclick="window.setCatalogView('products')" class="px-5 py-2 text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${State.catalogView === 'products' ? 'bg-surface-0/60 shadow-sm text-primary-700' : 'text-surface-600 hover:text-surface-800'}">Модели</button>
        <button onclick="window.setCatalogView('offers')" class="px-5 py-2 text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${State.catalogView === 'offers' ? 'bg-surface-0/60 shadow-sm text-primary-700' : 'text-surface-600 hover:text-surface-800'}">Предложения продавцов</button>
        <button onclick="window.setCatalogView('sellers')" class="px-5 py-2 text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${State.catalogView === 'sellers' ? 'bg-surface-0/60 shadow-sm text-primary-700' : 'text-surface-600 hover:text-surface-800'}">Продавцы</button>
        <button onclick="window.setCatalogView('brands')" class="px-5 py-2 text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${State.catalogView === 'brands' ? 'bg-surface-0/60 shadow-sm text-primary-700' : 'text-surface-600 hover:text-surface-800'}">Бренды</button>
      </div>

      <div class="flex flex-col md:flex-row gap-6">
        
        <!-- Desktop Sidebar -->
        ${(State.catalogView === 'products' || State.catalogView === 'offers') ? `
        <aside class="hidden md:block w-64 flex-shrink-0">
          <div class="sticky top-20 ui-island !p-5 !rounded-[2rem]">
            <div class="flex flex-col gap-3 mb-5">
              <div class="flex items-center justify-between">
                <h3 class="font-bold text-surface-800 text-lg">Фильтры</h3>
                <button onclick="window.applyFilters()" class="bg-primary-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-primary-700 transition-colors uppercase tracking-widest shadow-sm">Применить</button>
              </div>
              ${activeFilters.length > 0 ? `<button onclick="window.resetAllFilters()" class="text-xs text-primary-600 font-bold hover:text-primary-700 text-left w-fit uppercase tracking-widest">Сбросить всё</button>` : ''}
            </div>

            <!-- Active filters -->
            ${activeFilters.length > 0 ? `
              <div class="flex flex-wrap gap-1.5 mb-5 pb-5 border-b border-surface-200">
                ${activeFilters.map(([k,v]) => `
                  <span class="inline-flex items-center gap-1 bg-primary-50 text-primary-700 text-[10px] px-2 py-1 rounded-lg uppercase font-bold tracking-tight">
                    ${k==='brand'?BRANDS.find(b=>b.id===v)?.name||v:k==='category'?CATEGORIES.find(c=>c.id===v)?.name||v:k==='seller'?SELLERS.find(s=>s.id===v)?.name||v:k==='class'?CLASSES.find(c=>c.id===v)?.name||v:v}
                    <button onclick="window.removeFilter('${k}', '${v}')" class="hover:text-primary-900 w-4 h-4 flex items-center justify-center rounded-full hover:bg-primary-100 transition-colors">×</button>
                  </span>
                `).join('')}
              </div>
            ` : ''}

            <!-- Class & Category filter -->
            <div class="mb-5">
              <h4 class="text-sm font-semibold text-surface-700 mb-2">Класс / Тип</h4>
              <div class="space-y-3">
                ${CLASSES.filter(cls => State.filters.class.length === 0 || State.filters.class.includes(cls.id)).map(cls => {
                  const catList = CATEGORIES.filter(c => c.classId === cls.id);
                  if (catList.length === 0) return '';
                  return `
                    <div class="border border-transparent rounded-lg overflow-hidden">
                      <button onclick="this.nextElementSibling.classList.toggle('hidden'); this.querySelector('.chevron').classList.toggle('rotate-180')" class="w-full flex items-center justify-between bg-surface-0/40 p-2.5 text-xs font-black text-surface-800 hover:bg-surface-100 transition-colors uppercase tracking-widest">
                        <span class="flex items-center gap-2 text-primary-600">${cls.name}</span>
                        <svg class="chevron w-4 h-4 text-surface-400 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                      </button>
                      <div class="px-3 py-2 space-y-1 bg-surface-0/20 border-t border-transparent">
                        ${catList.map(cat => `
                          <label class="flex items-center gap-2 py-1 cursor-pointer text-[11px] font-bold text-surface-600 hover:text-surface-800 group transition-colors uppercase tracking-tight">
                            <input type="checkbox" ${State.filters.category.includes(cat.id)?'checked':''} onchange="window.updateFilter('category','${cat.id}',this.checked)" class="rounded border-surface-300 text-primary-600 focus:ring-primary-500 w-4 h-4">
                            <span class="group-hover:text-primary-600 flex-1">${cat.name}</span>
                          </label>
                        `).join('')}
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>

            <!-- Brand filter -->
            <div class="mb-5">
              <h4 class="text-sm font-semibold text-surface-700 mb-2">Бренд</h4>
              <div class="max-h-56 overflow-y-auto space-y-1 pr-2 custom-scrollbar">
                ${BRANDS.map(brand => `
                  <label class="flex items-center gap-2 py-1 cursor-pointer text-[11px] font-bold text-surface-600 hover:text-surface-800 group transition-colors uppercase tracking-tight">
                    <input type="checkbox" ${State.filters.brand.includes(brand.id)?'checked':''} onchange="window.updateFilter('brand','${brand.id}',this.checked)" class="rounded border-surface-300 text-primary-600 focus:ring-primary-500 w-4 h-4">
                    <span class="flex-1 group-hover:text-primary-600">${brand.name}</span>
                  </label>
                `).join('')}
              </div>
            </div>

            <!-- Price range -->
            <div class="mb-5">
              <h4 class="text-sm font-semibold text-surface-700 mb-3">Цена, сом</h4>
              <div class="flex gap-2 mb-3">
                <input type="number" placeholder="От" value="${State.filters.priceMin||''}" onchange="window.updateFilter('priceMin',this.value)" class="w-full px-3 py-2 border border-surface-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                <input type="number" placeholder="До" value="${State.filters.priceMax<999999?State.filters.priceMax:''}" onchange="window.updateFilter('priceMax',this.value)" class="w-full px-3 py-2 border border-surface-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent">
              </div>
              <input type="range" min="0" max="200000" value="${State.filters.priceMax<999999?State.filters.priceMax:200000}" class="range-slider w-full" oninput="window.updateFilter('priceMax',this.value)">
            </div>

            <!-- Condition -->
            <div class="mb-5">
              <h4 class="text-sm font-semibold text-surface-700 mb-2">Состояние</h4>
              <label class="flex items-center gap-2 py-1 cursor-pointer text-sm text-surface-600 hover:text-surface-800">
                <input type="radio" name="desktop_condition" value="all" ${(!State.filters.condition || State.filters.condition === 'all') ? 'checked' : ''} onchange="window.updateFilter('condition', this.value, this.checked)" class="text-primary-600 focus:ring-primary-500">
                Все
              </label>
              <label class="flex items-center gap-2 py-1 cursor-pointer text-sm text-surface-600 hover:text-surface-800">
                <input type="radio" name="desktop_condition" value="new" ${State.filters.condition === 'new' ? 'checked' : ''} onchange="window.updateFilter('condition', this.value, this.checked)" class="text-primary-600 focus:ring-primary-500">
                Новые
              </label>
              <label class="flex items-center gap-2 py-1 cursor-pointer text-sm text-surface-600 hover:text-surface-800">
                <input type="radio" name="desktop_condition" value="used" ${State.filters.condition === 'used' ? 'checked' : ''} onchange="window.updateFilter('condition', this.value, this.checked)" class="text-primary-600 focus:ring-primary-500">
                Б/У
              </label>
            </div>

            <button onclick="window.applyFilters()" class="w-full bg-primary-600 text-white py-2.5 rounded-xl font-medium hover:bg-primary-700 transition-colors">Применить фильтры</button>
          </div>
        </aside>
        ` : ''}

        <!-- Main content -->
        <div class="flex-1 min-w-0 flex flex-col gap-4">
          
          ${(State.catalogView === 'products' || State.catalogView === 'offers') ? `
            <!-- Toolbar for Products/Offers -->
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-surface-0/60 backdrop-blur-xl p-3 border border-transparent rounded-[2rem] shadow-sm">
              <div class="flex items-center gap-3 flex-wrap">
                <button onclick="window.openOffcanvas()" class="md:hidden flex items-center gap-2 bg-surface-0 border border-surface-200 px-4 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-surface-50 transition-colors">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg>
                  Фильтры
                  ${activeFilters.length > 0 ? `<span class="w-5 h-5 bg-primary-600 text-white rounded-full flex items-center justify-center">${activeFilters.length}</span>` : ''}
                </button>
                <span class="text-sm text-surface-500 hidden sm:inline">Найдено: <strong class="text-surface-800">${State.catalogView === 'offers' ? sortedOffers.length : sortedProducts.length}</strong></span>
              </div>
              <div class="w-full sm:w-auto relative flex items-center gap-2">
                <button onclick="window.applyFilters()" class="md:hidden bg-primary-600 text-white px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap">Применить</button>
                <select onchange="window.State.sort=this.value;window.renderCurrentPage()" class="appearance-none w-full bg-surface-100 border border-transparent rounded-xl pl-4 pr-10 py-2.5 text-xs font-bold uppercase tracking-widest text-surface-700 hover:bg-surface-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors cursor-pointer">
                  <option value="popular" ${State.sort==='popular'?'selected':''}>По популярности</option>
                  <option value="price_asc" ${State.sort==='price_asc'?'selected':''}>Сначала дешёвые</option>
                  <option value="price_desc" ${State.sort==='price_desc'?'selected':''}>Сначала дорогие</option>
                  ${State.catalogView === 'products' ? `<option value="rating" ${State.sort==='rating'?'selected':''}>По рейтингу</option>` : ''}
                  <option value="newest" ${State.sort==='newest'?'selected':''}>Новинки</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-surface-500">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                </div>
              </div>
            </div>

            <!-- Products/Offers Grid Wrappers -->
            <div class="ui-island !p-[2px] sm:!p-2 !rounded-[2rem] md:!rounded-[2.5rem]">
              ${State.catalogView === 'products' ? `
                ${sortedProducts.length > 0 ? `
                  <div class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
                    ${sortedProducts.map(p => renderProductCard(p)).join('')}
                  </div>
                ` : `
                  <div class="text-center py-16">
                    <div class="text-6xl mb-4">🔍</div>
                    <h3 class="text-xl font-bold text-surface-800 mb-2">Товары не найдены</h3>
                    <p class="text-surface-500 mb-4">Попробуйте изменить параметры поиска или фильтры</p>
                    <button onclick="window.resetAllFilters()" class="bg-primary-600 text-white px-6 py-2.5 rounded-xl text-xs uppercase tracking-widest font-black hover:bg-primary-700 transition-colors shadow-sm">Сбросить фильтры</button>
                  </div>
                `}
              ` : `
                ${sortedOffers.length > 0 ? `
                  <div class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
                    ${sortedOffers.map(o => renderOfferCard(o)).join('')}
                  </div>
                ` : `
                  <div class="text-center py-16">
                    <div class="text-6xl mb-4">🔍</div>
                    <h3 class="text-xl font-bold text-surface-800 mb-2">Предложения не найдены</h3>
                    <p class="text-surface-500 mb-4">Попробуйте изменить параметры поиска или фильтры</p>
                    <button onclick="window.resetAllFilters()" class="bg-primary-600 text-white px-6 py-2.5 rounded-xl text-xs uppercase tracking-widest font-black hover:bg-primary-700 transition-colors shadow-sm">Сбросить фильтры</button>
                  </div>
                `}
              `}
            </div>
          ` : State.catalogView === 'sellers' ? `
            <!-- Sellers View -->
            <div class="ui-island !p-[2px] sm:!p-2 !rounded-[2.5rem]">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                ${sellersList.map(seller => renderSellerCard(seller)).join('')}
              </div>
            </div>
          ` : `
            <!-- Brands View -->
            <div class="ui-island !p-[2px] sm:!p-2 !rounded-[2.5rem]">
              <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                ${BRANDS.map(brand => renderBrandCard(brand)).join('')}
              </div>
            </div>
          `}
          
        </div>
      </div>
    </div>
  `;

  if (State.catalogView === 'products' || State.catalogView === 'offers') {
    window.renderOffcanvasFilters();
  }
}

export function setCatalogView(view) {
  window.State.catalogView = view;
  renderCurrentPage();
}

function renderBrandCard(brand) {
  const brandProducts = PRODUCTS.filter(p => p.brand === brand.id);
  return `
    <a href="#/catalog?brand=${brand.id}&view=products" class="ui-island-element flex flex-col items-center justify-center text-center group min-h-[140px]">
      <h3 class="font-black text-surface-800 text-center mb-2 group-hover:text-primary-600 transition-colors uppercase tracking-widest text-sm">${brand.name}</h3>
      <span class="text-[10px] uppercase font-bold text-surface-400 bg-surface-100/50 px-3 py-1 rounded-full">${brandProducts.length} товаров</span>
    </a>
  `;
}

function renderSellerCard(seller) {
  const sellerOffers = OFFERS.filter(o => o.sellerId === seller.id);
  const uniqueProducts = new Set();
  sellerOffers.forEach(o => {
    const v = VARIANTS.find(variant => variant.id === o.variantId);
    if(v) uniqueProducts.add(v.productId);
  });

  return `
    <div class="ui-island-element flex flex-col justify-between !p-5">
      <div>
        <div class="flex gap-4 items-center mb-5 border-b border-surface-200 pb-4">
          <div class="w-14 h-14 bg-surface-100/50 rounded-[1.25rem] flex items-center justify-center text-3xl flex-shrink-0 shadow-sm border border-transparent">${seller.logo}</div>
          <div>
            <h3 class="font-bold text-surface-800 text-lg flex items-center gap-1.5 leading-tight">
              ${seller.name}
              ${seller.isVerified ? '<svg class="w-4 h-4 text-primary-500 drop-shadow-sm" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>' : ''}
            </h3>
            <div class="flex items-center gap-1.5 text-xs text-surface-500 mt-1">
              <span class="text-amber-500 font-black tracking-widest px-1.5 py-0.5 bg-amber-50 rounded-md">${seller.rating} ★</span>
              <span>(${seller.reviewsCount} отз.)</span>
            </div>
          </div>
        </div>
        <div class="text-[11px] font-bold uppercase tracking-tight text-surface-500 mb-2.5 flex items-center gap-2">
          <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          Бишкек
        </div>
        <div class="text-[11px] font-bold uppercase tracking-tight text-surface-500 mb-5 flex items-center gap-2">
          <svg class="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
          ${uniqueProducts.size} товаров
        </div>
      </div>
      <a href="#/seller/${seller.id}" class="block text-center w-full bg-primary-600 text-white py-3 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-primary-700 transition-colors shadow-sm">Смотреть витрину</a>
    </div>
  `;
}

export function getFilteredProducts() {
  const State = window.State;
  let products = [...PRODUCTS];

  if (State.filters.class && State.filters.class.length > 0) {
    const classCategories = CATEGORIES.filter(c => State.filters.class.includes(c.classId)).map(c => c.id);
    products = products.filter(p => classCategories.includes(p.category));
  }
  if (State.filters.category && State.filters.category.length > 0) {
    products = products.filter(p => State.filters.category.includes(p.category));
  }
  if (State.filters.brand && State.filters.brand.length > 0) {
    products = products.filter(p => State.filters.brand.includes(p.brand));
  }
  if (State.filters.seller && State.filters.seller.length > 0) {
    products = products.filter(p => {
      return OFFERS.some(o => {
        const v = VARIANTS.find(vr => vr.id === o.variantId);
        return v && v.productId === p.id && State.filters.seller.includes(o.sellerId);
      });
    });
  }
  if (State.filters.search) {
    const q = State.filters.search.toLowerCase();
    products = products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q)
    );
  }

  if (State.filters.priceMin > 0 || State.filters.priceMax < 999999) {
    products = products.filter(p => {
      const offers = OFFERS.filter(o => {
        const v = VARIANTS.find(vr => vr.id === o.variantId);
        if (State.filters.seller && State.filters.seller.length > 0 && !State.filters.seller.includes(o.sellerId)) return false;
        return v && v.productId === p.id && o.condition === 'NEW';
      });
      const prices = offers.map(o => o.price);
      if (prices.length === 0) return false;
      const minP = Math.min(...prices);
      const maxP = Math.max(...prices);
      if (State.filters.priceMin > 0 && maxP < State.filters.priceMin) return false;
      if (State.filters.priceMax < 999999 && minP > State.filters.priceMax) return false;
      return true;
    });
  }

  if (State.filters.condition === 'new') {
    products = products.filter(p => {
      return OFFERS.some(o => {
        const v = VARIANTS.find(vr => vr.id === o.variantId);
        return v && v.productId === p.id && o.condition === 'NEW';
      });
    });
  } else if (State.filters.condition === 'used') {
    products = products.filter(p => {
      return OFFERS.some(o => {
        const v = VARIANTS.find(vr => vr.id === o.variantId);
        return v && v.productId === p.id && o.condition !== 'NEW';
      });
    });
  }

  return products;
}

export function sortProducts(products) {
  const State = window.State;
  switch (State.sort) {
    case 'price_asc':
      return products.sort((a, b) => {
        const aOffers = OFFERS.filter(o => VARIANTS.find(v => v.id === o.variantId)?.productId === a.id && o.condition === 'NEW');
        const bOffers = OFFERS.filter(o => VARIANTS.find(v => v.id === o.variantId)?.productId === b.id && o.condition === 'NEW');
        const aMin = aOffers.length > 0 ? Math.min(...aOffers.map(o => o.price)) : Infinity;
        const bMin = bOffers.length > 0 ? Math.min(...bOffers.map(o => o.price)) : Infinity;
        return aMin - bMin;
      });
    case 'price_desc':
      return products.sort((a, b) => {
        const aOffers = OFFERS.filter(o => VARIANTS.find(v => v.id === o.variantId)?.productId === a.id && o.condition === 'NEW');
        const bOffers = OFFERS.filter(o => VARIANTS.find(v => v.id === o.variantId)?.productId === b.id && o.condition === 'NEW');
        const aMin = aOffers.length > 0 ? Math.min(...aOffers.map(o => o.price)) : 0;
        const bMin = bOffers.length > 0 ? Math.min(...bOffers.map(o => o.price)) : 0;
        return bMin - aMin;
      });
    case 'rating':
      return products.sort((a, b) => b.rating - a.rating);
    case 'newest':
      return products.filter(p => p.label === 'Новинка').concat(products.filter(p => p.label !== 'Новинка'));
    default:
      return products.sort((a, b) => b.reviewsCount - a.reviewsCount);
  }
}

export function getFilteredOffers() {
  const State = window.State;
  let offers = [...OFFERS];

  if (State.filters.seller && State.filters.seller.length > 0) {
    offers = offers.filter(o => State.filters.seller.includes(o.sellerId));
  }
  
  if (State.filters.condition && State.filters.condition !== 'all') {
    offers = offers.filter(o => o.condition === (State.filters.condition === 'new' ? 'NEW' : 'EXCELLENT')); // simple fallback
  }
  
  if (State.filters.priceMin > 0) {
    offers = offers.filter(o => o.price >= State.filters.priceMin);
  }
  if (State.filters.priceMax < 999999) {
    offers = offers.filter(o => o.price <= State.filters.priceMax);
  }

  // Filter based on product properties
  if (State.filters.class.length > 0 || State.filters.category.length > 0 || State.filters.brand.length > 0 || State.filters.search) {
    const validProductIds = getFilteredProducts().map(p => p.id);
    offers = offers.filter(o => {
      const v = VARIANTS.find(variant => variant.id === o.variantId);
      if (!v) return false;
      return validProductIds.includes(v.productId);
    });
  }

  return offers;
}

export function sortOffers(offers) {
  const State = window.State;
  switch (State.sort) {
    case 'price_asc':
      return offers.sort((a, b) => a.price - b.price);
    case 'price_desc':
      return offers.sort((a, b) => b.price - a.price);
    case 'newest':
      return offers.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    default: 
      return offers.sort((a, b) => a.price - b.price);
  }
}

export function updateFilter(key, value, checked) {
  const State = window.State;
  if (key === 'category' || key === 'brand' || key === 'seller' || key === 'class') {
    if (!Array.isArray(State.filters[key])) State.filters[key] = [];
    if (checked) {
      if (!State.filters[key].includes(value)) State.filters[key].push(value);
    } else {
      State.filters[key] = State.filters[key].filter(v => v !== value);
    }
  } else if (key === 'condition') {
    State.filters[key] = checked ? value : 'all';
  } else {
    State.filters[key] = parseFloat(value) || 0;
    if (key === 'priceMax' && parseFloat(value) >= 999999) State.filters[key] = 999999;
  }
}

export function removeFilter(key, value) {
  const State = window.State;
  if (value !== undefined && Array.isArray(State.filters[key])) {
    State.filters[key] = State.filters[key].filter(v => v !== value);
  } else {
    if (key === 'priceMin') State.filters[key] = 0;
    else if (key === 'priceMax') State.filters[key] = 999999;
    else if (key === 'condition') State.filters[key] = 'all';
    else if (key === 'category' || key === 'brand' || key === 'seller' || key === 'class') State.filters[key] = [];
    else State.filters[key] = '';
  }
  renderCurrentPage();
}

export function applyFilters() {
  const State = window.State;
  trackEvent('filter_apply', State.filters);
  renderCurrentPage();
}

export function resetAllFilters() {
  const State = window.State;
  State.filters = { class: [], category: [], brand: [], seller: [], priceMin: 0, priceMax: 999999, condition: 'all', storage: 'all', color: 'all', search: '' };
  State.sort = 'popular';
  renderCurrentPage();
}
