import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/VideoUpload.css';
import { Link } from 'react-router-dom';

const VideoUpload = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const API_URL = "https://vef2-einstaklings-2023-production.up.railway.app/api";

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    setLoading(true);
  
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('file', file);
  
    await fetch(`${API_URL}/videos/upload`, {
      method: 'POST',
      body: formData,
    });
  
    setLoading(false);
  
    navigate('/');
    window.location.reload();
  };
  

  return (
    <div className="upload-container">
      <Link to="/" className="back-button">
        &larr; Back
      </Link>
      <div className="upload-form">
        <h2>Upload a new video</h2>
        <form onSubmit={handleSubmit}>
          <label>
            <span>Title:</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>
          <label>
            <span>Description:</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
          <label>
            <span>Video file:</span>
            <input
              type="file"
              name="file"
              onChange={handleFileChange}
              required
            />
          </label>
          <button type="submit">{loading ? 'Uploading...' : 'Upload'}</button>
        </form>
      </div>
    </div>
  );
};

export default VideoUpload;
