document.addEventListener("DOMContentLoaded", function () {
  const order = JSON.parse(localStorage.getItem("currentOrder"));
  if (!order) {
    window.location.href = "../index.html";
    return;
  }

  // Tampilkan informasi order
  document.getElementById("orderNumber").textContent = order.orderNumber;
  document.getElementById("orderDate").textContent = new Date(
    order.orderDate
  ).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Tampilkan informasi pembayaran
  const paymentInfo = document.getElementById("paymentInfo");
  if (order.payment === "transfer") {
    paymentInfo.innerHTML = `
            <p class="mb-1">Transfer Bank</p>
            <p class="mb-1">Bank Central Asia (BCA)</p>
            <p class="mb-1">No. Rek: 1234567890</p>
            <p class="mb-0">a.n. Toko Kita</p>
        `;
  } else if (order.payment === "ewallet") {
    paymentInfo.innerHTML = `
            <p class="mb-1">E-Wallet</p>
            <p class="mb-0">Pembayaran melalui QRIS</p>
        `;
  } else {
    paymentInfo.innerHTML = `
            <p class="mb-0">Cash on Delivery</p>
        `;
  }

  // Tampilkan items
  const tbody = document.getElementById("invoiceItems");
  let subtotal = 0;

  order.items.forEach((item) => {
    const tr = document.createElement("tr");
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    tr.innerHTML = `
            <td>${item.name}</td>
            <td class="text-center">${item.quantity}</td>
            <td class="text-end">Rp ${item.price.toLocaleString("id-ID")}</td>
            <td class="text-end">Rp ${itemTotal.toLocaleString("id-ID")}</td>
        `;
    tbody.appendChild(tr);
  });

  // Update totals
  const shippingCost = order.shipping === "regular" ? 15000 : 30000;
  const total = subtotal + shippingCost;

  document.getElementById(
    "subtotal"
  ).textContent = `Rp ${subtotal.toLocaleString("id-ID")}`;
  document.getElementById(
    "shipping"
  ).textContent = `Rp ${shippingCost.toLocaleString("id-ID")}`;
  document.getElementById("total").textContent = `Rp ${total.toLocaleString(
    "id-ID"
  )}`;

  // Clear cart after successful payment
  localStorage.removeItem("cart");
});
