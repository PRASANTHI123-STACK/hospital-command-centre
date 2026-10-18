const notifications = [
  {
    id: "NOT-1001",
    title: "Critical Patient Alert",
    message:
      "Mahesh Rao in ICU-05 has a critical condition and requires immediate attention.",
    type: "Critical",
    category: "Patient Monitoring",
    time: "2 minutes ago",
    timestamp: "10:58 AM",
    date: "06 September 2026",
    read: false,
    priority: "High",
    relatedId: "P10237",
  },

  {
    id: "NOT-1002",
    title: "Emergency Response Required",
    message:
      "Emergency case EMG-1001 is active in ICU-05. Emergency Team A has been assigned.",
    type: "Emergency",
    category: "Emergency",
    time: "8 minutes ago",
    timestamp: "10:52 AM",
    date: "06 September 2026",
    read: false,
    priority: "High",
    relatedId: "EMG-1001",
  },

  {
    id: "NOT-1003",
    title: "Low Medicine Stock",
    message:
      "Atorvastatin 20mg stock has fallen below the minimum threshold.",
    type: "Warning",
    category: "Pharmacy",
    time: "14 minutes ago",
    timestamp: "10:46 AM",
    date: "06 September 2026",
    read: false,
    priority: "Medium",
    relatedId: "MED-1003",
  },

  {
    id: "NOT-1004",
    title: "ICU Bed Available",
    message:
      "ICU-02 is now available and ready for patient admission.",
    type: "Bed",
    category: "Beds & ICU",
    time: "21 minutes ago",
    timestamp: "10:39 AM",
    date: "06 September 2026",
    read: false,
    priority: "Medium",
    relatedId: "BED-ICU-002",
  },

  {
    id: "NOT-1005",
    title: "Appointment Starting Soon",
    message:
      "Appointment APT-2002 with Dr. Neha Reddy is scheduled to start shortly.",
    type: "Appointment",
    category: "Appointments",
    time: "28 minutes ago",
    timestamp: "10:32 AM",
    date: "06 September 2026",
    read: true,
    priority: "Medium",
    relatedId: "APT-2002",
  },

  {
    id: "NOT-1006",
    title: "Medicine Out of Stock",
    message:
      "Ceftriaxone 1g is currently out of stock and requires immediate replenishment.",
    type: "Warning",
    category: "Pharmacy",
    time: "35 minutes ago",
    timestamp: "10:25 AM",
    date: "06 September 2026",
    read: false,
    priority: "High",
    relatedId: "MED-1009",
  },

  {
    id: "NOT-1007",
    title: "Doctor Shift Started",
    message:
      "Dr. Karthik Rao has started the Emergency Department shift.",
    type: "Doctor",
    category: "Doctors",
    time: "42 minutes ago",
    timestamp: "10:18 AM",
    date: "06 September 2026",
    read: true,
    priority: "Low",
    relatedId: "DOC-1004",
  },

  {
    id: "NOT-1008",
    title: "New Patient Admission",
    message:
      "A new patient has been admitted to the General Medicine department.",
    type: "Patient",
    category: "Patient Monitoring",
    time: "51 minutes ago",
    timestamp: "10:09 AM",
    date: "06 September 2026",
    read: true,
    priority: "Medium",
    relatedId: "P10251",
  },

  {
    id: "NOT-1009",
    title: "Emergency Case Resolved",
    message:
      "Emergency case EMG-1004 has been successfully resolved by the medical team.",
    type: "Success",
    category: "Emergency",
    time: "1 hour ago",
    timestamp: "09:59 AM",
    date: "06 September 2026",
    read: true,
    priority: "Low",
    relatedId: "EMG-1004",
  },

  {
    id: "NOT-1010",
    title: "System Health Check",
    message:
      "All hospital command centre services are operational.",
    type: "System",
    category: "System",
    time: "1 hour ago",
    timestamp: "09:45 AM",
    date: "06 September 2026",
    read: true,
    priority: "Low",
    relatedId: "SYSTEM",
  },

  {
    id: "NOT-1011",
    title: "Bed Reservation Confirmed",
    message:
      "ICU-04 has been reserved for the upcoming Cardiology admission.",
    type: "Bed",
    category: "Beds & ICU",
    time: "2 hours ago",
    timestamp: "08:52 AM",
    date: "06 September 2026",
    read: true,
    priority: "Medium",
    relatedId: "BED-ICU-004",
  },

  {
    id: "NOT-1012",
    title: "Appointment Completed",
    message:
      "Cardiology follow-up appointment for Ramesh Kumar has been completed.",
    type: "Appointment",
    category: "Appointments",
    time: "2 hours ago",
    timestamp: "08:35 AM",
    date: "06 September 2026",
    read: true,
    priority: "Low",
    relatedId: "APT-2001",
  },
];

export default notifications;