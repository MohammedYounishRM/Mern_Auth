import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "./authStore.js";
import toast from "react-hot-toast";

const EmailVerificationPage = () => {
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef([]);
    const navigate = useNavigate();
    const { error, isLoading, verifyEmail } = useAuthStore();

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
        const verificationCode = code.join("");
        
        if (verificationCode.length !== 6) {
            toast.error("Please enter the complete 6-digit code!");
            return;
        }

        try {
            await verifyEmail(verificationCode);
            navigate("/");
            toast.success("Email Is Verified Successfully!");
        } catch (err) {
            toast.error(error || "Invalid code.");
        }
    };

    useEffect(() => {
        if (code.every(digit => digit !== "")) {
            handleSubmit();
        }}, [code]);

    return (
        <div className="auth-container">
            <h2>Verify Email</h2>
            <p>Enter The 6-digit Code Sent To Your Email</p>
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
                    {isLoading ? "Verifying..." : "Verify Email"}
                </button>
				<div className="auth-footer">
                    <p>Did not receive Email? check Spam folder</p>
                </div>
			</form>
        </div>
    );
};

export default EmailVerificationPage;
