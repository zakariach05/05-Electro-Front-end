import React, { useRef, useEffect } from 'react';
import getImageUrl from '../../services/image';
import { Link } from 'react-router-dom';
import gsap from 'gsap';

const MegaMenu = ({ category, isOpen, onClose }) => {
    const menuRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(() => {
        if (!menuRef.current) return;

        if (isOpen) {
            gsap.to(menuRef.current, {
                height: 'auto',
                opacity: 1,
                duration: 0.4,
                ease: 'power3.out',
                display: 'block'
            });
            gsap.fromTo(contentRef.current,
                { y: -10, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.3, delay: 0.1 }
            );
        } else {
            gsap.to(menuRef.current, {
                height: 0,
                opacity: 0,
                duration: 0.3,
                ease: 'power2.in',
                display: 'none'
            });
        }
    }, [isOpen]);

    if (!category) return null;

    return (
        <div
            ref={menuRef}
            className="absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-xl overflow-hidden hidden z-40"
            onMouseLeave={onClose}
        >
            <div ref={contentRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex gap-12">
                    {/* Main Subcategories */}
                    <div className="w-1/4 border-r border-gray-100 pr-8">
                        <h3 className="font-bold text-gray-900 text-lg mb-6 flex items-center gap-2">
                            <category.icon size={20} className="text-primary" />
                            {category.name}
                        </h3>
                        <ul className="space-y-3">
                            {category.subcategories.map((sub) => (
                                <li key={sub.name}>
                                    <Link
                                        to={sub.path}
                                        className="text-gray-600 hover:text-primary hover:translate-x-1 transition-all inline-block font-medium"
                                        onClick={onClose}
                                    >
                                        {sub.name}
                                    </Link>
                                </li>
                            ))}
                            <li className="mt-4 pt-4 border-t border-gray-100">
                                <Link to={category.path} className="text-sm font-bold text-primary hover:underline">
                                    Voir tout {category.name} →
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Featured Sections (Visuals) */}
                    <div className="flex-1">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">En vedette</h4>
                        <div className="grid grid-cols-2 gap-6">
                            {category.featured && category.featured.length > 0 ? (
                                category.featured.map((item, index) => (
                                    <div key={index} className="group relative bg-gray-50 rounded-xl p-4 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
                                        <div className="w-24 h-24 bg-white rounded-lg p-2 flex items-center justify-center">
                                            <img src={getImageUrl(item.image)} alt={item.name} className="max-w-full max-h-full object-contain" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900 group-hover:text-primary transition-colors">{item.name}</p>
                                            <p className="text-sm text-gray-500 mt-1">{item.price}</p>
                                            <span className="text-xs text-primary font-bold mt-2 inline-block">Découvrir</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-2 bg-gradient-to-r from-primary/5 to-secondary/10 rounded-xl p-6 flex items-center justify-between">
                                    <div>
                                        <p className="font-bold text-gray-900 text-lg">Nouveautés {category.name}</p>
                                        <p className="text-sm text-gray-500 mt-2">Découvrez la dernière collection</p>
                                        <button className="mt-4 px-4 py-2 bg-gray-900 text-white text-xs font-bold rounded-lg">Voir collection</button>
                                    </div>
                                    <category.icon size={64} className="text-primary/20" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MegaMenu;
