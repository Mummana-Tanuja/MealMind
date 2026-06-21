import React, { useState, useEffect } from "react";
import "./MoodMeals.css";
import Layout from "../components/layout/Layout";
import { getRecipes, addFoodLog } from "../services/api";
import { useAuth } from "../context/AuthContext";

const MOODS = [
  { id: "energetic", label: "Energetic",    emoji: "💪", desc: "High-protein, power meals" },
  { id: "tired",     label: "Tired",        emoji: "😴", desc: "Easy, comforting & restorative" },
  { id: "happy",     label: "Happy",        emoji: "😊", desc: "Fun and delicious picks" },
  { id: "stressed",  label: "Stressed",     emoji: "😰", desc: "Mood-boosting comfort food" },
  { id: "sick",      label: "Under the Weather", emoji: "🤒", desc: "Light, healing and gentle" },
  { id: "comfort",   label: "Comfort",      emoji: "🍲", desc: "Warm, hearty soul food" },
  { id: "lazy",      label: "Lazy",         emoji: "😑", desc: "Quick & effortless" },
];

const SLOTS = [
  { key: "breakfast", label: "Breakfast", icon: "☀️", category: "breakfast" },
  { key: "lunch",     label: "Lunch",     icon: "🌤️", category: "lunch"     },
  { key: "dinner",    label: "Dinner",    icon: "🌙", category: "dinner"    },
  { key: "snack",     label: "Snack",     icon: "🍎", category: "snack"     },
];

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function MoodMeals() {
  const { user } = useAuth();
  const today = new Date().toISOString().split("T")[0];

  const [mood,       setMood]       = useState(null);
  const [allRecipes, setAllRecipes] = useState([]);
  const [picks,      setPicks]      = useState({});   // { breakfast: id, lunch: id, ... }
  const [logging,    setLogging]    = useState(false);
  const [success,    setSuccess]    = useState(false);

  useEffect(() => {
    getRecipes({}).then((res) => setAllRecipes(res.data)).catch(() => {});
  }, []);

  const moodRecipes = (category) => {
    if (!mood) return [];
    return shuffle(
      allRecipes.filter((r) => r.category === category && r.mood.includes(mood))
    ).slice(0, 3);
  };

  const handleMoodSelect = (m) => {
    setMood(m);
    setPicks({});
    setSuccess(false);
  };

  const handlePick = (slot, recipeId) => {
    setPicks((p) => ({ ...p, [slot]: recipeId }));
  };

  const totalCal = Object.entries(picks).reduce((sum, [, id]) => {
    const r = allRecipes.find((x) => x.id === id);
    return sum + (r?.calories || 0);
  }, 0);

  const picksCount = Object.keys(picks).length;

  const handleLog = async () => {
    if (!picksCount) return;
    setLogging(true);
    try {
      await Promise.all(
        Object.entries(picks).map(([slot, id]) => {
          const recipe = allRecipes.find((r) => r.id === id);
          if (!recipe) return Promise.resolve();
          return addFoodLog({
            userId:   user.userId,
            date:     today,
            mealType: slot,
            name:     recipe.name,
            calories: recipe.calories,
            protein:  recipe.protein,
            carbs:    recipe.carbs,
            fat:      recipe.fat,
            fibre:    recipe.fibre,
          });
        })
      );
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch {}
    setLogging(false);
  };

  return (
    <Layout pageTitle="Mood Meal Picker">
      <div className="mood-page">

        {/* Hero */}
        <div className="mood-page__hero">
          <span className="mood-page__eyebrow">🎭 Eat by how you feel</span>
          <h1 className="mood-page__heading">What's your mood today?</h1>
          <p className="mood-page__sub">
            Select your mood and we'll suggest the perfect meals for breakfast, lunch, dinner and a snack.
          </p>
        </div>

        {/* Mood chips */}
        <div>
          <p className="mood-selector-label">Choose your mood</p>
          <div className="mood-chips">
            {MOODS.map((m) => (
              <button
                key={m.id}
                className={`mood-chip ${mood === m.id ? "mood-chip--active" : ""}`}
                onClick={() => handleMoodSelect(m.id)}
              >
                <span className="mood-chip__emoji">{m.emoji}</span>
                {m.label}
              </button>
            ))}
          </div>
          {mood && (
            <p style={{ fontSize: "0.8rem", color: "#5c6f63", marginTop: "0.5rem" }}>
              {MOODS.find((m) => m.id === mood)?.emoji} {MOODS.find((m) => m.id === mood)?.desc}
            </p>
          )}
        </div>

        {/* Meal slots */}
        {mood && (
          <div className="mood-slots">
            {SLOTS.map((slot) => {
              const options = moodRecipes(slot.category);
              return (
                <div className="mood-slot" key={slot.key}>
                  <div className="mood-slot__header">
                    <span className="mood-slot__icon">{slot.icon}</span>
                    <span className="mood-slot__title">{slot.label}</span>
                    {picks[slot.key] && (
                      <span className="mood-slot__selected-label">
                        ✓ {allRecipes.find((r) => r.id === picks[slot.key])?.name}
                      </span>
                    )}
                  </div>

                  {options.length === 0 ? (
                    <p className="mood-slot__empty">
                      No specific {slot.label.toLowerCase()} suggestions for this mood yet — try another mood!
                    </p>
                  ) : (
                    <div className="mood-slot__meals">
                      {options.map((recipe) => {
                        const isSelected = picks[slot.key] === recipe.id;
                        return (
                          <div
                            key={recipe.id}
                            className={`mood-meal-option ${isSelected ? "mood-meal-option--selected" : ""}`}
                            onClick={() => handlePick(slot.key, recipe.id)}
                          >
                            <span className="mood-meal-option__radio">
                              {isSelected && <span className="mood-meal-option__radio-dot" />}
                            </span>
                            <span style={{ fontSize: "1.4rem" }}>{recipe.emoji}</span>
                            <div className="mood-meal-option__info">
                              <p className="mood-meal-option__name">{recipe.name}</p>
                              <p className="mood-meal-option__meta">
                                P {recipe.protein}g · C {recipe.carbs}g · F {recipe.fat}g · 🕐 {recipe.cookTime} min
                              </p>
                            </div>
                            <span className="mood-meal-option__cal">{recipe.calories} kcal</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Log bar */}
        {mood && (
          <div className="mood-log-bar">
            <div className="mood-log-summary">
              <strong>
                {picksCount} of 4 meals selected · {totalCal.toLocaleString()} kcal total
              </strong>
              <span>Log your selections to today's food diary</span>
            </div>
            <button
              className="mood-log-btn"
              disabled={!picksCount || logging}
              onClick={handleLog}
            >
              {logging ? "Logging…" : `📝 Log ${picksCount} Meal${picksCount !== 1 ? "s" : ""}`}
            </button>
            {success && (
              <div className="mood-log-success">
                ✅ {picksCount} meal{picksCount !== 1 ? "s" : ""} logged to your food diary for today!
              </div>
            )}
          </div>
        )}

      </div>
    </Layout>
  );
}
