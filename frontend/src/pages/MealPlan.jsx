import React, { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import "./MealPlan.css";
import { getMealPlan, generateMealPlan } from "../services/api";
import { useAuth } from "../context/AuthContext";

const MEAL_ORDER = [
  { key: "breakfast", label: "Breakfast", icon: "🍳" },
  { key: "snack",     label: "Snack",     icon: "🍎" },
  { key: "lunch",     label: "Lunch",     icon: "🍛" },
  { key: "dinner",    label: "Dinner",    icon: "🍗" },
];

const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

function MealPlan() {
  const { user } = useAuth();
  const [weekPlan, setWeekPlan] = useState([]);
  const [activeDay, setActiveDay] = useState(() => {
    return new Date().toLocaleDateString("en-US", { weekday: "long" });
  });
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const fetchPlan = () => {
    if (!user) return;
    setLoading(true);
    getMealPlan(user.userId)
      .then((res) => setWeekPlan(res.data.weekPlan || []))
      .catch(() => setWeekPlan([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPlan(); }, [user]);

  const handleGenerate = async () => {
    if (!user) return;
    setGenerating(true);
    try {
      const res = await generateMealPlan(user.userId);
      setWeekPlan(res.data.weekPlan || []);
    } catch {}
    setGenerating(false);
  };

  const todayPlan = weekPlan.find((d) => d.day === activeDay) || null;

  const nutrition = todayPlan
    ? MEAL_ORDER.reduce((acc, { key }) => {
        const m = todayPlan[key];
        if (m) {
          acc.calories += m.calories || 0;
          acc.protein  += m.protein  || 0;
          acc.carbs    += m.carbs    || 0;
          acc.fat      += m.fat      || 0;
          acc.fibre    += m.fibre    || 0;
        }
        return acc;
      }, { calories: 0, protein: 0, carbs: 0, fat: 0, fibre: 0 })
    : null;

  return (
    <Layout pageTitle="Meal Plan">
      <div className="mealplan-page">
        <div className="mealplan-header">
          <div>
            <div className="mealplan-title">Weekly Meal Plan</div>
            <p className="mealplan-subtitle">
              {weekPlan.length > 0
                ? "Your personalised plan based on your diet preference."
                : "No plan yet — click Generate to create your personalised plan."}
            </p>
          </div>
          <button className="btn btn-danger" onClick={handleGenerate} disabled={generating}>
            {generating ? "Generating…" : "🔄 Generate Plan"}
          </button>
        </div>

        {/* Day tabs */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
          {DAYS.map((day) => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              style={{
                padding: "0.4rem 1rem",
                borderRadius: "999px",
                border: "2px solid #2f8f4e",
                background: activeDay === day ? "#2f8f4e" : "transparent",
                color: activeDay === day ? "#fff" : "#2f8f4e",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.85rem",
              }}
            >
              {day.slice(0, 3)}
            </button>
          ))}
        </div>

        {loading ? (
          <p style={{ opacity: 0.6 }}>Loading meal plan…</p>
        ) : weekPlan.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem", opacity: 0.6 }}>
            <p>No meal plan found. Click "Generate Plan" to create your 7-day personalised plan.</p>
          </div>
        ) : (
          <>
            {nutrition && (
              <div className="nutrition-grid">
                <div className="stat-card"><span className="stat-label">Calories</span><strong>{nutrition.calories}</strong></div>
                <div className="stat-card"><span className="stat-label">Protein</span><strong>{nutrition.protein}g</strong></div>
                <div className="stat-card"><span className="stat-label">Carbs</span><strong>{nutrition.carbs}g</strong></div>
                <div className="stat-card"><span className="stat-label">Fats</span><strong>{nutrition.fat}g</strong></div>
                <div className="stat-card"><span className="stat-label">Fiber</span><strong>{nutrition.fibre}g</strong></div>
              </div>
            )}

            <div className="meal-cards">
              {MEAL_ORDER.map(({ key, label, icon }) => {
                const meal = todayPlan?.[key];
                if (!meal) return null;
                return (
                  <article key={key} className="meal-card">
                    <div className="meal-card-head">
                      <span className="meal-card-icon">{icon}</span>
                      <div>
                        <h3>{label}</h3>
                        <p className="meal-card-title">{meal.name}</p>
                      </div>
                    </div>
                    <div className="meal-meta">
                      <span>{meal.calories} kcal</span>
                      <span>{meal.protein}g protein</span>
                      <span>{meal.carbs}g carbs</span>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

export default MealPlan;
