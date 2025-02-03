document.addEventListener("DOMContentLoaded", function () {
  // Ambil data cart dari localStorage
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Render items
  const orderItems = document.getElementById("order-items");
  let subtotal = 0;

  cart.forEach((item) => {
    const itemElement = document.createElement("div");
    itemElement.className =
      "d-flex justify-content-between align-items-center mb-2";
    itemElement.innerHTML = `
            <div>
                <h6 class="mb-0">${item.name}</h6>
                <small class="text-muted">Qty: ${item.quantity}</small>
            </div>
            <span>Rp ${(item.price * item.quantity).toLocaleString(
              "id-ID"
            )}</span>
        `;
    orderItems.appendChild(itemElement);
    subtotal += item.price * item.quantity;
  });

  // Update totals
  document.getElementById(
    "subtotal"
  ).textContent = `Rp ${subtotal.toLocaleString("id-ID")}`;
  updateTotal();

  // Handle shipping method change
  document.querySelectorAll('input[name="shipping"]').forEach((radio) => {
    radio.addEventListener("change", updateTotal);
  });

  // Handle payment
  document.getElementById("payButton").addEventListener("click", handlePayment);

  // Tambahkan event listener untuk form submit
  const form = document.getElementById("checkoutForm");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    handlePayment(e);
  });

  // Tambahkan event listener untuk tombol bayar
  const payButton = document.getElementById("payButton");
  payButton.addEventListener("click", handlePayment);
});

function updateTotal() {
  const subtotal = parseInt(
    document
      .getElementById("subtotal")
      .textContent.replace("Rp ", "")
      .replace(".", "")
  );
  const shippingMethod = document.querySelector(
    'input[name="shipping"]:checked'
  ).value;
  const shippingCost = shippingMethod === "regular" ? 15000 : 30000;

  document.getElementById(
    "shipping-cost"
  ).textContent = `Rp ${shippingCost.toLocaleString("id-ID")}`;
  const total = subtotal + shippingCost;
  document.getElementById("total").textContent = `Rp ${total.toLocaleString(
    "id-ID"
  )}`;
}

function validateForm() {
  const form = document.getElementById("checkoutForm");
  const requiredFields = form.querySelectorAll("[required]");
  let isValid = true;

  requiredFields.forEach((field) => {
    if (!field.value.trim()) {
      field.classList.add("is-invalid");
      isValid = false;
    } else {
      field.classList.remove("is-invalid");
    }
  });

  // Validasi email
  const emailField = form.querySelector('input[type="email"]');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailField.value)) {
    emailField.classList.add("is-invalid");
    isValid = false;
  }

  // Validasi nomor telepon
  const phoneField = form.querySelector('input[type="tel"]');
  const phoneRegex = /^[0-9]{10,13}$/;
  if (!phoneRegex.test(phoneField.value)) {
    phoneField.classList.add("is-invalid");
    isValid = false;
  }

  return isValid;
}

function handlePayment(e) {
  e.preventDefault();

  if (!validateForm()) {
    alert("Mohon lengkapi semua field yang diperlukan dengan benar");
    return;
  }

  const paymentMethod = document.querySelector(
    'input[name="payment"]:checked'
  ).value;
  const orderData = {
    items: JSON.parse(localStorage.getItem("cart")),
    shipping: document.querySelector('input[name="shipping"]:checked').value,
    payment: paymentMethod,
    total: document.getElementById("total").textContent,
    orderDate: new Date().toISOString(),
    orderNumber: generateOrderNumber(),
  };

  // Simpan order ke localStorage
  localStorage.setItem("currentOrder", JSON.stringify(orderData));

  // Redirect ke halaman invoice
  window.location.href = "../invoice/index.html";
}

function generateOrderNumber() {
  const date = new Date();
  const year = date.getFullYear().toString().substr(-2);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `INV/${year}${month}${day}/${random}`;
}
