import { useEffect, useState } from "react";
import MovieCard from "./components/MovieCard";
import { fetchPopularMovies } from "./api";

function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-600 to-pink-600 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold text-white flex items-center gap-3">
              <span className="text-5xl">🎬</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-100">
                IMDb Clone
              </span>
            </h1>
            <div className="text-white text-sm bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
              Popular Movies
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
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

        {/* Loading State */}
        {loading ? (
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

