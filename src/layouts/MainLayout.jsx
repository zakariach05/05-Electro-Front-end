import React, { useState, useEffect } from 'react';
import Header from '../components/layouts/Header';
import Footer from '../components/layouts/Footer';
import { useNavigate, useLocation } from 'react-router-dom';
import CompareBar from '../components/organisms/CompareBar';
import { useLanguage } from '../context/LanguageContext';
import WhatsAppButton from '../components/atoms/WhatsAppButton';
import { useAuth } from '../context/AuthContext';

const MainLayout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isPageVisible, setIsPageVisible] = useState(false);
    const { language } = useLanguage();

    useEffect(() => {
        // Rule: Admin cannot access public site
        if (user?.role === 'admin' && !location.pathname.startsWith('/admin')) {
            navigate('/admin/dashboard');
        }
    }, [user, location.pathname, navigate]);

    useEffect(() => {
        setIsPageVisible(false);
        const timer = setTimeout(() => setIsPageVisible(true), 50);
        return () => clearTimeout(timer);
    }, [location.pathname]);

    return (
        <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col ${language === 'ar' ? 'font-arabic' : 'font-sans'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <Header />
            <main className={`flex-grow pt-16 transition-opacity duration-500 ease-in-out ${isPageVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                {children}
            </main>
            <Footer />
            <CompareBar />
            <WhatsAppButton />
        </div>
    );
};

export default MainLayout;
