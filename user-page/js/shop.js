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
  let wishlistItems = [];

  const productContainer = document.getElementById('shop-products');
  const wishlistContainer = document.getElementById('wishlist-container');
  const categorySelect = document.getElementById('category');
  const sizeSelect = document.getElementById('size');
  const colorCheckboxes = document.querySelectorAll('input[name="color"]');
  const priceRange = document.getElementById('priceRange');
  const priceValue = document.getElementById('priceValue');
  const filterButton = document.querySelector('.shop-filter-apply');

  // ✅ 1. Wishlist ma’lumotlarini olish
  try {
    const res = await fetch('http://localhost:7000/wishlist', {
      method: 'GET',
      credentials: 'include'
    });

    const result = await res.json();
    if (result.success) {
      wishlistItems = result.items.map(item => item.productId._id || item.productId);

      // 👉 Wishlist productlarini alohida chiqarish
      const wishlistProducts = result.items.map(item => item.productId);
      renderWishlist(wishlistProducts);
    }
  } catch (err) {
    console.error("Wishlistni yuklashda xatolik:", err);
  }

  // 💰 Narx real-timeda
  priceRange.addEventListener('input', () => {
    priceValue.textContent = `${parseInt(priceRange.value).toLocaleString('uz-UZ')} so'm`;
  });

  // 🟡 Kategoriyalar
  fetch('http://localhost:7000/category')
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
  fetch('http://localhost:7000/products', { cache: 'no-store' })
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

      const isInWishlist = wishlistItems.includes(product._id);

      card.innerHTML = `
        <div class="shop-card-image">
          <img src="${image1}" alt="${product.name}" />
        </div>
        <div class="shop-card-content">
          <h3 class="shop-card-title">${product.name}</h3>
          <p class="shop-card-price">${parseInt(product.price).toLocaleString('uz-UZ')} so'm</p>
        </div>
        <div class="shop-card-actions">
         <button class="wishlist-btn" data-product-id="${product._id}" data-action="wishlist">
           ${isInWishlist ? '❤️' : '🤍'}
         </button>
         <button class="shop-btn" data-id="${product._id}" data-action="cart">🛒</button>
        </div>
      `;

      const imgEl = card.querySelector('img');
      card.addEventListener('mouseenter', () => { imgEl.src = image2 });
      card.addEventListener('mouseleave', () => { imgEl.src = image1 });

      const wishlistBtn = card.querySelector('.wishlist-btn');
      wishlistBtn.addEventListener('click', async () => {
        const productId = wishlistBtn.dataset.productId;
        const isLiked = wishlistBtn.textContent === '❤️';
        const url = isLiked ? '/wishlist/remove' : '/wishlist/add';

        try {
          const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId }),
            credentials: 'include'
          });

          const result = await res.json();
          if (result.success) {
            wishlistBtn.textContent = isLiked ? '🤍' : '❤️';
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

  // ❤️ Wishlistni chiqarish
  function renderWishlist(products) {
    if (!wishlistContainer) return;

    wishlistContainer.innerHTML = '';

    if (products.length === 0) {
      wishlistContainer.innerHTML = '<p>Wishlist bo‘sh.</p>';
      return;
    }

    products.forEach(product => {
      const card = document.createElement('div');
      card.className = 'shop-card';

      const image = product.images?.[0] || 'images/placeholder.jpg';

      card.innerHTML = `
        <div class="shop-card-image">
          <img src="${image}" alt="${product.name}" />
        </div>
        <div class="shop-card-content">
          <h3 class="shop-card-title">${product.name}</h3>
          <p class="shop-card-price">${parseInt(product.price).toLocaleString('uz-UZ')} so'm</p>
        </div>
      `;

      wishlistContainer.appendChild(card);
    });
  }

  // 🔤 Foydali funksiya
  function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
});
