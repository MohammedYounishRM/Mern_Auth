import React, { useState, useEffect } from "react";
import { useAuthStore } from "./authStore.js";
import { useNavigate, useLocation } from "react-router-dom";
import Input from "./Input.jsx";
import { Lock } from "lucide-react";
import toast from "react-hot-toast";

const ResetPasswordPage = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    
    const navigate = useNavigate();
    const location = useLocation();
    const { resetPassword, error, isLoading, message } = useAuthStore();
    const code = location.state.verifiedCode || "";

    useEffect(() => {
        if (!code) {
            toast.error("Session missing. Please start over.");
            navigate("/forgot-password");
        }
    }, [code, navigate]);

    useEffect(() => {
        if (isSuccess) {
            const timer = setTimeout(() => {
                navigate("/login");
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isSuccess, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords Does Not Match!");
            return;
        }

        try {
            await resetPassword(code, password);
            toast.success("Security configuration modified successfully! Redirecting...");
            setIsSuccess(true);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="auth-container">
            <h2 style={{ textAlign: 'center' }}>Set New Password</h2>
            <form onSubmit={handleSubmit}>
                <p>Please Enter Your New Authentication Password</p>
                <Input
                    icon={Lock}
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading || isSuccess}
                />
                <Input
                    icon={Lock}
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isLoading || isSuccess}
                />
                {error && <p className="error-text">{error}</p>}
                {isSuccess ? (
                    <button
                        type="button"
                        className="btn-primary"
                        onClick={() => navigate("/login")}>Go to Login Page
                    </button>
                ) : (
                    <button className="btn-primary" type="submit" disabled={isLoading}>
                        {isLoading ? "Processing Changes..." : "Set New Password"}
                    </button>
                )}
            </form>
        </div>
    );
};

export default ResetPasswordPage;