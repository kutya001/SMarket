import { PRODUCTS, CATEGORIES, OFFERS, VARIANTS } from '../../data/mockData.js';
import { navigate } from '../../router/router.js';

export function handleSearch(query) {
  const State = window.State;
  clearTimeout(State.searchTimeout);
  const desktopDropdown = document.getElementById('searchDropdown');
  const mobileDropdown = document.getElementById('mobileSearchDropdown');

  if (query.length < 2) {
    if (desktopDropdown) desktopDropdown.classList.remove('show');
    if (mobileDropdown) mobileDropdown.classList.remove('show');
    return;
  }

  State.searchTimeout = setTimeout(() => {
    const q = query.toLowerCase();
    const matchedProducts = PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    ).slice(0, 5);

    const matchedCategories = CATEGORIES.filter(c =>
      c.name.toLowerCase().includes(q)
    ).slice(0, 3);

    const suggestions = ['iPhone 17 Pro', 'Samsung Galaxy', 'AirPods Pro', 'Чехол iPhone', 'Зарядка быстрая'].filter(s => s.toLowerCase().includes(q)).slice(0, 3);

    let html = '';

    if (suggestions.length > 0) {
      html += `<div class="p-3 border-b border-surface-100"><div class="text-xs text-surface-400 mb-2">Подсказки</div>${suggestions.map(s => `<button onclick="document.getElementById('globalSearch').value='${s}';document.getElementById('mobileGlobalSearch').value='${s}';window.handleSearch('${s}');window.navigate('/catalog?search=${encodeURIComponent(s)}')" class="flex items-center gap-2 w-full text-left px-2 py-1.5 rounded-lg hover:bg-surface-50 text-sm text-surface-600"><svg class="w-4 h-4 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>${s}</button>`).join('')}</div>`;
    }

    if (matchedCategories.length > 0) {
      html += `<div class="p-3 border-b border-surface-100"><div class="text-xs text-surface-400 mb-2">Категории</div>${matchedCategories.map(c => `<a href="#/catalog?category=${c.id}" onclick="document.getElementById('globalSearch').value='';document.getElementById('mobileGlobalSearch').value='';document.getElementById('searchDropdown').classList.remove('show');document.getElementById('mobileSearchDropdown').classList.remove('show')" class="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-surface-50 text-sm text-surface-600"><span>${c.icon}</span>${c.name}</a>`).join('')}</div>`;
    }

    if (matchedProducts.length > 0) {
      html += `<div class="p-3"><div class="text-xs text-surface-400 mb-2">Товары</div>${matchedProducts.map(p => {
        const prices = OFFERS.filter(o => VARIANTS.find(v => v.id === o.variantId)?.productId === p.id && o.condition === 'NEW').map(o => o.price);
        const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
        return `<a href="#/product/${p.slug}" onclick="document.getElementById('globalSearch').value='';document.getElementById('mobileGlobalSearch').value='';document.getElementById('searchDropdown').classList.remove('show');document.getElementById('mobileSearchDropdown').classList.remove('show')" class="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-surface-50"><img src="${p.images[0]}" class="w-10 h-10 object-contain bg-surface-50 rounded-lg p-1"><div><div class="text-sm font-medium text-surface-800">${p.name}</div><div class="text-xs text-surface-500">от ${minPrice.toLocaleString()} сом</div></div></a>`;
      }).join('')}</div>`;
    }

    if (!html) {
      html = '<div class="p-4 text-center text-sm text-surface-500">Ничего не найдено</div>';
    }

    if (desktopDropdown) {
      desktopDropdown.innerHTML = html;
      desktopDropdown.classList.add('show');
    }
    if (mobileDropdown) {
      mobileDropdown.innerHTML = html;
      mobileDropdown.classList.add('show');
    }
  }, 200);
}
