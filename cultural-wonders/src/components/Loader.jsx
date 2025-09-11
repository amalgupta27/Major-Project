import React from "react";
import "./Loader.css";

const Loader = () => (
  <div className="loader-overlay">
    <div className="loader-spinner">
      <div className="loader-circle" />
      <div className="loader-text">Loading...</div>
    </div>
  </div>
);

export default Loader;
