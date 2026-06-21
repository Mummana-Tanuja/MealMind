import React, { useState } from "react";
import Layout from "../components/layout/Layout";
import TopStats from "../components/dashboard/TopStats";
import NutritionSection from "../components/dashboard/NutritionSection";
import WaterWeightSection from "../components/dashboard/WaterWeightSection";
import MealSection from "../components/dashboard/MealSection";
import FoodLogPanel from "../components/dashboard/FoodLogPanel";

function Dashboard() {
  const [logKey, setLogKey] = useState(0);

  return (
    <Layout pageTitle="Dashboard">
      <TopStats />

      {/* Two-column layout: Food Logger | Nutrition Tracker */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "1.5rem",
        alignItems: "start",
      }}
        className="dashboard-main-grid"
      >
        <FoodLogPanel onLogged={() => setLogKey((k) => k + 1)} />
        <NutritionSection key={logKey} />
      </div>

      <WaterWeightSection />
      <MealSection />
    </Layout>
  );
}

export default Dashboard;
