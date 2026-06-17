import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Loader } from 'lucide-react';
import Input from "./Input.jsx";
import { useAuthStore } from "./authStore.js";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { isLoading, login, error } = useAuthStore();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate("/");
        } catch (err) {
            console.error(err);
        }
    };
    
    return (
        <div className="auth-container">
            <h2 style={{ textAlign: 'center' }}>Welcome Back</h2>
            <p>Please enter credentials to Login your account</p>
            <form onSubmit={handleLogin}>
                <Input 
                    icon={Mail}
                    type='email'
                    placeholder='Enter Your Email'
                    value={email}
                    required
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Input 
                    icon={Lock}
                    type='password'
                    placeholder='Enter Your Password'
                    value={password}
                    required
                    onChange={(e) => setPassword(e.target.value)}
                />
                <div style={{ textAlign: 'right' }}>
                    <Link to="/forgot-password">
                        Forgot Password?
                    </Link>
                </div>
                {error && <p className="error-text">{error}</p>}
                <button className="btn-primary" type="submit" disabled={isLoading}>
                    {isLoading ? <Loader className="animate-spin" size={18} /> : "Login"}
                </button>
            </form>
            <div className="auth-footer">
                <p>Don't Have An Account?
                    <Link to="/signup">Signup Now</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;