const cookies = [
  {
    selector: '.imgPasteleria img',
    images: [
      { src: "../resourse/img/cuatro.webp" },
      { src: "../resourse/img/diecisiete.webp" },
      { src: "../resourse/img/diez.webp" },
      { src: "../resourse/img/ocho.webp" },
      { src: "../resourse/img/once.webp" },
      { src: "../resourse/img/trece.webp" },
      { src: "../resourse/img/tres.webp" },
    ]
  }
];

// Cambio automático de imágenes sin flechas
cookies.forEach(item => {
  const imgElement = document.querySelector(item.selector);
  let currentIndex = 0;
  if (imgElement) {
    imgElement.src = item.images[currentIndex].src;
    imgElement.draggable = false;
    setInterval(() => {
      currentIndex = (currentIndex + 1) % item.images.length;
      imgElement.src = item.images[currentIndex].src;
    }, 3000);
  }
});

// Modal
function openModal() {
  document.getElementById('customModal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('customModal').style.display = 'none';
}
document.querySelector('.hrACart').addEventListener('click', () => {
  document.querySelector('.modal').style.visibility = 'visible'
})
document.querySelector('.closeModal').addEventListener('click', () => {
  document.querySelector('.modal').style.visibility = 'hidden';
})



// Canvas

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let painting = false;
let lineWidth = document.getElementById('lineWidth').value;
let lineColor = document.getElementById('lineColor').value;

// Eventos de configuración del canvas
document.getElementById('lineWidth').addEventListener('input', (e) => lineWidth = e.target.value);
document.getElementById('lineColor').addEventListener('input', (e) => lineColor = e.target.value);

// Eventos de ratón
canvas.addEventListener('mousedown', startPosition);
canvas.addEventListener('mouseup', endPosition);
canvas.addEventListener('mousemove', draw);

// Eventos táctiles
canvas.addEventListener('touchstart', (e) => {
  e.preventDefault(); // Previene el desplazamiento mientras se dibuja
  startPosition(e.touches[0]);
});
canvas.addEventListener('touchend', endPosition);
canvas.addEventListener('touchmove', (e) => {
  e.preventDefault();
  draw(e.touches[0]);
});

function startPosition(e) {
  painting = true;
  draw(e);
}

function endPosition() {
  painting = false;
  ctx.beginPath();
}

function draw(e) {
  if (!painting) return;
  const rect = canvas.getBoundingClientRect();
  let x = e.clientX - rect.left;
  let y = e.clientY - rect.top;

  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';
  ctx.strokeStyle = lineColor;

  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);
}

function getCanvasImage() {
  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d');
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;

  // Fondo blanco
  tempCtx.fillStyle = '#FFFFFF';
  tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

  // Copiar el dibujo del canvas
  tempCtx.drawImage(canvas, 0, 0);

  return tempCanvas.toDataURL('image/jpeg', 0.5);
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Función para guardar el pedido en localStorage
function saveToLocalStorage(orderData) {
  let cartItems = loadCartFromLocalStorage();
  cartItems.push(orderData);
  saveCartToLocalStorage(cartItems);
}

// Función para cargar el carrito desde localStorage
function loadCartFromLocalStorage() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

// Notificación
function showNotification() {
  const notification = document.createElement('a');
  notification.innerHTML = `
    <div class="button__icon-wrapper">
      <ion-icon class="button__icon-cart" name="cart-outline"></ion-icon>
    </div>
  `;
  notification.classList.add('btn-3');
  const notContainer = document.querySelector('.notContainer');
  notContainer.appendChild(notification);
  setTimeout(() => notContainer.style.display = 'flex', 100);
  setTimeout(() => {
    notContainer.style.display = 'none';
    setTimeout(() => notification.remove(), 100);
  }, 1000);
}

// Evento DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  const inputCanvas = document.getElementById('inputCanvas');
  const canvasModal = document.querySelector('.canvasModal');

  inputCanvas.addEventListener('change', () => {
    canvasModal.style.display = inputCanvas.checked ? 'flex' : 'none';
  });

  const cart = loadCartFromLocalStorage();
  cart.forEach(product => addProductToDOM(product));
});

