export function copyToClipboardButton(reference) {
  return `<button
            title="Copiar"
            onclick="copyToClipboard('${reference}', this)"
            class="bg-blue-100 text-blue-600 px-3 py-1 rounded-md hover:bg-blue-600 hover:text-white transition text-sm">
              <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 4h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3m0 3h6m-6 5h6m-6 4h6M10 3v4h4V3h-4Z"/></svg>
              <svg class="w-4 h-4 text-fg-brand hidden" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 4h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3m0 3h6m-6 7 2 2 4-4m-5-9v4h4V3h-4Z"/></svg>       
          </button>`
}

window.copyToClipboard = (text, button) => {

  window.api.copiarTexto(text);

  const [copyIcon, checkIcon] = button.querySelectorAll('svg');


  copyIcon.classList.add('hidden');


  checkIcon.classList.remove('hidden');


  button.classList.replace('bg-blue-100', 'bg-green-500');
  button.classList.replace('text-blue-600', 'text-white');

  setTimeout(() => {
   
    checkIcon.classList.add('hidden');
    copyIcon.classList.remove('hidden');


    button.classList.replace('bg-green-500', 'bg-blue-100');
    button.classList.replace('text-white', 'text-blue-600');

  }, 1500);
};