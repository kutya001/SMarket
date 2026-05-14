import { SELLERS, OFFERS, VARIANTS, PRODUCTS } from '../data/mockData.js';
import { navigate } from '../router/router.js';

export function initHomeMap() {
  const mapContainer = document.getElementById('homeGlobalMap');
  if (!mapContainer) return;

  if (!window._homeMap) {
    window._homeMap = L.map('homeGlobalMap').setView([42.8746, 74.5698], 12);
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
    window._currentProductMap = L.map('offersMap').setView([42.8746, 74.5698], 13);
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
