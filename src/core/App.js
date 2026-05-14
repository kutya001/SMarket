import { Header } from '../components/Header.js';

export const App = {
  mount(selector) {
    const root = document.querySelector(selector);
    if (!root) {
      console.error(`Element ${selector} not found`);
      return;
    }
    
    // Рендерим базовый шаблон приложения с Header и контейнером для роутера
    root.innerHTML = `
      ${Header()}
      <main id="router-view" class="p-6 transition-opacity duration-300"></main>
    `;
  }
};
