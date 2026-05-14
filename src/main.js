import './index.css';
import { initStore } from './state/store.js';
import { initRouter } from './router/index.js';
import { App } from './core/App.js';

// Точка входа в приложение
document.addEventListener('DOMContentLoaded', () => {
  // Инициализируем стейт из localStorage
  initStore();
  
  // Монтируем базовый Layout
  App.mount('#app');
  
  // Инициализируем клиентский роутинг
  initRouter();
});
