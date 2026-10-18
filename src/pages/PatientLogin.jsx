
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Hospital, UserRound, LockKeyhole, Eye, EyeOff, AlertCircle } from "lucide-react";

const API = "http://localhost:5000/api";

function PatientLogin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!username.trim() || !password) {
      setError("Please enter your username and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API}/auth/patient/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Patient login failed.");
      }

      if (!data.token || !data.user?.patientId) {
        throw new Error(
          "The server did not return a patient token. Check the backend patientLogin controller."
        );
      }

      // Store the patient session and authentication token.
      localStorage.setItem("patientToken", data.token);
      localStorage.setItem("patientLoggedIn", "true");
      localStorage.setItem("patientUser", JSON.stringify(data.user));

      navigate("/patient-home", { replace: true });
    } catch (err) {
      console.error("Patient login error:", err);
      setError(
        err.message || "Unable to connect to the hospital server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <Hospital size={30} />
        </div>

        <h1 style={styles.heading}>Patient Login</h1>
        <p style={styles.subtitle}>
          AI-Powered Hospital Command Centre
        </p>

        {error && (
          <div style={styles.error} role="alert">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label style={styles.label} htmlFor="username">
            Username
          </label>
          <div style={styles.inputWrapper}>
            <UserRound size={18} color="#64748b" />
            <input
              id="username"
              type="text"
              autoComplete="username"
              placeholder="Enter your username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              style={styles.input}
              required
            />
          </div>

          <label style={styles.label} htmlFor="password">
            Password
          </label>
          <div style={styles.inputWrapper}>
            <LockKeyhole size={18} color="#64748b" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              style={styles.input}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              style={styles.eyeButton}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.submit,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <button
          type="button"
          style={styles.backButton}
          onClick={() => navigate("/")}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    background: "linear-gradient(135deg, #071b33, #0b3b59)",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    padding: "36px",
    background: "#ffffff",
    borderRadius: "18px",
    boxShadow: "0 20px 55px rgba(0,0,0,0.25)",
  },
  logo: {
    width: "60px",
    height: "60px",
    margin: "0 auto 18px",
    borderRadius: "16px",
    background: "#e0f7fa",
    color: "#078da0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  heading: {
    margin: "0 0 8px",
    textAlign: "center",
    color: "#102a43",
    fontSize: "28px",
  },
  subtitle: {
    margin: "0 0 28px",
    textAlign: "center",
    color: "#627d98",
    fontSize: "14px",
  },
  label: {
    display: "block",
    margin: "18px 0 8px",
    color: "#243b53",
    fontWeight: "600",
    fontSize: "14px",
  },
  inputWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    border: "1px solid #cbd5e1",
    borderRadius: "9px",
    padding: "0 12px",
    minHeight: "48px",
  },
  input: {
    flex: 1,
    width: "100%",
    minWidth: 0,
    border: "none",
    outline: "none",
    fontSize: "15px",
    background: "transparent",
    color: "#102a43",
  },
  eyeButton: {
    display: "flex",
    border: "none",
    background: "transparent",
    color: "#64748b",
    cursor: "pointer",
    padding: "5px",
  },
  submit: {
    width: "100%",
    marginTop: "26px",
    minHeight: "48px",
    border: "none",
    borderRadius: "9px",
    background: "#078da0",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
  },
  error: {
    display: "flex",
    alignItems: "flex-start",
    gap: "8px",
    padding: "12px",
    borderRadius: "8px",
    background: "#fff1f2",
    color: "#be123c",
    fontSize: "14px",
  },
  backButton: {
    width: "100%",
    marginTop: "16px",
    padding: "10px",
    border: "none",
    background: "transparent",
    color: "#486581",
    cursor: "pointer",
  },
};

export default PatientLogin;
