const User = require("../models/user");
const Medicine = require("../models/medicine")
const { sendReminderSms } = require("../utils/sendSms");
// ADD MULTIPLE MEDICINES
const addMedicine = async (req, res) => {
  try {
    const { medicines } = req.body;
    const data = medicines.map((med) => ({
      user: req.user.id,
      name: med.name,
      dose: med.dose,
      time: med.time,
    }));
    const result = await Medicine.insertMany(data);
    res.status(201).json({
      message: "Medicines added successfully",
      total: result.length,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET MEDICINES LIST
const getMedicines = async (req, res) => {
  try {
    const { userId } = req.params;
    const medicines = await Medicine.find({ user: userId });
    res.status(200).json({
      message: "Medicines fetched successfully",
      medicines,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET SINGLE MEDICINE
const getMedicineById = async (req, res) => {
  try {
    const { id } = req.params;
    const medicine = await Medicine.findById(id);
    if (!medicine) {
      return res.status(404).json({
        message: "Medicine not found",
      });
    }
    res.status(200).json({
      message: "Medicine fetched successfully",
      medicine,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE MEDICINE
const deleteMedicine = async (req, res) => {
  try {
    const { id } = req.params;

    const medicine = await Medicine.findByIdAndDelete(id);

    if (!medicine) {
      return res.status(404).json({
        message: "Medicine not found",
      });
    }

    res.status(200).json({
      message: "Medicine deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE MEDICINE
const updateMedicine = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, dose, time} = req.body;

    const medicine = await Medicine.findById(id);

    if (!medicine) {
      return res.status(404).json({
        message: "Medicine not found",
      });
    }

    // Sirf apni medicine update karne do
    if (medicine.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

      // Sirf allowed fields update karo
    medicine.name = name ?? medicine.name;
    medicine.dose = dose ?? medicine.dose;
    medicine.time = time ?? medicine.time;
    await medicine.save();

    res.status(200).json({
      message: "Medicine updated successfully",
      medicine,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const setReminder = async (req, res) => {
  try {
    const { medicineId } = req.body;

    const medicine = await Medicine.findById(medicineId);

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
    }

    // Reminder ON karo
    medicine.reminderEnabled = true;

    await medicine.save();

    res.status(200).json({
      success: true,
      message: "Reminder set successfully",
      medicine,
    });

  } catch (error) {
    console.error("Set Reminder Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to set reminder",
    });
  }
};


module.exports = {
  addMedicine,
  getMedicines,
  deleteMedicine,
  updateMedicine,
  getMedicineById,
  setReminder
};
