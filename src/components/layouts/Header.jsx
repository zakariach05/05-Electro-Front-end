import React, { useState, useEffect } from 'react';
import md5 from 'js-md5';
import { ShoppingBag, Search, User, Menu, X, Globe, Heart, Moon, Sun } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../../data/categories';
import MegaMenu from '../organisms/MegaMenu';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { useTheme } from '../../context/ThemeContext';

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState(null); 
    const [isLangOpen, setIsLangOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const location = useLocation();
    const navigate = useNavigate();
    const { cartCount, setIsCartOpen } = useCart();
    const { language, setLanguage, t } = useLanguage();
    const { user, logout, isAdmin } = useAuth();
    const { wishlistItems } = useWishlist();
    const { theme, toggleTheme } = useTheme();

    const languages = [
        { code: 'fr', label: 'FR', flag: '🇫🇷' },
        { code: 'en', label: 'EN', flag: '🇬🇧' },
        { code: 'ar', label: 'AR', flag: '🇲🇦' }
    ];
    const [showAnnouncement, setShowAnnouncement] = useState(true);


    useEffect(() => {
    const handleScroll = () => {
        const scrolled = window.scrollY > 10;
        setIsScrolled(scrolled);

        // Supprimer l'annonce au scroll
        if (scrolled) {
            setShowAnnouncement(false);
        } else {
            setShowAnnouncement(true);
        }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
}, []);


    useEffect(() => {
        setActiveCategory(null);
        setIsMobileMenuOpen(false);
        setIsLangOpen(false);
        setIsSearchOpen(false);
    }, [location]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
            setIsSearchOpen(false);
        }
    };

    return (
        <>
        {/* Announcement Bar */}
        {/* Announcement Bar */}
        {showAnnouncement && (
            <div className="fixed top-0 left-0 w-full h-8 z-[60] bg-black flex items-center justify-center">
                <span className="text-[#FFCB50] text-xs font-extrabold tracking-wide animate-flash-gold drop-shadow-gold text-center px-2">
                    ⚠️ 05 Electro est actuellement en cours de développement.
                    Certains produits et fonctionnalités seront ajoutés prochainement.
                </span>
            </div>
        )}

        <header
                className={`fixed ${
                    showAnnouncement ? 'top-8' : 'top-0'
                } left-0 w-full bg-white/95 z-50 transition-all duration-300 ${
                    isScrolled || activeCategory
                        ? 'bg-white/70 dark:bg-gray-900/80 backdrop-blur-5xl shadow-md border-b border-white/20'
                        : 'bg-white/5 backdrop-blur-5xl md:hover:bg-white/80 md:dark:hover:bg-gray-900/80 transition-colors'
                }`}
                onMouseLeave={() => setActiveCategory(null)}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-50">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
                        <img
                            src="/Logo.png"
                            alt="Electro-05"
                            className="h-10 w-auto object-contain transition-all duration-300 group-hover:scale-110 dark:invert animate-logo-text"
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex space-x-8 h-full items-center">
                        {CATEGORIES.map((cat) => (
                            <div
                                key={cat.id}
                                className="h-full flex items-center relative group"
                                onMouseEnter={() => setActiveCategory(cat)}
                            >
                                <Link
                                    to={cat.path}
                                    className={`text-sm font-medium transition-colors hover:text-primary h-full flex items-center border-b-2 border-transparent hover:border-primary ${activeCategory?.id === cat.id ? 'text-primary border-primary' : 'text-gray-700 dark:text-gray-200'
                                        }`}
                                >
                                    {cat.name}
                                </Link>
                            </div>
                        ))}
                    </nav>

                    {/* Icons */}
                    <div className="flex items-center space-x-4 md:space-x-6">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-primary transition-all border border-gray-100 dark:border-gray-700"
                            aria-label="Toggle theme"
                        >
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </button>

                        {/* Language Selector */}
                        <div className="relative">
                            <button
                                onClick={() => setIsLangOpen(!isLangOpen)}
                                className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 hover:text-primary transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-1 rounded-lg"
                            >
                                <Globe size={18} />
                                <span className="text-xs font-black uppercase">{language}</span>
                            </button>
                            {isLangOpen && (
                                <div className="absolute top-10 right-0 bg-white shadow-2xl rounded-2xl border border-gray-100 p-2 w-32 animate-fade-in z-[60]">
                                    {languages.map((lang) => (
                                        <button
                                            key={lang.code}
                                            onClick={() => {
                                                setLanguage(lang.code);
                                                setIsLangOpen(false);
                                            }}
                                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-bold transition-all ${language === lang.code ? 'bg-primary text-white' : 'hover:bg-gray-50 text-gray-700'}`}
                                        >
                                            <span>{lang.flag} {lang.label}</span>
                                            {language === lang.code && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Search Toggle Button */}
                        <button
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            className={`transition-colors p-2 rounded-full hover:bg-gray-100 ${isSearchOpen ? 'text-primary bg-gray-50' : 'text-gray-600'}`}
                            aria-label="Rechercher"
                        >
                            {isSearchOpen ? <X size={20} /> : <Search size={20} />}
                        </button>

                        <Link to="/wishlist" className="text-gray-600 hover:text-red-500 transition-colors relative">
                            <Heart size={20} />
                            {wishlistItems.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                                    {wishlistItems.length}
                                </span>
                            )}
                        </Link>

                        <div className="relative group">
                            <button
                                onClick={() => setIsCartOpen(true)}
                                className="text-gray-600 hover:text-primary transition-colors block"
                            >
                                <ShoppingBag size={20} />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </button>
                        </div>



                        <div className="relative group">
                            {user ? (
                                <div className="flex items-center gap-3">
                                    <button className="flex items-center gap-2 group/user p-1 rounded-xl bg-gray-50 border border-gray-100 hover:border-primary transition-all">
                                        <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-200 shadow-sm border border-gray-100">
                                            <img
                                                src={`https://www.gravatar.com/avatar/${md5(user.email.toLowerCase().trim())}?d=mp`}
                                                alt={user.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'flex';
                                                }}
                                            />
                                            <div className="hidden w-full h-full bg-premium-gradient items-center justify-center text-white text-xs font-bold">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                        </div>
                                        <div className="hidden lg:block text-left pr-2">
                                            <p className="text-[10px] font-black text-gray-400 leading-none uppercase tracking-widest">{user.role}</p>
                                            <p className="text-xs font-bold text-gray-700 mt-1">{user.name}</p>
                                        </div>
                                    </button>

                                    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[70]">
                                        {isAdmin && (
                                            <Link to="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-primary">
                                                Tableau de bord
                                            </Link>
                                        )}
                                        <button
                                            onClick={async () => {
                                                await logout();
                                                navigate('/login');
                                            }}
                                            className="w-full text-left flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50"
                                        >
                                            Déconnexion
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <Link to="/login" className="flex items-center gap-2 text-gray-600 hover:text-primary transition-all group/login">
                                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center group-hover/login:bg-primary/10 transition-colors">
                                        <User size={18} />
                                    </div>
                                    <span className="hidden lg:block text-xs font-black uppercase tracking-widest">Connexion</span>
                                </Link>
                            )}
                        </div>

                        <button
                            className="md:hidden text-gray-600"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Full Width Search Bar */}
            {isSearchOpen && (
                <div className="absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-xl animate-fade-in p-4 z-40">
                    <form onSubmit={handleSearch} className="max-w-4xl mx-auto relative flex items-center">
                        <Search className="absolute left-4 text-gray-400" size={20} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={t('nav.search') || "Rechercher un produit, une marque..."}
                            className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-lg font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-400"
                            autoFocus
                        />
                        <button
                            type="submit"
                            className="absolute right-3 bg-gray-900 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-primary transition-colors"
                        >
                            Rechercher
                        </button>
                    </form>
                </div>
            )}

            <div className="mega-menu-container">
                <MegaMenu
                    category={activeCategory}
                    isOpen={!!activeCategory}
                    onClose={() => setActiveCategory(null)}
                />
            </div>

            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-gray-100 shadow-lg h-[calc(100vh-4rem)] overflow-y-auto">
                    <div className="px-4 pt-2 pb-6 space-y-2">
                        {CATEGORIES.map((cat) => (
                            <div key={cat.id} className="py-2 border-b border-gray-50 last:border-0">
                                <Link
                                    to={cat.path}
                                    className="flex items-center gap-3 px-3 py-3 rounded-md text-base font-bold text-gray-800 hover:bg-gray-50 hover:text-primary"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <cat.icon size={18} />
                                    {cat.name}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </header>
        </>
    );
};

export default Header;
