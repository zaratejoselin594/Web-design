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

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  document.querySelector(".carritoContainer").style.display = "flex";
});

const toggleVisibility = () => {
  if (localOption.checked) {
    localCode.classList.remove("hidden");
    deliveryDetails.classList.add("hidden");
    randomCode.textContent = Math.random().toString(36).substring(2, 6).toUpperCase();
  } else if (deliveryOption.checked) {
    localCode.classList.add("hidden");
    deliveryDetails.classList.remove("hidden");
  }
};

localOption?.addEventListener("change", toggleVisibility);
deliveryOption?.addEventListener("change", toggleVisibility);

function guardarYMostrarPedidos() {
  const nombre = document.getElementById("nombre").value.trim();
  const telefono = document.getElementById("telefono").value.trim();
  let infoCliente = `👤 *Cliente*\n*Nombre y Apellido:* ${nombre}\n*Teléfono 📞:* ${telefono}\n`;

  if (localOption?.checked) {
    infoCliente += `*Código de Pedido 📌:* ${randomCode.textContent}\n`;
  } else if (deliveryOption?.checked) {
    const address = document.getElementById("address").value.trim();
    const instructions = document.getElementById("instructions").value.trim();
    infoCliente += `*Dirección 📍:* ${address}\n*Instrucciones:* ${instructions}\n`;
  }

  const cartData = localStorage.getItem("cart");
  if (!cartData) {
    alert("El carrito está vacío. Agrega productos antes de hacer el pedido.");
    return;
  }

  let pedidos;
  try {
    pedidos = JSON.parse(cartData);
    if (!Array.isArray(pedidos)) throw new Error();
  } catch (error) {
    alert("Error al recuperar los datos del carrito.");
    return;
  }

  let total = 0;
  let archivos = [];

  const mensajesPedidos = pedidos.map((pedido) => {
    if (pedido.flavor) {
      total += 27000;
      if (pedido.drawing) archivos.push(pedido.drawing);
      return `🎂 *Pedido de Pastel Personalizado*\n\n🍰 *Sabor:* ${pedido.flavor}\n⚖️ *Peso:* ${pedido.grams} gramos\n👥 *Cantidad de Personas:* ${pedido.people}\n${pedido.decorations ? `📋 *Descripción:* ${pedido.decorations}\n` : ""}🖼️ *Imagen del Dibujo:* ${pedido.drawing ? "[Incluido]" : "No incluida"}\n💰 *Precio:* $27,000\n---`;
    } else if (pedido.name) {
      total += pedido.price;
      return `🎂 *Pedido de Pastel de Tienda*\n\n🍰 *Nombre:* ${pedido.name}\n💰 *Precio:* $${pedido.price}\n---`;
    }
    return "";
  }).filter(msg => msg).join("\n\n");

  const mensajeCompleto = `${infoCliente}\n\n${mensajesPedidos}\n\n💵 *Total a Pagar:* $${total}\n\n¡Gracias por elegirnos! 😊`;

  if (orderContent) orderContent.innerHTML = mensajeCompleto.replace(/\n/g, "<br>");
  if (imageContainer) {
    imageContainer.innerHTML = archivos.map(img => `<img src="${img}" alt="Imagen del Pedido" style="max-width: 200px; margin: 5px;">`).join("");
  }

  cartTotal.innerHTML = `<p>${mensajeCompleto.replace(/\n/g, "<br>")}</p>`;
  const whatsappButton = document.createElement("button");
  whatsappButton.textContent = "Enviar Pedido por WhatsApp";
  whatsappButton.style.display = "block";
  whatsappButton.style.marginTop = "10px";
  whatsappButton.addEventListener("click", () => {
    window.open(`https://wa.me/+5493517716910?text=${encodeURIComponent(mensajeCompleto)}`, "_blank");
  });
  cartTotal.appendChild(whatsappButton);
};

cartTotal?.addEventListener("click", guardarYMostrarPedidos);

const cartData = localStorage.getItem("cart");
if (cartData) {
  let pedidos;
  try {
    pedidos = JSON.parse(cartData);
    if (!Array.isArray(pedidos)) throw new Error();
  } catch (error) {
    pedidos = [];
  }
  pedidos.forEach(pedido => {
    if (pedido.drawing && imageContainer) {
      const imgElement = document.createElement("img");
      imgElement.src = pedido.drawing;
      imgElement.alt = "Dibujo en el Pedido";
      imgElement.style.maxWidth = "300px";
      imgElement.style.margin = "10px";
      imageContainer.appendChild(imgElement);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => { });
