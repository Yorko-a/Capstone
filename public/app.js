// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  sendEmailVerification
 } from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  query, 
  where, 
  getDocs, 
  collection,
} from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js';

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
const auth = getAuth(app);
const db = getFirestore(app);


// Get reference to forms
const signupForm = document.getElementById('signup-form');
const loginForm = document.getElementById('login-form');

if (signupForm) {
  // Handle Sign-Up Form Submission
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent the form from refreshing the page

    // Get values from form inputs
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;
    const userName = document.getElementById("signup-username").value;

    try {
      // Check if the username already exists
      const usersRef = collection(db, "users");
      const usernameQuery = query(usersRef, where("username", "==", userName));
      const querySnapshot = await getDocs(usernameQuery);

      if (!querySnapshot.empty) {
        alert("Username already exists. Please choose a different username.");
        return;
      }

      // Create a new user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // send email address verification
      sendEmailVerification(user).then(() =>{
        console.log('Email sent to:', email)
        // if email sent
      }).catch((error) =>{
        console.error('Error email verification: ', error);
      })

      // Store the username in Firestore
      await setDoc(doc(db, "users", user.uid), {
        username: userName,
        email: email,
        // Additional user details can go here
      });

      console.log("User created and username stored:", user);
      alert("Account created successfully!");

      // Clear the form
      signupForm.reset();
      window.location.href = "/login.html"; // Redirect to login page
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error creating user:", errorCode, errorMessage);
      alert("Error: " + errorMessage);
    }
  });
}




if(loginForm){
  // Handle Log-In Form Submission
loginForm.addEventListener('submit', (e) => {

  e.preventDefault(); // Prevent the form from refreshing the page

  // Get values from form inputs
  const emailOrUsername = document.getElementById('login-emause').value;
  const password = document.getElementById('login-password').value;

  let emaoruse = emailOrUsername;

  if(!emaoruse.includes('@')){
    // Its a username
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('username', '==', emailOrUsername));
    
    getDocs(q).then(
      async(querySnapshot)=>{
        
        if(!querySnapshot.empty){
          // User found
          const userDoc = querySnapshot.docs[0]; // get user document
          emaoruse = userDoc.data().email; // use email on user document
          
          //Auth part using fetched email
          signInWithEmailAndPassword(auth, emaoruse, password).then(
            async(userCredential) => {
              const user = userCredential.user;
              
              //is email verified?
              if (user.emailVerified) {
                console.log("Email is verified");
                console.log('User logged in successfully:', user);
                alert('Logged in successfully!');
                // Redirect...
              } else {
                console.log("Email not verified");
                alert("Please verify your email before logging in.");
                auth.signOut(); // Sign the user out
              }
            }).catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              console.error('Error signing in:', errorCode, errorMessage);
              alert('Error: ' + errorMessage);
            });
        

        }else{
          console.log("No user found with that username");
          alert("Error: Username not found.");
        }
      }).catch((error) => {
        console.error("Error fetching username:", error);
        alert("Error fetching username: " + error.message);
      });
  }else {
    // It's an email, so directly try to sign in
    signInWithEmailAndPassword(auth, emaoruse, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        
        //is email verified?
        if (user.emailVerified) {
          console.log("Email is verified");
          console.log('User logged in successfully:', user);
          alert('Logged in successfully!');
        
        // Redirect to another page or dashboard
          // Redirect user to the application
        } else {
          console.log("Email not verified");
          alert("Please verify your email before logging in.");
          auth.signOut(); // Sign the user out
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Error signing in:', errorCode, errorMessage);
        alert('Error: ' + errorMessage);
      });
  }

  
  loginForm.reset();
});
}