import { Link } from "react-router-dom";
import React from "react";
import HearMeOutLogo from "../assets/Hear_meOUT.svg";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 py-4 px-4 sm:px-8 md:px-16">
        <div className="flex items-center justify-between">
          <img
            src={HearMeOutLogo}
            alt="Hear Me Out Logo"
            className="
            h-6        /* mobile */
            sm:h-7
            md:h-8     /* desktop stays same */
            object-contain
            flex-shrink-0
            "
          />
          <Link
            to="/login"
            className="
            px-4 sm:px-6
            py-2
            bg-black text-white
            rounded-lg
            font-medium
            hover:bg-gray-800
            transition-colors
            whitespace-nowrap
            flex-shrink-0
            "
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-8 md:px-16 py-12">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold bg-gradient-to-tr from-[#3B3B3B] to-[#EEEEEE] bg-clip-text text-transparent leading-tight">
            Hear Me Out
          </h1>

          {/* Subheading */}
          <p className="text-xl sm:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Your intelligent chatbot companion that listens, understands, and
            responds to what's on your mind.
          </p>

          {/* Description */}
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Experience seamless conversations powered by advanced AI. Get
            instant answers, thoughtful insights, and meaningful interactions.
          </p>

          {/* CTA Button */}
          <div className="pt-4">
            <Link
              to="/login"
              className="inline-block px-8 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors text-lg"
            >
              Get Started
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 pt-16 border-t border-gray-200">
            <div className="space-y-2">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto">
                <svg
                  className="w-6 h-6 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800">
                Smart Conversations
              </h3>
              <p className="text-sm text-gray-500">
                Engage in natural, context-aware dialogues
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto">
                <svg
                  className="w-6 h-6 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800">Instant Responses</h3>
              <p className="text-sm text-gray-500">
                Get quick and accurate answers in real-time
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto">
                <svg
                  className="w-6 h-6 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800">Secure & Private</h3>
              <p className="text-sm text-gray-500">
                Your conversations are protected and confidential
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
