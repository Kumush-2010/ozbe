// let swiper = new Swiper(".mySwiper", {
//   slidesPerView: 1,
//   spaceBetween: 10,
//     pagination: {
//       el: ".swiper-pagination",
//       type: "fraction",
//     },
//       navigation: {
//         nextEl: ".swiper-button-next",
//         prevEl: ".swiper-button-prev",
//       },
//   breakpoints: {
//     "@0.00": {
//       slidesPerView: 1,
//       spaceBetween: 10,
//     },
//     "@0.75": {
//       slidesPerView: 2,
//       spaceBetween: 20,
//     },
//     "@1.00": {
//       slidesPerView: 3,
//       spaceBetween: 40,
//     },
//     "@1.50": {
//       slidesPerView: 4,
//       spaceBetween: 50,
//     },
//   },
// });


document.addEventListener('DOMContentLoaded', () => {
  let allProducts = [];

  const productContainer = document.getElementById('shop-products');
  const categorySelect = document.getElementById('category');
  const sizeSelect = document.getElementById('size');
  const colorCheckboxes = document.querySelectorAll('input[name="color"]');
  const priceRange = document.getElementById('priceRange');
  const priceValue = document.getElementById('priceValue');
  const filterButton = document.querySelector('.shop-filter-apply');

  // Narx qiymatini real-timeda ko‘rsatish (so'm formatda)
  priceRange.addEventListener('input', () => {
    priceValue.textContent = `${parseInt(priceRange.value).toLocaleString('uz-UZ')} so'm`;
  });

  // 🟡 Kategoriyalarni yuklab selectga joylash
  fetch('http://localhost:7000/category')
    .then(res => {
      if (!res.ok) throw new Error(`Xatolik: ${res.status}`);
      return res.json();
    })
    .then(data => {
      const categories = Array.isArray(data) ? data : data.categories;
      if (!Array.isArray(categories)) throw new Error('Kategoriya massivi topilmadi');

      const unique = new Set();

      categories.forEach(cat => {
        let raw = typeof cat === 'string' ? cat : cat?.name;
        if (!raw) return;

        const value = raw.trim().toLowerCase();
        const label = capitalizeFirstLetter(raw.trim());

        if (!unique.has(value)) {
          unique.add(value);
          const option = document.createElement('option');
          option.value = value;
          option.textContent = label;
          categorySelect.appendChild(option);
        }
      });
    })
    .catch(err => console.error('Kategoriyalarni yuklashda xatolik:', err));

  // 🟢 Mahsulotlarni yuklash
  fetch('http://localhost:7000/products', { cache: 'no-store' })
    .then(res => {
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      return res.json();
    })
    .then(products => {
      allProducts = products;
      renderProducts(allProducts);
    })
    .catch(err => console.error('Mahsulotlarni yuklashda xatolik:', err.message));

  // 🔵 Filter tugmasi bosilganda
  filterButton.addEventListener('click', () => {
    const filtered = applyFilters(allProducts);
    renderProducts(filtered);
  });

  // 🧠 Filterlash funksiyasi
  function applyFilters(products) {
    const selectedCategory = categorySelect.value.trim().toLowerCase();
    const selectedSize = sizeSelect.value.trim().toLowerCase();
    const selectedColors = Array.from(colorCheckboxes)
      .filter(checkbox => checkbox.checked)
      .map(checkbox => checkbox.value.trim().toLowerCase());
    const maxPrice = parseFloat(priceRange.value) || 1000000;

    return products.filter(product => {
      const matchesCategory =
        !selectedCategory ||
        (typeof product.category === 'string' &&
         product.category.trim().toLowerCase() === selectedCategory);

      const matchesSize =
        !selectedSize ||
        (typeof product.size === 'string' &&
         product.size.trim().toLowerCase() === selectedSize);

      const matchesColor =
        selectedColors.length === 0 ||
        (typeof product.color === 'string' &&
         selectedColors.includes(product.color.trim().toLowerCase()));

      const matchesPrice = parseFloat(product.price) <= maxPrice;

      return matchesCategory && matchesSize && matchesColor && matchesPrice;
    });
  }

  // 🖼 Mahsulotlarni chiqarish
  function renderProducts(products) {
    productContainer.innerHTML = '';

    if (products.length === 0) {
      productContainer.innerHTML = '<p>Mahsulot topilmadi.</p>';
      return;
    }

    products.forEach(product => {
      const card = document.createElement('div');
      card.className = 'shop-card';

      const image1 = (product.images && product.images[0]) || 'images/placeholder.jpg';
      const image2 = (product.images && product.images[1]) || image1;

      card.innerHTML = `
        <div class="shop-card-image">
          <img src="${image1}" alt="${product.name}" />
        </div>
        <div class="shop-card-content">
          <h3 class="shop-card-title">${product.name}</h3>
          <p class="shop-card-price">${parseInt(product.price).toLocaleString('uz-UZ')} so'm</p>
        </div>
        <div class="shop-card-actions">
          <button class="shop-btn" data-id="${product.id}" data-action="wishlist">🤍</button>
          <button class="shop-btn" data-id="${product.id}" data-action="cart">🛒</button>
        </div>
      `;

      const imgEl = card.querySelector('img');
      card.addEventListener('mouseenter', () => {
        imgEl.src = image2;
      });
      card.addEventListener('mouseleave', () => {
        imgEl.src = image1;
      });

      productContainer.appendChild(card);
    });
  }

  // 🆘 Foydali funksiya: Kapital harfga aylantirish
  function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
});
