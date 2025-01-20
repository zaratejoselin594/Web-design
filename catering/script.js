// Abrir y cerrar el modal
function openModal() {
  const modal = document.getElementById('customModal');
  modal.style.display = 'flex';
}

function closeModal() {
  const modal = document.getElementById('customModal');
  modal.style.display = 'none';
}

// Limitar la cantidad de imágenes que se pueden subir
document.getElementById('images').addEventListener('change', function () {
  if (this.files.length > 3) {
    this.value = '';
    document.getElementById('imageLimitWarning').style.display = 'flex';
  } else {
    document.getElementById('imageLimitWarning').style.display = 'none';
  }
});

// Variables para el canvas
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let painting = false;
let lineWidth = document.getElementById('lineWidth').value;
let lineColor = document.getElementById('lineColor').value;

// Actualizar el grosor y color del dibujo
document.getElementById('lineWidth').addEventListener('input', (e) => {
  lineWidth = e.target.value;
});

document.getElementById('lineColor').addEventListener('input', (e) => {
  lineColor = e.target.value;
});

// Eventos del canvas
canvas.addEventListener('mousedown', startPosition);
canvas.addEventListener('mouseup', endPosition);
canvas.addEventListener('mousemove', draw);

function startPosition(e) {
  painting = true;
  draw(e);
}

function endPosition() {
  painting = false;
  ctx.beginPath();
}

