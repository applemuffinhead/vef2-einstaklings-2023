import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="header">
      <Link to="/">
        <h1 className="site-title">CinePaws</h1>
      </Link>
      <h2>
        Discover, share, and connect with fellow pet lovers on CinePaws - the
        ultimate video sharing platform for animal enthusiasts!
      </h2>
      <Link to="/upload">
        <button>Add New Video</button>
      </Link>
    </header>
  );
};

export default Header;
