// Función para guardar productos en localStorage
function saveToLocalStorage(cartItems) {
  localStorage.setItem('cart', JSON.stringify(cartItems));
}

// Función para cargar los productos desde localStorage
function loadFromLocalStorage() {
  const cartData = localStorage.getItem('cart');
  return cartData ? JSON.parse(cartData) : []; // Aseguramos que siempre sea un array
}

// Función para cargar los productos desde localStorage al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  const cart = loadFromLocalStorage();
  cart.forEach(product => addProductToDOM(product));
});

// Función para agregar un producto al DOM
function addProductToDOM(product) {
  const contentModal = document.querySelector('.cartHtml');
  if (!contentModal || contentModal.querySelector(`[data-id="${product.id}"]`)) return;

  const cartItem = document.createElement('div');
  cartItem.classList.add('cartItem');
  cartItem.setAttribute('data-id', product.id);

  // Manejo de productos personalizados (con "flavor")
  if (product.flavor) {
    let productHTML = `
      <img src="${product.images.length > 0 ? product.images[0] : 'default-image.jpg'}" alt="" class="imgProduct">
    `;
    if (product.drawing) {
      productHTML += `
        <img src="${product.drawing}" alt="" class="imgProduct">
      `;
    }

    productHTML += `
      <div class="titleCart">
        <div class="infoCart">
          <h3>${product.flavor}</h3>
          <p>Para ${product.people} personas - ${product.grams} gramos - Descripción: ${product.decorations}</p>
        </div>
        <div class="monto">
          <ion-icon name="trash-outline" class="iconTrash" data-id="${product.id}"></ion-icon>
          <p>$${product.price || 100}</p>
        </div>
      </div>
    `;

    cartItem.innerHTML = productHTML;
    showNotification(product.flavor)
  }
  // Manejo de productos del catálogo (con "name")
  else if (product.name) {
    cartItem.innerHTML = `
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
    showNotification(product.name)
  }

  contentModal.appendChild(cartItem);
  cartItem.querySelector('.iconTrash').addEventListener('click', () => removeItem(cartItem, product.id));
}

// Función para eliminar un producto del carrito
function removeItem(element, id) {
  let cartItems = loadFromLocalStorage();
  cartItems = cartItems.filter(item => item.id !== id);
  saveToLocalStorage(cartItems);
  element.remove();
}

// Función para agregar un producto al carrito
function saveProductToCart(product) {
  let cartItems = loadFromLocalStorage();

  // Si el producto es del tipo personalizado (con "flavor")
  if (product.flavor) {
    cartItems.push(product);
  }
  // Si el producto es del tipo de catálogo (con "name")
  else if (product.name) {
    cartItems.push(product);
  }

  saveToLocalStorage(cartItems);
  addProductToDOM(product);
}

function loadCartFromLocalStorage() {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  cartItems.forEach(product => {
    addProductToDOM(product);
  });
}
// Función para mostrar notificaciones (opcional)
function showNotification(title) {
  const notification = document.createElement('div');
  notification.classList.add('notification');
  notification.textContent = `${title} ha sido agregado al carrito`;
  document.body.appendChild(notification);
  setTimeout(() => {
    notification.style.opacity = 1;
  }, 100);
  setTimeout(() => {
    notification.style.opacity = 0;
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}
