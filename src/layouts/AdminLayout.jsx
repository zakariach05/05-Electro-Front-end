import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Layers,
    Users,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Bell,
    Moon,
    Sun
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const AdminLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();
    const { logout, user } = useAuth();
    const { theme, toggleTheme } = useTheme();
    // remove left margin so the main content can sit underneath/flush to the sidebar
    // the sidebar is fixed with a higher z-index so it will remain visible
    const mainStyle = {};

    const menuItems = [
        { label: 'Tableau de bord', icon: LayoutDashboard, path: '/admin/dashboard' },
        { label: 'Produits', icon: Package, path: '/admin/products' },
        { label: 'Commandes', icon: ShoppingCart, path: '/admin/orders' },
        { label: 'Catégories', icon: Layers, path: '/admin/categories' },
        { label: 'Clients', icon: Users, path: '/admin/users' },
    ];

    return (
        <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
            {/* Barre latérale (desktop) et menu off-canvas (mobile) */}
            <aside
                id="primary-navigation"
                className={`bg-gray-900 text-white transition-all duration-300 flex flex-col fixed top-0 bottom-0 justify-between z-50
                    ${mobileOpen ? 'left-0' : '-left-full'} md:${isSidebarOpen ? 'w-72' : 'w-20'} md:left-0 md:relative md:block w-72`}
                aria-label="Navigation principale"
                role="navigation"
            >
                <div className="p-6 flex items-center justify-between border-b border-gray-800">
                    <div className={`flex flex-col items-center gap-1 ${!isSidebarOpen && 'hidden'}`}>
                        <img
                            src="/logo.png"
                            alt="Admin Badge"
                            className="h-10 w-auto"
                        />
                        <span className="text-[10px] font-black text-white/50 tracking-[0.2em] uppercase">Admin</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            aria-label={isSidebarOpen ? 'Réduire la barre latérale' : 'Développer la barre latérale'}
                            aria-expanded={isSidebarOpen}
                            aria-controls="primary-navigation"
                            className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white hidden md:inline-flex"
                        >
                            {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                        </button>
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            aria-label="Ouvrir le menu"
                            aria-expanded={mobileOpen}
                            aria-controls="primary-navigation"
                            className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white md:hidden"
                        >
                            {mobileOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                        </button>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto" role="menu">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center rounded-xl transition-all group focus:outline-none focus:ring-2 focus:ring-primary ${isSidebarOpen
                                        ? 'gap-4 px-4 py-3'
                                        : 'justify-center py-3'
                                    } ${isActive
                                        ? 'bg-premium-gradient text-white shadow-lg'
                                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                    }`}
                            >
                                <item.icon size={22} className={isActive ? 'text-white' : 'group-hover:text-secondary'} />
                                <span className={`font-bold transition-opacity ${!isSidebarOpen && 'opacity-0 hidden'}`}>
                                    {item.label}
                                </span>
                                {isActive && isSidebarOpen && (
                                    <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <button
                        onClick={logout}
                        className={`flex items-center gap-4 w-full px-4 py-3 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all font-bold ${!isSidebarOpen && 'justify-center'}`}
                    >
                        <LogOut size={22} />
                        <span className={!isSidebarOpen ? 'hidden' : ''}>Déconnexion</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            {/* mobile overlay */}
            {mobileOpen && <div onClick={() => setMobileOpen(false)} className="fixed inset-0 bg-black/40 z-40 md:hidden" aria-hidden="true"></div>}

            <main style={mainStyle} className="flex-1 transition-all duration-300">
                {/* Admin Header */}
                <header className="bg-white border-b border-gray-100 h-20 flex items-center justify-between px-4 md:px-8 sticky top-0 z-50">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="md:hidden p-2 rounded-lg mr-2 text-gray-600 hover:bg-gray-100"
                            aria-label="Ouvrir le menu"
                            aria-expanded={mobileOpen}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </button>
                        <h2 className="text-xl font-bold text-gray-900">
                            {menuItems.find(item => item.path === location.pathname)?.label || 'Administration'}
                        </h2>
                    </div>
                    <div className="flex items-center gap-4 md:gap-6">
                        {/* Theme Toggle in Admin */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                            aria-label="Toggle theme"
                        >
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </button>
                        <button className="relative p-2 text-gray-400 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded" aria-label="Notifications">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                        </button>
                        <div className="h-8 w-px bg-gray-100"></div>
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-gray-900">{user?.name}</p>
                                <p className="text-[10px] font-black text-secondary uppercase tracking-widest">{user?.role}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gray-100 border-2 border-premium-gradient-light flex items-center justify-center font-bold text-primary">
                                {user?.name?.charAt(0)}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
