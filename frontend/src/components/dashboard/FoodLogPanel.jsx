import React, { useState, useEffect, useCallback, useRef } from "react";
import "./FoodLogPanel.css";
import { addFoodLog, getFoodHistory } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const MEAL_TYPES = [
  { value: "breakfast", label: "Breakfast", color: "#f49b24" },
  { value: "lunch",     label: "Lunch",     color: "#2f8f4e" },
  { value: "snack",     label: "Snack",     color: "#38bdf8" },
  { value: "dinner",    label: "Dinner",    color: "#a855f7" },
];

const PRESETS = [
  { name: "Banana",       calories: 89,  protein: 1,  carbs: 23, fat: 0  },
  { name: "Boiled Egg",   calories: 78,  protein: 6,  carbs: 1,  fat: 5  },
  { name: "Oats (100g)",  calories: 389, protein: 17, carbs: 66, fat: 7  },
  { name: "Rice (1 cup)", calories: 206, protein: 4,  carbs: 45, fat: 0  },
  { name: "Dal (1 cup)",  calories: 230, protein: 16, carbs: 40, fat: 1  },
  { name: "Chicken 100g",calories: 165, protein: 31, carbs: 0,  fat: 4  },
  { name: "Milk 200ml",  calories: 122, protein: 6,  carbs: 10, fat: 6  },
  { name: "Apple",       calories: 95,  protein: 0,  carbs: 25, fat: 0  },
  { name: "Paneer 100g", calories: 265, protein: 18, carbs: 4,  fat: 20 },
  { name: "Roti",        calories: 120, protein: 3,  carbs: 25, fat: 1  },
];

const EMPTY = { name: "", mealType: "breakfast", calories: "", protein: "", carbs: "", fat: "" };

const DOT_CLASS = { breakfast: "dot-breakfast", lunch: "dot-lunch", dinner: "dot-dinner", snack: "dot-snack" };

