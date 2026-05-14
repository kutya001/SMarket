import { Home } from '../pages/Home.js';
import { MapPage } from '../pages/MapPage.js';
import { setState, getState } from '../state/store.js';

// Карта маршрутов
const routes = {
  '': Home,
  '#home': Home,
  '#map': MapPage,
};

export const initRouter = () => {
  // Слушаем изменение хэша в URL
  window.addEventListener('hashchange', renderRoute);
  // Первоначальный рендер
  renderRoute();
};

const renderRoute = () => {
  const view = document.getElementById('router-view');
  if (!view) return;

  const hash = window.location.hash || '#home';
  const route = routes[hash] || routes['#home']; // Fallback на Home

  // Рендерим HTML страницы 
  view.innerHTML = route();

  // Обновляем состояние 
  const currentState = getState();
  setState({ visitedPages: currentState.visitedPages + 1 });

  // Создаем кастомное событие после рендера, чтобы страницы могли инициализировать DOM-зависимые скрипты
  document.dispatchEvent(new CustomEvent('route-changed', { detail: { path: hash } }));
};