function draw(e) {
  if (!painting) return;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';
  ctx.strokeStyle = lineColor;

  const rect = canvas.getBoundingClientRect();
  ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Validación y envío del formulario
/** */


// Abre o crea una base de datos
const dbName = 'cakeDB';
const storeName = 'cart';
let db;

const request = indexedDB.open(dbName, 1);

request.onupgradeneeded = function (event) {
  db = event.target.result;
  const store = db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
  store.createIndex('title', 'title', { unique: false });
};

request.onsuccess = function (event) {
  db = event.target.result;
  loadCartFromDB();  // Cargar el carrito al iniciar
};

request.onerror = function (event) {
  console.error("Error al abrir la base de datos:", event.target.error);
};

function showNotification(title) {
  const notification = document.createElement('div');
  notification.classList.add('notification');
  notification.textContent = `${title} ha sido agregado al carrito`;
  document.body.appendChild(notification);
  setTimeout(() => {
    notification.style.opacity = 1;
  }, 100);
  setTimeout(() => {
    notification.style.opacity = 0;
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

function saveFormData() {
  const formData = new FormData(document.getElementById("cakeForm"));
  const flavor = formData.get("flavor");
  const size = formData.get("size");
  const grams = formData.get("grams");
  const people = formData.get("people");
  const style = formData.get("style");
  const decorations = formData.get("decorations");

  const canvas = document.getElementById('canvas');
  const drawing = canvas.toDataURL();

  const images = [];
  const imageFiles = formData.getAll("images");
  if (imageFiles.length > 0) {
    let processedImages = 0;
    imageFiles.forEach(image => {
      const reader = new FileReader();
      reader.onload = function (e) {
        images.push(e.target.result);
        processedImages++;
        if (processedImages === imageFiles.length) {
          saveToDB({ flavor, size, grams, people, style, decorations, drawing, images });
        }
      };
      reader.readAsDataURL(image);
    });
  } else {
    saveToDB({ flavor, size, grams, people, style, decorations, drawing, images });
  }
}

function saveToDB(orderData) {
  const transaction = db.transaction([storeName], 'readwrite');
  const store = transaction.objectStore(storeName);
  const request = store.add(orderData);

  request.onsuccess = function () {
    console.log("Orden guardada exitosamente.");
  };

  request.onerror = function (event) {
    console.error("Error al guardar la orden:", event.target.error);
  };
}

function articuloCart() {
  const transaction = db.transaction([storeName], 'readonly');
  const store = transaction.objectStore(storeName);
  const request = store.getAll();  // Obtener todos los artículos

  request.onsuccess = function (event) {
    const cartItems = event.target.result;
    if (cartItems.length === 0) return;

    // Aquí puedes elegir un ítem específico o iterar sobre todos
    cartItems.forEach(item => {
      const { flavor, size, grams, people, style, decorations, drawing, images = [] } = item;
      const cartItem = {
        flavor, size, grams, people, style, decorations, drawing, images,
        title: `${flavor} - ${size}`,
        flavorText: `Sabor: ${flavor}, Tamaño: ${size}, Gramos: ${grams}, Personas: ${people}, Estilo: ${style}, Decoraciones: ${decorations}`,
        price: 100,
      };
      addItemToCart(cartItem);  // Agregar al carrito

      showNotification(cartItem.title);

      const contentFlavor = document.createElement('div');
      contentFlavor.classList.add('contentFlavor', 'colorCream');

      const imgCookieFlavor = document.createElement('div');
      imgCookieFlavor.classList.add('imgCookieFlavor');
      imgCookieFlavor.style.backgroundImage = `url(${drawing})`;

      const imgGallery = document.createElement('div');
      imgGallery.classList.add('imgGallery');
      images.forEach(img => {
        const imgElement = document.createElement('img');
        imgElement.src = img;
        imgGallery.appendChild(imgElement);
      });

      const canvasPreview = document.createElement('img');
      canvasPreview.classList.add('canvasPreview');
      canvasPreview.src = drawing;

      const containerDescipFlavor = document.createElement('div');
      containerDescipFlavor.classList.add('cotainerDescipFlavor');

      const h3 = document.createElement('h3');
      h3.textContent = cartItem.title;

      const p = document.createElement('p');
      p.textContent = cartItem.flavorText;

      const monto = document.createElement('div');
      monto.classList.add('monto');
      const iconTrash = document.createElement('ion-icon');
      iconTrash.setAttribute('name', 'trash-outline');
      iconTrash.classList.add('iconTrash');
      iconTrash.addEventListener('click', () => removeItem(contentFlavor, cartItem.title));
      const pPrice = document.createElement('p');
      pPrice.textContent = `$${cartItem.price}`;
      addTrashIconListener(iconTrash, id);

      monto.appendChild(iconTrash);
      monto.appendChild(pPrice);
      containerDescipFlavor.appendChild(h3);
      containerDescipFlavor.appendChild(p);
      containerDescipFlavor.appendChild(monto);
      contentFlavor.appendChild(imgCookieFlavor);
      contentFlavor.appendChild(imgGallery);
      contentFlavor.appendChild(canvasPreview);
      contentFlavor.appendChild(containerDescipFlavor);

      const contentModal = document.querySelector('.contentModal');
      if (contentModal) {
        contentModal.appendChild(contentFlavor);
      } else {
        console.error("No se encontró el contenedor '.contentModal'");
      }
    });
  };

  request.onerror = function (event) {
    console.error("Error al cargar el carrito:", event.target.error);
  };
}

function addItemToCart(item) {
  const transaction = db.transaction([storeName], 'readwrite');
  const store = transaction.objectStore(storeName);
  const request = store.put(item);  // Usar put para reemplazar el item si ya existe

  request.onsuccess = function () {
    console.log("Artículo agregado al carrito.");
  };

  request.onerror = function (event) {
    console.error("Error al agregar al carrito:", event.target.error);
  };
}

function removeItem(element, title) {
  const transaction = db.transaction([storeName], 'readwrite');
  const store = transaction.objectStore(storeName);
  const request = store.index('title').openCursor(IDBKeyRange.only(title));

  request.onsuccess = function (event) {
    const cursor = event.target.result;
    if (cursor) {
      store.delete(cursor.primaryKey);
      cursor.continue();
    }
  };

  request.onerror = function (event) {
    console.error("Error al eliminar el artículo:", event.target.error);
  };

  element.remove();
}

function loadCartFromDB() {
  const transaction = db.transaction([storeName], 'readonly');
  const store = transaction.objectStore(storeName);
  const request = store.getAll();  // Obtener todos los artículos

  request.onsuccess = function (event) {
    const cartItems = event.target.result;
    cartItems.forEach(item => {
      articuloCart(item);
    });
  };

  request.onerror = function (event) {
    console.error("Error al cargar el carrito:", event.target.error);
  };
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById('cakeForm').addEventListener('submit', function (e) {
    e.preventDefault();
    saveFormData();
    setTimeout(articuloCart, 500); // Espera para asegurar que las imágenes se procesen
  });
});

function removeItemFromIndexedDB(itemId) {
  const dbName = 'cakeDB'; // Nombre de la base de datos IndexedDB
  const storeName = 'cart'; // Nombre del almacén (store) de la base de datos

  const request = indexedDB.open(dbName);

  request.onsuccess = function (event) {
    const db = event.target.result;
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);

    const deleteRequest = store.delete(itemId); // Elimina el artículo por su ID

    deleteRequest.onsuccess = function () {
      console.log(`Artículo con ID ${itemId} ha sido eliminado de IndexedDB.`);
      // Realiza cualquier acción adicional después de eliminar el artículo
    };

    deleteRequest.onerror = function (event) {
      console.error("Error al eliminar el artículo de IndexedDB:", event.target.error);
    };
  };

  request.onerror = function (event) {
    console.error("Error al abrir IndexedDB:", event.target.error);
  };
}
// Función para agregar el evento de eliminación al ícono de la papelera
function addTrashIconListener(iconTrash, itemId) {
  iconTrash.addEventListener('click', function () {
    removeItemFromIndexedDB(itemId); // Elimina el artículo de IndexedDB
    removeItemFromDOM(iconTrash); // Opcional: Elimina el artículo del DOM
  });
}

// Eliminar el artículo del DOM (si es necesario)
function removeItemFromDOM(iconTrash) {
  const contentFlavor = iconTrash.closest('.contentFlavor');
  if (contentFlavor) {
    contentFlavor.remove();
  }
}


