import React, { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, Title, Tooltip, Legend,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import "./Analytics.css";
import { getAnalytics } from "../services/api";
import { useAuth } from "../context/AuthContext";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: "top" }, title: { display: false } },
  scales: {
    y: { grid: { color: "rgba(31, 111, 59, 0.12)" }, beginAtZero: true },
    x: { grid: { display: false } },
  },
};

function Analytics() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getAnalytics(user.userId)
      .then((res) => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const labels = data?.caloriesByDay?.map((d) =>
    new Date(d.date).toLocaleDateString("en-US", { weekday: "short" })
  ) || ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const caloriesData = data?.caloriesByDay?.map((d) => d.calories) || [0, 0, 0, 0, 0, 0, 0];
  const waterData = data?.waterByDay?.map((d) => d.glasses) || [0, 0, 0, 0, 0, 0, 0];

  const dailyChartData = {
    labels,
    datasets: [{
      label: "Calories",
      data: caloriesData,
      borderColor: "#2f8f4e",
      backgroundColor: "rgba(121, 191, 122, 0.16)",
      tension: 0.35, fill: true, pointRadius: 4,
    }],
  };

  const waterChartData = {
    labels,
    datasets: [{
      label: "Water (glasses)",
      data: waterData,
      backgroundColor: "#2f8f4e",
      borderRadius: 12,
    }],
  };

  const goalChartData = {
    labels: ["Calories", "Protein", "Carbs", "Fat"],
    datasets: [
      {
        label: "Goal",
        data: [data?.summary?.calorieTarget || 2200, 150, 300, 70],
        backgroundColor: "rgba(244, 155, 36, 0.68)",
      },
      {
        label: "Avg Actual",
        data: [data?.summary?.avgCalories || 0,
          Math.round((data?.caloriesByDay?.reduce((s, d) => s + (d.protein || 0), 0) || 0) / 7),
          Math.round((data?.caloriesByDay?.reduce((s, d) => s + (d.carbs || 0), 0) || 0) / 7),
          Math.round((data?.caloriesByDay?.reduce((s, d) => s + (d.fat || 0), 0) || 0) / 7),
        ],
        backgroundColor: "rgba(47, 143, 78, 0.68)",
      },
    ],
  };

  const summaryStats = [
    { title: "Avg Daily Calories", value: data?.summary?.avgCalories ? `${data.summary.avgCalories} kcal` : "—", subtitle: "Last 7 days" },
    { title: "Calorie Target", value: data?.summary?.calorieTarget ? `${data.summary.calorieTarget} kcal` : "—", subtitle: "Based on your goal" },
    { title: "Goal", value: data?.summary?.goal || "—", subtitle: "Fitness objective" },
    { title: "Diet", value: data?.summary?.dietPreference || "—", subtitle: "Preference" },
  ];

  return (
    <Layout pageTitle="Analytics">
      <div className="analytics-page">
        <div className="analytics-header">
          <div>
            <p className="analytics-eyebrow">Analytics Dashboard</p>
            <h2>Nutrition insights at a glance</h2>
            <p className="analytics-description">Review your daily trends to make smarter decisions for your health.</p>
          </div>
        </div>

        <div className="summary-grid">
          {summaryStats.map((item) => (
            <div key={item.title} className="summary-card">
              <p className="summary-title">{item.title}</p>
              <h3>{loading ? "…" : item.value}</h3>
              <p className="summary-subtitle">{item.subtitle}</p>
            </div>
          ))}
        </div>

        <div className="charts-grid">
          <section className="chart-card">
            <div className="chart-card-header"><h3>Daily Calories</h3><span>Last 7 days</span></div>
            <div className="chart-wrapper">
              <Line options={chartOptions} data={dailyChartData} />
            </div>
          </section>

          <section className="chart-card">
            <div className="chart-card-header"><h3>Daily Water</h3><span>Glasses per day</span></div>
            <div className="chart-wrapper">
              <Bar options={chartOptions} data={waterChartData} />
            </div>
          </section>
        </div>

        <div className="charts-grid">
          <section className="chart-card large-card">
            <div className="chart-card-header"><h3>Goal vs Actual</h3><span>7-day average</span></div>
            <div className="chart-wrapper">
              <Bar options={chartOptions} data={goalChartData} />
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}

export default Analytics;
