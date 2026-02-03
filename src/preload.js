const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  buscarProductos: (termino) => ipcRenderer.invoke('buscar-productos', termino)
});