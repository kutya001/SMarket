import { SELLERS, OFFERS, VARIANTS, PRODUCTS, REVIEWS, CLASSES, CATEGORIES, BRANDS } from '../data/mockData.js';
import { renderProductCard } from '../components/ui/productCard.js';

const conditionLabels = {
  NEW: 'Новое',
  USED_EXCELLENT: 'Б/У - Идеальное состояние',
  USED_GOOD: 'Б/У - Хорошее состояние',
  USED_POOR: 'Б/У - Есть царапины/потертости',
};

function renderSellerOfferCard(offer, product, variant) {
  const isPhone = product.category === 'smartphones';
  return `
    <a href="#/offer/${offer.id}" class="ui-island-element block !p-4 hover:border-primary-300">
      <div class="flex justify-between items-start mb-2">
        <h4 class="font-semibold text-surface-800 leading-tight">${product.name} ${Object.values(variant.attributes).join(' ')}</h4>
        <div class="text-right flex-shrink-0 ml-2">
          <div class="font-bold text-surface-800">${offer.price.toLocaleString()} сом</div>
          <div class="text-xs text-primary-600 font-medium">В наличии</div>
        </div>
      </div>
      <div class="text-sm text-surface-600 space-y-1 mb-3">
        <div class="flex justify-between gap-4 border-b border-surface-100 pb-1">
          <span>Состояние:</span> 
          <span class="font-medium text-right">${conditionLabels[offer.condition] || 'Неизвестно'}</span>
        </div>
        ${offer.batteryHealth ? `
        <div class="flex justify-between gap-4 border-b border-surface-100 pb-1">
          <span>Аккумулятор:</span> 
          <span class="font-medium">${offer.batteryHealth}%</span>
        </div>` : ''}
        ${isPhone && offer.imei ? `
        <div class="flex justify-between gap-4 border-b border-surface-100 pb-1">
          <span>IMEI:</span> 
          <span class="font-mono text-xs font-medium bg-surface-50 px-1 rounded">${offer.imei}</span>
        </div>` : ''}
      </div>
      <div class="flex flex-wrap gap-2 mt-2">
        ${offer.usedImages && offer.usedImages.length > 0 
          ? offer.usedImages.map(img => `<img src="${img}" class="w-12 h-12 object-cover rounded-lg border border-surface-200" alt="Фото товара">`).join('')
          : `<span class="text-xs text-surface-400 italic">Без реальных фото</span>`
        }
      </div>
    </a>
  `;
}

function renderNamesGrouped(sellerProducts, seller) {
  if (sellerProducts.length === 0) {
    return `<div class="ui-island text-center py-16"><p class="text-surface-500">У продавца пока нет товаров.</p></div>`;
  }
  
  let html = '';
  
  CLASSES.forEach(cls => {
    const classCategories = CATEGORIES.filter(c => c.classId === cls.id).map(c => c.id);
    const classProducts = sellerProducts.filter(p => classCategories.includes(p.category));
    
    if (classProducts.length === 0) return;
    
    html += `<div class="ui-island mb-4 sm:mb-8 !p-3 sm:!p-4 md:!p-8">
      <div class="flex items-center justify-between mb-4 sm:mb-6">
        <h2 class="text-xl font-bold text-surface-800 uppercase tracking-tight flex items-center gap-2">
          ${cls.icon} ${cls.name}
        </h2>
        <a href="#/catalog?seller=${seller.id}&class=${cls.id}" class="text-[10px] sm:text-xs font-black uppercase tracking-widest text-primary-600 hover:underline">В каталог →</a>
      </div>
    `;
    
    const typesInClass = CATEGORIES.filter(c => c.classId === cls.id);
    typesInClass.forEach(cat => {
      const typeProducts = classProducts.filter(p => p.category === cat.id);
      if (typeProducts.length === 0) return;
      
      html += `
        <div class="mb-4 sm:mb-8">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-base font-semibold text-surface-700 flex items-center gap-2">
              ${cat.icon} ${cat.name}
            </h3>
            <a href="#/catalog?seller=${seller.id}&category=${cat.id}" class="text-[10px] font-bold uppercase tracking-wider text-surface-500 hover:text-primary-600 transition-colors">Все ${cat.name.toLowerCase()}</a>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            ${typeProducts.map(p => renderProductCard(p)).join('')}
          </div>
        </div>
      `;
    });
    html += `</div>`;
  });
  return html;
}

