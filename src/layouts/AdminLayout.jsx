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
    Settings,
    Bell
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();
    const { logout, user } = useAuth();

    const menuItems = [
        { label: 'Tableau de bord', icon: LayoutDashboard, path: '/admin/dashboard' },
        { label: 'Produits', icon: Package, path: '/admin/products' },
        { label: 'Commandes', icon: ShoppingCart, path: '/admin/orders' },
        { label: 'Catégories', icon: Layers, path: '/admin/categories' },
        { label: 'Clients', icon: Users, path: '/admin/users' },
    ];

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside
                className={`bg-gray-900 text-white transition-all duration-300 flex flex-col fixed h-full z-50 ${isSidebarOpen ? 'w-72' : 'w-20'}`}
            >
                <div className="p-6 flex items-center justify-between border-b border-gray-800">
                    <div className={`flex items-center gap-3 ${!isSidebarOpen && 'hidden'}`}>
                        <div className="w-10 h-10 rounded-xl bg-premium-gradient flex items-center justify-center text-white font-bold text-lg shadow-lg">
                            E
                        </div>
                        <span className="font-bold text-xl tracking-tight">Admin<span className="text-secondary">-05</span></span>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
                    >
                        {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                    </button>
                </div>

                <nav className="flex-1 px-4 py-8 space-y-2">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all group ${isActive
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
            <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-72' : 'ml-20'}`}>
                {/* Admin Header */}
                <header className="bg-white border-b border-gray-100 h-20 flex items-center justify-between px-8 sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-bold text-gray-900">
                            {menuItems.find(item => item.path === location.pathname)?.label || 'Administration'}
                        </h2>
                    </div>
                    <div className="flex items-center gap-6">
                        <button className="relative p-2 text-gray-400 hover:text-gray-900 transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
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
