import { BrowserRouter, Routes, Route } from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";

// ==========================================
// LOGIN PAGES
// ==========================================
import Login from "./pages/Login";
import PatientLogin from "./pages/PatientLogin";
import PatientHome from "./pages/PatientHome";

// ==========================================
// HOSPITAL COMMAND CENTRE PAGES
// ==========================================
import Dashboard from "./pages/Dashboard";
import PatientMonitoring from "./pages/PatientMonitoring";
import Emergency from "./pages/Emergency";
import Doctors from "./pages/Doctors";
import Appointments from "./pages/Appointments";
import BedsICU from "./pages/BedsICU";
import DiseasePrediction from "./pages/DiseasePrediction";
import Pharmacy from "./pages/Pharmacy";
import Reports from "./pages/Reports";
import Notifications from "./pages/Notifications";
import Laboratory from "./pages/Laboratory";
import Profile from "./pages/Profile";
import PatientDoctor from "./pages/PatientDoctor";
import PatientMedicalReports from "./pages/PatientMedicalReports";
import PatientAppointments from "./pages/PatientAppointments";
import PatientPrescriptions from "./pages/PatientPrescriptions";
import DoctorExamination from "./pages/DoctorExamination";
function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ==========================================
            HOSPITAL STAFF LOGIN
        ========================================== */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* ==========================================
            PATIENT LOGIN
        ========================================== */}
        <Route
          path="/patient-login"
          element={<PatientLogin />}
        />

        {/* ==========================================
            PATIENT HOME
        ========================================== */}
        <Route
          path="/patient-home"
          element={<PatientHome />}
        />

        {/* ==========================================
            HOSPITAL COMMAND CENTRE
        ========================================== */}

        {/* Dashboard */}
        <Route
          path="/"
          element={
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          }
        />

        {/* Patient Monitoring */}
        <Route
          path="/patient-monitoring"
          element={
            <DashboardLayout>
              <PatientMonitoring />
            </DashboardLayout>
          }
        />
        <Route
  path="/patients"
  element={
    <DashboardLayout>
      <PatientMonitoring />
    </DashboardLayout>
  }
/>

        {/* Emergency Command Centre */}
        <Route
          path="/emergency"
          element={
            <DashboardLayout>
              <Emergency />
            </DashboardLayout>
          }
        />

        {/* Doctors */}
        <Route
          path="/doctors"
          element={
            <DashboardLayout>
              <Doctors />
            </DashboardLayout>
          }
        />

        {/* Appointments */}
        <Route
          path="/appointments"
          element={
            <DashboardLayout>
              <Appointments />
            </DashboardLayout>
          }
        />

        {/* Beds & ICU */}
        <Route
          path="/beds-icu"
          element={
            <DashboardLayout>
              <BedsICU />
            </DashboardLayout>
          }
        />

        {/* AI Disease Prediction */}
        <Route
          path="/disease-prediction"
          element={
            <DashboardLayout>
              <DiseasePrediction />
            </DashboardLayout>
          }
        />

        {/* Pharmacy */}
        <Route
          path="/pharmacy"
          element={
            <DashboardLayout>
              <Pharmacy />
            </DashboardLayout>
          }
        />

        {/* Reports */}
        <Route
          path="/reports"
          element={
            <DashboardLayout>
              <Reports />
            </DashboardLayout>
          }
        />

        {/* Notifications */}
        <Route
          path="/notifications"
          element={
            <DashboardLayout>
              <Notifications />
            </DashboardLayout>
          }
        />

        {/* Laboratory */}
        <Route
          path="/laboratory"
          element={
            <DashboardLayout>
              <Laboratory />
            </DashboardLayout>
          }
        />

        {/* Profile */}
        <Route
          path="/profile"
          element={
            <DashboardLayout>
              <Profile />
            </DashboardLayout>
          }
        />
        <Route
  path="/patient-doctor"
  element={<PatientDoctor />

  }
/>
<Route
  path="/patient-medical-reports"
  element={<PatientMedicalReports />}
/>
<Route
  path="/patient-appointments"
  element={<PatientAppointments />}
/>
<Route
  path="/patient-prescriptions"
  element={<PatientPrescriptions />}
/>
<Route
  path="/doctor-examination"
  element={
    <DashboardLayout>
      <DoctorExamination />
    </DashboardLayout>
  }
/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;