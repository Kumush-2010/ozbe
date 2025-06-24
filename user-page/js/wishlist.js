document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("wishlist-container");

  try {
    const res = await fetch("http://localhost:7000/wishlists", {
      method: "GET",
      credentials: "include",
      cache: "no-store"
    });

    const result = await res.json();

    if (Array.isArray(result)) {
      // Har bir mahsulotga wishlistId qo‘shamiz
      const products = result.map(item => ({
        ...item.productId,
        _wishlistId: item._id,
        _id: item.productId._id
      }));
      renderWishlist(products);
    } else {
      container.innerHTML = "<p>Wishlist bo‘sh.</p>";
    }
  } catch (error) {
    console.error("Wishlistni yuklashda xatolik:", error);
    container.innerHTML = "<p>Xatolik yuz berdi!</p>";
  }

  function renderWishlist(wishlist) {
    container.innerHTML = "";

    if (!wishlist || wishlist.length === 0) {
      container.innerHTML = "<p>Wishlist bo‘sh.</p>";
      return;
    }

    wishlist.forEach(item => {
      if (!item) return;

      const card = document.createElement("div");
      card.classList.add("wishlist-card");

      const image = item.images?.[0] || "images/placeholder.jpg";
      const formattedPrice = parseInt(item.price).toLocaleString("uz-UZ");

      card.innerHTML = `
        <div class="wishlist-image">
          <img src="${image}" alt="${item.name}" />
        </div>
        <div class="wishlist-details">
          <h3>${item.name}</h3>
          <p class="price">${formattedPrice} so'm</p>
          <div class="wishlist-actions">
            <button class="btn-remove" data-id="${item._wishlistId}" title="O'chirish">
              <i class="fa-solid fa-trash"></i>
            </button>
            <button class="btn-cart" data-id="${item._id}" title="Savatga qo‘shish">
              <i class="fa-solid fa-cart-plus"></i>
            </button>
          </div>
        </div>
      `;

      container.appendChild(card);
    });

    // O'chirish tugmalari uchun listener
    const deleteButtons = container.querySelectorAll(".btn-remove");
    deleteButtons.forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.getAttribute("data-id");
        if (!id) return;

        try {
          const delRes = await fetch(`http://localhost:7000/wishlists/${id}`, {
            method: "DELETE",
            credentials: "include"
          });
          const delResult = await delRes.json();

          if (delResult.success) {
            btn.closest(".wishlist-card").remove();

            if (container.children.length === 0) {
              container.innerHTML = "<p>Wishlist bo‘sh.</p>";
            }
          } else {
            alert("O‘chirishda xatolik yuz berdi.");
          }
        } catch (err) {
          console.error("O‘chirishda xatolik:", err);
          alert("Server bilan aloqa muvaffaqiyatsiz.");
        }
      });
    });

    // 🛒 Savatga qo‘shish tugmalari uchun listener
    const cartButtons = container.querySelectorAll(".btn-cart");
    cartButtons.forEach(btn => {
      btn.addEventListener("click", async () => {
        const productId = btn.getAttribute("data-id");
        console.log(productId);
        
        if (!productId) {
          alert("Mahsulot ID topilmadi!")
          return
        };

        try {
          const res = await fetch("http://localhost:7000/cart", {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ productId })
          });

          const result = await res.json();

          if (result.success) {
            alert("Mahsulot savatga qo‘shildi.");
          } else {
            alert("Xatolik: "+( result.message || "Nomalum xatolik"));
          }
        } catch (err) {
          console.error("Savatga qo‘shishda xatolik:", err);
          alert("Server bilan aloqa muvaffaqiyatsiz.");
        }
      });
    });
  }
});

