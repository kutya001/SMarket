import { PRODUCTS, CATEGORIES, SELLERS } from '../data/mockData.js';
import { renderProductCard } from '../components/ui/productCard.js';
import { initHomeMap } from '../utils/map.js';

export function renderHomePage(app) {
  const heroImages = [
    'https://image.qwenlm.ai/public_source/3b29826f-5bca-49bd-b528-0bbb6460e7d6/147961520-e687-47d3-acca-0f35d1536a31.png',
    'https://image.qwenlm.ai/public_source/3b29826f-5bca-49bd-b528-0bbb6460e7d6/1d5f464bb-87e5-4a1e-95b0-66c0a18f289b.png',
    'https://image.qwenlm.ai/public_source/3b29826f-5bca-49bd-b528-0bbb6460e7d6/1fdc06e62-55f8-4743-a7ed-5e85a6458559.png',
  ];
  const heroTexts = [
    { title:'iPhone 17 Pro', subtitle:'Революция в фотографии', cta:'Подробнее', link:'#/product/apple-iphone-17-pro' },
    { title:'Galaxy S25 Ultra', subtitle:'Мощь в каждой детали', cta:'Подробнее', link:'#/product/samsung-galaxy-s25-ultra' },
    { title:'Xiaomi 15 Pro', subtitle:'Флагман по доступной цене', cta:'Подробнее', link:'#/product/xiaomi-15-pro' },
  ];

  const trendingProducts = PRODUCTS.filter(p => p.rating >= 4.7).slice(0, 6);
  const dealsProducts = PRODUCTS.filter(p => p.label === 'Выгодно');

  app.innerHTML = `
    <!-- Hero Slider -->
    <section class="relative overflow-hidden bg-surface-900">
      <div class="relative h-[300px] sm:h-[400px] md:h-[500px]">
        ${heroImages.map((img, i) => `
          <div class="hero-slide absolute inset-0 ${i === 0 ? '' : 'translate-x-full'}" data-slide="${i}">
            <div class="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent z-10"></div>
            <img src="${img}" alt="${heroTexts[i].title}" class="w-full h-full object-cover" loading="${i===0?'eager':'lazy'}">
            <div class="absolute inset-0 z-20 flex items-center max-w-7xl mx-auto px-4 md:px-8">
              <div class="animate-slideUp max-w-lg">
                <span class="inline-block bg-accent-500/20 text-accent-400 text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">Новинка 2026</span>
                <h1 class="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-3">${heroTexts[i].title}</h1>
                <p class="text-surface-300 text-base sm:text-lg md:text-xl mb-6">${heroTexts[i].subtitle}</p>
                <a href="${heroTexts[i].link}" class="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors">
                  ${heroTexts[i].cta}
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                </a>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
      <div class="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
        ${heroImages.map((_, i) => `<button onclick="window.goToSlide(${i})" class="w-2.5 h-2.5 rounded-full transition-all ${i === 0 ? 'bg-white w-8' : 'bg-white/40 hover:bg-white/70'}" data-dot="${i}"></button>`).join('')}
      </div>
      <button onclick="window.prevSlide()" class="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-white/10 backdrop-blur rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
      </button>
      <button onclick="window.nextSlide()" class="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-white/10 backdrop-blur rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </button>
    </section>

    <!-- Categories -->
    <section class="max-w-7xl mx-auto px-4 py-6 md:py-8">
      <h2 class="text-2xl font-bold text-surface-800 mb-6">Популярные категории</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-4">
        ${CATEGORIES.map(cat => `
          <a href="#/catalog?category=${cat.id}" class="group bg-surface-0 rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 border border-surface-100">
            <div class="text-3xl mb-2 text-center">${cat.icon}</div>
            <p class="text-sm font-medium text-surface-700 text-center group-hover:text-primary-600 transition-colors">${cat.name}</p>
          </a>
        `).join('')}
      </div>
    </section>

    <!-- Trending Products -->
    <section class="max-w-7xl mx-auto px-4 py-6 md:py-10">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-surface-800">🔥 Популярные товары</h2>
        <a href="#/catalog" class="text-primary-600 text-sm font-medium hover:text-primary-700 flex items-center gap-1">
          Все товары <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </a>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
        ${trendingProducts.map(p => renderProductCard(p)).join('')}
      </div>
    </section>

    <!-- Deals -->
    ${dealsProducts.length > 0 ? `
    <section class="max-w-7xl mx-auto px-4 py-6 md:py-10">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-surface-800">💰 Выгодно</h2>
        <a href="#/catalog?label=deals" class="text-primary-600 text-sm font-medium hover:text-primary-700 flex items-center gap-1">
          Все акции <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </a>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
        ${dealsProducts.map(p => renderProductCard(p)).join('')}
      </div>
    </section>
    ` : ''}

    <!-- Popular Sellers -->
    <section class="max-w-7xl mx-auto px-4 py-8">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-surface-800">Популярные продавцы</h2>
        <a href="#/catalog?view=sellers" class="text-primary-600 font-medium hover:text-primary-700 hover:underline">Все продавцы</a>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        ${SELLERS.slice(0, 3).map(seller => `
          <a href="#/seller/${seller.id}" class="bg-surface-0 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all border border-surface-100 flex items-center gap-4 group">
            <div class="w-16 h-16 bg-surface-100 rounded-xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
              ${seller.logo}
            </div>
            <div>
              <h3 class="font-bold text-surface-800 group-hover:text-primary-600 transition-colors flex items-center gap-1">
                ${seller.name}
                ${seller.isVerified ? '<svg class="w-4 h-4 text-primary-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>' : ''}
              </h3>
              <div class="flex items-center gap-2 text-sm text-surface-500 mt-1">
                <span class="flex items-center text-orange-500 font-bold">★ ${seller.rating}</span>
                <span>(${seller.reviewsCount} отзывов)</span>
              </div>
            </div>
          </a>
        `).join('')}
      </div>
    </section>

    <!-- SEO Block -->
    <section class="max-w-7xl mx-auto px-4 py-6 md:py-10">
      <div class="seo-block bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl p-6 md:p-10 border border-primary-100">
        <h2 class="text-xl md:text-2xl font-bold text-surface-800 mb-4">SotkaMarket — агрегатор цен на телефоны в Кыргызстане</h2>
        <p class="text-surface-600 text-sm md:text-base leading-relaxed mb-4">Сравнивайте цены на мобильные телефоны, планшеты и аксессуары от проверенных продавцов Бишкека. Мы собираем предложения как для новых, так и для б/у устройств, помогая вам найти лучшую цену.</p>
        <div class="flex flex-wrap gap-2">
          ${CATEGORIES.map(cat => `<a href="#/catalog?category=${cat.id}" class="seo-category-link bg-surface-0/80 px-3 py-1.5 rounded-lg text-sm text-surface-600 hover:text-primary-600 hover:bg-surface-0 transition-colors border border-primary-100/50">${cat.icon} ${cat.name}</a>`).join('')}
        </div>
      </div>
    </section>

    <!-- Global Map Section -->
    <section class="max-w-7xl mx-auto px-4 py-8 mt-4">
      <div class="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
        <h2 class="text-2xl font-bold text-surface-800">📍 Продавцы на карте</h2>
        <div class="relative w-full md:w-80">
          <input type="text" id="homeMapSearch" placeholder="Поиск телефона или магазина..." oninput="window.handleHomeMapSearch()" class="w-full bg-surface-0 border border-surface-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all shadow-sm">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        </div>
      </div>
      <div id="homeGlobalMap" class="w-full h-72 md:h-[400px] bg-surface-200 rounded-2xl overflow-hidden border border-surface-200 shadow-sm z-10 relative"></div>
    </section>
  `;

  window.initSlider();
  setTimeout(() => initHomeMap(), 100);
}
