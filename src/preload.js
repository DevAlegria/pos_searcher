const { contextBridge, ipcRenderer, clipboard } = require('electron');

contextBridge.exposeInMainWorld('api', {
  buscarProductos: (termino) => ipcRenderer.invoke('buscar-productos', termino),
  copiarTexto: (texto) => clipboard.writeText(texto)
});