document.addEventListener('DOMContentLoaded', () => {
    // Firebase Config - Replace with your own if needed
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
    
    // ==========================================================
    //  NEW: AUTH GUARD - THIS IS THE ONLY CODE YOU NEED TO ADD
    // ==========================================================
    auth.onAuthStateChanged(user => {
        if (user) {
            // If a user is detected, they are already logged in.
            // Immediately redirect them away from the login page.
            console.log('User is already logged in. Redirecting to account page...');
            window.location.href = 'account.html';
        }
        // If there is no user, this block is skipped and the rest of the script runs,
        // allowing the login/signup form to be displayed.
    });
    // ==========================================================
    //  END OF NEW CODE
    // ==========================================================


    // --- The rest of your existing auth.js code remains the same ---
    const formTitle = document.getElementById('form-title');
    const formSubtitle = document.getElementById('form-subtitle');
    const nameGroup = document.getElementById('name-group');
    const confirmPassGroup = document.getElementById('confirm-password-group');
    const forgotPassLink = document.getElementById('forgot-password');
    const submitBtn = document.getElementById('submit-btn');
    const toggleLink = document.getElementById('toggle-auth-mode');
    const toggleText = document.getElementById('toggle-text');
    const googleBtn = document.getElementById('google-btn');
    const errorMessage = document.getElementById('error-message');
    const authForm = document.getElementById('auth-form');

    let isLoginMode = !new URLSearchParams(window.location.search).get('mode');
    if (window.location.search.includes('mode=signup')) {
        isLoginMode = false;
    }

    function updateUIForMode() {
        errorMessage.style.display = 'none';
        authForm.reset();
        if (isLoginMode) {
            formTitle.textContent = 'Welcome Back';
            formSubtitle.textContent = 'Sign in to continue to your account.';
            submitBtn.textContent = 'Login';
            nameGroup.style.display = 'none';
            confirmPassGroup.style.display = 'none';
            forgotPassLink.style.display = 'block';
            toggleText.textContent = "Don’t have an account?";
            toggleLink.textContent = 'Sign Up';
        } else {
            formTitle.textContent = 'Create Your Account';
            formSubtitle.textContent = 'Get started with a free account today.';
            submitBtn.textContent = 'Sign Up';
            nameGroup.style.display = 'block';
            confirmPassGroup.style.display = 'block';
            forgotPassLink.style.display = 'none';
            toggleText.textContent = 'Already have an account?';
            toggleLink.textContent = 'Login';
        }
    }
    updateUIForMode();

    toggleLink.addEventListener('click', (e) => {
        e.preventDefault();
        isLoginMode = !isLoginMode;
        updateUIForMode();
    });

    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = authForm.name.value;
        const email = authForm.email.value;
        const password = authForm.password.value;
        const confirmPassword = authForm['confirm-password'].value;
        errorMessage.style.display = 'none';

        try {
            if (isLoginMode) {
                await auth.signInWithEmailAndPassword(email, password);
            } else {
                if (password !== confirmPassword) {
                    showError("Passwords do not match.");
                    return;
                }
                const userCredential = await auth.createUserWithEmailAndPassword(email, password);
                if (userCredential.user) {
                    await userCredential.user.updateProfile({ displayName: name });
                }
            }
            window.location.href = 'account.html';
        } catch (error) {
            showError(getFriendlyErrorMessage(error.code));
        }
    });

    googleBtn.addEventListener('click', () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider)
            .then(() => { window.location.href = 'account.html'; })
            .catch(error => showError(getFriendlyErrorMessage(error.code)));
    });

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }

    function getFriendlyErrorMessage(errorCode) {
        switch (errorCode) {
            case 'auth/user-not-found':
            case 'auth/invalid-credential':
                return 'No account found with this email or password is incorrect.';
            case 'auth/wrong-password':
                return 'Incorrect password. Please try again.';
            case 'auth/email-already-in-use':
                return 'An account already exists with this email address.';
            case 'auth/weak-password':
                return 'Password should be at least 6 characters long.';
            default:
                return 'An unknown error occurred. Please try again.';
        }
    }
});