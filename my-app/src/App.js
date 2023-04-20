import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import VideoPage from "./components/VideoPage";
import VideoUpload from "./components/VideoUpload";
import Home from "./components/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./styles/SearchBar.css";
import "./styles/Home.css";
import "./styles/Footer.css";
import "./styles/Header.css";

const App = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [setLoadMore] = useState(false);
  const [setOffset] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const countResponse = await fetch(
        `http://localhost:4000/api/videos/count`
      );
      const countData = await countResponse.json();
      console.log("Total count data:", countData);
      setTotalCount(countData.totalCount);

      const videosResponse = await fetch(
        `http://localhost:4000/api/videos?limit=${countData.totalCount}&offset=0`
      );
      const videosData = await videosResponse.json();
      console.log("Received data:", videosData);
      setVideos(videosData);

      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div>
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <Home
              videos={videos}
              loading={loading}
              totalCount={totalCount}
              setOffset={setOffset}
              setLoadMore={setLoadMore}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          }
        />
        <Route path="/videos/:id" element={<VideoPage />} />
        <Route path="/upload" element={<VideoUpload />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
