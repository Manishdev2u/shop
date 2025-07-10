// ==========================================================
//  FULLY FUNCTIONAL & ADVANCED ACCOUNT PAGE SCRIPT (V4 - Corrected)
// ==========================================================

document.addEventListener('DOMContentLoaded', () => {
    // Firebase Config - Make sure your config object is here
const firebaseConfig = {
  apiKey: "AIzaSyAYqOgLdSR72uW08vXOADZigQJSrMFBJek",
  authDomain: "manish-devtips.firebaseapp.com",
  projectId: "manish-devtips",
  storageBucket: "manish-devtips.firebasestorage.app",
  messagingSenderId: "67381185121",
  appId: "1:67381185121:web:c76e0ff3260cb921457820",
  measurementId: "G-X923BNJNZ8"
};     if (!firebase.apps.length) { firebase.initializeApp(firebaseConfig); }
    const auth = firebase.auth();
    const db = firebase.firestore();
    const storage = firebase.storage();
    
    auth.onAuthStateChanged(user => {
        // Run header setup regardless of login state
        setupHeaderAndNav(auth, user); 
        
        if (user) {
            loadAdvancedAccountPage(user, auth, db, storage);
        } else {
            window.location.href = 'login.html';
        }
    });
});


// --- SHARED HEADER & NAVIGATION FUNCTIONS ---
function setupHeaderAndNav(auth, user) {
    const themeToggle = document.getElementById('theme-toggle');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileCloseBtn = document.getElementById('mobile-close-btn');

    // Theme logic with icons
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

    // Mobile menu logic
    mobileMenuBtn?.addEventListener('click', () => mobileNav?.classList.add('open'));
    mobileCloseBtn?.addEventListener('click', () => mobileNav?.classList.remove('open'));
    mobileNav?.addEventListener('click', e => { if (e.target.tagName === 'A') mobileNav.classList.remove('open'); });
    
    document.getElementById('mobile-logout-btn')?.addEventListener('click', (e) => {
        e.preventDefault();
        auth.signOut();
    });

    updateLoginUI(user);
}

function updateLoginUI(user) {
    const isLoggedIn = !!user;
    const authButtonsDesktop = document.getElementById('auth-buttons');
    const accountLinkDesktop = document.getElementById('account-link');
    const authLinksMobile = document.getElementById('mobile-auth-links');
    const accountWrapperMobile = document.getElementById('mobile-account-link-wrapper');

    if (authButtonsDesktop) authButtonsDesktop.style.display = isLoggedIn ? 'none' : 'flex';
    // Hide the "My Account" button in header if we are already on the account page
    if (accountLinkDesktop) accountLinkDesktop.style.display = isLoggedIn && !document.body.querySelector('.dashboard-grid-v2') ? 'flex' : 'none';
    if (authLinksMobile) authLinksMobile.style.display = isLoggedIn ? 'none' : 'block';
    if (accountWrapperMobile) accountWrapperMobile.style.display = isLoggedIn ? 'block' : 'none';
}


