const profile = {
  personal: {
    fullName: "Dr. Arjun Sharma",
    shortName: "Dr. Arjun",
    role: "Cardiologist",
    employeeId: "DOC-1001",
    department: "Cardiology",
    email: "arjun.sharma@hospitalcare.com",
    phone: "+91 98765 43210",
    location: "Main Hospital",
    status: "Online",
  },

  professional: {
    specialization: "Interventional Cardiology",
    qualification: "MBBS, MD, DM Cardiology",
    experience: "14 Years",
    registrationNumber: "MCI-2012-45821",
    patientsAssigned: 18,
    appointmentsToday: 32,
    shift: "08:00 AM - 04:00 PM",
    joiningDate: "15 June 2012",
  },

  account: {
    username: "dr.arjun",
    emailVerified: true,
    phoneVerified: true,
    twoFactorEnabled: true,
    lastLogin: "06 September 2026, 08:42 AM",
    lastLoginDevice: "Windows • Chrome",
    activeSessions: 2,
  },

  notifications: {
    criticalAlerts: true,
    emergencyAlerts: true,
    appointmentAlerts: true,
    pharmacyAlerts: true,
    laboratoryAlerts: true,
    systemUpdates: true,
    emailNotifications: true,
    soundAlerts: true,
  },

  preferences: {
    liveMonitoring: true,
    autoRefresh: true,
    compactView: false,
    showPatientRisk: true,
    showEmergencyMap: true,
  },

  security: {
    passwordLastChanged: "18 August 2026",
    twoFactorMethod: "Authenticator App",
    sessionTimeout: "30 Minutes",
    securityStatus: "Protected",
  },

  activity: [
    {
      id: "ACT-001",
      action: "Logged into Command Centre",
      device: "Windows • Chrome",
      location: "Main Hospital",
      time: "08:42 AM",
      date: "06 September 2026",
      status: "Success",
    },
    {
      id: "ACT-002",
      action: "Updated patient monitoring settings",
      device: "Windows • Chrome",
      location: "Main Hospital",
      time: "08:31 AM",
      date: "06 September 2026",
      status: "Success",
    },
    {
      id: "ACT-003",
      action: "Reviewed emergency case EMG-1001",
      device: "Windows • Chrome",
      location: "Main Hospital",
      time: "08:12 AM",
      date: "06 September 2026",
      status: "Success",
    },
    {
      id: "ACT-004",
      action: "Changed notification preferences",
      device: "Windows • Chrome",
      location: "Main Hospital",
      time: "05 September 2026",
      date: "05 September 2026",
      status: "Success",
    },
    {
      id: "ACT-005",
      action: "Logged into Command Centre",
      device: "iPhone • Safari",
      location: "Secure Mobile Session",
      time: "07:15 PM",
      date: "05 September 2026",
      status: "Success",
    },
  ],
};

export default profile;