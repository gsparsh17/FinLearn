import React from 'react';
import '../Styles/SignUp.css'; // You can reuse the same CSS file or create a new one.
import { SignIn } from '@clerk/clerk-react';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useSignIn } from '@clerk/clerk-react';

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


function SignInPage() {
  const { isLoaded, signIn } = useSignIn();

  const handleAfterSignIn = async (user) => {
    if (!user) return;

    try {
      // Fetch user details from Firestore
      const userDocRef = doc(db, 'users', user.id);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        console.log('User data retrieved successfully:', userDoc.data());
      } else {
        console.log('No such user exists in Firestore');
      }
    } catch (error) {
      console.error('Error retrieving user data from Firestore:', error);
    }
  };

  return (
    <div className="bg">
      <div className="content">
        {isLoaded && (
          <SignIn
            path="/signin"
            routing="path"
            signUpUrl="/signup"
            appearance={{
              variables: {
                colorPrimary: '#4CAF50',
              },
            }}
            afterSignIn={(data) => handleAfterSignIn(data.user)}
            afterSignInUrl="/game"
          />
        )}
      </div>
    </div>
  );
}

export default SignInPage;
