import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import OAuthSuccess from "./pages/OAuthSuccess";
import SplashScreen from "./pages/SplashScreen";

function App() {
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem("hasSeenSplash");

    if (!hasSeenSplash) {
      setShowSplash(true);
    }
  }, []);

  const handleSplashFinish = () => {
    sessionStorage.setItem("hasSeenSplash", "true");
    setShowSplash(false);
  };

  return (
    <>
      {showSplash ? (
        <SplashScreen onFinish={handleSplashFinish} />
      ) : (
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/oauth-success" element={<OAuthSuccess />} />
          </Routes>
        </Router>
      )}
    </>
  );
}

export default App;
