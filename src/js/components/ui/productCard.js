import { OFFERS, VARIANTS, BRANDS } from '../../data/mockData.js';
import { renderStars } from '../../utils/helpers.js';
import { isFavorite } from '../../store/state.js';

export function renderProductCard(product) {
  const offers = OFFERS.filter(o => {
    const variant = VARIANTS.find(v => v.id === o.variantId);
    return variant && variant.productId === product.id;
  });
  const prices = offers.filter(o => o.condition === 'NEW').map(o => o.price);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const usedPrices = offers.filter(o => o.condition !== 'NEW').map(o => o.price);
  const minUsedPrice = usedPrices.length > 0 ? Math.min(...usedPrices) : 0;

  const stars = renderStars(product.rating);
  const brandData = product.brand ? BRANDS.find(b => b.id === product.brand) : null;

  return `
    <div class="product-card relative bg-surface-0/60 backdrop-blur-2xl rounded-[2rem] shadow-sm hover:shadow-lg transition-all border border-transparent overflow-hidden group animate-fadeIn" itemscope itemtype="https://schema.org/Product">
      <button onclick="event.preventDefault(); event.stopPropagation(); window.toggleFavorite('${product.id}')" class="absolute top-2 right-2 w-8 h-8 bg-surface-0/60 backdrop-blur rounded-full flex items-center justify-center hover:bg-surface-0 transition-colors shadow-sm z-10">
        <svg class="w-4 h-4 ${isFavorite(product.id)?'text-red-500 fill-current':'text-surface-400'}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
      </button>
      <a href="#/product/${product.slug}" class="block h-full" onclick="window.trackEvent('product_view',{productId:'${product.id}'})">
        <div class="relative aspect-square bg-surface-50 overflow-hidden product-img-wrapper rounded-t-2xl">
          <img src="${product.images[0]}" alt="${product.name}" class="product-img w-full h-full object-contain p-4" loading="lazy" itemprop="image">
          ${product.label ? `<span class="absolute top-2 left-2 ${product.label==='Новинка'?'bg-accent-500':product.label==='Хит'?'bg-orange-500':'bg-green-500'} text-white text-xs font-bold px-2 py-1 rounded-lg">${product.label}</span>` : ''}
        </div>
        <div class="p-3 md:p-4">
          ${brandData ? `<div class="text-[10px] uppercase font-black tracking-widest text-surface-400 mb-1 flex items-center gap-1">${brandData.name}</div>` : ''}
          <h3 class="text-sm font-medium text-surface-800 line-clamp-2 mb-1 group-hover:text-primary-600 transition-colors" itemprop="name">${product.name}</h3>
          <div class="flex items-center gap-1 mb-2">${stars}<span class="text-xs text-surface-400">(${product.reviewsCount})</span></div>
          <div class="flex items-end gap-2">
            ${minPrice > 0 ? `<span class="text-base md:text-lg font-bold text-surface-800">от ${minPrice.toLocaleString()} сом</span>` : ''}
            ${minUsedPrice > 0 ? `<span class="text-xs text-surface-500">б/у от ${minUsedPrice.toLocaleString()}</span>` : ''}
          </div>
          <div class="text-xs text-surface-400 mt-1">Предложений: ${offers.length}</div>
        </div>
      </a>
    </div>
  `;
}
