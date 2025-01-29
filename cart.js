// Guardar y cargar desde localStorage
function saveToLocalStorage(cartItems) {
  localStorage.setItem('cart', JSON.stringify(cartItems));
}

function loadFromLocalStorage() {
  const cartData = localStorage.getItem('cart');
  return cartData ? JSON.parse(cartData) : [];
}

document.addEventListener('DOMContentLoaded', () => {
  const cart = loadFromLocalStorage();
  cart.forEach(product => addProductToDOM(product));

  const cakeForm = document.getElementById('cakeForm');
  if (cakeForm) {
    cakeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      saveFormData();
    });
  }
});

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

function generateUniqueId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

function saveFormData() {
  const formData = new FormData(document.getElementById("cakeForm"));
  const flavor = formData.get("flavor");
  const grams = formData.get("grams");
  const people = formData.get("people");
  const decorations = formData.get("decorations");

  const inputCanvas = document.getElementById('inputCanvas');
  let drawing = "";

  // Guardar el canvas solo si inputCanvas.checked es true
  if (inputCanvas.checked) {
    const canvas = document.getElementById('canvas');
    drawing = canvas.toDataURL('image/jpeg', 0.2); // Formato JPEG con calidad al 50%
  }

  const images = [];
  const imageFiles = formData.getAll("images");

  if (imageFiles.length > 0) {
    const image = imageFiles[0]; // Selecciona solo la primera imagen
    const reader = new FileReader();
    reader.onload = function (e) {
      images.push(e.target.result);
      const product = { id: generateUniqueId(), flavor, grams, people, decorations, drawing, images };
      saveTolocalStorage(product);
      addProductToDOM(product);
    };
    reader.readAsDataURL(image);
  } else {
    const product = { id: generateUniqueId(), flavor, grams, people, decorations, drawing, images };
    saveTolocalStorage(product);
    addProductToDOM(product);
  }

}


function handleAddToCart(event) {
  const button = event.target.closest('.btnAñadir');
  if (!button) return;

  const product = {
    id: generateUniqueId(),
    name: button.getAttribute('data-item'),
    price: parseFloat(button.getAttribute('data-price')),
    image: button.getAttribute('data-src')
  };

  saveProductToCart(product);
}

function saveProductToCart(product) {
  let cartItems = loadFromLocalStorage();
  if (!cartItems.some(item => item.id === product.id)) {
    cartItems.push(product);
    saveToLocalStorage(cartItems);
    addProductToDOM(product);
  }
}

function addProductToDOM(product) {
  const contentModal = document.querySelector('.cartHtml');
  if (!contentModal || contentModal.querySelector(`[data-id="${product.id}"]`)) return;

  const cartItem = document.createElement('div');
  cartItem.classList.add('cartItem');
  cartItem.setAttribute('data-id', product.id);

  if (product.flavor) {
    let productHTML = `
    <img src="${product.images.length > 0 ? product.images[0] : 'default-image.jpg'}" alt="" class="imgProduct">
  `;

    // Solo mostrar el dibujo si existe y no está vacío
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
        <p>$100</p>
      </div>
    </div>
  `;

    cartItem.innerHTML = productHTML;
    contentModal.appendChild(cartItem);
  } else if (product.name) {
    cartItem.innerHTML = `
      <img src="${`.`+product.image}" alt="" class="imgProduct">
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

function removeItem(element, id) {
  let cartItems = loadFromLocalStorage();
  cartItems = cartItems.filter(item => item.id !== id);
  saveToLocalStorage(cartItems);
  element.remove();
}
