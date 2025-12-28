import React from 'react';
import getImageUrl from '../services/image';
import MainLayout from '../layouts/MainLayout';
import { useCompare } from '../context/CompareContext';
import { X, Check, ShoppingCart, Info, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { useCart } from '../context/CartContext';
import SEO from '../components/atoms/SEO';

const Comparison = () => {
    const { compareItems, removeFromCompare, clearCompare } = useCompare();
    const { addToCart } = useCart();

    if (compareItems.length === 0) {
        return (
            <MainLayout>
                <div className="min-h-[60vh] flex flex-col items-center justify-center p-10">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-6">
                        <Info size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Aucun produit à comparer</h2>
                    <p className="text-gray-500 mb-8 max-w-md text-center">
                        Ajoutez au moins deux produits pour voir une comparaison détaillée de leurs caractéristiques.
                    </p>
                    <a href="/shop/all" className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all">
                        Retour à la boutique
                    </a>
                </div>
            </MainLayout>
        );
    }

    // Define rows for comparison
    const specsRows = [
        { label: 'Prix', key: 'price', format: (v) => `${v} DH` },
        { label: 'État', key: 'state', format: (v) => v === 'neuf' ? 'Neuf' : 'Reconditionné' },
        { label: 'Catégorie', key: 'category', format: (v) => typeof v === 'object' ? v.name : v },
        { label: 'Garantie', render: () => <Check className="text-green-500 mx-auto" /> },
        { label: 'Livraison', render: () => <Truck className="text-primary mx-auto" size={18} /> },
        { label: 'Service Client', render: () => <ShieldCheck className="text-primary mx-auto" size={18} /> },
    ];

    return (
        <MainLayout>
            <SEO title="Comparaison de produits" description="Comparez les spécifications et les prix des meilleurs produits high-tech." />
            <div className="bg-gray-50 min-h-screen py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <h1 className="text-4xl font-black text-gray-900">Comparateur</h1>
                            <p className="text-gray-500 mt-2">Analysez les différences pour faire le meilleur choix.</p>
                        </div>
                        <button onClick={clearCompare} className="text-red-500 font-bold text-sm hover:underline">Tout réinitialiser</button>
                    </div>

                    <div className="bg-white rounded-[40px] shadow-xl border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-center border-collapse">
                                <thead>
                                    <tr>
                                        <th className="p-8 text-left w-64 bg-gray-50/50 border-r border-gray-100">
                                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Caractéristiques</span>
                                        </th>
                                        {compareItems.map(item => (
                                            <th key={item.id} className="p-8 min-w-[280px] border-r last:border-0 border-gray-100 relative group">
                                                <button
                                                    onClick={() => removeFromCompare(item.id)}
                                                    className="absolute top-4 right-4 p-2 bg-gray-100 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                >
                                                    <X size={16} />
                                                </button>
                                                <div className="aspect-square bg-gray-50 rounded-3xl p-6 mb-6 group-hover:scale-105 transition-transform">
                                                    <img src={getImageUrl(item.image)} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                                                </div>
                                                <h3 className="font-bold text-gray-900 mb-4 line-clamp-2 h-12 leading-tight">{item.name}</h3>
                                                <button
                                                    onClick={() => addToCart(item)}
                                                    className="w-full bg-gray-900 text-white py-3 rounded-2xl font-bold hover:bg-primary transition-all flex items-center justify-center gap-2"
                                                >
                                                    <ShoppingCart size={18} /> Acheter
                                                </button>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {specsRows.map((row, idx) => (
                                        <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50/30' : 'bg-white'}>
                                            <td className="p-6 text-left font-bold text-gray-700 border-r border-gray-100">{row.label}</td>
                                            {compareItems.map(item => (
                                                <td key={item.id} className="p-6 border-r last:border-0 border-gray-100">
                                                    {row.render ? row.render() : (
                                                        <span className="font-medium text-gray-900">
                                                            {row.format ? row.format(item[row.key]) : item[row.key]}
                                                        </span>
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                    {/* Action Row */}
                                    <tr>
                                        <td className="p-6 bg-gray-50/50 border-r border-gray-100"></td>
                                        {compareItems.map(item => (
                                            <td key={item.id} className="p-8 border-r last:border-0 border-gray-100">
                                                <a href={`/product/${item.id}`} className="text-primary font-bold hover:underline flex items-center justify-center gap-2">
                                                    Voir détails <RotateCcw size={14} className="rotate-[135deg]" />
                                                </a>
                                            </td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Trust Section */}
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 bg-white rounded-3xl border border-gray-100 flex items-center gap-4">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><ShieldCheck /></div>
                            <p className="font-bold text-sm">Données certifiées conformes aux stocks réels.</p>
                        </div>
                        <div className="p-6 bg-white rounded-3xl border border-gray-100 flex items-center gap-4">
                            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><Check /></div>
                            <p className="font-bold text-sm">Mise à jour automatique des prix en temps réel.</p>
                        </div>
                        <div className="p-6 bg-white rounded-3xl border border-gray-100 flex items-center gap-4">
                            <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl"><Info /></div>
                            <p className="font-bold text-sm">Besoin d'aide ? Contactez un expert Electro-05.</p>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Comparison;
