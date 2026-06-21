import React from "react";
import "./TopStats.css";
import { useNavigate } from "react-router-dom";

const STATS = [
  { icon: "🥨", label: "Snacks Today", value: "2", accent: "#2f8f4e" },
  { icon: "🛒", label: "Shopping Items", value: "10", accent: "#79bf7a" },
  { icon: "🎯", label: "Goal Progress", value: "70%", accent: "#f49b24" },
  { icon: "💰", label: "Daily Budget", value: "₹2,500", accent: "#e8842f" },
];

function TopStats() {
  const navigate = useNavigate();

  const handleCardClick = (label) => {
    if (label === "Shopping Items") {
      navigate("/shoppinglist");
    }
  };

  return (
    <div className="top-stats">
      {STATS.map((s) => (
        <div
          className="stat-card"
          key={s.label}
          style={{
            "--accent": s.accent,
            cursor:
              s.label === "Shopping Items"
                ? "pointer"
                : "default",
          }}
          onClick={() => handleCardClick(s.label)}
        >
          <div className="stat-card__icon">{s.icon}</div>

          <div className="stat-card__body">
            <span className="stat-card__label">
              {s.label}
            </span>

            <span className="stat-card__value">
              {s.value}
            </span>
          </div>

          <div className="stat-card__bar" />
        </div>
      ))}
    </div>
  );
}

export default TopStats;