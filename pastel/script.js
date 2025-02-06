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

// Limitar la cantidad de imágenes
document.getElementById('images').addEventListener('change', function () {
  if (this.files.length > 1) {
    this.value = '';
    document.getElementById('imageLimitWarning').style.display = 'flex';
  } else {
    document.getElementById('imageLimitWarning').style.display = 'none';
  }
});

// Canvas
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let painting = false;
let lineWidth = document.getElementById('lineWidth').value;
let lineColor = document.getElementById('lineColor').value;

// Eventos de configuración del canvas
document.getElementById('lineWidth').addEventListener('input', (e) => lineWidth = e.target.value);
document.getElementById('lineColor').addEventListener('input', (e) => lineColor = e.target.value);
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
  const rect = canvas.getBoundingClientRect();
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';
  ctx.strokeStyle = lineColor;
  ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
}
function getCanvasImage() {
  // Crear un nuevo canvas temporal
  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d');

  // Configurar el tamaño igual al canvas original
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;

  // Dibujar un fondo blanco
  tempCtx.fillStyle = '#FFFFFF';
  tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

  // Dibujar el contenido del canvas original encima del fondo blanco
  tempCtx.drawImage(canvas, 0, 0);

  // Convertir a imagen con fondo blanco
  return tempCanvas.toDataURL('image/jpeg', 0.5);
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Funciones de almacenamiento
function saveCartTolocalStorage(cartItems) {
  localStorage.setItem('cart', JSON.stringify(cartItems));
}

function loadCartFromlocalStorage() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

document.addEventListener('DOMContentLoaded', () => {
  const cart = loadCartFromlocalStorage();
  cart.forEach(product => addProductToDOM(product));
});

// Notificación
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
document.addEventListener('DOMContentLoaded', () => {
  const inputCanvas = document.getElementById('inputCanvas');
  const canvasModal = document.querySelector('.canvasModal');

  inputCanvas.addEventListener('change', () => {
    canvasModal.style.display = inputCanvas.checked ? 'flex' : 'none';
  });

  document.getElementById('cakeForm').addEventListener('submit', (e) => {
    e.preventDefault();
    saveFormData();
  });
});
// Generar ID único
function generateUniqueId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

document.getElementById('cakeForm').addEventListener('submit', (e) => {
  e.preventDefault();
  saveFormData();
});

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
        images.push(e.target.result);
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
  saveTolocalStorage(product);
  addProductToDOM(product);
}

function createProduct(flavor, grams, people, decorations, drawing, images, price) {
  return { id: generateUniqueId(), flavor, grams, people, decorations, drawing, images, price };
}

function saveTolocalStorage(orderData) {
  let cartItems = loadCartFromlocalStorage();
  if (!Array.isArray(cartItems)) {
    cartItems = []; // Asegurar que sea un array válido
  }
  cartItems.push(orderData);
  saveCartTolocalStorage(cartItems);
}

function loadCartFromlocalStorage() {
  try {
    const cart = JSON.parse(localStorage.getItem('cart'));
    return Array.isArray(cart) ? cart : [];
  } catch (e) {
    return []; // Evitar errores si localStorage contiene datos corruptos
  }
}

function saveCartTolocalStorage(cartItems) {
  localStorage.setItem('cart', JSON.stringify(cartItems));
}

function addProductToDOM(product) {
  const contentModal = document.querySelector('.cartHtml');
  if (!contentModal || contentModal.querySelector(`[data-id="${product.id}"]`)) return;

  const cartItem = document.createElement('div');
  cartItem.classList.add('cartItem');
  cartItem.setAttribute('data-id', product.id);
  cartItem.innerHTML = `
    <img src="${product.images.length > 0 ? product.images[0] : 'default-image.jpg'}" alt="Producto" class="imgProduct">
    <div class="titleCart">
      <div class="infoCart"><h3>${product.flavor}</h3>
      <p>Para ${product.people} personas - ${product.grams} gramos - ${product.decorations}</p></div>
      <div class="monto"><ion-icon name="trash-outline" class="iconTrash" data-id="${product.id}"></ion-icon>
      <p>$${product.price}</p></div>
    </div>`;
  contentModal.appendChild(cartItem);
  showNotification(product.flavor);
}

