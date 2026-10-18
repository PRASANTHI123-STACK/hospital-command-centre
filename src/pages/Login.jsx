import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  UserRound,
  Hospital,
  ShieldCheck,
  Activity,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (loading) return;

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/users/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success || !data.token) {
        throw new Error(
          data.message || "Invalid username or password."
        );
      }

      if (!["doctor", "admin", "staff"].includes(data.user?.role)) {
        throw new Error(
          "This account is not authorized for staff login."
        );
      }

      const storage = rememberMe ? localStorage : sessionStorage;
      const otherStorage = rememberMe ? sessionStorage : localStorage;

      storage.setItem("hospitalToken", data.token);
      storage.setItem(
        "hospitalUser",
        JSON.stringify({
          id: data.user.id,
          username: data.user.username,
          employeeId: data.user.doctorId || "",
          doctorId: data.user.doctorId || "",
          name: data.user.name || data.user.username,
          role: data.user.role,
          department: data.user.department || "",
          specialization: data.user.specialization || "",
        })
      );

      otherStorage.removeItem("hospitalToken");
      otherStorage.removeItem("hospitalUser");
      otherStorage.removeItem("hospitalLoggedIn");

      if (rememberMe) {
        localStorage.setItem("hospitalLoggedIn", "true");
        localStorage.setItem("hospitalRememberMe", "true");
      } else {
        sessionStorage.setItem("hospitalLoggedIn", "true");
        localStorage.removeItem("hospitalLoggedIn");
        localStorage.removeItem("hospitalRememberMe");
      }

      setPassword("");
      navigate("/");
    } catch (err) {
      setError(
        err.message ||
          "Unable to connect to the hospital server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Background Effects */}
      <div className="login-background-glow login-glow-one"></div>
      <div className="login-background-glow login-glow-two"></div>

      {/* LEFT BRAND PANEL */}
      <div className="login-brand-panel">
        <div className="login-brand-content">
          <div className="login-logo">
            <Hospital size={28} />
          </div>

          <div className="login-brand-name">
            <strong>AI POWERED</strong>
            <span>HOSPITAL COMMAND CENTRE</span>
          </div>

          <div className="login-brand-divider"></div>

          <h1>
            Intelligent Healthcare
            <br />
            <span>Command &amp; Control</span>
          </h1>

          <p className="login-brand-description">
            A centralized AI-powered platform for
            real-time hospital operations, patient
            monitoring and clinical decision support.
          </p>

          <div className="login-feature-list">
            <div className="login-feature">
              <div className="login-feature-icon">
                <Activity size={16} />
              </div>
              <div>
                <strong>Real-Time Monitoring</strong>
                <span>
                  Monitor patients and hospital operations
                </span>
              </div>
            </div>

            <div className="login-feature">
              <div className="login-feature-icon">
                <ShieldCheck size={16} />
              </div>
              <div>
                <strong>Secure Healthcare Platform</strong>
                <span>
                  Protected access for authorized staff
                </span>
              </div>
            </div>

            <div className="login-feature">
              <div className="login-feature-icon">
                <Hospital size={16} />
              </div>
              <div>
                <strong>Clinical Intelligence</strong>
                <span>
                  AI-supported hospital decision making
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="login-brand-footer">
          <span>AI Hospital Command Centre</span>
          <span>v1.0.0</span>
        </div>
      </div>

      {/* RIGHT LOGIN PANEL */}
      <div className="login-form-panel">
        <div className="login-form-container">
          {/* Mobile Brand */}
          <div className="login-mobile-brand">
            <div className="login-logo">
              <Hospital size={23} />
            </div>
            <div>
              <strong>AI POWERED</strong>
              <span>HOSPITAL COMMAND CENTRE</span>
            </div>
          </div>

          {/* Header */}
          <div className="login-header">
            <div className="login-header-icon">
              <LockKeyhole size={21} />
            </div>
            <div>
              <h2>Welcome Back</h2>
              <p>
                Sign in to your hospital command centre
              </p>
            </div>
          </div>

          {/* System Status */}
          <div className="login-system-status">
            <div className="login-system-status-icon">
              <CheckCircle2 size={15} />
            </div>
            <div>
              <strong>Hospital Server Connected</strong>
              <span>
                Sign in to access authorized hospital features
              </span>
            </div>
            <div className="login-status-dot"></div>
          </div>

          {/* Error */}
          {error && (
            <div className="login-error" role="alert">
              <span>{error}</span>
            </div>
          )}

          {/* STAFF / DOCTOR LOGIN FORM */}
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-form-group">
              <label htmlFor="username">Username</label>
              <div className="login-input-wrapper">
                <UserRound size={16} />
                <input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="login-form-group">
              <label htmlFor="password">Password</label>
              <div className="login-input-wrapper">
                <LockKeyhole size={16} />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="login-form-options">
              <label className="login-remember">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                className="login-forgot"
                onClick={() =>
                  setError(
                    "Please contact the hospital IT administrator to reset your password."
                  )
                }
                disabled={loading}
              >
                Forgot password?
              </button>
            </div>

            {/* Sign In */}
            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              <span>
                {loading ? "Signing in..." : "Sign In to Command Centre"}
              </span>
              {!loading && <ArrowRight size={17} />}
            </button>
          </form>

          {/* PATIENT LOGIN NAVIGATION */}
          <div className="login-patient-link">
            <span>Are you a patient?</span>{" "}
            <button
              type="button"
              onClick={() => navigate("/patient-login")}
            >
              Patient Login
              <ArrowRight size={15} />
            </button>
          </div>

          {/* Security Notice */}
          <div className="login-security-notice">
            <ShieldCheck size={14} />
            <span>
              Authorized hospital personnel only.
              All access activity may be monitored.
            </span>
          </div>

          <div className="login-bottom-text">
            AI-supported healthcare operations platform
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;