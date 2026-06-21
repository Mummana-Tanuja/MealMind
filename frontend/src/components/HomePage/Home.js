
import { Link } from "react-router-dom";
import "./Home.css";
import mealmindLogo from "./mealmindlogo.png";

function Home() {
    return (
      <div className="home-page">
        <header className="home-nav">
          <Link className="brand" to="/">
            <img className="brand-logo" src={mealmindLogo} alt="MealMind logo" />
            <b>MealMind</b>
          </Link>

          <nav className="nav-actions" aria-label="Account navigation">
            <Link className="nav-link" to="/login">Login</Link>
            <Link className="nav-button" to="/signup">Sign Up</Link>
          </nav>
        </header>

        <main className="hero-section">
          <section className="hero-content" aria-labelledby="home-title">
            <p className="eyebrow">Smart meal planning made simple</p>
            <h1 id="home-title">Plan healthier meals without the daily guesswork.</h1>
            <p className="hero-copy">
              MealMind helps you organize recipes, build balanced meal ideas, and keep your food goals easy to follow from one clean dashboard.
            </p>

            <div className="hero-actions">
              <Link className="primary-action" to="/signup">Create Account</Link>
              {/* <Link className="secondary-action" to="/login">Login</Link> */}
            </div>
          </section>

          <section className="meal-preview" aria-label="MealMind preview">
            <div className="preview-card active">
              <span className="meal-time">Breakfast</span>
              <h2>Oats, berries, almond butter</h2>
              <p>High fiber start with steady energy.</p>
            </div>
            <div className="preview-grid">
              <div className="stat-card">
                <span>24</span>
                saved meals
              </div>
              <div className="stat-card">
                <span>7</span>
                day plan
              </div>
            </div>
            <div className="preview-card">
              <span className="meal-time">Dinner</span>
              <h2>Grilled paneer bowl</h2>
              <p>Protein-rich, colorful, and ready to customize.</p>
            </div>
          </section>
        </main>

        <section className="feature-strip" aria-label="MealMind features">
          <article>
            <span>01</span>
            <h3>Personal meal ideas</h3>
            <p>Keep breakfast, lunch, dinner, and snacks organized around your routine.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Simple tracking</h3>
            <p>Review saved meals and build a plan before the week gets busy.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Secure access</h3>
            <p>Use your login or create a new account to continue into your dashboard.</p>
          </article>
        </section>
      </div>
    );
}

export default Home;
