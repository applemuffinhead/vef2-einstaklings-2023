import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "../styles/VideoPage.css";

const VideoPage = () => {
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [username, setUsername] = useState("");
  const [userComment, setUserComment] = useState("");

  const formatDate = (dateString) => {
    if (!isValidDate(dateString)) {
      return "Invalid date";
    }

    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };

  const API_URL =
    "https://vef2-einstaklings-2023-production.up.railway.app/api";

  useEffect(() => {
    fetch(`${API_URL}/videos/${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setVideo(data);
        setLoading(false);
      });

    fetch(`${API_URL}/videos/${id}/comments`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setComments(data);
      });
  }, [id]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();

    fetch(`${API_URL}/videos/${id}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        author: username,
        content: userComment,
        created_at: new Date().toISOString().slice(0, 19).replace("T", " "),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setComments([...comments, data]);
        setUsername("");
        setUserComment("");
      });
  };

  const isValidDate = (dateString) => {
    const timestamp = Date.parse(dateString);
    return !isNaN(timestamp);
  };

  return (
    <div className="video-page-container">
      <Link to="/" className="back-button">
        &larr; Back
      </Link>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="video-wrapper">
          <h1 className="videoTitle">{video.title}</h1>
          <p className="videoDescription">{video.description}</p>
          <div className="video-comments-wrapper">
            <div className="video-container">
              <video
                src={video.url}
                controls
                style={{ height: "100vh", margin: "auto" }}
              />
            </div>
            <div className="comments-container">
              <h2>Comments</h2>
              <form onSubmit={handleCommentSubmit} className="add-comment-form">
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <textarea
                  placeholder="Your comment"
                  value={userComment}
                  onChange={(e) => setUserComment(e.target.value)}
                  required
                ></textarea>
                <button type="submit">Submit</button>
              </form>

              {comments.length > 0 ? (
                <ul>
                  {comments.map((comment, index) => (
                    <li key={comment.id}>
                      <p>{comment.content}</p>
                      <small>
                        {comment.author} - {formatDate(comment.created_at)}
                      </small>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No comments yet.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default VideoPage;
