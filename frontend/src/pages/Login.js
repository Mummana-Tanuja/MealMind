import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import mealmindLogo from "../components/mealmindlogo.png";
import { loginUser } from "../services/api";
import { useAuth } from "../context/AuthContext";

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await loginUser({ email, password });
            login(res.data);
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.error || err.message || "Login failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="auth-brand">
                    <img src={mealmindLogo} alt="MealMind logo" />
                    <span>Meal Mind</span>
                </div>
                <h1>Welcome Back</h1>
                <p>Please login to continue</p>

                <form onSubmit={handleLogin}>
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
                    <button className="login-btn" type="submit" disabled={loading}>
                        {loading ? "Logging in…" : "Login"}
                    </button>
                </form>

                {error && <div className="message error">{error}</div>}

                <p className="page-link">
                    Don't have an account? <Link to="/signup">Sign up</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
