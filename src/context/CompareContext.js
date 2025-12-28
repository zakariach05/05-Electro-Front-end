import React, { createContext, useContext, useState } from 'react';

const CompareContext = createContext();

export const CompareProvider = ({ children }) => {
    const [compareItems, setCompareItems] = useState([]);

    const toggleCompare = (product) => {
        setCompareItems(prev => {
            const exists = prev.find(item => item.id === product.id);
            if (exists) {
                return prev.filter(item => item.id !== product.id);
            }
            if (prev.length >= 3) {
                alert("Vous ne pouvez comparer que 3 produits à la fois.");
                return prev;
            }
            return [...prev, product];
        });
    };

    const removeFromCompare = (id) => {
        setCompareItems(prev => prev.filter(item => item.id !== id));
    };

    const clearCompare = () => setCompareItems([]);

    return (
        <CompareContext.Provider value={{ compareItems, toggleCompare, removeFromCompare, clearCompare }}>
            {children}
        </CompareContext.Provider>
    );
};

export const useCompare = () => useContext(CompareContext);
