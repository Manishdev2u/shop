// ==========================================================
//  FINAL & COMPLETE - auth.js
//  (Includes attractive "Forgot Password" form)
// ==========================================================

document.addEventListener('DOMContentLoaded', () => {
    // Firebase Config - Replace with your own
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
    
    // Auth Guard (Redirects logged-in users away)
    auth.onAuthStateChanged(user => {
        if (user) {
            const redirectUrl = new URLSearchParams(window.location.search).get('redirect');
            window.location.href = redirectUrl || 'account.html';
        }
    });

    // --- DOM Selectors ---
    const mainAuthContainer = document.getElementById('main-auth-container');
    const resetPasswordContainer = document.getElementById('reset-password-container');
    
    // Main Auth Form
    const authForm = document.getElementById('auth-form');
    const formTitle = document.getElementById('form-title');
    const formSubtitle = document.getElementById('form-subtitle');
    const nameGroup = document.getElementById('name-group');
    const confirmPassGroup = document.getElementById('confirm-password-group');
    const submitBtn = document.getElementById('submit-btn');
    const toggleLink = document.getElementById('toggle-auth-mode');
    const toggleText = document.getElementById('toggle-text');
    const googleBtn = document.getElementById('google-btn');
    const errorMessage = document.getElementById('error-message');
    const formOptions = document.querySelector('.form-options');
    
    // Reset Form
    const resetForm = document.getElementById('reset-form');
    const resetEmailInput = document.getElementById('reset-email');
    const resetSuccessMessage = document.getElementById('reset-success-message');
    
    // Links
    const forgotPasswordLink = document.getElementById('forgot-password');
    const backToLoginLink = document.getElementById('back-to-login-link');
    
    // --- UI State Management ---
    let isLoginMode = !window.location.search.includes('mode=signup');

    function showMainAuthForm() {
        mainAuthContainer.style.display = 'block';
        resetPasswordContainer.style.display = 'none';
        formSubtitle.style.display = 'block';
        updateUIForMode();
    }

    function showResetPasswordForm() {
        mainAuthContainer.style.display = 'none';
        resetPasswordContainer.style.display = 'block';
        formTitle.textContent = 'Reset Password';
        formSubtitle.style.display = 'none';
        errorMessage.style.display = 'none';
    }

    function updateUIForMode() {
        errorMessage.style.display = 'none';
        resetSuccessMessage.style.display = 'none';
        authForm.reset();
        
        if (isLoginMode) {
            formTitle.textContent = 'Login';
            formSubtitle.textContent = "Glad you're back!";
            submitBtn.textContent = 'Login';
            nameGroup.style.display = 'none';
            confirmPassGroup.style.display = 'none';
            formOptions.style.display = 'flex';
            toggleText.textContent = "Don't have an account?";
            toggleLink.textContent = 'Signup';
        } else {
            formTitle.textContent = 'Sign Up';
            formSubtitle.textContent = 'Create your account to get started.';
            submitBtn.textContent = 'Create Account';
            nameGroup.style.display = 'block';
            confirmPassGroup.style.display = 'block';
            formOptions.style.display = 'none'; // Hide "Remember me" and "Forgot" on signup
            toggleText.textContent = 'Already have an account?';
            toggleLink.textContent = 'Login';
        }
    }
    
    // --- Event Listeners ---
    toggleLink.addEventListener('click', (e) => { e.preventDefault(); isLoginMode = !isLoginMode; updateUIForMode(); });
    forgotPasswordLink.addEventListener('click', (e) => { e.preventDefault(); showResetPasswordForm(); });
    backToLoginLink.addEventListener('click', (e) => { e.preventDefault(); showMainAuthForm(); });

    // --- Firebase Logic ---
    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = authForm.name.value; const email = authForm.email.value; const password = authForm.password.value; const confirmPassword = authForm['confirm-password'].value;
        errorMessage.style.display = 'none';
        try {
            if (isLoginMode) { await auth.signInWithEmailAndPassword(email, password); } 
            else {
                if (password !== confirmPassword) { showError("Passwords do not match."); return; }
                const userCredential = await auth.createUserWithEmailAndPassword(email, password);
                if (userCredential.user) { await userCredential.user.updateProfile({ displayName: name }); }
            }
            const redirectUrl = new URLSearchParams(window.location.search).get('redirect') || 'account.html';
            window.location.href = redirectUrl;
        } catch (error) { showError(getFriendlyErrorMessage(error.code)); }
    });

    resetForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = resetEmailInput.value;
        if (email) {
            auth.sendPasswordResetEmail(email)
                .then(() => {
                    errorMessage.style.display = 'none';
                    resetSuccessMessage.textContent = `Password reset link sent to ${email}. Please check your inbox.`;
                    resetSuccessMessage.style.display = 'block';
                })
                .catch((error) => {
                    showError(getFriendlyErrorMessage(error.code));
                });
        }
    });

     googleBtn.addEventListener('click', () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider)
            .then(() => { window.location.href = getRedirectUrl(); })
            .catch(error => showError(getFriendlyErrorMessage(error.code)));
    });

    // --- Helper Functions ---
    function showError(message) {
        resetSuccessMessage.style.display = 'none';
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }
    function getFriendlyErrorMessage(errorCode) { /* ... your existing error message function ... */ }
    
    // Initial UI setup
    updateUIForMode();
});

