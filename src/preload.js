const { contextBridge, ipcRenderer, clipboard } = require('electron');

contextBridge.exposeInMainWorld('api', {
  searchProducts: (term) => ipcRenderer.invoke('search-products', term),
  searchProduct: (reference) => ipcRenderer.invoke('search-product', reference),
  copiarTexto: (texto) => ipcRenderer.send('copiar-a-portapapeles', texto)
});