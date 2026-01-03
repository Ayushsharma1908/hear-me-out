import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ChatInput from "../components/ChatInput";
import SidebarIcon from "../assets/sidebar-icon.svg";
import HearMeOutLogo from "../assets/Hear_meOUT.svg";
import { API_BASE_URL } from "../config/api.js";
import ReactMarkdown from "react-markdown";

// ... keep your TypingMarkdown component as is ...

export default function HomePage() {
  const [showSidebar, setShowSidebar] = useState(true);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [recentChats, setRecentChats] = useState([]);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeChatId, setActiveChatId] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // Keep this state
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* -------------------- AUTH -------------------- */
  useEffect(() => {
    fetch(`${API_BASE_URL}/auth/me`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
        else navigate("/login");
      })
      .catch(() => navigate("/login"));
  }, [navigate]);

  /* -------------------- FETCH RECENT CHATS -------------------- */
  const fetchRecentChats = async (search = "") => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/chat/recent?search=${encodeURIComponent(search)}`,
        {
          credentials: "include",
        }
      );
      const data = await res.json();
      console.log("Recent chats response:", data);
      if (data.chats) setRecentChats(data.chats);
    } catch (err) {
      console.error("Failed to fetch recent chats", err);
    }
  };

  useEffect(() => {
    fetchRecentChats();
  }, []);

  /* -------------------- HANDLE SEARCH CHANGE -------------------- */
  const handleSearchChange = (searchValue) => {
    setSearchQuery(searchValue);
    fetchRecentChats(searchValue);
  };

  /* -------------------- LOAD CHAT -------------------- */
  const loadChat = async (chatId) => {
    console.log("👉 loadChat called with:", chatId);

    try {
      const res = await fetch(`${API_BASE_URL}/api/chat/${chatId}`, {
        credentials: "include",
      });

      const data = await res.json();
      console.log("👉 loadChat response:", data);

      if (data.chat && data.chat.messages) {
        console.log("👉 messages received:", data.chat.messages);
        setMessages(data.chat.messages);
        setActiveChatId(chatId);
      }
    } catch (err) {
      console.error("Failed to load chat", err);
    }
  };

  /* -------------------- NEW CHAT -------------------- */
  const handleNewChat = () => {
    setMessages([]);
    setActiveChatId(null);
    setQuery("");
  };

  /* -------------------- DELETE CHAT -------------------- */
  const handleDeleteChat = async (chatId) => {
    try {
      await fetch(`${API_BASE_URL}/api/chat/${chatId}`, {
        method: "DELETE",
        credentials: "include",
      });

      // Remove from UI
      setRecentChats((prev) => prev.filter((chat) => chat._id !== chatId));

      // Clear screen if deleted chat is open
      if (activeChatId === chatId) {
        setMessages([]);
        setActiveChatId(null);
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const typeAssistantMessage = (fullText) => {
    let index = 0;
    let currentText = "";

    const typingInterval = setInterval(() => {
      currentText += fullText[index];
      index++;

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          text: currentText,
        };
        return updated;
      });

      if (index >= fullText.length) {
        clearInterval(typingInterval);
      }
    }, 15); // speed (lower = faster)
  };

  /* -------------------- SEND MESSAGE -------------------- */
  const handleSubmit = async () => {
    if (!query.trim()) return;

    const userMessage = { role: "user", text: query };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setQuery("");

    try {
      // 1️⃣ SEND TO AI
      const res = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message: query }),
      });

      const data = await res.json();

      const botText = data.response || data.reply;

      // add empty assistant bubble first
      setMessages((prev) => [...prev, { role: "assistant", text: "" }]);

      // type it
      typeAssistantMessage(botText);

      // 2️⃣ SAVE OR UPDATE CHAT
      const finalMessages = [
        ...updatedMessages,
        { role: "assistant", text: botText },
      ];

      const saveRes = await fetch(`${API_BASE_URL}/api/chat/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          chatId: activeChatId,
          messages: finalMessages,
        }),
      });
      if (!saveRes.ok) {
        console.error("Save failed:", saveData);
        return;
      }

      const saveData = await saveRes.json();

      // 3️⃣ STORE CHAT ID IF NEW CHAT
      if (!activeChatId && saveData.chat && saveData.chat._id) {
        setActiveChatId(saveData.chat._id);
      }

      // 4️⃣ REFRESH RECENT CHATS
      fetchRecentChats(searchQuery);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Sorry, something went wrong." },
      ]);
    }
  };

  /* -------------------- LOGOUT -------------------- */
  const handleLogout = async () => {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-white">
      {showSidebar && (
        <Sidebar
          setShowSidebar={setShowSidebar}
          onLogout={handleLogout}
          onNewChat={handleNewChat}
          recentChats={recentChats}
          onSelectChat={loadChat}
          onDeleteChat={handleDeleteChat}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange} // ADD THIS
        />
      )}

      <main className="flex-1 flex flex-col relative">
        <div
          className={`sticky top-0 z-10 bg-white border-b border-gray-200 py-4 ${
            showSidebar ? "px-4 sm:px-8 md:px-16" : "px-2 sm:px-4 md:px-6"
          }`}
        >
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
              {/* REMOVED search from here - now only logo */}
              <img src={HearMeOutLogo} alt="Hear Me Out Logo" className="h-8" />
            </div>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="focus:outline-none"
              >
                <img
                  src={
                    user?.avatar ||
                    user?.picture ||
                    "https://via.placeholder.com/40"
                  }
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-gray-300 transition-all"
                />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.name || "User"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user?.email || ""}
                    </p>
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
                {console.log("🟢 messages state:", messages)}

                {messages.map((msg, index) => (
                  <div
                    ref={bottomRef}
                    key={index}
                    className={`p-4 rounded-xl max-w-[80%] whitespace-pre-wrap break-words ${
                      msg.role === "user"
                        ? "bg-black text-white ml-auto"
                        : "bg-gray-100 text-gray-800 mr-auto"
                    }`}
                  >
                    <ReactMarkdown
                      components={{
                        h1: ({ children }) => (
                          <div className="mt-4 mb-2">
                            <h1 className="text-lg font-bold">{children}</h1>
                            <hr className="border-gray-300 my-2" />
                          </div>
                        ),
                        h2: ({ children }) => (
                          <div className="mt-3 mb-1">
                            <h2 className="text-base font-semibold">
                              {children}
                            </h2>
                            <hr className="border-gray-200 my-1" />
                          </div>
                        ),
                        h3: ({ children }) => (
                          <div className="mt-2 mb-1">
                            <h3 className="text-sm font-semibold">
                              {children}
                            </h3>
                            <hr className="border-gray-100 my-1" />
                          </div>
                        ),
                        p: ({ children }) => (
                          <p className="leading-relaxed mb-2 text-sm">
                            {children}
                          </p>
                        ),
                        ul: ({ children }) => (
                          <ul className="list-disc ml-5 mb-2 space-y-1">
                            {children}
                          </ul>
                        ),
                        li: ({ children }) => (
                          <li className="text-sm leading-relaxed">
                            {children}
                          </li>
                        ),
                        code: ({ children }) => (
                          <code className="bg-gray-200 text-sm px-1 py-0.5 rounded">
                            {children}
                          </code>
                        ),
                        blockquote: ({ children }) => (
                          <blockquote className="border-l-2 border-gray-300 pl-4 italic my-2 text-gray-600">
                            {children}
                          </blockquote>
                        ),
                      }}
                    >
                      {msg.text}
                    </ReactMarkdown>
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
