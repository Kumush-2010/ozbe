   // public/js/checkout.js
(function(){
  const data = window.APP_DATA || {};
  let deliveryPrice = Number(data.deliveryPrice || 7000);
  let subtotal = Number(data.subtotal || 0);
  let discount = Number(data.discount || 0);

  const elDeliveryPrice = document.getElementById('deliveryPrice');
  const elTotal = document.getElementById('total');

  function formatCurrency(n){
    return new Intl.NumberFormat('uz-UZ').format(n) + " so'm";
  }

  function recalc(){
    const total = Math.max(0, subtotal + deliveryPrice - discount);
    if(elDeliveryPrice) elDeliveryPrice.textContent = formatCurrency(deliveryPrice);
    if(elTotal) elTotal.textContent = formatCurrency(total);
  }

  // delivery toggle
  document.querySelectorAll('.delivery-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      document.querySelectorAll('.delivery-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');

      deliveryPrice = Number(btn.dataset.price || 0);
      recalc();
    });
  });

  // place order: gather form data and POST
  document.getElementById('placeOrder')?.addEventListener('click', async ()=>{
    // collect user info from page or prompt (in real app from form inputs)
    const payload = {
      fullname: document.querySelector('.user-name')?.textContent?.trim() || '',
      phone: document.querySelector('.user-phone')?.textContent?.trim() || '',
      email: data.user?.email || '',
      address: '', // you can show a modal or read from an input
      delivery: document.querySelector('.delivery-btn.active')?.dataset.type || 'pickup',
      payment: document.querySelector('input[name="pay"]:checked')?.value || 'card',
      items: data.cart || [],
      subtotal, deliveryPrice, discount
    };

    // simple validation
    if(!payload.fullname || !payload.phone){
      alert('Iltimos profilni to‘ldiring yoki tizimga kiring.');
      return;
    }

    try{
      const res = await fetch('/checkout', {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify(payload)
      });
      if(res.ok){
        const json = await res.json();
        alert('Buyurtma qabul qilindi!');
        // optionally redirect to order page
        window.location = '/orders/' + (json.orderId || '');
      } else {
        const text = await res.text();
        alert('Xato: ' + text);
      }
    }catch(err){
      console.error(err);
      alert('Tarmoq xatosi');
    }
  });

  recalc();
})();
