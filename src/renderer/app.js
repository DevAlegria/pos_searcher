const inputBusqueda = document.getElementById('busqueda');
const tablaResultados = document.getElementById('resultados');

async function cargarDatos(termino = '') {
    const productos = await window.api.buscarProductos(termino);

    const productsAndLocation = await Promise.all(productos.map(async (p)=>{
      const details = await searchProductStore(p.strReferencia);
      const stockBodega = details.length > 0 ? details[0].intCantidad : 0;
      return {
        ...p,
        intStore: stockBodega
      }
    }))

    tablaResultados.innerHTML = productsAndLocation.map(p => `
        <tr class="hover:bg-gray-50 transition-colors">
            <td class="px-4 py-3">
              <p class="text-xs text-gray-400 uppercase font-semibold">Ref: ${p.strReferencia} ${p.strCodigo ? `/ ${p.strCodigo}` : ''}</p>
              <p class="font-bold text-gray-800">${p.strDescripcion}</p>
            </td>
            <td class="px-4 py-3 text-center text-green-600 font-bold">$${p.intValorUnitario}</td>
            <td class="px-4 py-3 text-center font-medium">${p.intCantidad}</td>
            <td class="px-4 py-3 text-center">
              <button 
                    onclick="copiarAlPortapapeles('${p.strReferencia}', this)"
                    class="bg-blue-100 text-blue-600 px-3 py-1 rounded-md hover:bg-blue-600 hover:text-white transition text-sm">
                    Copiar
                </button>
            </td>
          </tr>

          <tr class="bg-gray-50/50">
            <td colspan="4" class="px-4 py-2">
              <div class="flex justify-between text-xs text-gray-500 italic">
                <p><span class="font-semibold text-gray-700">Ubicación:</span> Frente A</p>
                <p><span class="font-semibold text-gray-700">Bodega:</span> ${p.intStore} k14</p>
                <p><span class="font-semibold text-gray-700">Total disponible:</span> ${p.intStore + p.intCantidad} unidades</p>
              </div>
            </td>
          </tr>
    `).join('');


}

async function searchProductStore(reference){
  const producto = await window.api.serachProduct(reference);
  return producto;
}

window.copiarAlPortapapeles = (texto, boton) => {

    window.api.copiarTexto(texto);

    // Feedback visual profesional
    const textoOriginal = boton.innerText;
    boton.innerText = '¡Copiado!';
    boton.classList.replace('bg-blue-100', 'bg-green-500');
    boton.classList.replace('text-blue-600', 'text-white');

    setTimeout(() => {
        boton.innerText = textoOriginal;
        boton.classList.replace('bg-green-500', 'bg-blue-100');
        boton.classList.replace('text-white', 'text-blue-600');
    }, 1500);
};

// Cargar inicial
cargarDatos();

// Evento de búsqueda con un pequeño delay
let timeout;
inputBusqueda.addEventListener('input', (e) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        cargarDatos(e.target.value);
    }, 300);
});