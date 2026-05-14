import { Card } from '../components/Card.js';
import { getState } from '../state/store.js';

export const Home = () => {
  const state = getState();
  
  return `
    <div class="max-w-4xl mx-auto animation-fade-in">
      <div class="flex flex-col mb-8 mt-4">
        <h1 class="text-3xl font-bold tracking-tight text-gray-900">Добро пожаловать, ${state.user?.name || 'Гость'}</h1>
        <p class="text-gray-500 mt-2">Вы переходили по страницам: <span class="font-semibold text-indigo-600">${state.visitedPages} раз(а)</span></p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${Card({ 
            title: 'Интеграция Leaflet', 
            description: 'Использование глобальных библиотек через CDN без типизированных пакетов npm.',
            badge: 'Feature'
        })}
        ${Card({ 
            title: 'Компонентный подход', 
            description: 'Создание UI компонентов с помощью шаблонных строк (Template Literals) в чистом JS.',
            badge: 'Architecture'
        })}
        ${Card({ 
            title: 'State & Routing', 
            description: 'Клиентский hash-роутинг и единый источник истины с сохранением в localStorage.' 
        })}
      </div>
    </div>
  `;
};
