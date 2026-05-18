import { quickQuestions } from "../../data/chatMockData";

export default function QuickQuestions({ onSelect, disabled }) {
  return (
    <div className="flex flex-wrap gap-2 px-4 pb-3">
      {quickQuestions.map((q) => (
        <button
          key={q}
          onClick={() => onSelect(q)}
          disabled={disabled}
          className="text-xs px-3 py-1.5 rounded-full border border-zinc-700 text-zinc-400 hover:border-red-500 hover:text-red-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-zinc-900"
        >
          {q}
        </button>
      ))}
    </div>
  );
}
