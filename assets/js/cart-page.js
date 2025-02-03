document.addEventListener("DOMContentLoaded", function () {
  displayCart();
});

function displayCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartContent = document.getElementById("cartContent");
  const emptyCart = document.getElementById("emptyCart");
  const cartSummary = document.getElementById("cartSummary");

  if (cart.length === 0) {
    cartContent.style.display = "none";
    emptyCart.style.display = "block";
    cartSummary.style.display = "none";
    return;
  }

  cartContent.style.display = "block";
  emptyCart.style.display = "none";
  cartSummary.style.display = "block";

  let cartHTML = `
        <div class="table-responsive">
            <table class="table align-middle">
                <thead>
                    <tr>
                        <th>Produk</th>
                        <th class="text-center">Jumlah</th>
                        <th class="text-end">Harga</th>
                        <th class="text-end">Total</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
    `;

  let subtotal = 0;

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    cartHTML += `
            <tr>
                <td>
                    <div class="d-flex align-items-center">
                        <img src="${item.image}" alt="${
      item.name
    }" style="width: 50px; height: 50px; object-fit: cover;" class="me-3">
                        <span>${item.name}</span>
                    </div>
                </td>
                <td class="text-center">
                    <div class="input-group input-group-sm" style="width: 120px; margin: 0 auto;">
                        <button class="btn btn-outline-secondary" onclick="updateQuantity(${
                          item.id
                        }, ${item.quantity - 1})">-</button>
                        <input type="text" class="form-control text-center" value="${
                          item.quantity
                        }" readonly>
                        <button class="btn btn-outline-secondary" onclick="updateQuantity(${
                          item.id
                        }, ${item.quantity + 1})">+</button>
                    </div>
                </td>
                <td class="text-end">Rp ${item.price.toLocaleString(
                  "id-ID"
                )}</td>
                <td class="text-end">Rp ${itemTotal.toLocaleString(
                  "id-ID"
                )}</td>
                <td class="text-end">
                    <button class="btn btn-sm btn-danger" onclick="removeItem(${
                      item.id
                    })">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
  });

  cartHTML += `
                </tbody>
            </table>
        </div>
    `;

  cartContent.innerHTML = cartHTML;
  document.getElementById(
    "subtotal"
  ).textContent = `Rp ${subtotal.toLocaleString("id-ID")}`;
}

function updateQuantity(productId, newQuantity) {
  if (newQuantity < 1) return;

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const productIndex = cart.findIndex((item) => item.id === productId);

  if (productIndex !== -1) {
    cart[productIndex].quantity = newQuantity;
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
    updateCartCount();
  }
}

function removeItem(productId) {
  if (!confirm("Apakah Anda yakin ingin menghapus produk ini?")) return;

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter((item) => item.id !== productId);
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
  updateCartCount();
}
