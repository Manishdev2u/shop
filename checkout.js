// ==========================================================
//  FINAL & CORRECTED - js/checkout.js
//  (This version fixes the missing price display logic)
// ==========================================================

document.addEventListener('DOMContentLoaded', () => {
    // --- Firebase Initialization ---
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
    
    // --- Get Product Info & DOM Elements ---
    const productId = new URLSearchParams(window.location.search).get('id');
    const product = products.find(p => p.id == productId);

    const pageLoader = document.getElementById('page-loader');
    const checkoutContent = document.getElementById('checkout-content');
    const checkoutItemContainer = document.getElementById('checkout-item-container');
    const payButton = document.getElementById('proceed-to-checkout-btn');
    const subtotalPriceEl = document.getElementById('subtotal-price');
    const discountRow = document.getElementById('discount-row');
    const discountAmountEl = document.getElementById('discount-amount');
    const totalPriceEl = document.getElementById('total-price');
    const couponInput = document.getElementById('coupon-input');
    const applyCouponBtn = document.getElementById('apply-coupon-btn');
    const couponMessageEl = document.getElementById('coupon-message');
    
    const nameInput = document.getElementById('full-name');
    const emailInput = document.getElementById('email');

    // --- Auth Guard & Auto-fill ---
    auth.onAuthStateChanged(user => {
        if (user) {
            nameInput.value = user.displayName || 'Please add a name in your account';
            emailInput.value = user.email;
        } else {
            const redirectUrl = window.location.href;
            window.location.href = `login.html?redirect=${encodeURIComponent(redirectUrl)}`;
        }
    });

    let currentPrice = product?.price || 0;
    let appliedCoupon = null;

    if (!product) {
        pageLoader.style.display = 'none';
        checkoutContent.innerHTML = '<h2>Product not found.</h2>';
        checkoutContent.style.display = 'block';
        return;
    }

    // --- Initial Render ---
    function renderCheckout() {
        checkoutItemContainer.innerHTML = `
            <div class="checkout-item-card">
                <img src="${product.image}" alt="${product.name}" class="checkout-item-image">
                <div class="checkout-item-details">
                    <h3>${product.name}</h3>
                    <p class="item-subtitle">Digital Product</p>
                    <p class="item-price">₹${product.price.toLocaleString('en-IN')}</p>
                </div>
            </div>`;
        updatePriceSummary(); // This call displays the initial prices
        pageLoader.style.display = 'none';
        checkoutContent.style.display = 'grid';
    }

    // ==========================================================
    //  THIS IS THE CRITICAL FUNCTION THAT WAS MISSING
    // ==========================================================
    function updatePriceSummary() {
        let discount = 0;
        if (appliedCoupon) {
            if (appliedCoupon.type === 'percent') {
                discount = (product.price * appliedCoupon.value) / 100;
            } else if (appliedCoupon.type === 'fixed') {
                discount = appliedCoupon.value;
            }
            discountRow.style.display = 'flex';
            discountAmountEl.textContent = `- ₹${discount.toLocaleString('en-IN')}`;
        } else {
            discountRow.style.display = 'none';
        }
        currentPrice = Math.max(0, product.price - discount);
        
        // Update the text content of the price elements
        subtotalPriceEl.textContent = `₹${product.price.toLocaleString('en-IN')}`;
        totalPriceEl.textContent = `₹${currentPrice.toLocaleString('en-IN')}`;
    }

    // ==========================================================
    //  THIS LOGIC WAS ALSO MISSING
    // ==========================================================
    applyCouponBtn.addEventListener('click', () => {
        const code = couponInput.value.trim().toUpperCase();
        const coupon = coupons.find(c => c.code === code);
        
        couponMessageEl.textContent = '';
        couponMessageEl.className = 'coupon-message';

        if (coupon) {
            appliedCoupon = coupon;
            couponMessageEl.textContent = `Success! "${coupon.code}" applied.`;
            couponMessageEl.classList.add('success');
        } else {
            appliedCoupon = null;
            couponMessageEl.textContent = 'Invalid coupon code.';
            couponMessageEl.classList.add('error');
        }
        // After checking the coupon, we must update the prices
        updatePriceSummary();
    });

    // --- Razorpay Payment Logic ---
    payButton.addEventListener('click', () => {
        const customerName = nameInput.value;
        const customerEmail = emailInput.value;

        if (!customerName || !customerEmail) {
            alert('Customer information is missing. Please log in again.');
            return;
        }

        const options = {
            "key": "YOUR_RAZORPAY_KEY_ID",
            "amount": Math.round(currentPrice * 100),
            "currency": "INR",
            "name": "Flow Digital",
            "description": `Purchase of ${product.name}`,
            "handler": function (response) {
                let userPurchases = JSON.parse(localStorage.getItem('userPurchases')) || [];
                userPurchases.push({
                    productId: product.id,
                    purchaseDate: new Date().toISOString(),
                    finalPrice: currentPrice,
                    couponUsed: appliedCoupon?.code || 'None'
                });
                localStorage.setItem('userPurchases', JSON.stringify(userPurchases));
                alert('Payment successful!');
                window.location.href = 'account.html';
            },
            "prefill": {
                "name": customerName,
                "email": customerEmail,
                "contact": document.getElementById('phone').value
            }
        };
        const rzp1 = new Razorpay(options);
        rzp1.open();
    });

    // Start the process
    renderCheckout();
});

