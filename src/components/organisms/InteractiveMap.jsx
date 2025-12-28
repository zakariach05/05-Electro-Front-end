import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation } from 'lucide-react';
import { renderToString } from 'react-dom/server';

// Custom Marker Icons
const createCustomIcon = (type) => {
    const color = type === 'branch' ? '#2563eb' : '#10b981'; // Primary blue for branch, Green for relay
    const iconHtml = renderToString(
        <div style={{
            color: color,
            filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.3))',
            transform: 'translate(-50%, -100%)'
        }}>
            <MapPin size={32} fill={color} fillOpacity={0.2} strokeWidth={3} />
        </div>
    );

    return L.divIcon({
        html: iconHtml,
        className: 'custom-map-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
    });
};

// Component to handle map center/zoom changes
const ChangeView = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, zoom, {
                duration: 1.5,
                easeLinearity: 0.25
            });
        }
    }, [center, zoom, map]);
    return null;
};

const InteractiveMap = ({ locations, selectedCity, onCitySelect }) => {
    const mapRef = useRef();

    // Default center of Morocco
    const defaultCenter = [31.7917, -7.0926];
    const defaultZoom = 6;

    // Determine current center based on selected city (if any)
    const getActiveCenter = () => {
        if (!selectedCity) return defaultCenter;
        const cityLocs = locations.filter(l => l.city.toLowerCase() === selectedCity.toLowerCase());
        if (cityLocs.length > 0) {
            return [cityLocs[0].latitude, cityLocs[0].longitude];
        }
        return defaultCenter;
    };

    const activeCenter = getActiveCenter();
    const activeZoom = selectedCity ? 12 : defaultZoom;

    return (
        <div className="relative w-full h-[600px] rounded-[40px] overflow-hidden shadow-2xl border-4 border-white/5 group">
            <MapContainer
                center={defaultCenter}
                zoom={defaultZoom}
                style={{ height: '100%', width: '100%', background: '#f8fafc' }}
                zoomControl={false}
                ref={mapRef}
            >
                {/* Realistic Map Layer (Standard OpenStreetMap) */}
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                <ChangeView center={activeCenter} zoom={activeZoom} />

                {locations.filter(l => l.latitude && l.longitude).map((loc) => (
                    <Marker
                        key={loc.id}
                        position={[loc.latitude, loc.longitude]}
                        icon={createCustomIcon(loc.type)}
                        eventHandlers={{
                            click: () => onCitySelect(loc.city)
                        }}
                    >
                        <Popup className="premium-popup">
                            <div className="p-2 min-w-[200px]">
                                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-2 ${loc.type === 'branch' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                                    }`}>
                                    {loc.type === 'branch' ? 'Boutique Officielle' : 'Point Relais'}
                                </span>
                                <h3 className="text-sm font-black text-gray-900 mb-1 uppercase tracking-tight">{loc.name}</h3>
                                <p className="text-xs text-gray-500 font-medium mb-3">{loc.address}</p>
                                <button className="w-full py-2 bg-gray-900 text-white text-[10px] font-bold rounded-lg hover:bg-primary transition-all flex items-center justify-center gap-2">
                                    <Navigation size={12} /> Y ALLER
                                </button>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {/* Custom Controls UI (Overlay) */}
            <div className="absolute top-8 left-8 z-[1000] flex flex-col gap-2">
                <button
                    onClick={() => onCitySelect(null)}
                    className="p-3 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-2xl hover:bg-white/20 transition-all shadow-xl"
                >
                    <GlobeIcon size={20} />
                </button>
            </div>

            {/* City Selection Panel (Overlay) */}
            <div className="absolute top-8 right-8 z-[1000] space-y-2 pointer-events-none max-h-[85%] overflow-y-auto custom-scrollbar pr-2">
                {['Casablanca', 'Rabat', 'Marrakech', 'Tanger', 'Agadir'].map((city) => (
                    <button
                        key={city}
                        onClick={() => onCitySelect(city)}
                        className={`block w-44 p-3.5 rounded-[24px] border backdrop-blur-3xl transition-all pointer-events-auto transform hover:scale-105 text-left group/btn ${selectedCity === city
                                ? 'bg-premium-gradient text-white border-transparent shadow-2xl'
                                : 'bg-black/40 text-white/70 border-white/10 hover:bg-black/60 hover:text-white'
                            }`}
                    >
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-0.5">Ville</p>
                        <div className="flex justify-between items-center">
                            <span className="font-black text-base">{city}</span>
                            <ArrowRightIcon size={16} className={`transition-transform duration-500 ${selectedCity === city ? 'translate-x-0' : '-translate-x-2 opacity-0 group-hover/btn:translate-x-0 group-hover/btn:opacity-100'}`} />
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

const GlobeIcon = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>;
const ArrowRightIcon = ({ size, className }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>;

export default InteractiveMap;
