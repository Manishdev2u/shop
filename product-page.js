// js/product-page.js

// --- This function must be at the top level of the file ---
// It checks if a user is logged in before redirecting.
function handleBuyNowClick(productId) {
    const user = firebase.auth().currentUser;

    if (user) {
        // If user is logged in, go directly to checkout
        window.location.href = `checkout.html?id=${productId}`;
    } else {
        // If user is NOT logged in, redirect to login and pass the checkout URL as a parameter.
        const redirectUrl = `checkout.html?id=${productId}`;
        window.location.href = `login.html?redirect=${encodeURIComponent(redirectUrl)}`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // --- Firebase Initialization ---
    // Make sure your Firebase config object is filled in here.
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
    
    // --- Theme Toggle Logic (with icons) ---
    const themeToggle = document.getElementById('theme-toggle');
    const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="22"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>`;
    const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="22"><path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>`;
    
    function updateThemeIcon(theme) {
        if (themeToggle) { themeToggle.innerHTML = theme === 'dark' ? sunIcon : moonIcon; }
    }
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle?.addEventListener('click', () => {
        const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    // --- Render the Page Content ---
    const container = document.getElementById('product-detail-container');
    if (container) {
        renderProductPage(container);
    }
});

function renderProductPage(container) {
    const productId = new URLSearchParams(window.location.search).get('id');
    const product = products.find(p => p.id == productId);

    if (!product) {
        container.innerHTML = `<div class="section-header" style="padding: 4rem 0;"><h2 style="font-size: 2rem;">Product Not Found</h2><p><a href="index.html" style="color: var(--primary-color);">Go back to the store</a>.</p></div>`;
        return;
    }

    document.title = `${product.name} - Flow Digital`;
    
    const featuresHTML = product.features.map(f => `<li><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="20"><path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.052-.143z" clip-rule="evenodd" /></svg><span>${f}</span></li>`).join('');
    const screenshotsHTML = (product.screenshots && product.screenshots.length > 0) 
        ? product.screenshots.map(ss => `<img src="${ss}" alt="Screenshot" class="thumbnail-image">`).join('')
        : '';

    container.innerHTML = `
        <div class="product-page-aurora"></div>
        <div class="product-detail-layout">
            <div class="product-main-content">
                <div class="product-gallery" id="product-gallery"><div class="main-image-wrapper"><img src="${product.image}" alt="${product.name}" id="main-product-image"></div></div>
                ${screenshotsHTML ? `<div class="thumbnail-gallery">${screenshotsHTML}</div>` : ''}
                <div class="product-description-section"><h2 class="section-heading">Description</h2><p class="product-long-description">${product.long_description}</p></div>
                <div class="product-description-section"><h2 class="section-heading">What's Included</h2><ul class="features-list">${featuresHTML}</ul></div>
            </div>
            <div class="product-sidebar">
                <div class="product-buy-box">
                    <span class="badge">${product.badge_text || 'Featured'}</span>
                    <h1 class="product-page-title">${product.name}</h1>
                    <p class="product-page-desc">${product.short_description}</p>
                    <div class="product-page-price">₹${product.price.toLocaleString('en-IN')}</div>
                    <div class="purchase-actions">
                        <button id="desktop-buy-btn" class="btn btn-primary btn-buy-now">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="20"><path d="M10 2a.75.75 0 01.75.75v.518a3 3 0 00-1.5 0V2.75A.75.75 0 0110 2z"></path><path fill-rule="evenodd" d="M8.25 6.002a.75.75 0 01.75-.75h2a.75.75 0 01.75.75v.004a.75.75 0 01-.75.75h-2a.75.75 0 01-.75-.75v-.004zm-1.5 2.69a.75.75 0 01.75-.75h4.5a.75.75 0 01.75.75v.004a.75.75 0 01-.75.75h-4.5a.75.75 0 01-.75-.75v-.004z" clip-rule="evenodd"></path><path d="M4.5 2.25a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h11a.75.75 0 00.75-.75V3a.75.75 0 00-.75-.75h-11z"></path></svg>
                            <span>Buy Now</span>
                        </button>
                    </div>
                    <div class="product-meta">
                        <span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="16"><path d="M3.5 2.75a.75.75 0 00-1.5 0v14.5a.75.75 0 001.5 0v-4.392l1.657-.348a6.442 6.442 0 016.686 0l1.657.348V17.25a.75.75 0 001.5 0V2.75a.75.75 0 00-1.5 0v4.392l-1.657.348a6.442 6.442 0 01-6.686 0L3.5 7.142V2.75z"></path></svg>Instant Download</span>
                        <span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="16"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path></svg>Lifetime Updates</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    // --- Post-render Interactivity ---
    document.getElementById('desktop-buy-btn')?.addEventListener('click', () => {
        handleBuyNowClick(product.id);
    });

    const mainImage = document.getElementById('main-product-image');
    const thumbnails = document.querySelectorAll('.thumbnail-image');
    if (thumbnails.length > 0) {
        thumbnails[0].classList.add('active');
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', () => {
                if (thumb.classList.contains('active')) return;
                mainImage.style.opacity = 0; setTimeout(() => { mainImage.src = thumb.src; mainImage.style.opacity = 1; }, 150);
                document.querySelector('.thumbnail-image.active')?.classList.remove('active'); thumb.classList.add('active');
            });
        });
    }

    const gallery = document.getElementById('product-gallery');
    if (gallery && window.matchMedia('(min-width: 992px)').matches) {
        gallery.addEventListener('mousemove', (e) => { const rect = gallery.getBoundingClientRect(); const x = e.clientX - rect.left; const y = e.clientY - rect.top; const { width, height } = rect; const rotateX = (y / height - 0.5) * -15; const rotateY = (x / width - 0.5) * 15; gallery.querySelector('.main-image-wrapper').style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`; });
        gallery.addEventListener('mouseleave', () => { gallery.querySelector('.main-image-wrapper').style.transform = 'rotateX(0) rotateY(0) scale(1)'; });
    }

    renderMobilePurchaseBar(product);
}

function renderMobilePurchaseBar(product) {
    const mobileBar = document.getElementById('mobile-purchase-bar');
    if (!mobileBar) return;
    mobileBar.innerHTML = `
        <div class="mobile-bar-product-info">
            <img src="${product.image}" alt="${product.name}" class="mobile-bar-image">
            <div class="mobile-bar-text">
                <div class="mobile-bar-name">${product.name}</div>
                <div class="mobile-bar-price">₹${product.price.toLocaleString('en-IN')}</div>
            </div>
        </div>
        <button id="mobile-buy-btn" class="btn btn-primary btn-buy-now-mobile">Buy Now</button>
    `;
    document.getElementById('mobile-buy-btn')?.addEventListener('click', () => {
        handleBuyNowClick(product.id);
    });
}

// In js/products-page.js, inside the renderFilteredProducts function

productsToRender.forEach((p, i) => {
    // --- THIS IS THE SAME NEW LOGIC ---
    const productUrl = p.custom_url ? p.custom_url : `product.html?id=${p.id}`;

    const productCard = document.createElement('a');
    productCard.href = productUrl;
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