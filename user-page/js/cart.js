  document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("cart-container");
  let cartItems = [];

  try {
    const res = await fetch("/cartpage", {
      method: "GET",
      cache: "no-store",
      credentials: "include",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      }
    });
    const result = await res.json();

    if (result.success) {
      cartItems = result.items.map(item => ({
        ...item.product,
        _cartId: item._id,
        quantity: item.quantity
      }));

      renderCart(cartItems);
      updateSummary(result.items, result.total);
    } else {
      container.innerHTML = "<li><p>Savat bo‘sh.</p></li>";
    }
  } catch (error) {
    console.error("Savatni yuklashda xatolik:", error);
    container.innerHTML = "<li><p>Ma’lumot olib kelishda xatolik.</p></li>";
  }

  // --- CART RENDER ---
  function renderCart(items) {
    container.innerHTML = "";

    if (!items.length) {
      container.innerHTML = "<li><p>Savat bo‘sh.</p></li>";
      updateSummary([], 0);
      return;
    }

    items.forEach(item => {
      const li = document.createElement("li");
      li.className = "grid_4 item";
      li.dataset.productId = item._id;
      li.dataset.cartId = item._cartId;

      const imgSrc = item.images?.[0] || "/images/placeholder.jpg";
      const unitPrice = parseFloat(item.price);
      const qty = item.quantity;
      const totalPrice = (unitPrice * qty).toFixed(2);

      li.innerHTML = `
        <a href="#" class="btn-remove" data-cart-id="${item._cartId}">
          <i class="far fa-trash-alt"></i>
        </a>
        <div class="preview">
          <img src="${imgSrc}" alt="${item.name}" />
        </div>
        <div class="details" data-price="${totalPrice}">
          <h3>${item.name}</h3>
          <p class="item-total">${Number(totalPrice).toLocaleString()} so'm</p>
        </div>
        <div class="inner_container">
          <div class="col_1of2 align-center picker">
            <p>
              <a href="#" class="btn-quantity plus" data-cart-id="${item._cartId}">
                <i class="fas fa-plus"></i>
              </a>
              <div class="col_1of2 quantity-text">
                <p><span class="current_quantity">${qty}</span></p>
              </div>
              <p>
              <a href="#" class="btn-quantity minus" data-cart-id="${item._cartId}">
                <i class="fas fa-minus"></i>
              </a>
              </p>
            </p>
            <input
              type="hidden"
              class="quantity_field"
              name="quantity"
              data-unit-price="${unitPrice}"
              value="${qty}"
            />
          </div>
        </div>
      `;

      // 🗑 O‘chirish
      li.querySelector(".btn-remove").addEventListener("click", async e => {
        e.preventDefault();
        const cartId = e.currentTarget.dataset.cartId;
        const productId = li.dataset.productId;

        try {
          const resp = await fetch(`/cart/${cartId}`, {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId }),
          });
          const data = await resp.json();

          if (data.success) {
            li.remove();
            cartItems = cartItems.filter(x => x._cartId !== cartId);
            updateSummary(cartItems);
            if (!container.children.length) {
              container.innerHTML = "<li><p>Savat bo‘sh.</p></li>";
            }
          } else {
            alert("O‘chirishda xato");
          }
        } catch (err) {
          console.error(err);
          alert("Server bilan bog‘liq muammo");
        }
      });

      // ➕➖ Miqdorni o‘zgartirish
      li.querySelector(".btn-quantity.plus").addEventListener("click", e => {
        e.preventDefault();
        changeQty(li, +1);
      });


      li.querySelector(".btn-quantity.minus").addEventListener("click", e => {
        e.preventDefault();
        changeQty(li, -1);
      });

      container.appendChild(li);
    });

    updateSummary(items);
  }

  // --- QTY O‘ZGARISH ---
  function changeQty(li, delta) {
    const qtyField = li.querySelector(".quantity_field");
    let qty = parseInt(qtyField.value, 10) + delta;
    if (qty < 1) return;

    qtyField.value = qty;
    const qtyEl = li.querySelector(".current_quantity");
    if (qtyEl) qtyEl.textContent = qty;

    const unitPrice = parseFloat(qtyField.dataset.unitPrice);
    const newLineTotal = (unitPrice * qty).toFixed(2);

    const details = li.querySelector(".details");
    const itemTotalEl = li.querySelector(".item-total");
    details.dataset.price = newLineTotal;
    itemTotalEl.textContent = `${Number(newLineTotal).toLocaleString()} so'm`;

    // cartItems massivini ham yangilaymiz
    const id = li.dataset.cartId;
    const index = cartItems.findIndex(x => x._cartId === id);
    if (index !== -1) cartItems[index].quantity = qty;

    updateSummary(cartItems);
  }

  // --- JAMI HISOB ---
  function updateSummary(items = [], serverTotal = null) {
    let subTotal = 0;

    if (serverTotal) {
      subTotal = parseFloat(serverTotal);
    } else {
      items.forEach(item => {
        const price = parseFloat(item.price) || 0;
        const quantity = parseInt(item.quantity) || 0;
        subTotal += price * quantity;
      });
    }

    const productCountEl = document.querySelector(".product-count");
    const totalEl = document.querySelector(".total .amount");

    if (productCountEl) productCountEl.textContent = items.length || 0;
    if (totalEl) totalEl.textContent = `${subTotal.toLocaleString()}`;
  }

});
