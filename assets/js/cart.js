// Inisialisasi keranjang dari localStorage atau array kosong
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Format data cart yang benar
const cartExample = [
  {
    id: 1,
    name: "Nama Produk",
    price: 100000,
    quantity: 1,
    image: "path/to/image.jpg",
  },
];

// Fungsi untuk menambahkan produk ke keranjang
function addToCart(productId, productName, productPrice, productImage) {
  console.log("Adding to cart:", {
    productId,
    productName,
    productPrice,
    productImage,
  });

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Cek apakah produk sudah ada di keranjang
  const existingProduct = cart.find((item) => item.id === productId);

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({
      id: productId,
      name: productName,
      price: productPrice,
      image: productImage,
      quantity: 1,
    });
  }

  // Simpan ke localStorage
  localStorage.setItem("cart", JSON.stringify(cart));

  // Update tampilan cart count
  updateCartCount();

  // Panggil updateCartDisplay setelah menambah item
  updateCartDisplay();
  updateCartPreview();

  // Tampilkan toast alih-alih alert
  showToast();
}

function removeFromCart(productId) {
  // Konversi productId ke number karena dari dataset selalu string
  productId = parseInt(productId);

  // Ambil data cart terbaru
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Filter item yang akan dihapus
  cart = cart.filter((item) => item.id !== productId);

  // Simpan kembali ke localStorage
  localStorage.setItem("cart", JSON.stringify(cart));

  // Update tampilan
  updateCartDisplay();
  updateCartPreview();

  // Tampilkan toast untuk konfirmasi
  showRemoveToast();
}

function updateQuantity(productId, newQuantity) {
  const item = cart.find((item) => item.id === productId);
  if (item) {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      item.quantity = newQuantity;
      updateCart(cart);
      updateCartDisplay();
    }
  }
}

function updateCart(cart) {
  // Debug: log setiap update cart
  console.log("Updating cart:", cart);

  try {
    localStorage.setItem("cart", JSON.stringify(cart));
    console.log("Cart berhasil disimpan");
  } catch (error) {
    console.error("Error menyimpan cart:", error);
  }
}

function updateCartDisplay() {
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const cartCountElements = document.querySelectorAll(".cart-count");
  cartCountElements.forEach((element) => {
    element.textContent = totalItems;
  });

  // Update cart dropdown
  const cartDropdown = document.getElementById("cartDropdown");
  if (cartDropdown) {
    cartDropdown.innerHTML = cartItems.length
      ? cartItems
          .map(
            (item) => `
            <div class="cart-item d-flex align-items-center p-2">
                <img src="${item.image}" alt="${
              item.name
            }" class="cart-item-image me-2">
                <div class="cart-item-details flex-grow-1">
                    <h6 class="mb-0">${item.name}</h6>
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="quantity-controls">
                            <button onclick="updateQuantity(${item.id}, ${
              item.quantity - 1
            })" class="btn btn-sm btn-outline-secondary">-</button>
                            <span class="mx-2">${item.quantity}</span>
                            <button onclick="updateQuantity(${item.id}, ${
              item.quantity + 1
            })" class="btn btn-sm btn-outline-secondary">+</button>
                        </div>
                        <div class="price">Rp ${(
                          item.price * item.quantity
                        ).toLocaleString()}</div>
                    </div>
                </div>
                <button onclick="removeFromCart(${
                  item.id
                })" class="btn btn-sm btn-danger ms-2">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `
          )
          .join("")
      : '<p class="text-center p-3">Keranjang belanja kosong</p>';

    // Tambahkan total dan tombol checkout jika ada item
    if (cartItems.length) {
      const total = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      cartDropdown.innerHTML += `
                <div class="cart-footer p-3 border-top">
                    <div class="d-flex justify-content-between mb-2">
                        <strong>Total:</strong>
                        <strong>Rp ${total.toLocaleString()}</strong>
                    </div>
                    <button onclick="checkout()" class="btn btn-primary w-100">Checkout</button>
                </div>
            `;
    }
  }
}

