import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Loader } from 'lucide-react';
import Input from "./Input.jsx";
import { useAuthStore } from "./authStore.js";

const SignUpPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { signup, error, isLoading } = useAuthStore();
    const navigate = useNavigate();
    
    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            await signup(name, email, password);
            navigate("/verify-email");
        } catch (err) {
            console.error(err);
        }
    };

    return (
    <div className="auth-container">
        <h2 style={{ textAlign: 'center' }}>Create Account</h2>
        <p>Get Started To Explore The Secured World</p>
        <form onSubmit={handleSignUp}>
            <Input 
                icon={User}
                type='text'
                placeholder='Full Name'
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
            />
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
            {error && <p className="error-text">{error}</p>}
            
            <button className="btn-primary" type="submit" disabled={isLoading}>
                {isLoading ? <Loader className="animate-spin" size={18} /> : "Sign Up"}
            </button>
        </form>
        <div className="auth-footer">
            <p>Already Have An Account?
                <Link to="/login">Login</Link>
            </p>
        </div>
    </div>
    );
};

export default SignUpPage;