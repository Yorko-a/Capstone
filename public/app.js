// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD5s2Rkq1NwkXrs-Xjk9AVxP94bcWO6fe8",
  authDomain: "signuploginapp-e51b2.firebaseapp.com",
  projectId: "signuploginapp-e51b2",
  storageBucket: "signuploginapp-e51b2.firebasestorage.app",
  messagingSenderId: "578364808712",
  appId: "1:578364808712:web:45701c93a9302601c93bbd",
  measurementId: "G-ZXMYXSXB97"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase Authentication instance
const auth = getAuth(app);


// Get reference to forms
const signupForm = document.getElementById('signup-form');
const loginForm = document.getElementById('login-form');

// Handle Sign-Up Form Submission
signupForm.addEventListener('submit', (e) => {
  e.preventDefault(); // Prevent the form from refreshing the page

  // Get values from form inputs
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;

  // Create a new user with email and password
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in successfully
      const user = userCredential.user;
      console.log('User created:', user);
      alert('Account created successfully!');
    })
    .catch((error) => {
      // Handle errors
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error('Error creating user:', errorCode, errorMessage);
      alert('Error: ' + errorMessage);
    });
    signupForm.reset(); 
});



// Handle Log-In Form Submission
loginForm.addEventListener('submit', (e) => {
  e.preventDefault(); // Prevent the form from refreshing the page

  // Get values from form inputs
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  // Sign in the user with email and password
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in successfully
      const user = userCredential.user;
      console.log('User signed in:', user);
      alert('Logged in successfully!');
    })
    .catch((error) => {
      // Handle errors
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error('Error logging in user:', errorCode, errorMessage);
      alert('Error: ' + errorMessage);
    });
    loginForm.reset();
});