// Update jumlah item di icon keranjang
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  // Update badge di navbar
  const cartBadge = document.getElementById("cartCount");
  if (cartBadge) {
    cartBadge.textContent = totalItems;
    cartBadge.style.display = totalItems > 0 ? "block" : "none";
  }
}

// Tampilkan notifikasi
function showNotification(message) {
  const notification = document.createElement("div");
  notification.className = "toast-notification";
  notification.textContent = message;

  document.body.appendChild(notification);

  // Hilangkan notifikasi setelah 3 detik
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

function checkout() {
  // Implementasi checkout bisa ditambahkan di sini
  alert("Fitur checkout akan segera hadir!");
}

function showToast() {
  const toastElement = document.getElementById("cartToast");
  if (toastElement) {
    const toast = new bootstrap.Toast(toastElement, {
      animation: true,
      autohide: true,
      delay: 2000,
    });
    toast.show();
  }
}

function formatPrice(price) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

function updateCartPreview() {
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  const cartPreviewElement = document.querySelector(".cart-items-preview");
  const cartTotalElement = document.querySelector(".cart-total");

  if (cartPreviewElement) {
    if (cartItems.length === 0) {
      cartPreviewElement.innerHTML =
        '<p class="text-center text-muted my-3">Keranjang belanja kosong</p>';
      cartTotalElement.textContent = formatPrice(0);
      return;
    }

    let total = 0;
    cartPreviewElement.innerHTML = cartItems
      .map((item) => {
        total += item.price * item.quantity;
        return `
        <div class="cart-item-preview">
          <img src="${item.image}" alt="${item.name}">
          <div class="flex-grow-1">
            <h6 class="mb-0">${item.name}</h6>
            <small class="text-muted">${item.quantity}x ${formatPrice(
          item.price
        )}</small>
          </div>
          <button type="button" onclick="removeFromCart(${item.id})" class="btn btn-sm btn-outline-danger remove-item" data-id="${item.id}">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      `;
      })
      .join("");

    cartTotalElement.textContent = formatPrice(total);
  }
}

function showRemoveToast() {
  const toastElement = document.getElementById("cartToast");
  if (toastElement) {
    // Ubah konten dan warna toast
    toastElement.querySelector(".toast-body").innerHTML = `
      <i class="bi bi-check-circle me-2"></i>
      Produk berhasil dihapus dari keranjang
    `;
    toastElement.classList.remove("bg-success");
    toastElement.classList.add("bg-danger");

    const toast = new bootstrap.Toast(toastElement, {
      animation: true,
      autohide: true,
      delay: 2000,
    });
    toast.show();

    // Kembalikan warna toast ke semula setelah hilang
    toastElement.addEventListener("hidden.bs.toast", () => {
      toastElement.classList.remove("bg-danger");
      toastElement.classList.add("bg-success");
      toastElement.querySelector(".toast-body").innerHTML = `
        <i class="bi bi-check-circle me-2"></i>
        Produk berhasil ditambahkan ke keranjang!
      `;
    });
  }
}

// Panggil updateCartDisplay saat halaman dimuat
document.addEventListener("DOMContentLoaded", () => {
  updateCartDisplay();
  updateCartPreview();

  // Handle remove item from preview
  document.addEventListener("click", (e) => {
    const removeButton = e.target.closest(".remove-item");
    if (removeButton) {
      e.preventDefault(); // Mencegah event bubble
      e.stopPropagation();
      const productId = removeButton.dataset.id;
      removeFromCart(productId);

      // Pastikan dropdown tetap terbuka
      const dropdown = new bootstrap.Dropdown(
        document.querySelector('.cart-icon .nav-link')
      );
      dropdown.show();
    }
  });

  // Mencegah dropdown tertutup saat klik di dalamnya
  const dropdownCart = document.querySelector('.cart-icon .dropdown-menu');
  if (dropdownCart) {
    dropdownCart.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }
});

// Tambahkan CSS untuk memastikan dropdown tetap di posisinya
document.head.insertAdjacentHTML(
  "beforeend",
  `
  <style>
    .dropdown-menu.show {
      display: block !important;
    }
  </style>
`
);