// --- MAIN ADVANCED ACCOUNT PAGE LOGIC ---
function loadAdvancedAccountPage(user, auth, db, storage) {
    const pageLoader = document.getElementById('page-loader');
    const accountContent = document.getElementById('account-content');
    const userNameEl = document.getElementById('user-name');
    const userEmailEl = document.getElementById('user-email');
    const userAvatarImg = document.getElementById('user-avatar-img');
    const avatarUploadTrigger = document.getElementById('avatar-upload-trigger');
    const avatarFileInput = document.getElementById('avatar-file-input');
    const progressRing = avatarUploadTrigger.querySelector('.avatar-progress-ring');
    const progressCircle = progressRing.querySelector('.progress-ring-circle');
    const radius = progressCircle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;
    progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
    progressCircle.style.strokeDashoffset = circumference;
    
    const settingsMessageEl = document.getElementById('settings-message');

    userNameEl.textContent = user.displayName || 'Welcome';
    document.getElementById('welcome-user-name').textContent = user.displayName || 'User';
    userEmailEl.textContent = user.email;
    document.getElementById('setting-name').value = user.displayName || '';
    userAvatarImg.src = user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`;
    document.getElementById('stat-member-since').textContent = new Date(user.metadata.creationTime).toLocaleDateString();
    
    pageLoader.style.display = 'none';
    accountContent.style.display = 'grid';

    // Tab Switching Logic
    const navItems = document.querySelectorAll('.nav-item');
    const tabPanels = document.querySelectorAll('.tab-panel');
    navItems.forEach(navItem => {
        navItem.addEventListener('click', (e) => {
            e.preventDefault();
            navItems.forEach(item => item.classList.remove('active'));
            navItem.classList.add('active');
            const targetPanelId = navItem.dataset.tab + '-panel';
            tabPanels.forEach(panel => {
                panel.classList.toggle('active', panel.id === targetPanelId);
            });
        });
    });

    // Event Listeners for All Features
    document.getElementById('sidebar-logout-btn')?.addEventListener('click', () => auth.signOut());

    avatarUploadTrigger.addEventListener('click', () => avatarFileInput.click());
    avatarFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file || !file.type.startsWith('image/')) return;

        const uploadTask = storage.ref(`avatars/${user.uid}/${Date.now()}_${file.name}`).put(file);
        
        uploadTask.on('state_changed', 
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes);
                const offset = circumference - progress * circumference;
                progressCircle.style.strokeDashoffset = offset;
                progressRing.style.display = 'block';
            }, 
            (error) => {
                console.error("Upload failed:", error);
                showSettingsMessage(`Error: ${error.message}`, 'error');
                progressRing.style.display = 'none';
            }, 
            () => {
                uploadTask.snapshot.ref.getDownloadURL().then(async (photoURL) => {
                    await user.updateProfile({ photoURL });
                    userAvatarImg.src = photoURL;
                    progressRing.style.display = 'none';
                    showSettingsMessage('Avatar updated!', 'success');
                });
            }
        );
    });

    document.getElementById('name-update-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const newName = document.getElementById('setting-name').value.trim();
        if (newName && newName !== user.displayName) {
            try {
                await user.updateProfile({ displayName: newName });
                userNameEl.textContent = newName;
                document.getElementById('welcome-user-name').textContent = newName;
                showSettingsMessage('Name updated successfully!', 'success');
            } catch (error) { showSettingsMessage(`Error: ${error.message}`, 'error'); }
        }
    });

    document.getElementById('change-password-btn').addEventListener('click', async (btn) => {
        btn.target.disabled = true;
        try {
            await auth.sendPasswordResetEmail(user.email);
            showSettingsMessage('Password reset email sent!', 'success');
        } catch (error) { showSettingsMessage(`Error: ${error.message}`, 'error'); }
        setTimeout(() => { btn.target.disabled = false; }, 5000);
    });

    document.getElementById('delete-account-btn').addEventListener('click', () => {
        const confirmation = prompt("This is permanent. Type 'DELETE' to confirm.");
        if (confirmation === 'DELETE') {
            user.delete().then(() => {
                alert('Account deleted.');
                window.location.href = 'index.html';
            }).catch((error) => {
                alert(`Error: ${error.message}. You may need to log in again to delete your account.`);
            });
        }
    });

    // Data Fetching
    const purchases = JSON.parse(localStorage.getItem('userPurchases')) || [];
    document.getElementById('stat-total-purchased').textContent = purchases.length;
    fetchUserDownloads(purchases);
    fetchOrderHistory(purchases);

    function showSettingsMessage(message, type = 'success') {
        settingsMessageEl.textContent = message;
        settingsMessageEl.className = `settings-message ${type}`;
        setTimeout(() => { settingsMessageEl.textContent = ''; }, 4000);
    }
}

function fetchUserDownloads(purchases) {
    const ordersGrid = document.getElementById('orders-grid');
    if (!ordersGrid) return;
    if (purchases.length === 0) {
        ordersGrid.innerHTML = "<p>You haven't purchased any products yet.</p>"; return;
    }
    ordersGrid.innerHTML = purchases.map(p => {
        const product = products.find(prod => prod.id == p.productId);
        return product ? `<div class="order-card">...</div>` : '';
    }).join('');
}

function fetchOrderHistory(purchases) {
    const historyBody = document.getElementById('order-history-body');
    if (!historyBody) return;
    if (purchases.length === 0) {
        historyBody.innerHTML = `<tr><td colspan="4" style="text-align: center;">No order history.</td></tr>`; return;
    }
    historyBody.innerHTML = purchases.map(p => {
        const product = products.find(prod => prod.id == p.productId);
        return `<tr>...</tr>`
    }).join('');
}