document.addEventListener("DOMContentLoaded", async () => {
  // Check if user is logged in
  const token = checkAuth();
  if (!token) return;

  try {
    // Fetch user data
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData) {
      // Update profile information
      document.getElementById(
        "user-name"
      ).textContent = `${userData.name.firstname} ${userData.name.lastname}`;
      document.getElementById("user-email").textContent = userData.email;

      // Fill profile form
      document.getElementById("profile-firstname").value =
        userData.name.firstname;
      document.getElementById("profile-lastname").value =
        userData.name.lastname;
      document.getElementById("profile-email").value = userData.email;
      document.getElementById("profile-phone").value = userData.phone;

      // Fill address form
      document.getElementById("address-street").value = userData.address.street;
      document.getElementById("address-number").value = userData.address.number;
      document.getElementById("address-city").value = userData.address.city;
      document.getElementById("address-zipcode").value =
        userData.address.zipcode;
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }

  // Handle logout button click
  const logoutButton = document.querySelector('button[onclick="logout()"]');
  if (logoutButton) {
    logoutButton.addEventListener("click", (e) => {
      e.preventDefault();
      Swal.fire({
        title: "Apakah Anda yakin?",
        text: "Anda akan keluar dari akun Anda",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ya, Keluar!",
        cancelButtonText: "Batal",
      }).then((result) => {
        if (result.isConfirmed) {
          // Clear all stored data
          localStorage.removeItem("userToken");
          localStorage.removeItem("userData");

          Swal.fire({
            title: "Berhasil Keluar!",
            text: "Anda telah keluar dari akun",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          }).then(() => {
            window.location.href = "../index.html";
          });
        }
      });
    });
  }
});

// Handle profile form submission
document
  .getElementById("profile-form")
  ?.addEventListener("submit", async (e) => {
    e.preventDefault();
    // Implement profile update logic here
    Swal.fire({
      icon: "success",
      title: "Profil Diperbarui",
      text: "Perubahan profil Anda telah disimpan",
      timer: 1500,
      showConfirmButton: false,
    });
  });

// Handle address form submission
document
  .getElementById("address-form")
  ?.addEventListener("submit", async (e) => {
    e.preventDefault();
    // Implement address update logic here
    Swal.fire({
      icon: "success",
      title: "Alamat Diperbarui",
      text: "Perubahan alamat Anda telah disimpan",
      timer: 1500,
      showConfirmButton: false,
    });
  });
