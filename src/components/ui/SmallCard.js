import PropTypes from "prop-types";

function SmallCard({
  id,
  name,
  image,
  height,
  weight,
  isFavorite,
  toggleFavorite,
  openBigCard,
}) {
  return (
    <div className="card">
      <img src={image} alt={name} />
      <div className="card-info">
        <h3>{name}</h3>
        <p>Height: {height}</p>
        <p>Weight: {weight}</p>
      </div>
      <button
        className={`favorite-btn ${isFavorite ? "favorite" : ""}`}
        onClick={() => toggleFavorite(id)}
      >
        {isFavorite ? "★" : "☆"} {/* Display filled or empty star */}
      </button>
    </div>
  );
}

SmallCard.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  height: PropTypes.number.isRequired,
  weight: PropTypes.number.isRequired,
  isFavorite: PropTypes.bool.isRequired,
  toggleFavorite: PropTypes.func.isRequired,
  openBigCard: PropTypes.func,
};

export default SmallCard;
