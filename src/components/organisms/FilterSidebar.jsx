import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';

const FilterSection = ({ title, isOpenDefault = true, children }) => {
    const [isOpen, setIsOpen] = useState(isOpenDefault);

    return (
        <div className="border-b border-gray-100 py-4 last:border-0">
            <button
                className="flex w-full items-center justify-between text-left mb-2 group"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="font-semibold text-gray-900 group-hover:text-primary transition-colors">{title}</span>
                {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {isOpen && <div className="mt-2 animate-fade-in">{children}</div>}
        </div>
    );
};

const FilterSidebar = ({ filters, setFilters, closeMobileFilters }) => {

    const handleCheckboxChange = (category, value) => {
        const currentValues = filters[category] || [];
        const newValues = currentValues.includes(value)
            ? currentValues.filter(v => v !== value)
            : [...currentValues, value];

        setFilters({ ...filters, [category]: newValues });
    };

    const handlePriceChange = (e) => {
        setFilters({ ...filters, maxPrice: parseInt(e.target.value) });
    };

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-100 h-full overflow-y-auto">
            <div className="flex items-center justify-between md:hidden mb-6">
                <h2 className="text-xl font-bold text-gray-900">Filtres</h2>
                <button onClick={closeMobileFilters} className="p-2 hover:bg-gray-100 rounded-full">
                    <X size={24} />
                </button>
            </div>

            {/* Prix */}
            <FilterSection title="Prix">
                <div className="px-2">
                    <input
                        type="range"
                        min="0"
                        max="30000"
                        step="100"
                        value={filters.maxPrice || 30000}
                        onChange={handlePriceChange}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between mt-2 text-sm text-gray-600 font-medium">
                        <span>0 DH</span>
                        <span>{filters.maxPrice || 30000} DH</span>
                    </div>
                </div>
            </FilterSection>

            {/* Catégories (Visible only if no category selected in URL or 'all') */}
            <FilterSection title="Catégories">
                <div className="space-y-2">
                    {['Smartphones', 'PC & Mac', 'Gaming', 'TV & Son', 'Tablettes', 'Accessoires', 'Domotique'].map(cat => (
                        <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative flex items-center">
                                <input
                                    type="checkbox" // Changed to checkbox to allow multiple or just toggle
                                    className="peer appearance-none w-5 h-5 border border-gray-300 rounded-md checked:bg-primary checked:border-primary transition-colors"
                                    checked={filters.categories?.includes(cat) || false}
                                    onChange={() => handleCheckboxChange('categories', cat)}
                                />
                                <svg className="absolute w-3.5 h-3.5 text-white left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 12 10" fill="none">
                                    <path d="M1 5L4.5 9L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <span className="text-gray-600 group-hover:text-gray-900 transition-colors">{cat}</span>
                        </label>
                    ))}
                </div>
            </FilterSection>

            {/* Marques */}
            <FilterSection title="Marque">
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {['Apple', 'Samsung', 'Xiaomi', 'Sony', 'HP', 'Dell', 'Asus', 'Lenovo', 'MSI', 'LG', 'JBL', 'Nintendo', 'Microsoft'].map(brand => (
                        <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative flex items-center">
                                <input
                                    type="checkbox"
                                    className="peer appearance-none w-5 h-5 border border-gray-300 rounded-md checked:bg-primary checked:border-primary transition-colors"
                                    checked={filters.brands?.includes(brand) || false}
                                    onChange={() => handleCheckboxChange('brands', brand)}
                                />
                                <svg className="absolute w-3.5 h-3.5 text-white left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 12 10" fill="none">
                                    <path d="M1 5L4.5 9L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <span className="text-gray-600 group-hover:text-gray-900 transition-colors">{brand}</span>
                        </label>
                    ))}
                </div>
            </FilterSection>

            {/* État */}
            <FilterSection title="État">
                <div className="space-y-2">
                    {['Neuf', 'Reconditionné', 'Occasion'].map(state => (
                        <label key={state} className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative flex items-center">
                                <input
                                    type="checkbox"
                                    className="peer appearance-none w-5 h-5 border border-gray-300 rounded-md checked:bg-primary checked:border-primary transition-colors"
                                    checked={filters.states?.includes(state) || false}
                                    onChange={() => handleCheckboxChange('states', state)}
                                />
                                <svg className="absolute w-3.5 h-3.5 text-white left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 12 10" fill="none">
                                    <path d="M1 5L4.5 9L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <span className="text-gray-600 group-hover:text-gray-900 transition-colors">{state}</span>
                        </label>
                    ))}
                </div>
            </FilterSection>

            {/* Disponibilité & Promos */}
            <FilterSection title="Offres Spéciales">
                <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative flex items-center">
                            <input
                                type="checkbox"
                                className="peer appearance-none w-5 h-5 border border-gray-300 rounded-md checked:bg-primary checked:border-primary transition-colors"
                                checked={filters.promoOnly || false}
                                onChange={() => setFilters({ ...filters, promoOnly: !filters.promoOnly })}
                            />
                            <svg className="absolute w-3.5 h-3.5 text-white left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 12 10" fill="none">
                                <path d="M1 5L4.5 9L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span className="text-gray-600 group-hover:text-gray-900 transition-colors">🔥 En Promo</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative flex items-center">
                            <input
                                type="checkbox"
                                className="peer appearance-none w-5 h-5 border border-gray-300 rounded-md checked:bg-primary checked:border-primary transition-colors"
                                checked={filters.inStock || false}
                                onChange={() => setFilters({ ...filters, inStock: !filters.inStock })}
                            />
                            <svg className="absolute w-3.5 h-3.5 text-white left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 12 10" fill="none">
                                <path d="M1 5L4.5 9L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span className="text-gray-600 group-hover:text-gray-900 transition-colors">✅ En Stock</span>
                    </label>
                </div>
            </FilterSection>
            {/* RAM (Mock for now) */}
            <FilterSection title="Mémoire RAM" isOpenDefault={false}>
                <div className="space-y-2">
                    {['8 GB', '16 GB', '32 GB', '64 GB'].map(ram => (
                        <label key={ram} className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative flex items-center">
                                <input type="checkbox" className="peer appearance-none w-5 h-5 border border-gray-300 rounded-md checked:bg-primary checked:border-primary transition-colors" />
                                <svg className="absolute w-3.5 h-3.5 text-white left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 12 10" fill="none">
                                    <path d="M1 5L4.5 9L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <span className="text-gray-600 group-hover:text-gray-900 transition-colors">{ram}</span>
                        </label>
                    ))}
                </div>
            </FilterSection>

            <button
                className="w-full mt-6 py-2 px-4 border border-gray-200 text-gray-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors text-sm"
                onClick={() => setFilters({ maxPrice: 30000, brands: [], states: [], promoOnly: false, inStock: false })}
            >
                Réinitialiser tout
            </button>
        </div >
    );
};

export default FilterSidebar;
