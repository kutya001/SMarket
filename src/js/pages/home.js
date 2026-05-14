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
    <section class="max-w-7xl mx-auto px-2 sm:px-4 py-4">
      <div class="relative overflow-hidden bg-surface-900 rounded-[2rem] sm:rounded-[3rem] shadow-2xl">
        <div class="relative h-[300px] sm:h-[400px] md:h-[500px]">
          ${heroImages.map((img, i) => `
            <div class="hero-slide absolute inset-0 ${i === 0 ? '' : 'translate-x-full'}" data-slide="${i}">
              <div class="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent z-10"></div>
              <img src="${img}" alt="${heroTexts[i].title}" class="w-full h-full object-cover" loading="${i===0?'eager':'lazy'}">
              <div class="absolute inset-0 z-20 flex items-center px-6 md:px-16">
                <div class="animate-slideUp max-w-lg">
                  <span class="inline-block bg-accent-500/20 text-accent-400 text-[10px] font-black px-3 py-1 rounded-full mb-4 uppercase tracking-widest border border-accent-500/30">Новинка 2026</span>
                  <h1 class="text-3xl sm:text-4xl md:text-6xl font-black text-white mb-3 uppercase tracking-tighter">${heroTexts[i].title}</h1>
                  <p class="text-surface-300 text-sm sm:text-base md:text-lg mb-8 font-medium leading-tight">${heroTexts[i].subtitle}</p>
                  <a href="${heroTexts[i].link}" class="inline-flex items-center gap-3 bg-primary-600 text-white px-8 py-3.5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary-700 transition-all shadow-lg hover:shadow-primary-500/20 active:scale-95">
                    ${heroTexts[i].cta}
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 5l7 7-7 7"/></svg>
                  </a>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/5">
          ${heroImages.map((_, i) => `<button onclick="window.goToSlide(${i})" class="w-2 h-2 rounded-full transition-all ${i === 0 ? 'bg-white w-6' : 'bg-white/40 hover:bg-white/70'}" data-dot="${i}"></button>`).join('')}
        </div>
        <button onclick="window.prevSlide()" class="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all border border-white/10 text-white">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <button onclick="window.nextSlide()" class="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all border border-white/10 text-white">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>
    </section>

    <!-- Categories -->
    <section class="max-w-7xl mx-auto px-4 py-6 md:py-8">
      <div class="ui-island">
        <h2 class="text-xl font-black text-surface-800 mb-6 uppercase tracking-widest text-center">Категории</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-4 text-center">
          ${CATEGORIES.map(cat => `
            <a href="#/catalog?category=${cat.id}" class="ui-island-element group flex items-center justify-center">
              <p class="text-[10px] font-black text-surface-700 text-center group-hover:text-primary-600 transition-colors uppercase tracking-widest">${cat.name}</p>
            </a>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- Trending Products -->
    <section class="max-w-7xl mx-auto px-4 py-10">
      <div class="ui-island">
        <div class="flex flex-col sm:flex-row items-center justify-between mb-10 gap-4">
          <h2 class="text-2xl font-black text-surface-800 uppercase tracking-tighter">🔥 Популярное</h2>
          <a href="#/catalog" class="bg-primary-600 px-6 py-2.5 rounded-2xl text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/20 border border-transparent">
            Смотреть все
          </a>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
          ${trendingProducts.map(p => renderProductCard(p)).join('')}
        </div>
      </div>
    </section>

    <!-- Deals -->
    ${dealsProducts.length > 0 ? `
    <section class="max-w-7xl mx-auto px-4 py-10">
      <div class="ui-island !bg-primary-500/5">
        <div class="flex flex-col sm:flex-row items-center justify-between mb-10 gap-4">
          <h2 class="text-2xl font-black text-primary-900 uppercase tracking-tighter">💰 Выгодные предложения</h2>
          <a href="#/catalog?label=deals" class="bg-primary-600 text-white px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary-700 transition-all shadow-xl shadow-primary-500/20">
            Все акции
          </a>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
          ${dealsProducts.map(p => renderProductCard(p)).join('')}
        </div>
      </div>
    </section>
    ` : ''}

    <!-- Popular Sellers -->
    <section class="max-w-7xl mx-auto px-4 py-10">
      <div class="ui-island">
        <div class="flex flex-col sm:flex-row items-center justify-between mb-10 gap-4">
          <h2 class="text-2xl font-black text-surface-800 uppercase tracking-tighter text-center sm:text-left">Проверенные магазины</h2>
          <a href="#/catalog?view=sellers" class="text-surface-400 text-[10px] font-black uppercase tracking-widest hover:text-primary-600 transition-colors">Весь список</a>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          ${SELLERS.slice(0, 3).map(seller => `
            <a href="#/seller/${seller.id}" class="ui-island-element flex flex-col items-center text-center group">
              <div class="w-20 h-20 bg-surface-100/50 rounded-3xl flex items-center justify-center text-4xl group-hover:scale-110 transition-transform mb-4 shadow-inner">
                ${seller.logo}
              </div>
              <div>
                <h3 class="font-black text-surface-800 group-hover:text-primary-600 transition-colors flex items-center justify-center gap-2 uppercase tracking-tight text-base mb-1">
                  ${seller.name}
                  ${seller.isVerified ? '<svg class="w-5 h-5 text-primary-500 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>' : ''}
                </h3>
                <div class="flex items-center justify-center gap-3 text-[10px] uppercase font-black text-surface-400">
                  <span class="flex items-center text-orange-500">★ ${seller.rating}</span>
                  <span class="opacity-50">${seller.reviewsCount} отзывов</span>
                </div>
              </div>
            </a>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- SEO Block -->
    <section class="max-w-7xl mx-auto px-4 py-10">
      <div class="ui-island text-center">
        <h2 class="text-2xl md:text-3xl font-black text-surface-800 mb-8 uppercase tracking-tighter">SotkaMarket — Ваш надежный агрегатор</h2>
        <p class="text-surface-600 text-base md:text-lg leading-relaxed mb-10 font-medium max-w-3xl mx-auto">Сравнивайте цены на мобильные телефоны, планшеты и аксессуары от проверенных продавцов Бишкека. Мы помогаем найти лучшее предложение на новые и б/у устройства.</p>
        <div class="flex flex-wrap gap-3 justify-center">
          ${CATEGORIES.map(cat => `<a href="#/catalog?category=${cat.id}" class="ui-island-element px-5 py-2.5 text-[10px] font-black text-surface-600 hover:text-white hover:bg-primary-600 transition-all uppercase tracking-widest shadow-sm">${cat.name}</a>`).join('')}
        </div>
      </div>
    </section>

    <!-- Global Map Section -->
    <section class="max-w-7xl mx-auto px-4 py-10 mb-24">
      <div class="ui-island">
        <div class="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div>
            <h2 class="text-2xl font-black text-surface-800 uppercase tracking-tighter mb-2">Найти на карте</h2>
            <p class="text-sm text-surface-500 font-medium uppercase tracking-tight">Все магазины Бишкека в одном месте</p>
          </div>
          <div class="relative w-full md:w-96">
            <input type="text" id="homeMapSearch" placeholder="Название магазина или товара..." oninput="window.handleHomeMapSearch()" class="ui-island-element w-full py-4 pl-12 pr-6 text-sm font-black uppercase tracking-tight focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-inner">
            <div class="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400">
               <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>
          </div>
        </div>
        <div id="homeGlobalMap" class="w-full h-96 md:h-[500px] bg-surface-0/10 rounded-[2.5rem] overflow-hidden border border-transparent shadow-2xl z-10 relative"></div>
      </div>
    </section>
  `;

  window.initSlider();
  setTimeout(() => initHomeMap(), 100);
}
