import nodemailer from "nodemailer";

/**
 * Sends a styled HTML email (Gmail SMTP)
 * @param {string} to 
 * @param {string} subject
 * @param {string} otp
 */
export const sendEmail = async (to, subject, otp) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const htmlTemplate = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f4f6f8; padding: 40px 0;">
        <div style="max-width: 600px; background: white; margin: 0 auto; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
          <div style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; text-align: center; padding: 30px 0;">
            <h1 style="margin: 0;">Tasker</h1>
            <p style="margin: 5px 0; font-size: 15px;">Your trusted productivity companion</p>
          </div>

          <div style="padding: 30px; text-align: center;">
            <h2 style="color: #333;">Verify Your Email Address</h2>
            <p style="color: #666; font-size: 15px; margin-top: 10px;">
              Use the OTP below to verify your account. This code is valid for <strong>2 minutes</strong>.
            </p>

            <div style="margin: 30px 0;">
              <div style="display: inline-block; background: #667eea; color: white; font-size: 24px; letter-spacing: 1px; padding: 15px 40px; border-radius: 8px;">
                ${otp}
              </div>
            </div>

            <p style="color: #999; font-size: 13px;">
              Didn’t request this? Please ignore this email.
            </p>
          </div>

          <div style="background: #f1f1f1; text-align: center; padding: 20px; font-size: 13px; color: #888;">
            © ${new Date().getFullYear()} Tasker Inc. All rights reserved.
          </div>
        </div>
      </div>
    `;

        const mailOptions = {
            from: `"Tasker" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html: htmlTemplate, // use HTML instead of text
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ OTP sent successfully to ${to}`);
    } catch (error) {
        console.error("❌ Email sending failed:", error.message);
        throw new Error("Failed to send email");
    }
};
