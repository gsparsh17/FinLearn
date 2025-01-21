import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../Styles/Guide.css";

const Guide = ({ userStatus }) => {
  const [currentStep, setCurrentStep] = useState(0); // Current guide step
  const [showGuide, setShowGuide] = useState(userStatus === "new"); // Show only if the user is new

  const guideSteps = [
    {
      title: "Welcome to FinLearn!",
      message: `Hello there! My name is Mr. FinSmart, and I'll guide you through the basics of this exciting financial learning game.`,
      image: "./1.png", // Replace with your image path
    },
    {
        title: "Welcome to Your Virtual City Life!",
        message: `Step into an exciting virtual world where you'll master financial skills and navigate city life like a pro.`,
        image: "./1.png", // Replace with your image path
    },
    {
        title: "Game Controls",
        message: `
            Arrow Up:Move Forward
            Arrow Down:Move Backward
            Arrow Left:Rotate Left
            Arrow Right:Rotate Right
            Space:Jump
        `,
        image: "./1.png", // Replace with your image path
    },
    {
      title: "Game Basics",
      message: `In FinLearn, you'll learn how to manage money by completing daily and weekly tasks. Your goal is to save and grow your wealth through smart investments!`,
      image: "./4.png",
    },
    {
      title: "Initial Money & Tasks",
      message: `You start with initial money based on your age. Use it wisely! Complete tasks like opening a bank account, depositing money, and tracking your spending.`,
      image: "./4.png",
    },
    {
      title: "Your First Task",
      message: `Let's begin! Your first task is to navigate to the bank and open a bank account. Deposit your money into the bank wallet to keep it safe.`,
      image: "./1.png",
    },
  ];

  const handleNext = () => {
    if (currentStep < guideSteps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setShowGuide(false); // Close the guide when steps are finished
    }
  };

  if (!showGuide) return null; // If guide is closed, return nothing

  return (
    <div className="guide-overlay">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep} // Unique key for each step
          className="guide-container"
          initial={{ opacity: 0, }}
          animate={{ opacity: 1, }}
          exit={{ opacity: 0, }}
          transition={{ duration: 0.5 }}
        >
          
          <div className="guide-content">
            <h2 className="guide-title">{guideSteps[currentStep].title}</h2>
            <p className="guide-message">{guideSteps[currentStep].message}</p>
            <button className="next-button" onClick={handleNext}>
              {currentStep < guideSteps.length - 1 ? "Next" : "Finish"}
            </button>
          </div>
          <div className="image-container">
          <img
            src={guideSteps[currentStep].image}
            alt="Guide Character"
            className="guide-image"
          />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Guide;
