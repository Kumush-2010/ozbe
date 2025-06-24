document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const phone = document.getElementById('phone').value;
  const password = document.getElementById('password').value;

  const res = await fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, password })
  });

  const data = await res.json();

  if (res.ok) {
    // Optional: tokenni localStorage ga saqlash
    localStorage.setItem('token', data.token);
    // Endi redirect qilish
    window.location.href = '/profil';
  } else {
    document.getElementById('login-msg').textContent = data.error || "Xatolik yuz berdi";
  }
});
