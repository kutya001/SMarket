// Слушаем кастомное событие роутера для инициализации карты
document.addEventListener('route-changed', (e) => {
  if (e.detail.path === '#map') {
    // В Event Loop отдаем время на рендер DOM, затем инициализируем Leaflet
    setTimeout(initLeaflet, 0);
  }
});

let mapInstance = null;

const initLeaflet = () => {
  const mapEl = document.getElementById('map-container');
  const L = window.L;
  
  if (mapEl && L) {
    // Очищаем старую инстанцию карты при возврате на страницу
    if (mapInstance) {
        mapInstance.remove();
    }
    
    // Инициализируем карту
    mapInstance = L.map('map-container').setView([42.8746, 74.5698], 13); // Координаты: Бишкек
    
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(mapInstance);
    
    L.marker([42.8746, 74.5698]).addTo(mapInstance)
      .bindPopup('<b class="font-sans">Leaflet JS</b><br>Работает поверх Vanilla JS.')
      .openPopup();
  }
};

export const MapPage = () => {
  return `
    <div class="max-w-4xl mx-auto animation-fade-in pt-4">
      <h1 class="text-3xl font-bold tracking-tight text-gray-900 mb-2">Интерактивная карта</h1>
      <p class="text-gray-500 mb-6">Демонстрация работы со сторонней библиотекой Leaflet.js вне экосистемы React (управление DOM напрямую).</p>
      
      <div class="rounded-xl shadow-lg border border-gray-200 overflow-hidden bg-gray-100">
        <div id="map-container" class="h-[500px] w-full relative z-0">
          <div class="absolute inset-0 flex items-center justify-center text-gray-400">Загрузка карты...</div>
        </div>
      </div>
    </div>
  `;
};
