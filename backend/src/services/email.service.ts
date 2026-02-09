import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendOTP = async (email: string, otp: string) => {

    const mailOptions = {
        from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
        to: email,
        subject: "Your Password Reset OTP",
        text: `Your OTP for password reset is: ${otp}. It will expire in 10 minutes.`,
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #333;">Password Reset Request</h2>
                <p>You requested a password reset. Use the following OTP to proceed:</p>
                <div style="font-size: 24px; font-weight: bold; color: #f08e80; padding: 10px; background: #fdf0e6; display: inline-block; border-radius: 5px;">
                    ${otp}
                </div>
                <p style="margin-top: 20px; color: #666; font-size: 14px;">This OTP will expire in 10 minutes.</p>
                <p style="color: #666; font-size: 14px;">If you didn't request this, please ignore this email.</p>
            </div>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email successfully sent to ${email}`);
        console.log(`Message ID: ${info.messageId}`);
    } catch (error: any) {
        console.error("CRITICAL: Email sending failed!");
        console.error("Error Message:", error.message);
        console.error("Error Stack:", error.stack);

        if (process.env.NODE_ENV === "production") {
            throw error;
        }
    }
};
