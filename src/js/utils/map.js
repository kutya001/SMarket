import { SELLERS, OFFERS, VARIANTS, PRODUCTS } from '../data/mockData.js';
import { navigate } from '../router/router.js';

export function initHomeMap() {
  const mapContainer = document.getElementById('homeGlobalMap');
  if (!mapContainer) return;

  if (!window._homeMap) {
    window._homeMap = L.map('homeGlobalMap', {
      rotate: true,
      touchRotate: true,
      rotateControl: {
        closeOnZeroPitch: false
      }
    }).setView([42.8746, 74.5698], 12);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(window._homeMap);
  }

  setTimeout(() => {
    if (window._homeMap) window._homeMap.invalidateSize();
  }, 100);

  updateHomeMapMarkers('');
}

export function handleHomeMapSearch() {
  const q = document.getElementById('homeMapSearch').value;
  updateHomeMapMarkers(q);
}

export function updateHomeMapMarkers(query) {
  if (!window._homeMap) return;

  if (window._homeMapMarkers) {
    window._homeMapMarkers.forEach(m => window._homeMap.removeLayer(m));
  }
  window._homeMapMarkers = [];

  const bounds = L.latLngBounds();
  const q = query.toLowerCase();
  let hasValidMarkers = false;

  SELLERS.forEach(seller => {
    let match = seller.name.toLowerCase().includes(q);

    if (!match && q.length > 1) {
      const sellerOffers = OFFERS.filter(o => o.sellerId === seller.id);
      match = sellerOffers.some(o => {
        const variant = VARIANTS.find(v => v.id === o.variantId);
        if(!variant) return false;
        const prod = PRODUCTS.find(p => p.id === variant.productId);
        return prod && prod.name.toLowerCase().includes(q);
      });
    }

    if (match && seller.lat && seller.lng) {
      const marker = L.marker([seller.lat, seller.lng]).addTo(window._homeMap);
      
      const popupContent = `
        <div class="p-1 min-w-[150px]">
          <div class="font-bold text-sm mb-1">${seller.logo} ${seller.name}</div>
          <div class="text-xs text-surface-500 mb-2">Рейтинг: ${seller.rating} ★</div>
          <button onclick="window.navigate('/catalog?seller=${seller.id}'); window._homeMap.closePopup();" class="block w-full text-center bg-primary-600 text-white text-xs py-1.5 rounded-lg hover:bg-primary-700 transition-colors">Показать товары</button>
        </div>
      `;
      
      marker.bindPopup(popupContent);
      window._homeMapMarkers.push(marker);
      bounds.extend([seller.lat, seller.lng]);
      hasValidMarkers = true;
    }
  });

  if (hasValidMarkers) {
    window._homeMap.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
  } else if (!query) {
    window._homeMap.setView([42.8746, 74.5698], 12);
  }
}

export function initOffersMap(offers) {
  const mapContainer = document.getElementById('offersMap');
  if (!mapContainer) return;

  if (!window._currentProductMap) {
    window._currentProductMap = L.map('offersMap', {
      rotate: true,
      touchRotate: true,
      rotateControl: {
        closeOnZeroPitch: false
      }
    }).setView([42.8746, 74.5698], 13);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(window._currentProductMap);
  }

  setTimeout(() => {
    if (window._currentProductMap) window._currentProductMap.invalidateSize();
  }, 100);

  updateMapMarkers(offers);
}

