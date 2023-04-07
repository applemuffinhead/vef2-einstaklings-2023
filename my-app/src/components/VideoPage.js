// src/VideoPage.js
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "../styles/VideoPage.css";

const VideoPage = () => {
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    fetch(`http://localhost:4000/api/videos/${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setVideo(data);
        setLoading(false);
      });
  }, [id]);

  return (
    <div>
      <Link to="/" className="back-button">
        &larr; Back
      </Link>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <h1 className="videoTitle">{video.title}</h1>
          <div className="video-container">
            <video src={video.url} controls width="100%" />{" "}
          </div>
          <p className="videoDescription">{video.description}</p>
        </>
      )}
    </div>
  );
};

export default VideoPage;
