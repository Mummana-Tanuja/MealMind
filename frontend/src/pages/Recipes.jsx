import React, { useState, useEffect } from "react";
import "./Recipes.css";
import Layout from "../components/layout/Layout";
import { getRecipes, addFoodLog } from "../services/api";
import { useAuth } from "../context/AuthContext";

const CATEGORIES = ["all", "breakfast", "lunch", "dinner", "snack"];
const DIETS = ["all", "vegetarian", "vegan", "non-vegetarian"];

const DIET_LABELS = {
  vegetarian: { label: "Veg", cls: "tag-veg" },
  vegan:      { label: "Vegan", cls: "tag-vegan" },
  "non-vegetarian": { label: "Non-Veg", cls: "tag-non-veg" },
};

function difficultyEmoji(d) {
  if (d === "Easy")   return "🟢";
  if (d === "Medium") return "🟡";
  return "🔴";
}

function RecipeModal({ recipe, onClose, onLogged }) {
  const { user } = useAuth();
  const [logging, setLogging] = useState(false);
  const [logged,  setLogged]  = useState(false);
  const today = new Date().toISOString().split("T")[0];

  const handleLog = async () => {
    setLogging(true);
    try {
      await addFoodLog({
        userId:   user.userId,
        date:     today,
        mealType: recipe.category === "snack" ? "snack" : recipe.category,
        name:     recipe.name,
        calories: recipe.calories,
        protein:  recipe.protein,
        carbs:    recipe.carbs,
        fat:      recipe.fat,
        fibre:    recipe.fibre,
      });
      setLogged(true);
      if (onLogged) onLogged();
    } catch {}
    setLogging(false);
  };

  return (
    <div className="recipe-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="recipe-modal">
        {/* Hero */}
        <div className="recipe-modal__hero">
          <button className="recipe-modal__close" onClick={onClose}>✕</button>
          <span className="recipe-modal__emoji">{recipe.emoji}</span>
          <h2 className="recipe-modal__title">{recipe.name}</h2>
          <p className="recipe-modal__desc">{recipe.description}</p>
        </div>

        {/* Macro strip */}
        <div className="recipe-modal__stats">
          {[
            { val: recipe.calories, lbl: "Calories" },
            { val: `${recipe.protein}g`, lbl: "Protein" },
            { val: `${recipe.carbs}g`, lbl: "Carbs" },
            { val: `${recipe.fat}g`, lbl: "Fat" },
          ].map((s) => (
            <div className="recipe-modal__stat" key={s.lbl}>
              <span className="recipe-modal__stat-val">{s.val}</span>
              <span className="recipe-modal__stat-lbl">{s.lbl}</span>
            </div>
          ))}
        </div>

        <div className="recipe-modal__body">
          {/* Meta */}
          <p style={{ fontSize: "0.8rem", color: "#5c6f63", marginTop: 0, marginBottom: "1.25rem" }}>
            🕐 {recipe.cookTime} min &nbsp;·&nbsp; 🍽️ {recipe.servings} serving{recipe.servings > 1 ? "s" : ""} &nbsp;·&nbsp; {difficultyEmoji(recipe.difficulty)} {recipe.difficulty}
          </p>

          {/* Ingredients */}
          <p className="recipe-modal__section-title">📦 Ingredients</p>
          <ul className="recipe-modal__ingredients">
            {recipe.ingredients.map((ing, i) => (
              <li key={i} className="recipe-modal__ingredient">
                <strong>{ing.amount} {ing.unit}</strong>&nbsp;{ing.name}
              </li>
            ))}
          </ul>

          {/* Steps */}
          <p className="recipe-modal__section-title">👨‍🍳 Instructions</p>
          <ol className="recipe-modal__steps">
            {recipe.steps.map((step, i) => (
              <li key={i} className="recipe-modal__step">
                <span className="recipe-modal__step-num">{i + 1}</span>
                <span className="recipe-modal__step-text">{step}</span>
              </li>
            ))}
          </ol>

          {/* Log button */}
          <button
            className="recipe-modal__log-btn"
            onClick={handleLog}
            disabled={logging || logged}
          >
            {logged ? "✅ Logged to Today's Food!" : logging ? "Logging…" : "＋ Log as Today's Meal"}
          </button>
          {logged && <p className="recipe-modal__log-success">Added to your food log for today!</p>}
        </div>
      </div>
    </div>
  );
}

