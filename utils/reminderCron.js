const cron = require("node-cron");

const Medicine = require("../models/medicine");
const User = require("../models/user");

const { sendReminderSms } = require("./sendSms");

const startReminderCron = () => {
  // Har minute sirf current-time reminders check honge
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();

      const currentTime = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(now);

      // ❗ Sirf current time wali medicines
      const medicines = await Medicine.find({
        reminderEnabled: true,
        time: currentTime,
      });

      // Agar koi medicine nahi hai
      if (medicines.length === 0) {
        return;
      }

      for (const medicine of medicines) {
        const user = await User.findById(medicine.user);
        await sendReminderSms(
          user.mob,
          medicine.name,
          medicine.dose,
          medicine.time,
        );

        console.log(`✅ SMS sent for ${medicine.name}`);
      }
    } catch (error) {
      console.error("❌ Cron Error:", error.message);
    }
  });

  console.log("🚀 Medicine Reminder Cron Started");
};

module.exports = startReminderCron;
