import React, { useEffect } from 'react';
import '../Styles/SignUp.css';
import { SignUp } from '@clerk/clerk-react';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, addDoc, collection} from 'firebase/firestore';
import { useSignUp } from '@clerk/clerk-react';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB0bdQZHH22KbmUcXr46xu7Y6m1q1MqGR0",
  authDomain: "cricdata-bdf21.firebaseapp.com",
  projectId: "cricdata-bdf21",
  storageBucket: "cricdata-bdf21.firebasestorage.app",
  messagingSenderId: "191750755116",
  appId: "1:191750755116:web:3ab4b85ec674c45c11d289",
  measurementId: "G-ZH35DGLGDK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function SignUpPage() {
  const { isLoaded, signUp } = useSignUp();

  const handleAfterSignUp = async (user) => {
    if (!user) {
      console.error("No user object provided to handleAfterSignUp");
      return;
    }
  
    console.log("User object received:", user);
  
    const { emailAddresses = [], firstName = "", lastName = "", publicMetadata = {} } = user;
  
    const userData = {
      email: emailAddresses[0]?.emailAddress || "No email provided",
      name: `${firstName} ${lastName}`.trim() || "No name provided",
      age: publicMetadata.age || "Age not provided",
    };
  
    try {
      console.log("Attempting to save user to Firestore:", userData);
      await setDoc(doc(db, 'users', user.id), userData);
      console.log('User successfully saved to Firestore:', userData);
    } catch (error) {
      console.error('Error saving user data to Firestore:', error);
    }
  };
  
   useEffect(() => {
    console.log("Firebase initialized:", app.name);
    // const testFirestore = async () => {
    //   try {
    //     const docRef = await addDoc(collection(db, "testCollection"), {
    //       testField: "testValue",
    //       timestamp: new Date(),
    //     });
    //     console.log("Test document written with ID:", docRef.id);
    //   } catch (e) {
    //     console.error("Error writing to Firestore:", e.message);
    //   }
    // };
    
    // Call this function when the component loads
    // testFirestore();
    // const testUser = {
    //   id: "testUserId",
    //   emailAddresses: [{ emailAddress: "testuser@example.com" }],
    //   firstName: "Test",
    //   lastName: "User",
    //   publicMetadata: { age: 25 },
    // };
  
    // handleAfterSignUp(testUser);
  })

  return (
    <div className="bg">
      <div className="content">
        {isLoaded && (
          <SignUp
          path="/signup"
          routing="path"
          signInUrl="/signin"
          forceRedirectUrl="/quiz" // Redirects after signup to this URL, regardless of context
          fallbackRedirectUrl="/quiz" // Fallback if no redirect URL is set
          appearance={{
            variables: {
              colorPrimary: '#4CAF50',
            },
          }}
          unsafeMetadata={{
            preferredLanguage: "en", // Example: Adding metadata
          }}
        />        
        )}
      </div>
    </div>
  );
}

export default SignUpPage;
