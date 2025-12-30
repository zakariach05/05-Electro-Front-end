import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            fetchUser();
        } else {
            setLoading(false);
        }
    }, [token]);

    const fetchUser = async () => {
        try {
            const response = await axios.get(`${API_URL}/user`);
            setUser(response.data);
        } catch (error) {
            console.error("Fetch user error:", error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await axios.post(`${API_URL}/login`, { email, password });
            const { access_token, user } = response.data;
            localStorage.setItem('token', access_token);
            setToken(access_token);
            setUser(user);
            return response.data;
        } catch (err) {
            console.error('Login failed:', err.response?.status, err.response?.data || err.message);
            throw err;
        }
    };

    const register = async (userData) => {
        try {
            const response = await axios.post(`${API_URL}/register`, userData);
            const { access_token, user } = response.data;
            localStorage.setItem('token', access_token);
            setToken(access_token);
            setUser(user);
            return response.data;
        } catch (err) {
            console.error('Register failed:', err.response?.status, err.response?.data || err.message);
            throw err;
        }
    };

    const logout = async () => {
        try {
            if (token) {
                await axios.post(`${API_URL}/logout`);
            }
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
            delete axios.defaults.headers.common['Authorization'];
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, token, login, register, logout, isAdmin: user?.role === 'admin' }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
