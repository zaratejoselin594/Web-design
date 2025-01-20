const cookies = [
  {
    selector: '.imgPasteleria img',
    images: [
      { src: "../resourse/pasteleria/sinconvertir/diecinueve.jpeg" },
      { src: "../resourse/pasteleria/sinconvertir/dieciocho.jpeg" },
      { src: "../resourse/pasteleria/sinconvertir/diecisiete.jpeg" },
      { src: "../resourse/pasteleria/sinconvertir/dieciseis.jpeg" },
      { src: "../resourse/pasteleria/sinconvertir/quince.jpeg" },
      { src: "../resourse/pasteleria/sinconvertir/catorce.jpeg" },
      { src: "../resourse/pasteleria/sinconvertir/trece.jpeg" },
      { src: "../resourse/pasteleria/sinconvertir/doce.jpeg" },
      { src: "../resourse/pasteleria/sinconvertir/once.jpeg" },
      { src: "../resourse/pasteleria/sinconvertir/diez.jpeg" },
      { src: "../resourse/pasteleria/sinconvertir/nueve.jpeg" },
      { src: "../resourse/pasteleria/sinconvertir/ocho.jpeg" },
      { src: "../resourse/pasteleria/sinconvertir/siete.jpeg" },
      { src: "../resourse/pasteleria/sinconvertir/seis.jpeg" },
      { src: "../resourse/pasteleria/sinconvertir/cinco.jpeg" },
      { src: "../resourse/pasteleria/sinconvertir/cuatro.jpeg" },
      { src: "../resourse/pasteleria/sinconvertir/tres.jpeg" },
      { src: "../resourse/pasteleria/sinconvertir/dos.jpeg" },
      { src: "../resourse/pasteleria/sinconvertir/uno.jpeg" },
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
});

/*
<img src="./resourse/caja.jpg" alt="" class="imgPr
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
*/
// Función para recolectar la información del formulario y guardarla en localStorage

// Función para mostrar la notificación
