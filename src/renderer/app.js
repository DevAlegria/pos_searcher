import { productItem } from './components/productItem.js';
const inputBusqueda = document.getElementById('busqueda');
const tablaResultados = document.getElementById('resultados');

async function cargarDatos(term = '') {
  const productsList = await window.api.searchProducts(term);
  const productsArray = getProductsArray(productsList);
  
  tablaResultados.innerHTML = productsArray.map(product => productItem(product)).join('');
}

/**
 * @param {Array<Object>} products
 * @returns {Array<{
 *  reference: string,
 *  code: string,
 *  description: string,
 *  price: number,
 *  quantity: number|null,
 *  location: string|null,
 *  storage: { location: string, quantity: number } | null
 * }>}
 */
function getProductsArray(products) {
  const mapProducts = new Map();

products.forEach(
    product => {
      const referenceStartsWithZ = product.strReferencia.startsWith('Z-');
      const referenceKey = referenceStartsWithZ ? product.strReferencia.slice(2) : product.strReferencia;
      if (mapProducts.has(referenceKey)) {
        const existing = mapProducts.get(referenceKey);
        if (referenceStartsWithZ) {
          existing.storage = {
            location: product.strUbicacion,
            quantity: product.intCantidad
          };
        } else {
          existing.quantity = product.intCantidad;
          existing.location = product.strUbicacion;
        }
      } else {
        mapProducts.set(referenceKey, {
          reference: referenceKey,
          code: product.strCodigo,
          description: product.strDescripcion,
          price: product.intValorUnitario,
          quantity: referenceStartsWithZ ? null : product.intCantidad,
          location: referenceStartsWithZ ? null : product.strUbicacion,
          storage: referenceStartsWithZ ? { location: product.strUbicacion, quantity: product.intCantidad } : null
        });
      }
    }
  )
  return Array.from(mapProducts.values());
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