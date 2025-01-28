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
      randomCode.textContent = Math.random().toString(36).substring(2, 6).toUpperCase();
    } else if (deliveryOption.checked) {
      localCode.classList.add("hidden");
      deliveryDetails.classList.remove("hidden");
    }
  };

  localOption.addEventListener("change", toggleVisibility);
  deliveryOption.addEventListener("change", toggleVisibility);
});

function guardarYMostrarPedidos() {
  // Obtener datos del cliente
  const nombre = document.getElementById("nombre").value;
  const telefono = document.getElementById("telefono").value;

  let infoCliente = `👤 *Cliente*\n`;
  infoCliente += `*Nombre y Apellido:* ${nombre}\n*Teléfono 📞:* ${telefono}\n`;

  const localOption = document.getElementById("localOption");
  const deliveryOption = document.getElementById("deliveryOption");
  const randomCode = document.getElementById("randomCode");

  if (localOption && localOption.checked) {
    infoCliente += `*Código de Pedido 📌:* ${randomCode.textContent}\n`;
  } else if (deliveryOption && deliveryOption.checked) {
    const address = document.getElementById("address").value.trim();
    const instructions = document.getElementById("instructions").value.trim();
    infoCliente += `*Dirección 📍:* ${address}\n*Instrucciones:* ${instructions}\n`;
  }

  // Obtener los datos del carrito
  const cartData = localStorage.getItem("cart");
  if (!cartData) {
    console.error("No hay datos en el carrito.");
    return;
  }

  const pedidos = JSON.parse(cartData);
  let total = 0; // Inicializar el total a pagar
  const archivos = []; // Lista para guardar las imágenes como archivos

  // Generar mensaje de los pedidos
  const mensajesPedidos = pedidos
    .map((pedido) => {
      if (pedido.flavor) {
        // Caso: Tortas Personalizadas
        const { flavor, grams, people, style = null, decorations = null, drawing = null } = pedido;

        total += 27000; // Agregar precio fijo de torta personalizada

        // Si hay un dibujo, agregarlo como archivo
        if (drawing) {
          archivos.push(drawing); // Agregar URL o base64 de la imagen
        }

        return `🎂 *Pedido de Pastel Personalizado*\n\n*Detalles del Pedido:*\n\n` +
          `*🍰 Sabor:* ${flavor}\n` +
          `*⚖️ Peso:* ${grams} gramos\n` +
          `*👥 Cantidad de Personas:* ${people}\n` +
          `${style ? `*🎨 Estilo:* ${style}\n` : ""}` +
          `${decorations ? `*🎉 Decoraciones:* ${decorations}\n` : ""}` +
          `*🖼️ Imagen del Dibujo:* ${drawing ? "[Incluido]" : "No incluida"}\n` +
          `*💰 Precio:* $27,000\n---`;
      } else if (pedido.name) {
        // Caso: Tortas de Tienda
        const { name, price, image } = pedido;

        total += price; // Sumar el precio de la torta de tienda

        return `🎂 *Pedido de Pastel de Tienda*\n\n*Detalles del Pedido:*\n\n` +
          `*🍰 Nombre:* ${name}\n` +
          `*💰 Precio:* $${price}\n---`;
      }

      return ""; // Caso no identificado
    })
    .filter((mensaje) => mensaje) // Eliminar mensajes vacíos
    .join("\n\n");

  // Agregar el total al final del mensaje
  const mensajeCompleto = `${infoCliente}\n\n${mensajesPedidos}\n\n*💵 Total a Pagar:* $${total}\n\n¡Gracias por elegirnos! 😊`;

  // Mostrar mensaje en el contenedor
  const orderContent = document.querySelector(".orderContent");
  if (orderContent) {
    orderContent.innerHTML = mensajeCompleto.replace(/\n/g, "<br>"); // Reemplazar saltos de línea por <br> para mostrar en HTML
  } else {
    console.error("No se encontró el contenedor .orderContent.");
  }

  // Recuperar la imagen del canvas desde localStorage y mostrarla
  const canvasImage = localStorage.getItem("canvasImage");
  if (canvasImage) {
    // Crear un elemento <img> para mostrar la imagen
    const imgElement = document.createElement("img");
    imgElement.src = canvasImage;
    imgElement.alt = "Imagen del Pedido";
    imgElement.style.maxWidth = "300px"; // Tamaño de la imagen en el DOM
    imgElement.style.margin = "10px";

    // Insertar la imagen en el contenedor correspondiente en el DOM
    const imageContainer = document.querySelector(".imageContainer");
    if (imageContainer) {
      imageContainer.appendChild(imgElement);
    }

    // Preparar el enlace para compartir en WhatsApp
    const whatsappLink = `https://api.whatsapp.com/send?text=Texto%20personalizado%20aquí%20${encodeURIComponent(canvasImage)}`;

    // Crear un enlace para abrir WhatsApp con la imagen y el mensaje
    const shareButton = document.createElement("a");
    shareButton.href = whatsappLink;
    shareButton.target = "_blank";
    shareButton.textContent = "Compartir en WhatsApp";
    shareButton.style.display = "inline-block";
    shareButton.style.padding = "10px 20px";
    shareButton.style.backgroundColor = "#25d366"; // Color de WhatsApp
    shareButton.style.color = "#fff";
    shareButton.style.textDecoration = "none";
    shareButton.style.borderRadius = "5px";

    // Insertar el enlace en el DOM
    if (imageContainer) {
      imageContainer.appendChild(shareButton);
    }
  } else {
    console.error("No se encontró la imagen en localStorage.");
  }

  // Abrir WhatsApp con el mensaje (sin imágenes)
  const whatsappURL = `https://wa.me/+5493513039104?text=${encodeURIComponent(mensajeCompleto)}`;
  window.open(whatsappURL, "_blank");
}
