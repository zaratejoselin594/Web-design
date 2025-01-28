const cookies = [
  {
    selector: '.imgPasteleria img',
    images: [
      { src: "./resourse/img/ocho.webp" },
      { src: "./resourse/img/diez.webp" },
      { src: "./resourse/img/diecisiete.webp" },
      { src: "./resourse/img/cuatro.webp" },
      { src: "./resourse/img/once.webp" },
      { src: "./resourse/img/trece.webp" },

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
// Cierre del menú al tocar fuera
const menuCheckbox = document.getElementById('menu');
const navLinks = document.querySelectorAll('.hrUlRve a');
const body = document.body;

body.addEventListener('click', (event) => {
  if (!event.target.closest('.hrNavBarRve') && !event.target.closest('.hrUlRve')) {
    menuCheckbox.checked = false;
  }
});

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    menuCheckbox.checked = false;
  });
});

// Función para manejar el clic en los botones "Añadir"
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
  saveTolocalStorage(product);

  // Agrega el elemento al DOM
  addProductToDOM(product);
}

// Función para guardar el producto en localStorage
function saveTolocalStorage(product) {
  let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  cartItems.push(product);
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

// Función para añadir el producto al DOM
function addProductToDOM(product) {
  const contentModal = document.querySelector('.cartHtml');

  // Verifica si el producto ya existe en el DOM por su id
  const existingProduct = contentModal.querySelector(`[data-id="${product.id}"]`);
  if (existingProduct) return; // Si el producto ya está en el DOM, no lo añadimos de nuevo

  const cartItem = document.createElement('div');
  cartItem.classList.add('cartItem');
  cartItem.setAttribute('data-id', product.id); // Añade el id como atributo para identificación
  cartItem.innerHTML = `
    <img src="${product.image}" alt="" class="imgProduct">
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

  contentModal.appendChild(cartItem);

  // Añadir evento para eliminar el producto del carrito
  cartItem.querySelector('.iconTrash').addEventListener('click', () => removeFromCart(product.id, cartItem));
}

// Event Listener para todos los botones de "Añadir"
document.addEventListener('click', handleAddToCart);
