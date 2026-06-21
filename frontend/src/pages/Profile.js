import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import { getProfile, updateProfile } from "../services/api";
import { useAuth } from "../context/AuthContext";

const allergyOptions = ["Milk","Eggs","Peanuts","Fish","Soy","Wheat","Shellfish","Other"];
const deficiencyOptions = ["Iron","Calcium","Vitamin D","Vitamin B12","Protein","Other"];

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profileImage, setProfileImage] = useState(null);
  const [otherAllergy, setOtherAllergy] = useState("");
  const [otherDeficiency, setOtherDeficiency] = useState("");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "", email: "", phone: "", age: "", gender: "",
    height: "", weight: "", targetWeight: "", goal: "",
    activityLevel: "", dietPreference: "", waterGoal: "",
    budget: "", mealFrequency: "", allergies: [], deficiencies: [],
    foodDislikes: "",
  });

  useEffect(() => {
    if (!user) return;
    getProfile(user.userId)
      .then((res) => {
        const p = res.data;
        setFormData({
          fullName: p.fullName || "",
          email: p.email || user.email || "",
          phone: p.phone || "",
          age: p.age || "",
          gender: p.gender || "",
          height: p.height || "",
          weight: p.weight || "",
          targetWeight: p.targetWeight || "",
          goal: p.goal || "",
          activityLevel: p.activityLevel || "",
          dietPreference: p.dietPreference || "",
          waterGoal: p.waterGoal || "",
          budget: p.budget || "",
          mealFrequency: p.mealFrequency || "",
          allergies: p.allergies || [],
          deficiencies: p.deficiencies || [],
          foodDislikes: p.foodDislikes || "",
        });
        setOtherAllergy(p.otherAllergy || "");
        setOtherDeficiency(p.otherDeficiency || "");
      })
      .catch(() => {});
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckbox = (e, field) => {
    const { value, checked } = e.target;
    setFormData({
      ...formData,
      [field]: checked
        ? [...formData[field], value]
        : formData[field].filter((i) => i !== value),
    });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) setProfileImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      await updateProfile(user.userId, { ...formData, otherAllergy, otherDeficiency });
      setStatus({ type: "success", msg: "Profile saved successfully!" });
      navigate("/dashboard");
    } catch (err) {
      setStatus({ type: "error", msg: err.response?.data?.error || "Failed to save profile." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h1>Personal Info</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="image-section">
            <label htmlFor="profileUpload" className="profile-image-wrapper">
              <img
                src={profileImage || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                alt="Profile"
              />
              <div className="overlay">
                <span className="edit-icon">✏️</span>
                <p>Edit Photo</p>
              </div>
            </label>
            <input id="profileUpload" type="file" accept="image/*" onChange={handleImage} hidden />
          </div>

          <div className="section">
            <h2>Personal Information</h2>
            <input type="text" placeholder="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} required />
            <input type="email" placeholder="Email" name="email" value={formData.email} onChange={handleChange} required />
            <input type="text" placeholder="Phone Number" name="phone" value={formData.phone} onChange={handleChange} required />
            <input type="number" placeholder="Age" name="age" value={formData.age} onChange={handleChange} required />
            <select name="gender" value={formData.gender} onChange={handleChange} required>
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          <div className="section">
            <h2>Body Details</h2>
            <input type="number" placeholder="Height (cm)" name="height" value={formData.height} onChange={handleChange} />
            <input type="number" placeholder="Weight (kg)" name="weight" value={formData.weight} onChange={handleChange} required />
            <input type="number" placeholder="Target Weight (kg)" name="targetWeight" value={formData.targetWeight} onChange={handleChange} required />
          </div>

          <div className="section">
            <h2>Fitness Goal</h2>
            <select name="goal" value={formData.goal} onChange={handleChange} required>
              <option value="">Choose Goal</option>
              <option>Weight Loss</option>
              <option>Maintain Weight</option>
              <option>Muscle Gain</option>
            </select>
          </div>

          <div className="section">
            <h2>Activity Level</h2>
            <select name="activityLevel" value={formData.activityLevel} onChange={handleChange} required>
              <option value="">Select Activity</option>
              <option>Sedentary</option>
              <option>Light Exercise</option>
              <option>Moderate Exercise</option>
              <option>Active</option>
              <option>Very Active</option>
            </select>
          </div>

          <div className="section">
            <h2>Diet Preference</h2>
            <select name="dietPreference" value={formData.dietPreference} onChange={handleChange} required>
              <option value="">Choose</option>
              <option>Vegetarian</option>
              <option>Non-Vegetarian</option>
              <option>Vegan</option>
            </select>
          </div>

          <div className="section">
            <h2>Allergies</h2>
            <div className="checkbox-grid">
              {allergyOptions.map((item) => (
                <label key={item}>
                  <input
                    type="checkbox"
                    value={item}
                    checked={formData.allergies.includes(item)}
                    onChange={(e) => handleCheckbox(e, "allergies")}
                  />
                  {item}
                </label>
              ))}
            </div>
            {formData.allergies.includes("Other") && (
              <input type="text" placeholder="Enter your allergy" value={otherAllergy} onChange={(e) => setOtherAllergy(e.target.value)} />
            )}
          </div>

          <div className="section">
            <h2>Deficiencies</h2>
            <div className="checkbox-grid">
              {deficiencyOptions.map((item) => (
                <label key={item}>
                  <input
                    type="checkbox"
                    value={item}
                    checked={formData.deficiencies.includes(item)}
                    onChange={(e) => handleCheckbox(e, "deficiencies")}
                  />
                  {item}
                </label>
              ))}
            </div>
            {formData.deficiencies.includes("Other") && (
              <input type="text" placeholder="Enter your deficiency" value={otherDeficiency} onChange={(e) => setOtherDeficiency(e.target.value)} />
            )}
          </div>

          <div className="section">
            <h2>Daily Water Goal</h2>
            <input type="number" placeholder="Water Goal (Litres)" name="waterGoal" value={formData.waterGoal} onChange={handleChange} required />
          </div>

          <div className="section">
            <h2>Weekly Budget</h2>
            <input type="number" placeholder="Budget (₹)" name="budget" value={formData.budget} onChange={handleChange} required />
          </div>

          <div className="section">
            <h2>Meals Per Day</h2>
            <select name="mealFrequency" value={formData.mealFrequency} onChange={handleChange} required>
              <option value="">Choose</option>
              <option>1</option><option>2</option><option>3</option><option>4</option>
            </select>
          </div>

          <div className="section">
            <h2>Food Dislikes</h2>
            <textarea rows="4" placeholder="Example: Onion, Mushroom..." name="foodDislikes" value={formData.foodDislikes} onChange={handleChange} required />
          </div>

          {status && <div className={`message ${status.type}`}>{status.msg}</div>}

          <button className="save-btn" disabled={saving}>
            {saving ? "Saving…" : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
