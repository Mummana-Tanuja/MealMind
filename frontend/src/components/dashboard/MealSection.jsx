import React, { useState, useEffect } from "react";
import MealCard from "./MealCard";
import "./MealSection.css";
import { getMealPlan } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function MealSection() {
  const { user } = useAuth();
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getMealPlan(user.userId)
      .then((res) => {
        const todayName = new Date().toLocaleDateString("en-US", { weekday: "long" });
        const todayPlan = res.data.weekPlan?.find((d) => d.day === todayName);
        if (todayPlan) {
          const mapped = [
            { title: `Breakfast — ${todayPlan.breakfast?.name || ""}`, calories: todayPlan.breakfast?.calories || 0, completed: false },
            { title: `Lunch — ${todayPlan.lunch?.name || ""}`,         calories: todayPlan.lunch?.calories || 0,      completed: false },
            { title: `Snack — ${todayPlan.snack?.name || ""}`,         calories: todayPlan.snack?.calories || 0,      completed: false },
            { title: `Dinner — ${todayPlan.dinner?.name || ""}`,       calories: todayPlan.dinner?.calories || 0,     completed: false },
          ].filter((m) => m.title.split("—")[1]?.trim());
          setMeals(mapped);
        }
      })
      .catch(() => {
        setMeals([
          { title: "No meal plan yet", calories: 0, completed: false },
        ]);
      })
      .finally(() => setLoading(false));
  }, [user]);

  const total = meals.reduce((s, m) => s + m.calories, 0);

  return (
    <div className="meal-section-card">
      <div className="meal-section__header">
        <h2 className="meal-section__title">Today's Meals</h2>
        <span className="meal-section__total">Total: {total} kcal</span>
      </div>
      <div className="meal-section__list">
        {loading ? (
          <p style={{ padding: "1rem", opacity: 0.6 }}>Loading meals…</p>
        ) : meals.length === 0 ? (
          <p style={{ padding: "1rem", opacity: 0.6 }}>Go to Meal Plan to generate your plan.</p>
        ) : (
          meals.map((m) => <MealCard key={m.title} {...m} />)
        )}
      </div>
    </div>
  );
}

export default MealSection;
