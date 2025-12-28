import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

const BackToTop = () => {
    const [visible, setVisible] = useState(true);
    const [mounted, setMounted] = useState(false);

    const scrollToHero = () => {
        const hero = document.getElementById('hero');
        if (hero) {
            hero.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        const onScroll = () => {
            setVisible(window.scrollY > 120 || window.innerWidth < 1024);
        };
        window.addEventListener('scroll', onScroll);
        onScroll();
        // small delay to trigger entrance animation
        const t = setTimeout(() => setMounted(true), 60);
        return () => {
            window.removeEventListener('scroll', onScroll);
            clearTimeout(t);
        };
    }, []);

    if (!visible) return null;

    return (
        <button
            onClick={scrollToHero}
            aria-label="Retour au sommet"
            className={`fixed right-6 bottom-6 z-50 inline-flex items-center gap-3 px-4 py-3 bg-premium-gradient text-white rounded-full font-black transform transition-all duration-200 active:scale-95 ${mounted ? 'back-to-top-enter back-to-top-pulse' : 'opacity-0 translate-y-6'}`}
        >
            <span className="hidden sm:inline">Retour au sommet</span>
            <ArrowUp className="w-5 h-5" />
        </button>
    );
};

export default BackToTop;
