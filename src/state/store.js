// Глобальный объект State с синхронизацией в localStorage

// Дефолтное состояние
let state = {
  user: { name: 'Гость', role: 'visitor' },
  settings: { theme: 'light' },
  visitedPages: 0,
};

// Загрузка состояния из localStorage
export const initStore = () => {
  const stored = localStorage.getItem('app_state');
  if (stored) {
    try {
      state = { ...state, ...JSON.parse(stored) };
    } catch (e) {
      console.error('Ошибка парсинга стейта:', e);
    }
  }
};

// Получение текущего состояния
export const getState = () => ({ ...state });

// Обновление состояния
export const setState = (newState) => {
  state = { ...state, ...newState };
  localStorage.setItem('app_state', JSON.stringify(state));
  
  // Триггерим кастомное событие для реактивности (по необходимости)
  document.dispatchEvent(new CustomEvent('state-changed', { detail: state }));
};
