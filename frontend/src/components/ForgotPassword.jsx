import React from "react";
import { useAuthStore } from "./authStore.js";
import Input from "./Input.jsx";
import { ArrowLeft, Loader, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ForgotPasswordPage = () => {
    const [email, setEmail] = React.useState("");
    const { isLoading, forgotPassword, error } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await forgotPassword(email);
            toast.success("6-Digit OTP code dispatched to your mailbox");
            navigate("/verify-reset-otp");
        } catch (err) {
            toast.error(error || "Failed to initiate reset password!");
        }
    };
    
    return (
        <div className="auth-container">
            <h2>Forgot Password</h2>
            <form onSubmit={handleSubmit}>
                <p>Enter your email below and we will send a 6-digit verification code.</p>
                <Input icon={Mail} type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <button className="btn-primary" type="submit" disabled={isLoading}>
                    {isLoading ? <Loader className="animate-spin" size={18} /> : "Send Reset Code"}
                </button>
            </form>
            <div className="auth-footer">
                <Link to={"/login"}><ArrowLeft size={16} /> Back To Login</Link>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;