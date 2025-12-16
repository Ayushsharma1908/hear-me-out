import { IoSendSharp } from "react-icons/io5";

export default function ChatInput({ query, setQuery, handleSubmit }) {
  return (
    <div className="flex items-center w-full max-w-2xl mt-6 mb-10 bg-white rounded-2xl px-6 py-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100 self-center">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ask Anything..."
        className="flex-1 outline-none text-gray-600 text-base placeholder-gray-400"
      />
      <button
        onClick={handleSubmit}
        disabled={!query.trim()}
        className={`ml-4 p-3 rounded-full transition ${
          query.trim()
            ? "bg-black text-white hover:bg-gray-800"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        <IoSendSharp className="w-5 h-5" />
      </button>
    </div>
  );
}
