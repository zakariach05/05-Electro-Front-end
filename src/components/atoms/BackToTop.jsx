import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

const BackToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        const toggleVisibility = () => {
            // Lower threshold to ensure it works for testing
            if (window.scrollY > 100) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    return (
        <button
            onClick={scrollToTop}
            aria-label="Retour en haut"
            className={`
                fixed bottom-8 left-8 z-[999] p-4 
                bg-gray-900 text-secondary dark:bg-white dark:text-primary
                rounded-full shadow-2xl
                transform transition-all duration-500 ease-in-out
                hover:shadow-xl hover:scale-110 hover:-translate-y-1
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 dark:focus:ring-white
                ${isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-10 pointer-events-none'}
            `}
        >
            <ArrowUp className="w-7 h-7" />
        </button>
    );
};

export default BackToTop;
