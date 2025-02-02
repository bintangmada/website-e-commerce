// Fetch Featured Products
async function fetchFeaturedProducts() {
  try {
    const response = await fetch("https://fakestoreapi.com/products?limit=3");
    const products = await response.json();

    const productsContainer = document.querySelector("#featured-products");

    products.forEach((product) => {
      const productHTML = `
                <div class="col-md-4">
                    <div class="card h-100 shadow-sm">
                        <img src="${
                          product.image
                        }" class="card-img-top p-3" alt="${
        product.title
      }" style="height: 300px; object-fit: contain;">
                        <div class="card-body">
                            <h5 class="card-title">${product.title}</h5>
                            <p class="card-text text-primary fw-bold">Rp ${(
                              product.price * 15000
                            ).toLocaleString("id-ID")}</p>
                            <button class="btn btn-success w-100">Tambah ke Keranjang</button>
                        </div>
                    </div>
                </div>
            `;
      productsContainer.innerHTML += productHTML;
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

// Fetch Categories
async function fetchCategories() {
  try {
    const response = await fetch(
      "https://fakestoreapi.com/products/categories"
    );
    const categories = await response.json();

    const categoriesContainer = document.querySelector("#categories-container");

    // Ambil 3 kategori pertama saja
    categories.slice(0, 3).forEach((category) => {
      const categoryHTML = `
                <div class="col-md-4">
                    <div class="card bg-dark text-white">
                        <img src="https://source.unsplash.com/random/800x600/?${category}" 
                             class="card-img" alt="${category}">
                        <div class="card-img-overlay d-flex align-items-end">
                            <h5 class="card-title mb-0">${
                              category.charAt(0).toUpperCase() +
                              category.slice(1)
                            }</h5>
                        </div>
                    </div>
                </div>
            `;
      categoriesContainer.innerHTML += categoryHTML;
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

// Fungsi untuk menampilkan welcome message
function showWelcomeMessage() {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const isNewLogin = localStorage.getItem("newLogin");

  if (isNewLogin && userData) {
    const welcomeMessage = document.getElementById("welcome-message");
    if (welcomeMessage) {
      welcomeMessage.innerHTML = `
                <div class="alert alert-success alert-dismissible fade show" role="alert">
                    <i class="bi bi-person-check me-2"></i>
                    Selamat datang, <strong>${userData.name.firstname} ${userData.name.lastname}</strong>!
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            `;

      // Hapus pesan setelah 5 detik
      setTimeout(() => {
        const alert = welcomeMessage.querySelector(".alert");
        if (alert) {
          alert.classList.remove("show");
          setTimeout(() => {
            welcomeMessage.innerHTML = "";
          }, 150); // waktu untuk fade out
        }
      }, 2000);

      // Hapus flag newLogin
      localStorage.removeItem("newLogin");
    }
  }
}

// Fungsi untuk menambahkan event listener logout
function addLogoutListener() {
  // Cari semua tombol logout (baik di dropdown maupun di tempat lain)
  const logoutButtons = document.querySelectorAll('[data-action="logout"]');

  logoutButtons.forEach((button) => {
    // Hapus event listener lama (jika ada) untuk menghindari duplikasi
    button.removeEventListener("click", handleLogout);
    // Tambahkan event listener baru
    button.addEventListener("click", handleLogout);
  });
}

// Update fungsi checkAuthStatus
function checkAuthStatus() {
  const token = localStorage.getItem("userToken");
  const userData = JSON.parse(localStorage.getItem("userData"));
  const loginButton = document.getElementById("login-button");
  const profileDropdown = document.getElementById("profile-dropdown");

  if (token && userData) {
    loginButton.classList.add("d-none");
    profileDropdown.classList.remove("d-none");

    const userName = document.getElementById("user-name");
    userName.textContent = `${userData.name.firstname} ${userData.name.lastname}`;

    // Tambahkan event listener untuk tombol logout
    addLogoutListener();

    // Tampilkan welcome message jika baru login
    showWelcomeMessage();
  } else {
    loginButton.classList.remove("d-none");
    profileDropdown.classList.add("d-none");
  }
}

// Add CSS for dropdown hover effect
const style = document.createElement("style");
style.textContent = `
    .dropdown-item:hover {
        background-color: #f8f9fa;
    }
    .dropdown-item:active {
        background-color: #e9ecef;
    }
    .dropdown-item i {
        width: 20px;
    }
`;
document.head.appendChild(style);

// Fungsi untuk memuat kategori
async function loadCategories() {
  try {
    const response = await fetch(
      "https://fakestoreapi.com/products/categories"
    );
    const categories = await response.json();

    const container = document.getElementById("categories-container");
    container.innerHTML = "";

    // Icon mapping untuk setiap kategori
    const categoryIcons = {
      electronics: "bi-laptop",
      jewelery: "bi-gem",
      "men's clothing": "bi-person",
      "women's clothing": "bi-person-dress",
    };

    // Warna background untuk setiap kategori
    const categoryColors = {
      electronics: "#007bff",
      jewelery: "#6f42c1",
      "men's clothing": "#28a745",
      "women's clothing": "#e83e8c",
    };

    categories.forEach((category) => {
      const icon = categoryIcons[category] || "bi-tag";
      const color = categoryColors[category] || "#6c757d";
      const formattedName =
        category.charAt(0).toUpperCase() + category.slice(1);

      const categoryHTML = `
                <div class="col-6 col-md-3">
                    <a href="products/index.html?category=${category}" class="text-decoration-none">
                        <div class="card h-100 border-0 shadow-sm category-card">
                            <div class="card-body text-center">
                                <div class="category-icon-wrapper mb-3" style="background-color: ${color}">
                                    <i class="bi ${icon} fs-3"></i>
                                </div>
                                <h5 class="card-title mb-0">${formattedName}</h5>
                            </div>
                        </div>
                    </a>
                </div>
            `;
      container.innerHTML += categoryHTML;
    });
  } catch (error) {
    console.error("Error loading categories:", error);
  }
}

// Tambahkan CSS untuk styling kategori
const categoryStyle = document.createElement("style");
categoryStyle.textContent = `
    .category-card {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        cursor: pointer;
    }
    
    .category-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important;
    }
    
    .category-icon-wrapper {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto;
        color: white;
    }
    
    .category-card .card-title {
        color: #333;
        font-size: 1.1rem;
    }
    
    @media (max-width: 768px) {
        .category-icon-wrapper {
            width: 60px;
            height: 60px;
        }
        
        .category-card .card-title {
            font-size: 0.9rem;
        }
    }
`;
document.head.appendChild(categoryStyle);

// Update CSS untuk styling testimoni card yang lebih kecil
const testimonialStyle = document.createElement("style");
testimonialStyle.textContent = `
    .testimonial-card {
        background: #fff;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        height: 100%;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .testimonial-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }

    .testimonial-img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid #fff;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .testimonial-text {
        font-size: 0.85rem;
        color: #6c757d;
        font-style: italic;
        margin: 0;
        line-height: 1.4;
    }

    .testimonial-card h6 {
        font-size: 0.9rem;
        color: #333;
    }

    .testimonial-card .bi {
        font-size: 0.8rem;
    }

    @media (max-width: 768px) {
        .testimonial-card {
            margin-bottom: 1rem;
        }
    }
`;
document.head.appendChild(testimonialStyle);

// Panggil fungsi saat halaman dimuat
document.addEventListener("DOMContentLoaded", () => {
  checkAuthStatus();
  fetchFeaturedProducts();
  fetchCategories();
  loadCategories();
});

// Tambahkan event listener untuk dropdown menu
document.addEventListener("DOMContentLoaded", () => {
  const dropdownMenu = document.querySelector(".dropdown-menu");
  if (dropdownMenu) {
    dropdownMenu.addEventListener("click", (e) => {
      const logoutButton = e.target.closest('[data-action="logout"]');
      if (logoutButton) {
        e.preventDefault();
        handleLogout();
      }
    });
  }

  // ... existing DOMContentLoaded code ...
});

// Fungsi logout dengan SweetAlert2
window.handleLogout = function () {
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
      // Hapus data user dari localStorage
      localStorage.removeItem("userToken");
      localStorage.removeItem("userData");
      localStorage.removeItem("newLogin");

      Swal.fire({
        title: "Berhasil Keluar!",
        text: "Anda telah keluar dari akun",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        window.location.reload();
      });
    }
  });
};
