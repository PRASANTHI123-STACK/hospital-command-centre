import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.jsx";

import "./styles/global.css";
import "./styles/sidebar.css";
import "./styles/dashboard.css";
import "./styles/responsive.css";
import "./styles/patient-monitoring.css";
import "./styles/emergency.css";
import "./styles/doctors.css";
import "./styles/appointments.css";
import "./styles/beds.css";
import "./styles/ai-prediction.css";
import "./styles/pharmacy.css";
import "./styles/reports.css";
import "./styles/notifications.css";
import "./styles/laboratory.css";
import "./styles/profile.css";
import "./styles/login.css";
import "./styles/patient-login.css";
import "./styles/patient-home.css";
import "./styles/patient-doctor.css";
import "./styles/patient-medical-reports.css";
import "./styles/patient-appointments.css";
import "./styles/patient-prescriptions.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);