import { useState } from "react";

interface MultiSelectProps {
  label?: string;
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
}

const MultiSelect = ({ label, options, value, onChange }: MultiSelectProps) => {
  const [inputValue, setInputValue] = useState("");

  const handleToggle = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter((v) => v !== option));
    } else {
      onChange([...value, option]);
    }
  };

  return (
    <div className="w-full mb-3">
      {label && <label className="block text-sm text-gray-300 mb-1">{label}</label>}
      <div className="flex flex-wrap gap-2 p-2 bg-zinc-900 border border-gray-700 rounded-lg">
        {value.map((tag) => (
          <span
            key={tag}
            className="bg-indigo-600 text-white px-2 py-1 rounded-md text-xs cursor-pointer"
            onClick={() => handleToggle(tag)}
          >
            {tag} ✕
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && inputValue.trim()) {
              e.preventDefault();
              onChange([...value, inputValue.trim()]);
              setInputValue("");
            }
          }}
          placeholder="Add tag..."
          className="bg-transparent text-white text-sm focus:outline-none flex-1"
        />
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => handleToggle(opt)}
            className={`px-2 py-1 rounded-md text-xs ${
              value.includes(opt)
                ? "bg-indigo-600 text-white"
                : "bg-zinc-800 text-gray-400 hover:bg-zinc-700"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MultiSelect;
