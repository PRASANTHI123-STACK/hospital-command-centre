import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

import {
  UsersRound,
  BedDouble,
  UserRound,
  CalendarDays,
  ArrowUpRight,
  ArrowDownRight,
  Ambulance,
  HeartPulse,
  Activity,
  DollarSign,
  UserPlus,
  Clock3,
} from "lucide-react";

const departmentData = [
  { name: "Cardiology", patients: 82 },
  { name: "Neurology", patients: 64 },
  { name: "Orthopedic", patients: 72 },
  { name: "Pediatrics", patients: 55 },
  { name: "Dermatology", patients: 43 },
];

const waitTimeData = [
  { day: "Mon", time: 18 },
  { day: "Tue", time: 22 },
  { day: "Wed", time: 20 },
  { day: "Thu", time: 16 },
  { day: "Fri", time: 19 },
  { day: "Sat", time: 21 },
  { day: "Sun", time: 15 },
];

const activityData = [
  { day: "Mon", value: 42 },
  { day: "Tue", value: 68 },
  { day: "Wed", value: 55 },
  { day: "Thu", value: 76 },
  { day: "Fri", value: 63 },
  { day: "Sat", value: 82 },
  { day: "Sun", value: 71 },
];

const bedData = [
  { name: "Occupied", value: 76 },
  { name: "Available", value: 24 },
];

const bedColors = ["#ef476f", "#06d6a0"];

function StatCard({
  title,
  value,
  change,
  positive,
  icon: Icon,
  iconClass,
}) {
  return (
    <div className="dashboard-stat-card">
      <div className="stat-card-top">
        <span>{title}</span>

        <div className={`stat-icon ${iconClass}`}>
          <Icon size={18} />
        </div>
      </div>

      <div className="stat-value">{value}</div>

      <div className={`stat-change ${positive ? "positive" : "negative"}`}>
        {positive ? (
          <ArrowUpRight size={14} />
        ) : (
          <ArrowDownRight size={14} />
        )}

        <span>{change}</span>

        <small>vs last week</small>
      </div>
    </div>
  );
}

