import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Axios from "axios";
import PropTypes from "prop-types";

import BackgroundImage from "../components/ui/BackgroundImage";
import CardsContainer from "../components/ui/CardComponents/CardsContainer";
import SmallCard from "../components/ui/CardComponents/SmallCard";
import Loader from "../components/ui/Loader";
import Error from "./errors/Error";
import Pagination from "../components/ui/Pagination";

function Home({ searchTerm, openBigCard }) {
  const [page, setPage] = useState(1);
  const [selectedType, setSelectedType] = useState(""); // State for type filtering
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favorites")) || [] // Load favorites from localStorage
  );
  const limit = 100;

  // Fetch Pokémon data with type filter (if selected)
  const {
    data: pokemonData,
    isLoading,
    isError,
    isFetching,
  } = useQuery(
    ["pokemon", searchTerm, page, selectedType], // Added selectedType to the query key
    () => {
      let url;
      if (searchTerm) {
        // If a search term is provided, fetch a single Pokémon by name
        url = `https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`;
        return Axios.get(url).then((res) => res.data);
      } else {
        // Fetch Pokémon by type or paginate
        if (selectedType) {
          url = `https://pokeapi.co/api/v2/type/${selectedType}`;
          return Axios.get(url).then((res) => {
            const requests = res.data.pokemon.map((pokemon) =>
              Axios.get(pokemon.pokemon.url)
            );
            return Promise.all(requests).then((pokemonResponses) =>
              pokemonResponses.map((pokemonRes) => pokemonRes.data)
            );
          });
        } else {
          // Fetch all Pokémon with pagination
          url = `https://pokeapi.co/api/v2/pokemon?offset=${(page - 1) * limit}&limit=${limit}`;
          return Axios.get(url).then((res) => {
            const { results } = res.data;
            const requests = results.map((result) => Axios.get(result.url));
            return Promise.all(requests).then((pokemonResponses) =>
              pokemonResponses.map((pokemonRes) => pokemonRes.data)
            );
          });
        }
      }
    },
    {
      keepPreviousData: false,
      refetchOnWindowFocus: false,
    }
  );

  function hasHomeSprite(data) {
    return data?.id < 906; // Return true if the Pokémon has a "home" sprite
  }

  function isPokemonAvailable(data) {
    return data?.id < 1009; // Return true if the Pokémon is available
  }

  const getHomeSprite = useMemo(
    () => (data) => data.sprites.other.home.front_default,
    []
  );

  const getArtworkSprite = useMemo(
    () => (data) => data.sprites.other["official-artwork"]["front_default"],
    []
  );

  function handlePrevClick() {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  }

  function handleNextClick() {
    setPage((prevPage) => prevPage + 1);
  }

  function handleTypeChange(event) {
    setSelectedType(event.target.value);
    setPage(1); // Reset to the first page when type changes
  }

  // Toggle favorite for a Pokémon
  const toggleFavorite = (pokemonId) => {
    let updatedFavorites = [...favorites];
    if (updatedFavorites.includes(pokemonId)) {
      updatedFavorites = updatedFavorites.filter((id) => id !== pokemonId);
    } else {
      updatedFavorites.push(pokemonId);
    }
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites)); // Save to localStorage
  };

  if (isLoading || isFetching) {
    return (
      <BackgroundImage>
        <Loader />
      </BackgroundImage>
    );
  } else if (isError) {
    return (
      <BackgroundImage>
        <Error />
      </BackgroundImage>
    );
  } else if (searchTerm) {
    let imageValue;

    if (!isPokemonAvailable(pokemonData)) {
      return (
        <BackgroundImage>
          <Error />
        </BackgroundImage>
      );
    }

    imageValue = hasHomeSprite(pokemonData)
      ? getHomeSprite(pokemonData)
      : getArtworkSprite(pokemonData);

    return (
      <BackgroundImage>
        <CardsContainer>
          <SmallCard
            height={pokemonData.height}
            id={pokemonData.id}
            image={imageValue}
            key={pokemonData.id}
            name={pokemonData.species.name}
            weight={pokemonData.weight}
            openBigCard={openBigCard}
            isFavorite={favorites.includes(pokemonData.id)}
            toggleFavorite={toggleFavorite}
          />
        </CardsContainer>
      </BackgroundImage>
    );
  } else {
    return (
      <BackgroundImage>
        {/* Type Filter Dropdown */}
        <div className="flex justify-center mb-4">
          <select
            className="p-2 border rounded-md"
            value={selectedType}
            onChange={handleTypeChange}
          >
            <option value="">Filter by Type</option>
            <option value="fire">Fire</option>
            <option value="water">Water</option>
            <option value="grass">Grass</option>
            <option value="electric">Electric</option>
            <option value="psychic">Psychic</option>
            <option value="bug">Bug</option>
            {/* Add other Pokémon types here */}
          </select>
        </div>

        <Pagination
          page={page}
          handlePrevClick={handlePrevClick}
          handleNextClick={handleNextClick}
        />

        {/* Displaying the favorites section */}
        <div className="mb-4 p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Favorite Pokémon</h2>
          <div className="flex flex-wrap gap-4">
            {favorites.length > 0 ? (
              pokemonData
                .filter((pokemon) => favorites.includes(pokemon.id)) // Filter favorites
                .map((pokemon) => {
                  let imageValue;
                  if (!isPokemonAvailable(pokemon)) return null;
                  imageValue = hasHomeSprite(pokemon)
                    ? getHomeSprite(pokemon)
                    : getArtworkSprite(pokemon);

                  return (
                    <SmallCard
                      height={pokemon.height}
                      id={pokemon.id}
                      image={imageValue}
                      key={pokemon.id}
                      name={pokemon.species.name}
                      weight={pokemon.weight}
                      openBigCard={openBigCard}
                      isFavorite={true} // All cards here are favorites
                      toggleFavorite={toggleFavorite}
                    />
                  );
                })
            ) : (
              <p>No favorite Pokémon yet!</p>
            )}
          </div>
        </div>

        <CardsContainer>
          {Array.isArray(pokemonData) &&
            pokemonData
              .filter((pokemon) => {
                if (!selectedType) return true; // Show all if no type is selected
                return pokemon.types.some((type) => type.type.name === selectedType); // Filter by selected type
              })
              .map((pokemon) => {
                let imageValue;
                if (!isPokemonAvailable(pokemon)) return null;
                imageValue = hasHomeSprite(pokemon)
                  ? getHomeSprite(pokemon)
                  : getArtworkSprite(pokemon);

                return (
                  <SmallCard
                    height={pokemon.height}
                    id={pokemon.id}
                    image={imageValue}
                    key={pokemon.id}
                    name={pokemon.species.name}
                    weight={pokemon.weight}
                    openBigCard={openBigCard}
                    isFavorite={favorites.includes(pokemon.id)}
                    toggleFavorite={toggleFavorite}
                  />
                );
              })}
        </CardsContainer>

        <Pagination
          page={page}
          handlePrevClick={handlePrevClick}
          handleNextClick={handleNextClick}
        />
      </BackgroundImage>
    );
  }
}

Home.propTypes = {
  searchTerm: PropTypes.string,
  openBigCard: PropTypes.func.isRequired,
};

export default Home;
