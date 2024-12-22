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
