import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import Home         from "../components/HomePage/Home";
import Login        from "../pages/Login";
import SignUp       from "../pages/signup";
import Dashboard    from "../pages/Dashboard";
import MealPlan     from "../pages/MealPlan";
import Analytics    from "../pages/Analytics";
import Profile      from "../pages/Profile";
import Settings     from "../pages/Settings";
import ShoppingList from "../pages/ShoppingList";
import Recipes      from "../pages/Recipes";
import MoodMeals    from "../pages/MoodMeals";

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/"            element={<Navigate to="/home" replace />} />
      <Route path="/home"        element={<Home />} />
      <Route path="/Home"        element={<Navigate to="/home" replace />} />
      <Route path="/login"       element={<Login />} />
      <Route path="/signup"      element={<SignUp />} />
      <Route path="/dashboard"   element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/mealplan"    element={<PrivateRoute><MealPlan /></PrivateRoute>} />
      <Route path="/analytics"   element={<PrivateRoute><Analytics /></PrivateRoute>} />
      <Route path="/profile"     element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="/settings"    element={<PrivateRoute><Settings /></PrivateRoute>} />
      <Route path="/shoppinglist" element={<PrivateRoute><ShoppingList /></PrivateRoute>} />
      <Route path="/recipes"     element={<PrivateRoute><Recipes /></PrivateRoute>} />
      <Route path="/mood-meals"  element={<PrivateRoute><MoodMeals /></PrivateRoute>} />
      <Route path="*"            element={<Navigate to="/home" replace />} />
    </Routes>
  );
}

export default AppRoutes;