function Dashboard() {
  return (
    <div className="dashboard-page">

      {/* PAGE HEADER */}
      <div className="dashboard-page-header">
        <div>
          <h1>Dashboard</h1>
          <p>
            Real-time overview of hospital operations and key metrics
          </p>
        </div>

        <button className="dashboard-date-button">
          <CalendarDays size={16} />
          This Week
        </button>
      </div>

      {/* STAT CARDS */}
      <div className="dashboard-stats">

        <StatCard
          title="Total Patients"
          value="2,543"
          change="+12.5%"
          positive={true}
          icon={UsersRound}
          iconClass="blue"
        />

        <StatCard
          title="Available Beds"
          value="156"
          change="+8.2%"
          positive={true}
          icon={BedDouble}
          iconClass="green"
        />

        <StatCard
          title="Doctors On Duty"
          value="89"
          change="+4.5%"
          positive={true}
          icon={UserRound}
          iconClass="cyan"
        />

        <StatCard
          title="Appointments"
          value="324"
          change="+15.8%"
          positive={true}
          icon={CalendarDays}
          iconClass="orange"
        />

      </div>

      {/* CHART ROW */}
      <div className="dashboard-grid-two">

        {/* APPOINTMENTS BY DEPARTMENT */}
        <div className="dashboard-card chart-card">

          <div className="card-header">
            <div>
              <h2>Appointments by Department</h2>
              <p>Current week</p>
            </div>

            <button className="card-menu">•••</button>
          </div>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentData}>
                <CartesianGrid
                  stroke="#263449"
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="name"
                  tick={{
                    fill: "#718096",
                    fontSize: 9,
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  tick={{
                    fill: "#718096",
                    fontSize: 9,
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  contentStyle={{
                    background: "#111c2d",
                    border: "1px solid #263449",
                    borderRadius: "8px",
                    color: "#ffffff",
                  }}
                />

                <Bar
                  dataKey="patients"
                  fill="#06b6d4"
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>

        {/* WAIT TIME */}
        <div className="dashboard-card chart-card">

          <div className="card-header">
            <div>
              <h2>Average Wait Time (mins)</h2>
              <p>Last 7 days</p>
            </div>

            <button className="card-menu">•••</button>
          </div>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={waitTimeData}>
                <CartesianGrid
                  stroke="#263449"
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="day"
                  tick={{
                    fill: "#718096",
                    fontSize: 9,
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  tick={{
                    fill: "#718096",
                    fontSize: 9,
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  contentStyle={{
                    background: "#111c2d",
                    border: "1px solid #263449",
                    borderRadius: "8px",
                    color: "#ffffff",
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="time"
                  stroke="#06b6d4"
                  strokeWidth={3}
                  dot={{
                    r: 3,
                    fill: "#06b6d4",
                  }}
                  activeDot={{
                    r: 5,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

        </div>

      </div>

      {/* OPERATIONS SNAPSHOT */}
      <div className="dashboard-card operations-card">

        <div className="card-header">
          <div>
            <h2>Operations Snapshot</h2>
            <p>Today's hospital activity</p>
          </div>

          <span className="live-indicator">
            <i></i>
            Live
          </span>
        </div>

        <div className="operations-grid">

          <div className="operation-item">
            <div className="operation-icon blue">
              <UserPlus size={18} />
            </div>

            <div>
              <span>Admissions</span>
              <strong>124</strong>
            </div>
          </div>

          <div className="operation-item">
            <div className="operation-icon green">
              <ArrowDownRight size={18} />
            </div>

            <div>
              <span>Discharges</span>
              <strong>82</strong>
            </div>
          </div>

          <div className="operation-item">
            <div className="operation-icon red">
              <HeartPulse size={18} />
            </div>

            <div>
              <span>ICU Utilization</span>
              <strong>78%</strong>
            </div>
          </div>

          <div className="operation-item">
            <div className="operation-icon purple">
              <DollarSign size={18} />
            </div>

            <div>
              <span>Revenue</span>
              <strong>₹84.2K</strong>
            </div>
          </div>

          <div className="operation-item">
            <div className="operation-icon orange">
              <Ambulance size={18} />
            </div>

            <div>
              <span>Ambulances</span>
              <strong>12</strong>
            </div>
          </div>

        </div>

      </div>

      {/* LOWER GRID */}
      <div className="dashboard-grid-lower">

        {/* ACTIVITY */}
        <div className="dashboard-card">

          <div className="card-header">
            <div>
              <h2>Weekly Activity</h2>
              <p>Patient activity this week</p>
            </div>
          </div>

          <div className="chart-container activity-chart">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>

                <defs>
                  <linearGradient
                    id="activityGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#06b6d4"
                      stopOpacity={0.35}
                    />

                    <stop
                      offset="100%"
                      stopColor="#06b6d4"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  stroke="#263449"
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="day"
                  tick={{
                    fill: "#718096",
                    fontSize: 9,
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  tick={{
                    fill: "#718096",
                    fontSize: 9,
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  contentStyle={{
                    background: "#111c2d",
                    border: "1px solid #263449",
                    borderRadius: "8px",
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#06b6d4"
                  fill="url(#activityGradient)"
                  strokeWidth={2}
                />

              </AreaChart>
            </ResponsiveContainer>
          </div>

        </div>

        {/* ADMISSIONS FUNNEL */}
        <div className="dashboard-card admissions-card">

          <div className="card-header">
            <div>
              <h2>Admissions Funnel</h2>
              <p>Patient journey</p>
            </div>
          </div>

          <div className="funnel-list">

            <div className="funnel-item">
              <div className="funnel-label">
                <span>Registered</span>
                <strong>320</strong>
              </div>

              <div className="funnel-bar">
                <span style={{ width: "100%" }}></span>
              </div>
            </div>

            <div className="funnel-item">
              <div className="funnel-label">
                <span>Triaged</span>
                <strong>260</strong>
              </div>

              <div className="funnel-bar">
                <span style={{ width: "81%" }}></span>
              </div>
            </div>

            <div className="funnel-item">
              <div className="funnel-label">
                <span>Consulted</span>
                <strong>210</strong>
              </div>

              <div className="funnel-bar">
                <span style={{ width: "66%" }}></span>
              </div>
            </div>

            <div className="funnel-item">
              <div className="funnel-label">
                <span>Admitted</span>
                <strong>140</strong>
              </div>

              <div className="funnel-bar">
                <span style={{ width: "44%" }}></span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* BOTTOM GRID */}
      <div className="dashboard-grid-bottom">

        {/* TOP DOCTORS */}
        <div className="dashboard-card doctors-performance">

          <div className="card-header">
            <div>
              <h2>Top Performing Doctors</h2>
              <p>Based on patient satisfaction</p>
            </div>
          </div>

          <div className="doctor-row">
            <div className="doctor-avatar">SS</div>

            <div className="doctor-details">
              <strong>Dr. Sarah Smith</strong>
              <span>Cardiology</span>
            </div>

            <div className="doctor-score">
              <strong>98%</strong>
              <div>
                <span style={{ width: "98%" }}></span>
              </div>
            </div>
          </div>

          <div className="doctor-row">
            <div className="doctor-avatar">ML</div>

            <div className="doctor-details">
              <strong>Dr. Michael Lee</strong>
              <span>Neurology</span>
            </div>

            <div className="doctor-score">
              <strong>95%</strong>
              <div>
                <span style={{ width: "95%" }}></span>
              </div>
            </div>
          </div>

          <div className="doctor-row">
            <div className="doctor-avatar">RP</div>

            <div className="doctor-details">
              <strong>Dr. Ravi Patel</strong>
              <span>Orthopedics</span>
            </div>

            <div className="doctor-score">
              <strong>92%</strong>
              <div>
                <span style={{ width: "92%" }}></span>
              </div>
            </div>
          </div>

        </div>

        {/* BED OCCUPANCY */}
        <div className="dashboard-card occupancy-card">

          <div className="card-header">
            <div>
              <h2>Bed Occupancy</h2>
              <p>Current hospital capacity</p>
            </div>
          </div>

          <div className="occupancy-content">

            <div className="occupancy-chart">

              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bedData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={72}
                    startAngle={90}
                    endAngle={-270}
                    paddingAngle={3}
                  >
                    {bedData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={bedColors[index]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              <div className="occupancy-center">
                <strong>76%</strong>
                <span>Occupied</span>
              </div>

            </div>

            <div className="occupancy-legend">

              <div>
                <span className="legend-dot occupied"></span>
                <p>Occupied</p>
                <strong>245</strong>
              </div>

              <div>
                <span className="legend-dot available"></span>
                <p>Available</p>
                <strong>75</strong>
              </div>

              <div>
                <span className="legend-dot total"></span>
                <p>Total Beds</p>
                <strong>320</strong>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* FOOTER */}
      <div className="dashboard-footer">
        <span>
          <Activity size={13} />
          Hospital systems operating normally
        </span>

        <span>
          <Clock3 size={13} />
          Last updated just now
        </span>
      </div>

    </div>
  );
}

export default Dashboard;