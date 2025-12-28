import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
    const phoneNumber = "212522000000"; // Replace with real number
    const message = "Bonjour Electro-05, j'aimerais avoir plus d'informations sur vos produits.";

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 group flex items-center justify-center"
            aria-label="Contactez-nous sur WhatsApp"
        >
            <MessageCircle size={28} />
            <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-3 transition-all duration-500 ease-in-out whitespace-nowrap font-bold text-sm">
                Besoin d'aide ?
            </span>
        </a>
    );
};

export default WhatsAppButton;
