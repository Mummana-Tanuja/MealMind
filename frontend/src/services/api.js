import axios from "axios";

const API = axios.create({ baseURL: "/api" });

// Attach JWT token to every request automatically
API.interceptors.request.use((config) => {
  try {
    const stored = localStorage.getItem("mealmind_user");
    if (stored) {
      const { token } = JSON.parse(stored);
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {}
  return config;
});

// If any response comes back 401, clear session
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("mealmind_user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// ──────────────────────────────────────────
// AUTH
// ──────────────────────────────────────────
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser    = (data) => API.post("/auth/login", data);

// ──────────────────────────────────────────
// PROFILE
// ──────────────────────────────────────────
export const getProfile    = (userId)       => API.get(`/profile/${userId}`);
export const updateProfile = (userId, data) => API.put(`/profile/${userId}`, data);

// ──────────────────────────────────────────
// MEAL PLAN
// ──────────────────────────────────────────
export const generateMealPlan = (userId) => API.post(`/mealplan/generate/${userId}`);
export const getMealPlan      = (userId) => API.get(`/mealplan/${userId}`);

// ──────────────────────────────────────────
// SHOPPING LIST
// ──────────────────────────────────────────
export const getShoppingList    = (userId)       => API.get(`/shopping/${userId}`);
export const updateShoppingList = (userId, data) => API.put(`/shopping/${userId}`, data);

// ──────────────────────────────────────────
// FOOD LOG
// ──────────────────────────────────────────
export const addFoodLog    = (data)         => API.post(`/food/log`, data);
export const getFoodHistory = (userId, date) => API.get(`/food/history/${userId}?date=${date}`);
export const deleteFoodLog = (logId)        => API.delete(`/food/log/${logId}`);

// ──────────────────────────────────────────
// WATER TRACKING
// ──────────────────────────────────────────
export const getWaterLog   = (userId, date) => API.get(`/water/${userId}?date=${date}`);
export const updateWater   = (userId, data) => API.post(`/water/${userId}`, data);

// ──────────────────────────────────────────
// WEIGHT TRACKING
// ──────────────────────────────────────────
export const getWeightLog    = (userId)             => API.get(`/weight/${userId}`);
export const updateWeight    = (userId, data)        => API.post(`/weight/${userId}`, data);
export const deleteWeightLog = (userId, date)        => API.delete(`/weight/${userId}/${date}`);

// ──────────────────────────────────────────
// ANALYTICS
// ──────────────────────────────────────────
export const getAnalytics = (userId) => API.get(`/analytics/${userId}`);

// ──────────────────────────────────────────
// RECIPES
// ──────────────────────────────────────────
export const getRecipes  = (params = {}) => API.get("/recipes", { params });
export const getRecipeById = (id)        => API.get(`/recipes/${id}`);
