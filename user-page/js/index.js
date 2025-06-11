
      // SLIDER
      fetch('/api/slider')
        .then(res => res.json())
        .then(slides => {
          const wrapper = document.getElementById('slider-wrapper');
          slides.forEach(slide => {
            const div = document.createElement('div');
            div.className = 'swiper-slide gallery-slide';
            div.innerHTML = `<img src="${slide.src}" alt="">${slide.title ? `<p class="slider-title">${slide.title}</p>` : ''}`;
            wrapper.appendChild(div);
          });
        });

      // CATEGORY
      fetch('/api/categories')
        .then(res => res.json())
        .then(images => {
          const wrapper = document.getElementById('category-wrapper');
          images.forEach(src => {
            const div = document.createElement('div');
            div.innerHTML = `<img src="${src}" alt="">`;
            wrapper.appendChild(div);
          });
        });

      // YANGILAR
      fetch('/api/new')
        .then(res => res.json())
        .then(images => {
          const wrapper = document.getElementById('fresh-wrapper');
          images.forEach(src => {
            const div = document.createElement('div');
            div.className = 'swiper-slide';
            div.innerHTML = `<img src="${src}" alt="">`;
            wrapper.appendChild(div);
          });
        });

      // FAQ
      fetch('/api/faqs')
        .then(res => res.json())
        .then(faqs => {
          const wrapper = document.getElementById('faq-wrapper');
          faqs.forEach((faq, i) => {
            const item = document.createElement('div');
            item.className = 'rb-faq-container-item';
            item.innerHTML = `
              <input type="checkbox" id="tab${i}" class="tab-toggle" style="display:none;">
              <label for="tab${i}" class="rb-faq-question">${faq.question}</label>
              <div class="rb-faq-answer">${faq.answer}</div>
            `;
            wrapper.appendChild(item);
          });
        });

      // Preloader
      window.addEventListener("load", () => {
        document.getElementById("preloader").style.display = "none";
        document.getElementById("main-content").style.display = "block";
      });
