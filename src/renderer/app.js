const inputBusqueda = document.getElementById('busqueda');
const tablaResultados = document.getElementById('resultados');

async function cargarDatos(termino = '') {
    const productos = await window.api.buscarProductos(termino);
    
    tablaResultados.innerHTML = productos.map(p => `
        <tr class="hover:bg-blue-50 transition">
            <td class="px-6 py-4 font-medium text-gray-900">${p.strReferencia}</td>
            <td class="px-6 py-4 text-gray-600">${p.strDescripcion}</td>
            <td class="px-6 py-4 font-bold text-blue-600">${p.intCantidad}</td>
        </tr>
    `).join('');
}

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