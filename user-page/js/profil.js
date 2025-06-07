const editBtn2 = document.getElementById('editBtn2');
const saveBtn = document.getElementById('saveBtn');
const cancelBtn = document.getElementById('cancelBtn');
const inputs = document.querySelectorAll('input, select');

const originalValues = {};

editBtn2?.addEventListener('click', () => {
  inputs.forEach(input => {
    originalValues[input.id] = input.value;
    input.disabled = false;
  });
  saveBtn.disabled = false;
  cancelBtn.disabled = false;
});

cancelBtn?.addEventListener('click', () => {
  inputs.forEach(input => {
    input.value = originalValues[input.id];
    input.disabled = true;
  });
  saveBtn.disabled = true;
  cancelBtn.disabled = true;
});

document.getElementById('profile-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  inputs.forEach(input => input.disabled = true);
  saveBtn.disabled = true;
  cancelBtn.disabled = true;
  alert("Profile information saved successfully!");
});


const input = document.getElementById("profileImageInput");
const image = document.getElementById("profileImage");

const defaultImageSrc = "default-profile.png"; 

input?.addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function () {
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  } else {
    image.src = defaultImageSrc; 
  }
});