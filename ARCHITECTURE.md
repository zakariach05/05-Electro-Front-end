# Architecture du Projet Electro-05

## 1. Vue d'Ensemble
Le projet **Electro-05** est une plateforme e-commerce premium (Dropshipping / Retail) architecturée en **Headless Commerce**.
Il sépare strictement le **Frontend** (React.js) du **Backend** (Laravel API), assurant performance, sécurité et scalabilité.

### Technologies Clés
*   **Frontend**: React 19, TailwindCSS 3/4, GSAP (Animations), Three.js (3D), Anime.js.
*   **Backend**: Laravel 10/11, MySQL, REST API (Sanctum Auth).
*   **Infrastructure**: Déploiement séparé possible (Vercel + VPS/Forge).

---

## 2. Arborescence Frontend (Recommandée)
Le dossier `frontend` (actuellement `Frond-end/test`) doit suivre cette structure modulaire :

```
frontend/
├── public/                 # Assets statiques (favicons, manifest)
├── src/
│   ├── assets/             # Images, fonts, vidéos locales
│   │   ├── images/
│   │   └── fonts/
│   ├── components/         # Composants réutilisables (Atomic Design)
│   │   ├── atoms/          # Boutons, Inputs, Labels
│   │   ├── molecules/      # Cartes produit, SearchBar
│   │   └── organisms/      # Navbar, Footer, HeroSection
│   ├── context/            # React Context (AuthContext, CartContext)
│   ├── hooks/              # Custom Hooks (useProduct, useCart)
│   ├── layouts/            # Layouts globaux (MainLayout, AuthLayout)
│   ├── pages/              # Pages complètes (Home, Shop, ProductDetails)
│   ├── services/           # Services API (api.js, authService.js)
│   ├── styles/             # Styles globaux (index.css, variables GSAP)
│   └── utils/              # Fonctions utilitaires (formatPrice, validators)
├── App.js                  # Point d'entrée principal (Routing)
├── index.css               # Tailwind imports
└── setupTests.js
```

## 3. Arborescence Backend (Recommandée)
Le dossier `backend` (actuellement `Back-End/test`) suit l'architecture MVC Laravel optimisée API :

```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/    # API Controllers (Api/ProductController)
│   │   ├── Middleware/     # Auth, Admin check, Cors
│   │   ├── Requests/       # FormRequests (Validation)
│   │   └── Resources/      # API Resources (JSON formatting)
│   ├── Models/             # Eloquent Models (Product, Order, User)
│   └── Services/           # Business Logic (OrderService, PaymentService)
├── config/                 # Configuration (cors.php, sanctum.php)
├── database/
│   ├── migrations/         # Schéma BDD
│   └── seeders/            # Données de test
├── routes/
│   ├── api.php             # Routes API REST
│   └── web.php             # (Inutilisé ou pour tests)
└── storage/                # Factures PDF, uploads images
```

## 4. Base de Données (Schema Simplifié)
*   **users**: id, name, email, password, role, ...
*   **products**: id, name, slug, price, sale_price, stock, specs (JSON), category_id, ...
*   **categories**: id, name, parent_id, ...
*   **orders**: id, user_id, total, status, payment_method, ...
*   **order_items**: id, order_id, product_id, quantity, price, ...
*   **reviews**: id, product_id, user_id, rating, comment, ...

## 5. Flux de Données & Sécurité
*   **Auth**: Laravel Sanctum (SPA Authentication).
*   **API**: RESTful standard.
*   **Security**: CORS restreint au domaine frontend, Rate Limiting, Validation stricte.
*   **Performance**: Lazy loading React, Eager loading Laravel, Images optimisées (WebP).
