import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ChatInput from "../components/ChatInput";
import SidebarIcon from "../assets/sidebar-icon.svg";
import NewChatIcon from "../assets/newchat-icon.svg";
import HearMeOutLogo from "../assets/Hear_meOUT.svg";
import { API_BASE_URL } from "../config/api.js";

export default function HomePage() {
  const [showSidebar, setShowSidebar] = useState(true);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch current user
    fetch(`${API_BASE_URL}/auth/me`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        } else {
          navigate("/login");
        }
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
        navigate("/login");
      });
  }, [navigate]);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const handleSubmit = async () => {
  if (!query.trim()) return;

  const userMessage = { role: "user", text: query };
  setMessages((prev) => [...prev, userMessage]);
  setQuery("");

  try {
    const res = await fetch(`${API_BASE_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ message: query }),
    });

    const data = await res.json();

    setMessages((prev) => [
      ...prev,
      { role: "bot", text: data.reply },
    ]);
  } catch {
    setMessages((prev) => [
      ...prev,
      { role: "bot", text: "Sorry, something went wrong." },
    ]);
  }
};
;

  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        navigate("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  return (
    <div className="flex h-screen bg-white">
      {showSidebar && <Sidebar setShowSidebar={setShowSidebar} />}

      <main className="flex-1 flex flex-col relative">
        <div className={`sticky top-0 z-10 bg-white border-b border-gray-200 py-4 ${showSidebar ? 'px-4 sm:px-8 md:px-16' : 'px-2 sm:px-4 md:px-6'
          }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {!showSidebar && (
                <button
                  onClick={() => setShowSidebar(true)}
                  className="p-1 rounded-lg hover:bg-gray-100"
                >
                  <img src={SidebarIcon} alt="Menu" className="w-6 h-6" />
                </button>
              )}
              <img src={HearMeOutLogo} alt="Hear Me Out Logo" className="h-8" />
            </div>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="focus:outline-none"
              >
                <img
                  src={user?.avatar || "https://via.placeholder.com/40"}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-gray-300 transition-all"
                />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user?.name || "User"}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email || ""}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Main content area */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col justify-center items-center text-center px-4">
              <h2 className="text-2xl font-bold bg-gradient-to-tr from-[#3B3B3B] to-[#EEEEEE] bg-clip-text text-transparent">
                Hello, {user?.name || "User"}
              </h2>
              <p className="text-gray-400 mt-1">What's on your mind today?</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-8 md:px-16">
              <div className="max-w-2xl mx-auto space-y-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-xl max-w-[80%] ${msg.role === "user"
                        ? "bg-black text-white self-end ml-auto"
                        : "bg-gray-100 text-gray-800 self-start mr-auto"
                      }`}
                  >
                    {msg.text}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* Chat Input without top border */}
        <div className="sticky bottom-0 bg-white py-4 px-4 sm:px-8 md:px-16">
          <div className="max-w-2xl mx-auto">
            <ChatInput
              query={query}
              setQuery={setQuery}
              handleSubmit={handleSubmit}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
