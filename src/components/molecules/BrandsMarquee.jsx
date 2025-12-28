import React, { useEffect, useRef } from 'react';
import brands from '../../data/brands.json';
import gsap from 'gsap';

const BrandsMarquee = () => {
    const marqueeRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(() => {
        const marquee = marqueeRef.current;
        const content = contentRef.current;

        // Calculate total width to scroll
        const scrollWidth = content.scrollWidth;
        const viewportWidth = marquee.offsetWidth;

        // Ensure seamless loop by duplicating content if needed (handled in render by simple duplication)
        // GSAP Animation
        const tl = gsap.timeline({ repeat: -1 });

        // Determine duration based on width for consistent speed
        // Speed = distance / time => time = distance / speed
        const speed = 50; // pixels per second
        const duration = scrollWidth / speed;

        // Animate x position from 0 to -50% (since we doubled the content)
        tl.to(content, {
            x: "-50%",
            duration: 30, // Fixed slow duration for smoothness
            ease: "linear"
        });

        // Hover functionality to pause
        marquee.addEventListener('mouseenter', () => tl.pause());
        marquee.addEventListener('mouseleave', () => tl.play());

        return () => {
            tl.kill();
            marquee.removeEventListener('mouseenter', () => tl.pause());
            marquee.removeEventListener('mouseleave', () => tl.play());
        };

    }, []);

    return (
        <div className="py-12 bg-white border-y border-gray-100 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 text-center">Nos Partenaires Officiels</h2>
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