export function updateMapMarkers(offers) {
  if (!window._currentProductMap) return;

  if (window._currentMapMarkers) {
    window._currentMapMarkers.forEach(m => window._currentProductMap.removeLayer(m));
  }
  window._currentMapMarkers = [];
  window._currentMapMarkersDict = {};

  const bounds = L.latLngBounds();
  let hasValidMarkers = false;

  offers.forEach(offer => {
    const seller = SELLERS.find(s => s.id === offer.sellerId);
    if (seller && seller.lat && seller.lng) {
      if (!window._currentMapMarkersDict[seller.id]) {
        const marker = L.marker([seller.lat, seller.lng]).addTo(window._currentProductMap);
        
        const popupContent = `
          <div class="p-1 min-w-[140px]">
            <div class="font-bold text-sm mb-1">${seller.name}</div>
            <div class="text-xs text-surface-500 mb-2">Рейтинг: ${seller.rating} ★</div>
            <div class="text-base font-bold text-primary-600 mb-2">${offer.price.toLocaleString()} сом</div>
            <a href="${seller.url}" target="_blank" class="block w-full text-center bg-primary-600 text-white text-xs py-1.5 rounded-lg hover:bg-primary-700 transition-colors">Перейти в магазин</a>
          </div>
        `;
        
        marker.bindPopup(popupContent);
        window._currentMapMarkers.push(marker);
        window._currentMapMarkersDict[seller.id] = marker;
        bounds.extend([seller.lat, seller.lng]);
        hasValidMarkers = true;
      }
    }
  });

  if (hasValidMarkers) {
    window._currentProductMap.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
  } else {
    window._currentProductMap.setView([42.8746, 74.5698], 13);
  }
}

export function focusMapMarker(sellerId) {
  if (window._currentMapMarkersDict && window._currentMapMarkersDict[sellerId] && window._currentProductMap) {
    const marker = window._currentMapMarkersDict[sellerId];
    marker.openPopup();
    window._currentProductMap.panTo(marker.getLatLng(), {animate: true, duration: 0.5});
  }
}

// Fullscreen Map Logic
export function initFullscreenMap() {
  const mapContainer = document.getElementById('fullscreenMap');
  if (!mapContainer) return;

  if (!window._fullMap) {
    window._fullMap = L.map('fullscreenMap', {
      zoomControl: false,
      rotate: true,
      touchRotate: true,
      rotateControl: {
        closeOnZeroPitch: false
      }
    }).setView([42.8746, 74.5698], 13);
    
    L.control.zoom({ position: 'bottomright' }).addTo(window._fullMap);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(window._fullMap);

    window._fullMap.on('moveend', () => {
      updateMapSidebarList();
    });
  }

  setTimeout(() => {
    if (window._fullMap) {
      window._fullMap.invalidateSize();
      updateMapFilters(); // Initial render
    }
  }, 100);
}

export function closeFullscreenMap() {
  window.history.back(); // Or navigate to '/'
}

export function toggleMapFilters() {
  const panel = document.getElementById('mapFiltersPanel');
  if (panel) {
    panel.classList.toggle('hidden');
  }
}

