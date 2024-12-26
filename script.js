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


// Función para crear una caja de galletas
// Modificar la función createCookieBox para incluir la eliminación de elementos del localStorage
function createCookieBox(cookieFlavors) {
  const articleCookie = document.createElement('div');
  articleCookie.classList.add('articleCookie');

  const cookieCount = cookieFlavors.length;
  const title = `Caja de ${cookieCount} cookie${cookieCount > 1 ? 's' : ''}`;
  const flavorText = cookieFlavors.map(cookie => cookie.flavor).join(', ');
  const totalPrice = cookieFlavors.reduce((sum, c) => sum + c.price, 0);
  const boxId = `box-${Date.now()}-${Math.random()}`;

  // Guardar el ID en los datos de las galletas
  cookieFlavors.forEach(cookie => (cookie.id = boxId));

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
        <ion-icon name="trash-outline" class="iconTrash" data-id="${boxId}"></ion-icon>
        <p>$${totalPrice}</p>
      </div>
    </div>
  `;

  if (cartContainer) {
    cartContainer.appendChild(articleCookie);
  }

  setupQuantityButtons(articleCookie);

  // Evento para eliminar del carrito y localStorage
  const deleteButton = articleCookie.querySelector('.iconTrash');
  deleteButton.addEventListener('click', () => {
    deleteCookieFromCart(boxId);
    articleCookie.remove(); // Eliminar del DOM
  });
}

// Función para eliminar un artículo del localStorage
function deleteCookieFromCart(boxId) {
  cookieFlavorsInCart = cookieFlavorsInCart.filter(cookie => cookie.id !== boxId);
  saveCartToLocalStorage();
  updateTotalPrice(); // Actualizar el precio total
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

  // Sumar todos los precios de los artículos en el carrito
  cartItems.forEach(item => {
    total += parseInt(item.textContent.replace('$', ''), 10);
  });

  // Actualizar el contenido del elemento <p class="total">
  const totalPriceElement = document.querySelector('.total');
  if (totalPriceElement) {
    totalPriceElement.textContent = `Total: $${total}`;
  }

  // Asegurar que <p class="total"> y el botón "Comprar" estén al final del contenedor
  const buyButton = document.querySelector('.cart-total');
  if (cartContainer) {
    cartContainer.appendChild(totalPriceElement);
    cartContainer.appendChild(buyButton);
  }
}

function rebuildCart() {
  // Limpiar el contenedor actual, pero preservar elementos persistentes
  const topModal = document.querySelector('.topModal');
  const totalPriceElement = document.querySelector('.total');
  const buyButton = document.querySelector('.cart-total');

  const cartItems = cartContainer.querySelectorAll('.articleCookie');
  cartItems.forEach(item => item.remove());

  // Reconstruir las cajas con las galletas del carrito
  let boxBuffer = [];
  cookieFlavorsInCart.forEach(cookie => {
    boxBuffer.push(cookie);
    if (boxBuffer.length === 3) {
      createCookieBox(boxBuffer);
      boxBuffer = [];
    }
  });
  if (boxBuffer.length > 0) {
    createCookieBox(boxBuffer);
  }

  // Asegurar que <p class="total"> y el botón "Comprar" estén al final del contenedor
  if (totalPriceElement && !cartContainer.contains(totalPriceElement)) {
    cartContainer.appendChild(totalPriceElement);
  }
  if (buyButton && !cartContainer.contains(buyButton)) {
    cartContainer.appendChild(buyButton);
  }

  // Actualizar el precio total
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
window.addEventListener('load', () => {
  const totalPriceElement = document.querySelector('.total');
  const buyButton = document.querySelector('.cart-total');

  if (totalPriceElement && cartContainer) {
    cartContainer.appendChild(totalPriceElement);
  }
  if (buyButton && cartContainer) {
    cartContainer.appendChild(buyButton);
  }
  updateTotalPrice();
});


// -----------------------------------------------------------------------------------------------------------------------------

// Función para guardar el carrito en localStorage
function saveCartToLocalStorage() {
  const cartData = cookieFlavorsInCart.map(cookie => ({
    flavor: cookie.flavor,
    price: cookie.price
  }));

  localStorage.setItem('cartData', JSON.stringify(cartData));
}

// Llamar a esta función después de agregar una galleta al carrito
buttons.forEach(button => {
  button.addEventListener('click', (event) => {
    event.preventDefault();

    // Obtener sabor y precio
    const flavor = button.getAttribute('data-flavor');
    const price = parseInt(button.getAttribute('data-price'), 10);

    // Agregar galleta al carrito
    cookieFlavorsInCart.push({ flavor, price });

    // Guardar el carrito en localStorage
    saveCartToLocalStorage();

    // Reconstruir el carrito en la interfaz
    rebuildCart();
  });
});

// Función para recuperar el carrito desde localStorage
function loadCartFromLocalStorage() {
  const cartData = localStorage.getItem('cartData');

  if (cartData) {
    const parsedCartData = JSON.parse(cartData);
    cookieFlavorsInCart = parsedCartData.map(item => ({
      flavor: item.flavor,
      price: item.price
    }));

    rebuildCart(); // Reconstruir el carrito visualmente
  }
}

// Llamar a la función cuando se cargue la página
window.addEventListener('load', () => {
  loadCartFromLocalStorage();
});








