document.addEventListener("DOMContentLoaded", async () => {
  console.log("Page loaded");
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
      cartItems = result?.items?.map(item => ({
        ...item.product,
        _cartId: item._id,
        quantity: item.quantity
      }));
      renderCart(cartItems);
    } else {
      container.innerHTML = "<li><p>Savat bo‘sh.</p></li>";
    }
  } catch (error){
    console.error("Savatni yuklashda xatolik:", error);
    container.innerHTML = "<li><p>Ma’lumot olib kelishda xatolik.</p></li>";
  }

  function renderCart(items) {
    container.innerHTML = "";

    if (!items.length) {
      container.innerHTML = "<li><p>Savat bo‘sh.</p></li>";
      return;
    }

    items.forEach(item => {
      const li = document.createElement("li");
      li.className = "grid_4 item";

      const imgSrc = item.images?.[0] || "/images/placeholder.jpg";
      const unitPrice = parseFloat(item.price);
      const qty = item.quantity;

      li.innerHTML = `
        <a href="#" class="btn-remove" data-cart-id="${item._cartId}">
          <i class="far fa-trash-alt"></i>
        </a>
        <div class="preview">
          <img src="${imgSrc}" alt="${item.name}" />
        </div>
        <div class="details" data-price="${(unitPrice * qty).toFixed(2)}">
          <h3>${item.name}</h3>
        </div>
        <div class="inner_container">
            <p> ${unitPrice.toFixed(2)} so'm</p>
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
              data-unit-price="${unitPrice.toFixed(2)}"
              value="${qty}"
            />
          </div>
        </div>
      `;

      li.querySelector(".btn-remove").addEventListener("click", async e => {
        e.preventDefault();
        const cartId = e.currentTarget.dataset.cartId;
        try {
          const resp = await fetch(`/cart/${cartId}`, {
            method: "PUT",
            credentials: "include",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ productId  }),
          });
          const data = await resp.json();
          if (data.success) {
            li.remove();
            updateSummary();
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

      li.querySelector(".plus").addEventListener("click", e => {
        e.preventDefault();
        changeQty(li, +1);
      });
      li.querySelector(".minus").addEventListener("click", e => {
        e.preventDefault();
        changeQty(li, -1);
      });

      container.appendChild(li);
    });

    updateSummary();
  }

  function changeQty(li, delta) {
    const qtyField = li.querySelector(".quantity_field");
    let qty = parseInt(qtyField.value, 10) + delta;
    if (qty < 1) return;

    qtyField.value = qty;
    li.querySelector(".current_quantity").textContent = qty;

    const unitPrice = parseFloat(qtyField.dataset.unitPrice);
    const newLineTotal = (unitPrice * qty).toFixed(2);

    const details = li.querySelector(".details");
    details.dataset.price = newLineTotal;
    details.querySelector("p").innerHTML = `<span class="current_quantity">${qty}</span> @ £${unitPrice.toFixed(2)}`;

    updateSummary();
  }

  function updateSummary() {
  const detailsEls = Array.from(container.querySelectorAll(".details"));
  const lineTotals = detailsEls.map(d => parseFloat(d.dataset.price) || 0);
  const subTotal = lineTotals.reduce((sum, v) => sum + v, 0).toFixed(2);
  const vat = (subTotal * 0.2).toFixed(2);
  const total = (+subTotal + +vat).toFixed(2);

document.querySelector(".sub-total .amount")?.textContent === `£${subTotal}`;
document.querySelector(".taxes .amount")?.textContent     === `£${vat}`;
document.querySelector(".total .amount")?.textContent     === `£${total}`;
}

});
