import cron from "node-cron";
import OtpModel from "../model/otp.model.js";
import WhatsappOtpModel from "../model/wpOTP.model.js";

// runs every 10 minutes
cron.schedule("*/1 * * * *", async () => {
    try {
        const now = new Date();
        const deleted = await OtpModel.deleteMany({ otpExpires: { $lt: now } });
        const whatsapp_deleted = await WhatsappOtpModel.deleteMany({ otpExpires: { $lt: now } });
        if (deleted.deletedCount > 0) {
            console.log(`🧹 Cleaned up ${deleted.deletedCount} expired OTP(s)`);
        }
         if (whatsapp_deleted.deletedCount > 0) {
            console.log(`🧹 Cleaned up whatsapp ${deleted.deletedCount} expired OTP(s)`);
        }
    } catch (err) {
        console.error("OTP cleanup error:", err.message);
    }
});
