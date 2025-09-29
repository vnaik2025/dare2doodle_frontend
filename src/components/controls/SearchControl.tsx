import { Search } from "lucide-react";

interface SearchControlProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchControl = ({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
}: SearchControlProps) => {
  return (
    <div
      className={`flex items-center bg-gray-900/70 border border-gray-800 rounded-xl px-3 py-2 ${className}`}
    >
      <Search className="w-4 h-4 text-gray-400 mr-2" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent text-gray-200 text-sm focus:outline-none"
      />
    </div>
  );
};

export default SearchControl;
