import twilio from "twilio";
import "dotenv/config";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

const sendReminderSms = async (to, medicineName, dose, time) => {
  try {
    await client.messages.create({
      body: `Reminder: Time to take ${medicineName}. Dose: ${dose}. Time: ${time}.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${to}`,
    });

    console.log("Reminder SMS sent successfully");
  } catch (error) {
    console.error("Error sending reminder SMS:", error);
    throw new Error("Failed to send reminder SMS");
  }
};

export { sendReminderSms };
