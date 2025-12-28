import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../services/api';

const MagicVerify = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [status, setStatus] = useState('Vérification...');

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        if (!token) {
            setStatus('Token manquant');
            return;
        }

        const verify = async () => {
            try {
                const res = await axios.post(`${API_URL}/auth/magic-verify`, { token });
                const tokenPlain = res.data.token;
                // store token and reload to let AuthProvider pick it up
                localStorage.setItem('token', tokenPlain);
                window.location.href = '/';
            } catch (err) {
                setStatus(err.response?.data?.error || 'Erreur lors de la vérification');
            }
        };
        verify();
    }, [location.search, navigate]);

    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-md text-center">
                <p className="font-bold">{status}</p>
            </div>
        </div>
    );
};

export default MagicVerify;
