import { PRODUCTS } from '../data/mockData.js';
import { renderProductCard } from '../components/ui/productCard.js';

export function renderFavoritesPage(app) {
  const State = window.State;
  const favProducts = PRODUCTS.filter(p => State.favorites.includes(p.id));

  app.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 py-6 md:py-10">
      <h1 class="text-2xl md:text-3xl font-bold text-surface-800 mb-6">❤️ Избранное</h1>
      ${favProducts.length > 0 ? `
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
          ${favProducts.map(p => renderProductCard(p)).join('')}
        </div>
      ` : `
        <div class="text-center py-16">
          <div class="text-6xl mb-4">💔</div>
          <h3 class="text-xl font-bold text-surface-800 mb-2">Список избранного пуст</h3>
          <p class="text-surface-500 mb-6">Добавляйте товары в избранное, нажимая на сердечко</p>
          <a href="#/catalog" class="bg-primary-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-700 transition-colors inline-block">Перейти в каталог</a>
        </div>
      `}
    </div>
  `;
}
