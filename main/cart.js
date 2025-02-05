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
function loadCartFromLocalStorage() {
  // Recuperar y validar cartItems (productos del catálogo)
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

  // Recuperar y validar cart (productos personalizados)
  let cartObjects = JSON.parse(localStorage.getItem('cart')) || [];

  // Asegurar que sean arrays
  if (!Array.isArray(cartItems)) cartItems = [];
  if (!Array.isArray(cartObjects)) cartObjects = [];

  // Agregar productos del catálogo al DOM
  cartItems.forEach(product => addProductToDOM(product));

  // Agregar productos personalizados al DOM
  cartObjects.forEach(product => addProductToDOM(product));
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
    showNotification(product.flavor)
  } 

  // Detectar si el HTML actual está en una subcarpeta
  const isIndexPage = window.location.pathname.endsWith("index.html") || window.location.pathname === "/";

  // Ajustar la ruta de la imagen dependiendo de la ubicación
  function getCorrectImagePath(imagePath) {
    if (!imagePath) return 'default-image.jpg'; // Si no hay imagen, usar la predeterminada
    if (isIndexPage) {
      return `${imagePath}`; // En index.html la ruta es "./img/imagen.jpg"
    } else {
      return `.${imagePath}`; // En subcarpetas la ruta es "../img/imagen.jpg"
    }
  }
  // Si el producto tiene 'name', es un producto del catálogo
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
    showNotification(product.name)
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

  // Si el producto eliminado es del catálogo
  cartItems = cartItems.filter(item => item.id !== id);
  localStorage.setItem('cartItems', JSON.stringify(cartItems));

  // Si el producto eliminado es un producto personalizado
  cartObjects = cartObjects.filter(item => item.id !== id);
  localStorage.setItem('cart', JSON.stringify(cartObjects));

  element.remove();
}

// Cargar carrito desde localStorage al cargar la página
document.addEventListener('DOMContentLoaded', loadCartFromLocalStorage);
