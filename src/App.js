import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import Bank from "./Pages/Bank";
import Market from "./Pages/Market";
import Game from "./Pages/Game";
import NewsChannel from "./Pages/NewsChannel";
import Investment from "./Pages/Investment";
import Wallet from "./Pages/Wallet";
import DailyTasks from "./Pages/DailyTasks";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import Quiz from "./Pages/Quiz";
import withLoader from "./Components/WithLoader";
import { ClerkProvider, RedirectToSignIn } from '@clerk/clerk-react';

const clerkFrontendApi = process.env.REACT_APP_CLERK_FRONTEND_API;
const PUBLISHABLE_KEY = "pk_test_c3BlY2lhbC1jb3lvdGUtOTguY2xlcmsuYWNjb3VudHMuZGV2JA";

const HomePageLoader=withLoader(HomePage);
const GameLoader=withLoader(Game);


function App() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} frontendApi={clerkFrontendApi}>
      <Router>
      <Routes>
          <Route path="/" element={<HomePageLoader/>} />
          <Route path="/bank" element={<Bank/>} />
          <Route path="/market" element={<Market />} />
          <Route path="/game" element={<GameLoader/>} />
          <Route path="/news-channel" element={<NewsChannel />} />
          <Route path="/investment" element={<Investment />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/daily-tasks" element={<DailyTasks />} />
          <Route path="/signin" element={<Login/>}/>
          <Route path="/signup" element={<SignUp/>}/>
          <Route path="/quiz" element={<Quiz/>}/>
          <Route path="*" element={<RedirectToSignIn />} />
        </Routes>
        </Router>
        </ClerkProvider>
  );
}

export default App;