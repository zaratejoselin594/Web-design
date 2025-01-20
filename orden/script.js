

const form = document.getElementById('registroForm');
// Escuchar el evento 'submit' del formulario
form.addEventListener('submit', (event) => {
  event.preventDefault(); // Previene el comportamiento por defecto del formulario (opcional)
  document.querySelector(".carritoContainer").style = 'display: flex;'
});

document.addEventListener("DOMContentLoaded", () => {
  const localOption = document.getElementById("localOption");
  const deliveryOption = document.getElementById("deliveryOption");
  const localCode = document.getElementById("localCode");
  const deliveryDetails = document.getElementById("deliveryDetails");
  const randomCode = document.getElementById("randomCode");

  const toggleVisibility = () => {
    if (localOption.checked) {
      localCode.classList.remove("hidden");
      deliveryDetails.classList.add("hidden");
      randomCode.textContent = Math.random().toString(36).substring(2, 10).toUpperCase();
    } else if (deliveryOption.checked) {
      localCode.classList.add("hidden");
      deliveryDetails.classList.remove("hidden");
    }
  };

  localOption.addEventListener("change", toggleVisibility);
  deliveryOption.addEventListener("change", toggleVisibility);
});


// Generar código aleatorio
function generateRandomCode() {
  return Math.floor(10000 + Math.random() * 90000);
}

// Mostrar/ocultar secciones dinámicamente
function toggleDeliveryOptions() {
  if (localOption.checked) {
    localCode.classList.remove('hidden');
    deliveryDetails.classList.add('hidden');
    randomCode.textContent = generateRandomCode();
    addressInput.removeAttribute('required');
  } else if (deliveryOption.checked) {
    deliveryDetails.classList.remove('hidden');
    localCode.classList.add('hidden');
    addressInput.setAttribute('required', 'required');
  } else {
    localCode.classList.add('hidden');
    deliveryDetails.classList.add('hidden');
    addressInput.removeAttribute('required');
  }
}

// Evento para cambio de opción de entrega
localOption.addEventListener('change', toggleDeliveryOptions);
deliveryOption.addEventListener('change', toggleDeliveryOptions);

// Obtener contenido del formulario
function getOrderContent() {
  const nombre = document.getElementById('nombre').value;
  const apellido = document.getElementById('apellido').value;
  const telefono = document.getElementById('telefono').value;
  const dni = document.getElementById('dni').value;
  const cbu = document.getElementById('cbu').value;

  let orderContent = `Nombre: ${nombre}\nApellido: ${apellido}\nTeléfono: ${telefono}\nDNI: ${dni}\nCBU: ${cbu}\n`;

  if (localOption.checked) {
    orderContent += `Código de Pedido: ${randomCode.textContent}`;
  } else if (deliveryOption.checked) {
    const address = document.getElementById('address').value.trim();
    const instructions = document.getElementById('instructions').value.trim();
    orderContent += `Dirección: ${address}\nInstrucciones: ${instructions}`;
  }

  // Opcional: agregar detalles del carrito si corresponde
  if (typeof cookieFlavorsInCart !== 'undefined' && cookieFlavorsInCart.length) {
    cookieFlavorsInCart.forEach(cookie => {
      orderContent += `\nPedido: ${cookie.flavor} - $${cookie.price}`;
    });
  }

  return orderContent;
}

// Validación y envío del formulario


// Modal de copiar pedido
function openCopyOrderModal() {
  const orderContent = getOrderContent();
  const whatsappMessage = encodeURIComponent(orderContent);

  // Configurar contenido dinámico y enlace de WhatsApp
  document.getElementById('orderContent').textContent = orderContent;
  document.getElementById('whatsappLink').href = `https://wa.me/5493513039104?text=${whatsappMessage}`;

  // Mostrar el modal
  document.getElementById('copyOrderModal').style.display = 'block';
}

function closeCopyOrderModal() {
  document.getElementById('copyOrderModal').style.display = 'none';
}

// Vincular modal al botón
document.querySelector('.cartTotal').addEventListener('click', (event) => {
  event.preventDefault();
  openCopyOrderModal();
});

// Cerrar el modal principal de la página
function closeModal() {
  document.getElementById('pageCart').style.display = 'none';
}
