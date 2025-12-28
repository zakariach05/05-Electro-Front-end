import React, { useState, useEffect } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import axios from 'axios';
import { API_URL } from '../services/api';
import { Plus, Edit, Trash2, Layers } from 'lucide-react';
import Loader from '../components/atoms/Loader';

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${API_URL}/categories`);
                setCategories(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">Catégories</h1>
                    <p className="text-gray-500 font-medium">Gérez l'arborescence de votre boutique.</p>
                </div>
                <button className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-primary transition-all shadow-xl">
                    <Plus size={20} /> Nouvelle Catégorie
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full py-20 text-center"><Loader /></div>
                ) : categories.map(category => (
                    <div key={category.id} className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                <Layers size={24} />
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors"><Edit size={18} /></button>
                                <button className="p-2 text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={18} /></button>
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{category.name}</h3>
                        <p className="text-gray-400 text-sm font-medium mb-4">{category.slug}</p>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Sous-catégories</span>
                            <span className="bg-gray-100 px-2 py-1 rounded-lg text-xs font-bold text-gray-600">
                                {category.children?.length || 0}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </AdminLayout>
    );
};

export default AdminCategories;
