
const editBtn = document.getElementById("editBtn");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");

const nameInput = document.getElementById("name");
const birthInput = document.getElementById("birthdate");
const phoneInput = document.getElementById("phone");
const emailInput = document.getElementById("email");

const genderRadios = document.querySelectorAll("input[name='gender']");

// Asl qiymatlarni saqlash uchun
let originalValues = {
  name: nameInput.value,
  birthdate: birthInput.value,
  phone: phoneInput.value,
  email: emailInput.value,
  gender: document.querySelector("input[name='gender']:checked").value
};

editBtn.onclick = () => {
  nameInput.readOnly = false;
  birthInput.readOnly = false;
  phoneInput.readOnly = false;
  emailInput.readOnly = false;
  genderRadios.forEach(r => r.disabled = false);

  saveBtn.disabled = false;
  cancelBtn.disabled = false;
  editBtn.disabled = true;
};

saveBtn.onclick = () => {
  nameInput.readOnly = true;
  birthInput.readOnly = true;
  phoneInput.readOnly = true;
  emailInput.readOnly = true;
  genderRadios.forEach(r => r.disabled = true);

  // Qiymatlarni yangilab saqlab qo‘yamiz
  originalValues = {
    name: nameInput.value,
    birthdate: birthInput.value,
    phone: phoneInput.value,
    email: emailInput.value,
    gender: document.querySelector("input[name='gender']:checked").value
  };

  alert("Profil saqlandi!");

  saveBtn.disabled = true;
  cancelBtn.disabled = true;
  editBtn.disabled = false;
};

cancelBtn.onclick = () => {
  nameInput.value = originalValues.name;
  birthInput.value = originalValues.birthdate;
  phoneInput.value = originalValues.phone;
  emailInput.value = originalValues.email;

  genderRadios.forEach(r => {
    r.checked = r.value === originalValues.gender;
  });

  nameInput.readOnly = true;
  birthInput.readOnly = true;
  phoneInput.readOnly = true;
  emailInput.readOnly = true;
  genderRadios.forEach(r => r.disabled = true);

  saveBtn.disabled = true;
  cancelBtn.disabled = true;
  editBtn.disabled = false;
};

document.getElementById("payBtn").onclick = () => {
  const card = document.getElementById("cardNumber").value;
  const holder = document.getElementById("cardHolder").value;
  const expiry = document.getElementById("expiry").value;
  const cvv = document.getElementById("cvv").value;

  if (!card || !holder || !expiry || !cvv) {
    alert("Iltimos, barcha maydonlarni to‘ldiring!");
    return;
  }

  alert("To‘lov muvaffaqiyatli amalga oshirildi!");

};