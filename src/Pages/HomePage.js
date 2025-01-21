import React from 'react';
import '../Styles/HomePage.css';
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="auth-container">
      <div className="auth-content">
        <h1>
          Welcome to <span>FinLearn</span>
        </h1>
        <p>Learn financial literacy while having fun!</p>
        <div className="auth-buttons">
          <Link to={'/signin'} className="btn login">Load Journey</Link>
          <Link to={'/signup'} className="btn signup">New Journey</Link>
        </div>
      </div>
      <div className="about-section">
        <h1>About <span>FinLearn</span></h1>
        <p>
          Financial Literacy Game Suite is a platform designed to teach essential financial education and money management skills for every stage of life. 
          Explore real-world financial scenarios, multiplayer modes, and advanced concepts like investments and long-term planning. 
          Empower your financial journey today with <span>FinLearn</span>!
        </p>
      </div>
    </div>
  );
}

export default HomePage;
