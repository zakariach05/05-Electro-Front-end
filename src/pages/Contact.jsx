import React, { useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import { Mail, Phone, MapPin, Send, MessageSquare, ShieldCheck, Clock } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../services/api';
import SEO from '../components/atoms/SEO';
import { useLanguage } from '../context/LanguageContext';

const Contact = () => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            const response = await axios.post(`${API_URL}/contact`, formData);
            if (response.data.success) {
                setStatus({ type: 'success', message: t('contact.form.success') });
                setFormData({ name: '', email: '', subject: '', message: '' });
            }
        } catch (error) {
            const errorMsg = error.response?.data?.debug || error.response?.data?.message || t('common.error');
            setStatus({ type: 'error', message: errorMsg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout>
            <SEO title={t('contact.title')} description="Contactez l'équipe Electro-05 pour toute question ou demande de support." />

            <div className="bg-gray-50 min-h-screen py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">{t('contact.subtitle')}</h1>
                        <p className="text-gray-500 text-lg max-w-2xl mx-auto font-medium">
                            {t('contact.desc')}
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-12 items-start">

                        {/* Contact Info Cards */}
                        <div className="lg:col-span-4 space-y-6">
                            <ContactInfoCard
                                icon={<Phone className="text-primary" />}
                                title={t('contact.form.subject')}
                                content="+212 5XX XX XX XX"
                                subContent="Lun-Sam, 9h-19h"
                            />
                            <ContactInfoCard
                                icon={<Mail className="text-primary" />}
                                title="Email Support"
                                content="chamekhzakaria95@gmail.com"
                                subContent="Réponse en moins de 24h"
                            />
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-8 bg-white rounded-[40px] p-8 md:p-12 shadow-xl border border-gray-100">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                                    <MessageSquare size={24} />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">{t('contact.form.submit')}</h2>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-black text-gray-700 uppercase tracking-widest pl-1">{t('contact.form.name')}</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            placeholder={t('contact.form.placeholder_name')}
                                            className="w-full bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-2xl p-4 outline-none transition-all font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-black text-gray-700 uppercase tracking-widest pl-1">{t('contact.form.email')}</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            placeholder="votre@email.com"
                                            className="w-full bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-2xl p-4 outline-none transition-all font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-black text-gray-700 uppercase tracking-widest pl-1">{t('contact.form.subject')}</label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        placeholder="Ex: Question sur l'iPhone 15 Pro"
                                        className="w-full bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-2xl p-4 outline-none transition-all font-medium"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-black text-gray-700 uppercase tracking-widest pl-1">{t('contact.form.message')}</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows="5"
                                        placeholder={t('contact.form.placeholder_message')}
                                        className="w-full bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-2xl p-4 outline-none transition-all font-medium resize-none"
                                    ></textarea>
                                </div>

                                {status.message && (
                                    <div className={`p-4 rounded-2xl font-bold flex items-center gap-3 animate-fade-in ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                                        }`}>
                                        <div className={`w-2 h-2 rounded-full ${status.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                                        {status.message}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-magnetic w-full bg-gray-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-primary transition-all shadow-xl flex items-center justify-center gap-3 group disabled:opacity-50"
                                >
                                    {loading ? (
                                        <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            {t('contact.form.submit')}
                                            <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

const ContactInfoCard = ({ icon, title, content, subContent }) => (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start gap-4 group hover:border-primary transition-all">
        <div className="p-4 bg-gray-50 rounded-2xl group-hover:bg-primary group-hover:text-white transition-all transform group-hover:rotate-6">
            {icon}
        </div>
        <div>
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{title}</h4>
            <p className="text-lg font-bold text-gray-900 mb-1">{content}</p>
            <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
                <Clock size={12} /> {subContent}
            </p>
        </div>
    </div>
);

export default Contact;
