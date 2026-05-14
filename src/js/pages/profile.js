import { PRODUCTS } from '../data/mockData.js';
import { showToast } from '../components/ui/toast.js';

export function renderProfilePage(container) {
  const State = window.State;
  if (!State.user) {
    window.location.hash = '/';
    return;
  }
  
  const user = State.user;
  if (!user.history) {
    user.history = { purchases: [], contacts: [], browsing: [], chats: [] };
  }
  document.title = 'Профиль — SotkaMarket';

  // Helper to format level
  let levelBadge = '';
  switch(user.level) {
    case 1: levelBadge = '<span class="px-3 py-1 bg-surface-100 text-surface-700 rounded-full text-xs font-bold shadow-sm">Уровень 1 (Тел)</span>'; break;
    case 2: levelBadge = '<span class="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold shadow-sm">Уровень 2 (ФИО + Email)</span>'; break;
    case 3: levelBadge = '<span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold shadow-sm flex items-center gap-1"><span class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>Уровень 3 (Паспорт)</span>'; break;
    default: levelBadge = '<span class="px-3 py-1 bg-surface-100 text-surface-600 rounded-full text-xs font-bold shadow-sm">Без уровня</span>';
  }

  const purchasesHTML = user.history.purchases.length === 0 
    ? '<p class="text-sm text-surface-500">Нет покупок</p>' 
    : user.history.purchases.map(p => `
        <div class="flex justify-between p-4 border border-transparent rounded-xl mb-3 shadow-sm hover:border-primary-200 transition-colors bg-surface-50 text-sm">
          <span class="text-surface-800 font-medium">Товар #${p.id}</span>
          <span class="text-surface-500 font-medium">${p.date} • <span class="text-primary-600">${p.price.toLocaleString('ru-RU')} ₸</span></span>
        </div>
      `).join('');

  const contactsHTML = user.history.contacts.length === 0
    ? '<p class="text-sm text-surface-500">Нет истории связей</p>'
    : user.history.contacts.map(c => `
        <div class="flex justify-between p-4 border border-transparent rounded-xl mb-3 shadow-sm hover:border-primary-200 transition-colors bg-surface-50 text-sm">
          <span class="text-surface-800 font-medium">Продавец #${c.sellerId}</span>
          <span class="text-surface-500 font-medium">${c.date}</span>
        </div>
      `).join('');

  const browsingHTML = user.history.browsing.length === 0
    ? '<p class="text-sm text-surface-500">История пуста</p>'
    : `
      <div class="overflow-x-auto bg-white rounded-xl border border-transparent shadow-sm">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-50 border-b border-transparent text-xs uppercase tracking-wider text-surface-500 font-semibold">
              <th class="py-3 px-4">Товар</th>
              <th class="py-3 px-4 hidden md:table-cell">Бренд</th>
              <th class="py-3 px-4 hidden sm:table-cell">Модель</th>
              <th class="py-3 px-4">Дата просмотра</th>
              <th class="py-3 px-4">Время</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-transparent">
            ${user.history.browsing.map(b => {
              const pId = typeof b === 'string' ? b : b.id;
              const product = PRODUCTS.find(p => p.id === pId);
              if (!product) return '';
              
              const dateObj = (typeof b === 'object' && b.viewedAt) ? new Date(b.viewedAt) : new Date();
              const dateStr = dateObj.toLocaleDateString('ru-RU');
              const timeStr = dateObj.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
              
              return `
                <tr class="hover:bg-surface-50 transition-colors group cursor-pointer" onclick="window.location.hash = '#/product/${product.id}'">
                  <td class="py-3 px-4">
                     <div class="flex items-center gap-3">
                      <div class="w-10 h-10 flex-shrink-0 bg-white rounded-lg border border-transparent flex items-center justify-center overflow-hidden p-1">
                        <img src="${product.image}" alt="${product.name}" class="w-full h-full object-contain">
                      </div>
                      <span class="font-medium text-surface-800 group-hover:text-primary-600 transition-colors line-clamp-1">${product.name}</span>
                    </div>
                  </td>
                  <td class="py-3 px-4 text-sm text-surface-600 hidden md:table-cell capitalize">${product.brand}</td>
                  <td class="py-3 px-4 text-sm text-surface-600 hidden sm:table-cell uppercase">${product.model}</td>
                  <td class="py-3 px-4 text-sm text-surface-600 whitespace-nowrap">${dateStr}</td>
                  <td class="py-3 px-4 text-sm text-surface-600 whitespace-nowrap">${timeStr}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;

  const chatsHTML = user.history.chats.length === 0
    ? '<p class="text-sm text-surface-500">Нет активных чатов</p>'
    : user.history.chats.map(c => `
        <div class="p-4 border border-transparent rounded-2xl mb-4 bg-white shadow-sm">
          <div class="font-bold text-sm mb-3 text-surface-800">Чат с продавцом #${c.sellerId}</div>
          <div class="space-y-3 mt-2">
            ${c.messages.map(m => `
               <div class="text-xs ${m.sender === user.id ? 'text-right' : 'text-left'}">
                 <span class="inline-block px-3 py-2 rounded-2xl shadow-sm ${m.sender === user.id ? 'bg-primary-500 text-white rounded-br-sm' : 'bg-surface-100 text-surface-800 rounded-bl-sm'}">
                   ${m.text}
                 </span>
               </div>
            `).join('')}
          </div>
          <div class="mt-4 pt-3 border-t border-transparent">
             <div class="flex gap-2">
                <input type="text" placeholder="Написать сообщение..." class="flex-1 bg-surface-50 border border-transparent px-3 py-2 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none">
                <button class="bg-primary-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors">Оправить</button>
             </div>
          </div>
        </div>
      `).join('');

  const personalDataHTML = `
    <form onsubmit="window.handleProfileUpdate(event)" class="space-y-5 max-w-3xl">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label class="block text-sm font-medium text-surface-700 mb-1.5">Фамилия</label>
          <input type="text" id="profSurname" value="${user.surname || ''}" placeholder="Иванов" class="w-full px-4 py-3 border border-transparent rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all">
        </div>
        <div>
          <label class="block text-sm font-medium text-surface-700 mb-1.5">Имя</label>
          <input type="text" id="profName" value="${user.name || ''}" placeholder="Иван" required class="w-full px-4 py-3 border border-transparent rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all">
        </div>
        <div>
          <label class="block text-sm font-medium text-surface-700 mb-1.5">Отчество</label>
          <input type="text" id="profPatronymic" value="${user.patronymic || ''}" placeholder="Иванович" class="w-full px-4 py-3 border border-transparent rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all">
        </div>
        <div>
          <label class="block text-sm font-medium text-surface-700 mb-1.5">Телефон</label>
          <input type="tel" value="${user.phone || ''}" disabled class="w-full px-4 py-3 bg-surface-50 border border-transparent rounded-xl text-sm text-surface-500 cursor-not-allowed">
        </div>
        <div>
          <label class="block text-sm font-medium text-surface-700 mb-1.5">Email</label>
          <input type="email" id="profEmail" value="${user.email || ''}" placeholder="email@example.com" class="w-full px-4 py-3 border border-transparent rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all">
        </div>
        <div>
          <label class="block text-sm font-medium text-surface-700 mb-1.5">Год рождения</label>
          <input type="number" id="profBirthYear" min="1900" max="${new Date().getFullYear()}" value="${user.birthYear || ''}" placeholder="1990" class="w-full px-4 py-3 border border-transparent rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all">
        </div>
        <div>
          <label class="block text-sm font-medium text-surface-700 mb-1.5">Город проживания</label>
          <select id="profCity" class="w-full px-4 py-3 border border-transparent rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all">
            <option value="">Выберите город</option>
            <option value="Бишкек" ${user.city === 'Бишкек' ? 'selected' : ''}>Бишкек</option>
            <option value="Ош" ${user.city === 'Ош' ? 'selected' : ''}>Ош</option>
            <option value="Жалал-Абад" ${user.city === 'Жалал-Абад' ? 'selected' : ''}>Жалал-Абад</option>
            <option value="Каракол" ${user.city === 'Каракол' ? 'selected' : ''}>Каракол</option>
            <option value="Нарын" ${user.city === 'Нарын' ? 'selected' : ''}>Нарын</option>
            <option value="Талас" ${user.city === 'Талас' ? 'selected' : ''}>Талас</option>
            <option value="Баткен" ${user.city === 'Баткен' ? 'selected' : ''}>Баткен</option>
          </select>
        </div>
        <div class="md:col-span-2 pt-4 border-t border-transparent mt-2"><h4 class="font-bold text-surface-800 text-sm">Данные для 3 уровня (Паспорт)</h4></div>
        <div>
          <label class="block text-sm font-medium text-surface-700 mb-1.5">ИНН (ПИН)</label>
          <input type="text" id="profInn" value="${user.inn || ''}" placeholder="14 цифр" class="w-full px-4 py-3 border border-transparent rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all">
        </div>
        <div>
          <label class="block text-sm font-medium text-surface-700 mb-1.5">Паспорт (ID)</label>
          <input type="text" id="profPassport" value="${user.passport || ''}" placeholder="ID123456" class="w-full px-4 py-3 border border-transparent rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all">
        </div>
      </div>
      
      <div class="mt-8 pt-6 border-t border-transparent flex flex-col md:flex-row items-center justify-between gap-4">
        <p class="text-xs text-surface-500 max-w-sm">После сохранения измененные данные будут отправлены на проверку модераторам для пересмотра вашего уровня профиля.</p>
        <button type="submit" class="w-full md:w-auto bg-primary-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-700 hover:shadow-lg hover:-translate-y-0.5 transition-all">Сохранить изменения</button>
      </div>
    </form>
  `;

  container.innerHTML = `
    <div class="bg-surface-50 py-6 md:py-10 min-h-screen pb-safe pb-24">
      <div class="max-w-7xl mx-auto px-4 md:px-6 mb-24">
        
        <div class="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8 bg-surface-0/80 backdrop-blur-xl p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-transparent relative overflow-hidden group">
          <div class="absolute -right-20 -top-20 w-64 h-64 bg-primary-50 rounded-full blur-3xl opacity-50 group-hover:bg-primary-100 transition-colors pointer-events-none"></div>
          <div class="w-24 h-24 bg-gradient-to-br from-primary-500 to-amber-500 rounded-[1.5rem] flex items-center justify-center text-white text-4xl font-bold shadow-lg flex-shrink-0 z-10 rotate-3 group-hover:rotate-6 transition-transform">
            ${user.name ? user.name[0].toUpperCase() : (user.phone ? user.phone[user.phone.length - 1] : 'U')}
          </div>
          <div class="flex-1 z-10">
            <div class="flex flex-wrap items-center gap-3 mb-2">
              <h1 class="text-2xl md:text-3xl font-bold text-surface-900 tracking-tight">${user.surname || ''} ${user.name || 'Пользователь'} ${user.patronymic || ''}</h1>
              ${levelBadge}
            </div>
            <div class="text-surface-500 flex flex-wrap gap-4 text-sm mt-3 font-medium">
              <span class="flex items-center gap-1.5">Тел: ${user.phone}</span>
              ${user.email ? `<span class="flex items-center gap-1.5">Email: ${user.email}</span>` : ''}
              ${user.city ? `<span class="flex items-center gap-1.5">Город: ${user.city}</span>` : ''}
            </div>
          </div>
          <button onclick="window.handleLogout()" class="mt-4 md:mt-0 px-6 py-3 bg-white/50 border-2 border-transparent text-red-600 rounded-xl font-bold hover:bg-red-50 transition-colors flex-shrink-0 z-10 backdrop-blur-sm">Выйти</button>
        </div>

        <div class="bg-surface-0/80 backdrop-blur-xl rounded-[2.5rem] shadow-sm border border-transparent overflow-hidden">
          <div class="flex overflow-x-auto custom-scrollbar border-b border-transparent sticky top-0 bg-surface-0/60 backdrop-blur-xl z-20">
            <button onclick="window.switchProfileTab('personal')" id="tab-btn-personal" class="profile-tab-btn whitespace-nowrap px-6 py-4 text-sm font-bold border-b-2 border-primary-500 text-primary-600 transition-colors">Личные данные</button>
            <button onclick="window.switchProfileTab('purchases')" id="tab-btn-purchases" class="profile-tab-btn whitespace-nowrap px-6 py-4 text-sm font-bold border-b-2 border-transparent text-surface-500 hover:text-surface-800 transition-colors">История покупок</button>
            <button onclick="window.switchProfileTab('browsing')" id="tab-btn-browsing" class="profile-tab-btn whitespace-nowrap px-6 py-4 text-sm font-bold border-b-2 border-transparent text-surface-500 hover:text-surface-800 transition-colors">Недавно просмотренные</button>
            <button onclick="window.switchProfileTab('contacts')" id="tab-btn-contacts" class="profile-tab-btn whitespace-nowrap px-6 py-4 text-sm font-bold border-b-2 border-transparent text-surface-500 hover:text-surface-800 transition-colors">История контактов</button>
            <button onclick="window.switchProfileTab('chats')" id="tab-btn-chats" class="profile-tab-btn whitespace-nowrap px-6 py-4 text-sm font-bold border-b-2 border-transparent text-surface-500 hover:text-surface-800 transition-colors">Чаты</button>
          </div>

          <div class="p-6 md:p-8">
            <div id="tab-personal" class="profile-tab-content block animate-fadeIn">
              <h3 class="text-xl font-bold text-surface-900 mb-6">Ваши данные</h3>
              ${personalDataHTML}
            </div>
            
            <div id="tab-purchases" class="profile-tab-content hidden animate-fadeIn">
              <h3 class="text-xl font-bold text-surface-900 mb-6 flex items-center gap-2"><svg class="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg> История покупок</h3>
              <div class="max-w-3xl">
                ${purchasesHTML}
              </div>
            </div>
            
            <div id="tab-browsing" class="profile-tab-content hidden animate-fadeIn">
              <h3 class="text-xl font-bold text-surface-900 mb-6 flex items-center gap-2"><svg class="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg> Недавно просмотренные</h3>
              ${browsingHTML}
            </div>
            
            <div id="tab-contacts" class="profile-tab-content hidden animate-fadeIn">
              <h3 class="text-xl font-bold text-surface-900 mb-6 flex items-center gap-2"><svg class="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg> История по звонкам / WhatsApp</h3>
              <div class="max-w-3xl">
                ${contactsHTML}
              </div>
            </div>
            
            <div id="tab-chats" class="profile-tab-content hidden animate-fadeIn">
              <h3 class="text-xl font-bold text-surface-900 mb-6 flex items-center gap-2"><svg class="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg> Ваши чаты</h3>
              <div class="max-w-3xl">
                ${chatsHTML}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  `;
}

