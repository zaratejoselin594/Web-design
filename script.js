// Slider
const cookies = [
  {
    selector: '.cookieOne',
    images: [
      { src: "./resourse/webp/redVelvetCookie.webp", flavor: "Red Velvet", price: 890 },
      { src: "./resourse/webp/cookieChocolateCacao.webp", flavor: "Chocolate Doble", price: 900 },
      { src: "./resourse/webp/cookieStarwberry.webp", flavor: "Vainilla con Frutilla", price: 950 },
      { src: "./resourse/webp/chocolateChipsAndMany.webp", flavor: "Vainilla con Chocolate y Maní", price: 700 },
      { src: "./resourse/webp/cookieChocolate.webp", flavor: "Chocolate", price: 650 },
      { src: "./resourse/webp/cookieVainilla.webp", flavor: "Vainilla Clásica", price: 560 }
    ]
  },
  {
    selector: '.cookieTwo',
    images: [
      { src: "./resourse/webp/redVelvetCookie.webp", flavor: "Red Velvet", price: 890 },
      { src: "./resourse/webp/cookieChocolateCacao.webp", flavor: "Chocolate Doble", price: 900 },
      { src: "./resourse/webp/cookieStarwberry.webp", flavor: "Vainilla con Frutilla", price: 950 },
      { src: "./resourse/webp/chocolateChipsAndMany.webp", flavor: "Vainilla con Chocolate y Maní", price: 700 },
      { src: "./resourse/webp/cookieChocolate.webp", flavor: "Chocolate", price: 650 },
      { src: "./resourse/webp/cookieVainilla.webp", flavor: "Vainilla Clásica", price: 560 }
    ]
  },
  {
    selector: '.cookieThree',
    images: [
      { src: "./resourse/webp/redVelvetCookie.webp", flavor: "Red Velvet", price: 890 },
      { src: "./resourse/webp/cookieChocolateCacao.webp", flavor: "Chocolate Doble", price: 900 },
      { src: "./resourse/webp/cookieStarwberry.webp", flavor: "Vainilla con Frutilla", price: 950 },
      { src: "./resourse/webp/chocolateChipsAndMany.webp", flavor: "Vainilla con Chocolate y Maní", price: 700 },
      { src: "./resourse/webp/cookieChocolate.webp", flavor: "Chocolate", price: 650 },
      { src: "./resourse/webp/cookieVainilla.webp", flavor: "Vainilla Clásica", price: 560 }
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
    img.setAttribute("src", cookie.images[currentIndex].src);
    img.setAttribute("data-index", currentIndex);
    img.setAttribute("alt", cookie.images[currentIndex].flavor);
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

// Cierre del menú al tocar fuera
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

// Función para crear una caja de galletas
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
    articleCookie.remove();
  });
}

// Función para eliminar un artículo del localStorage
function deleteCookieFromCart(boxId) {
  cookieFlavorsInCart = cookieFlavorsInCart.filter(cookie => cookie.id !== boxId);
  saveCartToLocalStorage();
  updateTotalPrice();
}

// Configurar botones de cantidad
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

  const totalPriceElement = document.querySelector('.total');
  if (totalPriceElement) {
    totalPriceElement.textContent = `Total: $${total}`;
  }

  const buyButton = document.querySelector('.cart-total');
  if (cartContainer) {
    cartContainer.appendChild(totalPriceElement);
    cartContainer.appendChild(buyButton);
  }
}

// Función para guardar el carrito en localStorage
function saveCartToLocalStorage() {
  const cartData = cookieFlavorsInCart.map(cookie => ({
    id: cookie.id, // Aseguramos que el ID se guarde
    flavor: cookie.flavor,
    price: cookie.price
  }));

  localStorage.setItem('cartData', JSON.stringify(cartData));
}

// Función para cargar el carrito desde localStorage
function loadCartFromLocalStorage() {
  const cartData = localStorage.getItem('cartData');

  if (cartData) {
    const parsedCartData = JSON.parse(cartData);

    // Reconstruimos el carrito con los datos cargados
    cookieFlavorsInCart = parsedCartData.map(item => ({
      id: item.id, // Recuperar el ID único
      flavor: item.flavor,
      price: item.price
    }));

    rebuildCart(); // Reconstruir la interfaz gráfica del carrito
  }
}

// Reconstrucción del carrito
function rebuildCart() {
  const cartItems = cartContainer.querySelectorAll('.articleCookie');
  cartItems.forEach(item => item.remove());

  // Dividimos las galletas en grupos para recrear las cajas
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

  updateTotalPrice();
}