// ==========================================================
//  FINAL & CORRECTED - js/checkout.js
//  (This version handles ₹0 products correctly)
// ==========================================================

document.addEventListener('DOMContentLoaded', () => {
    // --- Get Product Info & DOM Elements ---
    const productId = new URLSearchParams(window.location.search).get('id');
    const product = products.find(p => p.id == productId);

    const pageLoader = document.getElementById('page-loader');
    const checkoutContent = document.getElementById('checkout-content');
    const orderItemContainer = document.getElementById('order-item-container');
    const payButton = document.getElementById('proceed-to-checkout-btn');
    
    // --- (Your other element selectors for coupons, etc. can remain here) ---

    if (!product) {
        // ... (handle product not found)
        return;
    }

    // --- Initial Render (No changes needed here) ---
    function renderCheckout() {
        // ... (your existing renderCheckout function)
    }

    // --- "Pay Now" / "Get for Free" Button Logic ---
    payButton.addEventListener('click', () => {
        
        // ====================================================
        //  THIS IS THE NEW, SMART LOGIC
        // ====================================================
        if (product.price === 0) {
            // --- HANDLE FREE PRODUCT ---
            
            // 1. Show immediate feedback
            alert('Success! Your free product has been added to your account.');
            
            // 2. Automatically save the purchase to localStorage
            let userPurchases = JSON.parse(localStorage.getItem('userPurchases')) || [];
            userPurchases.push({
                productId: product.id,
                purchaseDate: new Date().toISOString(),
                finalPrice: 0,
                couponUsed: 'N/A'
            });
            localStorage.setItem('userPurchases', JSON.stringify(userPurchases));

            // 3. Redirect directly to the account page
            window.location.href = 'account.html';

        } else {
            // --- HANDLE PAID PRODUCT (The existing Razorpay logic) ---
            const customerName = document.getElementById('full-name').value;
            const customerEmail = document.getElementById('email').value;

            if (!customerName || !customerEmail) {
                alert('Please fill in your name and email address.');
                return;
            }

            const options = {
                "key": "YOUR_RAZORPAY_KEY_ID",
                "amount": Math.round(product.price * 100), // Use the actual product price
                "currency": "INR",
                "name": "Flow Digital",
                "description": `Purchase of ${product.name}`,
                "handler": function (response) {
                    let userPurchases = JSON.parse(localStorage.getItem('userPurchases')) || [];
                    userPurchases.push({
                        productId: product.id,
                        purchaseDate: new Date().toISOString(),
                        finalPrice: product.price,
                        couponUsed: 'None' // You can add your coupon logic back here if needed
                    });
                    localStorage.setItem('userPurchases', JSON.stringify(userPurchases));
                    alert('Payment successful!');
                    window.location.href = 'account.html';
                },
                "prefill": {
                    "name": customerName,
                    "email": customerEmail,
                    "contact": document.getElementById('phone').value
                }
            };
            const rzp1 = new Razorpay(options);
            rzp1.open();
        }
    });

    renderCheckout();
});

// --- Your other functions like updatePriceSummary can remain if you still need coupons ---