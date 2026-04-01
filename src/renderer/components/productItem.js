import { copyToClipboardButton } from './copyToClipboard.js';
export function productItem(product) {
  const isLocal = (product.quantity > 0 || !(product.storage && product.storage.quantity > 0)) && product.location;
  return`
        <tr class="hover:bg-gray-50 transition-colors">
            <td class="px-4 py-3">
              <p class="text-xs text-gray-400 uppercase font-semibold">Ref: ${product.reference} ${product.code ? `/ ${product.code}` : ''}</p>
              <p class="font-bold text-gray-800">${product.description}</p>
            </td>
            <td class="px-4 py-3 text-center text-green-600 font-bold">$${product.price}</td>
            <td class="px-4 py-3 text-center font-medium">${isLocal? product.quantity : (product.storage ? product.storage.quantity : 'N/A')}</td>
           <td class="px-4 py-3 text-center font-medium">
              ${isLocal ? product.location : (product.storage ? `<p class="flex flex-col items-center">
                ${product.storage.location}
                <span class="text-xs font-semibold text-gray-500">BODEGA</span>
              </p >`: 'N/A')}
           </td>
            <td class="px-4 py-3 text-center">
              ${copyToClipboardButton(product.reference)}
            </td>
          </tr>

          <tr class="bg-gray-50/50">
            <td colspan="5" class="px-4 py-2">
              <div class="flex justify-between text-xs text-gray-500 italic">
                <p>
                ${product.quantity > 0 && product.storage?.quantity < 1 ? 'Bodega: Agotado ' + product.storage.location : ''}
                ${product.storage?.quantity > 0 && (product.quantity < 1 && product.quantity !== null) ? 'Local: Agotado ' + product.location : ''}
                ${product.quantity > 0 && product.storage?.quantity > 0 ? 'Bodega: ' + product.storage.quantity + ' ' + product.storage.location : ''}
                ${product.quantity === 0 && (!product.storage || product.storage.quantity === 0) ? 'Sin stock' : product.storage?.quantity == 0 && product.quantity === null? 'Sin stock':''}
                </p>
                <p><span class="font-semibold text-gray-700">Total:</span> ${product.quantity + (product.storage ? product.storage.quantity : 0)} unds</p>
              </div>
            </td>
          </tr>
    `
}
