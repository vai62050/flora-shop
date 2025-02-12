// Sample product data
const products = [
    // Plants
    {
        id: 1,
        name: "Peace Lily",
        price: 29.99,
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1593691509543-c55fb32e7355?auto=format&fit=crop&w=500",
        category: "plants",
        isPrebook: false
    },
    {
        id: 2,
        name: "Snake Plant",
        price: 24.99,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1572686972126-7b50a2012ab3?auto=format&fit=crop&w=500",
        category: "plants",
        isPrebook: false
    },
    // Accessories
    {
        id: 3,
        name: "Ceramic Plant Pot",
        price: 19.99,
        rating: 4.3,
        image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=500",
        category: "accessories",
        isPrebook: false
    },
    {
        id: 4,
        name: "Watering Can",
        price: 15.99,
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1602479185069-cf2cfc4c463f?auto=format&fit=crop&w=500",
        category: "accessories",
        isPrebook: false
    },
    // Decorations
    {
        id: 5,
        name: "Hanging Planter",
        price: 34.99,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1602079882360-689c8722c988?auto=format&fit=crop&w=500",
        category: "decorations",
        isPrebook: false
    },
    {
        id: 6,
        name: "Plant Stand",
        price: 45.99,
        rating: 4.4,
        image: "https://images.unsplash.com/photo-1597072689227-8882273e8f6a?auto=format&fit=crop&w=500",
        category: "decorations",
        isPrebook: false
    },
    // Prebook Items
    {
        id: 7,
        name: "Rare Monstera Deliciosa",
        price: 149.99,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1614594075929-b3113b08fa8f?auto=format&fit=crop&w=500",
        category: "plants",
        isPrebook: true
    },
    {
        id: 8,
        name: "Limited Edition Plant Stand",
        price: 89.99,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1597072689342-701767543442?auto=format&fit=crop&w=500",
        category: "decorations",
        isPrebook: true
    }
];

// Cart state
let cart = [];
let filteredProducts = [...products];

// DOM Elements
const cartBtn = document.getElementById('cartBtn');
const cartContainer = document.getElementById('cartContainer');
const closeCart = document.getElementById('closeCart');
const overlay = document.getElementById('overlay');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const productsGrid = document.getElementById('productsGrid');
const prebookGrid = document.getElementById('prebookGrid');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const categorySelect = document.getElementById('categorySelect');

// Event Listeners
cartBtn.addEventListener('click', toggleCart);
closeCart.addEventListener('click', toggleCart);
overlay.addEventListener('click', toggleCart);
searchInput.addEventListener('input', handleSearch);
sortSelect.addEventListener('change', handleSort);
categorySelect.addEventListener('change', handleCategory);

// Initialize the page
initializePage();

// Functions
function initializePage() {
    renderProducts();
    updateCartCount();
}

function renderProducts() {
    // Clear existing products
    productsGrid.innerHTML = '';
    prebookGrid.innerHTML = '';
    const noResults = document.getElementById('noResults');

    if (filteredProducts.length === 0) {
        // Show no results message
        noResults.style.display = 'block';
        // Hide prebook section if no results
        document.querySelector('.prebook-section').style.display = 'none';
    } else {
        // Hide no results message
        noResults.style.display = 'none';
        // Show prebook section
        document.querySelector('.prebook-section').style.display = 'block';

        // Filter and render products
        filteredProducts.forEach(product => {
            const productCard = createProductCard(product);
            if (product.isPrebook) {
                prebookGrid.appendChild(productCard);
            } else {
                productsGrid.appendChild(productCard);
            }
        });
    }
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card fadeIn';
    
    const prebookLabel = product.isPrebook ? '<span class="prebook-label">Pre-order</span>' : '';
    
    card.innerHTML = `
        ${prebookLabel}
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <div class="product-rating">
                ${createStarRating(product.rating)}
            </div>
            <div class="product-category">${product.category}</div>
            <div class="product-price">$${product.price.toFixed(2)}</div>
            <button class="add-to-cart" onclick="addToCart(${product.id})">
                ${product.isPrebook ? 'Pre-order Now' : 'Add to Cart'}
            </button>
        </div>
    `;
    
    return card;
}

function createStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

function toggleCart() {
    cartContainer.classList.toggle('active');
    overlay.classList.toggle('active');
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCart();
    updateCartCount();
    
    // Show cart after adding item
    if (!cartContainer.classList.contains('active')) {
        toggleCart();
    }
}

function updateCart() {
    cartItems.innerHTML = '';
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item fadeIn';
        
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p>$${item.price.toFixed(2)}</p>
                <div class="quantity-controls">
                    <button onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    updateCartTotal();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCart();
            updateCartCount();
        }
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    updateCartCount();
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelector('.cart-count').textContent = count;
}

function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `$${total.toFixed(2)}`;
}

function handleSearch() {
    applyFilters();
}

function handleSort() {
    const sortValue = sortSelect.value;
    
    switch (sortValue) {
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'name':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
    }
    
    renderProducts();
}

function handleCategory() {
    applyFilters();
}

function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    const categoryValue = categorySelect.value;
    
    filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm);
        const matchesCategory = categoryValue === 'all' || product.category === categoryValue;
        return matchesSearch && matchesCategory;
    });
    
    handleSort(); // Apply any existing sort
}
