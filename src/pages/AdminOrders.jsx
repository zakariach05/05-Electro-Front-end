import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import axios from 'axios';
import { API_URL } from '../services/api';
import { ShoppingBag, Search, Eye, X, User, MapPin, Phone, Mail, Package, CreditCard, ChevronRight, CheckCircle2, Download, ExternalLink, MessageSquare, Send, Banknote, History, FileText, DownloadCloud, Store } from 'lucide-react';
import getImageUrl from '../services/image';
import { exportOrdersToExcel } from '../utils/excelExport';
import Loader from '../components/atoms/Loader';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const { token } = useAuth();
    const [isExporting, setIsExporting] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/admin/orders`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(response.data.data || response.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`${API_URL}/admin/orders/${orderId}/status`, { status: newStatus }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
            if (selectedOrder?.id === orderId) setSelectedOrder({ ...selectedOrder, status: newStatus });
            toast.success("Statut mis à jour");
        } catch (error) { toast.error("Erreur lors de la mise à jour"); }
    };

    const handleAssignAgent = async (orderId, agent) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`${API_URL}/admin/orders/${orderId}/assign`, { agent }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(orders.map(o => o.id === orderId ? { ...o, assigned_agent: agent } : o));
            if (selectedOrder?.id === orderId) setSelectedOrder({ ...selectedOrder, assigned_agent: agent });
            toast.success("Agent assigné");
        } catch (error) { toast.error("Erreur d'assignation"); }
    };

    const handleUpdatePayment = async (orderId, paymentStatus) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`${API_URL}/admin/orders/${orderId}/payment`, { payment_status: paymentStatus }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(orders.map(o => o.id === orderId ? { ...o, payment_status: paymentStatus } : o));
            if (selectedOrder?.id === orderId) setSelectedOrder({ ...selectedOrder, payment_status: paymentStatus });
            toast.success("Paiement mis à jour");
        } catch (error) { toast.error("Erreur paiement"); }
    };

    const handleDownloadInvoice = async (orderId) => {
        try {
            // Prefer the order's secure token for public invoice access; fallback to auth token
            const order = orders.find(o => o.id === orderId);
            const tokenParam = order?.secure_token || localStorage.getItem('token');
            // Open invoice in new tab using public route
            const invoiceUrl = `${API_URL}/invoice/${orderId}?token=${tokenParam}`;
            window.open(invoiceUrl, '_blank');
            toast.success("Facture ouverte dans un nouvel onglet");
        } catch (error) {
            toast.error("Erreur lors de l'ouverture de la facture");
        }
    };

    const handleRefund = async (orderId, amount) => {
        const confirmedAmount = prompt("Entrez le montant à rembourser :", amount);
        if (!confirmedAmount) return;
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_URL}/admin/orders/${orderId}/refund`, { amount: confirmedAmount }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchOrders();
            toast.success("Remboursement enregistré");
        } catch (error) { toast.error("Erreur remboursement"); }
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'pending': return 'bg-orange-100 text-orange-600 border-orange-200';
            case 'processing': return 'bg-blue-100 text-blue-600 border-blue-200';
            case 'completed': return 'bg-green-100 text-green-600 border-green-200';
            case 'cancelled': return 'bg-red-100 text-red-600 border-red-200';
            case 'refunded': return 'bg-purple-100 text-purple-600 border-purple-200';
            default: return 'bg-gray-100 text-gray-600 border-gray-200';
        }
    };

    const getPaymentBadge = (status) => {
        switch (status) {
            case 'paid': return <span className="flex items-center gap-1 text-[10px] font-black text-green-600"><CheckCircle2 size={10} /> PAYÉ</span>;
            case 'refunded': return <span className="flex items-center gap-1 text-[10px] font-black text-purple-600"><History size={10} /> REMBOURSÉ</span>;
            default: return <span className="flex items-center gap-1 text-[10px] font-black text-red-500"><Banknote size={10} /> IMPAYÉ</span>;
        }
    };

    const filteredOrders = orders.filter(o =>
        o.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.id.toString().includes(searchTerm)
    );

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900">Suivi des Commandes</h1>
                        <p className="text-gray-500 font-medium">Gérez vos expéditions et les statuts des clients.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={async () => {
                                try {
                                    setIsExporting(true);
                                    await exportOrdersToExcel(filteredOrders.length > 0 ? filteredOrders : orders);
                                    toast.success('Fichier Excel généré avec succès');
                                } catch (error) {
                                    console.error('Export error', error);
                                    toast.error('Erreur lors de la génération Excel');
                                } finally {
                                    setIsExporting(false);
                                }
                            }}
                            disabled={isExporting}
                            className={`flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all shadow-sm ${isExporting ? 'opacity-60 cursor-wait' : ''}`}
                        >
                            {isExporting ? <Loader /> : <Download size={18} />} Exporter XLSX
                        </button>
                        <div className="bg-white p-1 rounded-2xl border border-gray-100 shadow-sm flex">
                            <div className="px-6 py-2 text-center">
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">En attente</p>
                                <p className="text-xl font-black text-orange-500">{orders.filter(o => o.status === 'pending').length}</p>
                            </div>
                            <div className="w-px h-10 bg-gray-100 self-center"></div>
                            <div className="px-6 py-2 text-center">
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Chiffre d'affaires</p>
                                <p className="text-xl font-black text-gray-900">{orders.reduce((acc, o) => acc + (o.payment_status === 'paid' ? o.total_amount : 0), 0).toLocaleString()} DH</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-8 border-b border-gray-50 bg-gray-50/30">
                        <div className="relative max-w-xl">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Rechercher par ID ou nom client..."
                                className="w-full pl-16 pr-6 py-4 bg-white border-transparent focus:border-primary focus:ring-4 focus:ring-primary/10 border-2 rounded-2xl outline-none transition-all font-bold shadow-sm text-black dark:text-black"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white">
                                <tr>
                                    <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Commande</th>
                                    <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Client</th>
                                    <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Montant</th>
                                    <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Statut</th>
                                    <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Date</th>
                                    <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Détails</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                    <tr><td colSpan="6" className="py-20 text-center"><Loader /></td></tr>
                                ) : filteredOrders.map(order => (
                                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-gray-900 text-white flex items-center justify-center font-black text-xs">
                                                    #{order.id}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-900">{order.customer_name}</span>
                                                <span className="text-xs text-gray-400 flex items-center gap-1">
                                                    <MapPin size={10} /> {order.customer_city}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="font-black text-gray-900">{order.total_amount?.toLocaleString()} DH</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border ${getStatusStyles(order.status)}`}>
                                                {order.status === 'pending' ? 'En attente' :
                                                    order.status === 'processing' ? 'En cours' :
                                                        order.status === 'completed' ? 'Livré' : 'Annulé'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-sm text-gray-500 font-medium">
                                            {new Date(order.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="px-8 py-6 text-right flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleDownloadInvoice(order.id)}
                                                className="p-3 bg-gray-50 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-2xl transition-all"
                                                title="Télécharger Facture"
                                            >
                                                <FileText size={20} />
                                            </button>
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="p-3 bg-gray-50 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-2xl transition-all group-hover:scale-110"
                                            >
                                                <Eye size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Detailed Side Panel */}
            {selectedOrder && (
                <div className="fixed inset-0 z-[100] flex justify-end">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedOrder(null)}></div>
                    <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl animate-slide-in-right flex flex-col">
                        <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-black text-gray-900 mb-1">Détails Commande #{selectedOrder.id}</h3>
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    Status:
                                    <span className={selectedOrder.status === 'pending' ? 'text-orange-500' : 'text-primary'}>
                                        {selectedOrder.status}
                                    </span>
                                </p>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="p-3 hover:bg-gray-100 rounded-2xl transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 space-y-10">
                            {/* Actions Logic Section */}
                            <div className="bg-premium-gradient p-8 rounded-[40px] text-white shadow-2xl shadow-primary/30 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                    <ShoppingBag size={120} />
                                </div>
                                <h4 className="font-black text-xs uppercase tracking-[0.2em] mb-6 opacity-70">Tableau de bord logistique</h4>

                                <div className="grid grid-cols-1 gap-4 mb-8">
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            onClick={() => handleUpdateStatus(selectedOrder.id, 'processing')}
                                            className={`flex-1 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${selectedOrder.status === 'pending' ? 'bg-white text-primary hover:scale-[1.02] shadow-xl' : 'bg-white/10 text-white/40 cursor-not-allowed'}`}
                                        >
                                            <CheckCircle2 size={16} className="inline mr-2" /> Accepter
                                        </button>
                                        <button
                                            onClick={() => handleUpdateStatus(selectedOrder.id, 'completed')}
                                            className={`flex-1 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${selectedOrder.status === 'processing' ? 'bg-green-500 text-white hover:scale-[1.02] shadow-xl shadow-green-500/20' : 'bg-white/10 text-white/40 cursor-not-allowed'}`}
                                        >
                                            <Package size={16} className="inline mr-2" /> Livré
                                        </button>
                                    </div>

                                    {/* Assignment Section */}
                                    <div className="bg-white/10 p-4 rounded-3xl border border-white/10">
                                        <label className="block text-[10px] font-black uppercase tracking-widest mb-3 opacity-70">Assigner à une agence / livreur</label>
                                        <div className="flex gap-2">
                                            <select
                                                className="flex-1 bg-white/10 border-white/20 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none"
                                                value={selectedOrder.assigned_agent || ''}
                                                onChange={(e) => handleAssignAgent(selectedOrder.id, e.target.value)}
                                            >
                                                <option value="" className="text-gray-900">Choisir un agent...</option>
                                                <option value="Wafacash" className="text-gray-900">Wafacash</option>
                                                <option value="Aramex" className="text-gray-900">Aramex</option>
                                                <option value="Livreur Interne" className="text-gray-900">Livreur Interne</option>
                                                <option value="AMANA" className="text-gray-900">AMANA</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Payment Section */}
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handleUpdatePayment(selectedOrder.id, 'paid')}
                                            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest border-2 transition-all ${selectedOrder.payment_status === 'paid' ? 'bg-green-500 border-transparent shadow-lg shadow-green-500/20' : 'border-white/20 hover:bg-white/10'}`}
                                        >
                                            <Banknote size={16} /> Marquer Payé
                                        </button>
                                        <button
                                            onClick={() => handleRefund(selectedOrder.id, selectedOrder.total_amount)}
                                            className="px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest bg-red-500/20 hover:bg-red-500 transition-all border border-red-500/30"
                                        >
                                            <History size={16} /> Rembourser
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                    <div className="flex gap-4">
                                        <a href={`https://wa.me/${selectedOrder.customer_phone}`} target="_blank" className="p-3 bg-green-500/20 rounded-xl hover:bg-green-500 transition-all" title="WhatsApp">
                                            <MessageSquare size={18} />
                                        </a>
                                        <a href={`mailto:${selectedOrder.customer_email}`} className="p-3 bg-blue-500/20 rounded-xl hover:bg-blue-500 transition-all" title="Email Client">
                                            <Mail size={18} />
                                        </a>
                                        <button onClick={() => handleDownloadInvoice(selectedOrder.id)} className="p-3 bg-white/20 rounded-xl hover:bg-white transition-all hover:text-primary" title="PDF Facture">
                                            <DownloadCloud size={18} />
                                        </button>
                                    </div>
                                    <p className="text-[10px] font-black opacity-40 uppercase tracking-widest italic flex items-center gap-2">
                                        ID Interne: {selectedOrder.id} <Eye size={10} />
                                    </p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-gray-400 mb-2">
                                        <User size={18} />
                                        <span className="text-xs font-black uppercase tracking-widest">Informations Client</span>
                                    </div>
                                    <p className="text-lg font-black text-gray-900">{selectedOrder.customer_name}</p>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Mail size={14} className="text-primary" /> {selectedOrder.customer_email}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Phone size={14} className="text-primary" /> {selectedOrder.customer_phone}
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-gray-400 mb-2">
                                        <MapPin size={18} />
                                        <span className="text-xs font-black uppercase tracking-widest">Adresse de Livraison</span>
                                    </div>
                                    <p className="text-sm font-bold text-gray-700 leading-relaxed">
                                        {selectedOrder.customer_address}<br />
                                        <span className="text-primary font-black uppercase">{selectedOrder.customer_city}</span>
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 text-gray-400">
                                        <Package size={18} />
                                        <span className="text-xs font-black uppercase tracking-widest">Breakdown Multi-Vendeurs</span>
                                    </div>
                                    <Link to={`/track/${selectedOrder.id}`} target="_blank" className="text-[10px] font-black text-primary uppercase flex items-center gap-1 hover:gap-2 transition-all">
                                        Voir Vue Client <ExternalLink size={10} />
                                    </Link>
                                </div>

                                {selectedOrder.sub_orders?.map((sub, idx) => (
                                    <div key={idx} className="bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-sm">
                                        <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100 flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <Store size={14} className="text-primary" />
                                                <span className="font-bold text-sm text-gray-900">{sub.seller.name}</span>
                                            </div>
                                            <div className="text-[10px] font-black text-gray-400">
                                                ESTIMATE: <span className="text-primary">{sub.delivery_estimate?.replace('Livraison estimée : ', '')}</span>
                                            </div>
                                        </div>
                                        <div className="p-4 space-y-3">
                                            {selectedOrder.items?.filter(item => item.sub_order_id === sub.id).map((item, iidx) => (
                                                <div key={iidx} className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-gray-50 rounded-2xl p-1 flex-shrink-0">
                                                        <img
                                                            src={getImageUrl(item.product?.image) || '/img/placeholder.png'}
                                                            alt={item.product?.name || 'Produit'}
                                                            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/img/placeholder.png'; }}
                                                            className="w-full h-full object-contain mix-blend-multiply"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-bold text-gray-900 text-xs line-clamp-1">{item.product?.name}</p>
                                                        <p className="text-[10px] text-gray-400 font-bold">{item.quantity} × {item.price} DH</p>
                                                    </div>
                                                    <div className="text-right font-black text-gray-900 text-sm">
                                                        {(item.quantity * item.price).toLocaleString()} DH
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="pt-3 border-t border-gray-50 flex justify-between items-center">
                                                <span className="text-[10px] font-black text-gray-400 uppercase">Sous-total Vendeur</span>
                                                <span className="font-black text-gray-900 text-sm">{sub.subtotal?.toLocaleString()} DH</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {(!selectedOrder.sub_orders || selectedOrder.sub_orders.length === 0) && (
                                    <div className="space-y-3">
                                        {selectedOrder.items?.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-3xl group hover:bg-gray-100 transition-all">
                                                <div className="w-16 h-16 bg-white rounded-2xl p-2 shadow-sm flex-shrink-0">
                                                    <img src={item.product?.image} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-bold text-gray-900 text-sm line-clamp-1">{item.product?.name}</p>
                                                    <p className="text-xs text-gray-400 font-bold">Qté: {item.quantity} × {item.price} DH</p>
                                                </div>
                                                <div className="text-right font-black text-gray-900">
                                                    {(item.quantity * item.price).toLocaleString()} DH
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-8 border-t border-gray-100 bg-gray-50/50">
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between items-center text-sm font-bold text-gray-500">
                                    <span>Sous-total articles</span>
                                    <span>{(selectedOrder.total_amount - 100)?.toLocaleString()} DH</span>
                                </div>
                                <div className="flex justify-between items-center text-sm font-bold text-gray-500">
                                    <span>Frais de livraison</span>
                                    <span>100 DH</span>
                                </div>
                                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                                    <span className="text-gray-500 font-bold">Mode de paiement:</span>
                                    <span className="px-4 py-1.5 bg-white border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-700 flex items-center gap-2">
                                        <CreditCard size={14} /> Espèces (COD)
                                    </span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xl font-black text-gray-900">Total payé</span>
                                <span className="text-3xl font-black text-primary">{selectedOrder.total_amount?.toLocaleString()} DH</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminOrders;

