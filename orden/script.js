const form = document.getElementById('registroForm');
// Escuchar el evento 'submit' del formulario
form.addEventListener('submit', (event) => {
  event.preventDefault(); // Previene el comportamiento por defecto del formulario (opcional)
  document.querySelector(".carritoContainer").style = 'display: flex;'
});
function openCopyOrderModal() {
  document.getElementById('copyOrderModal').style.display = 'flex';
}
// Función para cerrar el modal
function closeCopyOrderModal() {
  document.getElementById('copyOrderModal').style.display = 'none';
}
// Función para cerrar el modal principal de la página
function closeModal() {
  document.getElementById('pageCart').style.display = 'none';
}

const deliveryOption = document.getElementById("deliveryOption");
const localCode = document.getElementById("localCode");
const deliveryDetails = document.getElementById("deliveryDetails");
const randomCode = document.getElementById("randomCode");
const orderContent = document.querySelector(".conenidoPedido");
const imageContainer = document.querySelector(".imageContainer");
const shareContainer = document.querySelector(".shareContainer");
const cartTotal = document.querySelector(".cartTotal");


const toggleVisibility = () => {
  if (localOption.checked) {
    localCode.classList.remove("hidden");
    deliveryDetails.classList.add("hidden");
    randomCode.textContent = Math.random().toString(36).substring(2, 6).toUpperCase();
  } else if (deliveryOption.checked) {
    localCode.classList.add("hidden");
    deliveryDetails.classList.remove("hidden");
  }
  const modalElement = document.querySelector('.modalOpcion');
  if (modalElement) {
    modalElement.style.height = localOption?.checked ? '5em' : '12em';
  }
};
localOption?.addEventListener("change", toggleVisibility);
deliveryOption?.addEventListener("change", toggleVisibility);

document.
addEventListener("DOMContentLoaded", function () {
  const localOption = document.getElementById("localOption");
  const deliveryOption = document.getElementById("deliveryOption");
  const localCode = document.getElementById("localCode");
  const deliveryDetails = document.getElementById("deliveryDetails");
  const addressInput = document.getElementById("address");

  function updateForm() {
    if (deliveryOption.checked) {
      deliveryDetails.classList.remove("hidden");
      addressInput.setAttribute("required", "true");
      localCode.classList.add("hidden");
    } else if (localOption.checked) {
      deliveryDetails.classList.add("hidden");
      addressInput.removeAttribute("required");
      localCode.classList.remove("hidden");
      document.getElementById("randomCode").textContent = Math.floor(1000 + Math.random() * 9000);
    }
  }

  localOption.addEventListener("change", updateForm);
  deliveryOption.addEventListener("change", updateForm);

  // Recupera el carrito y lo guarda en el localStorage
  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Asegura que el carrito persista correctamente
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
  localStorage.setItem("cart", JSON.stringify(cart));
});

function guardarYMostrarPedidos() {
  const nombre = document.getElementById("nombre").value.trim();
  const telefono = document.getElementById("telefono").value.trim();
  let infoCliente = `👤 *Cliente*\n*Nombre y Apellido:* ${nombre}\n*Teléfono 📞:* ${telefono}\n`;

  let total = 0;
  let archivos = [];

  if (localOption?.checked) {
    infoCliente += `*Código de Pedido 📌:* ${randomCode.textContent}\n`;
  } else if (deliveryOption?.checked) {
    const address = document.getElementById("address").value.trim();
    const instructions = document.getElementById("instructions").value.trim();
    infoCliente += `*Dirección 📍:* ${address}\n*Instrucciones:* ${instructions}\n Envío por $1800`;
    total += 1800;
  }

  // Recuperar y conservar el carrito
  // Recuperar y conservar el carrito
  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let pedidos = [...cartItems, ...cart]; // Fusionar los dos carritos

  if (pedidos.length === 0) {
    alert("El carrito está vacío. Agrega productos antes de hacer el pedido.");
    return;
  }


  let orderID = localStorage.getItem('orderID') || generateOrderID();
  localStorage.setItem('orderID', orderID);

  // Construcción del mensaje con los pedidos
  const mensajesPedidos = pedidos.map((pedido) => {
    total += parseFloat(pedido.price);
    if (pedido.images?.length > 0) archivos.push(pedido.images[0]);
    return `🎂 *Pedido*\n🍰 *Nombre:* ${pedido.name || pedido.flavor}\n💰 *Precio:* $${pedido.price}\n---`;
  }).join("\n\n");

  const mensajeCompleto = `${infoCliente}\n\n${mensajesPedidos}\n\n 💵 *Total a Pagar:* $${total.toFixed(2)}\n\n¡Gracias por elegirnos! 😊`;

  const orderData = {
    orderID: orderID,
    clienteInfo: infoCliente,
    pedidos: pedidos,
    totalPrice: total
  };
  localStorage.setItem('pedido_' + orderID, JSON.stringify(orderData));

  if (orderContent) orderContent.innerHTML = mensajeCompleto.replace(/\n/g, "<br>");
  if (imageContainer) {
    imageContainer.innerHTML = archivos.map(img => `<img src="${img}" alt="Imagen del Pedido" style="max-width: 200px; margin: 5px;">`).join("");
  }

  sendOrderToWhatsApp(mensajeCompleto);
}


// Generar un ID de pedido único
function generateOrderID() {
  return Math.random().toString(36).substr(2, 9).toUpperCase();
}

function sendOrderToWhatsApp(order) {
  const orderID = localStorage.getItem('orderID');
  const mensaje = `${order}\n\nTu pedido ha sido registrado. Puedes verlo aquí: ${window.location.origin}/ver_pedido.html?order=${orderID}`;
  document.getElementById('whatsappLink').addEventListener('click', () => {
    window.open(`https://wa.me/+5493517716910?text=${encodeURIComponent(mensaje)}`, "_blank");
  });
}

form.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevenir el comportamiento por defecto (recarga de página)
  guardarYMostrarPedidos();
});