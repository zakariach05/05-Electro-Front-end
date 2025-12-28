import React from 'react';
import MainLayout from '../layouts/MainLayout';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/molecules/ProductCard';
import { Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const Wishlist = () => {
    const { wishlistItems } = useWishlist();

    return (
        <MainLayout>
            <div className="bg-gray-50 min-h-screen py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 text-red-500 mb-6">
                            <Heart size={40} fill="currentColor" />
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 mb-4">Ma Liste d'Envies</h1>
                        <p className="text-gray-500 max-w-2xl mx-auto font-medium">
                            Retrouvez tous les produits que vous avez aimés. Prêt à craquer ?
                        </p>
                    </div>

                    {wishlistItems.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {wishlistItems.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-[40px] p-20 text-center border border-gray-100 shadow-xl max-w-2xl mx-auto">
                            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 text-gray-300">
                                <ShoppingBag size={48} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Votre liste est vide</h2>
                            <p className="text-gray-500 mb-10">Explorez notre boutique et ajoutez des coups de cœur !</p>
                            <Link
                                to="/"
                                className="inline-flex items-center justify-center px-10 py-4 bg-gray-900 text-white rounded-2xl font-black hover:bg-primary transition-all shadow-xl"
                            >
                                Commencer le shopping
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};

export default Wishlist;
