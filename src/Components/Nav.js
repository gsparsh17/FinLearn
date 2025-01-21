import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { FaNewspaper, FaWallet, FaBook, FaTasks } from "react-icons/fa";
import "../Styles/Nav.css"; // Optional: Add styles for the navbar

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB0bdQZHH22KbmUcXr46xu7Y6m1q1MqGR0",
  authDomain: "cricdata-bdf21.firebaseapp.com",
  projectId: "cricdata-bdf21",
  storageBucket: "cricdata-bdf21.firebasestorage.app",
  messagingSenderId: "191750755116",
  appId: "1:191750755116:web:3ab4b85ec674c45c11d289",
  measurementId: "G-ZH35DGLGDK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function Nav() {
  const { user } = useUser(); // Clerk user
  const [timer, setTimer] = useState("00:00:00");
  const [day, setDay] = useState("Day 1");
  const [month, setMonth] = useState("1st Month");
  const [initialMoney, setInitialMoney] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserStatus = async () => {
      if (!user) return;

      const userId = user.id;
      const age = parseInt(user.publicMetadata?.age || 0);

      // Determine initial money based on age
      let money = 0;
      if (age < 18) money = 2000;
      else if (age < 25) money = 10000;
      else if (age < 30) money = 30000;

      setInitialMoney(money);

      // Fetch user document from Firebase
      const userDocRef = doc(db, "Users", userId);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        // If user is new, set default values in Firebase
        await setDoc(userDocRef, {
          status: "new",
          timer: "00:00:00",
          day: "Day 1",
          month: "1st Month",
          money,
        });
        setTimer("00:00:00");
        setDay("Day 1");
        setMonth("1st Month");
      } else {
        // If user exists, fetch values from Firebase
        const userData = userDocSnap.data();
        setTimer(userData.timer || "00:00:00");
        setDay(userData.day || "Day 1");
        setMonth(userData.month || "1st Month");
        setInitialMoney(userData.money || money);
      }

      setLoading(false);
    };

    fetchUserStatus();
  }, [user]);

  // Loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="navbar">
      {/* Timer and Money Display */}
      <div className="nav-status">
        <h3 className="timer">{`${timer}, ${day}, ${month}`}</h3>
        <h3 className="money">Money: ₹{initialMoney}</h3>
      </div>

      {/* Icons Section */}
      <div className="nav-icons">
        <div className="icon-wrapper">
          <FaNewspaper className="icon" />
          <span className="tooltip">Latest News</span>
        </div>
        <div className="icon-wrapper">
          <FaWallet className="icon" />
          <span className="tooltip">Wallet</span>
        </div>
        <div className="icon-wrapper">
          <FaBook className="icon" />
          <span className="tooltip">Guide</span>
        </div>
        <div className="icon-wrapper">
          <FaTasks className="icon" />
          <span className="tooltip">Tasks</span>
        </div>
      </div>
    </div>
  );
}

export default Nav;