export default function FoodLogPanel({ onLogged }) {
  const { user } = useAuth();
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm]         = useState(EMPTY);
  const [logs, setLogs]         = useState([]);
  const [totalCal, setTotalCal] = useState(0);
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);

  /* ── Search state ── */
  const [query, setQuery]           = useState("");
  const [results, setResults]       = useState([]);
  const [searching, setSearching]   = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchTimer                 = useRef(null);
  const searchRef                   = useRef(null);

  const loadLogs = useCallback(() => {
    if (!user) return;
    getFoodHistory(user.userId, today)
      .then((res) => {
        setLogs(res.data.logs || []);
        setTotalCal(res.data.totals?.calories || 0);
      })
      .catch(() => {});
  }, [user, today]);

  useEffect(() => { loadLogs(); }, [loadLogs]);

  /* Close dropdown when clicking outside */
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ── Food search via Open Food Facts ── */
  const handleQueryChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setShowResults(true);

    clearTimeout(searchTimer.current);
    if (val.trim().length < 2) { setResults([]); return; }

    searchTimer.current = setTimeout(async () => {
      setSearching(true);
      try {
        const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(val)}&json=1&page_size=8&fields=product_name,nutriments,brands`;
        const res = await fetch(url);
        const data = await res.json();
        const items = (data.products || [])
          .filter((p) => p.product_name && p.nutriments?.["energy-kcal_100g"])
          .slice(0, 6)
          .map((p) => ({
            name:     p.product_name,
            brand:    p.brands || "",
            calories: Math.round(p.nutriments["energy-kcal_100g"] || 0),
            protein:  Math.round(p.nutriments["proteins_100g"] || 0),
            carbs:    Math.round(p.nutriments["carbohydrates_100g"] || 0),
            fat:      Math.round(p.nutriments["fat_100g"] || 0),
          }));
        setResults(items);
      } catch {
        setResults([]);
      }
      setSearching(false);
    }, 500);
  };

  const selectSearchResult = (item) => {
    setForm((f) => ({
      ...f,
      name:     item.name,
      calories: item.calories,
      protein:  item.protein,
      carbs:    item.carbs,
      fat:      item.fat,
    }));
    setQuery(item.name);
    setShowResults(false);
    setResults([]);
  };

  const fillPreset = (preset) => {
    setForm((f) => ({
      ...f,
      name:     preset.name,
      calories: preset.calories,
      protein:  preset.protein,
      carbs:    preset.carbs,
      fat:      preset.fat,
    }));
  };

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.calories) return;
    setLoading(true);
    try {
      await addFoodLog({
        userId:   user.userId,
        date:     today,
        mealType: form.mealType,
        name:     form.name.trim(),
        calories: Number(form.calories),
        protein:  Number(form.protein) || 0,
        carbs:    Number(form.carbs)   || 0,
        fat:      Number(form.fat)     || 0,
        fibre:    0,
      });
      setForm(EMPTY);
      setQuery("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
      loadLogs();
      if (onLogged) onLogged();
    } catch {}
    setLoading(false);
  };

  return (
    <div className="flp">
      {/* Header */}
      <div className="flp__header">
        <div className="flp__title-wrap">
          <span className="flp__eyebrow">🥗 Track Your Intake</span>
          <h2 className="flp__title">Food Logger</h2>
        </div>
        <div className="flp__today-cal">
          <span>Today</span>
          <strong>{totalCal.toLocaleString()} kcal</strong>
        </div>
      </div>

      {/* ── Food Search ── */}
      <div className="flp__search-wrap" ref={searchRef}>
        <div className="flp__search-box">
          <span className="flp__search-icon">🔍</span>
          <input
            className="flp__search-input"
            type="text"
            placeholder="Search any food (e.g. Greek yogurt, pizza…)"
            value={query}
            onChange={handleQueryChange}
            onFocus={() => results.length > 0 && setShowResults(true)}
          />
          {searching && <span className="flp__search-spin">⏳</span>}
        </div>

        {showResults && results.length > 0 && (
          <div className="flp__search-results">
            {results.map((item, i) => (
              <button
                key={i}
                type="button"
                className="flp__search-result"
                onClick={() => selectSearchResult(item)}
              >
                <div className="flp__sr-info">
                  <span className="flp__sr-name">{item.name}</span>
                  {item.brand && <span className="flp__sr-brand">{item.brand.split(",")[0]}</span>}
                </div>
                <div className="flp__sr-macros">
                  <span className="flp__sr-cal">{item.calories} kcal</span>
                  <span className="flp__sr-tag">P {item.protein}g</span>
                  <span className="flp__sr-tag">C {item.carbs}g</span>
                  <span className="flp__sr-tag">F {item.fat}g</span>
                </div>
              </button>
            ))}
            <p className="flp__sr-credit">Powered by Open Food Facts · per 100g</p>
          </div>
        )}
        {showResults && !searching && query.length >= 2 && results.length === 0 && (
          <div className="flp__search-results">
            <p className="flp__sr-empty">No results found. Try a different name or use Quick Add below.</p>
          </div>
        )}
      </div>

      {/* Quick Presets */}
      <p className="flp__presets-label">Quick Add</p>
      <div className="flp__presets">
        {PRESETS.map((p) => (
          <button key={p.name} className="flp__preset-chip" type="button" onClick={() => fillPreset(p)}>
            {p.name}
          </button>
        ))}
      </div>

      {/* Form */}
      <form className="flp__form" onSubmit={handleSubmit}>
        <div className="flp__row">
          <div className="flp__field" style={{ gridColumn: "1 / -1" }}>
            <label>Food Name</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Grilled Chicken Bowl" required />
          </div>
        </div>

        <div className="flp__row">
          <div className="flp__field">
            <label>Meal Type</label>
            <select name="mealType" value={form.mealType} onChange={handleChange}>
              {MEAL_TYPES.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>
          <div className="flp__field">
            <label>Calories (kcal)</label>
            <input type="number" name="calories" value={form.calories} onChange={handleChange} placeholder="e.g. 350" required min="0" />
          </div>
        </div>

        <div className="flp__row flp__row--3">
          <div className="flp__field">
            <label>Protein (g)</label>
            <input type="number" name="protein" value={form.protein} onChange={handleChange} placeholder="0" min="0" />
          </div>
          <div className="flp__field">
            <label>Carbs (g)</label>
            <input type="number" name="carbs" value={form.carbs} onChange={handleChange} placeholder="0" min="0" />
          </div>
          <div className="flp__field">
            <label>Fat (g)</label>
            <input type="number" name="fat" value={form.fat} onChange={handleChange} placeholder="0" min="0" />
          </div>
        </div>

        {success && <div className="flp__success">✅ Food logged successfully!</div>}

        <button className="flp__log-btn" type="submit" disabled={loading}>
          {loading ? "Logging…" : "＋ Log Food"}
        </button>
      </form>

      {/* Today's log */}
      <hr className="flp__divider" />
      <p className="flp__log-title">Today's Log ({logs.length} items)</p>
      <div className="flp__log-list">
        {logs.length === 0 ? (
          <p className="flp__empty">No food logged today. Start above!</p>
        ) : (
          logs.map((log) => (
            <div key={log._id} className="flp__log-item">
              <span className={`flp__log-dot ${DOT_CLASS[log.mealType] || "dot-snack"}`} />
              <div className="flp__log-info">
                <p className="flp__log-name">{log.name}</p>
                <p className="flp__log-meta">
                  {MEAL_TYPES.find((m) => m.value === log.mealType)?.label || log.mealType}
                  {log.protein > 0 && ` · ${log.protein}g protein`}
                  {log.carbs   > 0 && ` · ${log.carbs}g carbs`}
                </p>
              </div>
              <span className="flp__log-cal">{log.calories} kcal</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
