import React, { useState, useEffect } from "react";
import "./WaterWeightSection.css";
import { updateWater, getProfile } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function WaterWeightSection() {
  const { user } = useAuth();
  const today = new Date().toISOString().split("T")[0];

  const [glasses, setGlasses] = useState(0);
  const [goal, setGoal] = useState(8);
  const [currentWeight, setCurrentWeight] = useState("--");
  const [targetWeight, setTargetWeight] = useState("--");

  useEffect(() => {
    if (!user) return;
    getProfile(user.userId)
      .then((res) => {
        const p = res.data;
        if (p.weight) setCurrentWeight(p.weight);
        if (p.targetWeight) setTargetWeight(p.targetWeight);
        if (p.waterGoal) setGoal(Math.round(p.waterGoal * 4));
      })
      .catch(() => {});
  }, [user]);

  const toggleGlass = async (idx) => {
    if (!user) return;
    const newGlasses = idx < glasses ? idx : idx + 1;
    setGlasses(newGlasses);
    try {
      await updateWater(user.userId, { date: today, glasses: newGlasses, goal });
    } catch {}
  };

  const pct = goal > 0 ? Math.min(Math.round((glasses / goal) * 100), 100) : 0;
  const weightPct = currentWeight !== "--" && targetWeight !== "--"
    ? Math.min(Math.round((targetWeight / currentWeight) * 100), 100)
    : 0;

  return (
    <div className="ww-grid">
      <div className="ww-card">
        <h3 className="ww-card__title">💧 Water Intake</h3>
        <p className="ww-card__sub">{glasses} / {goal} glasses today</p>

        <div className="water-glasses">
          {Array.from({ length: goal }).map((_, i) => (
            <div
              key={i}
              className={`glass ${i < glasses ? "glass--filled" : ""}`}
              title={`Glass ${i + 1}`}
              onClick={() => toggleGlass(i)}
              style={{ cursor: "pointer" }}
            >
              💧
            </div>
          ))}
        </div>

        <div className="ww-bar-bg">
          <div className="ww-bar-fill" style={{ width: `${pct}%`, background: "#2f8f4e" }} />
        </div>
        <p className="ww-bar-label" style={{ color: "#2f8f4e" }}>{pct}% of daily goal</p>
      </div>

      <div className="ww-card">
        <h3 className="ww-card__title">⚖️ Weight Tracker</h3>
        <p className="ww-card__sub">Current vs. Goal</p>

        <div className="weight-display">
          <div className="weight-val">
            <span className="weight-num">{currentWeight}</span>
            <span className="weight-unit">kg</span>
            <span className="weight-lbl">Current</span>
          </div>
          <div className="weight-arrow">→</div>
          <div className="weight-val">
            <span className="weight-num" style={{ color: "#2f8f4e" }}>{targetWeight}</span>
            <span className="weight-unit">kg</span>
            <span className="weight-lbl">Goal</span>
          </div>
        </div>

        <div className="ww-bar-bg">
          <div className="ww-bar-fill" style={{ width: `${weightPct}%`, background: "#2f8f4e" }} />
        </div>
        <p className="ww-bar-label" style={{ color: "#2f8f4e" }}>
          {currentWeight !== "--" && targetWeight !== "--"
            ? `${weightPct}% to goal weight`
            : "Set your weight in Profile"}
        </p>
      </div>
    </div>
  );
}

export default WaterWeightSection;
