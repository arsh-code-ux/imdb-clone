function MovieCard({ title, year, rating, poster }) {
  return (
    <div className="group relative bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105">
      {/* Movie Poster */}
      <div className="relative overflow-hidden aspect-[2/3]">
        <img 
          src={poster} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Rating Badge */}
        <div className="absolute top-3 right-3 bg-yellow-400 text-black font-bold px-3 py-1 rounded-full text-sm flex items-center gap-1 shadow-lg">
          <span>⭐</span>
          <span>{rating.toFixed(1)}</span>
        </div>
      </div>

      {/* Movie Info */}
      <div className="p-4 bg-gradient-to-b from-gray-800 to-gray-900">
        <h3 className="text-white font-bold text-lg mb-2 line-clamp-2 group-hover:text-red-400 transition-colors">
          {title}
        </h3>
        <div className="flex items-center justify-between">
          <p className="text-gray-400 text-sm flex items-center gap-1">
            <span>📅</span>
            <span>{year || 'N/A'}</span>
          </p>
          <div className="bg-red-600 text-white text-xs px-2 py-1 rounded">
            Movie
          </div>
        </div>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-red-500 rounded-xl pointer-events-none transition-colors duration-300"></div>
    </div>
  );
}

export default MovieCard;