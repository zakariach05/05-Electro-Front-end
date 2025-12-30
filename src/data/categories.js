import { Smartphone, Laptop, Gamepad2, Headphones, Home, Watch } from 'lucide-react';

export const CATEGORIES = [
    {
        id: 'smartphones',
        name: 'Smartphones',
        path: '/shop/smartphones',
        icon: Smartphone,
        subcategories: [
            { name: 'iPhone', path: '/shop/smartphones/iphone' },
            { name: 'Samsung', path: '/shop/smartphones/samsung' },
            { name: 'Xiaomi', path: '/shop/smartphones/xiaomi' },
            { name: 'Oppo', path: '/shop/smartphones/oppo' },
        ],
        featured: [
            { name: 'iPhone 15 Pro', image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=500&auto=format&fit=crop', price: '13,990 DH' },
            { name: 'Samsung S24 Ultra', image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=500&auto=format&fit=crop', price: '14,500 DH' }
        ]
    },
    {
        id: 'pc-mac',
        name: 'PC & Mac',
        path: '/shop/pc-mac',
        icon: Laptop,
        subcategories: [
            { name: 'MacBook Pro', path: '/shop/pc-mac/macbook-pro' },
            { name: 'MacBook Air', path: '/shop/pc-mac/macbook-air' },
            { name: 'PC Gamer', path: '/shop/pc-mac/pc-gamer' },
            { name: 'Bureautique', path: '/shop/pc-mac/office' },
        ],
        featured: [
            { name: 'MacBook Air M2', image: 'https://images.unsplash.com/photo-1517336714467-d23784a1a821?q=80&w=500&auto=format&fit=crop', price: '11,490 DH' }
        ]
    },
    {
        id: 'gaming',
        name: 'Gaming',
        path: '/shop/gaming',
        icon: Gamepad2,
        subcategories: [
            { name: 'PlayStation 5', path: '/shop/gaming/ps5' },
            { name: 'Xbox Series X', path: '/shop/gaming/xbox' },
            { name: 'Nintendo Switch', path: '/shop/gaming/nintendo' },
            { name: 'Accessoires', path: '/shop/gaming/accessories' },
        ],
        featured: [
            { name: 'PS5 Slim', image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=500&auto=format&fit=crop', price: '5,500 DH' }
        ]
    },
    {
        id: 'accessories',
        name: 'Accessoires',
        path: '/shop/accessories',
        icon: Headphones,
        subcategories: [
            { name: 'Audio (Casques/Écouteurs)', path: '/shop/accessories/audio' },
            { name: 'Montres Connectées', path: '/shop/accessories/smartwatches' },
            { name: 'Chargeurs & Câbles', path: '/shop/accessories/charging' },
            { name: 'Protection', path: '/shop/accessories/cases' },
        ],
        featured: []
    },
    {
        id: 'tv',
        name: 'TV & Son',
        path: '/shop/tv',
        icon: Home, // Using Home as placeholder or TV if available
        subcategories: [
            { name: 'Samsung', path: '/shop/tv/samsung' },
            { name: 'LG', path: '/shop/tv/lg' },
            { name: 'Sony', path: '/shop/tv/sony' },
        ],
        featured: []
    },
    {
        id: 'tablets',
        name: 'Tablettes',
        path: '/shop/tablets',
        icon: Smartphone, // Using Smartphone as placeholder
        subcategories: [
            { name: 'iPad', path: '/shop/tablets/ipad' },
            { name: 'Samsung Tab', path: '/shop/tablets/samsung' },
            { name: 'Lenovo', path: '/shop/tablets/lenovo' },
        ],
        featured: []
    },
    {
        id: 'smart-home',
        name: 'Domotique',
        path: '/shop/smart-home',
        icon: Home,
        subcategories: [
            { name: 'Caméras', path: '/shop/smart-home/cameras' },
            { name: 'Lumières Connectées', path: '/shop/smart-home/lighting' },
            { name: 'Assistants Vocaux', path: '/shop/smart-home/assistants' },
        ],
        featured: []
    }
];
