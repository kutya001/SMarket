import { PRODUCTS, VARIANTS, OFFERS, REVIEWS, CATEGORIES, BRANDS, SELLERS } from '../data/mockData.js';
import { renderStars } from '../utils/helpers.js';
import { initOffersMap, updateMapMarkers, focusMapMarker } from '../utils/map.js';
import { trackEvent } from '../utils/analytics.js';
import { renderCurrentPage } from '../router/router.js';

export function renderProductPage(app, slug, params) {
  const product = PRODUCTS.find(p => p.slug === slug);
  if (!product) {
    app.innerHTML = `<div class="max-w-7xl mx-auto px-4 py-16 text-center"><h2 class="text-2xl font-bold mb-4">Товар не найден</h2><a href="#/catalog" class="text-primary-600 hover:underline">Вернуться в каталог</a></div>`;
    return;
  }

  const variants = VARIANTS.filter(v => v.productId === product.id);
  const productOffers = OFFERS.filter(o => variants.some(v => v.id === o.variantId));
  const newOffers = productOffers.filter(o => o.condition === 'NEW');
  const usedOffers = productOffers.filter(o => o.condition !== 'NEW');

  const newPrices = newOffers.map(o => o.price);
  const usedPrices = usedOffers.map(o => o.price);
  const minNewPrice = newPrices.length > 0 ? Math.min(...newPrices) : 0;
  const maxNewPrice = newPrices.length > 0 ? Math.max(...newPrices) : 0;
  const minUsedPrice = usedPrices.length > 0 ? Math.min(...usedPrices) : 0;

  const productReviews = REVIEWS.filter(r => r.productId === product.id);

  // Track browsing history
  const State = window.State;
  if (State.user) {
    if (!State.user.history) State.user.history = { purchases: [], contacts: [], browsing: [], chats: [] };
    const existingIdx = State.user.history.browsing.findIndex(b => (typeof b === 'string' ? b : b.id) === product.id);
    if (existingIdx > -1) {
      State.user.history.browsing.splice(existingIdx, 1);
    }
    State.user.history.browsing.unshift({ id: product.id, viewedAt: new Date().toISOString() });
    window.saveState();
  }
  const ratingDist = { 5:0, 4:0, 3:0, 2:0, 1:0 };
  productReviews.forEach(r => ratingDist[r.rating] = (ratingDist[r.rating] || 0) + 1);

  const selectedVariantId = params.variant || variants[0]?.id || '';
  const selectedVariant = VARIANTS.find(v => v.id === selectedVariantId) || variants[0];

  const variantOffers = productOffers.filter(o => o.variantId === selectedVariantId);
  const variantNewOffers = variantOffers.filter(o => o.condition === 'NEW').sort((a,b) => a.price - b.price);
  const variantUsedOffers = variantOffers.filter(o => o.condition !== 'NEW').sort((a,b) => a.price - b.price);

  const specsEntries = Object.entries(product.specs);
  const halfIdx = Math.ceil(specsEntries.length / 2);
  const specsLeft = specsEntries.slice(0, halfIdx);
  const specsRight = specsEntries.slice(halfIdx);

  const category = CATEGORIES.find(c => c.id === product.category);
  const brand = BRANDS.find(b => b.id === product.brand);

  window._currentNewOffers = variantNewOffers;
  window._currentUsedOffers = variantUsedOffers;
  window._currentProductMap = null;
  window._currentMapMarkers = [];
  window._currentMapMarkersDict = {};

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.images[0],
    "brand": { "@type": "Brand", "name": brand?.name || '' },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
      "reviewCount": product.reviewsCount
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "KGS",
      "lowPrice": minNewPrice,
      "highPrice": maxNewPrice,
      "offerCount": newOffers.length
    }
  };

  app.innerHTML = `
    <script type="application/ld+json">${JSON.stringify(schema)}<\/script>

    <!-- Breadcrumbs -->
    <div class="max-w-7xl mx-auto px-4 py-3">
      <nav class="flex items-center gap-2 text-sm text-surface-500 flex-wrap">
        <a href="#/" class="hover:text-primary-600">Главная</a>
        <svg class="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        <a href="#/catalog" class="hover:text-primary-600">Каталог</a>
        <svg class="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        ${category ? `<a href="#/catalog?category=${category.id}" class="hover:text-primary-600">${category.name}</a><svg class="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>` : ''}
        <span class="text-surface-800">${product.name}</span>
      </nav>
    </div>

    <div class="max-w-7xl mx-auto px-4 pb-12">
      <!-- Block 1: Summary -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <!-- Gallery -->
        <div>
          <div class="bg-surface-50 rounded-2xl overflow-hidden mb-3 relative product-img-wrapper">
            <img id="mainProductImage" src="${product.images[0]}" alt="${product.name}" class="product-img w-full h-64 sm:h-80 md:h-96 object-contain p-6">
          </div>
          <div class="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
            ${product.images.map((img, i) => `
              <button onclick="window.changeMainImage('${img}', event)" class="gallery-thumb ${i===0?'active':''} flex-shrink-0 w-16 h-16 bg-surface-50 rounded-xl border-2 border-transparent overflow-hidden relative product-img-wrapper">
                <img src="${img}" alt="" class="product-img w-full h-full object-contain p-1">
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Info -->
        <div>
          <h1 class="text-2xl md:text-3xl font-bold text-surface-800 mb-3" itemprop="name">${product.name}</h1>

          <div class="flex items-center gap-3 mb-4">
            <div class="flex items-center gap-1">${renderStars(product.rating, 'w-4 h-4')}</div>
            <span class="text-sm font-medium text-surface-700">${product.rating}</span>
            <a href="#reviews" class="text-sm text-primary-600 hover:underline">(${product.reviewsCount} отзывов)</a>
          </div>

          ${product.label ? `<span class="inline-block ${product.label==='Новинка'?'bg-accent-500':product.label==='Хит'?'bg-orange-500':'bg-green-500'} text-white text-xs font-bold px-3 py-1 rounded-lg mb-4">${product.label}</span>` : ''}

          <!-- Quick specs -->
          <div class="grid grid-cols-2 gap-2 mb-6">
            ${specsEntries.slice(0, 4).map(([k,v]) => `
              <div class="bg-surface-50 rounded-xl p-3">
                <div class="text-xs text-surface-400">${k}</div>
                <div class="text-sm font-medium text-surface-700">${v}</div>
              </div>
            `).join('')}
          </div>

          <!-- Price block -->
          <div class="bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl p-5 border border-primary-100 mb-6">
            <div class="flex items-center justify-between mb-3">
              <span class="text-sm text-surface-600">Доступно предложений:</span>
              <span class="text-sm font-bold text-primary-700">${productOffers.length}</span>
            </div>
            ${minNewPrice > 0 ? `
              <div class="flex items-end gap-2 mb-2">
                <span class="text-xs text-surface-500">Новые:</span>
                <span class="text-lg font-bold text-surface-800">${minNewPrice.toLocaleString()} — ${maxNewPrice.toLocaleString()} сом</span>
              </div>
            ` : ''}
            ${minUsedPrice > 0 ? `
              <div class="flex items-end gap-2">
                <span class="text-xs text-surface-500">Б/У:</span>
                <span class="text-lg font-bold text-surface-800">от ${minUsedPrice.toLocaleString()} сом</span>
              </div>
            ` : ''}
            <button onclick="document.getElementById('offersBlock').scrollIntoView({behavior:'smooth'})" class="mt-4 w-full bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2">
              Сравнить цены
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
            </button>
          </div>

          <!-- Variant selector -->
          ${variants.length > 1 ? `
            <div class="mb-4">
              <h4 class="text-sm font-semibold text-surface-700 mb-2">Варианты:</h4>
              <div class="flex flex-wrap gap-2">
                ${variants.map(v => `
                  <a href="#/product/${product.slug}?variant=${v.id}" class="px-4 py-2 rounded-xl text-sm border ${selectedVariantId===v.id?'border-primary-600 bg-primary-50 text-primary-700':'border-surface-200 text-surface-600 hover:border-primary-300'} transition-colors">
                    ${Object.values(v.attributes).join(' / ')}
                  </a>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      </div>

      <!-- Block 2: Offers -->
      <div id="offersBlock" class="mb-10">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-2xl font-bold text-surface-800">Предложения продавцов</h2>
        </div>

        <!-- Map Container -->
        <div id="offersMap" class="w-full h-64 md:h-80 bg-surface-100 rounded-2xl border border-surface-200 mb-6 overflow-hidden relative z-10 shadow-inner"></div>

        <!-- Tabs -->
        <div class="flex border-b border-surface-200 mb-6">
          <button onclick="window.switchConditionTab('new')" id="tabNew" class="tab-active px-6 py-3 text-sm font-semibold transition-colors">
            Новые (${newOffers.length})
          </button>
          <button onclick="window.switchConditionTab('used')" id="tabUsed" class="px-6 py-3 text-sm font-semibold text-surface-500 hover:text-surface-700 transition-colors">
            Б/У (${usedOffers.length})
          </button>
        </div>

        <!-- New offers -->
        <div id="offersNew" class="space-y-3">
          ${variantNewOffers.length > 0 ? variantNewOffers.map(offer => renderOfferRow(offer, 'NEW')).join('') :
            newOffers.length > 0 ? `<p class="text-surface-500 text-sm">Для выбранного варианта нет предложений. Выберите другой вариант или посмотрите все предложения.</p>` :
            '<p class="text-surface-500 text-sm">Нет предложений для новых товаров.</p>'
          }
        </div>

        <!-- Used offers -->
        <div id="offersUsed" class="space-y-3 hidden">
          ${variantUsedOffers.length > 0 ? variantUsedOffers.map(offer => renderOfferRow(offer, 'USED')).join('') :
            usedOffers.length > 0 ? `<p class="text-surface-500 text-sm">Для выбранного варианта нет предложений б/у.</p>` :
            '<p class="text-surface-500 text-sm">Нет предложений для б/у товаров.</p>'
          }
        </div>
      </div>

      <!-- Block 3: Specifications -->
      <div class="mb-10">
        <h2 class="text-2xl font-bold text-surface-800 mb-4">Характеристики</h2>
        <div class="bg-white rounded-2xl shadow-sm border border-surface-100 overflow-hidden">
          <div class="grid grid-cols-1 md:grid-cols-2">
            <div class="divide-y divide-surface-100">
              ${specsLeft.map(([k,v]) => `
                <div class="flex justify-between px-5 py-3.5">
                  <span class="text-sm text-surface-500">${k}</span>
                  <span class="text-sm font-medium text-surface-800">${v}</span>
                </div>
              `).join('')}
            </div>
            <div class="divide-y divide-surface-100">
              ${specsRight.map(([k,v]) => `
                <div class="flex justify-between px-5 py-3.5">
                  <span class="text-sm text-surface-500">${k}</span>
                  <span class="text-sm font-medium text-surface-800">${v}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>

      <!-- Block 4: Description -->
      <div class="mb-10">
        <h2 class="text-2xl font-bold text-surface-800 mb-4">Описание</h2>
        <div class="bg-white rounded-2xl shadow-sm border border-surface-100 p-5 md:p-8 prose prose-surface max-w-none">
          <p class="text-surface-600 leading-relaxed">${product.description}</p>
        </div>
      </div>

      <!-- Block 5: Reviews -->
      <div id="reviews" class="mb-10">
        <h2 class="text-2xl font-bold text-surface-800 mb-4">Отзывы (${productReviews.length})</h2>

        <!-- Rating distribution -->
        <div class="bg-white rounded-2xl shadow-sm border border-surface-100 p-5 mb-6">
          <div class="flex flex-col md:flex-row gap-6">
            <div class="flex flex-col items-center min-w-[120px]">
              <div class="text-4xl font-bold text-surface-800">${product.rating}</div>
              <div class="flex items-center gap-1 my-2">${renderStars(product.rating, 'w-5 h-5')}</div>
              <div class="text-sm text-surface-500">${product.reviewsCount} отзывов</div>
            </div>
            <div class="flex-1 space-y-2">
              ${[5,4,3,2,1].map(star => {
                const count = ratingDist[star] || 0;
                const pct = productReviews.length > 0 ? (count / productReviews.length * 100) : 0;
                return `
                  <div class="flex items-center gap-3">
                    <span class="text-sm text-surface-600 w-6">${star}</span>
                    <svg class="w-4 h-4 star-rating flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    <div class="flex-1 h-2 bg-surface-100 rounded-full overflow-hidden">
                      <div class="h-full bg-amber-400 rounded-full transition-all" style="width:${pct}%"></div>
                    </div>
                    <span class="text-sm text-surface-500 w-8 text-right">${count}</span>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
          <button onclick="window.openReviewModal('${product.id}')" class="mt-5 bg-primary-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-primary-700 transition-colors">
            Оставить отзыв
          </button>
        </div>

        <!-- Reviews list -->
        <div class="space-y-4">
          ${productReviews.length > 0 ? productReviews.map(r => `
            <div class="bg-white rounded-2xl shadow-sm border border-surface-100 p-5">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-sm">${r.author[0]}</div>
                  <div>
                    <div class="font-semibold text-surface-800 text-sm">${r.author}</div>
                    <div class="text-xs text-surface-400">${r.date}</div>
                  </div>
                </div>
                <div class="flex items-center gap-1">${renderStars(r.rating, 'w-4 h-4')}</div>
              </div>
              ${r.pros ? `<div class="mb-2"><span class="text-xs font-semibold text-green-600">Достоинства:</span> <span class="text-sm text-surface-600">${r.pros}</span></div>` : ''}
              ${r.cons ? `<div class="mb-2"><span class="text-xs font-semibold text-red-500">Недостатки:</span> <span class="text-sm text-surface-600">${r.cons}</span></div>` : ''}
              <p class="text-sm text-surface-600">${r.comment}</p>
            </div>
          `).join('') : '<p class="text-surface-500 text-center py-8">Отзывов пока нет. Будьте первым!</p>'}
        </div>
      </div>
    </div>
  `;

  window._currentConditionTab = 'new';
  setTimeout(() => {
    initOffersMap(variantNewOffers);
  }, 100);
}

export function renderOfferRow(offer, tabType) {
  const variant = VARIANTS.find(v => v.id === offer.variantId);
  const product = PRODUCTS.find(p => p.id === variant?.productId);
  const seller = SELLERS.find(s => s.id === offer.sellerId);
  if (!seller || !product) return '';

  const conditionLabels = {
    NEW: '<span class="bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded">Новое</span>',
    USED_EXCELLENT: '<span class="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded">Идеальное</span>',
    USED_GOOD: '<span class="bg-amber-100 text-amber-700 text-xs font-medium px-2 py-0.5 rounded">Хорошее</span>',
    USED_POOR: '<span class="bg-orange-100 text-orange-700 text-xs font-medium px-2 py-0.5 rounded">Есть царапины</span>',
  };

  return `
    <div class="bg-white rounded-xl shadow-sm border border-surface-100 p-4 md:p-5 hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-transparent hover:border-l-primary-500" 
         onmouseenter="window.focusMapMarker('${seller.id}')" onclick="window.location.hash = '#/offer/${offer.id}'"
         itemscope itemtype="https://schema.org/Offer">
      <div class="flex flex-col md:flex-row md:items-center gap-4">
        <!-- Seller info -->
        <div class="flex items-center gap-3 flex-1 min-w-0">
          <div class="w-12 h-12 bg-surface-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">${seller.logo}</div>
          <div class="min-w-0">
            <div class="flex items-center gap-2">
              <span class="font-semibold text-surface-800 text-sm" itemprop="seller">${seller.name}</span>
              ${seller.isVerified ? '<svg class="w-4 h-4 text-primary-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>' : ''}
            </div>
            <div class="flex items-center gap-1 text-xs text-surface-500">
              <svg class="w-3 h-3 star-rating" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              ${seller.rating} (${seller.reviewsCount})
            </div>
          </div>
        </div>

        <!-- Details -->
        <div class="flex flex-wrap items-center gap-3 md:gap-6">
          ${tabType === 'USED' ? `
            <div class="flex items-center gap-2">
              ${conditionLabels[offer.condition] || conditionLabels.NEW}
              ${offer.batteryHealth ? `<span class="text-xs text-surface-500">АКБ: ${offer.batteryHealth}%</span>` : ''}
              ${offer.usedImages ? `<button onclick="event.stopPropagation(); window.showUsedPhotos([${offer.usedImages.map(u=>`'${u}'`).join(',')}])" class="text-xs text-primary-600 hover:underline">Фото (${offer.usedImages.length})</button>` : ''}
            </div>
          ` : ''}
          <div class="text-xs text-surface-500">${offer.warrantyInfo}</div>
          <span class="bg-green-50 text-green-700 text-xs font-medium px-2 py-0.5 rounded">В наличии</span>
        </div>

        <!-- Price and CTA -->
        <div class="flex items-center gap-4 md:flex-shrink-0">
          <span class="text-xl font-bold text-surface-800" itemprop="price">${offer.price.toLocaleString()} сом</span>
          <button onclick="event.stopPropagation(); window.location.hash = '#/offer/${offer.id}'" class="bg-primary-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors whitespace-nowrap z-10 relative">
            Подробнее →
          </button>
        </div>
      </div>
    </div>
  `;
}

export function switchConditionTab(tab) {
  window._currentConditionTab = tab;
  trackEvent('tab_switch_condition', { tab });

  const tabNew = document.getElementById('tabNew');
  const tabUsed = document.getElementById('tabUsed');
  const offersNew = document.getElementById('offersNew');
  const offersUsed = document.getElementById('offersUsed');

  if (tab === 'new') {
    tabNew.className = 'tab-active px-6 py-3 text-sm font-semibold transition-colors';
    tabUsed.className = 'px-6 py-3 text-sm font-semibold text-surface-500 hover:text-surface-700 transition-colors';
    offersNew.classList.remove('hidden');
    offersUsed.classList.add('hidden');
    updateMapMarkers(window._currentNewOffers || []);
  } else {
    tabNew.className = 'px-6 py-3 text-sm font-semibold text-surface-500 hover:text-surface-700 transition-colors';
    tabUsed.className = 'tab-active px-6 py-3 text-sm font-semibold transition-colors';
    offersNew.classList.add('hidden');
    offersUsed.classList.remove('hidden');
    updateMapMarkers(window._currentUsedOffers || []);
  }
}

export function changeMainImage(src, event) {
  const img = document.getElementById('mainProductImage');
  if (img) img.src = src;
  document.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
  if (event) {
    event.currentTarget.classList.add('active');
  }
}