function renderOffersGrouped(sellerOffers, sellerProducts, seller) {
  if (sellerOffers.length === 0) {
    return `<div class="ui-island text-center py-16"><p class="text-surface-500">У продавца пока нет товарных единиц.</p></div>`;
  }
  
  let html = '';
  
  CLASSES.forEach(cls => {
    const classCategories = CATEGORIES.filter(c => c.classId === cls.id).map(c => c.id);
    const classProducts = sellerProducts.filter(p => classCategories.includes(p.category));
    
    if (classProducts.length === 0) return;
    
    const classOffers = sellerOffers.filter(o => {
      const v = VARIANTS.find(variant => variant.id === o.variantId);
      const p = classProducts.find(prod => prod.id === v.productId);
      return !!p;
    });
    
    if (classOffers.length === 0) return;

    html += `<div class="ui-island mb-4 sm:mb-8 !p-3 sm:!p-4 md:!p-8">
      <div class="flex items-center justify-between mb-4 sm:mb-6">
        <h2 class="text-xl font-bold text-surface-800 uppercase tracking-tight flex items-center gap-2">
          ${cls.icon} ${cls.name}
        </h2>
        <a href="#/catalog?seller=${seller.id}&class=${cls.id}" class="text-[10px] sm:text-xs font-black uppercase tracking-widest text-primary-600 hover:underline">В каталог →</a>
      </div>
    `;
    
    const typesInClass = CATEGORIES.filter(c => c.classId === cls.id);
    typesInClass.forEach(cat => {
      const typeProducts = classProducts.filter(p => p.category === cat.id);
      if (typeProducts.length === 0) return;
      
      const typeOffers = classOffers.filter(o => {
        const v = VARIANTS.find(variant => variant.id === o.variantId);
        const p = typeProducts.find(prod => prod.id === v.productId);
        return !!p;
      });
      
      if (typeOffers.length === 0) return;

      html += `
        <div class="mb-4 sm:mb-8">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-base font-semibold text-surface-700 flex items-center gap-2">
              ${cat.icon} ${cat.name}
            </h3>
            <a href="#/catalog?seller=${seller.id}&category=${cat.id}" class="text-[10px] font-bold uppercase tracking-wider text-surface-500 hover:text-primary-600 transition-colors">Все ${cat.name.toLowerCase()}</a>
          </div>
      `;
    
      typeProducts.forEach(product => {
        const productOffers = typeOffers.filter(o => {
          const v = VARIANTS.find(variant => variant.id === o.variantId);
          return v && v.productId === product.id;
        });
        
        if (productOffers.length === 0) return;
        
        html += `
          <div class="mb-6 bg-surface-50 p-4 rounded-[1.5rem] border border-surface-100">
            <h4 class="text-sm font-bold text-surface-800 mb-3">${product.name}</h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              ${productOffers.map(o => {
                const v = VARIANTS.find(variant => variant.id === o.variantId);
                return renderSellerOfferCard(o, product, v);
              }).join('')}
            </div>
          </div>
        `;
      });
      
      html += `</div>`;
    });
    
    html += `</div>`;
  });
  
  return html;
}

