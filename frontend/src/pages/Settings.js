import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Settings.css";
import { useAuth } from "../context/AuthContext";

function Settings() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleDelete = () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account?");
    if (confirmDelete) {
      alert("Account deletion coming soon.");
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-card">
        <h1>⚙️ Settings</h1>

        <div className="section">
          <h2>🔒 Security</h2>
          <button className="btn">Change Password</button>
          <button className="btn logout" onClick={handleLogout}>Logout</button>
        </div>

        <div className="section">
          <h2>🔔 Notifications</h2>
          <div className="setting-row"><span>Meal Reminder</span><input type="checkbox" defaultChecked /></div>
          <div className="setting-row"><span>Water Reminder</span><input type="checkbox" defaultChecked /></div>
          <div className="setting-row"><span>Weekly Report</span><input type="checkbox" /></div>
          <div className="setting-row"><span>Email Notifications</span><input type="checkbox" /></div>
        </div>

        <div className="section">
          <h2>🎨 Appearance</h2>
          <div className="setting-row">
            <span>Light Mode</span>
            <input type="radio" name="theme" checked={!darkMode} onChange={() => setDarkMode(false)} />
          </div>
          <div className="setting-row">
            <span>Dark Mode</span>
            <input type="radio" name="theme" checked={darkMode} onChange={() => setDarkMode(true)} />
          </div>
        </div>

        <div className="section">
          <h2>📏 Units</h2>
          <label>Weight</label>
          <select><option>Kg</option><option>Pounds</option></select>
          <label>Height</label>
          <select><option>cm</option><option>Feet</option></select>
        </div>

        <div className="section">
          <h2>⏰ Meal Timings</h2>
          <input type="time" defaultValue="08:00" />
          <input type="time" defaultValue="13:00" />
          <input type="time" defaultValue="20:00" />
        </div>

        <div className="section danger">
          <h2>🔴 Danger Zone</h2>
          <button className="btn danger-btn" onClick={handleDelete}>Delete Account</button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
