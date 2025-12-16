import { FiLogOut } from "react-icons/fi";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import SidebarLogo from "../assets/hearlogo.svg";
import BotIcon from "../assets/bot-icon.svg";

export default function Sidebar({ setShowSidebar }) {
  const recentChats = [
    "Chatbot name ideas",
    "Unique Captions",
    "Marketing strategies",
    "Product design tips",
  ];

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
            aria-label="Close sidebar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          {/* New Chat Button */}
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors mb-6">
            <HiOutlinePencilSquare className="w-5 h-5" />
            <span>New Chat</span>
          </button>

          {/* Recent Chats Section */}
          <div className="mt-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
              Recent Chats
            </h3>
            <div className="space-y-1">
              {recentChats.map((chat, index) => (
                <button
                  key={index}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors group"
                >
                  <HiOutlineChatBubbleLeftRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 flex-shrink-0" />
                  <span className="text-sm truncate">{chat}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <button className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors font-medium">
          <FiLogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
