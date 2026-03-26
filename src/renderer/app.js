const inputBusqueda = document.getElementById('busqueda');
const tablaResultados = document.getElementById('resultados');

async function cargarDatos(term = '') {
  const productsList = await window.api.searchProducts(term);
  const mapProducts = getMapProducts(productsList);
  const productsArray = Array.from(mapProducts.values());

  tablaResultados.innerHTML = productsArray.map(product => `
        <tr class="hover:bg-gray-50 transition-colors">
            <td class="px-4 py-3">
              <p class="text-xs text-gray-400 uppercase font-semibold">Ref: ${product.reference} ${product.code ? `/ ${product.code}` : ''}</p>
              <p class="font-bold text-gray-800">${product.description}</p>
            </td>
            <td class="px-4 py-3 text-center text-green-600 font-bold">$${product.price}</td>
            <td class="px-4 py-3 text-center font-medium">${product.quantity}</td>
            <td class="px-4 py-3 text-center">
              <button 
                    onclick="copiarAlPortapapeles('${product.reference}', this)"
                    class="bg-blue-100 text-blue-600 px-3 py-1 rounded-md hover:bg-blue-600 hover:text-white transition text-sm">
                    Copiar
                </button>
            </td>
          </tr>

          <tr class="bg-gray-50/50">
            <td colspan="4" class="px-4 py-2">
              <div class="flex justify-between text-xs text-gray-500 italic">
                <p><span class="font-semibold text-gray-700">Ubicación:</span> ${product.location}</p>
                <p><span class="font-semibold text-gray-700">Bodega:</span> ${product.storage ? product.storage.quantity + ' ' + product.storage.location : '0'} </p>
                <p><span class="font-semibold text-gray-700">Total disponible:</span> ${product.quantity + (product.storage ? product.storage.quantity : 0)} unidades</p>
              </div>
            </td>
          </tr>
    `).join('');


}

/**
 * 
 * @param {*} products 
 * @returns [strReference:{
 *  reference, code, description, price, quantity, location, storage: {location, quantity}
 * }]
 */
function getMapProducts(products) {
  const mapProducts = new Map();
  products.forEach(product => {
    if (!product.strReferencia.startsWith('Z-')) {
      mapProducts.set(product.strReferencia, {
        reference: product.strReferencia,
        code: product.strCodigo,
        description: product.strDescripcion,
        price: product.intValorUnitario,
        quantity: product.intCantidad,
        location: product.strUbicacion,
        storage: null
      });
    } else {
      const reference = product.strReferencia.slice(2)
      if (mapProducts.has(reference)) {
        const existing = mapProducts.get(reference);
        existing.storage = {
          location: product.strUbicacion,
          quantity: product.intCantidad
        };
      }
    }

  });
  
  return mapProducts;
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