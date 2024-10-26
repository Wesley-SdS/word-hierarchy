import { Input } from "@/components/ui/input";
import { FaSearch } from "react-icons/fa";

interface SearchBarProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

const SearchBar = ({ searchQuery, setSearchQuery }: SearchBarProps) => {
    return (
        <div className="relative mb-4">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-800" />
            <Input
                type="text"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-gray-300 bg-white text-gray-800 dark:bg-gray-100 dark:border-gray-600 dark:text-gray-800 rounded px-10 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors placeholder:text-gray-800 dark:placeholder:text-gray-800"
            />
        </div>
    );
};

export default SearchBar;
