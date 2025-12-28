import React, { useState, useEffect } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../services/api';
import { Save, X, Image as ImageIcon, Loader2 } from 'lucide-react';

const AdminProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        category_id: '',
        price: '',
        old_price: '',
        stock: '',
        description: '',
        image: '',
        is_featured: false,
        state: 'neuf'
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const catRes = await axios.get(`${API_URL}/categories`);
                // Flatten categories if they have children
                const flatCats = [];
                catRes.data.forEach(cat => {
                    flatCats.push(cat);
                    if (cat.children) flatCats.push(...cat.children);
                });
                setCategories(flatCats);

                if (isEdit) {
                    const prodRes = await axios.get(`${API_URL}/products/${id}`);
                    setFormData(prodRes.data);
                    if (prodRes.data.image) setImagePreview(prodRes.data.image);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, isEdit]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        setImageFile(file);
        const url = URL.createObjectURL(file);
        setImagePreview(url);
        // keep URL field empty when file chosen (server should prefer file)
        setFormData(prev => ({ ...prev, image: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            // Client-side quick validation for required fields
            const missing = [];
            ['name', 'category_id', 'price', 'stock'].forEach(k => {
                if (!formData[k] && formData[k] !== 0) missing.push(k);
            });
            if (missing.length) {
                alert('Champs requis manquants: ' + missing.join(', '));
                setSaving(false);
                return;
            }
                if (imageFile) {
                const fd = new FormData();
                // append all fields except image (we send file instead)
                Object.entries(formData).forEach(([k, v]) => {
                    if (v === undefined || v === null) return;
                    // normalize booleans and objects
                    if (typeof v === 'boolean') fd.append(k, v ? '1' : '0');
                    else if (typeof v === 'object') fd.append(k, JSON.stringify(v));
                    else fd.append(k, String(v));
                });
                fd.append('image_file', imageFile);

                if (isEdit) {
                    // when sending multipart for update, use POST with _method=PUT to ensure PHP parses multipart body
                    fd.append('_method', 'PUT');
                    await axios.post(`${API_URL}/products/${id}`, fd);
                } else {
                    await axios.post(`${API_URL}/products`, fd);
                }
            } else {
                if (isEdit) {
                    await axios.put(`${API_URL}/products/${id}`, formData);
                } else {
                    await axios.post(`${API_URL}/products`, formData);
                }
            }
            navigate('/admin/products');
        } catch (error) {
            // Detailed logging to help debug 422 responses
            const resp = error.response;
            if (resp) {
                console.error('Save error status:', resp.status);
                console.error('Save error data:', resp.data);
                console.error('Save error headers:', resp.headers);
                try {
                    alert('Erreur serveur:\n' + JSON.stringify(resp.data, null, 2));
                } catch (e) {
                    alert('Erreur serveur. Consultez la console pour détails.');
                }
            } else {
                console.error('Save error:', error);
                alert(error.message || 'Erreur lors de l\'enregistrement');
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <AdminLayout><div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={40} /></div></AdminLayout>;

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-black text-gray-900">{isEdit ? 'Modifier le Produit' : 'Nouveau Produit'}</h1>
                    <button onClick={() => navigate('/admin/products')} className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Nom du produit</label>
                                <input
                                    required
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    type="text"
                                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-2xl outline-none transition-all font-bold"
                                    placeholder="ex: iPhone 15 Pro Max"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Catégorie</label>
                                <select
                                    required
                                    name="category_id"
                                    value={formData.category_id}
                                    onChange={handleChange}
                                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-2xl outline-none transition-all font-bold"
                                >
                                    <option value="">Sélectionner une catégorie</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Prix (DH)</label>
                                <input
                                    required
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    type="number"
                                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-2xl outline-none transition-all font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Ancien Prix (DH)</label>
                                <input
                                    name="old_price"
                                    value={formData.old_price}
                                    onChange={handleChange}
                                    type="number"
                                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-2xl outline-none transition-all font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Stock</label>
                                <input
                                    required
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    type="number"
                                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-2xl outline-none transition-all font-bold"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Image du produit</label>
                            <div className="flex gap-4 items-center">
                                <div className="flex-1 relative">
                                    <ImageIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        name="image"
                                        value={formData.image}
                                        onChange={handleChange}
                                        type="text"
                                        className="w-full pl-14 pr-6 py-4 bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-2xl outline-none transition-all font-bold"
                                        placeholder="URL de l'image (ex: http://...) — ou choisissez un fichier"
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <label className="px-4 py-3 bg-white border rounded-2xl cursor-pointer text-sm font-bold">
                                        Choisir un fichier
                                        <input accept="image/*" onChange={handleFileChange} type="file" className="sr-only" />
                                    </label>
                                </div>

                                {(imagePreview || formData.image) && (
                                    <div className="w-16 h-16 rounded-2xl bg-gray-50 border p-2 flex items-center justify-center overflow-hidden">
                                        <img src={imagePreview || formData.image} alt="preview" className="w-full h-full object-contain" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="4"
                                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-primary focus:bg-white rounded-2xl outline-none transition-all font-bold resize-none"
                            ></textarea>
                        </div>

                        <div className="flex items-center gap-8 py-4 px-2">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative">
                                    <input
                                        name="is_featured"
                                        checked={formData.is_featured}
                                        onChange={handleChange}
                                        type="checkbox"
                                        className="sr-only"
                                    />
                                    <div className={`w-12 h-6 rounded-full transition-colors ${formData.is_featured ? 'bg-primary' : 'bg-gray-200'}`}></div>
                                    <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.is_featured ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                </div>
                                <span className="text-sm font-bold text-gray-700">Mettre en avant</span>
                            </label>

                            <div className="flex items-center gap-4">
                                <span className="text-sm font-bold text-gray-700">État :</span>
                                <div className="flex bg-gray-100 rounded-xl p-1">
                                    {['neuf', 'reconditionné'].map(state => (
                                        <button
                                            key={state}
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, state }))}
                                            className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${formData.state === state ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                        >
                                            {state}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/products')}
                            className="px-10 py-4 rounded-2xl font-black text-gray-500 hover:bg-gray-100 transition-all uppercase tracking-widest text-sm"
                        >
                            Annuler
                        </button>
                        <button
                            disabled={saving}
                            type="submit"
                            className="px-12 py-4 bg-gray-900 text-white rounded-2xl font-black shadow-2xl shadow-gray-200 hover:bg-primary transition-all flex items-center gap-3 uppercase tracking-widest text-sm"
                        >
                            {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                            {isEdit ? 'Enregistrer les modifications' : 'Créer le produit'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default AdminProductForm;
