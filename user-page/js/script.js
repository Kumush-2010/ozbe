
let gallerySlider = new Swiper('.gallery-slider', {
  pagination: {
     el: '.swiper-pagination',
     type: 'bullets',
     clickable: true
  },
  navigation: {
     nextEl: '.swiper-button-next',
     prevEl: '.swiper-button-prev',
  },
  loop: true,
  effect: 'coverflow',
  centeredSlides: true,
  slidesPerView: 3,
  coverflowEffect: {
    rotate: 0,
    stretch: 100,
    depth: 150,
    modifier: 1.5,
    slideShadows: false,
  }
  });


// slider
let swiper = new Swiper(".fresh", {
slidesPerView: 1,
spaceBetween: 10,
  pagination: {
    el: ".swiper-pagination",
    type: "fraction",
  },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
breakpoints: {
  "@0.00": {
    slidesPerView: 1,
    spaceBetween: 10,
  },
  "@0.75": {
    slidesPerView: 2,
    spaceBetween: 20,
  },
  "@1.00": {
    slidesPerView: 3,
    spaceBetween: 40,
  },
  "@1.50": {
    slidesPerView: 4,
    spaceBetween: 50,
  },
},
});



document.addEventListener('DOMContentLoaded', () => {

const announcements = [
  "Ozbeni bilgan biladi, bilmagan o'zi biladi!",
  "Yangi chegirmalar uchun kuzatib boring!",
  "Biz bilan bog'laning va yangiliklardan xabardor bo'ling!",
  "OZBE 3 YOSHDA!",
  "qadamlariga hasanot!",
  "bizayam drop qvordik"
];

const announcementText = document.querySelector('.announcement-bar p');
const announcementPrev = document.querySelector('.announcement-bar .prev');
const announcementNext = document.querySelector('.announcement-bar .next');
let announcementIndex = 0;

function updateAnnouncement() {
  if (announcementText) {
    announcementText.textContent = announcements[announcementIndex];
  } else {
    console.log("Announcement text element not found!");
  }
}

announcementPrev?.addEventListener('click', () => {
  announcementIndex = (announcementIndex - 1 + announcements.length) % announcements.length;
  updateAnnouncement();
});

announcementNext?.addEventListener('click', () => {
  announcementIndex = (announcementIndex + 1) % announcements.length;
  updateAnnouncement();
});

setInterval(() => {
  announcementIndex = (announcementIndex + 1) % announcements.length;
  updateAnnouncement();
}, 1500);
});


