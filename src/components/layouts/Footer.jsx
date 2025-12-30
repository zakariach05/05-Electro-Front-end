import React from 'react';
import { Facebook, Instagram, Twitter, Youtube, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { getImageUrl } from '../../services/image';

const Footer = () => {
    const { t } = useLanguage();

    return (
        <footer className="bg-[#111827] text-white pt-20 pb-10 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16 border-b border-gray-800 pb-16">

                    {/* Brand Column */}
                    <div className="lg:col-span-4 space-y-6">
                        <Link to="/" className="inline-flex items-center gap-2 group">
                            <img
                                src="/Logo.png"
                                alt={t('hero.title')}
                                className="h-8 md:h-10 lg:h-12 w-auto"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    const txt = e.target.nextSibling;
                                    if (txt) txt.style.display = 'inline-block';
                                }}
                            />
                            <span className="ml-2 font-bold text-white hidden" aria-hidden>
                                5 Electro
                            </span>
                        </Link>
                        <p className="text-gray-400 leading-relaxed text-sm">
                            {t('hero.desc')}
                        </p>
                        <div className="flex gap-4 pt-2">
                            {[Facebook, Instagram, Twitter, Youtube].map((Icon, idx) => (
                                <a key={idx} href="h" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-premium-gradient hover:text-white transition-all duration-300 hover:-translate-y-1">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="lg:col-span-2 lg:col-start-6 space-y-6">
                        <h4 className="text-lg font-bold text-white">Navigation</h4>
                        <ul className="space-y-3">
                            {['Accueil', 'Boutique', 'Nouveautés', 'Promotions', 'Contact'].map((item) => (
                                <li key={item}>
                                    <Link to={item === 'Contact' ? '/contact' : '/'} className="text-gray-400 hover:text-secondary transition-colors text-sm hover:pl-1 block">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div className="lg:col-span-2 space-y-6">
                        <h4 className="text-lg font-bold text-white">Client</h4>
                        <ul className="space-y-3">
                            {['Mon Compte', 'Suivre ma commande', 'FAQ', 'Politique de retour', 'Conditions générales'].map((item) => (
                                <li key={item}>
                                    <Link to="/" className="text-gray-400 hover:text-secondary transition-colors text-sm hover:pl-1 block">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="lg:col-span-3 space-y-6">
                        <h4 className="text-lg font-bold text-white">Contact</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-gray-400 text-sm">
                                <MapPin className="flex-shrink-0 text-primary mt-1" size={18} />
                                <span>123 Boulevard Zerktouni,<br />Casablanca, Maroc</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-400 text-sm">
                                <Phone className="flex-shrink-0 text-primary" size={18} />
                                <span>+212 5 22 00 00 00</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-400 text-sm">
                                <Mail className="flex-shrink-0 text-primary" size={18} />
                                <span>contact@electro-05.ma</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Newsletter & Copyright */}
                <div className="flex flex-col items-center gap-6">
                    <div className="flex items-center gap-4">
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                            alt="Visa"
                            className="h-6 md:h-8 w-auto object-contain bg-white rounded-md p-1"
                        />
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                            alt="Mastercard"
                            className="h-6 md:h-8 w-auto object-contain bg-white rounded-md p-1"
                        />
                        <img
                            src={getImageUrl('cmi.png')}
                            alt="CMI Paiement"
                            className="h-8 md:h-10 w-auto object-contain bg-white rounded-md p-1"
                        />
                    </div>
                    <p className="text-gray-500 text-sm">
                        &copy; 2026 {t('hero.title')}. Tous droits réservés.
                    </p>
                </div>
            </div>
        </footer>
    );
};
export default Footer;
