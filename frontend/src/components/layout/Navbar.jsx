import React, { useState } from "react";
import "./Navbar.css";

function Navbar({ onMenuClick, pageTitle }) {
  const [search, setSearch] = useState("");

  return (
    <header className="navbar">
      <div className="navbar__left">
        <button className="navbar__hamburger" onClick={onMenuClick} aria-label="Toggle menu">
          <span /><span /><span />
        </button>
        <div>
          <h1 className="navbar__title">{pageTitle || "Dashboard"}</h1>
          <p className="navbar__sub">Welcome back, Admin 👋</p>
        </div>
      </div>

      <div className="navbar__right">
        <div className="navbar__search-wrap">
          <span className="navbar__search-icon">🔍</span>
          <input
            type="text"
            className="navbar__search"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button className="navbar__bell" title="Notifications">
          🔔
          <span className="navbar__badge">3</span>
        </button>

        <div className="navbar__profile">
          <div className="navbar__avatar">AK</div>
          <div className="navbar__profile-info">
            <span className="navbar__name">Admin Kumar</span>
            <span className="navbar__role">Super Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
