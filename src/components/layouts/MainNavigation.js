import mainLogo from "../../img/pokedexpnglogo.png";
import SearchBar from "../ui/SearchBar";
import PropTypes from "prop-types";

function MainNavigation({ onSearch }) {
  const handleClick = () => {
    onSearch("");
  };

  return (
    <header className="w-full h-52 flex items-center justify-center bg-purpleTheme px-10 rounded-bl-3xl rounded-br-3xl">
      <div className="container mx-auto w-full">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center justify-between w-full">
          {/* Logo Section */}
          <div className="flex items-center justify-start w-1/3">
            <img
              src={mainLogo}
              alt="PokeDex Logo"
              draggable="false"
              className="w-65 h-32 cursor-pointer"  // Adjust logo size for desktop
              onClick={handleClick}
            />
          </div>

          {/* Search Bar Section */}
          <div className="flex justify-end w-3/3">
            <SearchBar
              placeHolder="Search Pokemon by name or ID"
              onSearch={onSearch}
            />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex items-center justify-center w-full md:hidden">
          <div className="flex justify-center w-full">
            <SearchBar placeHolder="Search Pokemon" onSearch={onSearch} />
          </div>
        </div>
      </div>
    </header>
  );
}

MainNavigation.propTypes = {
  onSearch: PropTypes.func,
};

export default MainNavigation;
