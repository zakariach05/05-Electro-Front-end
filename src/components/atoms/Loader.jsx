import React from 'react';

const Loader = () => {
    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <div className="relative w-16 h-16">
                {/* Outer Ring */}
                <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                {/* Spinning Gradient Ring */}
                <div className="absolute inset-0 border-4 border-t-secondary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>

                {/* Inner Pulse */}
                <div className="absolute inset-0 m-auto w-8 h-8 bg-gray-900 rounded-full animate-pulse flex items-center justify-center">
                    <span className="text-[10px] text-white font-bold">05</span>
                </div>
            </div>
            <p className="text-sm font-medium text-gray-500 animate-pulse tracking-widest uppercase">Chargement</p>
        </div>
    );
};

export default Loader;
