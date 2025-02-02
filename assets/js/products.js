let currentProducts = [];
let currentPage = 1;
const productsPerPage = 12;

// Fetch and display products
async function fetchProducts(filters = {}) {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    let products = await response.json();

    // Apply filters
    if (filters.category) {
      products = products.filter((p) => p.category === filters.category);
    }
    if (filters.minPrice) {
      products = products.filter((p) => p.price >= filters.minPrice);
    }
    if (filters.maxPrice) {
      products = products.filter((p) => p.price <= filters.maxPrice);
    }
    if (filters.rating) {
      products = products.filter((p) => p.rating.rate >= filters.rating);
    }

    // Apply sorting
    const sortSelect = document.getElementById("sort-select");
    switch (sortSelect.value) {
      case "price-low":
        products.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        products.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        products.sort((a, b) => b.rating.rate - a.rating.rate);
        break;
    }

    currentProducts = products;
    displayProducts();
    setupPagination();
    updateProductCount();
  } catch (error) {
    console.error("Error:", error);
  }
}

// Display products in grid
function displayProducts() {
  const container = document.getElementById("products-container");
  container.innerHTML = "";

  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const paginatedProducts = currentProducts.slice(startIndex, endIndex);

  paginatedProducts.forEach((product) => {
    const productHTML = `
            <div class="col-md-4 col-lg-3">
                <div class="card h-100">
                    <img src="${product.image}" class="card-img-top p-3" alt="${
      product.title
    }" 
                         style="height: 200px; object-fit: contain;">
                    <div class="card-body">
                        <h5 class="card-title">${product.title}</h5>
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="text-primary fw-bold">
                                Rp ${(product.price * 15000).toLocaleString(
                                  "id-ID"
                                )}
                            </span>
                            <div class="text-warning">
                                ${generateStarRating(product.rating.rate)}
                            </div>
                        </div>
                        <p class="card-text small">${product.description.substring(
                          0,
                          100
                        )}...</p>
                        <div class="d-grid gap-2">
                            <a href="detail.html?id=${
                              product.id
                            }" class="btn btn-outline-primary">
                                Detail
                            </a>
                            <button class="btn btn-success" onclick="addToCart(${
                              product.id
                            })">
                                Tambah ke Keranjang
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    container.innerHTML += productHTML;
  });
}

// Generate star rating
function generateStarRating(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  let stars = "";

  for (let i = 0; i < fullStars; i++) {
    stars += '<i class="bi bi-star-fill"></i> ';
  }
  if (hasHalfStar) {
    stars += '<i class="bi bi-star-half"></i> ';
  }
  const emptyStars = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    stars += '<i class="bi bi-star"></i> ';
  }

  return stars + `<small class="ms-1">(${rating})</small>`;
}

// Setup pagination
function setupPagination() {
  const totalPages = Math.ceil(currentProducts.length / productsPerPage);
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  // Previous button
  pagination.innerHTML += `
        <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
            <button class="page-link" onclick="changePage(${currentPage - 1})">
                Previous
            </button>
        </li>
    `;

  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    pagination.innerHTML += `
            <li class="page-item ${currentPage === i ? "active" : ""}">
                <button class="page-link" onclick="changePage(${i})">${i}</button>
            </li>
        `;
  }

  // Next button
  pagination.innerHTML += `
        <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
            <button class="page-link" onclick="changePage(${currentPage + 1})">
                Next
            </button>
        </li>
    `;
}

// Change page
function changePage(page) {
  if (page < 1 || page > Math.ceil(currentProducts.length / productsPerPage))
    return;
  currentPage = page;
  displayProducts();
  setupPagination();
}

// Update product count
function updateProductCount() {
  const countElement = document.getElementById("product-count");
  countElement.textContent = currentProducts.length;
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  fetchProducts();

  // Sort change handler
  document.getElementById("sort-select").addEventListener("change", () => {
    fetchProducts();
  });

  // Apply filters button handler
  document.getElementById("apply-filters").addEventListener("click", () => {
    const filters = {
      minPrice: document.getElementById("price-min").value,
      maxPrice: document.getElementById("price-max").value,
      rating: document.querySelector('input[name="rating"]:checked')?.value,
    };
    fetchProducts(filters);
  });

  // View toggle handlers
  document.getElementById("grid-view").addEventListener("click", () => {
    document.getElementById("products-container").classList.remove("list-view");
  });

  document.getElementById("list-view").addEventListener("click", () => {
    document.getElementById("products-container").classList.add("list-view");
  });
});
