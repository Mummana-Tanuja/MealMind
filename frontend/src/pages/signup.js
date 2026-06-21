import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import mealmindLogo from "../components/mealmindlogo.png";
import { registerUser } from "../services/api";
import { useAuth } from "../context/AuthContext";

function SignUp() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        try {
            const res = await registerUser({ email, password });
            login(res.data);
            navigate("/profile");
        } catch (err) {
            setError(err.response?.data?.error || err.message || "Sign up failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="auth-brand">
                    <img src={mealmindLogo} alt="MealMind logo" />
                    <span>MealMind</span>
                </div>
                <h3>Create Account</h3>
                <p>Sign up to get started with MealMind</p>

                <form onSubmit={handleSignup}>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                    />
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm Password"
                        required
                    />
                    <button className="login-btn" type="submit" disabled={loading}>
                        {loading ? "Creating account…" : "Sign Up"}
                    </button>
                </form>

                {error && <div className="message error">{error}</div>}

                <p className="page-link">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
}

export default SignUp;
