
  function getCookie(name) {
    const nameReg = new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    );
    const match = document.cookie.match(nameReg);
    return match ? decodeURIComponent(match[1]) : "";
  }

  document.addEventListener("DOMContentLoaded", function () {
    const userId = getCookie("userId");
    if (!userId) {
      alert("⚠️ userId cookie’da topilmadi. Login qildingizmi?");
      return;
    }

    // Elementlar
    const nameInput = document.getElementById("name");
    const birthInput = document.getElementById("birth");
    const genderInputs = document.querySelectorAll("input[name='gender']");
    const phoneInput = document.getElementById("phone");
    const emailInput = document.getElementById("email");
    const fileInput = document.getElementById("profileImageInput");
    const imagePreview = document.getElementById("profileImage");

    const editBtn = document.getElementById("editBtn2");
    const saveBtn = document.getElementById("saveBtn");
    const cancelBtn = document.getElementById("cancelBtn");

    let originalData = {
      name: nameInput.value.trim(),
      birth: birthInput.value.trim(),
      gender: [...genderInputs].find(r => r.checked)?.value || "",
      phone: phoneInput.value.trim(),
      email: emailInput.value.trim()
    };

    // Yangilash bosilganda
    editBtn.addEventListener("click", () => {
      nameInput.disabled = false;
      birthInput.disabled = false;
      genderInputs.forEach(r => r.disabled = false);
      phoneInput.disabled = false;
      emailInput.disabled = false;
      fileInput.disabled = false;

      editBtn.disabled = true;
      saveBtn.disabled = false;
      cancelBtn.disabled = false;
    });

    // Bekor qilish
    cancelBtn.addEventListener("click", () => {
      nameInput.value = originalData.name;
      birthInput.value = originalData.birth;
      genderInputs.forEach(r => {
        r.checked = r.value === originalData.gender;
        r.disabled = true;
      });
      phoneInput.value = originalData.phone;
      emailInput.value = originalData.email;
      fileInput.value = "";

      nameInput.disabled = true;
      birthInput.disabled = true;
      phoneInput.disabled = true;
      emailInput.disabled = true;
      fileInput.disabled = true;

      editBtn.disabled = false;
      saveBtn.disabled = true;
      cancelBtn.disabled = true;

      location.reload();
    });

    // Fayl preview
    fileInput.addEventListener("change", function (e) {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function (event) {
        imagePreview.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });

    // Saqlash bosilganda
    saveBtn.addEventListener("click", async function () {
      if (!userId) {
        alert("⚠️ userId cookie’da topilmadi. Login qildingizmi?");
        return;
      }

      const formData = new FormData();
      if (fileInput.files.length > 0) {
        formData.append("image", fileInput.files[0]);
      }

      formData.append("name", nameInput.value.trim());
      formData.append("birth", birthInput.value.trim());
      formData.append("gender", [...genderInputs].find(r => r.checked)?.value || "");
      formData.append("phone", phoneInput.value.trim());
      formData.append("email", emailInput.value.trim());

      try {
        const res = await fetch(`/profil/${userId}`, {
          method: "POST",
          body: formData
        });

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(errText);
        }

        const data = await res.json();
        alert("✅ Profil muvaffaqiyatli yangilandi!");

        // Disable inputs
        nameInput.disabled = true;
        birthInput.disabled = true;
        genderInputs.forEach(r => r.disabled = true);
        phoneInput.disabled = true;
        emailInput.disabled = true;
        fileInput.disabled = true;

        editBtn.disabled = false;
        saveBtn.disabled = true;
        cancelBtn.disabled = true;

        // Rasm yangilash
        if (data.image) {
          imagePreview.src = data.image;
        }

        fileInput.value = "";

        originalData = {
          name: data.name || nameInput.value.trim(),
          birth: data.birth || birthInput.value.trim(),
          gender: data.gender || [...genderInputs].find(r => r.checked)?.value || "",
          phone: data.phone || phoneInput.value.trim(),
          email: data.email || emailInput.value.trim()
        };

      } catch (err) {
        console.error("❌ Xatolik:", err);
        alert("Xatolik yuz berdi: " + err.message);
      }
    });
  });


document.getElementById('payBtn').addEventListener('click', async function () {
  const cardNumber = document.getElementById('cardNumber').value;
  const cardHolder = document.getElementById('cardHolder').value;
  const expiry = document.getElementById('expiry').value;
  const cvv = document.getElementById('cvv').value;

  // Cookie'dan userId ni olish
  const userId = getCookie('userId'); // cookie nomi `userId` bo‘lishi kerak

  const paymentData = {
    userId: userId,
    cardNumber: cardNumber,
    cardHolder: cardHolder,
    expiry: expiry,
    cvv: cvv
  };

  try {
    const response = await fetch('/card', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paymentData)
    });

    const result = await response.json();

    if (response.ok) {
      alert('To‘lov muvaffaqiyatli amalga oshirildi!');
    } else {
      alert('Xatolik: ' + result.message);
    }
  } catch (error) {
    console.error('Xatolik:', error);
    alert('Serverga ulanishda muammo yuz berdi');
  }
});

fetch('/card')
  .then(response => response.json())
  .then(data => {
    console.log('Maʼlumotlar:', data);
    // Masalan, sahifaga chiqarish:
    document.getElementById('cardHolder').value = data.cardHolder;
  })
  .catch(error => {
    console.error('Xatolik:', error);
  });

