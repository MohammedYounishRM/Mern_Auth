import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendResetSuccessEmail, sendPasswordResetEmail, sendVerificationEmail } from "../nodemailer/emails.js";

export const signup = async (req,res) => {
    const {name, email, password} = req.body;
    try {
        if(!name || !email || !password){
            throw new Error("All Fields Are Mandatory!");
        }

        const userAlreadyExists = await User.findOne({email});
        if(userAlreadyExists){
            return res.status(400).json({success: false, message: "User already exists!"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        const user = new User({
            name,
            email,
            password: hashedPassword,
            verificationToken,
            verificationTokenExpiresAt: Date.now()+24*60*60*1000
        });
    
        await user.save();
        generateTokenAndSetCookie(res, user._id);
        await sendVerificationEmail(user.email, verificationToken);

        res.status(201).json({
            success: true,
            message: "User Created Successfully",
            user: {
                ...user._doc,
                password: undefined,
            },
        });

    } catch (error) {
        res.status(400).json({success: false, message: error.message});
    }
};

export const verifyEmail = async (req,res) => {
    const {code} = req.body;
    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: {$gt: Date.now()}
        });

        if(!user){
            return res.status(400).json({
                success: false,
                message: "Invalid code / Expired verification token!"});
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Email Verified Successfully!",
            user: {
                ...user._doc,
                password: undefined,
            }
        });
    } catch (error) {
        console.log("Error in verifing email", error);
        res.status(500).json({
            success: false,
             message: "Error in verifing email! Server error!"});
    }
};

export const login = async (req,res) => {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                success: false,
                message: "No user found!"});
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({
                success: false,
                message: "Wrong password entered!"
            });
        }

        generateTokenAndSetCookie(res, user._id);
        user.lastLogin = new Date();
        await user.save();
        
        res.status(200).json({
                success: true,
                message: "LoggedIn Successfully",
                user: {
                    ...user._doc,
                    password: undefined
                }
        });
    } catch (error) {
        console.log("Error in login!", error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const logout = async (req,res) => {
    res.clearCookie("token");
    res.status(200).json({
        success: true,
        message: "LoggedOut Successfully"
    });
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found!" });
        }

        const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = Date.now() + 1 * 60 * 60 * 1000;
        await user.save();
        await sendPasswordResetEmail(user.email, resetToken);

        res.status(200).json({
            success: true,
            message: "Password Reset OTP Code Dispatched Successfully"
        });
    } catch (error) {
        console.log("Error in forgot password phase!", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const verifyResetOTP = async (req, res) => {
    try {
        const { code } = req.body;
        const user = await User.findOne({
            resetPasswordToken: code,
            resetPasswordExpiresAt: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User Mail not Found!"
            });
        }

        res.status(200).json({
            success: true,
            message: "OTP Code Verified Successfully"
        });
    } catch (error) {
        console.log("Error in verifying OTP code!", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { code, password } = req.body;
            const user = await User.findOne({
            resetPasswordToken: code,
            resetPasswordExpiresAt: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not Found!"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        await user.save();
        await sendResetSuccessEmail(user.email);

        res.status(200).json({
            success: true,
            message: "Password Updated Successfully"
        });
    } catch (error) {
        console.log("Error in reset password!", error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password"); //-password for unselect the password
        if(!user){
            return res.status(400).json({
                success: false,
                message: "User Mail not found!"
            });
        }
        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};