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

document.addEventListener('DOMContentLoaded', async () => {
  let allProducts = [];

  const productContainer = document.getElementById('shop-products');
  const categorySelect = document.getElementById('category');
  const sizeSelect = document.getElementById('size');
  const colorCheckboxes = document.querySelectorAll('input[name="color"]');
  const priceRange = document.getElementById('priceRange');
  const priceValue = document.getElementById('priceValue');
  const filterButton = document.querySelector('.shop-filter-apply');

  // 💰 Narx real-timeda
  priceRange.addEventListener('input', () => {
    priceValue.textContent = `${parseInt(priceRange.value).toLocaleString('uz-UZ')} so'm`;
  });

  // 🟡 Kategoriyalar
  fetch('/category')
    .then(res => res.json())
    .then(data => {
      const categories = Array.isArray(data) ? data : data.categories;
      const unique = new Set();

      categories.forEach(cat => {
        const raw = typeof cat === 'string' ? cat : cat?.name;
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

  // 🟢 Mahsulotlar
  fetch('/products', { cache: 'no-store' })
    .then(res => res.json())
    .then(products => {
      allProducts = products;
      renderProducts(allProducts);
    })
    .catch(err => console.error('Mahsulotlarni yuklashda xatolik:', err.message));

  // 🔵 Filter
  filterButton.addEventListener('click', () => {
    const filtered = applyFilters(allProducts);
    renderProducts(filtered);
  });

  // 📦 Filterlash
  function applyFilters(products) {
    const selectedCategory = categorySelect.value.trim().toLowerCase();
    const selectedSize = sizeSelect.value.trim().toLowerCase();
    const selectedColors = Array.from(colorCheckboxes)
      .filter(checkbox => checkbox.checked)
      .map(checkbox => checkbox.value.trim().toLowerCase());
    const maxPrice = parseFloat(priceRange.value) || 1000000;

    return products.filter(product => {
      const matchesCategory =
        !selectedCategory || (product.category?.trim().toLowerCase() === selectedCategory);
      const matchesSize =
        !selectedSize || (product.size?.trim().toLowerCase() === selectedSize);
      const matchesColor =
        selectedColors.length === 0 || selectedColors.includes(product.color?.trim().toLowerCase());
      const matchesPrice = parseFloat(product.price) <= maxPrice;

      return matchesCategory && matchesSize && matchesColor && matchesPrice;
    });
  }

  // 🖼 Mahsulotlar renderi
  function renderProducts(products) {
    productContainer.innerHTML = '';

    if (products.length === 0) {
      productContainer.innerHTML = '<p>Mahsulot topilmadi.</p>';
      return;
    }

    products.forEach(product => {
      const card = document.createElement('div');
      card.className = 'shop-card';

      const image1 = product.images?.[0] || 'images/placeholder.jpg';
      const image2 = product.images?.[1] || image1;

      card.innerHTML = `
        <div class="shop-card-image">
          <img src="${image1}" alt="${product.name}" />
           <button class="wishlist-btn" data-product-id="${product._id}" data-action="wishlist">
           <i class="fa-regular fa-heart"></i>
            </button>
        </div>
        <div class="shop-card-content">
        <div class="shop-card-info"> 
        <div>
        <h3 class="shop-card-title">${product.name}</h3>
        <p class="shop-card-price">${parseInt(product.price).toLocaleString('uz-UZ')} so'm</p>
        </div>
        <button class="btn-cart" data-id="${product._id}" data-action="cart"><i class="fa-solid fa-cart-shopping" style="color: white"></i></button>
        </div>
        </div>
      `;

      const imgEl = card.querySelector('img');
      card.addEventListener('mouseenter', () => { imgEl.src = image2 });
      card.addEventListener('mouseleave', () => { imgEl.src = image1 });

      const wishlistBtn = card.querySelector('.wishlist-btn'); 
      wishlistBtn.addEventListener('click', async () => {
        const productId = wishlistBtn.dataset.productId;
        const icon = wishlistBtn.querySelector('i');
        const isLiked = wishlistBtn.classList.contains('fa-solid');
        const url = isLiked ? '/wishlists/${id}' : '/wishlist/add';

        try {
          const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId }),
            credentials: 'include'
          });

          const result = await res.json();
          if (result.success) {
            icon.classList.toggle('fa-regular', isLiked);
            icon.classList.toggle('fa-solid', !isLiked);
            icon.style.color = isLiked ? '#555' : '#ff4d6d';

            icon.classList.add('animate')
            setTimeout(() => icon.classList.remove('animate'), 400);
          } else {
            alert('Amalni bajara olmadik!');
          }
        } catch (error) {
          console.error('Wishlist xatolik:', error);
        }
      });

      productContainer.appendChild(card);
    });
  }

  function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
});

