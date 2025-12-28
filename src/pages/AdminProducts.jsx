import React, { useState, useEffect } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../services/api';
import { getImageUrl } from '../services/image';
import { Trash2, Plus, Edit, Package, Search } from 'lucide-react';
import Loader from '../components/atoms/Loader';
import SEO from '../components/atoms/SEO';

const AdminProducts = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    useAuth();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${API_URL}/products`);
            setProducts(response.data.data || response.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;
        try {
            await axios.delete(`${API_URL}/products/${id}`);
            setProducts(products.filter(p => p.id !== id));
        } catch (error) {
            alert('Erreur lors de la suppression');
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout>
            <SEO title="Gestion des Produits - Admin" description="Interface d'administration pour gérer les produits d'Electro-05." />
            <div className="bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div>
                            <h1 className="text-3xl font-black text-gray-900">Gestion des Produits</h1>
                            <p className="text-gray-500 font-medium">Ajoutez, modifiez ou supprimez des articles.</p>
                        </div>
                        <button
                            onClick={() => navigate('/admin/products/new')}
                            className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-primary transition-all shadow-xl"
                        >
                            <Plus size={20} /> Nouveau Produit
                        </button>
                    </div>

                    <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-50 flex items-center gap-4">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Rechercher un produit..."
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border-transparent focus:border-primary focus:bg-white border-2 rounded-2xl outline-none transition-all font-medium"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="hidden md:flex items-center gap-2 text-sm font-bold text-gray-400 px-4">
                                <Package size={18} />
                                {filteredProducts.length} Produits
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/50">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Produit</th>
                                        <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Catégorie</th>
                                        <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Prix</th>
                                        <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Stock</th>
                                        <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="5" className="py-20 text-center"><Loader /></td>
                                        </tr>
                                    ) : filteredProducts.map(product => (
                                        <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-gray-50 rounded-xl overflow-hidden p-2">
                                                        <img src={getImageUrl(product.image)} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 line-clamp-1">{product.name}</p>
                                                        <p className="text-xs text-gray-400">ID: #{product.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-block px-3 py-1 bg-primary/5 text-primary text-[10px] font-black rounded-full uppercase">
                                                    {product.category?.name || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-black text-gray-900">{product.price} DH</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                    <span className="font-bold text-gray-700">{product.stock}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link to={`/admin/products/edit/${product.id}`} className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                                                        <Edit size={18} />
                                                    </Link>
                                                    <button onClick={() => handleDelete(product.id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminProducts;
