import cron from "node-cron";
import OtpModel from "../model/otp.model.js";

// runs every 10 minutes
cron.schedule("*/10 * * * *", async () => {
    try {
        const now = new Date();
        const deleted = await OtpModel.deleteMany({ otpExpires: { $lt: now } });
        if (deleted.deletedCount > 0) {
            console.log(`🧹 Cleaned up ${deleted.deletedCount} expired OTP(s)`);
        }
    } catch (err) {
        console.error("OTP cleanup error:", err.message);
    }
});