// Agregar funcionalidad para el botón Buy en el slider
document.querySelectorAll('.btnBuy').forEach((btn) => {
  btn.addEventListener('click', () => {
    // Recoger las imágenes visibles en cada slider
    const selectedFlavors = cookies.map(slider => {
      const imgElement = document.querySelector(`${slider.selector} .imgCookie`);
      if (!imgElement) return null;

      const flavorIndex = parseInt(imgElement.getAttribute('data-index') || '0', 10);
      return slider.images[flavorIndex]; // Información de la imagen visible
    });

    // Filtrar sabores válidos (asegurarse de que todos los sliders tienen selección)
    const validFlavors = selectedFlavors.filter(flavor => flavor !== null);

    // Verificar que hay exactamente 3 galletas seleccionadas
    if (validFlavors.length === 3) {
      createCookieBox(validFlavors); // Crear la caja de galletas
      cookieFlavorsInCart.push(...validFlavors); // Agregar al carrito temporal
      saveCartToLocalStorage(); // Guardar en localStorage
      rebuildCart(); // Reconstruir el carrito
      moveBuyButtonToBottom(); // Asegurar que el botón "Comprar" está al final
    } else {
      alert('Debes seleccionar exactamente 3 galletas visibles para añadir al carrito.');
    }
  });
});



const buttons = document.querySelectorAll('.btnAddCookie');
buttons.forEach(button => {
  button.addEventListener('click', (event) => {
    event.preventDefault();

    // Obtener el sabor y precio de la galleta
    const flavor = button.getAttribute('data-flavor');
    const price = parseInt(button.getAttribute('data-price'), 10);

    // Generar un ID único para cada artículo
    const id = `cookie-${Date.now()}-${Math.random()}`;

    // Agregar la galleta al carrito temporal
    cookieFlavorsInCart.push({ id, flavor, price });

    saveCartToLocalStorage(); // Guardar en localStorage

    // Reconstruir el carrito completo
    rebuildCart();

    // Mover el botón "Comprar" al final
    moveBuyButtonToBottom();
  });
});


// Función para mostrar notificaciones
function showNotification(message, type = "success") {
  const notification = document.createElement("div");
  notification.classList.add("notification", type);
  notification.textContent = message;

  // Agregar la notificación al cuerpo
  document.body.appendChild(notification);

  // Remover la notificación después de 3 segundos
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Evento para el botón .btnAddCookie
document.querySelectorAll('.btnAddCookie').forEach(button => {
  button.addEventListener('click', (event) => {
    event.preventDefault();

    // Obtener datos de la galleta
    const flavor = button.getAttribute('data-flavor');
    const price = parseInt(button.getAttribute('data-price'), 10);

    // Mostrar notificación
    showNotification(`Se añadió "${flavor}" al carrito por $${price}.`, "success");
  });
});

// Evento para el botón .btnBuy
document.querySelectorAll('.btnBuy').forEach((btn) => {
  btn.addEventListener('click', () => {
    const selectedFlavors = cookies.map(slider => {
      const imgElement = document.querySelector(`${slider.selector} .imgCookie`);
      if (!imgElement) return null;

      const flavorIndex = parseInt(imgElement.getAttribute('data-index') || '0', 10);
      return slider.images[flavorIndex];
    });

    const validFlavors = selectedFlavors.filter(flavor => flavor !== null);

    if (validFlavors.length === 3) {
      // Mostrar notificación mencionando los sabores seleccionados
      const flavorList = validFlavors.map(flavor => flavor.flavor).join(", ");
      const totalPrice = validFlavors.reduce((sum, flavor) => sum + flavor.price, 0);
      showNotification(`Caja de 3 galletas seleccionada: ${flavorList}. Total: $${totalPrice}`, "success");
    } else {
      showNotification("Debes seleccionar exactamente 3 galletas visibles.", "error");
    }
  });
});

// Eventos de carga inicial
window.addEventListener('load', () => {
  loadCartFromLocalStorage();
  moveBuyButtonToBottom();
  updateTotalPrice();
});



// Función para abrir el modal con el pedido
// Función para abrir el modal con el pedido
function openCopyOrderModal() {
  const orderContent = getOrderContent(); // Obtener el contenido del pedido
  const orderText = `Pedido: ${orderContent}`;
  const whatsappMessage = encodeURIComponent(orderText); // Codificar para WhatsApp

  // Establecer el contenido dinámico y el enlace de WhatsApp
  document.getElementById('orderContent').textContent = orderText;
  document.getElementById('whatsappLink').href = `https://wa.me/?text=${whatsappMessage}`;

  // Mostrar el modal
  document.getElementById('copyOrderModal').style.display = 'block';
}

// Función para cerrar el modal de copiar pedido
function closeCopyOrderModal() {
  document.getElementById('copyOrderModal').style.display = 'none';
}

// Obtener el contenido del pedido (esto depende de cómo gestiones el carrito)
function getOrderContent() {
  // Aquí puedes crear una lógica para obtener el contenido del carrito y devolverlo como texto.
  // Por ejemplo, si tienes un array `cookieFlavorsInCart` con los sabores y precios:
  let orderContent = '';
  cookieFlavorsInCart.forEach(cookie => {
    orderContent += `${cookie.flavor} - $${cookie.price}\n`;
  });
  return orderContent.trim();
}

// Mostrar el modal al hacer clic en "Comprar"
document.querySelector('.cart-total').addEventListener('click', openCopyOrderModal);

// Función para cerrar el modal principal de página
function closeModal() {
  document.getElementById('pageCart').style.display = 'none';
}
