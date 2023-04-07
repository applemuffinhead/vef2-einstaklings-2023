// App.js
import React, { useState, useEffect } from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import VideoPage from './components/VideoPage';
import './App.css';

const App = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:4000/api/videos')
      .then((res) => res.json())
      .then((data) => {
        setVideos(data.slice(0, 9));
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <header className="header">
        <h1>CinePaws</h1>
        <h2>Discover, share, and connect with fellow pet lovers on CinePaws - the ultimate video sharing platform for animal enthusiasts!</h2>
      </header>
      <Routes>
        <Route path="/" element={<Home videos={videos} loading={loading} />} />
        <Route path="/videos/:id" element={<VideoPage />} />
      </Routes>
    </div>
  );
};

const Home = ({ videos, loading }) => (
  <div className="grid-container">
    {loading ? (
      <p>Loading...</p>
    ) : (
      videos.map((video) => (
        <Link key={video.id} to={`/videos/${video.id}`}>
          <div className="thumbnail-container">
            <img src={video.thumbnail_url} alt={video.title} />
            <div className="title">{video.title}</div>
          </div>
        </Link>
      ))
    )}
  </div>
);

export default App;
