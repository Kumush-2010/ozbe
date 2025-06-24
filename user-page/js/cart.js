$(document).ready(function () {
  let $addQuantity = $(".btn-quantity.plus"),
      $minusQuantity = $(".btn-quantity.minus"),
      $removeItem = $(".btn-remove");

  $addQuantity.on("click", function (e) {
    e.preventDefault();
    let $item = $(this).parents(".item"),
        $quantityField = $item.find(".quantity_field"),
        currentQuantity = $quantityField.val(),
        nextQuantity = parseFloat(currentQuantity) + 1;

    $item.find(".current_quantity").html(nextQuantity);
    $quantityField.val(nextQuantity);

    calculateTotal();
  });

  $minusQuantity.on("click", function (e) {
    e.preventDefault();
    let $item = $(this).parents(".item"),
        $quantityField = $item.find(".quantity_field"),
        currentQuantity = $quantityField.val();
    let prevQuantity = currentQuantity <= 1 ? 0 : parseFloat(currentQuantity) - 1;

    $item.find(".current_quantity").html(prevQuantity);
    $quantityField.val(prevQuantity);

    calculateTotal();
  });

  $removeItem.on("click", function () {
    let $item = $(this).parents(".item");
    $item.remove();

    calculateTotal();
  });

  let calculateTotal = function () {
    let newSubTotal = 0;
    $(".quantity_field").each(function () {
      let quantity = $(this).val(),
          price = $(this).data("price");

      newSubTotal += parseFloat(quantity * price);
    });

    $(".sub-total .amount").html("£" + newSubTotal.toFixed(2));

    let withTax = newSubTotal * 1.2;

    let newTotal = withTax;

    $(".total .amount").html("Total" + " " + "£" + newTotal.toFixed(2));
  };

  calculateTotal();
});


  document.addEventListener("DOMContentLoaded", function () {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartContainer = document.getElementById("cart-items");

    if (cart.length === 0) {
      cartContainer.innerHTML= "<p>Savatcha bo‘sh</p>";
      return;
    }

    let total = 0;
    cart.forEach((item) => {
      const itemTotal = parseFloat(item.price.replace("$", "")) * item.quantity;
      total += itemTotal;

      const productHTML = `
        <div class="cart-item">
          <img src="${item.image}" width="80">
          <div>
            <h5>${item.name}</h5>
            <p>Size: ${item.size}, Color: ${item.color}</p>
            <p>Narx: ${item.price} x ${item.quantity} = $${itemTotal.toFixed(2)}</p>
          </div>
        </div>
        <hr>
      `;
      cartContainer.innerHTML += productHTML;
    });

    document.getElementById("total-price").innerText = "$" + total.toFixed(2);
  });

