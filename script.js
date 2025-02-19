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
  window.onclick = function (event) {
    if (event.target == menuCheckbox.checked) {
      menuCheckbox.checked = false;
    }
  }
});


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
  showNotification()
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
      body.style.overflow='hidden'
    }

    // Buscar o crear el botón de cierre
    let close = modal.querySelector('.close-icon');
    if (!close) {
      close = document.createElement('ion-icon');
      close.name = 'arrow-back-outline';
      close.classList.add('close-icon');
      modal.appendChild(close);
    }
    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
        body.style.overflow = 'auto'
      }
    }
    close.onclick = () => {
      modal.style.display = 'none';
      body.style.overflow = 'auto'
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
createModalItem('pastel', './resourse/img/diez.webp', 'Pastel Chocolate & Frutilla', pastel, 12500, 'Pastel Chocolate con Frutilla');
createModalItem('pastel', './resourse/img/once.webp', 'Pastel Vainilla & Helado', pastel, 14500, 'Pastel de Vainilla y Helado');
createModalItem('pastel', './resourse/img/diecinueve.webp', 'Pastel Chocolate & Frutilla', pastel, 13500, 'Pastel Chocolate con Frutilla');
createModalItem('pastel', './resourse/img/IMG_0289.jpeg', 'Pastel Multifruta', pastel, 15500, 'Pastel Multifruta');
createModalItem('pastel', './resourse/img/IMG_0287.jpeg', 'Pastel Vainilla & Mani', pastel, 12000, 'Pastel Vainilla con Mani');
createModalItem('pastel', './resourse/img/IMG_0291.jpeg', 'Pastel Contemporáneo', pastel, 17000, 'Pastel Contemporáneo');
createModalItem('pastel', './resourse/img/IMG_0292.jpeg', 'Pastel Multifruta Tres Pisos', pastel, 31000, 'Pastel Multifruta Tres Pisos');

createModalItem('mesaDulce', './resourse/img/catorce.webp', 'Mesa Dulce 1', mesaDulce, 65000, 'Mesa Dulce 1');
createModalItem('mesaDulce', './resourse/img/cuatro.webp', 'Mesa Dulce 2', mesaDulce, 72000, 'Mesa Dulce 2');
createModalItem('mesaDulce', './resourse/img/dieciocho.webp', 'Mesa Dulce 3', mesaDulce, 68000, 'Mesa Dulce 3');
createModalItem('mesaDulce', './resourse/img/dieciseis.webp', 'Mesa Dulce 4', mesaDulce, 59000, 'Mesa Dulce 4');
createModalItem('mesaDulce', './resourse/img/diecisiete.webp', 'Mesa Dulce 5', mesaDulce, 62000, 'Mesa Dulce 5');
createModalItem('mesaDulce', './resourse/img/dos.webp', 'Mesa Dulce 6', mesaDulce, 54000, 'Mesa Dulce 6');
createModalItem('mesaDulce', './resourse/img/seis.webp', 'Mesa Dulce 7', mesaDulce, 59000, 'Mesa Dulce 7');
createModalItem('mesaDulce', './resourse/img/quince.webp', 'Mesa Dulce 8', mesaDulce, 66000, 'Mesa Dulce 8');
createModalItem('mesaDulce', './resourse/img/trece.webp', 'Mesa Dulce 9', mesaDulce, 71000, 'Mesa Dulce 9');
createModalItem('mesaDulce', './resourse/img/tres.webp', 'Mesa Dulce 10', mesaDulce, 74000, 'Mesa Dulce 10');
createModalItem('mesaDulce', './resourse/img/uno.webp', 'Mesa Dulce 11', mesaDulce, 76000, 'Mesa Dulce 11');

createModalItem('merienda', './resourse/img/IMG_0285.jpeg', 'Galletas surtidas 1', merienda, 5600, 'Galletas surtidas 1');
createModalItem('merienda', './resourse/img/IMG_0286.jpeg', 'Galletas surtidas 2', merienda, 6200, 'Galletas surtidas 2');
createModalItem('merienda', './resourse/img/veinticinco.jpeg', 'Alfajor de chocolate', merienda, 6900, 'Alfajor de chocolate');
createModalItem('merienda', './resourse/img/veintiseis.jpeg', 'Alfajor de vainilla', merienda, 5400, 'Alfajor de Vainilla');
createModalItem('merienda', './resourse/img/veintisiete.jpeg', 'Alfajor de Frutilla', merienda, 6000, 'Alfajor de Frutilla');
createModalItem('merienda', './resourse/img/veintiocho.jpeg', 'Alfajor de frutilla y vainilla', merienda, 6700, 'Alfajor de frutilla y vainilla');
createModalItem('merienda', './resourse/img/veintinueve.jpeg', 'Muffin 1', merienda, 7100, 'Muffin 1');
createModalItem('merienda', './resourse/img/treinta.jpeg', 'Factura con Dulce de leche', merienda, 6600, 'Factura con Dulce de leche');
createModalItem('merienda', './resourse/img/treintayuno.jpeg', 'Masitas surtidas 1', merienda, 7200, 'Masitas surtidas 1');
createModalItem('merienda', './resourse/img/treintaydos.jpeg', 'Masitas surtidas 2', merienda, 7500, 'Masitas surtidas 2');
createModalItem('merienda', './resourse/img/treintaicuatro.jpeg', 'Galletas surtidas 3', merienda, 7100, 'Galletas surtidas 3');
createModalItem('merienda', './resourse/img/treintaicinco.jpeg', 'Alfajor relleno frutilla', merienda, 6800, 'Alfajor relleno frutilla');
createModalItem('merienda', './resourse/img/treintaiseis.jpeg', 'Muffin 2', merienda, 7500, 'Muffin 2');
createModalItem('merienda', './resourse/img/treintaisiete.jpeg', 'Croissant', merienda, 6300, 'Croissant');
createModalItem('merienda', './resourse/img/treintaiocho.jpeg', 'Masitas surtidas 3', merienda, 7000, 'Masitas surtidas 3');

createModalItem('tarta', './resourse/img/veinte.jpeg', 'Tarta Vainilla', tarta, 6500, 'Tarta de Vainilla');
createModalItem('tarta', './resourse/img/veintiuno.jpeg', 'Tarta de LemonPie', tarta, 7000, 'Tarta de LemonPie');
createModalItem('tarta', './resourse/img/veintidos.jpeg', 'Tarta Chocolate', tarta, 7500, 'Tarta Chocolate');
createModalItem('tarta', './resourse/img/veintitres.jpeg', 'Tarta Frutilla', tarta, 7800, 'Tarta Frutilla');
createModalItem('tarta', './resourse/img/veinticuatro.jpeg', 'Tarta Chocolate con fruta', tarta, 7300, 'Tarta Chocolate con Fruta');



//caritoo --------------------------------------------------------------------------------------------------------------------------
const modal = document.querySelector('.modal');
// Cuando se hace clic en el elemento con clase .hrACart, se muestra el modal
document.querySelector('.hrACart').addEventListener('click', () => {
  modal.style.visibility = 'visible';
});

// Cuando se hace clic en el botón de cerrar (con clase .closeModal), se oculta el modal
document.querySelector('.closeModal').addEventListener('click', () => {
  modal.style.visibility = 'hidden';
});
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
