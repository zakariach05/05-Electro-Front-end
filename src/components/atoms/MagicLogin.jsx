import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../services/api';

const MagicLogin = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);

    const sendLink = async () => {
        setLoading(true);
        setStatus(null);
        try {
            const res = await axios.post(`${API_URL}/auth/magic-link`, { email });
            const msg = res.data.message || "Verifiez votre email.";
            setStatus({ type: 'success', message: msg });
        } catch (err) {
            const errMsg = err && err.response && err.response.data && err.response.data.error;
            const fallback = "Erreur lors de l'envoi.";
            setStatus({ type: 'error', message: errMsg || fallback });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <div className="mt-2 flex gap-2">
                <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="vous@exemple.com" className="flex-1 p-3 rounded-lg border border-gray-200" />
                <button onClick={sendLink} disabled={!email || loading} className="px-4 py-3 bg-primary text-white rounded-lg font-bold disabled:opacity-50">
                    {loading ? 'Envoi...' : 'Continuer avec Email'}
                </button>
            </div>

            {status && (
                <p className={`mt-3 text-sm ${status.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{status.message}</p>
            )}

            <p className="mt-4 text-xs text-gray-500">Nous vous enverrons un lien sécurisé valable 10 minutes.</p>
        </div>
    );
};

export default MagicLogin;