// Evento de envío del formulario
document.getElementById('cakeForm').addEventListener('submit', (e) => {
  e.preventDefault();
  saveFormData();
  cerrarModal()
});

// Cerrar Modal formulario
function cerrarModal() {
  setTimeout(() => document.getElementById('customModal').style.display = 'none', 100);
}

// Generar ID único
function generateUniqueId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

// Guardar formulario en localStorage
function saveFormData() {
  const formData = new FormData(document.getElementById("cakeForm"));
  const flavor = formData.get("flavor");
  const grams = parseInt(formData.get("grams"), 10);
  const people = formData.get("people");
  const decorations = formData.get("decorations");
  const price = calculatePrice(grams);
  let drawing = "";

  if (document.getElementById('inputCanvas').checked) {
    drawing = getCanvasImage();
  }

  const images = [];
  const imageFiles = formData.getAll("images");
  let processedImages = 0;

  if (imageFiles.length > 0) {
    imageFiles.forEach(image => {
      const reader = new FileReader();
      reader.onload = function (e) {
        const imageData = e.target.result;
        images.push(imageData);
        processedImages++;

        if (processedImages === imageFiles.length) {
          saveProduct(flavor, grams, people, decorations, drawing, images, price);
        }
      };
      reader.readAsDataURL(image);
    });
  } else {
    saveProduct(flavor, grams, people, decorations, drawing, images, price);
  }
}

function calculatePrice(grams) {
  const pricePer1000Grams = 13500;
  return ((grams / 1000) * pricePer1000Grams).toFixed(2);
}

function saveProduct(flavor, grams, people, decorations, drawing, images, price) {
  const product = createProduct(flavor, grams, people, decorations, drawing, images, price);
  saveToLocalStorage(product);
  addProductToDOM(product);
}

function createProduct(flavor, grams, people, decorations, drawing, images, price) {
  showNotification();
  return { id: generateUniqueId(), flavor, grams, people, decorations, drawing, images, price };
}

// Función para guardar los items del carrito en localStorage
function saveCartToLocalStorage(cartItems) {
  localStorage.setItem('cart', JSON.stringify(cartItems));
}

// Función para añadir un producto al DOM y mostrarlo en la interfaz
function addProductToDOM(product) {
  const contentModal = document.querySelector('.cartHtml');
  if (!contentModal || contentModal.querySelector(`[data-id="${product.id}"]`)) return; // Evitar duplicados

  const cartItem = document.createElement('div');
  cartItem.classList.add('cartItem');
  cartItem.setAttribute('data-id', product.id);

  let productHTML = `
    <div class="infoCart">
      <h3>${product.flavor}</h3>
      <p>Para ${product.people} personas - ${product.grams} gramos - ${product.decorations}</p>
    </div>
    <div class="monto">
      <ion-icon name="trash-outline" class="iconTrash" data-id="${product.id}"></ion-icon>
      <p>$${product.price}</p>
    </div>
  `;

  if (product.images.length > 0) {
    productHTML = `<img src="${product.images[0]}" alt="Producto" class="imgProduct">` + productHTML;
  }

  if (product.drawing) {
    productHTML = `<img src="${product.drawing}" alt="Dibujo" class="imgProduct">` + productHTML;
  }

  cartItem.innerHTML = productHTML;
  contentModal.appendChild(cartItem);

  

  // Agregar evento para eliminar producto
  cartItem.querySelector('.iconTrash').addEventListener('click', () => removeProductFromCart(product.id));
}

// Función para eliminar un producto del carrito
function removeProductFromCart(productId) {
  let cartItems = loadCartFromLocalStorage();
  cartItems = cartItems.filter(product => product.id !== productId);
  saveCartToLocalStorage(cartItems);

  // Remover del DOM
  const productElement = document.querySelector(`.cartItem[data-id="${productId}"]`);
  if (productElement) {
    productElement.remove();
  }
}
