import { useEffect, useState } from "react";
import MovieCard from "./components/MovieCard";
import { fetchPopularMovies, fetchMoviesByQuery } from "./api";

function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);
      try {
        const moviesData = await fetchPopularMovies();
        setMovies(moviesData);
      } catch (error) {
        console.error("Failed to load movies:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, []);

  // Debounced search effect
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    const timer = setTimeout(() => {
      // perform search
      fetchMoviesByQuery(searchQuery)
        .then((res) => {
          setSearchResults(res || []);
        })
        .catch((err) => {
          console.error("Search failed:", err);
          setSearchResults([]);
        })
        .finally(() => setSearching(false));
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-600 to-pink-600 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">🎬</span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                IMDb Clone
              </h1>
            </div>
            <div className="hidden sm:block text-white text-sm bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
              Popular Movies
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        
        {/* SEARCH BAR - MOVED HERE FOR VISIBILITY */}
        <div style={{
          marginBottom: '30px',
          backgroundColor: '#1f2937',
          padding: '20px',
          borderRadius: '10px',
          border: '3px solid #fbbf24'
        }}>
          <h2 style={{color: '#fbbf24', fontSize: '20px', marginBottom: '15px', fontWeight: 'bold'}}>
            🔍 Search Movies
          </h2>
          <div style={{position: 'relative'}}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Type movie name here..."
              style={{
                width: '100%',
                padding: '16px 24px',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                color: '#000000',
                fontSize: '18px',
                fontWeight: '500',
                border: '2px solid #fbbf24',
                boxShadow: '0 4px 10px rgba(251, 191, 36, 0.3)'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '16px'
                }}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Error Alert */}
        {!process.env.REACT_APP_TMDB_API_KEY && (
          <div className="bg-red-500 text-white p-4 rounded-lg mb-8 flex items-center gap-3 shadow-lg">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-bold">Missing API Key!</p>
              <p className="text-sm">Please create a .env file with REACT_APP_TMDB_API_KEY</p>
            </div>
          </div>
        )}

        {/* If user is searching show search results, otherwise show popular movies */}
        {searchQuery.trim() !== "" ? (
          searching ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-500 mb-4"></div>
              <p className="text-white text-xl">Searching...</p>
            </div>
          ) : searchResults && searchResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {searchResults.map((movie) => (
                <MovieCard
                  key={movie.id}
                  title={movie.title}
                  year={movie.release_date?.slice(0, 4)}
                  rating={movie.vote_average}
                  poster={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "https://via.placeholder.com/500x750?text=No+Poster"}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-white text-2xl mb-2">No Results Found</p>
              <p className="text-gray-400">Try a different title</p>
            </div>
          )
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-500 mb-4"></div>
            <p className="text-white text-xl">Loading movies...</p>
          </div>
        ) : movies && movies.length > 0 ? (
          /* Movie Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                title={movie.title}
                year={movie.release_date?.slice(0, 4)}
                rating={movie.vote_average}
                poster={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              />
            ))}
          </div>
        ) : (
          /* No Movies State */
          <div className="text-center py-20">
            <p className="text-white text-xl mb-2">🎥 No movies to display</p>
            <p className="text-gray-400">Check your API key and try again.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 mt-16 py-6">
        <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
          <p>Made with ❤️ using React & Tailwind CSS</p>
          <p className="mt-2">Data provided by The Movie Database (TMDb)</p>
        </div>
      </footer>
    </div>
  );
}

export default App;

