
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
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Función para guardar los datos del formulario en localStorage
function saveFormData() {
  const formData = new FormData(document.getElementById("cakeForm"));
  const flavor = formData.get("flavor");
  const grams = formData.get("grams");
  const people = formData.get("people");
  const decorations = formData.get("decorations");

  const inputCanvas = document.getElementById('inputCanvas');
  let drawing = "";

  if (inputCanvas.checked) {
    drawing = canvas.toDataURL('image/jpeg', 0.2);
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
          saveOrder({ flavor, grams, people, decorations, drawing, images });
        }
      };
      reader.readAsDataURL(image);
    });
  } else {
    saveOrder({ flavor, grams, people, decorations, drawing, images });
  }
}

function saveOrder(orderData) {
  let orders = JSON.parse(localStorage.getItem('orders')) || [];
  orderData.id = generateUniqueId();
  orders.push(orderData);
  localStorage.setItem('orders', JSON.stringify(orders));

  const orderLink = `${window.location.origin}/info.html?orderId=${orderData.id}`;
  alert(`Pedido guardado. Puedes verlo aquí: ${orderLink}`);
}

function generateUniqueId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}
const saveButton = document.getElementById('saveOrderButton');
if (saveButton) {
  saveButton.addEventListener("click", saveFormData);
}

// Función para agregar productos al carrito y mostrarlos en el DOM
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

  cartItem.querySelector('.iconTrash').addEventListener('click', () => removeItem(cartItem, product.id));
}
