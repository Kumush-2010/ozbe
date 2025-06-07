
const searchInput = document.querySelector('.search-search input');
const tableRows = document.querySelectorAll('table tbody tr');

searchInput.addEventListener('input', function() {
    const searchTerm = searchInput.value.toLowerCase();

    tableRows.forEach(row => {
        const nameCellEl = row.querySelector('.user-name');
        const kodCellEl = row.querySelector('.author-kod');

        const nameCell = nameCellEl ? nameCellEl.textContent.toLowerCase() : '';
        const kodCell = kodCellEl ? kodCellEl.textContent.toLowerCase() : '';

        if (nameCell.includes(searchTerm) || kodCell.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
});


  // "Select All" checkboxni boshqarish
//   const selectAllCheckbox = document.getElementById('selectAll');
//   const individualCheckboxes = document.querySelectorAll('.checkbox');

//   selectAllCheckbox.addEventListener('change', function() {
//       individualCheckboxes.forEach(checkbox => {
//           checkbox.checked = selectAllCheckbox.checked;
//       });
//   });

  // Har bir delete tugmasi uchun tasdiqlash va o'chirish
  // function confirmDelete(button) {
  //     const confirmation = confirm("Are you sure you want to delete this item?");
      
  //     if (confirmation) {
  //         const row = button.closest('tr'); // Eng yaqin tr elementini topib o'chiradi
  //         row.remove();
  //     }
  // }

  // Delete tugmasini dinamik tarzda qo'shish
  // document.querySelectorAll('.btn-delete').forEach(button => {
  //     button.addEventListener('click', function() {
  //         confirmDelete(button);
  //     });
  // });

  
// //   Edit
// const modalOverlay = document.getElementById("modalOverlay");
// const closeBtn = document.getElementById("closeBtn");
// const saveBtn = document.getElementById("saveBtn");

// const inputName = document.getElementById("inputName");
// const inputEmail = document.getElementById("inputEmail");
// const inputPhone = document.getElementById("inputPhone");
// const inputRole = document.getElementById("inputRole");
// const inputLogin = document.getElementById("inputLogin");

// // Edit button click handler
// function editUser(button) {
//   const row = button.closest("tr");
//   const name = row.querySelector(".author-name").textContent.trim();
//   const email = row.querySelector(".author-email").textContent.trim();
//   const phone = row.querySelector(".phone") ? row.querySelector(".phone").value : row.cells[3].textContent.trim();
//   const role = row.querySelector(".status").textContent.trim();
//   const login = row.querySelector(".last-login") ? row.querySelector(".last-login").value : row.cells[5].textContent.trim();

//   inputName.value = name;
//   inputEmail.value = email;
//   inputPhone.value = phone;
//   inputRole.value = role;
//   inputLogin.value = login;

//   modalOverlay.style.display = "block";
// }

// // Close modal
// closeBtn.onclick = () => {
//   modalOverlay.style.display = "none";
// };

// // Save changes (You can replace this with real saving logic)
// saveBtn.onclick = () => {
//   alert("Ma'lumotlar saqlandi (yoki serverga jo‘natiladi)");
//   modalOverlay.style.display = "none";
// };

// // Outside click to close
// window.onclick = (e) => {
// if (e.target == modalOverlay) {
//   modalOverlay.style.display = "none";
// }

// };