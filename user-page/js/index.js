document.addEventListener("DOMContentLoaded", function () {
  fetch("http://localhost:7000/products")
    .then(res => res.json())
    .then(products => {
      const wrapper = document.getElementById("slider-wrapper");
      if (!wrapper) {
        console.error("slider-wrapper elementi topilmadi!");
        return;
      }

      products.forEach(product => {
        const firstImage = product.images[0]; // faqat 1-rasmni olayapti
        if (firstImage) {
          const slide = document.createElement("div");
          slide.className = "swiper-slide";
          slide.innerHTML = `<img src="${firstImage}" alt="product" />`;
          wrapper.appendChild(slide);
        }
      });

      new Swiper(".mySwiper", {
        slidesPerView: 1,
        spaceBetween: 10,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        loop: false,
      });
    });
});