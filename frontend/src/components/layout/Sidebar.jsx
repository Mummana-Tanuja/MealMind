import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";
import mealmindLogo from "./mealmindlogo.png";
import { useAuth } from "../../context/AuthContext";

const NAV_SECTIONS = [
  {
    section: "Main",
    items: [
      { label: "Dashboard",      path: "/dashboard",    icon: "⊞" },
      { label: "Meal Plan",      path: "/mealplan",     icon: "🥗" },
      { label: "Mood Meals",     path: "/mood-meals",   icon: "😊" },
      { label: "Analytics",      path: "/analytics",    icon: "📊" },
    ],
  },
  {
    section: "Discover",
    items: [
      { label: "Recipe Library", path: "/recipes",      icon: "📚" },
      { label: "Shopping List",  path: "/shoppinglist", icon: "🛒" },
    ],
  },
  {
    section: "Account",
    items: [
      { label: "Profile",        path: "/profile",      icon: "👤" },
      { label: "Settings",       path: "/settings",     icon: "⚙️" },
    ],
  },
];

function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const { user, logout } = useAuth();

  const initials = user?.displayName
    ? user.displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.slice(0, 2).toUpperCase() || "MM";

  return (
    <>
      {isOpen ? <div className="sidebar-overlay" onClick={onClose} /> : null}
      <aside className={`sidebar ${isOpen ? "" : "sidebar--closed"}`}>
        <div className="sidebar__brand">
          <Link to="/dashboard" className="sidebar__brand-link">
            <img className="sidebar__logo" src={mealmindLogo} alt="MealMind logo" />
            <span className="sidebar__brand-name">Meal Mind</span>
          </Link>
        </div>

        <nav className="sidebar__nav">
          {NAV_SECTIONS.map((sec) => (
            <div className="sidebar__section" key={sec.section}>
              <p className="sidebar__section-label">{sec.section}</p>
              {sec.items.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`sidebar__link ${location.pathname === item.path ? "sidebar__link--active" : ""}`}
                >
                  <span className="sidebar__icon">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar__bottom">
          <div className="sidebar__user">
            <div className="sidebar__avatar">{initials}</div>
            <div style={{ minWidth: 0 }}>
              <p className="sidebar__user-name" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user?.displayName || user?.email}
              </p>
              <p className="sidebar__user-role">Member</p>
            </div>
          </div>
          <button onClick={logout} className="sidebar__logout" style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <span>⎋</span> Logout
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
