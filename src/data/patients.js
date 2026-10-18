const patients = [
  {
    id: "P10234",
    name: "Ramesh Kumar",
    age: 56,
    gender: "Male",
    room: "ICU-12",
    admitDate: "22-05-2026",
    admitTime: "10:30 AM",

    heartRate: 78,
    bloodPressure: "120/80",
    oxygenLevel: 97,
    temperature: "98.6°F",

    riskLevel: "High",
    riskScore: 82,

    status: "Stable",

    doctor: "Dr. Arjun",
    department: "Cardiology",

    notes:
      "Patient is stable. Continue medication and monitoring.",

    symptoms: [
      "Chest discomfort",
      "Mild fatigue",
    ],
  },

  {
    id: "P10235",
    name: "Suresh Reddy",
    age: 63,
    gender: "Male",
    room: "ICU-07",
    admitDate: "21-05-2026",
    admitTime: "08:45 AM",

    heartRate: 92,
    bloodPressure: "138/88",
    oxygenLevel: 94,
    temperature: "99.1°F",

    riskLevel: "Medium",
    riskScore: 61,

    status: "Monitoring",

    doctor: "Dr. Neha",
    department: "Neurology",

    notes:
      "Patient requires continuous monitoring. Oxygen level slightly below normal.",

    symptoms: [
      "Headache",
      "Dizziness",
    ],
  },

  {
    id: "P10236",
    name: "Lakshmi Devi",
    age: 48,
    gender: "Female",
    room: "GEN-24",
    admitDate: "20-05-2026",
    admitTime: "02:15 PM",

    heartRate: 74,
    bloodPressure: "118/76",
    oxygenLevel: 99,
    temperature: "98.4°F",

    riskLevel: "Low",
    riskScore: 28,

    status: "Stable",

    doctor: "Dr. Ravi",
    department: "General Medicine",

    notes:
      "Patient responding well to treatment. Continue current medication.",

    symptoms: [
      "Weakness",
      "Fatigue",
    ],
  },

  {
    id: "P10237",
    name: "Mahesh Rao",
    age: 71,
    gender: "Male",
    room: "ICU-05",
    admitDate: "19-05-2026",
    admitTime: "06:20 PM",

    heartRate: 101,
    bloodPressure: "145/92",
    oxygenLevel: 91,
    temperature: "100.2°F",

    riskLevel: "Severe",
    riskScore: 91,

    status: "Critical",

    doctor: "Dr. Karthik",
    department: "Emergency",

    notes:
      "Critical patient. Immediate medical attention and continuous ICU monitoring required.",

    symptoms: [
      "Breathing difficulty",
      "High fever",
      "Chest pain",
    ],
  },

  {
    id: "P10238",
    name: "Deepika Varma",
    age: 34,
    gender: "Female",
    room: "GEN-18",
    admitDate: "22-05-2026",
    admitTime: "09:10 AM",

    heartRate: 72,
    bloodPressure: "116/74",
    oxygenLevel: 98,
    temperature: "98.2°F",

    riskLevel: "Low",
    riskScore: 19,

    status: "Stable",

    doctor: "Dr. Priya",
    department: "Pediatrics",

    notes:
      "Patient stable and responding positively to treatment.",

    symptoms: [
      "Mild cough",
      "Fatigue",
    ],
  },
];

export default patients;