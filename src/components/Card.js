export const Card = ({ title, description, badge }) => {
  return `
    <div class="group relative flex flex-col bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      ${badge ? `
        <span class="absolute -top-3 -right-3 bg-indigo-100 text-indigo-800 text-xs font-bold px-3 py-1 rounded-full ring-4 ring-white shadow-sm">
          ${badge}
        </span>
      ` : ''}
      <div class="flex items-center gap-2 mb-3">
        <div class="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
           <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
           </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">${title}</h3>
      </div>
      <p class="text-gray-600 text-sm leading-relaxed flex-grow">${description}</p>
      
      <div class="mt-5 pt-4 border-t border-gray-100 flex justify-end">
        <button class="text-indigo-600 text-sm font-medium hover:text-indigo-800 transition-colors flex items-center gap-1">
          Подробнее 
          <span class="group-hover:translate-x-1 transition-transform">&rarr;</span>
        </button>
      </div>
    </div>
  `;
};
