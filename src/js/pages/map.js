import { SELLERS, OFFERS, PRODUCTS, VARIANTS, CATEGORIES, BRANDS } from '../data/mockData.js';

export function renderMapPage(app, params) {
  app.innerHTML = `
    <div class="fixed inset-0 z-[100] bg-surface-0 flex flex-col md:flex-row overflow-hidden map-fullscreen-container animation-fade-in pt-safe" id="fullMapView">
      
      <!-- Top Action Bar (Mobile Only / Over Map) -->
      <div class="absolute top-2 left-2 right-2 z-[1010] flex items-center justify-between pointer-events-none pb-safe">
        <button onclick="window.closeFullscreenMap()" class="pointer-events-auto ui-island-element !p-2 sm:!p-3 !rounded-[1.2rem] bg-surface-0/80 backdrop-blur-md shadow-lg flex items-center justify-center text-surface-800 hover:text-primary-600 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        </button>

        <div class="pointer-events-auto flex gap-2">
           <button class="ui-island-element !p-2 !rounded-[1.2rem] bg-surface-0/80 backdrop-blur-md shadow-lg flex items-center justify-center text-surface-800" onclick="window.toggleMapFilters()">
             <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg>
           </button>
        </div>
      </div>

      <!-- Filters Panel (Hidden by Default over map via toggle) -->
      <div id="mapFiltersPanel" class="hidden absolute top-16 left-2 right-2 md:w-80 md:left-4 md:right-auto z-[1010] bg-surface-0/95 backdrop-blur-xl shadow-2xl rounded-2xl p-4 border border-surface-200 pointer-events-auto ui-border-v">
        <h3 class="text-sm font-black uppercase tracking-widest text-surface-800 mb-3">Фильтры</h3>
        <select id="mapFilterType" class="w-full bg-surface-100 rounded-xl p-2.5 text-xs font-bold mb-3 focus:outline-none focus:ring-2 focus:ring-primary-500" onchange="window.updateMapFilters()">
          <option value="all">Все объекты (Магазины и Товары)</option>
          <option value="sellers">Только магазины</option>
          <option value="products">Только товары</option>
        </select>
        
        <select id="mapFilterBrand" class="w-full bg-surface-100 rounded-xl p-2.5 text-xs font-bold mb-3 focus:outline-none focus:ring-2 focus:ring-primary-500" onchange="window.updateMapFilters()">
          <option value="">Все бренды</option>
          ${BRANDS.map(b => `<option value="${b.id}">${b.name}</option>`).join('')}
        </select>

        <select id="mapFilterCategory" class="w-full bg-surface-100 rounded-xl p-2.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary-500" onchange="window.updateMapFilters()">
          <option value="">Все категории</option>
          ${CATEGORIES.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
        </select>
      </div>

      <!-- Map Container -->
      <div class="h-1/2 md:h-full w-full md:w-2/3 lg:w-3/4 relative z-[1000]">
        <div id="fullscreenMap" class="w-full h-full"></div>
      </div>

      <!-- Sidebar / Bottom Panel -->
      <div class="h-1/2 md:h-full w-full md:w-1/3 lg:w-1/4 bg-surface-0 shadow-2xl z-[1005] flex flex-col relative ui-border-v border-t md:border-t-0 md:border-l border-surface-200">
        <div class="p-3 border-b border-surface-200 shrink-0">
          <input type="text" id="mapSearchInput" placeholder="Поиск объектов в этой зоне..." oninput="window.updateMapSearch()" class="w-full bg-surface-100/50 rounded-xl py-2 pl-4 pr-10 text-xs font-bold uppercase tracking-tight focus:bg-surface-100 focus:outline-none transition-all">
          <div class="text-[10px] text-surface-500 font-medium uppercase mt-2 px-1 text-center" id="mapItemsCount">Объектов найдено: 0</div>
        </div>
        
        <div id="mapSidebarList" class="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar pb-safe">
          <!-- Populated dynamically -->
        </div>
      </div>
    </div>
  `;

  setTimeout(() => window.initFullscreenMap(), 50);
}
