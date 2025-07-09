document.addEventListener('DOMContentLoaded', () => {
    // Shared logic for theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeToggle?.addEventListener('click', () => {
        const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // --- Product Page Specific Logic ---
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
    
    const featuresHTML = product.features.map(f => `<li><svg width="20" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M..."></path></svg><span>${f}</span></li>`).join('');
    const screenshotsHTML = (product.screenshots && product.screenshots.length > 0) 
        ? product.screenshots.map(ss => `<img src="${ss}" alt="Screenshot" class="thumbnail-image">`).join('')
        : '';

    container.innerHTML = `
        <div class="product-page-aurora"></div>
        <div class="product-detail-layout">
            <div class="product-main-content">
                <div class="product-gallery" id="product-gallery">
                    <div class="main-image-wrapper">
                        <img src="${product.image}" alt="${product.name}" id="main-product-image">
                    </div>
                </div>
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
                    <button class="btn btn-primary buy-now-pulse">Buy Now</button>
                    <div class="product-meta"><span><svg width="16" fill="currentColor" viewBox="0 0 20 20"><path d="..."></path></svg>Instant Download</span><span><svg width="16" fill="currentColor" viewBox="0 0 20 20"><path d="..."></path></svg>Lifetime Updates</span></div>
                </div>
            </div>
        </div>
    `;

    // --- Post-render Interactivity ---
    const mainImage = document.getElementById('main-product-image');
    const thumbnails = document.querySelectorAll('.thumbnail-image');
    
    // Thumbnail click logic
    if (thumbnails.length > 0) {
        thumbnails[0].classList.add('active');
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', () => {
                if (thumb.classList.contains('active')) return;
                mainImage.style.opacity = 0;
                setTimeout(() => { mainImage.src = thumb.src; mainImage.style.opacity = 1; }, 150);
                document.querySelector('.thumbnail-image.active')?.classList.remove('active');
                thumb.classList.add('active');
            });
        });
    }

    // 3D Tilt Effect for Desktop
    const gallery = document.getElementById('product-gallery');
    if (gallery && window.matchMedia('(min-width: 992px)').matches) {
        gallery.addEventListener('mousemove', (e) => {
            const rect = gallery.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const { width, height } = rect;
            const rotateX = (y / height - 0.5) * -15; // Invert for natural feel
            const rotateY = (x / width - 0.5) * 15;
            gallery.querySelector('.main-image-wrapper').style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });
        gallery.addEventListener('mouseleave', () => {
            gallery.querySelector('.main-image-wrapper').style.transform = 'rotateX(0) rotateY(0) scale(1)';
        });
    }
}