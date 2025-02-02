async function loadAllCategories() {
    try {
        const response = await fetch('https://fakestoreapi.com/products/categories');
        const categories = await response.json();
        
        const categoriesContainer = document.querySelector('#all-categories');
        categoriesContainer.innerHTML = '';
        
        categories.forEach(category => {
            const categoryHTML = `
                <div class="col-md-6 col-lg-3">
                    <div class="card bg-dark text-white h-100">
                        <img src="https://source.unsplash.com/random/800x600/?${category}" 
                             class="card-img h-100" alt="${category}">
                        <div class="card-img-overlay d-flex align-items-end">
                            <div class="w-100 bg-dark bg-opacity-75 p-3">
                                <h5 class="card-title mb-0">${category.charAt(0).toUpperCase() + category.slice(1)}</h5>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            categoriesContainer.innerHTML += categoryHTML;
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

document.addEventListener('DOMContentLoaded', loadAllCategories); 