import React from "react";
import "./Components.css";
import botImage from "../images/titleLogo.png";

function Navbar() {
  return (
    <div className="navbarContainer">
      <div className="navHeader">
        <h3>Chat with Your Database</h3>
      </div>
      <div className="logoImg">
        <img src={botImage} alt="logo img"></img>
      </div>
    </div>
  );
}

export default Navbar;
