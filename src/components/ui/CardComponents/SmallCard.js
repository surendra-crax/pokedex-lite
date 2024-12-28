import PropTypes from "prop-types";
import styles from "./SmallCard.module.css";
import React from "react";

function SmallCard({
  height,
  id,
  image,
  name,
  weight,
  isFavorite,
  toggleFavorite,
  openBigCard,
}) {
  return (
    <div
      className={`${styles["float-shadow"]} h-64 w-52 rounded-3xl p-2 bg-grayTheme shadow-2xl cursor-pointer`}
      onClick={() => openBigCard(id, image)}
    >
      <div className="h-full w-full">
        <div className="w-full h-3/5 flex items-center justify-center">
          <img className="h-full" src={image} alt={name} draggable="false" />
        </div>

        <div className="h-2/5 px-3 text-sm">
          <p>#{id.toString().padStart(4, "0")}</p>

          <div className="h-1/6 w-full"></div>

          <div>
            <h2 className="text-lg capitalize font-bold">{name}</h2>
          </div>

          <div className="flex justify-between">
            <p className="text-sm text-purpleTheme">Weight: {weight}</p>
            <p className="text-sm text-darkYellowFontColor">Height: {height}</p>
          </div>

          {/* Favorite Button */}
          <div className="absolute top-2 right-2">
            <button
              className={`favorite-btn ${isFavorite ? "favorite" : ""}`}
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering openBigCard on button click
                toggleFavorite(id);
              }}
            >
              {isFavorite ? "★" : "☆"} {/* Display filled or empty star */}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

SmallCard.propTypes = {
  height: PropTypes.number.isRequired,
  id: PropTypes.number.isRequired,
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  weight: PropTypes.number.isRequired,
  isFavorite: PropTypes.bool.isRequired,
  toggleFavorite: PropTypes.func.isRequired,
  openBigCard: PropTypes.func,
};

export default React.memo(SmallCard);
