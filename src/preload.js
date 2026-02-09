const { contextBridge, ipcRenderer, clipboard } = require('electron');

contextBridge.exposeInMainWorld('api', {
  buscarProductos: (termino) => ipcRenderer.invoke('buscar-productos', termino),
  serachProduct: (reference) => ipcRenderer.invoke('search-product', reference),
  copiarTexto: (texto) => ipcRenderer.send('copiar-a-portapapeles', texto)
});