function RecipeCard({ recipe, onClick }) {
  const catClass = `tag-${recipe.category}`;
  const catLabel = recipe.category.charAt(0).toUpperCase() + recipe.category.slice(1);

  return (
    <div className="recipe-card" onClick={() => onClick(recipe)}>
      <div className="recipe-card__hero">{recipe.emoji}</div>
      <div className="recipe-card__body">
        <div className="recipe-card__tags">
          <span className={`recipe-card__tag ${catClass}`}>{catLabel}</span>
          {recipe.diet.map((d) => (
            <span key={d} className={`recipe-card__tag ${DIET_LABELS[d]?.cls || ""}`}>
              {DIET_LABELS[d]?.label || d}
            </span>
          ))}
        </div>
        <h3 className="recipe-card__name">{recipe.name}</h3>
        <p className="recipe-card__desc">{recipe.description}</p>
        <div className="recipe-card__meta">
          <span className="recipe-card__meta-item">🕐 {recipe.cookTime} min</span>
          <span className="recipe-card__meta-item">{difficultyEmoji(recipe.difficulty)} {recipe.difficulty}</span>
          <span className="recipe-card__meta-item">🔥 {recipe.calories} kcal</span>
        </div>
      </div>
    </div>
  );
}

export default function Recipes() {
  const [recipes,    setRecipes]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState("");
  const [category,   setCategory]   = useState("all");
  const [diet,       setDiet]       = useState("all");
  const [selected,   setSelected]   = useState(null);

  const load = () => {
    setLoading(true);
    const params = {};
    if (category !== "all") params.category = category;
    if (diet     !== "all") params.diet     = diet;
    if (search)              params.search  = search;
    getRecipes(params)
      .then((res) => setRecipes(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [category, diet, search]);

  return (
    <Layout pageTitle="Recipe Library">
      <div className="recipes-page">

        {/* Controls */}
        <div className="recipes-controls">
          <div className="recipes-search">
            <span className="recipes-search__icon">🔍</span>
            <input
              className="recipes-search__input"
              type="text"
              placeholder="Search recipes…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Category filters */}
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                className={`recipes-filter-btn ${category === c ? "recipes-filter-btn--active" : ""}`}
                onClick={() => setCategory(c)}
              >
                {c === "all" ? "All Meals" : c.charAt(0).toUpperCase() + c.slice(1)}
              </button>
            ))}
          </div>

          {/* Diet filters */}
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {DIETS.map((d) => (
              <button
                key={d}
                className={`recipes-filter-btn ${diet === d ? "recipes-filter-btn--active" : ""}`}
                onClick={() => setDiet(d)}
              >
                {d === "all" ? "All Diets" : d === "non-vegetarian" ? "Non-Veg" : d.charAt(0).toUpperCase() + d.slice(1)}
              </button>
            ))}
          </div>

          <p className="recipes-results-count">
            {loading ? "Loading…" : `${recipes.length} recipe${recipes.length !== 1 ? "s" : ""} found`}
          </p>
        </div>

        {/* Grid */}
        {!loading && recipes.length === 0 ? (
          <div className="recipes-empty">
            <span className="recipes-empty__icon">🍽️</span>
            No recipes match your filters. Try changing the category or diet.
          </div>
        ) : (
          <div className="recipes-grid">
            {recipes.map((r) => (
              <RecipeCard key={r.id} recipe={r} onClick={setSelected} />
            ))}
          </div>
        )}
      </div>

      {selected && (
        <RecipeModal
          recipe={selected}
          onClose={() => setSelected(null)}
          onLogged={() => {}}
        />
      )}
    </Layout>
  );
}
