import nodemailer from "nodemailer";
import { Password_Reset_Req_Tem, Password_Reset_Success_Tem, Verification_Email_Tem } from "./emailTemplates.js";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false
    }
});

const sender = `"Authentication System" <${process.env.VERIFIED_SENDER_EMAIL}>`;

export const sendVerificationEmail = async (email, verificationToken) => {
    try {
        await transporter.sendMail({
            from: sender,
            to: email,
            subject: "Verify Your Email",
            html: Verification_Email_Tem.replace("{verificationCode}", verificationToken),
        });
        console.log("Verification Email Dispatched Successfully");
    } catch (error) {
        console.error("Verification-Mail error details:", error);
        throw new Error(`Error in sending verification email: ${error.message}`);
    }
};

export const sendPasswordResetEmail = async (email, resetCode) => {
    try {
        await transporter.sendMail({
            from: sender,
            to: email,
            subject: "Reset Your Password Code",
            html: Password_Reset_Req_Tem.replace("{resetCode}", resetCode),
        });
        console.log("Password Reset Code Email Dispatched Successfully");
    } catch (error) {
        console.error("Reset password request error:", error);
        throw new Error(`Error in sending password reset email: ${error.message}`);
    }
};

export const sendResetSuccessEmail = async (email) => {
    try {
        await transporter.sendMail({
            from: sender,
            to: email,
            subject: "Password Reset Successful",
            html: Password_Reset_Success_Tem,
        });
        console.log("Reset Password-Success Email Dispatched Successfully");
    } catch (error) {
        console.error("Password reset mail error:", error);
        throw new Error(`Error in sending reset password email: ${error.message}`);
    }
};