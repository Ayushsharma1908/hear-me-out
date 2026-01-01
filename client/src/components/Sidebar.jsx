import { useState } from "react";
import { FiLogOut, FiMoreVertical, FiTrash2 } from "react-icons/fi";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import SidebarLogo from "../assets/hearlogo.svg";
import BotIcon from "../assets/bot-icon.svg";

export default function Sidebar({
  setShowSidebar,
  onLogout,
  onNewChat,
  recentChats,
  onSelectChat,
  onDeleteChat,
}) {
  const [openMenuId, setOpenMenuId] = useState(null);

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={BotIcon} alt="Bot Icon" className="w-8 h-8" />
          </div>
          <button
            onClick={() => setShowSidebar(false)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900"
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

          {/* Recent Chats */}
          <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3 px-2">
            Recent Chats
          </h3>

          <div className="space-y-1">
            {recentChats.map((chat) => (
              <div
                key={chat._id}
                className="relative flex items-center justify-between px-3 py-2 rounded hover:bg-gray-100 group"
              >
                {/* Title */}
                <div
                  className="flex-1 truncate cursor-pointer"
                  onClick={() => onSelectChat(chat._id)}
                >
                  {chat.title || chat.messages?.[0]?.content || "New Chat"}
                </div>

                {/* Three dots */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuId(
                      openMenuId === chat._id ? null : chat._id
                    );
                  }}
                  className="p-1 rounded hover:bg-gray-200"
                >
                  <FiMoreVertical className="w-4 h-4 text-gray-600" />
                </button>

                {/* Delete menu */}
                {openMenuId === chat._id && (
                  <div className="absolute right-2 top-10 bg-white border rounded-lg shadow-lg z-50">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteChat(chat._id);
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
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg"
        >
          <FiLogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
