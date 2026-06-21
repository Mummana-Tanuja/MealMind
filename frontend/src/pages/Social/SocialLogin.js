import "./SocialLogin.css";

function SocialLogin({
  onGoogleClick,
}) {
  return (
    <div className="social-login">

      <button
        type="button"
        className="social-btn google"
        onClick={onGoogleClick}
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png"
          alt="Google"
        />
        Continue with Google
      </button>

    </div>
  );
}

export default SocialLogin;
