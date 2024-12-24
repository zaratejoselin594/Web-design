//Slider

const cookies = [
  {
    selector: '.cookieOne',
    images: [
      "./resourse/webp/redVelvetCookie.webp",
      "./resourse/webp/cookieChocolateCacao.webp",
      "./resourse/webp/cookieStarwberry.webp",
      "./resourse/webp/chocolateChipsAndMany.webp",
      "./resourse/webp/cookieChocolate.webp",
      "./resourse/webp/cookieVainilla.webp"
    ]
  },
  {
    selector: '.cookieTwo',
    images: [
      "./resourse/webp/redVelvetCookie.webp",
      "./resourse/webp/cookieChocolateCacao.webp",
      "./resourse/webp/cookieStarwberry.webp",
      "./resourse/webp/chocolateChipsAndMany.webp",
      "./resourse/webp/cookieChocolate.webp",
      "./resourse/webp/cookieVainilla.webp"
    ]
  },
  {
    selector: '.cookieThree',
    images: [
      "./resourse/webp/redVelvetCookie.webp",
      "./resourse/webp/cookieChocolateCacao.webp",
      "./resourse/webp/cookieStarwberry.webp",
      "./resourse/webp/chocolateChipsAndMany.webp",
      "./resourse/webp/cookieChocolate.webp",
      "./resourse/webp/cookieVainilla.webp"
    ]
  }
];

function changeImage(sliderIndex, direction) {
  const cookie = cookies[sliderIndex];
  const images = document.querySelectorAll(`${cookie.selector} .imgCookie`);

  if (!images.length) return;

  let currentIndex = parseInt(images[0].getAttribute("data-index") || "0");

  if (direction === 'left') {
    currentIndex = (currentIndex - 1 + cookie.images.length) % cookie.images.length;
  } else if (direction === 'right') {
    currentIndex = (currentIndex + 1) % cookie.images.length;
  }

  images.forEach((img) => {
    img.setAttribute("src", cookie.images[currentIndex]);
    img.setAttribute("data-index", currentIndex);
  });
}

document.querySelectorAll('.btnIzq').forEach((btn, index) => {
  btn.addEventListener('click', () => {
    changeImage(index, 'left');
  });
});

document.querySelectorAll('.btnDer').forEach((btn, index) => {
  btn.addEventListener('click', () => {
    changeImage(index, 'right');
  });
});



// Se cierre el menu al tocar la pantalla ----------------------------------------------------------------------------------------------

 
const menuCheckbox = document.getElementById('menu');
const navLinks = document.querySelectorAll('.container-links a'); 
const body = document.body; 

body.addEventListener('click', (event) => {
  if (!event.target.closest('.navbar-responsive') && !event.target.closest('.container-links')) {
    menuCheckbox.checked = false;
  }
});

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    menuCheckbox.checked = false;  
  });
});




//-------------------------------------------------------------------------------------------------------------------------------

// Función para mover el botón "Comprar" al final del contenedor
function moveBuyButtonToBottom() {
  const cartContainer = document.querySelector('.contentModal');
  const buyButton = document.querySelector('.cart-total');
  if (cartContainer && buyButton) {
    cartContainer.appendChild(buyButton);
  }
}

// Variables para almacenar sabores temporalmente y el contenedor
let cookieFlavorsInCart = [];
const cartContainer = document.querySelector('.contentModal');

// Agregar evento a los botones de agregar galletas
const buttons = document.querySelectorAll('.btnAddCookie');
buttons.forEach(button => {
  button.addEventListener('click', (event) => {
    event.preventDefault();

    // Obtener el sabor y precio de la galleta
    const flavor = button.getAttribute('data-flavor');
    const price = parseInt(button.getAttribute('data-price'), 10);

    // Agregar la galleta al carrito temporal
    cookieFlavorsInCart.push({ flavor, price });

    // Reconstruir el carrito completo
    rebuildCart();

    // Mover el botón "Comprar" al final
    moveBuyButtonToBottom();
  });
});

// Función para reconstruir el carrito completo
function rebuildCart() {
  // Limpiar el contenedor actual
  cartContainer.innerHTML = '';

  let boxBuffer = [];
  cookieFlavorsInCart.forEach(cookie => {
    boxBuffer.push(cookie);

    // Si se alcanzan 3 galletas, crear una caja
    if (boxBuffer.length === 3) {
      createCookieBox(boxBuffer);
      boxBuffer = [];
    }
  });

  // Crear una caja con las galletas restantes (1 o 2)
  if (boxBuffer.length > 0) {
    createCookieBox(boxBuffer);
  }

  // Actualizar el precio total del carrito
  updateTotalPrice();
}

