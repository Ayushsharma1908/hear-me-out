import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function OAuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    // Read token from URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      // Save token
      localStorage.setItem("token", token);

      // Redirect to home
      navigate("/home", { replace: true });
    } else {
      // If token missing, go to login
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  // Nothing to render
  return null;
}

export default OAuthSuccess;