export function switchProfileTab(tabId) {
  // Hide all contents
  const contents = document.querySelectorAll('.profile-tab-content');
  contents.forEach(content => {
    content.classList.add('hidden');
    content.classList.remove('block');
  });
  
  // Reset all buttons
  const buttons = document.querySelectorAll('.profile-tab-btn');
  buttons.forEach(btn => {
    btn.classList.remove('border-primary-500', 'text-primary-600');
    btn.classList.add('border-transparent', 'text-surface-500');
  });
  
  // Show active content
  const activeContent = document.getElementById('tab-' + tabId);
  if (activeContent) {
    activeContent.classList.remove('hidden');
    activeContent.classList.add('block');
  }
  
  // Highlight active button
  const activeBtn = document.getElementById('tab-btn-' + tabId);
  if (activeBtn) {
    activeBtn.classList.remove('border-transparent', 'text-surface-500');
    activeBtn.classList.add('border-primary-500', 'text-primary-600');
  }
}

export function handleProfileUpdate(e) {
  e.preventDefault();
  const State = window.State;
  const user = State.user;
  
  user.surname = document.getElementById('profSurname').value;
  user.name = document.getElementById('profName').value;
  user.patronymic = document.getElementById('profPatronymic').value;
  user.email = document.getElementById('profEmail').value;
  user.birthYear = document.getElementById('profBirthYear').value;
  user.city = document.getElementById('profCity').value;
  user.inn = document.getElementById('profInn').value;
  user.passport = document.getElementById('profPassport').value;
  
  window.saveState();
  showToast('Данные отправлены на проверку администрации', 'success');
  window.renderCurrentPage();
}

