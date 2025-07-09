// --- SVG Icons for Theme Toggle ---
const sunIcon = `
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="22">
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
</svg>
`;

const moonIcon = `
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="22">
  <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
</svg>
`;

// --- Your existing addEventListener starts here ---
document.addEventListener('DOMContentLoaded', () => {
    // ... all of your other code ...
});


document.addEventListener('DOMContentLoaded', () => {
    // --- SHARED LOGIC (from script.js for consistency) ---
   const firebaseConfig = {
  apiKey: "AIzaSyAYqOgLdSR72uW08vXOADZigQJSrMFBJek",
  authDomain: "manish-devtips.firebaseapp.com",
  projectId: "manish-devtips",
  storageBucket: "manish-devtips.firebasestorage.app",
  messagingSenderId: "67381185121",
  appId: "1:67381185121:web:c76e0ff3260cb921457820",
  measurementId: "G-X923BNJNZ8"
};
    if (!firebase.apps.length) { firebase.initializeApp(firebaseConfig); }
    const auth = firebase.auth();

    const themeToggle = document.getElementById('theme-toggle');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileCloseBtn = document.getElementById('mobile-close-btn');

    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeToggle?.addEventListener('click', () => {
        const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    mobileMenuBtn?.addEventListener('click', () => mobileNav?.classList.add('open'));
    mobileCloseBtn?.addEventListener('click', () => mobileNav?.classList.remove('open'));
    document.getElementById('mobile-logout-btn')?.addEventListener('click', (e) => { e.preventDefault(); auth.signOut(); });
    auth.onAuthStateChanged(user => updateLoginUI(user));

    function updateLoginUI(user) {
        const loggedIn = !!user;
        document.getElementById('auth-buttons').style.display = loggedIn ? 'none' : 'flex';
        document.getElementById('account-link').style.display = loggedIn ? 'flex' : 'none';
        document.getElementById('mobile-auth-links').style.display = loggedIn ? 'none' : 'flex';
        document.getElementById('mobile-account-link-wrapper').style.display = loggedIn ? 'flex' : 'none';
    }


    // --- PRODUCTS PAGE SPECIFIC LOGIC ---
    const searchInput = document.getElementById('search-input');
    const minPriceInput = document.getElementById('min-price');
    const maxPriceInput = document.getElementById('max-price');
    const sortBySelect = document.getElementById('sort-by');
    const categoryFiltersContainer = document.querySelector('.category-filters');
    const productGrid = document.getElementById('product-grid');
    const noResultsMessage = document.getElementById('no-results-message');

    // 1. Get all unique categories
    const categories = ['all', ...new Set(products.map(p => p.badge_text).filter(Boolean))];
    
    // 2. Create category buttons
    categoryFiltersContainer.innerHTML = ''; // Clear existing
    categories.forEach(category => {
        const button = document.createElement('button');
        button.className = 'category-btn';
        button.dataset.category = category;
        button.textContent = category.charAt(0).toUpperCase() + category.slice(1); // Capitalize
        if (category === 'all') button.classList.add('active');
        categoryFiltersContainer.appendChild(button);
    });

    // 3. Add event listeners
    searchInput.addEventListener('input', applyFilters);
    minPriceInput.addEventListener('input', applyFilters);
    maxPriceInput.addEventListener('input', applyFilters);
    sortBySelect.addEventListener('change', applyFilters);
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelector('.category-btn.active')?.classList.remove('active');
            btn.classList.add('active');
            applyFilters();
        });
    });

    // 4. Initial render
    applyFilters();

    // --- MAIN FILTERING AND RENDERING LOGIC ---
    function applyFilters() {
        let filteredProducts = [...products];

        const searchTerm = searchInput.value.toLowerCase();
        if (searchTerm) {
            filteredProducts = filteredProducts.filter(p => p.name.toLowerCase().includes(searchTerm));
        }

        const activeCategory = document.querySelector('.category-btn.active').dataset.category;
        if (activeCategory !== 'all') {
            filteredProducts = filteredProducts.filter(p => p.badge_text === activeCategory);
        }

        const minPrice = parseFloat(minPriceInput.value) || 0;
        const maxPrice = parseFloat(maxPriceInput.value) || Infinity;
        filteredProducts = filteredProducts.filter(p => p.price >= minPrice && p.price <= maxPrice);

        const sortBy = sortBySelect.value;
        if (sortBy === 'price-asc') filteredProducts.sort((a, b) => a.price - b.price);
        else if (sortBy === 'price-desc') filteredProducts.sort((a, b) => b.price - a.price);
        else if (sortBy === 'name-asc') filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        
        renderFilteredProducts(filteredProducts);
    }

    function renderFilteredProducts(productsToRender) {
        productGrid.innerHTML = '';
        noResultsMessage.style.display = productsToRender.length === 0 ? 'block' : 'none';
        
        productsToRender.forEach((p, i) => {
            const productCard = document.createElement('a');
            productCard.href = `product.html?id=${p.id}`;
            productCard.className = 'product-card';
            productCard.style.animationDelay = `${i * 30}ms`;
            productCard.innerHTML = `
                <div class="product-card-glow"></div>
                <span class="product-badge">${p.badge_text || 'Featured'}</span>
                <div class="product-image-wrapper"><img src="${p.image}" alt="${p.name}" class="product-image"></div>
                <div class="product-info">
                    <h3 class="product-title">${p.name}</h3>
                    <div class="product-footer">
                        <span class="product-price">₹${p.price.toLocaleString('en-IN')}</span>
                        <div class="btn-buy-now">View</div>
                    </div>
                </div>
            `;
            productGrid.appendChild(productCard);
        });
    }
});


// FIND THIS SECTION IN products-page.js...
/*
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeToggle?.addEventListener('click', () => {
        const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
*/

// ...AND REPLACE IT WITH THIS NEW CODE BLOCK:
const themeToggle = document.getElementById('theme-toggle');

function updateThemeIcon(theme) {
    if (themeToggle) {
        themeToggle.innerHTML = theme === 'dark' ? sunIcon : moonIcon;
    }
}

const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme); // Set the initial icon on page load

themeToggle?.addEventListener('click', () => {
    const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme); // Update the icon on click
});