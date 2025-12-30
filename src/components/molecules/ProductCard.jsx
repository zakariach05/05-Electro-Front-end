import React, { useState } from 'react';
import { ShoppingCart, Eye, Star, Heart, GitCompare } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useCompare } from '../../context/CompareContext';
import { useWishlist } from '../../context/WishlistContext';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../../services/image';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const { toggleCompare, compareItems } = useCompare();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const [isHovered, setIsHovered] = useState(false);

    const isComparing = compareItems.find(item => item.id === product.id);
    const inWishlist = isInWishlist(product.id);

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product);
    };

    return (
        <div
            className="group relative bg-white rounded-3xl overflow-hidden border border-gray-100 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:-translate-y-2 product-card-enhanced"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Section */}
            <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden">
                {product.promo && (
                    <div className="absolute top-4 left-4 z-10 bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg">
                        -{product.promo}%
                    </div>
                )}
                <Link to={`/product/${product.id}`} className="block w-full h-full">
                    <img
                        src={getImageUrl(product.image)}
                        alt={product.name}
                        className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal transition-transform duration-700 group-hover:scale-110 p-6"
                    />
                </Link>

                {/* Quick Actions Overlay */}
                <div className={`absolute inset-0 bg-black/5 dark:bg-black/20 backdrop-blur-[2px] flex items-center justify-center gap-3 transition-all duration-500 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
                    <button
                        onClick={handleAddToCart}
                        className="p-3 bg-white text-gray-900 rounded-2xl hover:bg-primary hover:text-white transition-all duration-300 shadow-xl"
                    >
                        <ShoppingCart size={20} />
                    </button>
                    <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleCompare(product); }}
                        className={`p-3 rounded-2xl transition-all duration-300 shadow-xl ${isComparing ? 'bg-primary text-white' : 'bg-white text-gray-900 hover:bg-secondary hover:text-white'}`}
                    >
                        <GitCompare size={20} />
                    </button>
                    <Link
                        to={`/product/${product.id}`}
                        className="p-3 bg-white text-gray-900 rounded-2xl hover:bg-gray-900 hover:text-white transition-all duration-300 shadow-xl"
                    >
                        <Eye size={20} />
                    </Link>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                        {product.category?.name || (typeof product.category === 'string' ? product.category : '')}
                    </span>
                    <div className="flex items-center gap-1 text-yellow-400">
                        <Star size={12} fill="currentColor" />
                        <span className="text-xs font-bold text-gray-400">4.8</span>
                    </div>
                </div>

                    <Link to={`/product/${product.id}`} className="block">
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 hover:text-primary transition-colors h-10 leading-tight">
                        {product.name}
                    </h3>
                </Link>

                <div className="flex items-center justify-between mt-4">
                    <div className="flex flex-col">
                        <span className="text-xl font-black text-gray-900">{product.price} DH</span>
                        {product.oldPrice && (
                            <span className="text-xs text-gray-400 line-through font-medium">{product.oldPrice} DH</span>
                        )}
                    </div>
                    <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product); }}
                        className={`p-2 transition-colors ${inWishlist ? 'text-red-500' : 'text-gray-300 dark:text-gray-600 hover:text-red-500'}`}
                    >
                        <Heart size={20} fill={inWishlist ? "currentColor" : "none"} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
