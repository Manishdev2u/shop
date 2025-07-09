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
    // Firebase Config
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
    const db = firebase.firestore();

    // --- SETUP HEADER & NAVIGATION ---
    // This part ensures the header works correctly on this page
    setupHeaderAndNav(auth);
    
    // --- AUTH GUARD & PAGE LOGIC ---
    // This part checks if the user is logged in before showing the page
    auth.onAuthStateChanged(user => {
        // This function will automatically update the header UI
        updateLoginUI(user); 
        
        if (user) {
            // User is logged in, so load their account data
            loadAccountData(user, db);
        } else {
            // No user is logged in, redirect them to the login page
            window.location.href = 'login.html';
        }
    });
});


// =================================================================
//  SHARED FUNCTIONS (For Header Consistency)
// =================================================================

// FIND THIS FUNCTION IN account.js...
/*
function setupHeaderAndNav(auth) {
    const themeToggle = document.getElementById('theme-toggle');
    // ... old theme logic ...
}
*/

// ...AND REPLACE IT WITH THIS NEW VERSION:
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

    // --- Enhanced Theme Logic ---
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme); // Set the initial icon

    themeToggle?.addEventListener('click', () => {
        const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme); // Update icon on click
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

function updateLoginUI(user) {
    const isLoggedIn = !!user;
    const authButtonsDesktop = document.getElementById('auth-buttons');
    const accountLinkDesktop = document.getElementById('account-link');
    const authLinksMobile = document.getElementById('mobile-auth-links');
    const accountWrapperMobile = document.getElementById('mobile-account-link-wrapper');

    if (authButtonsDesktop) authButtonsDesktop.style.display = isLoggedIn ? 'none' : 'flex';
    if (accountLinkDesktop) accountLinkDesktop.style.display = isLoggedIn ? 'flex' : 'none';
    
    if (authLinksMobile) authLinksMobile.style.display = isLoggedIn ? 'none' : 'block';
    if (accountWrapperMobile) accountWrapperMobile.style.display = isLoggedIn ? 'block' : 'none';
}


// =================================================================
//  ACCOUNT PAGE SPECIFIC FUNCTIONS
// =================================================================

function loadAccountData(user, db) {
    const pageLoader = document.getElementById('page-loader');
    const accountContent = document.getElementById('account-content');
    const userNameEl = document.getElementById('user-name');
    const userEmailEl = document.getElementById('user-email');
    const userAvatarImg = document.getElementById('user-avatar-img');

    // Populate UI with user data
    userNameEl.textContent = user.displayName || 'Welcome, User';
    userEmailEl.textContent = user.email;
    if (user.photoURL) {
        userAvatarImg.src = user.photoURL;
    } else {
        userAvatarImg.src = `https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`;
    }
    
    // Show the main content
    pageLoader.style.display = 'none';
    accountContent.style.display = 'grid';

    // Handle logout from the sidebar button on the account page
    const sidebarLogoutBtn = document.querySelector('#sidebar-logout-btn');
    sidebarLogoutBtn?.addEventListener('click', () => firebase.auth().signOut());
    
    // (Your other account page logic, like fetching downloads, goes here)
}