import React, { useState, useEffect } from "react";
import "./NutritionSection.css";
import { getFoodHistory, getProfile } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const RADIUS = 65;
const STROKE = 12;
const CIRC = 2 * Math.PI * RADIUS;
const SIZE = 160;

const MACRO_COLORS = {
  Protein: "#2f8f4e",
  Carbs:   "#f49b24",
  Fibre:   "#79bf7a",
  Fat:     "#ec4899",
};

function NutritionSection() {
  const { user } = useAuth();
  const today = new Date().toISOString().split("T")[0];
  const [totals, setTotals] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0, fibre: 0 });
  const [target, setTarget] = useState(2200);

  useEffect(() => {
    if (!user) return;
    getFoodHistory(user.userId, today)
      .then((res) => setTotals(res.data.totals))
      .catch(() => {});

    getProfile(user.userId)
      .then((res) => {
        const g = res.data.goal;
        if (g === "Weight Loss") setTarget(1800);
        else if (g === "Muscle Gain") setTarget(2800);
        else setTarget(2200);
      })
      .catch(() => {});
  }, [user, today]);

  const consumed = totals.calories;
  const pct = target > 0 ? Math.min(consumed / target, 1) : 0;
  const offset = CIRC - pct * CIRC;
  const remaining = Math.max(target - consumed, 0);

  const macros = [
    { label: "Protein", consumed: totals.protein, target: 150, unit: "g" },
    { label: "Carbs",   consumed: totals.carbs,   target: 300, unit: "g" },
    { label: "Fibre",   consumed: totals.fibre,   target: 35,  unit: "g" },
    { label: "Fat",     consumed: totals.fat,      target: 70,  unit: "g" },
  ];

  return (
    <div className="nutrition-card">
      <div className="nutrition-card__header">
        <h2 className="nutrition-card__title">Nutrition Tracker</h2>
        <span className="nutrition-card__date">Today</span>
      </div>

      <div className="nutrition-body">
        {/* Calorie ring — centered */}
        <div className="calorie-ring-wrap">
          <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="calorie-ring-svg">
            <defs>
              <linearGradient id="calGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="#f49b24" />
                <stop offset="50%"  stopColor="#79bf7a" />
                <stop offset="100%" stopColor="#2f8f4e" />
              </linearGradient>
            </defs>
            {/* Background track */}
            <circle
              cx={SIZE / 2} cy={SIZE / 2} r={RADIUS}
              fill="none"
              stroke="rgba(31,111,59,0.1)"
              strokeWidth={STROKE}
            />
            {/* Progress arc */}
            <circle
              cx={SIZE / 2} cy={SIZE / 2} r={RADIUS}
              fill="none"
              stroke="url(#calGradient2)"
              strokeWidth={STROKE}
              strokeDasharray={CIRC}
              strokeDashoffset={offset}
              strokeLinecap="round"
              transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
              style={{ transition: "stroke-dashoffset 1s ease" }}
            />
          </svg>

          {/* Center text */}
          <div className="calorie-ring-center">
            <span className="calorie-ring-num">{consumed.toLocaleString()}</span>
            <span className="calorie-ring-unit">kcal</span>
            <span className="calorie-ring-label">consumed</span>
          </div>

          {/* Done / Remaining / Goal pill */}
          <div className="calorie-ring-stats">
            <div className="crs-item">
              <span className="crs-val" style={{ color: "#2f8f4e" }}>{Math.round(pct * 100)}%</span>
              <span className="crs-lbl">Done</span>
            </div>
            <div className="crs-divider" />
            <div className="crs-item">
              <span className="crs-val" style={{ color: "#f49b24" }}>{remaining.toLocaleString()}</span>
              <span className="crs-lbl">Left</span>
            </div>
            <div className="crs-divider" />
            <div className="crs-item">
              <span className="crs-val" style={{ color: "#79bf7a" }}>{target.toLocaleString()}</span>
              <span className="crs-lbl">Goal</span>
            </div>
          </div>
        </div>

        {/* Macro bars — full width below */}
        <div className="macro-list">
          {macros.map((m) => {
            const color = MACRO_COLORS[m.label];
            const p = m.target > 0 ? Math.min(Math.round((m.consumed / m.target) * 100), 100) : 0;
            return (
              <div className="macro-item" key={m.label}>
                <div className="macro-item__top">
                  <div className="macro-item__dot-label">
                    <span className="macro-dot" style={{ background: color }} />
                    <span className="macro-label">{m.label}</span>
                  </div>
                  <span className="macro-vals">
                    <strong style={{ color }}>{m.consumed}{m.unit}</strong>
                    <span> / {m.target}{m.unit}</span>
                  </span>
                </div>
                <div className="macro-bar-bg">
                  <div className="macro-bar-fill" style={{ width: `${p}%`, background: color }} />
                </div>
                <span className="macro-pct" style={{ color }}>{p}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default NutritionSection;