export function renderSellerPage(app, sellerId, params) {
  const seller = SELLERS.find(s => s.id === sellerId);
  if (!seller) {
    app.innerHTML = `<div class="max-w-[1500px] mx-auto px-4 py-16 text-center text-surface-600">Продавец не найден.</div>`;
    return;
  }

  // Get all unique products sold by this seller
  const sellerOffers = OFFERS.filter(o => o.sellerId === seller.id);
  const uniqueProductIds = new Set();
  const brandIds = new Set();
  sellerOffers.forEach(o => {
    const v = VARIANTS.find(variant => variant.id === o.variantId);
    if(v) {
      uniqueProductIds.add(v.productId);
      const p = PRODUCTS.find(prod => prod.id === v.productId);
      if (p) brandIds.add(p.brand);
    }
  });
  
  const sellerProducts = PRODUCTS.filter(p => uniqueProductIds.has(p.id));
  
  // Get reviews
  // In a real app we would have seller reviews, for now we will just use a generic or empty list
  const sellerReviews = REVIEWS.slice(0, 3).map(r => ({...r, text: r.comment, user: r.author, date: r.date}));

  app.innerHTML = `
    <!-- Breadcrumbs -->
    <div class="max-w-[1500px] w-full mx-auto px-2 sm:px-4 py-3">
      <nav class="flex items-center gap-1.5 text-xs sm:text-sm text-surface-500 overflow-x-auto scrollbar-hide shrink-0 w-full">
        <a href="#/" class="ui-island !p-1.5 sm:!p-2 px-3 sm:px-4 !rounded-2xl font-bold hover:shadow-lg transition-all whitespace-nowrap">Главная</a>
        <svg class="w-3 h-3 flex-shrink-0 opacity-40 mx-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        <a href="#/catalog?view=sellers" class="ui-island !p-1.5 sm:!p-2 px-3 sm:px-4 !rounded-2xl font-bold hover:shadow-lg transition-all whitespace-nowrap">Продавцы</a>
        <svg class="w-3 h-3 flex-shrink-0 opacity-40 mx-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        <span class="ui-island !p-1.5 sm:!p-2 px-3 sm:px-4 !rounded-2xl font-black text-primary-600 whitespace-nowrap shadow-sm bg-surface-0/90">${seller.name}</span>
      </nav>
    </div>

    <div class="max-w-[1500px] w-full mx-auto px-2 sm:px-4 pb-12">
      <!-- Seller Header Profile -->
      <div class="ui-island flex flex-col md:flex-row items-start md:items-center gap-4 sm:gap-6 mb-4 sm:mb-8 mt-2 !p-4 sm:!p-6 md:!p-8">
        <div class="w-20 h-20 sm:w-24 sm:h-24 ui-island-element flex items-center justify-center text-4xl sm:text-5xl flex-shrink-0 !p-2">
          <div class="w-full h-full bg-surface-100 rounded-xl flex items-center justify-center">
            ${seller.logo}
          </div>
        </div>
        <div class="flex-1">
          <h1 class="text-xl md:text-3xl font-black text-surface-800 uppercase tracking-tight truncate pb-1" style="word-wrap: break-word; white-space: normal; line-clamp: 2; -webkit-line-clamp: 2; -webkit-box-orient: vertical; display: -webkit-box;">
            ${seller.name}
            ${seller.isVerified ? '<svg class="w-6 h-6 text-primary-500 inline-block align-top" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>' : ''}
          </h1>
          <div class="flex flex-wrap items-center gap-4 text-sm text-surface-600 mb-4">
            <div class="flex items-center gap-1 font-bold">
              <span class="text-amber-400 text-lg">★ ${seller.rating}</span>
              <span>(${seller.reviewsCount} отзывов)</span>
            </div>
            <div class="flex items-center gap-1 font-bold">
              <svg class="w-4 h-4 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              В наличии ${uniqueProductIds.size} товаров
            </div>
          </div>
          <div class="flex items-center gap-3">
             <button onclick="window.handleSellerContact('phone', '${seller.phone}', '${seller.id}')" class="inline-flex flex-1 md:flex-none justify-center items-center gap-2 bg-primary-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/20">
               <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
               Позвонить
             </button>
             <button onclick="window.handleSellerContact('whatsapp', '${seller.phone}', '${seller.id}')" class="inline-flex flex-1 md:flex-none justify-center items-center gap-2 bg-green-500 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-green-600 transition-colors shadow-lg shadow-green-500/20">
               <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.66-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
               WhatsApp
             </button>
          </div>
        </div>
      </div>
      
      <!-- Quick Filters (Brands) -->
      ${brandIds.size > 0 ? `
      <div class="mb-4 sm:mb-6 flex items-center gap-2 flex-wrap">
        <span class="text-xs font-bold text-surface-500 uppercase tracking-wider mr-2">Фильтр продавца:</span>
        ${Array.from(brandIds).map(bId => {
          const brand = BRANDS.find(b => b.id === bId);
          if(!brand) return '';
          return `<a href="#/catalog?seller=${seller.id}&brand=${brand.id}" class="ui-island-element !p-2 !px-4 !rounded-xl text-xs font-bold text-surface-700 hover:text-primary-600 transition-colors">${brand.name}</a>`;
        }).join('')}
        <a href="#/catalog?seller=${seller.id}" class="ui-island-element !p-2 !px-4 !rounded-xl text-xs font-black text-primary-600 hover:bg-primary-50 transition-colors ml-auto uppercase tracking-wider">Искать в каталоге →</a>
      </div>
      ` : ''}

      <!-- Seller Tabs -->
      <div class="mb-4 sm:mb-8">
        <div class="ui-island-element grid grid-cols-3 gap-1 !p-1 !rounded-[1.2rem] w-full">
            <button onclick="document.getElementById('seller-products').classList.remove('hidden'); document.getElementById('seller-offers').classList.add('hidden'); document.getElementById('seller-reviews').classList.add('hidden'); this.classList.add('bg-surface-0', 'shadow-sm', 'text-primary-600'); this.classList.remove('text-surface-500', 'hover:bg-surface-100'); this.nextElementSibling.classList.add('text-surface-500', 'hover:bg-surface-100'); this.nextElementSibling.classList.remove('bg-surface-0', 'shadow-sm', 'text-primary-600'); this.nextElementSibling.nextElementSibling.classList.add('text-surface-500', 'hover:bg-surface-100'); this.nextElementSibling.nextElementSibling.classList.remove('bg-surface-0', 'shadow-sm', 'text-primary-600');" class="bg-surface-0 shadow-sm text-primary-600 py-2 sm:py-2.5 px-1 sm:px-6 rounded-xl font-black text-[10px] sm:text-sm tracking-tight transition-all focus:outline-none flex flex-col items-center justify-center leading-tight">
              <span>Модели</span>
              <span class="text-[9px] sm:text-xs opacity-70 font-bold">(${sellerProducts.length})</span>
            </button>
            <button onclick="document.getElementById('seller-offers').classList.remove('hidden'); document.getElementById('seller-products').classList.add('hidden'); document.getElementById('seller-reviews').classList.add('hidden'); this.classList.add('bg-surface-0', 'shadow-sm', 'text-primary-600'); this.classList.remove('text-surface-500', 'hover:bg-surface-100'); this.previousElementSibling.classList.add('text-surface-500', 'hover:bg-surface-100'); this.previousElementSibling.classList.remove('bg-surface-0', 'shadow-sm', 'text-primary-600'); this.nextElementSibling.classList.add('text-surface-500', 'hover:bg-surface-100'); this.nextElementSibling.classList.remove('bg-surface-0', 'shadow-sm', 'text-primary-600');" class="text-surface-500 hover:bg-surface-100 py-2 sm:py-2.5 px-1 sm:px-6 rounded-xl font-black text-[10px] sm:text-sm tracking-tight transition-all focus:outline-none flex flex-col items-center justify-center leading-tight">
              <span>Товары</span>
              <span class="text-[9px] sm:text-xs opacity-70 font-bold">(${sellerOffers.length})</span>
            </button>
            <button onclick="document.getElementById('seller-reviews').classList.remove('hidden'); document.getElementById('seller-products').classList.add('hidden'); document.getElementById('seller-offers').classList.add('hidden'); this.classList.add('bg-surface-0', 'shadow-sm', 'text-primary-600'); this.classList.remove('text-surface-500', 'hover:bg-surface-100'); this.previousElementSibling.classList.add('text-surface-500', 'hover:bg-surface-100'); this.previousElementSibling.classList.remove('bg-surface-0', 'shadow-sm', 'text-primary-600'); this.previousElementSibling.previousElementSibling.classList.add('text-surface-500', 'hover:bg-surface-100'); this.previousElementSibling.previousElementSibling.classList.remove('bg-surface-0', 'shadow-sm', 'text-primary-600');" class="text-surface-500 hover:bg-surface-100 py-2 sm:py-2.5 px-1 sm:px-6 rounded-xl font-black text-[10px] sm:text-sm tracking-tight transition-all focus:outline-none flex flex-col items-center justify-center leading-tight">
              <span>Отзывы</span>
              <span class="text-[9px] sm:text-xs opacity-70 font-bold">(${seller.reviewsCount || 0})</span>
            </button>
        </div>
      </div>

      <!-- Products Content -->
      <div id="seller-products">
        ${renderNamesGrouped(sellerProducts, seller)}
      </div>

      <!-- Offers Content -->
      <div id="seller-offers" class="hidden">
        ${renderOffersGrouped(sellerOffers, sellerProducts, seller)}
      </div>

      <!-- Reviews Content -->
      <div id="seller-reviews" class="hidden">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Rating Summary -->
          <div class="ui-island flex flex-col items-center justify-center text-center">
            <div class="text-6xl font-black text-surface-800 mb-2">${seller.rating}</div>
            <div class="flex text-amber-400 text-2xl mb-3 tracking-widest">★★★★★</div>
            <div class="text-surface-500 text-sm font-bold uppercase tracking-widest">На основе ${seller.reviewsCount} отзывов</div>
          </div>
          
          <!-- Review List -->
          <div class="lg:col-span-2 space-y-4">
            ${sellerReviews.map(r => `
              <div class="ui-island !p-6">
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center gap-3">
                    <div class="w-12 h-12 bg-surface-100 rounded-full flex items-center justify-center font-black text-surface-500 text-lg">${r.user[0]}</div>
                    <div>
                      <div class="font-bold text-surface-800">${r.user}</div>
                      <div class="text-xs text-surface-400 font-medium">${r.date}</div>
                    </div>
                  </div>
                  <div class="flex text-amber-400 text-sm">
                    ${Array(r.rating).fill('★').join('')}${Array(5-r.rating).fill('☆').join('')}
                  </div>
                </div>
                <p class="text-surface-600 text-sm leading-relaxed font-medium">${r.text}</p>
              </div>
            `).join('')}
            <button class="ui-island-element w-full py-4 text-primary-600 font-bold hover:bg-surface-100/50 transition-colors text-sm uppercase tracking-widest">Показать еще отзывы</button>
          </div>
        </div>
      </div>

    </div>
  `;
}