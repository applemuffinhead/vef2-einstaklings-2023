import React, { useState } from "react";
import { Link } from "react-router-dom";

const Home = ({ videos, loading, totalCount, setOffset, setLoadMore, searchTerm, setSearchTerm }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const search = e.target.search.value.trim();
    setSearchTerm(search);
    setCurrentPage(1);
  };

  const handleSearchReset = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleLoadMore = () => {
    setCurrentPage(currentPage + 1);
    setLoadMore(true);
    setOffset(currentPage * itemsPerPage);
  };

  const displayedVideos = videos
    .filter((video) =>
      video.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(0, itemsPerPage * currentPage);

  return (
    <div>
      <div className="search-container">
        <form onSubmit={handleSearchSubmit}>
          <input
            type="text"
            name="search"
            className="search-input"
            placeholder="Search by title..."
          />
          <button type="submit">Search</button>
          {searchTerm && (
            <button type="button" onClick={handleSearchReset}>
              Reset
            </button>
          )}
        </form>
      </div>
      <div className="grid-container">
        {loading ? (
          <p>Loading...</p>
        ) : displayedVideos.length === 0 ? (
          <p>No videos found</p>
        ) : (
          displayedVideos.map((video, index) => (
            <Link key={`${video.id}-${index}`} to={`/videos/${video.id}`}>
              <div className="thumbnail-container">
                <img src={video.thumbnail_url} alt={video.title} />
                <div className="title">{video.title}</div>
              </div>
            </Link>
          ))
        )}
      </div>
      {displayedVideos.length >= 9 && displayedVideos.length < totalCount && (
        <div className="load-more">
          <button onClick={handleLoadMore}>Load More</button>
        </div>
      )}
    </div>
  );
};

export default Home;
