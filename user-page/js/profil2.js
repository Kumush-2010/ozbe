// Ensure that the script only runs after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Get the required elements
  const editBtn = document.getElementById('editBtn');
  const saveBtn = document.getElementById('saveBtn');
  const cancelBtn = document.getElementById('cancelBtn');
  const inputs = document.querySelectorAll('input, select');
  const profileForm = document.getElementById('profile-form');
  const inputImage = document.getElementById('profileImageInput');
  const profileImage = document.getElementById('profileImage');
  
  // Default profile image if none is selected
  const defaultImageSrc = "default-profile.png"; 

  // Store original input values to revert changes
  const originalValues = {};

  // Edit button click - Enable inputs and show save/cancel buttons
  editBtn?.addEventListener('click', () => {
    inputs.forEach(input => {
      originalValues[input.id] = input.value;
      input.disabled = false;
    });
    saveBtn.disabled = false;
    cancelBtn.disabled = false;
  });

  // Cancel button click - Revert to original values and disable inputs
  cancelBtn?.addEventListener('click', () => {
    inputs.forEach(input => {
      input.value = originalValues[input.id];
      input.disabled = true;
    });
    saveBtn.disabled = true;
    cancelBtn.disabled = true;
  });

  // Form submission - Disable inputs and show success message
  profileForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    inputs.forEach(input => input.disabled = true);
    saveBtn.disabled = true;
    cancelBtn.disabled = true;
    alert("Profile information saved successfully!");
  });

  // Image change event - Update profile image preview
  inputImage?.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function () {
        profileImage.src = reader.result;
      };
      reader.readAsDataURL(file);
    } else {
      profileImage.src = defaultImageSrc; 
    }
  });
});
