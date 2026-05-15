import { PRODUCTS } from '../data/mockData.js';
import { renderProductCard } from '../components/ui/productCard.js';

export function renderFavoritesPage(app) {
  const State = window.State;
  const favProducts = PRODUCTS.filter(p => State.favorites.includes(p.id));

  app.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="ui-island !p-4 sm:!p-6 !rounded-[2rem] md:!rounded-[2.5rem] min-h-[50vh]">
        <h1 class="text-2xl md:text-3xl font-black text-surface-800 mb-6 uppercase tracking-tight flex items-center gap-3">
          <span class="text-3xl">❤️</span> Избранное
        </h1>
        ${favProducts.length > 0 ? `
          <div class="ui-island-element !p-[2px] sm:!p-2 !rounded-[1.5rem] md:!rounded-[2rem]">
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
              ${favProducts.map(p => renderProductCard(p)).join('')}
            </div>
          </div>
        ` : `
          <div class="text-center py-16 ui-island-element !rounded-[1.5rem] !p-8">
            <div class="text-6xl mb-4 text-surface-300">🖤</div>
            <h3 class="text-xl font-bold text-surface-800 mb-2 uppercase tracking-wide">Список пуст</h3>
            <p class="text-surface-500 mb-6 text-sm font-medium">Вы пока ничего не добавили в избранное</p>
            <a href="#/catalog" class="bg-primary-600 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[11px] shadow-sm hover:bg-primary-700 transition-colors inline-block">В каталог</a>
          </div>
        `}
      </div>
    </div>
  `;
}
