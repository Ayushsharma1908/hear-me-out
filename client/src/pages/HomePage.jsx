import { useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatInput from "../components/ChatInput";
import SidebarIcon from "../assets/sidebar-icon.svg";
import NewChatIcon from "../assets/newchat-icon.svg";
import HearMeOutLogo from "../assets/Hear_meOUT.svg";

export default function HomePage() {
  const [showSidebar, setShowSidebar] = useState(true);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatId, setChatId] = useState(null);
  const handleSubmit = async () => {
  if (!query.trim()) return;

  const userMessage = { role: "user", text: query };
  setMessages((prev) => [...prev, userMessage]);
  setQuery("");

  try {
    const res = await fetch("http://localhost:5000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: query, chatId })
    });

    const data = await res.json();

    // AI response
    const botMessage = { role: "bot", text: data.reply };
    setMessages((prev) => [...prev, botMessage]);
  } catch (error) {
    console.error("Error connecting to backend:", error);
    const botMessage = { role: "bot", text: "Oops! Something went wrong." };
    setMessages((prev) => [...prev, botMessage]);
  }
};


  return (
    <div className="flex h-screen bg-white">
      {showSidebar && <Sidebar setShowSidebar={setShowSidebar} />}

      <main className="flex-1 flex flex-col relative">
        <div className={`sticky top-0 z-10 bg-white border-b border-gray-200 py-4 ${
          showSidebar ? 'px-4 sm:px-8 md:px-16' : 'px-2 sm:px-4 md:px-6'
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

            <img
              src="https://i.pravatar.cc/40"
              alt="profile"
              className="w-10 h-10 rounded-full"
            />
          </div>
        </div>
        {/* Main content area */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col justify-center items-center text-center px-4">
              <h2 className="text-2xl font-bold bg-gradient-to-tr from-[#3B3B3B] to-[#EEEEEE] bg-clip-text text-transparent">
                Hello, Ayush
              </h2>
              <p className="text-gray-400 mt-1">What's on your mind today?</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-8 md:px-16">
              <div className="max-w-2xl mx-auto space-y-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-xl max-w-[80%] ${
                      msg.role === "user"
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
