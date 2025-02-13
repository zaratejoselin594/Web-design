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

// Notificación
function showNotification(title) {
  const notification = document.createElement('div');
  notification.classList.add('notification');
  notification.textContent = `${title} ha sido agregado al carrito`;
  const notContainer = document.querySelector('.notContainer');
  notContainer.appendChild(notification);
  setTimeout(() => notContainer.style.display = 'flex', 100);
  setTimeout(() => {
    notContainer.style.display = 'none';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

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
  showNotification(product.name)
  // Agrega el elemento al DOM
  addProductToDOM(product);
}

// Función para guardar el producto en localStorage
function saveTolocalStorage(product) {
  let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  cartItems.push(product);
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
}


// Event Listener para todos los botones de "Añadir"
document.addEventListener('click', handleAddToCart);

const pastel = document.querySelector('.pastelContainer');
const mesaDulce = document.querySelector('.mesasDulcesContainer');
const merienda = document.querySelector('.meriendaContainer');
const budines = document.querySelector('.budinesContainer');
const tarta = document.querySelector('.tartasContainer');

function abrirModal(itemMenu, modalClass) {
  if (!(itemMenu instanceof Element)) {
    console.error('itemMenu no es un elemento del DOM:', itemMenu);
    return;
  }

  itemMenu.addEventListener('click', () => {
    let modal = document.querySelector(`.${modalClass}Modal`);

    if (!modal) {
      console.error(`No se encontró el modal: .${modalClass}Modal`);
      return;
    } else {
      modal.style.display = 'flex';
      modal.style.position = 'fixed';
    }

    // Buscar o crear el botón de cierre
    let close = modal.querySelector('.close-icon');
    if (!close) {
      close = document.createElement('ion-icon');
      close.name = 'close-outline';
      close.classList.add('close-icon');
      modal.appendChild(close);
    }

    close.onclick = () => {
      modal.style.display = 'none';
    };
  });
}

function createModalItem(className, src, alt, itemMenu, price, titulo) {
  let modalContainer = document.querySelector(`.${className}Modal`);
  
  // Si el contenedor no existe, créalo
  if (!modalContainer) {
    modalContainer = document.createElement('div');
    modalContainer.className = `${className}Modal itemsTiendaContainer`;
    document.body.appendChild(modalContainer); // Agrega el modal al body
  }

  // Crear el nuevo ítem
  const itemElement = document.createElement('div');
  itemElement.className = 'contentFlavor';
  itemElement.innerHTML = `
    <img class="imgCookieFlavor" src="${src}" alt="${alt}" loading="lazy" />
    <div class="cotainerDescipFlavor">
      <h3>${titulo}</h3>
      <p class="price" data-price="${price}">Precio: $${price}</p>
      <button class="conteainerAjedresBtn btnAñadir" data-item="${titulo}" data-price="${price}" data-src="${src}">
        <div class="ajedresBtn">
          <p class="btn-ajedrez" id="local">Añadir</p>
        </div>
      </button>
    </div>
  `;

  // Agregar el nuevo ítem dentro del modal
  modalContainer.appendChild(itemElement);
  abrirModal(itemMenu, className);
}




// Llamadas a la función con referencias al DOM en lugar de cadenas de texto
createModalItem('pastel', './resourse/img/diez.webp', 'pastel chocolate con frutilla', pastel, 12500, 'Pastel Chocolate con Frutilla');
createModalItem('pastel', './resourse/img/once.webp', 'Pastel de Vainilla y helado', pastel, 12500, 'Pastel de Vainilla y helado');
createModalItem('pastel', './resourse/img/diecinueve.webp', 'pastel chocolate con frutilla', pastel, 12500, 'Pastel Chocolate con Frutilla');
createModalItem('pastel', './resourse/img/IMG_0289.jpeg', 'pastel multifruta', pastel, 12500, 'Pastel Multifruta');
createModalItem('pastel', './resourse/img/IMG_0287.jpeg', 'pastel Vainilla con mani', pastel, 12500, 'Pastel Vainilla con mani');
createModalItem('pastel', './resourse/img/IMG_0291.jpeg', 'pastel contemporaneo', pastel, 12500, 'Pastel conteporaneo');
createModalItem('pastel', './resourse/img/IMG_0292.jpeg', 'pastel multifruta divertido tres pisos', pastel, 31000, 'Pastel Multifruta Tres pisos');


createModalItem('mesaDulce', './resourse/img/catorce.webp', 'pastel chocolate con frutilla', mesaDulce, 12500, 'Pastel Chocolate con Frutilla');
createModalItem('mesaDulce', './resourse/img/cuatro.webp', 'pastel chocolate con frutilla', mesaDulce, 12500, 'Pastel Chocolate con Frutilla');
createModalItem('mesaDulce', './resourse/img/dieciocho.webp', 'pastel chocolate con frutilla', mesaDulce, 12500, 'Pastel Chocolate con Frutilla');
createModalItem('mesaDulce', './resourse/img/dieciseis.webp', 'pastel Vainilla helado', mesaDulce, 12000, 'Pastel de Vainilla helado');
createModalItem('mesaDulce', './resourse/img/diecisiete.webp', 'pastel Vainilla helado', mesaDulce, 12000, 'Pastel de Vainilla helado');
createModalItem('mesaDulce', './resourse/img/dos.webp', 'pastel Vainilla helado', mesaDulce, 12000, 'Pastel de Vainilla helado');
createModalItem('mesaDulce', './resourse/img/seis.webp', 'pastel Vainilla helado', mesaDulce, 12000, 'Pastel de Vainilla helado');
createModalItem('mesaDulce', './resourse/img/quince.webp', 'pastel Vainilla helado', mesaDulce, 12000, 'Pastel de Vainilla helado');
createModalItem('mesaDulce', './resourse/img/trece.webp', 'pastel Vainilla helado', mesaDulce, 12000, 'Pastel de Vainilla helado');
createModalItem('mesaDulce', './resourse/img/tres.webp', 'pastel Vainilla helado', mesaDulce, 12000, 'Pastel de Vainilla helado');
createModalItem('mesaDulce', './resourse/img/uno.webp', 'pastel Vainilla helado', mesaDulce, 12000, 'Pastel de Vainilla helado');


createModalItem('merienda', './resourse/img/IMG_0285.jpeg', 'pastel Vainilla helado', merienda, 12000, 'Pastel de Vainilla helado');
createModalItem('merienda', './resourse/img/IMG_0286.jpeg', 'pastel chocolate con frutilla', merienda, 12500, 'Pastel Chocolate con Frutilla');
createModalItem('merienda', './resourse/img/once.webp', 'pastel chocolate con frutilla', merienda, 12500, 'Pastel Chocolate con Frutilla');
createModalItem('merienda', './resourse/img/siete.webp', 'pastel chocolate con frutilla', merienda, 12500, 'Pastel Chocolate con Frutilla');

createModalItem('budines', './resourse/img/budin.jpeg', 'pastel Vainilla helado', budines, 12000, 'Pastel de Vainilla helado');
createModalItem('budines', './resourse/img/diez.webp', 'pastel chocolate con frutilla', budines, 12500, 'Pastel Chocolate con Frutilla');
createModalItem('budines', './resourse/img/once.webp', 'pastel chocolate con frutilla', budines, 12500, 'Pastel Chocolate con Frutilla');
createModalItem('budines', './resourse/img/siete.webp', 'pastel chocolate con frutilla', budines, 12500, 'Pastel Chocolate con Frutilla');

createModalItem('tarta', './resourse/img/veinte.jpeg', 'pastel Vainilla helado', tarta, 12000, 'Pastel de Vainilla helado');
createModalItem('tarta', './resourse/img/veintiuno.jpeg', 'pastel chocolate con frutilla', tarta, 12500, 'Pastel Chocolate con Frutilla');
createModalItem('tarta', './resourse/img/veintidos.jpeg', 'pastel chocolate con frutilla', tarta, 12500, 'Pastel Chocolate con Frutilla');
createModalItem('tarta', './resourse/img/veintitres.jpeg', 'pastel chocolate con frutilla', tarta, 12500, 'Pastel Chocolate con Frutilla');
createModalItem('tarta', './resourse/img/veinticuatro.jpeg', 'pastel chocolate con frutilla', tarta, 12500, 'Pastel Chocolate con Frutilla');


//caritoo --------------------------------------------------------------------------------------------------------------------------
document.querySelector('.hrACart').addEventListener('click', () => {
  document.querySelector('.modal').style.visibility = 'visible'
})
document.querySelector('.closeModal').addEventListener('click', () => {
  document.querySelector('.modal').style.visibility = 'hidden';
})


// Función para cargar productos desde localStorage y mostrarlos en el DOM
function loadCartFromlocalStorage() {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const cartObjects = JSON.parse(localStorage.getItem('cart')) || [];
  cartItems.forEach(product => {
    addProductToDOM(product);
  });
  cartObjects.forEach(product => {
    addProductToDOM(product);
  });
  // Recuperar y validar cartItems (productos del catálogo)
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
  }

  if (product.name) {
    productHTML = `
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


document.addEventListener('DOMContentLoaded', loadCartFromlocalStorage);
