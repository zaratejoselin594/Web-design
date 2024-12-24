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


//Modal Cart ---------------------------------------------------------------------


const decreaseButton = document.getElementById('decrease');
const increaseButton = document.getElementById('increase');
const numberInput = document.getElementById('number');

decreaseButton.addEventListener('click', () => {
  const currentValue = parseInt(numberInput.value, 10) || 0;
  if (currentValue > 0) {
    numberInput.value = currentValue - 1;
  }
});

increaseButton.addEventListener('click', () => {
  const currentValue = parseInt(numberInput.value, 10) || 0;
  numberInput.value = currentValue + 1;
});

numberInput.addEventListener('input', () => {
  if (parseInt(numberInput.value, 10) < 0) {
    numberInput.value = 0;
  }
});


// Se cierre el menu al tocar la pantalla --------------------------------------------

 
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




/// Elementos del carrito y total
const cartTotalElement = document.querySelector('.cart-total'); // Elemento para el total

// Precio de un producto, ajusta según el producto real
const productPrice = 4345;

// Función para actualizar el total
function updateCartTotal() {
  const quantity = parseInt(numberInput.value, 10) || 0;
  const total = productPrice * quantity;

  // Actualizamos el total en el carrito
  if (cartTotalElement) {
    cartTotalElement.innerText = `Total: $${total.toFixed(2)}`;
  }
}

// Función para decrementar
decreaseButton.addEventListener('click', () => {
  const currentValue = parseInt(numberInput.value, 10) || 0;
  if (currentValue > 0) {
    numberInput.value = currentValue - 1;
  }
  updateCartTotal(); // Actualizamos el total después de cambiar la cantidad
});

// Función para incrementar
increaseButton.addEventListener('click', () => {
  const currentValue = parseInt(numberInput.value, 10) || 0;
  numberInput.value = currentValue + 1;
  updateCartTotal(); // Actualizamos el total después de cambiar la cantidad
});

// Función para manejar el input directamente
numberInput.addEventListener('input', () => {
  if (parseInt(numberInput.value, 10) < 0) {
    numberInput.value = 0;
  }
  updateCartTotal(); // Actualizamos el total cada vez que se cambia el input
});
