import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingCart, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { getImageUrl } from '../../services/image';

const InteractiveHero = ({ products }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [shuffledProducts, setShuffledProducts] = useState([]);
    const { t } = useLanguage();

    // Shuffle products on mount
    useEffect(() => {
        if (products && products.length > 0) {
            const shuffled = [...products].sort(() => Math.random() - 0.5);
            setShuffledProducts(shuffled);
        }
    }, [products]);

    const nextProduct = useCallback(() => {
        if (shuffledProducts.length === 0) return;
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % shuffledProducts.length);
            setIsTransitioning(false);
        }, 400); // Faster transition duration
    }, [shuffledProducts.length]);

    useEffect(() => {
        const interval = setInterval(nextProduct, 3500); // 3.5 seconds interval
        return () => clearInterval(interval);
    }, [nextProduct]);

    if (!shuffledProducts || shuffledProducts.length === 0) return null;

    const currentProduct = shuffledProducts[currentIndex];

    return (
        <div id="hero" className="relative min-h-[700px] lg:h-[85vh] flex items-center overflow-hidden bg-gray-900 border-b border-white/5">
            {/* Background Gradients */}
            <div className="absolute inset-0 bg-premium-gradient opacity-20"></div>
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#FFCB50]/5 rounded-full blur-[120px] -mr-96 -mt-96"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#544F7D]/10 rounded-full blur-[100px] -ml-48 -mb-48"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 py-12 lg:py-0">
                <div className="grid lg:grid-cols-12 gap-12 items-center">

                    {/* LEFT: Product Info (40%) */}
                    <div className={`lg:col-span-4 space-y-6 transition-all duration-500 ${isTransitioning ? 'opacity-0 -translate-x-10' : 'opacity-100 translate-x-0'}`}>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl text-secondary text-[10px] font-black uppercase tracking-[0.2em]">
                            <Sparkles size={14} className="animate-pulse" />
                            {t('hero.featured_product') || 'Selection Premium'}
                        </div>

                        <div className="space-y-3">
                            <h2 className="text-3xl lg:text-5xl font-black leading-[1.1] tracking-tighter uppercase transition-all bg-premium-gradient bg-clip-text text-transparent animate-text-flash">
                                {currentProduct.name}
                            </h2>
                            <p className="text-sm lg:text-base text-gray-400 font-medium max-w-sm leading-relaxed line-clamp-2">
                                {currentProduct.description}
                            </p>
                        </div>

                        <div className="flex items-end gap-3">
                            <span className="text-4xl font-black text-white">{currentProduct.price} DH</span>
                        </div>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <Link
                                to={`/product/${currentProduct.id}`}
                                className="inline-flex items-center gap-3 px-8 py-4 bg-premium-gradient text-white rounded-2xl font-black transition-all shadow-2xl shadow-primary/40 group"
                            >
                                {t('hero.cta_buy') || 'Acheter'}
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>

                    {/* RIGHT: Product Visual (60%) */}
                    <div className="lg:col-span-8 relative flex justify-center items-center">
                        {/* Decorative Rings */}
                        <div className="absolute w-[300px] h-[300px] lg:w-[550px] lg:h-[550px] border-2 border-white/5 rounded-full animate-[spin_10s_linear_infinite]"></div>
                        <div className="absolute w-[250px] h-[250px] lg:w-[450px] lg:h-[450px] border border-secondary/10 rounded-full animate-[spin_8s_linear_infinite_reverse]"></div>

                        {/* Glow Effect */}
                        <div className="hero-glow-effect"></div>

                        <div className={`relative z-10 transition-all duration-300 w-full flex justify-center items-center ${isTransitioning ? 'animate-hero-exit' : 'animate-hero-enter'}`}>
                            <div className="hero-product-container">
                                <img
                                    src={getImageUrl(currentProduct.image)}
                                    alt={currentProduct.name}
                                    className="drop-shadow-[0_45px_45px_rgba(0,0,0,0.6)] animate-rotate-360 hover:[animation-play-state:paused] pointer-events-auto"
                                    onError={(e) => {
                                        e.target.src = "https://images.unsplash.com/photo-1592890288564-76628a30a657?q=80&w=800";
                                    }}
                                />
                            </div>

                            {/* Floating Stock Badge */}
                            <div className="absolute top-0 right-0 p-5 bg-black/60 backdrop-blur-2xl rounded-3xl border border-white/10 hidden lg:block">
                                <p className="text-[10px] font-black text-secondary uppercase mb-1">Stock</p>
                                <p className="text-xl font-black text-white">Prêt à livrer</p>
                            </div>
                        </div>

                        {/* Slide Indicators */}
                        <div className="absolute -bottom-16 flex gap-2">
                            {shuffledProducts.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentIndex(idx)}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${currentIndex === idx ? 'w-12 bg-secondary shadow-[0_0_15px_rgba(255,203,80,0.5)]' : 'w-4 bg-white/20'}`}
                                />
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default InteractiveHero;
