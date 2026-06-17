import React, { useState, useRef, useEffect } from "react";
import { useAuthStore } from "./authStore.js";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const VerifyResetOtpPage = () => {
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef([]);
    const navigate = useNavigate();
    const { error, isLoading, verifyResetOtp } = useAuthStore();

    const handleChange = (index, value) => {
        const newCode = [...code];
        if (value.length > 1) {
            const pastedCode = value.slice(0, 6).split("");
            for (let i = 0; i < 6; i++) {
                newCode[i] = pastedCode[i] || "";
            }
            setCode(newCode);
            const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
            const focusingIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
            inputRefs.current[focusingIndex].focus();
        } else {
            newCode[index] = value;
            setCode(newCode);
            if (value && index < 5) {
                inputRefs.current[index + 1].focus();
            }
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleSubmit = async (e) => {
        if (e) {e.preventDefault()};
        const otpCode = code.join("");
        
        if (otpCode.length !== 6) {
            toast.error("Please enter the complete 6-digit string");
            return;
        }

        try {
            const result = await verifyResetOtp(otpCode);
            if (result.success) {
                toast.success("Code Match Confirmed!");
                navigate("/reset-password", { state: { verifiedCode: otpCode } });
            }
        } catch (err) {
            toast.error(error || "Invalid reset code.");
        }
    };

    useEffect(() => {
        if (code.every(digit => digit !== "")) {
            handleSubmit();
        }}, [code]);

    return (
        <div className="auth-container">
            <h2 style={{ textAlign: 'center' }}>Verify Code</h2>
            <p>Enter the 6-digit authorization code sent to your email</p>
            <form onSubmit={handleSubmit}>
                <div className="code-inputs-container">
                    {code.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => (inputRefs.current[index] = el)}
                            type="text"
                            maxLength={1}
                            className="code-input"
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                        />
                    ))}
                </div>
                {error && <p className="error-text">{error}</p>}
                <button className="btn-primary" type="submit" disabled={isLoading}>
                    {isLoading ? "Validating..." : "Verify OTP"}
                </button>
                <div className="auth-footer">
                    <p>Did not receive Email? check Spam folder</p>
                </div>
            </form>
        </div>
    );
};

export default VerifyResetOtpPage;
