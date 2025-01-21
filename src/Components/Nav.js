import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
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
  const [progress, setProgress] = useState(1); // Initialize progress at 1

  useEffect(() => {
    const fetchUserStatus = async () => {
      if (!user) return;

      const userId = user.id;
      const userDocRef1 = doc(db, "Users", userId);
      const userDocSnap1 = await getDoc(userDocRef1);
      const userData = userDocSnap1.data();
      const age = userData.age; 

      // Determine initial money based on age
      let money = 0;
      if (age < 18) money = 2000;
      else if (age < 25 && age >= 18) money = 10000;
      else if (age <= 30 && age >= 25) money = 30000;

      setInitialMoney(money);

      // Fetch user document from Firebase
      const userDocRef = doc(db, "Users", userId);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.data().status=='new') {
        // If user is new, set default values in Firebase
        await updateDoc(userDocRef, {
          status: "new",
          day: "Day 1",
          month: "1st Month",
          money,
        });
        setDay("Day 1");
        setMonth("1st Month");
      } else {
        // If user exists, fetch values from Firebase
        const userData = userDocSnap.data();
        setDay(userData.day || "Day 1");
        setMonth(userData.month || "1st Month");
        setInitialMoney(userData.money || money);
      }
    };

    // Fetch user data and start loading
    fetchUserStatus().then(() => {
      // Delay setting loading to false until progress completes
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev < 100) {
            return prev + 1; // Increment progress
          } else {
            clearInterval(progressInterval); // Stop progress at 100%
            setLoading(false); // Mark loading as complete
            return 100;
          }
        });
      }, 30); // Adjust speed (30ms per increment)
    });

    // Timer update every second
    const timerInterval = setInterval(() => {
      setTimer((prevTimer) => {
        // Split timer into hours, minutes, seconds
        const [hours, minutes, seconds] = prevTimer.split(":").map(Number);
        let newHours = hours;
        let newMinutes = minutes;
        let newSeconds = seconds + 1;

        if (newSeconds === 60) {
          newSeconds = 0;
          newMinutes += 1;
        }
        if (newMinutes === 60) {
          newMinutes = 0;
          newHours += 1;
        }

        // Format timer as HH:MM:SS
        const newTimer = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;
        
        // // Update Firebase with new timer, day, and month
        // if (user) {
        //   const userDocRef = doc(db, "Users", user.id);
        //   updateDoc(userDocRef, {
        //     day: day,
        //     month: month,
        //   });
        // }

        return newTimer;
      });
    }, 1000); // Update every second

    // Cleanup the interval on component unmount
    return () => clearInterval(timerInterval);
  }, [user, day, month]);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-text">Loading... {progress}%</div>
      </div>
    );
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
