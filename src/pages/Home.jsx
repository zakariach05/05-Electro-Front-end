import React, { useEffect, useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import ProductCard from '../components/molecules/ProductCard';
import { ArrowRight, MapPin } from 'lucide-react';
import BrandsMarquee from '../components/molecules/BrandsMarquee';
import { CATEGORIES } from '../data/categories';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../services/api';
import DealOfTheDay from '../components/molecules/DealOfTheDay';
import SmartAssistant from '../components/organisms/SmartAssistant';
import SEO from '../components/atoms/SEO';
import Loader from '../components/atoms/Loader';
import InteractiveHero from '../components/organisms/InteractiveHero';
import BackToTop from '../components/atoms/BackToTop';
import InteractiveMap from '../components/organisms/InteractiveMap';
import { useLanguage } from '../context/LanguageContext';

const Home = () => {
    const [allProducts, setAllProducts] = useState([]);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [locations, setLocations] = useState([]);
    const [selectedCity, setSelectedCity] = useState(null);
    const [loading, setLoading] = useState(true);
    const { t } = useLanguage();

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                const [productsRes, locationsRes] = await Promise.all([
                    axios.get(`${API_URL}/products`),
                    axios.get(`${API_URL}/locations`)
                ]);

                const products = productsRes.data.data || productsRes.data;
                setAllProducts(products); // Store all products for the hero
                setFeaturedProducts(products.slice(0, 6));
                setLocations(locationsRes.data);
            } catch (error) {
                console.error("Error fetching home data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHomeData();
    }, []);

    return (
        <MainLayout>
            <SEO
                title={t('nav.home')}
                description="Découvrez Electro-05, votre boutique high-tech de confiance au Maroc. Smartphones, PC, Gaming et produits reconditionnés au meilleur prix."
            />

            {/* Hero Section */}
            {!loading && <InteractiveHero products={allProducts} />}
            {/* Back to top button (présent juste après le hero) */}
            {!loading && <BackToTop />}

            {/* Categories Section */}
            <section id="categories" className="py-24 bg-gray-50 dark:bg-gray-900/50 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16 space-y-4">
                        <span className="text-secondary font-bold tracking-widest uppercase text-sm">Exploration</span>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Nos Univers</h2>
                        <div className="w-20 h-1.5 bg-premium-gradient mx-auto rounded-full"></div>
                        <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg font-medium">
                            Explorez nos catégories phares conçues pour répondre à tous vos besoins numériques.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {CATEGORIES.slice(0, 4).map((cat) => (
                            <Link
                                key={cat.id}
                                to={cat.path}
                                className="group relative h-64 rounded-3xl overflow-hidden bg-white dark:bg-gray-800 shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 dark:border-white/5"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900"></div>
                                <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-secondary/20 rounded-full group-hover:scale-[10] transition-transform duration-700 ease-in-out"></div>
                                <div className="relative h-full flex flex-col items-center justify-center p-6 text-center z-10">
                                    <div className="w-16 h-16 rounded-2xl bg-white dark:bg-gray-700 shadow-md flex items-center justify-center mb-4 text-gray-400 dark:text-gray-300 group-hover:text-primary dark:group-hover:text-secondary group-hover:scale-110 transition-all duration-300">
                                        <cat.icon size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-white transition-colors duration-300">{cat.name}</h3>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-12 text-center lg:hidden">
                        <Link to="/shop/all" className="inline-flex items-center gap-2 font-bold text-primary dark:text-secondary">
                            Voir tout <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </section>

            <DealOfTheDay />

            {/* Featured Products */}
            <section className="py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16 space-y-4">
                        <span className="text-secondary font-bold tracking-widest uppercase text-sm">Sélection Exclusive</span>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white uppercase tracking-tighter">Les Pépites du Moment</h2>
                        <div className="w-20 h-1.5 bg-premium-gradient mx-auto rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                        {loading ? (
                            <div className="col-span-full flex justify-center py-20">
                                <Loader />
                            </div>
                        ) : (
                            featuredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))
                        )}
                    </div>

                    <div className="mt-16 text-center">
                        <Link
                            to="/shop/all"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-gray-900 dark:bg-gray-800 text-white rounded-full font-bold hover:bg-premium-gradient transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                        >
                            Voir tous les produits <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </section>

            <BrandsMarquee />

            {/* Large Branches Map Section */}
            <section className="py-24 bg-gray-900 overflow-hidden relative">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/10 blur-[120px] rounded-full -mr-64 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full -ml-64 -mb-32"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16 space-y-4">
                        <span className="text-secondary font-black tracking-[0.2em] uppercase text-xs">Notre Réseau National</span>
                        <h2 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tighter uppercase">
                            Plus proche de <span className="text-transparent bg-clip-text bg-premium-gradient">vous partout</span> au Maroc
                        </h2>
                        <div className="w-20 h-1.5 bg-premium-gradient mx-auto rounded-full"></div>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-16 items-center">
                        <div className="lg:col-span-5 text-white space-y-8">
                            <div className="space-y-6">
                                <div
                                    onClick={() => setSelectedCity('Casablanca')}
                                    className={`flex items-start gap-4 p-6 border rounded-[32px] backdrop-blur-md transition-all cursor-pointer ${selectedCity === 'Casablanca' ? 'bg-primary/20 border-primary' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                                >
                                    <div className="w-12 h-12 bg-premium-gradient rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                                        <MapPin className="text-white" size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-1">Nos Boutiques Officielles</h4>
                                        <p className="text-gray-400 font-medium">3 Branches à Casablanca : Anfa, Maârif, Ain Diab.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-6 bg-white/5 border border-white/10 rounded-[32px] backdrop-blur-md hover:bg-white/10 transition-colors">
                                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                                        <ArrowRight className="text-secondary" size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-1">Points Relais Maroc</h4>
                                        <p className="text-gray-400 font-medium">Rabat, Marrakech et 30+ points de retrait.</p>
                                    </div>
                                </div>
                            </div>

                            <Link
                                to="/contact"
                                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-gray-900 rounded-full font-bold hover:bg-secondary transition-all shadow-xl group"
                            >
                                Contactez-nous <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        <div className="lg:col-span-7">
                            <InteractiveMap
                                locations={locations}
                                selectedCity={selectedCity}
                                onCitySelect={setSelectedCity}
                            />
                        </div>
                    </div>
                </div>
            </section>

            <SmartAssistant />
        </MainLayout>
    );
};

export default Home;
