import React, { useState, useRef, useEffect } from 'react';
import { Star, Heart, Share2, ShieldCheck, Truck, RotateCcw, ChevronRight } from 'lucide-react';
import gsap from 'gsap';
import MainLayout from '../layouts/MainLayout';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../services/api';
import Loader from '../components/atoms/Loader';
import { getImageUrl } from '../services/image';
import SEO from '../components/atoms/SEO';
import { DELIVERY_DATA } from '../data/delivery';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedCity, setSelectedCity] = useState(DELIVERY_DATA[0]);
    const titleRef = useRef(null);
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const isWishlisted = isInWishlist(parseInt(id));

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`${API_URL}/products/${id}`);
                setProduct(response.data);
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    useEffect(() => {
        if (!loading && product) {
            gsap.from(titleRef.current, {
                y: 20,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out"
            });
        }
    }, [loading, product]);

    if (loading) return (
        <MainLayout>
            <div className="min-h-screen flex items-center justify-center">
                <Loader />
            </div>
        </MainLayout>
    );

    if (!product) return (
        <MainLayout>
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Produit non trouvé.</p>
            </div>
        </MainLayout>
    );

    const images = (product.images && product.images.length > 0)
        ? product.images.map(img => getImageUrl(img))
        : [getImageUrl(product.image)];

    return (
        <MainLayout>
            <SEO
                title={product.name}
                description={product.description || `Acheter ${product.name} sur Electro-05 au meilleur prix au Maroc.`}
                image={images[0]}
                type="product"
            />
            <div className="bg-white min-h-[calc(100vh-4rem)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                    {/* Breadcrumb */}
                    <nav className="flex text-sm text-gray-500 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                        <ol className="flex items-center space-x-2 whitespace-nowrap">
                            <li><Link to="/" className="hover:text-primary transition-colors">Accueil</Link></li>
                            <li><ChevronRight size={14} /></li>
                            <li><Link to={`/shop/${product.category?.slug || 'all'}`} className="hover:text-primary transition-colors">{product.category?.name || 'Boutique'}</Link></li>
                            <li><ChevronRight size={14} /></li>
                            <li className="text-gray-900 font-bold truncate max-w-[200px]">{product.name}</li>
                        </ol>
                    </nav>

                    <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">

                        {/* Image Gallery */}
                        <div className="product-gallery mb-10 lg:mb-0">
                            <div className="aspect-square bg-gray-50 rounded-3xl overflow-hidden relative mb-4 group border border-gray-100 shadow-sm">
                                {product.promo && (
                                    <div className="absolute top-6 left-6 z-10 bg-red-500 text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-lg animate-bounce-slow">
                                        -{product.promo}%
                                    </div>
                                )}
                                <div className="absolute top-6 right-6 z-10 flex flex-col gap-3">
                                    <button
                                        onClick={() => toggleWishlist(product)}
                                        className={`p-3 backdrop-blur-md rounded-2xl shadow-xl transition-all duration-300 ${isWishlisted ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-400 hover:text-red-500 hover:bg-white'}`}
                                    >
                                        <Heart size={22} fill={isWishlisted ? "currentColor" : "none"} />
                                    </button>
                                    <button className="p-3 bg-white/90 backdrop-blur-md rounded-2xl text-gray-400 hover:text-primary hover:bg-white shadow-xl transition-all duration-300">
                                        <Share2 size={22} />
                                    </button>
                                </div>
                                                <img
                                                    src={images[selectedImage]}
                                                    alt={product.name}
                                                    className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110 p-8"
                                                />
                            </div>
                            <div className="grid grid-cols-4 gap-4">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        className={`aspect-square rounded-2xl bg-gray-50 p-2 border-2 transition-all duration-300 ${selectedImage === idx ? 'border-primary shadow-lg ring-4 ring-primary/10 scale-105' : 'border-transparent hover:border-gray-200'
                                            }`}
                                        onClick={() => setSelectedImage(idx)}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="product-info flex flex-col items-center lg:items-start text-center lg:text-left">
                            <div className="flex-1">
                                <h1 ref={titleRef} className="text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl mb-4 leading-tight">
                                    {product.name}
                                </h1>

                                <div className="flex items-center gap-4 mb-8">
                                    <div className="flex text-yellow-500">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={18} fill={i < 4 ? "currentColor" : "none"} strokeWidth={2} />
                                        ))}
                                    </div>
                                    <span className="text-sm font-bold text-gray-400 border-l border-gray-200 pl-4">124 avis vérifiés</span>
                                    <div className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest ${product.stock > 0 ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                                        }`}>
                                        {product.stock > 0 ? 'En Stock' : 'Épuisé'}
                                    </div>
                                </div>

                                <div className="mb-10 p-8 rounded-[40px] bg-gray-900 text-white relative overflow-hidden shadow-2xl flex flex-col items-center text-center">
                                    <div className="absolute -right-10 -bottom-10 opacity-10 rotate-12">
                                        <ShieldCheck size={200} />
                                    </div>
                                    <div className="relative z-10">
                                        <div className="flex flex-col items-center gap-2 mb-4">
                                            <div className="flex items-baseline gap-4">
                                                <span className="text-5xl font-black">{product.price} DH</span>
                                                {product.promo > 0 && (
                                                    <span className="text-2xl text-gray-500 line-through font-medium">
                                                        {Math.round(product.price / (1 - product.promo / 100))} DH
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 text-primary font-bold">
                                                <ShieldCheck size={20} />
                                                Garantie Premium Electro-05 Incluse
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Delivery Estimator */}
                                <div className="mb-10 p-6 rounded-3xl bg-blue-50/50 border border-blue-100">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="font-bold text-gray-900 flex items-center gap-2">
                                            <Truck size={20} className="text-primary" /> Estimation Livraison
                                        </h4>
                                        <select
                                            className="bg-white border-2 border-primary/10 rounded-xl px-4 py-2 text-sm font-bold text-primary focus:border-primary outline-none shadow-sm cursor-pointer hover:bg-gray-50 transition-colors"
                                            onChange={(e) => setSelectedCity(DELIVERY_DATA.find(c => c.city === e.target.value))}
                                            value={selectedCity.city}
                                        >
                                            {DELIVERY_DATA.map(c => <option key={c.city} value={c.city}>{c.city}</option>)}
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white p-3 rounded-2xl border border-blue-50 flex items-center justify-between px-5 shadow-sm">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Frais</span>
                                            <span className="font-black text-emerald-600">{selectedCity.price === 0 ? 'Gratuit' : `${selectedCity.price} DH`}</span>
                                        </div>
                                        <div className="bg-white p-3 rounded-2xl border border-blue-50 flex items-center justify-between px-5 shadow-sm">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Délai</span>
                                            <span className="font-black text-gray-900">{selectedCity.time}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Quantity and Primary Action */}
                                <div className="flex flex-col sm:flex-row items-stretch gap-4 mb-10">
                                    <div className="flex items-center bg-gray-100 rounded-2xl p-1 shrink-0">
                                        <button
                                            className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white transition-all font-black text-xl text-gray-400 hover:text-gray-900"
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        >
                                            −
                                        </button>
                                        <span className="w-12 text-center font-black text-lg text-gray-900">{quantity}</span>
                                        <button
                                            className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white transition-all font-black text-xl text-gray-400 hover:text-gray-900"
                                            onClick={() => setQuantity(quantity + 1)}
                                        >
                                            +
                                        </button>
                                    </div>

                                    <button
                                        className="btn-magnetic flex-1 bg-gray-900 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-primary transition-all shadow-2xl shadow-gray-200"
                                        onClick={() => addToCart(product, quantity)}
                                    >
                                        Ajouter au Panier
                                    </button>
                                </div>

                                <button
                                    className="btn-magnetic w-full bg-premium-gradient text-white px-10 py-5 rounded-2xl font-black text-lg transition-all shadow-2xl shadow-secondary/30 mb-10"
                                    onClick={() => addToCart(product, quantity)}
                                >
                                    Commander Maintenant
                                </button>
                            </div>

                            {/* Features Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-gray-100 pt-10">
                                <Feature icon={<Truck size={24} />} title="Expédition Rapide" desc="Partout au Maroc" />
                                <Feature icon={<ShieldCheck size={24} />} title="100% Original" desc="Certifié Maroc" />
                                <Feature icon={<RotateCcw size={24} />} title="Retours" desc="Sous 7 Jours" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

const Feature = ({ icon, title, desc }) => (
    <div className="flex flex-col items-center text-center gap-2">
        <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-primary group-hover:bg-primary/10 transition-colors">
            {icon}
        </div>
        <div>
            <p className="font-black text-sm text-gray-900">{title}</p>
            <p className="text-[11px] text-gray-500 font-medium">{desc}</p>
        </div>
    </div>
);

export default ProductDetail;