export function updateMapFilters() {
  if (!window._fullMap) return;

  const type = document.getElementById('mapFilterType')?.value || 'all';
  const brand = document.getElementById('mapFilterBrand')?.value || '';
  const category = document.getElementById('mapFilterCategory')?.value || '';
  const search = document.getElementById('mapSearchInput')?.value.toLowerCase() || '';

  if (window._fullMapMarkers) {
    window._fullMapMarkers.forEach(m => window._fullMap.removeLayer(m.marker));
  }
  
  window._fullMapMarkers = [];
  const bounds = L.latLngBounds();
  let hasValidMarkers = false;

  // Filter sellers & products
  SELLERS.forEach(seller => {
    if (!seller.lat || !seller.lng) return;

    let sellerOffers = OFFERS.filter(o => o.sellerId === seller.id);
    let sellerProducts = [];
    
    sellerOffers.forEach(o => {
      const v = VARIANTS.find(v => v.id === o.variantId);
      if (v) {
        const p = PRODUCTS.find(prod => prod.id === v.productId);
        if (p) sellerProducts.push({offer: o, product: p});
      }
    });

    if (brand) {
      sellerProducts = sellerProducts.filter(sp => sp.product.brandId === brand);
    }
    if (category) {
      sellerProducts = sellerProducts.filter(sp => sp.product.categoryId === category);
    }

    if (search) {
      const matchSeller = seller.name.toLowerCase().includes(search);
      const matchProducts = sellerProducts.filter(sp => sp.product.name.toLowerCase().includes(search));
      if (!matchSeller) sellerProducts = matchProducts;
      
      if (!matchSeller && sellerProducts.length === 0) return; // Skip
    }

    // Determine if we show based on type
    if (type === 'products' && sellerProducts.length === 0) return;
    if (type === 'sellers' && brand) return; // If filtering by brand, but want sellers specifically? Standard behavior.

    // Create marker
    const marker = L.marker([seller.lat, seller.lng]).addTo(window._fullMap);
    
    let popupHTML = `
      <div class="p-1 min-w-[180px]">
        <div class="font-bold text-sm mb-1">${seller.logo} ${seller.name}</div>
        <div class="text-[10px] text-surface-500 mb-2">★ ${seller.rating} (${seller.reviewsCount} отз)</div>
        <button onclick="window.navigate('/seller/${seller.id}');" class="w-full text-center bg-surface-100 text-surface-800 text-[10px] font-bold py-1.5 rounded-lg hover:bg-surface-200 transition-colors mb-2">О магазине</button>
    `;

    if (sellerProducts.length > 0) {
       popupHTML += `<div class="max-h-32 overflow-y-auto custom-scrollbar border-t border-surface-200 pt-2 space-y-2">`;
       sellerProducts.slice(0, 5).forEach(sp => {
         popupHTML += `
          <div class="flex items-center gap-2 cursor-pointer group" onclick="window.navigate('/product/${sp.product.slug}');">
            <img src="${sp.product.image}" class="w-8 h-8 object-contain rounded-md bg-surface-50 p-0.5">
            <div class="flex-1 min-w-0">
              <div class="text-[10px] font-bold truncate group-hover:text-primary-600 transition-colors">${sp.product.name}</div>
              <div class="text-[10px] font-black text-primary-600">${sp.offer.price.toLocaleString()} ⃏</div>
            </div>
          </div>
         `;
       });
       if (sellerProducts.length > 5) popupHTML += `<div class="text-[10px] text-center text-surface-500 pt-1">Ещё ${sellerProducts.length - 5} товаров...</div>`;
       popupHTML += `</div>`;
    }

    popupHTML += `</div>`;

    marker.bindPopup(popupHTML);
    window._fullMapMarkers.push({ marker, seller, products: sellerProducts });
    bounds.extend([seller.lat, seller.lng]);
    hasValidMarkers = true;
  });

  if (hasValidMarkers && (!brand && !category && !search)) {
    // Only fit bounds initially
    window._fullMap.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
  }

  updateMapSidebarList();
}

export function updateMapSearch() {
  updateMapFilters();
}

export function updateMapSidebarList() {
  const container = document.getElementById('mapSidebarList');
  const countEl = document.getElementById('mapItemsCount');
  if (!container || !window._fullMap || !window._fullMapMarkers) return;

  const currentBounds = window._fullMap.getBounds();
  let visibleItems = [];

  window._fullMapMarkers.forEach(data => {
    if (currentBounds.contains(data.marker.getLatLng())) {
      visibleItems.push(data);
    }
  });

  countEl.textContent = `Объектов найдено: ${visibleItems.length}`;

  if (visibleItems.length === 0) {
    container.innerHTML = `<div class="text-center text-surface-500 text-xs py-8">В этой области нет результатов. Попробуйте отдалить карту.</div>`;
    return;
  }

  container.innerHTML = visibleItems.map(data => {
    const s = data.seller;
    const pCount = data.products.length;
    return `
      <div class="bg-surface-50 p-2 sm:p-3 rounded-xl hover:bg-surface-100 transition-colors cursor-pointer border border-surface-200/50" onclick="window.focusFullMapMarker('${s.id}')">
        <div class="flex items-center gap-2 mb-1.5">
          <div class="text-xl">${s.logo}</div>
          <div class="flex-1 min-w-0">
            <h4 class="font-bold text-xs truncate">${s.name}</h4>
            <div class="text-[10px] text-surface-500">★ ${s.rating}</div>
          </div>
        </div>
        ${pCount > 0 ? `
          <div class="text-[10px] font-bold text-primary-600 bg-primary-50 rounded-lg px-2 py-1 inline-block">
            ${pCount} товаров найдено
          </div>
        ` : ''}
      </div>
    `;
  }).join('');
}

export function focusFullMapMarker(sellerId) {
  if (!window._fullMap || !window._fullMapMarkers) return;
  const target = window._fullMapMarkers.find(m => m.seller.id === sellerId);
  if (target) {
    window._fullMap.panTo(target.marker.getLatLng(), {animate: true, duration: 0.5});
    target.marker.openPopup();
  }
}
