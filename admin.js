// In admin.js
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Firebase (use your central init file)
    const auth = firebase.auth();
    
    // Your Admin User ID from the Firebase Console
    const firebaseConfig = {
  apiKey: "AIzaSyAYqOgLdSR72uW08vXOADZigQJSrMFBJek",
  authDomain: "manish-devtips.firebaseapp.com",
  projectId: "manish-devtips",
  storageBucket: "manish-devtips.firebasestorage.app",
  messagingSenderId: "67381185121",
  appId: "1:67381185121:web:c76e0ff3260cb921457820",
  measurementId: "G-X923BNJNZ8"
};

    const adminContent = document.getElementById('admin-content');
    const accessDenied = document.getElementById('access-denied');

    auth.onAuthStateChanged(user => {
        if (user && user.uid === ADMIN_UID) {
            // User is you! Show the admin panel.
            adminContent.style.display = 'block';
            accessDenied.style.display = 'none';
        } else {
            // User is not you, or is not logged in. Deny access.
            adminContent.style.display = 'none';
            accessDenied.style.display = 'block';
        }
    });

    // ... a-dd the form submission logic from Step 3 here ...
});