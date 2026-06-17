import React from "react";
import { useAuthStore } from "./authStore.js";

const HomePage = () => {
    const { user, logout } = useAuthStore();
    
    const handleLogout = () => {
        logout();
    };
    
    return (
        <div className="home-container">
            <h1 style={{ textAlign: 'center' }}>Welcome To HomePage After Successful Authentication!</h1>
            <div>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
            </div>
            <div>
                <button className="btn-primary" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default HomePage;