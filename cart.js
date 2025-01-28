// Funciones para guardar y cargar desde localStorage
function saveCartToLocalStorage(cartItems) {
  localStorage.setItem('cart', JSON.stringify(cartItems));
}

function loadCartFromLocalStorage() {
  const cartData = localStorage.getItem('cart');
  return cartData ? JSON.parse(cartData) : [];
}

document.addEventListener('DOMContentLoaded', () => {
  // Cargar productos desde localStorage
  const cart = loadCartFromLocalStorage();

  // Recorrer los productos y agregarlos al DOM
  cart.forEach(product => addProductToDOM(product));

  // Configurar evento para el formulario
  const cakeForm = document.getElementById('cakeForm');
  if (cakeForm) {
    cakeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      saveFormData();
    });
  }
});
// Función para mostrar una notificación
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
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

// Función para generar un ID único
function generateUniqueId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

// Función para guardar los datos del formulario usando localStorage
function saveFormData() {
  const formData = new FormData(document.getElementById("cakeForm"));
  const flavor = formData.get("flavor");
  const grams = formData.get("grams");
  const people = formData.get("people");
  const decorations = formData.get("decorations");

  const canvas = document.getElementById('canvas');
  const drawing = canvas.toDataURL('image/jpeg', 0.5); // Formato JPEG con calidad al 50%
  console.log(drawing); // Será más corto que PNG

  const images = [];
  const imageFiles = formData.getAll("images");
  if (imageFiles.length > 0) {
    let processedImages = 0;
    imageFiles.forEach(image => {
      const reader = new FileReader();
      reader.onload = function (e) {
        images.push(e.target.result);
        processedImages++;
        if (processedImages === imageFiles.length) {
          const product = { id: generateUniqueId(), flavor, grams, people, decorations, drawing, images };
          saveTolocalStorage(product);
          addProductToDOM(product);
        }
      };
      reader.readAsDataURL(image);
    });
  } else {
    const product = { id: generateUniqueId(), flavor, grams, people, decorations, drawing, images };
    saveTolocalStorage(product);
    addProductToDOM(product);
  }
}
function handleAddToCart(event) {
  const button = event.target.closest('.btnAñadir'); // Asegura que se hizo clic en el botón correcto
  if (!button) return;

  // Recoge la información del producto
  const itemName = button.getAttribute('data-item');
  const itemPrice = parseFloat(button.getAttribute('data-price'));
  const itemImage = button.getAttribute('data-src'); // Obtener la URL de la imagen desde data-src

  // Crea el objeto del producto
  const product = {
    id: Date.now(), // ID único basado en timestamp
    name: itemName,
    price: itemPrice,
    image: itemImage,
  };

  // Guarda el producto en localStorage
  saveTolocalStorages(product);

  // Agrega el elemento al DOM
  addProductToDOM(product);
}

// Función para guardar el pedido en localStorage
function saveTolocalStorage(orderData) {
  let cartItems = loadCartFromLocalStorage();
  cartItems.push(orderData);
  saveCartToLocalStorage(cartItems);
}
function saveTolocalStorages(product) {
  let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  cartItems.push(product);
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

// Función para cargar y mostrar el carrito desde localStorage
function addProductToDOM(product) {
  const contentModal = document.querySelector('.cartHtml');

  // Verificar si el producto ya existe en el DOM
  if (!contentModal || contentModal.querySelector(`[data-id="${product.id}"]`)) return;
  const existingProduct = contentModal.querySelector(`[data-id="${product.id}"]`);
  if (existingProduct) return; // Si el producto ya está en el DOM, no lo añadimos de nuevo

  // Crear el nuevo elemento del carrito
  const cartItem = document.createElement('div');
  cartItem.classList.add('cartItem');
  cartItem.setAttribute('data-id', product.id);
  if (product.flavor) {
    cartItem.innerHTML = `
      <img src="${product.images || 'default-image.jpg'}" alt="" class="imgProduct">
      <img src="${product.drawing || 'default-image.jpg'}" alt="" class="imgProduct">
  
      <div class="titleCart">
        <div class="infoCart">
          <h3>${product.flavor}</h3>
          <p>Para ${product.people} personas - ${product.grams} gramos - Descripcion ${product.decorations}</p>
        </div>
        <div class="monto">
          <ion-icon name="trash-outline" class="iconTrash" data-id="${product.id}"></ion-icon>
          <p>$27000</p>
        </div>
      </div>
    `;
  } else if (product.name){
    cartItem.innerHTML = `
    <img src="${`.`+product.image} " alt="" class="imgProduct">
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

  contentModal.appendChild(cartItem);
  cartItem.querySelector('.iconTrash').addEventListener('click', () => removeItem(cartItem, product.id));
}


// Función para eliminar un artículo del carrito
function removeItem(element, id) {
  let cartItems = loadCartFromLocalStorage();
  cartItems = cartItems.filter(item => item.id !== id);
  saveCartToLocalStorage(cartItems);
  element.remove();
}

// Función para agregar un artículo al carrito
function addItemToCart(item) {
  console.log("Artículo agregado al carrito:", item);
}


// Función para guardar el producto en localStorage



// Event Listener para todos los botones de "Añadir"
document.addEventListener('click', handleAddToCart);
