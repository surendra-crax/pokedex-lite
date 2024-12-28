import { useState, useRef } from "react";
import PropTypes from "prop-types";
import SearchIcon from "./SearchIcon";
import miniLogo from "../../img/pokedex_mini_logo.png";

function SearchBar({ placeHolder, onSearch }) {
  const inputRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleIconClick = () => {
    inputRef.current.focus();
  };

  const handleSmallScreenClick = () => {
    onSearch("");
  };

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      onSearch(searchTerm);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-4">
      <div className="relative flex items-center justify-between w-full p-3 rounded-3xl bg-white shadow-lg border-2 border-gray-300 transition-all duration-300 hover:shadow-xl hover:border-gray-400">
        {/* Logo */}
        <img
          src={miniLogo}
          alt="PokeDex Logo"
          className="w-9 h-9 hidden md:block cursor-pointer"
          onClick={handleIconClick}
          draggable="false"
        />
        <img
          src={miniLogo}
          alt="PokeDex Logo"
          className="w-9 h-9 block md:hidden cursor-pointer"
          onClick={handleSmallScreenClick}
          draggable="false"
        />

        {/* Spacer between the logo and input */}
        <div className="flex-1 mx-3">
          {/* Input Field */}
          <input
            type="text"
            placeholder={placeHolder}
            className="w-full px-4 py-2 bg-gray-100 text-purple-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-300 ease-in-out"
            ref={inputRef}
            value={searchTerm}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
          />
        </div>

        {/* Search Icon */}
        <SearchIcon
          onClick={handleSearch}
          className="absolute right-4 cursor-pointer transition-all duration-300 ease-in-out hover:text-yellow-500"
        />
      </div>
    </div>
  );
}

SearchBar.propTypes = {
  placeholder: PropTypes.string,
  onSearch: PropTypes.func.isRequired,
};

export default SearchBar;
