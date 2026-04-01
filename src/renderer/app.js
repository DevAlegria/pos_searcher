import { productItem } from './components/productItem.js';
const inputBusqueda = document.getElementById('busqueda');
const tablaResultados = document.getElementById('resultados');

async function cargarDatos(term = '') {
  const productsList = [];
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

// 🟢 1. Solo en local (con stock)
mapProducts.set('P001', {
  reference: 'P001',
  description: 'Bujía NGK',
  price: 15,
  quantity: 10,
  location: 'MOSTRADOR',
  storage: null
});

// 🟢 2. Solo en local (sin stock)
mapProducts.set('P002', {
  reference: 'P002',
  description: 'Filtro de aire',
  price: 20,
  quantity: 0,
  location: 'ESTANTE A',
  storage: null
});

// 🔵 3. Solo en bodega (con stock)
mapProducts.set('P003', {
  reference: 'P003',
  description: 'Kit arrastre',
  price: 120,
  quantity: null,
  location: null,
  storage: {
    location: 'BODEGA',
    quantity: 8
  }
});

// 🔵 4. Solo en bodega (sin stock)
mapProducts.set('P004', {
  reference: 'P004',
  description: 'Pastillas de freno',
  price: 35,
  quantity: null,
  location: null,
  storage: {
    location: 'zx-004',
    quantity: 0
  }
});

// 🟡 5. Local con stock, bodega sin stock
mapProducts.set('P005', {
  reference: 'P005',
  description: 'Aceite 4T',
  price: 25,
  quantity: 6,
  location: 'MOSTRADOR',
  storage: {
    location: 'BODEGA',
    quantity: 0
  }
});

// 🟡 6. Local sin stock, bodega con stock
mapProducts.set('P006', {
  reference: 'P006',
  description: 'Cadena',
  price: 80,
  quantity: 0,
  location: 'ESTANTE B',
  storage: {
    location: 'BODEGA',
    quantity: 12
  }
});

// 🟡 7. Local y bodega con stock
mapProducts.set('P007', {
  reference: 'P007',
  description: 'Disco de freno',
  price: 150,
  quantity: 3,
  location: 'VITRINA',
  storage: {
    location: 'BODEGA',
    quantity: 5
  }
});

// 🔴 8. Sin stock en ningún lado
mapProducts.set('P008', {
  reference: 'P008',
  description: 'Guaya acelerador',
  price: 18,
  quantity: 0,
  location: 'ESTANTE C',
  storage: {
    location: 'BODEGA',
    quantity: 0
  }
})
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