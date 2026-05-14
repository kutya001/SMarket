export const Header = () => {
  const hash = window.location.hash || '#home';
  
  const linkClass = (path) => 
    hash === path || (hash === '' && path === '#home')
      ? 'border-b-2 border-indigo-500 text-indigo-600 font-medium'
      : 'text-gray-500 hover:text-gray-900 font-medium transition-colors border-b-2 border-transparent hover:border-gray-300';

  return `
    <header class="bg-white border-b border-gray-200 sticky top-0 z-50 w-full shadow-sm">
      <div class="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md tracking-tighter">JS</div>
          <span class="text-xl font-bold tracking-tight text-gray-900">Vanilla App</span>
        </div>
        
        <nav class="flex h-full gap-6">
          <a href="#home" class="flex items-center h-full px-1 ${linkClass('#home')}">Главная</a>
          <a href="#map" class="flex items-center h-full px-1 ${linkClass('#map')}">Карта</a>
        </nav>
      </div>
    </header>
  `;
};
