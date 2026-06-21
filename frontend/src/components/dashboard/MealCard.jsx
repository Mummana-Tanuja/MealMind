import React from "react";
import "./MealCard.css";

function MealCard({ title, calories, completed }) {
  return (
    <div className={`meal-card ${completed ? "meal-card--done" : ""}`}>
      <div className="meal-card__icon">{completed ? "✅" : "🍽️"}</div>
      <div className="meal-card__body">
        <p className="meal-card__title">{title}</p>
        <p className="meal-card__cal">{calories} kcal</p>
      </div>
      <span className={`meal-card__badge ${completed ? "meal-card__badge--done" : "meal-card__badge--pending"}`}>
        {completed ? "Done" : "Pending"}
      </span>
    </div>
  );
}

export default MealCard;
