import { useState, useEffect, useRef } from "react";
import { FiLogOut, FiMoreVertical, FiTrash2, FiSearch } from "react-icons/fi";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import BotIcon from "../assets/bot-icon.svg";

export default function Sidebar({
  showSidebar,
  setShowSidebar,
  onLogout,
  onNewChat,
  recentChats,
  onSelectChat,
  onDeleteChat,
  searchQuery = "",
  onSearchChange, // ADD THIS: callback for search change
}) {
  const [openMenuId, setOpenMenuId] = useState(null);
  const [filteredChats, setFilteredChats] = useState([]);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery); // Local state
  const menuRef = useRef(null);

  // Sync with parent search query
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearchQuery(value);
    if (onSearchChange) {
      onSearchChange(value); // Notify parent
    }
  };

  // Clear search
  const handleClearSearch = () => {
    setLocalSearchQuery("");
    if (onSearchChange) {
      onSearchChange(""); // Notify parent
    }
  };

  // Filter chats based on search query
  useEffect(() => {
    if (!localSearchQuery) {
      setFilteredChats(recentChats);
    } else {
      const filtered = recentChats.filter((chat) => {
        const title = chat.title || chat.messages?.[0]?.text || "New Chat";
        return title.toLowerCase().includes(localSearchQuery.toLowerCase());
      });
      setFilteredChats(filtered);
    }
  }, [localSearchQuery, recentChats]);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <aside
      className={`
    fixed md:static
    top-0 left-0
    h-screen w-64
    bg-white border-r border-gray-200
    flex flex-col
    z-40
    transform transition-transform duration-300 ease-in-out
    ${showSidebar ? "translate-x-0" : "-translate-x-full"}
    md:translate-x-0
  `}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={BotIcon} alt="Bot Icon" className="w-8 h-8" />
            <span className="font-medium">Hear Me Out</span>
          </div>
          <button
            onClick={() => setShowSidebar(false)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900 md:hidden"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          {/* New Chat */}
          <button
            onClick={onNewChat}
            className="w-full flex items-center gap-3 px-4 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors mb-6"
          >
            <HiOutlinePencilSquare className="w-5 h-5" />
            <span>New Chat</span>
          </button>

          {/* Search Bar - ADDED HERE */}
          <div className="mb-6">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search chats..."
                value={localSearchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-sm"
              />
              {localSearchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Recent Chats */}
          <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3 px-2">
            Recent Chats {localSearchQuery && `(Search: "${localSearchQuery}")`}
          </h3>

          <div className="space-y-1">
            {filteredChats.length === 0 ? (
              <div className="px-3 py-2 text-gray-500 text-sm">
                {localSearchQuery
                  ? "No chats found matching your search"
                  : "No recent chats"}
              </div>
            ) : (
              filteredChats.map((chat) => (
                <div
                  key={chat._id}
                  className="relative flex items-center justify-between px-3 py-2 rounded hover:bg-gray-100 group"
                >
                  {/* Title */}
                  <div
                    className="flex-1 truncate cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectChat(chat._id);
                      setOpenMenuId(null);
                    }}
                    title={chat.title || chat.messages?.[0]?.text || "New Chat"}
                  >
                    {chat.title || chat.messages?.[0]?.text || "New Chat"}
                  </div>

                  {/* Three dots */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === chat._id ? null : chat._id);
                    }}
                    className="p-1 rounded hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FiMoreVertical className="w-4 h-4 text-gray-600" />
                  </button>

                  {/* Delete menu */}
                  {openMenuId === chat._id && (
                    <div
                      ref={menuRef}
                      className="absolute right-2 top-10 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[120px]"
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (
                            window.confirm(
                              "Are you sure you want to delete this chat?"
                            )
                          ) {
                            onDeleteChat(chat._id);
                          }
                          setOpenMenuId(null);
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full rounded-lg"
                      >
                        <FiTrash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <FiLogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
