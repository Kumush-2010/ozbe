
const username = document.getElementById('username');
const password = document.getElementById('pwd');
const loginBtn = document.querySelector('.submit');

const user = [
    {
        username: 'admin',
        password: 'admin',
    }
]

loginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const userName = username.value;
    const passWord = password.value;

    if (userName === user[0].username && passWord === user[0].password) {
        window.location.href = './user-page/profil.html';
    } else {
        alert('Invalid username or password!');
    }
} 

);


const phoneInput = document.getElementById('phone');
const passwordInput = document.getElementById('password');
const submitBtn = document.querySelector('.submit');

submitBtn.addEventListener('click', async (e) => {
  e.preventDefault();
  console.log('Login tugmasi bosildi');

  const phone = phoneInput.value.trim();
  const password = passwordInput.value;
})