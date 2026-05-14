import { SELLERS, OFFERS, VARIANTS, PRODUCTS, REVIEWS, CLASSES, CATEGORIES } from '../data/mockData.js';
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
    <a href="#/offer/${offer.id}" class="bg-surface-0/80 backdrop-blur-xl rounded-[1.5rem] shadow-sm border border-transparent p-4 hover:shadow-md transition-shadow block hover:border-primary-300">
      <div class="flex justify-between items-start mb-2">
        <h4 class="font-semibold text-surface-800 leading-tight">${product.name} ${Object.values(variant.attributes).join(' ')}</h4>
        <div class="text-right flex-shrink-0 ml-2">
          <div class="font-bold text-surface-800">${offer.price.toLocaleString()} сом</div>
          <div class="text-xs text-primary-600 font-medium">В наличии</div>
        </div>
      </div>
      <div class="text-sm text-surface-600 space-y-1 mb-3">
        <div class="flex justify-between gap-4 border-b border-transparent pb-1">
          <span>Состояние:</span> 
          <span class="font-medium text-right">${conditionLabels[offer.condition] || 'Неизвестно'}</span>
        </div>
        ${offer.batteryHealth ? `
        <div class="flex justify-between gap-4 border-b border-transparent pb-1">
          <span>Аккумулятор:</span> 
          <span class="font-medium">${offer.batteryHealth}%</span>
        </div>` : ''}
        ${isPhone && offer.imei ? `
        <div class="flex justify-between gap-4 border-b border-transparent pb-1">
          <span>IMEI:</span> 
          <span class="font-mono text-xs font-medium bg-surface-50 px-1 rounded">${offer.imei}</span>
        </div>` : ''}
      </div>
      <div class="flex flex-wrap gap-2 mt-2">
        ${offer.usedImages && offer.usedImages.length > 0 
          ? offer.usedImages.map(img => `<img src="${img}" class="w-12 h-12 object-cover rounded-lg border border-transparent" alt="Фото товара">`).join('')
          : `<span class="text-xs text-surface-400 italic">Без реальных фото</span>`
        }
      </div>
    </a>
  `;
}

function renderNamesGrouped(sellerProducts) {
  if (sellerProducts.length === 0) {
    return `<div class="text-center py-16"><p class="text-surface-500">У продавца пока нет товаров.</p></div>`;
  }
  
  let html = '';
  
  CLASSES.forEach(cls => {
    const classCategories = CATEGORIES.filter(c => c.classId === cls.id).map(c => c.id);
    const classProducts = sellerProducts.filter(p => classCategories.includes(p.category));
    
    if (classProducts.length === 0) return;
    
    html += `<div class="mb-8">
      <h2 class="text-xl font-bold text-surface-800 mb-4 flex items-center gap-2 border-b border-transparent pb-2">
        ${cls.name}
      </h2>
    `;
    
    const typesInClass = CATEGORIES.filter(c => c.classId === cls.id);
    typesInClass.forEach(cat => {
      const typeProducts = classProducts.filter(p => p.category === cat.id);
      if (typeProducts.length === 0) return;
      
      html += `
        <div class="mb-8 ml-4">
          <h3 class="text-lg font-semibold text-surface-700 mb-4 flex items-center gap-2">
            ${cat.name}
          </h3>
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 ml-4">
            ${typeProducts.map(p => renderProductCard(p)).join('')}
          </div>
        </div>
      `;
    });
    html += `</div>`;
  });
  return html;
}

function renderOffersGrouped(sellerOffers, sellerProducts) {
  if (sellerOffers.length === 0) {
    return `<div class="text-center py-16"><p class="text-surface-500">У продавца пока нет товарных единиц.</p></div>`;
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

    html += `<div class="mb-8">
      <h2 class="text-xl font-bold text-surface-800 mb-4 flex items-center gap-2 border-b border-surface-200 pb-2">
        ${cls.icon} ${cls.name}
      </h2>
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
        <div class="mb-8 ml-4">
          <h3 class="text-lg font-semibold text-surface-700 mb-4 flex items-center gap-2">
            ${cat.icon} ${cat.name}
          </h3>
      `;
      
      typeProducts.forEach(product => {
        const productOffers = typeOffers.filter(o => {
          const v = VARIANTS.find(variant => variant.id === o.variantId);
          return v && v.productId === product.id;
        });
        
        if (productOffers.length === 0) return;
        
        html += `
          <div class="mb-6 ml-4">
            <h4 class="text-base font-medium text-surface-800 mb-3 pl-3 border-l-4 border-primary-500 rounded-sm">
              ${product.name}
            </h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 ml-2">
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
    app.innerHTML = `<div class="max-w-7xl mx-auto px-4 py-16 text-center text-surface-600">Продавец не найден.</div>`;
    return;
  }

  // Get all unique products sold by this seller
  const sellerOffers = OFFERS.filter(o => o.sellerId === seller.id);
  const uniqueProductIds = new Set();
  sellerOffers.forEach(o => {
    const v = VARIANTS.find(variant => variant.id === o.variantId);
    if(v) uniqueProductIds.add(v.productId);
  });
  
  const sellerProducts = PRODUCTS.filter(p => uniqueProductIds.has(p.id));
  
  // Get reviews
  // In a real app we would have seller reviews, for now we will just use a generic or empty list
  // Let's create some fake reviews for this seller based REVIEWS array (just take some random reviews)
  const sellerReviews = REVIEWS.slice(0, 3).map(r => ({...r, text: r.comment, user: r.author, date: r.date}));

  app.innerHTML = `
    <!-- Breadcrumbs -->
    <div class="max-w-7xl mx-auto px-4 py-3">
      <nav class="flex items-center gap-2 text-sm text-surface-500">
        <a href="#/" class="hover:text-primary-600">Главная</a>
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        <a href="#/catalog?view=sellers" class="hover:text-primary-600">Продавцы</a>
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        <span class="text-surface-800">${seller.name}</span>
      </nav>
    </div>

    <div class="max-w-7xl mx-auto px-4 pb-12">
      <!-- Seller Header Profile -->
      <div class="bg-surface-0/80 backdrop-blur-xl rounded-[2.5rem] p-6 md:p-8 shadow-sm border border-transparent flex flex-col md:flex-row items-start md:items-center gap-6 mb-8 mt-4">
        <div class="w-24 h-24 bg-surface-100 rounded-2xl flex items-center justify-center text-5xl flex-shrink-0">
          ${seller.logo}
        </div>
        <div class="flex-1">
          <h1 class="text-2xl md:text-3xl font-bold text-surface-800 flex items-center gap-2 mb-2">
            ${seller.name}
            ${seller.isVerified ? '<svg class="w-6 h-6 text-primary-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>' : ''}
          </h1>
          <div class="flex flex-wrap items-center gap-4 text-sm text-surface-600 mb-4">
            <div class="flex items-center gap-1">
              <span class="text-amber-400 font-bold text-lg">★ ${seller.rating}</span>
              <span>(${seller.reviewsCount} отзывов)</span>
            </div>
            <div class="flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              В наличии ${uniqueProductIds.size} товаров
            </div>
          </div>
          <div class="flex items-center gap-3">
             <button onclick="window.handleSellerContact('phone', '${seller.phone}', '${seller.id}')" class="inline-flex flex-1 md:flex-none justify-center items-center gap-2 bg-primary-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-primary-700 transition-colors">
               <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
               Позвонить
             </button>
             <button onclick="window.handleSellerContact('whatsapp', '${seller.phone}', '${seller.id}')" class="inline-flex flex-1 md:flex-none justify-center items-center gap-2 bg-green-500 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-green-600 transition-colors">
               <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.66-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
               WhatsApp
             </button>
          </div>
        </div>
      </div>

      <!-- Seller Tabs -->
      <div class="mb-8">
        <div class="border-b border-transparent">
          <nav class="-mb-px flex gap-6 overflow-x-auto" aria-label="Tabs">
            <button onclick="document.getElementById('seller-products').classList.remove('hidden'); document.getElementById('seller-offers').classList.add('hidden'); document.getElementById('seller-reviews').classList.add('hidden'); this.classList.add('text-primary-600', 'border-primary-600'); this.classList.remove('text-surface-500', 'border-transparent'); this.nextElementSibling.classList.add('text-surface-500', 'border-transparent'); this.nextElementSibling.classList.remove('text-primary-600', 'border-primary-600'); this.nextElementSibling.nextElementSibling.classList.add('text-surface-500', 'border-transparent'); this.nextElementSibling.nextElementSibling.classList.remove('text-primary-600', 'border-primary-600');" class="text-primary-600 border-primary-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors">
              Наименования (${sellerProducts.length})
            </button>
            <button onclick="document.getElementById('seller-offers').classList.remove('hidden'); document.getElementById('seller-products').classList.add('hidden'); document.getElementById('seller-reviews').classList.add('hidden'); this.classList.add('text-primary-600', 'border-primary-600'); this.classList.remove('text-surface-500', 'border-transparent'); this.previousElementSibling.classList.add('text-surface-500', 'border-transparent'); this.previousElementSibling.classList.remove('text-primary-600', 'border-primary-600'); this.nextElementSibling.classList.add('text-surface-500', 'border-transparent'); this.nextElementSibling.classList.remove('text-primary-600', 'border-primary-600');" class="text-surface-500 border-transparent hover:text-surface-700 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors">
              Товары (${sellerOffers.length})
            </button>
            <button onclick="document.getElementById('seller-reviews').classList.remove('hidden'); document.getElementById('seller-products').classList.add('hidden'); document.getElementById('seller-offers').classList.add('hidden'); this.classList.add('text-primary-600', 'border-primary-600'); this.classList.remove('text-surface-500', 'border-transparent'); this.previousElementSibling.classList.add('text-surface-500', 'border-transparent'); this.previousElementSibling.classList.remove('text-primary-600', 'border-primary-600'); this.previousElementSibling.previousElementSibling.classList.add('text-surface-500', 'border-transparent'); this.previousElementSibling.previousElementSibling.classList.remove('text-primary-600', 'border-primary-600');" class="text-surface-500 border-transparent hover:text-surface-700 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors">
              Отзывы о продавце
            </button>
          </nav>
        </div>
      </div>

      <!-- Products Content -->
      <div id="seller-products">
        ${renderNamesGrouped(sellerProducts)}
      </div>

      <!-- Offers Content -->
      <div id="seller-offers" class="hidden">
        ${renderOffersGrouped(sellerOffers, sellerProducts)}
      </div>

      <!-- Reviews Content -->
      <div id="seller-reviews" class="hidden">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Rating Summary -->
          <div class="bg-surface-0/80 backdrop-blur-xl rounded-[2rem] p-6 shadow-sm border border-transparent flex flex-col items-center justify-center text-center">
            <div class="text-5xl font-bold text-surface-800 mb-2">${seller.rating}</div>
            <div class="flex text-amber-400 text-xl mb-2">★★★★★</div>
            <div class="text-surface-500 text-sm">На основе ${seller.reviewsCount} отзывов</div>
          </div>
          
          <!-- Review List -->
          <div class="lg:col-span-2 space-y-4">
            ${sellerReviews.map(r => `
              <div class="bg-surface-0/80 backdrop-blur-xl rounded-[2rem] p-6 shadow-sm border border-transparent">
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-surface-100 rounded-full flex items-center justify-center font-bold text-surface-500">${r.user[0]}</div>
                    <div>
                      <div class="font-medium text-surface-800">${r.user}</div>
                      <div class="text-xs text-surface-400">${r.date}</div>
                    </div>
                  </div>
                  <div class="flex text-amber-400 text-sm">
                    ${Array(r.rating).fill('★').join('')}${Array(5-r.rating).fill('☆').join('')}
                  </div>
                </div>
                <p class="text-surface-600 text-sm leading-relaxed">${r.text}</p>
              </div>
            `).join('')}
            <button class="w-full py-3 text-primary-600 font-medium hover:bg-surface-50 rounded-xl transition-colors border border-transparent">Показать еще отзывы</button>
          </div>
        </div>
      </div>

    </div>
  `;
}
