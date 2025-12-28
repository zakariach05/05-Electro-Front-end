import React, { useState, useEffect } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import { BarChart3, TrendingUp, ShoppingBag, MapPin, Package, DollarSign, Plus, History } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../services/api';
import Loader from '../components/atoms/Loader';
import SEO from '../components/atoms/SEO';

import { useLanguage } from '../context/LanguageContext';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const { t } = useLanguage();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${API_URL}/admin/stats`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(response.data);
            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <AdminLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <Loader />
                </div>
            </AdminLayout>
        );
    }

    const overview = stats?.overview || {};

    return (
        <AdminLayout>
            <SEO title={t('dashboard.title')} description="Suivez vos performances de vente en temps réel sur Electro-05." />
            <div className="bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    {/* Welcome Section */}
                    <div className="bg-premium-gradient rounded-[32px] p-8 mb-10 text-white relative overflow-hidden shadow-2xl">
                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="text-center md:text-left">
                                <h1 className="text-4xl font-black mb-2">Bon retour, Admin !</h1>
                                <p className="text-white/80 font-medium">Voici le résumé de vos activités pour aujourd'hui.</p>
                            </div>
                            <Link to="/admin/products" className="bg-white text-gray-900 px-8 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-secondary hover:text-white transition-all shadow-xl">
                                <Plus size={20} /> Ajouter un produit
                            </Link>
                        </div>
                        {/* Abstract shapes */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-3xl -ml-20 -mb-20"></div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                        <StatCard
                            title="Commandes du Jour"
                            value={overview.daily_orders || 0}
                            icon={<ShoppingBag className="text-blue-600" />}
                            color="bg-blue-50"
                            trend="Aujourd'hui"
                        />
                        <StatCard
                            title="Chiffre d'Affaire (Payé)"
                            value={`${overview.total_revenue?.toLocaleString() || 0} DH`}
                            icon={<DollarSign className="text-green-600" />}
                            color="bg-green-50"
                            trend="Payé"
                        />
                        <StatCard
                            title="Commandes en Retard"
                            value={overview.late_orders || 0}
                            icon={<Package className="text-red-600" />}
                            color="bg-red-50"
                            trend="+48h"
                        />
                        <StatCard
                            title="Produits en Ligne"
                            value={overview.total_products || 0}
                            icon={<TrendingUp className="text-purple-600" />}
                            color="bg-purple-50"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                        {/* Payment Health */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <DollarSign className="text-primary" /> État des Paiements
                            </h2>
                            <div className="space-y-4">
                                <div className="p-4 bg-green-50 rounded-2xl">
                                    <p className="text-xs text-green-600 font-black uppercase tracking-widest mb-1">Encaissé</p>
                                    <p className="text-xl font-black text-green-900">{stats?.payment?.paid?.toLocaleString()} DH</p>
                                </div>
                                <div className="p-4 bg-orange-50 rounded-2xl">
                                    <p className="text-xs text-orange-600 font-black uppercase tracking-widest mb-1">À Recevoir (COD)</p>
                                    <p className="text-xl font-black text-orange-900">{stats?.payment?.unpaid?.toLocaleString()} DH</p>
                                </div>
                                <div className="p-4 bg-purple-50 rounded-2xl">
                                    <p className="text-xs text-purple-600 font-black uppercase tracking-widest mb-1">Remboursé</p>
                                    <p className="text-xl font-black text-purple-900">{stats?.payment?.refunded?.toLocaleString()} DH</p>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity Log */}
                        <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <History className="text-primary" /> Journal d'Activité
                            </h2>
                            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {stats?.activity?.map((log, idx) => (
                                    <div key={idx} className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-colors border-b border-gray-50 last:border-0">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-primary font-bold">
                                            {log.user?.name?.charAt(0)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <p className="text-sm font-bold text-gray-900">{log.action}</p>
                                                <span className="text-[10px] text-gray-400 font-medium">
                                                    {new Date(log.created_at).toLocaleTimeString()}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">{log.details}</p>
                                            <p className="text-[10px] text-gray-300 mt-1 font-medium">Par {log.user?.name} • {log.ip_address}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Top Products */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-2 mb-6">
                                <BarChart3 className="text-primary" size={24} />
                                <h2 className="text-xl font-bold text-gray-900">{t('dashboard.sales.top_products')}</h2>
                            </div>
                            <div className="space-y-4">
                                {(stats?.top_products || []).length > 0 ? stats.top_products.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <span className="w-8 h-8 flex items-center justify-center bg-gray-900 text-white rounded-lg font-bold text-xs">{idx + 1}</span>
                                            <span className="font-medium text-gray-800">{item.name}</span>
                                        </div>
                                        <span className="text-sm font-bold text-primary">{item.total_sold} {t('dashboard.sales.sales_unit')}</span>
                                    </div>
                                )) : <p className="text-gray-400 text-center py-10">{t('common.no_data')}</p>}
                            </div>
                        </div>

                        {/* City Stats */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-2 mb-6">
                                <MapPin className="text-primary" size={24} />
                                <h2 className="text-xl font-bold text-gray-900">{t('dashboard.sales.cities')}</h2>
                            </div>
                            <div className="space-y-4">
                                {(stats?.cities || []).length > 0 ? stats.cities.map((city, idx) => (
                                    <div key={idx} className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="font-medium text-gray-700">{city.customer_city}</span>
                                            <span className="text-gray-500">{city.count} {t('dashboard.sales.orders_unit')}</span>
                                        </div>
                                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-premium-gradient rounded-full"
                                                style={{ width: `${(city.count / (overview.total_orders || 1)) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )) : <p className="text-gray-400 text-center py-10">{t('common.no_data')}</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

const StatCard = ({ title, value, icon, color, trend }) => (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-lg transition-all">
        <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
            {trend && (
                <span className="inline-flex mt-2 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    {trend}
                </span>
            )}
        </div>
        <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-125 transition-transform duration-700">
            {icon}
        </div>
    </div>
);

export default Dashboard;
