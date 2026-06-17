import axios from "axios";
import { create } from "zustand";

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api/auth" : "/api/auth";
axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    error: null,
    isLoading: false,
    isCheckingAuth: true,
    message: null,

    signup: async (name, email, password) => {
        set({isLoading: true, error: null});
        try {
            const response = await axios.post(`${API_URL}/signup`,{name, email, password});
            set({user: response.data.user, isAuthenticated: true, isLoading: false});
        } catch (error) {
            set({error: error.response.data.message || "Error In Signing Up",isLoading: false});
            throw error;
        }
    },

    login: async (email, password) => {
        set({isLoading: true, error: null});
        try {
            const response = await axios.post(`${API_URL}/login`,{email, password});
            set({user: response.data.user, isAuthenticated: true, isLoading: false, error: null});
        } catch (error) {
            set({error: error.response.data.message || "Error In Logging In",isLoading: false});
            throw error;
        }
    },
    
    logout: async (email, password) => {
        set({isLoading: true, error: null});
        try {
            await axios.post(`${API_URL}/logout`);
            set({user: null, isAuthenticated: false, isLoading: false, error: null});
        } catch (error) {
            set({error: "Error In Logging Out",isLoading: false});
            throw error;
        }
    },

    verifyEmail: async (code) => {
        set({isLoading: true, error: null});
        try {
            const response = await axios.post(`${API_URL}/verify-email`,{code});
            set({user: response.data.user, isAuthenticated: true, isLoading: false});
        } catch (error) {
            set({error: error.response.data.message || "Error In Verifying Email",isLoading: false});
            throw error;
        }
    },

    checkAuth: async () => {
        set({isCheckingAuth: true, error: null});
        try {
            const response = await axios.get(`${API_URL}/check-auth`);
            set({user: response.data.user, isAuthenticated: true, isCheckingAuth: false});
        } catch (error) {
            set({error: null,isAuthenticated: false, isCheckingAuth: false});
        }
    },

    forgotPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/forgot-password`, { email });
            set({ message: response.data.message, isLoading: false, email: email }); 
        } catch (error) {
            set({ error: error.response.data.message || "Error In Sending Reset Password Email", isLoading: false });
            throw error;
        }
    },

    verifyResetOtp: async (code) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/verify-reset-otp`, { code });
            set({ message: response.data.message, isLoading: false });
            return response.data;
        } catch (error) {
            set({ error: error.response.data.message || "Invalid or expired code", isLoading: false });
            throw error;
        }
    },

    resetPassword: async (code, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/reset-password`, { code, password });
            set({ message: response.data.message, isLoading: false });
        } catch (error) {
            set({ isLoading: false, error: error.response.data.message || "Error In Resetting Password" });
            throw error;
        }
    }
}));