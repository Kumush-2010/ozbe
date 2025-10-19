  // public/js/checkout.js
(function(){
  const data = window.APP_DATA || {};
  let deliveryPrice = Number(data.deliveryPrice || 7000);
  let subtotal = Number(data.subtotal);
  let discount = Number(data.discount || 0);

  const elDeliveryPrice = document.getElementById('deliveryPrice');
  const elTotal = document.getElementById('totalPrice'); // 🔧 HBS bilan bir xil bo'lishi kerak!

  // 💰 Narx formatlash
  function formatCurrency(n){
    return new Intl.NumberFormat('uz-UZ').format(n) + " so'm";
  }

  // 🔄 Hisob-kitobni yangilash
  function recalc(){
    const total = Math.max(0, subtotal + deliveryPrice - discount);
    if (elDeliveryPrice) elDeliveryPrice.textContent = formatCurrency(deliveryPrice);
    if (elTotal) elTotal.textContent = formatCurrency(total);
    return total;
  }

  // 🚚 Yetkazib berish turi almashtirish
  document.querySelectorAll('.delivery-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.delivery-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      deliveryPrice = Number(btn.dataset.price || 0);
      recalc();
    });
  });

  // 🧾 Buyurtma yuborish
  document.getElementById('placeOrder')?.addEventListener('click', async () => {
    const activeDelivery = document.querySelector('.delivery-btn.active');
    const deliveryType = activeDelivery ? activeDelivery.dataset.type : 'pickup';
    const paymentType = document.querySelector('input[name="pay"]:checked')?.value || 'card';
    const total = recalc();

    const payload = {
      user: {
        fullname: document.querySelector('.user-name')?.textContent?.trim() || '',
        phone: document.querySelector('.user-phone')?.textContent?.trim() || '',
        email: data.user?.email || '',
      },
      deliveryType,
      paymentType,
      address: '', // Keyinchalik input qo'shiladi
      items: data.cart || [],
      subtotal,
      deliveryPrice,
      discount,
      total
    };
  
    // 🔒 Minimal validatsiya
    if (!payload.user.fullname || !payload.user.phone) {
      alert("Iltimos, tizimga kiring yoki profil ma'lumotlarini to‘ldiring.");
      return;
    }

    try {
      const res = await fetch('/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (res.ok && json.success) {
        alert('✅ Buyurtma muvaffaqiyatli qabul qilindi!');
        window.location = '/orders/' + (json.orderId || '');
      } else {
        alert('❌ Xatolik: ' + (json.message || 'Buyurtma yaratishda muammo.'));
      }
    } catch (err) {
      console.error('Buyurtma xatosi:', err);
      alert('⚠️ Server bilan bog‘liq muammo.');
    }
  });

  // ⚙️ Boshlang‘ich hisobni chiqarish
  recalc();
})();
