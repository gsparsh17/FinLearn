import React, { useState } from "react";
import { useUser } from "@clerk/clerk-react"; // Assuming Clerk is used for authentication
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, collection } from "firebase/firestore";
import { CSSTransition } from "react-transition-group";
import "../Styles/Quiz.css";

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

function Quiz() {
  const [step, setStep] = useState(0); // 0: Ask age, 1: Quiz questions
  const [age, setAge] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showQuestion, setShowQuestion] = useState(true);
  const { user } = useUser(); // Assuming Clerk provides the authenticated user

  const questions = [
    {
      id: 1,
      question: "How do you want to become rich?",
      options: [
        "Increasing income or decreasing expenses",
        "Buying assets that generate income",
        "Winning lotteries",
        "Starting their own company",
      ],
    },
    {
      id: 2,
      question: "How can you make more money?",
      options: [
        "Increasing financial skills",
        "Seeking high-paying jobs",
        "Starting a business",
        "Investing wisely",
      ],
    },
    {
      id: 3,
      question: "How do rich people become rich?",
      options: [
        "Having a clear financial plan",
        "Going to the best college",
        "Taking risks and investing",
        "Working at a big company",
      ],
    },
  ];

  const handleAgeSubmit = () => {
    if (age && parseInt(age) > 0) {
      setStep(1); // Move to the quiz questions
    } else {
      alert("Please enter a valid age.");
    }
  };

  const handleOptionChange = (option) => {
    setAnswers((prev) => ({
      ...prev,
      [questions[currentQuestion].id]: option,
    }));
  };

  const handleNext = () => {
    setShowQuestion(false);
    setTimeout(() => {
      setCurrentQuestion((prev) => prev + 1);
      setShowQuestion(true);
    }, 300);
  };

  const handleSubmit = async () => {
    try {
      if (!user) {
        alert("User is not logged in.");
        return;
      }

    const userEmail = user.primaryEmailAddress.emailAddress;
      const userId = user.id;
      const userDocRef = doc(db, "Users", userId);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        await setDoc(userDocRef, {
          email: userEmail,
          age: parseInt(age),
          status: 'new'
        });
      } else {
        await setDoc(userDocRef, { age: parseInt(age) }, { merge: true });
      }
      const aboutUserCollectionRef = collection(userDocRef, "AboutUser");
      await setDoc(doc(aboutUserCollectionRef, "QuizAnswers"), { answers });
      window.location.href = "/game";
    } catch (error) {
      console.error("Error saving data:", error);
      alert("There was an error saving your data. Please try again.");
    }
  };

  return (
    <div className="bg">
      <div className="content1">
        <h1 className="quiz-title">Financial Literacy Quiz</h1>

        {step === 0 && (
          <div className="age-step">
            <h3>Please enter your age to begin:</h3>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Enter your age"
              className="age-input"
            />
            <button onClick={handleAgeSubmit} className="start-btn">
              Start Quiz
            </button>
          </div>
        )}

        {step === 1 && (
          <>
            <CSSTransition
              in={showQuestion}
              timeout={300}
              classNames="question-animation"
              unmountOnExit
            >
              <div className="question">
                <h3>{questions[currentQuestion].question}</h3>
                <div className="grid-options">
                  {questions[currentQuestion].options.map((option, index) => (
                    <div
                      key={index}
                      className={`option-card ${
                        answers[questions[currentQuestion].id] === option
                          ? "selected"
                          : ""
                      }`}
                      onClick={() => handleOptionChange(option)}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              </div>
            </CSSTransition>
            <div className="navigation">
              {currentQuestion < questions.length - 1 && (
                <button
                  onClick={handleNext}
                  className="next-btn"
                  disabled={!answers[questions[currentQuestion].id]}
                >
                  Next
                </button>
              )}
              {currentQuestion === questions.length - 1 && (
                <button onClick={handleSubmit} className="submit-btn">
                  Submit
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Quiz;
