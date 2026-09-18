const express = require("express");
const cors = require("cors");
require("dotenv").config({ quiet: true });

const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const medicineRoutes = require("./routes/medicineRoutes");

const startReminderCron = require("./utils/reminderCron");

const app = express();

app.use(cors());
app.use(express.json());

// =========================
// DATABASE
// =========================
connectDB();
app.get("/", (req, res) => {
  res.send("Server is running");
});

// =========================
// ROUTES
// =========================
app.use("/api/users", userRoutes);

app.use("/api/medicines", medicineRoutes);

// =========================
// HOME
// =========================
app.get("/", (req, res) => {
  res.send("Backend Running");
});

// =========================
// START SERVER
// =========================
app.listen(5000, () => {
  console.log("Server running on port 5000");

  // Start medicine reminder cron
  startReminderCron();
});