import React, { useState } from 'react';
import getImageUrl from '../../services/image';
import { useCompare } from '../../context/CompareContext';
import { X, ArrowRight, GitCompare, LayoutPanelLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CompareBar = () => {
    const { compareItems, removeFromCompare, clearCompare } = useCompare();
    const [isExpanded, setIsExpanded] = useState(true);
    const navigate = useNavigate();

    if (compareItems.length === 0) return null;

    if (!isExpanded) {
        return (
            <button
                onClick={() => setIsExpanded(true)}
                className="fixed bottom-24 left-6 z-40 bg-gray-900 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center gap-2 group animate-slide-in-left"
            >
                <GitCompare size={24} className="text-secondary" />
                <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap font-bold">
                    Comparer ({compareItems.length})
                </span>
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 left-6 right-6 lg:left-auto lg:right-6 lg:w-[500px] z-50 animate-slide-up">
            <div className="bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="bg-gray-900 p-4 flex justify-between items-center text-white">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-lg">
                            <GitCompare size={18} className="text-secondary" />
                        </div>
                        <h3 className="font-bold text-sm">Comparateur ({compareItems.length}/3)</h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={clearCompare} className="text-xs text-gray-400 hover:text-white transition-colors underline">Tout effacer</button>
                        <button onClick={() => setIsExpanded(false)} className="p-1 hover:bg-white/10 rounded-lg transition-colors ml-2">
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Items */}
                <div className="p-4 flex gap-4 overflow-x-auto scrollbar-hide">
                    {compareItems.map(item => (
                        <div key={item.id} className="relative group shrink-0 w-24">
                            <button
                                onClick={() => removeFromCompare(item.id)}
                                className="absolute -top-2 -right-2 z-10 bg-white shadow-md rounded-full text-gray-400 hover:text-red-500 h-6 w-6 flex items-center justify-center border border-gray-100"
                            >
                                <X size={12} />
                            </button>
                            <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden p-2 border border-gray-100 group-hover:border-primary transition-colors">
                                <img src={getImageUrl(item.image)} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                            </div>
                            <p className="text-[10px] font-bold text-gray-700 truncate mt-2">{item.name}</p>
                        </div>
                    ))}

                    {compareItems.length < 3 && (
                        <div className="shrink-0 w-24 aspect-square rounded-xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-gray-300 gap-1">
                            <LayoutPanelLeft size={20} />
                            <span className="text-[9px] font-bold">Ajouter</span>
                        </div>
                    )}
                </div>

                {/* Footer Action */}
                <div className="p-4 pt-0">
                    <button
                        onClick={() => navigate('/comparison')}
                        disabled={compareItems.length < 2}
                        className={`w-full py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${compareItems.length < 2
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-premium-gradient text-white shadow-lg shadow-secondary/20 hover:scale-[1.02]'
                            }`}
                    >
                        Lancer la comparaison <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CompareBar;
