import { USERS } from './data/mockData.js';
import { showToast } from './components/ui/toast.js';

let authState = { phone: '', code: '', tempUser: null };

export function openAuthModal() {
  const State = window.State;
  if (State.user) {
    window.location.hash = '/profile';
    return;
  }
  const modal = document.getElementById('authModal');
  modal.classList.remove('hidden');
  renderPhoneStep();
}

export function closeAuthModal() {
  const modal = document.getElementById('authModal');
  modal.classList.add('hidden');
  authState = { phone: '', code: '', tempUser: null };
}

export function renderPhoneStep() {
  const content = document.getElementById('authModalContent');
  content.innerHTML = `
    <h2 class="text-2xl font-bold text-surface-800 mb-6">Вход или регистрация</h2>
    <form onsubmit="window.handlePhoneSubmit(event)" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-surface-700 mb-1">Номер телефона</label>
        <input type="tel" id="authPhone" required placeholder="+996 555 123 456" class="w-full px-4 py-3 border border-surface-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent">
        <p class="text-xs text-surface-500 mt-1">Тестовые аккаунты: +996555123456 (Level 1), +996777123456 (Level 2), +996500123456 (Level 3)</p>
      </div>
      <button type="submit" class="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors">Получить код</button>
    </form>
    <div class="mt-4 pt-4 border-t border-surface-100 flex flex-col gap-3">
      <a href="https://sotka.kg" target="_blank" onclick="window.closeAuthModal()" class="w-full relative flex items-center justify-center bg-surface-800 text-white py-3.5 rounded-xl font-bold hover:bg-surface-700 transition-colors shadow-lg overflow-hidden group">
        <span class="z-10 flex items-center gap-2">
          <svg class="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
           Я хочу стать продавцом (Sotka Business)
        </span>
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
      </a>
    </div>
  `;
}

export function handlePhoneSubmit(e) {
  e.preventDefault();
  const phone = document.getElementById('authPhone').value.replace(/[^0-9+]/g, '');
  authState.phone = phone;
  showToast('Код отправлен на номер', 'success');
  renderCodeStep();
}

export function renderCodeStep() {
  const content = document.getElementById('authModalContent');
  content.innerHTML = `
    <h2 class="text-2xl font-bold text-surface-800 mb-2">Введите код</h2>
    <p class="text-sm text-surface-500 mb-6">Код отправлен на номер ${authState.phone}</p>
    <form onsubmit="window.handleCodeSubmit(event)" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-surface-700 mb-1">4-значный код (любой)</label>
        <input type="text" id="authCode" required maxlength="4" placeholder="1234" class="w-full px-4 py-3 border border-surface-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent text-center tracking-[1em] text-lg font-bold">
      </div>
      <button type="submit" class="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors">Подтвердить</button>
      <button type="button" onclick="window.renderPhoneStep()" class="w-full text-surface-500 hover:text-surface-700 text-sm font-medium mt-2">Изменить номер</button>
    </form>
  `;
}

export function handleCodeSubmit(e) {
  e.preventDefault();
  const code = document.getElementById('authCode').value;
  if(code.length !== 4) return showToast('Введите 4 цифры', 'error');
  
  // Find user by phone
  let user = USERS.find(u => u.phone === authState.phone);
  if (user) {
    // Log user in
    window.State.user = user;
    window.saveState();
    closeAuthModal();
    showToast('Вы успешно вошли!', 'success');
    window.location.hash = '/profile';
  } else {
    // New user -> Profile Setup Step (Password)
    authState.tempUser = {
      id: 'new-' + Date.now(),
      level: 1,
      phone: authState.phone,
      history: { purchases: [], contacts: [], browsing: [], chats: [] }
    };
    renderPasswordStep();
  }
}

export function renderPasswordStep() {
  const content = document.getElementById('authModalContent');
  content.innerHTML = `
    <h2 class="text-2xl font-bold text-surface-800 mb-2">Создайте пароль</h2>
    <p class="text-sm text-surface-500 mb-6">Последний шаг регистрации</p>
    <form onsubmit="window.handlePasswordSubmit(event)" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-surface-700 mb-1">Пароль</label>
        <input type="password" id="regPass1" required minlength="6" placeholder="Минимум 6 символов" class="w-full px-4 py-3 border border-surface-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent">
      </div>
      <div>
        <label class="block text-sm font-medium text-surface-700 mb-1">Подтвердите пароль</label>
        <input type="password" id="regPass2" required minlength="6" placeholder="Повторите пароль" class="w-full px-4 py-3 border border-surface-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent">
      </div>
      <button type="submit" class="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors mt-4">Завершить регистрацию</button>
    </form>
  `;
}

export function handlePasswordSubmit(e) {
  e.preventDefault();
  const p1 = document.getElementById('regPass1').value;
  const p2 = document.getElementById('regPass2').value;
  if (p1 !== p2) {
    return showToast('Пароли не совпадают', 'error');
  }
  authState.tempUser.password = p1;
  finishAuth();
}

export function continueVerification() {
  window.location.hash = '/profile';
  // Attempt to switch tab if we are already on the profile page
  if (window.switchProfileTab) {
    window.switchProfileTab('personal');
  }
}

export function finishAuth() {
  window.State.user = authState.tempUser;
  if (!window.State.user.survey) window.State.user.survey = {};
  
  // Also push to mock USERS so it works next time in this session (if not already there)
  if (!USERS.find(u => u.id === window.State.user.id)) {
    USERS.push(window.State.user);
  }
  
  window.saveState();
  closeAuthModal();
  showToast('Данные профиля обновлены!', 'success');
  window.location.hash = '/profile';
  window.renderCurrentPage(); // re-render profile page to reflect level changes
}
