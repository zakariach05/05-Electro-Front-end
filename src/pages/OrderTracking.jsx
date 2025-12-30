import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../services/api';
import { getImageUrl } from '../services/image';
import MainLayout from '../layouts/MainLayout';
import {
    Package,
    Truck,
    CheckCircle2,
    Clock,
    Store,
    MapPin,
    ArrowLeft,
    ChevronDown,
    ShieldCheck,
    Phone
} from 'lucide-react';

const OrderTracking = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const token = urlParams.get('token');

                const response = await axios.get(`${API_URL}/orders/${id}`, {
                    params: { token }
                });
                setOrder(response.data);
            } catch (err) {
                console.error("Error fetching order:", err);
                setError("Impossible de trouver cette commande. Vérifiez votre numéro de suivi.");
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    if (loading) {
        return (
            <MainLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-gray-500 font-medium font-outfit">Localisation de votre colis...</p>
                    </div>
                </div>
            </MainLayout>
        );
    }

    if (error || !order) {
        return (
            <MainLayout>
                <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
                    <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
                        <Package size={40} />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 mb-2">Oups ! Commande introuvable</h2>
                    <p className="text-gray-500 text-center max-w-md mb-8">{error}</p>
                    <Link to="/" className="bg-primary text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-primary/30 transition-all">Retourner à l'accueil</Link>
                </div>
            </MainLayout>
        );
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'text-green-500';
            case 'processing': return 'text-blue-500';
            case 'cancelled': return 'text-red-500';
            default: return 'text-amber-500';
        }
    };

    const getProgression = (status) => {
        switch (status) {
            case 'pending': return 25;
            case 'processing': return 50;
            case 'shipped': return 75;
            case 'completed': return 100;
            default: return 0;
        }
    };

    return (
        <MainLayout>
            <div className="bg-[#f8fafc] min-h-screen pt-6 pb-10 lg:pt-16 lg:pb-16 font-outfit">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Header */}
                    <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                        <div>
                            <Link to="/" className="flex items-center gap-2 text-primary font-bold text-sm mb-4 hover:gap-3 transition-all">
                                <ArrowLeft size={16} /> Retour à la boutique
                            </Link>
                            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Suivi de Commande</h1>
                            <p className="text-gray-500 font-medium mt-1">Numéro: <span className="text-gray-900 font-bold uppercase">#ECO-{order.id.toString().padStart(6, '0')}</span></p>
                        </div>
                        <div className="flex gap-3">
                            <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status Global</p>
                                <div className="flex items-center gap-2">
                                    <div className={`w-2.5 h-2.5 rounded-full animate-pulse ${getStatusColor(order.status).replace('text-', 'bg-')}`} />
                                    <span className={`font-black uppercase text-sm ${getStatusColor(order.status)} tracking-wide`}>{order.status}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Timeline Column */}
                        <div className="lg:col-span-2 space-y-8">

                            {/* Visual Progress Bar */}
                            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
                                <div className="relative pt-8 pb-12">
                                    <div className="absolute top-[52px] left-0 w-full h-1 bg-gray-100 rounded-full">
                                        <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${getProgression(order.status)}%` }} />
                                    </div>
                                    <div className="relative flex justify-between">
                                        <div className="flex flex-col items-center">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center z-10 transition-all duration-500 ${getProgression(order.status) >= 25 ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/30' : 'bg-white border-2 border-gray-100 text-gray-300'}`}>
                                                <Package size={20} />
                                            </div>
                                            <span className={`text-[10px] font-black mt-3 uppercase tracking-tighter ${getProgression(order.status) >= 25 ? 'text-primary' : 'text-gray-300'}`}>Confirmé</span>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center z-10 transition-all duration-500 ${getProgression(order.status) >= 50 ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/30' : 'bg-white border-2 border-gray-100 text-gray-300'}`}>
                                                <Clock size={20} />
                                            </div>
                                            <span className={`text-[10px] font-black mt-3 uppercase tracking-tighter ${getProgression(order.status) >= 50 ? 'text-primary' : 'text-gray-300'}`}>Préparation</span>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center z-10 transition-all duration-500 ${getProgression(order.status) >= 75 ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/30' : 'bg-white border-2 border-gray-100 text-gray-300'}`}>
                                                <Truck size={20} />
                                            </div>
                                            <span className={`text-[10px] font-black mt-3 uppercase tracking-tighter ${getProgression(order.status) >= 75 ? 'text-primary' : 'text-gray-300'}`}>En Route</span>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center z-10 transition-all duration-500 ${getProgression(order.status) === 100 ? 'bg-green-500 text-white scale-110 shadow-lg shadow-green-500/30' : 'bg-white border-2 border-gray-100 text-gray-300'}`}>
                                                <CheckCircle2 size={20} />
                                            </div>
                                            <span className={`text-[10px] font-black mt-3 uppercase tracking-tighter ${getProgression(order.status) === 100 ? 'text-green-500' : 'text-gray-300'}`}>Livré</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-8 pt-8 border-t border-gray-50 flex items-start gap-4 bg-blue-50/50 p-6 rounded-2xl">
                                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0 animate-bounce">
                                        <Truck size={24} className="text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-gray-900 text-sm">Temps estimé avant livraison finale</h3>
                                        <p className="text-primary font-black text-2xl">2 - 4 jours</p>
                                        <p className="text-xs text-gray-500 mt-1">Votre colis est actuellement en cours de centralisation dans nos entrepôts de Casablanca.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Sub-Orders (Multi-Vendor Details) */}
                            <div className="space-y-4">
                                <h2 className="text-xl font-black text-gray-900 flex items-center gap-3 px-2">
                                    Detail des Expéditions Partenaires
                                    <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full uppercase">{order.sub_orders?.length || 0} Colis</span>
                                </h2>

                                {order.sub_orders?.map((sub, idx) => (
                                    <div key={idx} className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100">
                                        <div className="px-8 py-6 border-b border-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center">
                                                    <Store size={22} className="text-primary" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Colis expédié par</p>
                                                    <h3 className="font-bold text-gray-900">{sub.seller.name}</h3>
                                                </div>
                                            </div>
                                            <div className="bg-gray-50 px-4 py-2 rounded-xl flex items-center gap-6">
                                                <div className="text-center">
                                                    <p className="text-[9px] font-black text-gray-400 uppercase">Provenance</p>
                                                    <p className="text-xs font-bold text-gray-700">{sub.seller.city}</p>
                                                </div>
                                                <div className="w-[1px] h-6 bg-gray-200" />
                                                <div className="text-center">
                                                    <p className="text-[9px] font-black text-gray-400 uppercase">Livraison Estimée</p>
                                                    <p className="text-xs font-black text-primary uppercase">{sub.delivery_estimate.replace('Livraison estimée : ', '')}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-8 space-y-6">
                                            {sub.items?.map((item, iidx) => (
                                                <div key={iidx} className="flex gap-6 items-center">
                                                    <div className="w-20 h-20 bg-gray-50 rounded-2xl p-2 flex-shrink-0 border border-gray-100">
                                                        <img src={getImageUrl(item.product.image)} alt={item.product.name} className="w-full h-full object-contain mix-blend-multiply" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-bold text-gray-900 leading-tight mb-1">{item.product.name}</h4>
                                                        <div className="flex items-center gap-4">
                                                            <p className="text-xs font-medium text-gray-500">Unité: <span className="text-gray-900 font-bold">{item.price} DH</span></p>
                                                            <p className="text-xs font-medium text-gray-500">Quantité: <span className="text-gray-900 font-bold">{item.quantity}</span></p>
                                                        </div>
                                                        <div className="mt-2 flex items-center gap-2">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                                            <span className="text-[10px] font-black text-green-600 uppercase">En stock - Assigné</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                            <button className="w-full bg-gray-50 hover:bg-gray-100 text-gray-600 py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 group">
                                                Signaler un problème avec ce colis <ChevronDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Sidebar Column */}
                        <div className="space-y-8">

                            {/* Delivery Address */}
                            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
                                <h3 className="font-black text-gray-900 mb-6 flex items-center gap-3">
                                    <MapPin size={20} className="text-primary" /> Destination
                                </h3>
                                <div className="space-y-4">
                                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Client</p>
                                        <p className="font-bold text-gray-900">{order.customer_name}</p>
                                        <div className="flex items-center gap-2 mt-2 text-primary font-bold text-xs">
                                            <Phone size={12} /> {order.customer_phone}
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Adresse de livraison</p>
                                        <p className="text-sm font-medium text-gray-700 leading-relaxed">{order.customer_address}</p>
                                        <p className="text-sm font-black text-gray-900 mt-1 uppercase">{order.customer_city}, Maroc</p>
                                    </div>
                                </div>
                            </div>

                            {/* Summary & Guarantee */}
                            <div className="bg-[#1e293b] text-white rounded-[32px] p-8 shadow-xl shadow-blue-900/10 border border-white/5 relative overflow-hidden">
                                <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

                                <h3 className="text-xl font-black mb-6">Récapitulatif financier</h3>
                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between text-sm text-gray-400">
                                        <span>Total HT</span>
                                        <span className="font-bold text-white">{(order.total_amount / 1.2).toFixed(2)} DH</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-400">
                                        <span>TVA (20%)</span>
                                        <span className="font-bold text-white">{(order.total_amount * 0.2 / 1.2).toFixed(2)} DH</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-400">
                                        <span>Livraison Sécurisée</span>
                                        <span className="font-bold text-white">100.00 DH</span>
                                    </div>
                                    <div className="pt-4 border-t border-white/10 flex justify-between">
                                        <span className="font-black text-lg">Total Payé</span>
                                        <span className="font-black text-2xl text-primary">{parseFloat(order.total_amount).toLocaleString()} DH</span>
                                    </div>
                                </div>

                                <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
                                    <div className="flex gap-4 items-center mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-green-500/20 text-green-400 flex items-center justify-center">
                                            <ShieldCheck size={24} />
                                        </div>
                                        <p className="text-xs font-bold leading-snug">Garantie Electro-05 activée sur cette commande</p>
                                    </div>
                                    <p className="text-[10px] text-gray-400 leading-relaxed">
                                        En cas de non-conformité, vous bénéficiez de 14 jours pour demander un retour gratuit ou un échange.
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default OrderTracking;
