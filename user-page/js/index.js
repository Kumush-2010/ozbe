
// // swiper
  async function loadSliderImages() {
    try {
      const response = await fetch('/products'); // API endpointni o'zgartiring
      const products = await response.json();

      const wrapper = document.getElementById('dynamic-slides');
      products.forEach(product => {
        if (product.images && product.images.length > 0) {
          const slide = document.createElement('div');
          slide.className = 'swiper-slide custom-slide';

          slide.innerHTML = `
            <img src="${product.images[0]}" alt="${product.name}">
            <div class="slide-content">
              <h3>${product.name}</h3>
              <button>Bitta ko‘richi</button>
            </div>
          `;
          wrapper.appendChild(slide);
        }
      });

      new Swiper('.mySwiper', {
        slidesPerView: 1.3,
        spaceBetween: 30,
        centeredSlides: true,
        loop: true,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        breakpoints: {
          768: {
            slidesPerView: 2.5,
          },
          1024: {
            slidesPerView: 3.2,
          }
        }
      });
    } catch (error) {
      console.error('Xatolik fetch paytida:', error);
    }
  }

  loadSliderImages();


  // category
fetch('http://localhost:7000/category')
  .then(res => res.json())
  .then(data => {
    const wrapper = document.getElementById('category-images');

    // JSON array bo'lishi kerak
    const categories = Array.isArray(data) ? data : data.categories || [];

    categories.forEach(category => {
      if (category.image) {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        slide.innerHTML = `
          <img src="${category.image}" alt="${category.name}" />
          <p style="text-align:center; margin-top:8px;">${category.name}</p>
        `;
        wrapper.appendChild(slide);
      }
    });

    const useLoop = wrapper.children.length >= 3;

    new Swiper('.mySwiper', {
      loop: useLoop,
      centeredSlides: true,
      slidesPerView: 'auto',
      spaceBetween: 20,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });
  })
  .catch(err => {
    console.error("Xatolik fetch paytida:", err);
  });
