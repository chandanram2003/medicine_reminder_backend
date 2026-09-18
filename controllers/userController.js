const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const { name, email, age, password, mob, profile } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      age,
      password: hashedPassword,
      mob,
      profile,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        mob:user.mob,
        age:user.age
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGOUT USER
const logoutUser = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Logout successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, dose, time } = req.body;

    const medicine = await Medicine.findById(id);

    if (!medicine) {
      return res.status(404).json({
        message: "Medicine not found",
      });
    }

    // Sirf apni medicine update kar sakta hai
    if (medicine.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    medicine.name = name || medicine.name;
    medicine.dose = dose || medicine.dose;
    medicine.time = time || medicine.time;

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
module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};