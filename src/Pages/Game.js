import React, { useState, useEffect } from "react";
import World from "../Components/World";
import Nav from "../Components/Nav";
import Guide from "../Components/Guide"; // Import Guide component
import { getFirestore, doc, getDoc } from "firebase/firestore"; // Firebase

function Game() {
  const [userStatus, setUserStatus] = useState(null);

  useEffect(() => {
    const fetchUserStatus = async () => {
      const db = getFirestore();
      const userId = "USER_ID_HERE"; // Replace with logic to get the current user's ID
      const userDocRef = doc(db, "Users", userId);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        setUserStatus(userDocSnap.data().status || "existing");
      } else {
        setUserStatus("new");
      }
    };

    fetchUserStatus();
  }, []);

  return (
    <div>
      <Nav />
      <World />
      {userStatus && <Guide userStatus={userStatus} />}
    </div>
  );
}

export default Game;
