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
    imgElement.draggable = false; // Desactiva arrastrar la imagen
    setInterval(() => {
      currentIndex = (currentIndex + 1) % item.images.length;
      imgElement.src = item.images[currentIndex].src;
    }, 3000);
  }
});



// Abrir y cerrar el modal
function openModal() {
  const modal = document.getElementById('customModal');
  modal.style.display = 'flex';
}

function closeModal() {
  const modal = document.getElementById('customModal');
  modal.style.display = 'none';
}

// Limitar la cantidad de imágenes que se pueden subir
document.getElementById('images').addEventListener('change', function () {
  if (this.files.length > 1) {
    this.value = '';
    document.getElementById('imageLimitWarning').style.display = 'flex';
  } else {
    document.getElementById('imageLimitWarning').style.display = 'none';
  }
});

// Variables para el canvas
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let painting = false;
let lineWidth = document.getElementById('lineWidth').value;
let lineColor = document.getElementById('lineColor').value;

// Actualizar el grosor y color del dibujo
document.getElementById('lineWidth').addEventListener('input', (e) => {
  lineWidth = e.target.value;
});

document.getElementById('lineColor').addEventListener('input', (e) => {
  lineColor = e.target.value;
});

// Eventos del canvas
canvas.addEventListener('mousedown', startPosition);
canvas.addEventListener('mouseup', endPosition);
canvas.addEventListener('mousemove', draw);

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
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';
  ctx.strokeStyle = lineColor;

  const rect = canvas.getBoundingClientRect();
  ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  ctx.fillStyle = '#ffffff';
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

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


// Función para guardar el pedido en localStorage
function saveTolocalStorage(orderData) {
  let cartItems = loadCartFromLocalStorage();
  cartItems.push(orderData);
  saveCartToLocalStorage(cartItems);
}

// Función para cargar y mostrar el carrito desde localStorage
function addProductToDOM(product) {
  const contentModal = document.querySelector('.cartHtml');

  // Verificar si el producto ya existe en el DOM
  if (!contentModal || contentModal.querySelector(`[data-id="${product.id}"]`)) return;

  // Crear el nuevo elemento del carrito
  const cartItem = document.createElement('div');
  cartItem.classList.add('cartItem');
  cartItem.setAttribute('data-id', product.id);
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

  contentModal.appendChild(cartItem);
  cartItem.querySelector('.iconTrash').addEventListener('click', () => removeItem(cartItem, product.id));
}

// Función para agregar un artículo al carrito
function addItemToCart(item) {
  console.log("Artículo agregado al carrito:", item);
}
const inputCanvas = document.getElementById('inputCanvas');
const canvasModal = document.querySelector('.canvasModal');
inputCanvas.addEventListener('change', () => {
  if (inputCanvas.checked) {
    canvasModal.style.display = 'flex';
  } else {
    canvasModal.style.display = 'none';
  }
});
