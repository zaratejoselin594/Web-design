// Función para cargar productos desde localStorage y mostrarlos en el DOM
function loadCartFromLocalStorage() {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const cartObject = JSON.parse(localStorage.getItem('cart')); // Puede ser un objeto o null

  // Agregar productos del catálogo (cartItems)
  cartItems.forEach(product => addProductToDOM(product));

  // Agregar el producto personalizado (cart), si existe
  if (cartObject && cartObject.id) {
    addProductToDOM(cartObject);
  }
}

// Función para agregar un producto al DOM
function addProductToDOM(product) {
  const contentModal = document.querySelector('.cartHtml');
  if (!contentModal || contentModal.querySelector(`[data-id="${product.id}"]`)) return;

  const cartItem = document.createElement('div');
  cartItem.classList.add('cartItem');
  cartItem.setAttribute('data-id', product.id);

  let productHTML = '';

  // Si el producto tiene 'flavor', es un producto personalizado
  if (product.flavor) {
    productHTML = `
      <img src="${product.images?.length > 0 ? product.images[0] : 'default-image.jpg'}" alt="Producto" class="imgProduct">
      ${product.drawing ? `<img src="${product.drawing}" alt="Dibujo" class="imgProduct">` : ''}
      <div class="titleCart">
        <div class="infoCart">
          <h3>${product.flavor}</h3>
          <p>Para ${product.people} personas - ${product.grams} gramos - Decoraciones: ${product.decorations}</p>
        </div>
        <div class="monto">
          <ion-icon name="trash-outline" class="iconTrash" data-id="${product.id}"></ion-icon>
          <p>$100</p>
        </div>
      </div>
    `;
  }

  // Si el producto tiene 'name', es un producto del catálogo
  if (product.name) {
    productHTML = `
      <img src=".${product.image}" alt="" class="imgProduct">
      <div class="titleCart">
        <div class="infoCart">
          <h3>${product.name}</h3>
          <p>Deliciosa opción personalizada</p>
        </div>
        <div class="monto">
          <ion-icon name="trash-outline" class="iconTrash" data-id="${product.id}"></ion-icon>
          <p>$${product.price}</p>
        </div>
      </div>
    `;
  }

  cartItem.innerHTML = productHTML;
  contentModal.appendChild(cartItem);

  // Agregar funcionalidad al botón de eliminar
  cartItem.querySelector('.iconTrash').addEventListener('click', () => removeItem(cartItem, product.id));
}

// Función para eliminar un producto del carrito
function removeItem(element, id) {
  let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  let cartObject = JSON.parse(localStorage.getItem('cart')) || null;

  // Si el producto eliminado es del catálogo
  cartItems = cartItems.filter(item => item.id !== id);
  localStorage.setItem('cartItems', JSON.stringify(cartItems));

  // Si el producto eliminado es el personalizado
  if (cartObject && cartObject.id === id) {
    localStorage.removeItem('cart');
  }

  element.remove();
}

// Cargar carrito desde localStorage al cargar la página
document.addEventListener('DOMContentLoaded', loadCartFromLocalStorage);
