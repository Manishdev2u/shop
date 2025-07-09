// =================================================================
//  MASTER SCRIPT.JS - CONTROLS THE ENTIRE WEBSITE
// =================================================================

// =================================================================
//  SVG ICONS & MASTER SCRIPT
// =================================================================

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

    // --- 1. FIREBASE INITIALIZATION (RUNS ON EVERY PAGE) ---
    const firebaseConfig = {
  apiKey: "AIzaSyAYqOgLdSR72uW08vXOADZigQJSrMFBJek",
  authDomain: "manish-devtips.firebaseapp.com",
  projectId: "manish-devtips",
  storageBucket: "manish-devtips.firebasestorage.app",
  messagingSenderId: "67381185121",
  appId: "1:67381185121:web:c76e0ff3260cb921457820",
  measurementId: "G-X923BNJNZ8"
};
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    const auth = firebase.auth();

    // --- 2. SETUP SHARED NAVIGATION AND UI LOGIC ---
    setupHeaderAndNav();
    
    // --- 3. AUTHENTICATION STATE HANDLER (THE IMPORTANT PART!) ---
    auth.onAuthStateChanged(user => {
        updateLoginUI(user);
    });

    // --- 4. HOMEPAGE-SPECIFIC LOGIC ---
    // This code only runs if it finds the ".hero" section, which is unique to the homepage.
    if (document.querySelector('.hero')) {
        renderHomepageContent();
    }
});


// =================================================================
//  SHARED FUNCTIONS (Used by all pages)
// =================================================================

/**
 * Sets up all event listeners for the header, mobile menu, and theme toggle.
 */
function setupHeaderAndNav(auth) {
    const themeToggle = document.getElementById('theme-toggle');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileCloseBtn = document.getElementById('mobile-close-btn');

    // --- NEW: Theme Icon Function ---
    function updateThemeIcon(theme) {
        if (themeToggle) {
            themeToggle.innerHTML = theme === 'dark' ? sunIcon : moonIcon;
        }
    }

    // --- Theme Logic ---
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme); // Set the initial icon on page load

    themeToggle?.addEventListener('click', () => {
        const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme); // Update the icon on click
    });

    // --- Mobile menu logic (no changes here) ---
    mobileMenuBtn?.addEventListener('click', () => mobileNav?.classList.add('open'));
    mobileCloseBtn?.addEventListener('click', () => mobileNav?.classList.remove('open'));
    mobileNav?.addEventListener('click', e => { if (e.target.tagName === 'A') mobileNav.classList.remove('open'); });
    
    document.getElementById('mobile-logout-btn')?.addEventListener('click', (e) => {
        e.preventDefault();
        auth.signOut();
    });
}

/**
 * Updates all header and navigation UI based on user's login status.
 * @param {object|null} user - The Firebase user object, or null if logged out.
 */
function updateLoginUI(user) {
    const isLoggedIn = !!user;

    // Desktop Header
    const authButtonsDesktop = document.getElementById('auth-buttons');
    const accountLinkDesktop = document.getElementById('account-link');

    // Mobile Side Nav
    const authLinksMobile = document.getElementById('mobile-auth-links');
    const accountWrapperMobile = document.getElementById('mobile-account-link-wrapper');

    if (authButtonsDesktop) authButtonsDesktop.style.display = isLoggedIn ? 'none' : 'flex';
    if (accountLinkDesktop) accountLinkDesktop.style.display = isLoggedIn ? 'flex' : 'none';
    
    if (authLinksMobile) authLinksMobile.style.display = isLoggedIn ? 'none' : 'block';
    if (accountWrapperMobile) accountWrapperMobile.style.display = isLoggedIn ? 'block' : 'none';
}


// =================================================================
//  HOMEPAGE-SPECIFIC FUNCTIONS
// =================================================================

/**
 * Renders all the dynamic content for the homepage.
 */
function renderHomepageContent() {
    const productGrid = document.getElementById('product-grid');
    if (!productGrid) return;

    // We'll show a limited number of products on the homepage (e.g., the first 6)
    const homepageProducts = products.slice(0, 6);
    
    productGrid.innerHTML = ''; // Clear existing content

    homepageProducts.forEach((p, i) => {
        // This reuses the beautiful card design from your products page
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