// Función para crear una caja de galletas
function createCookieBox(cookieFlavors) {
  const articleCookie = document.createElement('div');
  articleCookie.classList.add('articleCookie');

  // Número de galletas en la caja
  const cookieCount = cookieFlavors.length;

  // Título de la caja
  const title = `Caja de ${cookieCount} cookie${cookieCount > 1 ? 's' : ''}`;

  // Sabores en la caja
  const flavorText = cookieFlavors
    .map(cookie => cookie.flavor)
    .join(cookieCount === 2 ? ' y ' : ', ');

  // Calcular el precio total de la caja
  const totalPrice = cookieFlavors.reduce((sum, c) => sum + c.price, 0);

  // Configurar el contenido HTML de la caja
  articleCookie.innerHTML = `
    <img src="./resourse/caja.jpg" alt="" class="imgProduct">
    <div class="titleCart">
      <div class="infoCart">
        <h3>${title}</h3>
        <p>${flavorText}</p>
        <div class="containerHowMany">
          <button class="btnHowMany decrease">
            <ion-icon name="remove-outline" class="btnHowMany"></ion-icon>
          </button>
          <input type="number" class="howManyCookies" value="1" min="1" />
          <button class="btnHowMany increase">
            <ion-icon name="add-outline" class="btnHowMany"></ion-icon>
          </button>
        </div>
      </div>
      <div class="monto">
        <a href="#"><ion-icon class="iconTrash" name="trash-outline"></ion-icon></a>
        <p>$${totalPrice}</p>
      </div>
    </div>
  `;

  // Agregar la caja al contenedor
  if (cartContainer) {
    cartContainer.appendChild(articleCookie);
  }

  // Configurar los botones de cantidad
  setupQuantityButtons(articleCookie);
}

// Función para configurar los botones de cantidad
function setupQuantityButtons(container) {
  const decreaseButton = container.querySelector('.decrease');
  const increaseButton = container.querySelector('.increase');
  const quantityInput = container.querySelector('.howManyCookies');
  const priceElement = container.querySelector('.monto p');

  const unitPrice = parseInt(priceElement.textContent.replace('$', ''), 10);

  decreaseButton.addEventListener('click', () => {
    const currentValue = parseInt(quantityInput.value) || 0;
    if (currentValue > 1) {
      quantityInput.value = currentValue - 1;
      updateItemPrice(priceElement, quantityInput, unitPrice);
    }
  });

  increaseButton.addEventListener('click', () => {
    const currentValue = parseInt(quantityInput.value) || 0;
    quantityInput.value = currentValue + 1;
    updateItemPrice(priceElement, quantityInput, unitPrice);
  });
}

// Actualizar el precio de un artículo
function updateItemPrice(priceElement, quantityInput, unitPrice) {
  const quantity = parseInt(quantityInput.value, 10);
  const price = quantity * unitPrice;
  priceElement.textContent = `$${price}`;
  updateTotalPrice();
}

// Actualizar el precio total del carrito
function updateTotalPrice() {
  const cartItems = document.querySelectorAll('.articleCookie .monto p');
  let total = 0;

  cartItems.forEach(item => {
    total += parseInt(item.textContent.replace('$', ''), 10);
  });

  const totalPriceElement = document.querySelector('.cart-total p');
  if (totalPriceElement) {
    totalPriceElement.textContent = `Total: $${total}`;
  }
}

function rebuildCart() {
  // Guardar referencias a los elementos persistentes
  const topModal = document.querySelector('.topModal');
  const buyButton = document.querySelector('.cart-total');

  // Limpiar solo las cajas de galletas, preservando los elementos persistentes
  const cartItems = cartContainer.querySelectorAll('.articleCookie');
  cartItems.forEach(item => item.remove());

  let boxBuffer = [];
  cookieFlavorsInCart.forEach(cookie => {
    boxBuffer.push(cookie);

    // Si se alcanzan 3 galletas, crear una caja
    if (boxBuffer.length === 3) {
      createCookieBox(boxBuffer);
      boxBuffer = [];
    }
  });

  // Crear una caja con las galletas restantes (1 o 2)
  if (boxBuffer.length > 0) {
    createCookieBox(boxBuffer);
  }

  // Asegurarse de que los elementos persistentes se mantengan en el contenedor
  if (!cartContainer.contains(topModal)) {
    cartContainer.insertAdjacentElement('afterbegin', topModal);
  }
  if (!cartContainer.contains(buyButton)) {
    cartContainer.appendChild(buyButton);
  }

  // Actualizar el precio total del carrito
  updateTotalPrice();
}

// Itera sobre todos los botones y agrega el evento 'click'
buttons.forEach(button => {
  button.addEventListener('click', (event) => {
    // Prevenir la acción predeterminada del enlace (si es necesario)
    event.preventDefault();

    // Obtener el valor del sabor del atributo 'data-flavor'
    const flavor = button.getAttribute('data-flavor');

    // Crear la notificación
    const notification = document.createElement('div');
    notification.textContent = `Agregando ${flavor} al carrito...`;
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.padding = '10px 20px';
    notification.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    notification.style.color = '#fff';
    notification.style.borderRadius = '5px';
    notification.style.fontSize = '16px';
    notification.style.zIndex = '9999';

    // Añadir la notificación al body
    document.body.appendChild(notification);

    // Eliminar la notificación después de 3 segundos
    setTimeout(() => {
      notification.remove();
    }, 3000);
  });
});


// Mover el botón "Comprar" al cargar la página
window.addEventListener('load', moveBuyButtonToBottom);

