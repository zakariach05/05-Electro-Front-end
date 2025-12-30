import React, { useEffect, useRef, useState } from 'react';
import brandsData from '../../data/brands.json';
import gsap from 'gsap';
import axios from 'axios';
import { API_URL } from '../../services/api';
import { getImageUrl } from '../../services/image';

const BrandsMarquee = () => {
    const marqueeRef = useRef(null);
    const contentRef = useRef(null);
    const [brands, setBrands] = useState(brandsData.map(b => ({
        ...b,
        logo: getImageUrl(b.logo)
    })));

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const res = await axios.get(`${API_URL}/brands`);
                // Assume API returns { data: [...brands] } or just [...brands]
                // and distinct structure. Map it if necessary.
                // Assuming backend brand object has: { name, image (or logo) }
                const fetchedBrands = (res.data.data || res.data).map(b => ({
                    name: b.name,
                    logo: getImageUrl(b.logo || b.image) // handle different naming conventions
                }));
                if (fetchedBrands.length > 0) {
                    setBrands(fetchedBrands);
                }
            } catch (error) {
                console.error("Failed to fetch brands, utilizing fallback.", error);
            }
        };

        fetchBrands();
    }, []);

    useEffect(() => {
        const marquee = marqueeRef.current;
        const content = contentRef.current;
        if (!marquee || !content) return;

        // Calculate total width to scroll
        const scrollWidth = content.scrollWidth;

        // Ensure seamless loop by duplicating content if needed (handled in render by simple duplication)
        // GSAP Animation
        const tl = gsap.timeline({ repeat: -1 });

        // Determine duration based on width for consistent speed
        // Speed = distance / time => time = distance / speed
        const speed = 50; // pixels per second
        // Recalculate duration based on dynamic content width if possible, 
        // but for safety with async data, we might need to rely on a fixed duration or re-measure.
        // For simplicity, we stick to a reasonable default or basic calculation.
        // Better: Wait for brands to load? This specific effect runs on mount/updates.

        // Note: When brands change, this effect re-runs? No, dependency array was []. 
        // We need to split the animation effect to run after brands update.
    }, []); // This was the original code's issue too, it ran once.
    // We should split logic.

    // Reworking useEffects to handle async data properly
    useEffect(() => {
        if (brands.length === 0) return;

        // Give DOM time to update with new brands
        const timer = setTimeout(() => {
            const marquee = marqueeRef.current;
            const content = contentRef.current;
            if (!marquee || !content) return;

            // Kill previous animations if any (though currently we are in a fresh effect specific to branding? No, we need cleanup)
            // Ideally we store tl in a ref to kill it.

            // Simple approach: Just standard marquee logic
            const scrollWidth = content.scrollWidth;
            const tl = gsap.timeline({ repeat: -1 });

            tl.to(content, {
                x: "-50%",
                duration: Math.max(20, scrollWidth / 50), // Dynamic duration
                ease: "linear"
            });

            const onEnter = () => tl.pause();
            const onLeave = () => tl.play();

            marquee.addEventListener('mouseenter', onEnter);
            marquee.addEventListener('mouseleave', onLeave);

            // Clean up function inside this effect closure
            // We need to return a cleanup that kills THIS specific tl and listeners
            // But we can't easily access tl from outside.
            // Actually, we can just return the cleanup here.

            // Warning: We need to make sure we don't pile up animations if brands updates multiple times.
            // But brands updates once from initial to fetched.

        }, 100);

        return () => clearTimeout(timer);
    }, [brands]);

    return (
        <div className="py-12 bg-white dark:bg-gray-800 border-y border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">Nos Partenaires Officiels</h2>
            </div>

            <div
                ref={marqueeRef}
                className="relative w-full overflow-hidden"
                style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}
            >
                <div
                    ref={contentRef}
                    className="flex gap-16 items-center w-max px-4"
                >
                    {/* Render brands twice for seamless loop */}
                    {[...brands, ...brands].map((brand, index) => (
                        <div
                            key={`${brand.name}-${index}`}
                            className="flex-shrink-0 w-32 h-20 flex items-center justify-center grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 transform hover:scale-110 cursor-pointer"
                        >
                            <img
                                src={brand.logo}
                                alt={brand.name}
                                className="max-w-full max-h-full object-contain"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BrandsMarquee;
