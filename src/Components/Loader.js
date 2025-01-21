import React from "react";
import "../Styles/Loader.css";

function Loader() {
  return (
    <div className="loader-container">
      <div className="loader-animation">
        <h1>FinLearn</h1>
        <p>Loading your financial journey...</p>
        {/* <div className="spinner"></div> */}
        <img className="gif" src="./load.gif"/>
      </div>
    </div>
  );
}

export default Loader;
