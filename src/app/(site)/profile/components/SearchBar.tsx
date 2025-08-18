import { IoSearch } from "react-icons/io5";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  placeholder: string;
  variant?: "default" | "compact";
  className?: string;
}

export function SearchBar({ searchTerm, onSearchChange, placeholder, variant = "default", className = "" }: SearchBarProps) {
  const baseClasses = "relative";
  const inputClasses =
    variant === "compact"
      ? "w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-myGreenBold focus:border-transparent"
      : "w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-myGreenBold focus:border-transparent";

  return (
    <div className={`${baseClasses} ${className}`}>
      <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-myGray w-5 h-5" />
      <input type="text" placeholder={placeholder} value={searchTerm} onChange={(e) => onSearchChange(e.target.value)} className={inputClasses} />
    </div>
  );
}
