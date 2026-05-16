import { OFFERS, SELLERS, PRODUCTS, VARIANTS, CATEGORIES, CLASSES, BRANDS } from '../data/mockData.js';
import { renderStars } from '../utils/helpers.js';

export function renderOfferPage(app, offerId, params) {
  const offer = OFFERS.find(o => o.id === offerId);
  
  if (!offer) {
    app.innerHTML = `<div class="max-w-7xl mx-auto px-4 py-16 text-center text-surface-600">Предложение не найдено.</div>`;
    return;
  }

  const seller = SELLERS.find(s => s.id === offer.sellerId);
  const variant = VARIANTS.find(v => v.id === offer.variantId);
  const product = PRODUCTS.find(p => p.id === offer.productId);

  if (!seller || !variant || !product) {
    app.innerHTML = `<div class="max-w-7xl mx-auto px-4 py-16 text-center text-surface-600">Отображение невозможно: неполные данные предложения.</div>`;
    return;
  }

  const category = CATEGORIES.find(c => c.id === product.category);
  const brand = BRANDS.find(b => b.id === product.brand);
  const productClass = category ? CLASSES.find(c => c.id === category.classId) : null;

  const conditionLabels = {
    NEW: 'Новое',
    USED_EXCELLENT: 'Б/У - Идеальное состояние',
    USED_GOOD: 'Б/У - Хорошее состояние (есть следы использования)',
    USED_POOR: 'Б/У - Есть царапины/потертости',
  };

  const imagesHtml = offer.usedImages && offer.usedImages.length > 0 
    ? offer.usedImages.map((img, i) => `
        <img src="${img}" alt="Used item photo" class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 h-64 object-cover rounded-xl border border-surface-200">
      `).join('')
    : `<div class="bg-surface-50 border border-surface-200 border-dashed rounded-xl p-8 text-center text-surface-500 w-full">Реальные фотографии продавцом не предоставлены.</div>`;

  const isPhone = category?.id === 'smartphones';

  app.innerHTML = `
    <!-- Breadcrumbs -->
    <div class="max-w-[1500px] w-full mx-auto px-2 sm:px-4 py-3">
      <nav class="flex items-center gap-1.5 text-xs sm:text-sm text-surface-500 overflow-x-auto scrollbar-hide shrink-0 w-full">
        <a href="#/" class="ui-island !p-1.5 sm:!p-2 px-3 sm:px-4 !rounded-2xl font-bold hover:shadow-lg transition-all whitespace-nowrap">Главная</a>
        <svg class="w-3 h-3 flex-shrink-0 opacity-40 mx-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        ${productClass ? `<a href="#/catalog?class=${productClass.id}" class="ui-island !p-1.5 sm:!p-2 px-3 sm:px-4 !rounded-2xl font-bold hover:shadow-lg transition-all whitespace-nowrap">${productClass.name}</a><svg class="w-3 h-3 flex-shrink-0 opacity-40 mx-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>` : ''}
        ${category ? `<a href="#/catalog?category=${category.id}" class="ui-island !p-1.5 sm:!p-2 px-3 sm:px-4 !rounded-2xl font-bold hover:shadow-lg transition-all whitespace-nowrap">${category.name}</a><svg class="w-3 h-3 flex-shrink-0 opacity-40 mx-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>` : ''}
        ${brand ? `<a href="#/catalog?brand=${brand.id}" class="ui-island !p-1.5 sm:!p-2 px-3 sm:px-4 !rounded-2xl font-bold hover:shadow-lg transition-all whitespace-nowrap">${brand.name}</a><svg class="w-3 h-3 flex-shrink-0 opacity-40 mx-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>` : ''}
        <a href="#/product/${product.slug}" class="ui-island !p-1.5 sm:!p-2 px-3 sm:px-4 !rounded-2xl font-bold hover:shadow-lg transition-all whitespace-nowrap">${product.name}</a>
        <svg class="w-3 h-3 flex-shrink-0 opacity-40 mx-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        <span class="ui-island !p-1.5 sm:!p-2 px-3 sm:px-4 !rounded-2xl font-black text-primary-600 whitespace-nowrap shadow-sm bg-surface-0/90">Предложение от ${seller.name}</span>
      </nav>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 pb-12">
      <!-- Title -->
      <h1 class="text-2xl md:text-3xl font-bold text-surface-800 mb-6">
        ${product.name} — ${Object.values(variant.attributes).join(' / ')}
      </h1>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Left Column: Details & Details -->
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-surface-0/80 backdrop-blur-xl rounded-[2rem] p-6 shadow-sm border border-surface-200/50">
            <h2 class="text-xl font-bold text-surface-800 mb-4">Информация о товаре</h2>
            <div class="grid relative grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="bg-surface-50 p-4 rounded-xl">
                <p class="text-sm text-surface-500 mb-1">Состояние</p>
                <p class="font-medium text-surface-800">${conditionLabels[offer.condition] || 'Неизвестно'}</p>
              </div>
              <div class="bg-surface-50 p-4 rounded-xl">
                <p class="text-sm text-surface-500 mb-1">Гарантия</p>
                <p class="font-medium text-surface-800">${offer.warrantyInfo || 'Нет данных'}</p>
              </div>
              ${offer.batteryHealth ? `
              <div class="bg-surface-50 p-4 rounded-xl">
                <p class="text-sm text-surface-500 mb-1">Состояние аккумулятора</p>
                <p class="font-medium text-surface-800">${offer.batteryHealth}%</p>
              </div>
              ` : ''}
              ${isPhone ? `
              <div class="bg-surface-50 p-4 rounded-xl col-span-1 sm:col-span-2">
                <p class="text-sm text-surface-500 mb-1">IMEI устройства</p>
                <p class="font-mono bg-surface-100 px-3 py-1.5 rounded-lg text-surface-700 w-max tracking-wider">
                  ${offer.imei ? offer.imei : 'IMEI не указан'}
                </p>
              </div>
              ` : ''}
            </div>
          </div>

          <div class="bg-surface-0/80 backdrop-blur-xl rounded-[2rem] p-6 shadow-sm border border-surface-200/50">
            <h2 class="text-xl font-bold text-surface-800 mb-4">Фотографии товара</h2>
            <div class="flex flex-wrap gap-4">
              ${imagesHtml}
            </div>
          </div>
        </div>

        <!-- Right Column: Price & Seller -->
        <div class="space-y-6">
          <div class="bg-surface-0/80 backdrop-blur-xl rounded-[2rem] p-6 shadow-sm border border-surface-200/50 sticky top-24">
            <div class="mb-6">
              <span class="text-3xl font-bold text-surface-800">${offer.price.toLocaleString()} сом</span>
              ${offer.oldPrice ? `<span class="text-surface-400 line-through text-sm ml-2">${offer.oldPrice.toLocaleString()} сом</span>` : ''}
              <div class="mt-2 text-sm text-green-600 font-medium">В наличии</div>
            </div>

            <button onclick="window.open('${seller.url}', '_blank')" class="w-full bg-primary-600 text-white py-3 rounded-xl font-bold hover:bg-primary-700 transition-colors mb-3 flex items-center justify-center gap-2">
              Купить в магазине
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
            </button>

            <div class="border-t border-surface-100 pt-6 mt-6">
              <h3 class="font-bold text-surface-800 mb-4">Информация о продавце</h3>
              <a href="#/seller/${seller.id}" class="flex gap-4 items-center mb-4 group hover:bg-surface-50 p-2 -mx-2 rounded-xl transition-colors">
                <div class="w-14 h-14 bg-surface-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">${seller.logo}</div>
                <div>
                  <div class="font-bold text-surface-800 group-hover:text-primary-600 transition-colors flex items-center gap-1">
                    ${seller.name}
                    ${seller.isVerified ? '<svg class="w-4 h-4 text-primary-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>' : ''}
                  </div>
                  <div class="flex items-center gap-1 text-sm text-surface-500 mt-0.5">
                    <span class="text-amber-400 font-bold">★ ${seller.rating}</span>
                    <span>(${seller.reviewsCount} отзывов)</span>
                  </div>
                </div>
              </a>
              <div class="space-y-3">
                <button onclick="window.handleSellerContact('phone', '${seller.phone}', '${seller.id}')" class="w-full justify-center flex items-center gap-3 text-surface-600 hover:text-primary-600 transition-colors bg-surface-50 p-3 rounded-xl border border-surface-100 font-medium">
                  <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                  ${seller.phone}
                </button>
                <button onclick="window.handleSellerContact('whatsapp', '${seller.phone}', '${seller.id}')" class="w-full justify-center flex items-center gap-3 text-white bg-green-500 hover:bg-green-600 transition-colors p-3 rounded-xl border border-green-600 font-medium">
                  <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.66-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Написать в WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  `;
}
