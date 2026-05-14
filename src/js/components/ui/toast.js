export function showToast(message, type='info') {
  const container = document.getElementById('toastContainer');
  if(!container) return;
  const toast = document.createElement('div');
  const colors = { success:'bg-green-500', info:'bg-primary-600', warning:'bg-amber-500', error:'bg-red-500' };
  const icons = {
    success:'<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>',
    info:'<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
    warning:'<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>',
    error:'<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>'
  };
  toast.className = `animate-toastIn flex items-center gap-3 ${colors[type]} text-white px-4 py-3 rounded-xl shadow-lg max-w-sm`;
  toast.innerHTML = `${icons[type]}<span class="text-sm font-medium">${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.remove('animate-toastIn');
    toast.classList.add('animate-toastOut');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
