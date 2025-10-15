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
    // container.innerHTML = "<li><p>Ma’lumot olib kelishda xatolik.</p></li>";
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
      li.dataset.productId = item._id;
      li.dataset.cartId = item._cartId;

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
        const productId = li.dataset.productId;
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


      document.querySelectorAll(".btn-quantity.plus").forEach(btn => {
        btn.addEventListener("click", e => {
          e.preventDefault();
          const li = e.currentTarget.closest("li");
          changeQty(li, +1);
        });
      });
      
      document.querySelectorAll(".btn-quantity.minus").forEach(btn => {
        btn.addEventListener("click", e => {
          e.preventDefault();
          const li = e.currentTarget.closest("li");
          changeQty(li, -1);
        });
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

    const qtyEl = li.querySelector(".current_quantity")
    if (qtyEl) qtyEl.textContent = qty;

    const unitPrice = parseFloat(qtyField.dataset.unitPrice);

    const newLineTotal = (unitPrice * qty).toFixed(2);

    const details = li.querySelector(".details");
    const itemTotalEl = li.querySelector(".item-total");
    details.dataset.price = newLineTotal;
    itemTotalEl.textContent = `${newLineTotal} so'm`;

    details.querySelector("p").innerHTML = `
    <span class="current_quantity">${qty}</span> x ${unitPrice.toFixed(2)} so'm
    `;

    updateSummary();
  }

  function updateSummary() {
  const detailsEls = Array.from(container.querySelectorAll(".details"));

  const lineTotals = detailsEls
  .map(d => parseFloat(d.dataset.price) || 0)
  .filter(v => !isNaN(v));

  const subTotal = lineTotals.reduce((sum, v) => sum + v, 0)
  const vat = (subTotal * 0.12).toFixed(2);
  const total = (subTotal + parseFloat(vat)).toFixed(2);

  const subTotalEl = document.querySelector(".sub-total .amount")
  const vatEl = document.querySelector(".taxes .amount")
  const totalEl = document.querySelector(".total .amount")

  if (subTotalEl) subTotalEl.textContent === `${subTotal.toFixed(2)} so'm`;
  if (vatEl) vatEl.textContent === `${vat} so'm`;
  if (totalEl) totalEl.textContent === `${total} so'm`;
}

});
