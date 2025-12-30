import React, { useState, useEffect } from 'react';
import { Timer, Zap } from 'lucide-react';

const DealOfTheDay = () => {
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        // Set deal end time to end of today
        const endTime = new Date();
        endTime.setHours(23, 59, 59, 999);

        const interval = setInterval(() => {
            const now = new Date();
            const difference = endTime - now;

            if (difference > 0) {
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((difference / 1000 / 60) % 60);
                const seconds = Math.floor((difference / 1000) % 60);
                setTimeLeft({ hours, minutes, seconds });
            } else {
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="py-12 bg-gray-900 text-white overflow-hidden relative">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-12">

                    {/* Text & Timer (centered on mobile, left on desktop) */}
                    <div className="w-full lg:w-1/2 max-w-2xl space-y-8 text-center lg:text-left mx-auto lg:mx-0">
                        <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/30 text-red-500 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider animate-pulse">
                            <Zap size={16} className="fill-current" /> Offre Flash Limitée
                        </div>

                        <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
                            Apple Watch Ultra <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
                                Édition Titane
                            </span>
                        </h2>

                        <p className="text-gray-400 text-lg max-w-md">
                            La montre ultime pour l'aventure. Boîtier en titane aérospatial, autonomie record et GPS double fréquence précis.
                        </p>

                        {/* Countdown */}
                        <div className="flex gap-4 justify-center lg:justify-start">
                            {['Heures', 'Minutes', 'Secondes'].map((label, idx) => {
                                const value = idx === 0 ? timeLeft.hours : idx === 1 ? timeLeft.minutes : timeLeft.seconds;
                                return (
                                    <div key={label} className="flex flex-col items-center">
                                        <div className="w-20 h-20 bg-gray-800 rounded-xl flex items-center justify-center text-3xl font-bold border border-gray-700 shadow-xl">
                                            {String(value).padStart(2, '0')}
                                        </div>
                                        <span className="text-xs text-gray-500 mt-2 uppercase tracking-wide font-medium">{label}</span>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="pt-4 flex justify-center lg:justify-start">
                            <button className="btn-magnetic px-10 py-4 bg-white text-gray-900 rounded-full font-bold hover:bg-gray-100 shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all transform hover:-translate-y-1">
                                Acheter Maintenant - 8990 DH
                            </button>
                        </div>
                    </div>

                    {/* Image Composition (right on desktop, centered below on narrow screens) */}
                    <div className="relative w-full lg:w-1/2 flex justify-center">
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent z-10"></div>
                        {/* Circle Background */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gray-800 rounded-full border border-gray-700"></div>

                        <img
                            src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=600&auto=format&fit=crop"
                            alt="Apple Watch Ultra"
                            className="relative z-20 w-full max-w-sm mx-auto drop-shadow-2xl animate-float rounded-[40px]"
                        />

                        {/* Floating Price Tag */}
                        <div className="absolute top-10 right-10 z-30 bg-red-500 text-white w-24 h-24 rounded-full flex flex-col items-center justify-center font-bold shadow-lg rotate-12 animate-float-delayed">
                            <span className="text-xs uppercase">Promo</span>
                            <span className="text-xl">-20%</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DealOfTheDay;
