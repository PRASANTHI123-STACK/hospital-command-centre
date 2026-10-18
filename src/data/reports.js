const reports = {
  overview: {
    totalPatients: 2543,
    totalAdmissions: 486,
    totalDischarges: 421,
    averageStay: 4.8,
    bedOccupancy: 44,
    emergencyCases: 128,
    appointments: 324,
    surgeries: 86,
  },

  monthlyPatients: [
    {
      month: "Jan",
      patients: 1820,
      admissions: 310,
      discharges: 286,
    },
    {
      month: "Feb",
      patients: 1950,
      admissions: 328,
      discharges: 301,
    },
    {
      month: "Mar",
      patients: 2040,
      admissions: 342,
      discharges: 319,
    },
    {
      month: "Apr",
      patients: 2180,
      admissions: 365,
      discharges: 337,
    },
    {
      month: "May",
      patients: 2310,
      admissions: 402,
      discharges: 368,
    },
    {
      month: "Jun",
      patients: 2395,
      admissions: 428,
      discharges: 391,
    },
    {
      month: "Jul",
      patients: 2470,
      admissions: 451,
      discharges: 405,
    },
    {
      month: "Aug",
      patients: 2518,
      admissions: 470,
      discharges: 414,
    },
    {
      month: "Sep",
      patients: 2543,
      admissions: 486,
      discharges: 421,
    },
  ],

  departmentPerformance: [
    {
      department: "Cardiology",
      patients: 482,
      appointments: 74,
      occupancy: 82,
      performance: 94,
    },
    {
      department: "Neurology",
      patients: 356,
      appointments: 58,
      occupancy: 76,
      performance: 91,
    },
    {
      department: "General Medicine",
      patients: 628,
      appointments: 86,
      occupancy: 69,
      performance: 89,
    },
    {
      department: "Emergency",
      patients: 394,
      appointments: 42,
      occupancy: 88,
      performance: 96,
    },
    {
      department: "Pediatrics",
      patients: 285,
      appointments: 31,
      occupancy: 61,
      performance: 87,
    },
    {
      department: "Orthopedics",
      patients: 198,
      appointments: 18,
      occupancy: 58,
      performance: 85,
    },
  ],

  weeklyActivity: [
    {
      day: "Mon",
      admissions: 64,
      discharges: 58,
      appointments: 72,
    },
    {
      day: "Tue",
      admissions: 71,
      discharges: 63,
      appointments: 81,
    },
    {
      day: "Wed",
      admissions: 68,
      discharges: 61,
      appointments: 76,
    },
    {
      day: "Thu",
      admissions: 79,
      discharges: 69,
      appointments: 88,
    },
    {
      day: "Fri",
      admissions: 73,
      discharges: 65,
      appointments: 84,
    },
    {
      day: "Sat",
      admissions: 59,
      discharges: 52,
      appointments: 61,
    },
    {
      day: "Sun",
      admissions: 48,
      discharges: 43,
      appointments: 49,
    },
  ],

  emergencyPerformance: [
    {
      category: "Critical",
      cases: 28,
      resolved: 24,
      responseTime: 3.2,
    },
    {
      category: "High",
      cases: 46,
      resolved: 42,
      responseTime: 4.1,
    },
    {
      category: "Medium",
      cases: 38,
      resolved: 36,
      responseTime: 6.4,
    },
    {
      category: "Low",
      cases: 16,
      resolved: 16,
      responseTime: 8.2,
    },
  ],

  doctorPerformance: [
    {
      doctor: "Dr. Arjun Sharma",
      department: "Cardiology",
      patients: 18,
      appointments: 32,
      rating: 4.9,
      efficiency: 96,
    },
    {
      doctor: "Dr. Karthik Rao",
      department: "Emergency",
      patients: 9,
      appointments: 28,
      rating: 4.9,
      efficiency: 95,
    },
    {
      doctor: "Dr. Neha Reddy",
      department: "Neurology",
      patients: 14,
      appointments: 26,
      rating: 4.8,
      efficiency: 93,
    },
    {
      doctor: "Dr. Ravi Kumar",
      department: "General Medicine",
      patients: 22,
      appointments: 36,
      rating: 4.7,
      efficiency: 91,
    },
    {
      doctor: "Dr. Priya Varma",
      department: "Pediatrics",
      patients: 16,
      appointments: 29,
      rating: 4.8,
      efficiency: 90,
    },
  ],

  appointmentStatus: [
    {
      status: "Completed",
      count: 142,
    },
    {
      status: "Confirmed",
      count: 96,
    },
    {
      status: "Waiting",
      count: 34,
    },
    {
      status: "In Progress",
      count: 28,
    },
    {
      status: "Cancelled",
      count: 24,
    },
  ],

  bedOccupancy: [
    {
      type: "ICU",
      total: 4,
      occupied: 2,
      available: 1,
      reserved: 1,
    },
    {
      type: "Specialty",
      total: 2,
      occupied: 1,
      available: 1,
      reserved: 0,
    },
    {
      type: "General",
      total: 5,
      occupied: 3,
      available: 1,
      reserved: 1,
    },
    {
      type: "Emergency",
      total: 3,
      occupied: 1,
      available: 2,
      reserved: 0,
    },
    {
      type: "Pediatric",
      total: 2,
      occupied: 0,
      available: 1,
      reserved: 1,
    },
  ],

  pharmacySummary: {
    totalMedicines: 10,
    inStock: 6,
    lowStock: 3,
    outOfStock: 1,
    inventoryValue: 184650,
  },

  reportTypes: [
    {
      id: "RPT-001",
      name: "Daily Hospital Operations",
      category: "Operations",
      lastGenerated: "06 September 2026",
      status: "Ready",
    },
    {
      id: "RPT-002",
      name: "Patient Admissions Report",
      category: "Patients",
      lastGenerated: "06 September 2026",
      status: "Ready",
    },
    {
      id: "RPT-003",
      name: "Bed Occupancy Report",
      category: "Beds & ICU",
      lastGenerated: "06 September 2026",
      status: "Ready",
    },
    {
      id: "RPT-004",
      name: "Emergency Response Report",
      category: "Emergency",
      lastGenerated: "06 September 2026",
      status: "Ready",
    },
    {
      id: "RPT-005",
      name: "Doctor Performance Report",
      category: "Doctors",
      lastGenerated: "05 September 2026",
      status: "Ready",
    },
    {
      id: "RPT-006",
      name: "Pharmacy Inventory Report",
      category: "Pharmacy",
      lastGenerated: "06 September 2026",
      status: "Ready",
    },
  ],
};

export default reports;