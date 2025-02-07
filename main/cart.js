function showNotification(title) {
  const notification = document.createElement('div');
  notification.classList.add('notification');
  notification.textContent = `${title} ha sido agregado al carrito`;
  document.body.appendChild(notification);
  setTimeout(() => notification.style.opacity = 1, 100);
  setTimeout(() => {
    notification.style.opacity = 0;
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Función para cargar productos desde localStorage y mostrarlos en el DOM
function loadCartFromlocalStorage() {
  // Recuperar los datos de `cartItems` y `cart`
  let cartItems = localStorage.getItem('cartItems');
  let cartObjects = localStorage.getItem('cart');

  // Si no existen, inicializarlos como arrays vacíos
  cartItems = cartItems ? JSON.parse(cartItems) : [];
  cartObjects = cartObjects ? JSON.parse(cartObjects) : [];

  // Asegurar que sean arrays antes de continuar
  if (!Array.isArray(cartItems)) cartItems = [];
  if (!Array.isArray(cartObjects)) cartObjects = [];

  // Unir ambos arrays y eliminamos posibles duplicados por ID
  let allItems = [...cartItems, ...cartObjects];
  let uniqueItems = [];

  let seenIds = new Set();
  allItems.forEach(item => {
    if (!seenIds.has(item.id)) {
      seenIds.add(item.id);
      uniqueItems.push(item);
    }
  });

  // Limpiar el carrito antes de recargar los elementos
  const contentModal = document.querySelector('.cartHtml');
  if (contentModal) contentModal.innerHTML = '';

  // Agregar productos al DOM
  uniqueItems.forEach(product => addProductToDOM(product));
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
        <div class="infoCart"><h3>${product.flavor}</h3>
        <p>Para ${product.people} personas - ${product.grams} gramos - ${product.decorations}</p></div>
        <div class="monto"><ion-icon name="trash-outline" class="iconTrash" data-id="${product.id}"></ion-icon>
        <p>$${product.price}</p></div>
      </div>
    `;
    showNotification(product.flavor);
  }

  // Detectar si el HTML actual está en una subcarpeta
  const isIndexPage = window.location.pathname.endsWith("index.html") || window.location.pathname === "/";

  // Ajustar la ruta de la imagen dependiendo de la ubicación
  function getCorrectImagePath(imagePath) {
    if (!imagePath) return 'default-image.jpg';
    return isIndexPage ? `${imagePath}` : `.${imagePath}`;
  }

  if (product.name) {
    let productImage = getCorrectImagePath(product.image);

    productHTML = `
      <img src="${productImage}" alt="" class="imgProduct">
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
    showNotification(product.name);
  }

  cartItem.innerHTML = productHTML;
  contentModal.appendChild(cartItem);

  // Agregar funcionalidad al botón de eliminar
  cartItem.querySelector('.iconTrash').addEventListener('click', () => removeItem(cartItem, product.id));
}

// Función para eliminar un producto del carrito
function removeItem(element, id) {
  let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  let cartObjects = JSON.parse(localStorage.getItem('cart')) || [];

  // Filtrar los productos eliminados
  cartItems = cartItems.filter(item => item.id !== id);
  cartObjects = cartObjects.filter(item => item.id !== id);

  // Guardar nuevamente en `localStorage`
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
  localStorage.setItem('cart', JSON.stringify(cartObjects));

  // Remover el elemento del DOM
  element.remove();
}

document.addEventListener('DOMContentLoaded', loadCartFromlocalStorage);
