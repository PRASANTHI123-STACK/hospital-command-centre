
const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");

// ==========================================
// CREATE A NEW APPOINTMENT
// ==========================================
const createAppointment = async (req, res) => {
  try {
    const {
      appointmentId,
      patientId,
      doctorId,
      department,
      appointmentDate,
      appointmentTime,
      appointmentType,
      room,
      reason,
      status,
      notes,
    } = req.body;

    if (
      !appointmentId ||
      !patientId ||
      !doctorId ||
      !department ||
      !appointmentDate ||
      !appointmentTime
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required appointment fields.",
      });
    }

    // Verify patient
    const patient = await Patient.findOne({ patientId });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found.",
      });
    }

    // Verify selected doctor
    const doctor = await Doctor.findOne({ doctorId });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found.",
      });
    }

    // Check doctor availability
    if (["On Leave", "Offline"].includes(doctor.status)) {
      return res.status(400).json({
        success: false,
        message: "This doctor is currently unavailable for booking.",
      });
    }

    // Validate appointment date
    const parsedDate = new Date(appointmentDate);

    if (Number.isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment date.",
      });
    }

    // Calendar-day boundaries
    const dateOnly = String(appointmentDate).slice(0, 10);
    const dateStart = new Date(`${dateOnly}T00:00:00.000Z`);
    const dateEnd = new Date(`${dateOnly}T23:59:59.999Z`);

    if (
      Number.isNaN(dateStart.getTime()) ||
      Number.isNaN(dateEnd.getTime())
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment date.",
      });
    }

    // Prevent the same doctor from being double-booked
    // for the same date and time.
    const existingAppointment = await Appointment.findOne({
      doctorId: doctor.doctorId,
      appointmentDate: {
        $gte: dateStart,
        $lte: dateEnd,
      },
      appointmentTime: appointmentTime.trim(),
      status: {
        $nin: ["Cancelled", "Completed"],
      },
    });

    if (existingAppointment) {
      return res.status(409).json({
        success: false,
        message:
          "This doctor is already booked for this date and time. Please choose another slot.",
      });
    }

    // Save the selected doctor's ID in the appointment.
    // Doctor name and room will be retrieved using doctorId.
    const appointment = new Appointment({
      appointmentId: appointmentId.trim(),
      patientId: patient.patientId,
      doctorId: doctor.doctorId,
      department: doctor.department || department,
      appointmentDate: parsedDate,
      appointmentTime: appointmentTime.trim(),
      appointmentType: appointmentType || "Consultation",
      room: room || doctor.room || "",
      reason: reason || "",
      status: status || "Confirmed",
      notes: notes || "",
    });

    const savedAppointment = await appointment.save();

    return res.status(201).json({
      success: true,
      message: "Appointment booked successfully.",
      appointment: {
        ...savedAppointment.toObject(),
        doctorName: doctor.name,
        doctorRoom: doctor.room || savedAppointment.room || "",
      },
    });
  } catch (error) {
    console.error("Create appointment error:", error.message);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "This appointment ID already exists. Please retry your booking.",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Unable to create appointment.",
    });
  }
};

// ==========================================
// GET ALL APPOINTMENTS
// ==========================================
const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({
      appointmentDate: 1,
      appointmentTime: 1,
    });

    return res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    console.error("Get appointments error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve appointments.",
    });
  }
};

// ==========================================
// GET APPOINTMENTS FOR ONE PATIENT
// ==========================================
const getPatientAppointments = async (req, res) => {
  try {
    const { patientId } = req.params;

    if (!patientId) {
      return res.status(400).json({
        success: false,
        message: "Patient ID is required.",
      });
    }

    const patient = await Patient.findOne({ patientId });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found.",
      });
    }

    // Newest-created appointment first
    const appointments = await Appointment.find({
      patientId: patient.patientId,
    })
      .sort({ createdAt: -1 })
      .lean();

    // Get current doctor information for every appointment
    const appointmentsWithDoctor = await Promise.all(
      appointments.map(async (appointment) => {
        const doctor = await Doctor.findOne({
          doctorId: appointment.doctorId,
        })
          .select("doctorId name department room")
          .lean();

        return {
          ...appointment,
          doctorName: doctor?.name || "Doctor not found",
          doctorRoom: doctor?.room || appointment.room || "",
          doctorDepartment:
            doctor?.department || appointment.department || "",
        };
      })
    );

    return res.status(200).json({
      success: true,
      count: appointmentsWithDoctor.length,
      appointments: appointmentsWithDoctor,
    });
  } catch (error) {
    console.error("Get patient appointments error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve patient appointments.",
    });
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  getPatientAppointments,
};
