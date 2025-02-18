"use client";
import { useState, useEffect } from "react";

const API_KEY = "1aee8b10257cae02af11f2575d911c23";
const API_URL = "https://api.themoviedb.org/3";
const POPULAR_MOVIES_URL = `${API_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`;

const Home: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [popularMovies, setPopularMovies] = useState<any[]>([]);
  const [error, setError] = useState<string>("");
  const [searchCompleted, setSearchCompleted] = useState<boolean>(false);

  useEffect(() => {
    const fetchPopularMovies = async () => {
      try {
        const response = await fetch(POPULAR_MOVIES_URL);
        const data = await response.json();
        setPopularMovies(data.results);
      } catch (err) {
        console.error("Failed to fetch popular movies", err);
      }
    };

    fetchPopularMovies();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!query) return;

    setLoading(true);
    setError("");
    setMovies([]);
    setSearchCompleted(false);

    try {
      const response = await fetch(
        `${API_URL}/search/movie?api_key=${API_KEY}&query=${query}&language=en-US&page=1`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }

      const data = await response.json();
      setMovies(data.results);
      setSearchCompleted(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setSearchCompleted(true);
    } finally {
      setLoading(false);
    }
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);

    if (e.target.value === "") {
      setMovies([]);
      setSearchCompleted(false);
    }
  };

  // Function to reload the page when the logo is clicked
  const handleLogoClick = () => {
    window.location.reload();
  };

  return (
    <div className="font-family">
      <header className="header">
        <img
          src="https://image.tmdb.org/t/p/original/wwemzKWzjKYJFfCeiB57q3r4Bcm.svg"
          alt="TMDB Logo"
          className="logo"
          onClick={handleLogoClick} // Added onClick event
        />
        <h1 className="title">Movie Search</h1>
      </header>

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search for a movie..."
          value={query}
          onChange={handleQueryChange}
          className="search-input"
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>

      {loading ? (
        <div className="loading">
          <h2>Loading...</h2>
        </div>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="results">
          {searchCompleted && movies.length === 0 ? (
            <p className="result">No results found</p>
          ) : (
            movies.map((movie, index) => (
              <div key={index} className="movie-item">
                {movie.poster_path && (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="movie-poster"
                  />
                )}
                <h3 className="movie-title">{movie.title}</h3>
                <p className="movie-description">
                  {movie.overview || "No description available"}
                </p>
              </div>
            ))
          )}
        </div>
      )}

      {!searchCompleted && <h2 className="popular-title">Popular Movies</h2>}

      <div
        className={`popular-movies ${
          popularMovies.length === 0 ? "no-scrollbar" : ""
        }`}
      >
        {!searchCompleted && popularMovies.length > 0 ? (
          popularMovies.map((movie, index) => (
            <div key={index} className="movie-item">
              {movie.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="movie-poster"
                />
              )}
              <h3 className="movie-title">{movie.title}</h3>
            </div>
          ))
        ) : (
          <p>Loading popular movies...</p>
        )}
      </div>
    </div>
  );
};

export default Home;
