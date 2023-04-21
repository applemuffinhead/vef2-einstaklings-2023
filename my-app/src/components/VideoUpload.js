import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/VideoUpload.css"

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
    <div>
      <h1>Upload a new video</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>
        <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <label>
          Video file:
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
  );
};

export default VideoUpload;
