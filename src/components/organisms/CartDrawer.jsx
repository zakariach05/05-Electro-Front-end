import React, { useRef, useEffect } from 'react';
import getImageUrl from '../../services/image';
import { X, Trash2, Plus, Minus, Lock, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import gsap from 'gsap';

const CartDrawer = () => {
    const {
        isCartOpen,
        setIsCartOpen,
        cartItems,
        removeFromCart,
        updateQuantity,
        cartTotal,
        ACOMPTE_AMOUNT
    } = useCart();

    const drawerRef = useRef(null);
    const overlayRef = useRef(null);

    useEffect(() => {
        if (isCartOpen) {
            document.body.style.overflow = 'hidden';
            gsap.to(overlayRef.current, { opacity: 1, duration: 0.3, display: 'block' });
            gsap.to(drawerRef.current, { x: '0%', duration: 0.4, ease: 'power3.out' });
        } else {
            document.body.style.overflow = 'auto';
            gsap.to(drawerRef.current, { x: '100%', duration: 0.3, ease: 'power3.in' });
            gsap.to(overlayRef.current, { opacity: 0, duration: 0.3, display: 'none', delay: 0.1 });
        }
    }, [isCartOpen]);

    return (
        <div className="relative z-50">
            {/* Overlay */}
            <div
                ref={overlayRef}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm hidden opacity-0 transition-opacity"
                onClick={() => setIsCartOpen(false)}
            ></div>

            {/* Drawer */}
            <div
                ref={drawerRef}
                className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transform translate-x-full flex flex-col"
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <ShoppingBag size={20} />
                        Mon Panier ({cartItems.length})
                    </h2>
                    <button
                        onClick={() => setIsCartOpen(false)}
                        className="p-2 hover:bg-gray-100 rounded-full text-gray-500 hover:text-gray-900 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {cartItems.length === 0 ? (
                        <div className="text-center py-10">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <ShoppingBag size={32} className="text-gray-400" />
                            </div>
                            <p className="text-gray-500 font-medium">Votre panier est vide.</p>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="mt-4 text-primary font-bold hover:underline"
                            >
                                Continuer mes achats
                            </button>
                        </div>
                    ) : (
                        cartItems.map((item) => (
                            <div key={item.id} className="flex gap-4">
                                    <div className="w-24 h-24 bg-gray-50 rounded-lg p-2 flex-shrink-0">
                                    <img src={getImageUrl(item.image)} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">{item.name}</h3>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {typeof item.category === 'object' ? item.category.name : item.category}
                                    </p>

                                    <div className="flex justify-between items-end mt-2">
                                        <span className="font-bold text-gray-900">{item.price} DH</span>
                                        <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                                            <button
                                                className="p-1 px-2 hover:bg-white rounded-l-lg transition-colors"
                                                onClick={() => updateQuantity(item.id, -1)}
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                                            <button
                                                className="p-1 px-2 hover:bg-white rounded-r-lg transition-colors"
                                                onClick={() => updateQuantity(item.id, 1)}
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {cartItems.length > 0 && (
                    <div className="border-t border-gray-100 bg-gray-50 p-6 space-y-4">
                        <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex justify-between">
                                <span>Sous-total</span>
                                <span>{cartTotal} DH</span>
                            </div>
                            <div className="flex justify-between font-medium text-green-600">
                                <span>Livraison</span>
                                <span>Calculé à l'étape suivante</span>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-gray-200 font-bold text-lg text-gray-900">
                                <span>Total</span>
                                <span>{cartTotal} DH</span>
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg flex gap-3 items-start">
                            <Lock size={16} className="text-blue-600 mt-1 flex-shrink-0" />
                            <div className="text-xs text-blue-800">
                                <p className="font-bold mb-1">Paiement à la livraison</p>
                                <p>Un acompte de <span className="font-bold">{ACOMPTE_AMOUNT} DH</span> sera demandé pour valider votre commande.</p>
                            </div>
                        </div>

                        <Link
                            to="/checkout"
                            onClick={() => setIsCartOpen(false)}
                            className="block w-full bg-gray-900 text-white text-center py-3.5 rounded-xl font-bold hover:bg-primary transition-all shadow-lg"
                        >
                            Commander maintenant
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartDrawer;
