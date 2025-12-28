# Documentation de la Base de Données - Electro-05

Ce document décrit la structure des tables MySQL nécessaires au bon fonctionnement de la plateforme e-commerce Electro-05.

## 1. Table `categories`
Stocke les catégories de produits (ex: Smartphones, Laptops).

| Colonne | Type | Description |
| :--- | :--- | :--- |
| `id` | BIGINT (PK) | Identifiant unique. |
| `name` | VARCHAR(255) | Nom de la catégorie (ex: Laptops). |
| `slug` | VARCHAR(255) | Identifiant URL unique (ex: laptops). |
| `image` | VARCHAR(255) | Chemin de l'icône ou de l'image (Nullable). |
| `created_at` | TIMESTAMP | Date de création. |

## 2. Table `products`
Table principale contenant les détails des articles en vente.

| Colonne | Type | Description |
| :--- | :--- | :--- |
| `id` | BIGINT (PK) | Identifiant unique. |
| `category_id` | BIGINT (FK) | Référence à la catégorie (Cascade delete). |
| `name` | VARCHAR(255) | Nom du produit. |
| `slug` | VARCHAR(255) | Identifiant URL unique (Unique). |
| `description` | TEXT | Description détaillée (Nullable). |
| `price` | DECIMAL(10,2) | Prix actuel. |
| `old_price` | DECIMAL(10,2) | Prix avant promotion (Nullable). |
| `promo` | INT | Pourcentage de réduction (ex: 15) (Nullable). |
| `stock` | INT | Quantité disponible (Default: 0). |
| `state` | ENUM | État du produit ('neuf', 'occasion'). |
| `image` | VARCHAR(255) | Image principale (Nullable). |
| `images` | JSON | Liste des images secondaires (Nullable). |
| `is_featured` | BOOLEAN | Afficher en "Vedette" (Default: false). |
| `created_at` | TIMESTAMP | Date de mise en ligne. |

## 3. Table `orders`
Enregistre les commandes passées par les clients.

| Colonne | Type | Description |
| :--- | :--- | :--- |
| `id` | BIGINT (PK) | Numéro de commande unique. |
| `customer_name` | VARCHAR(255) | Nom complet du client. |
| `customer_email` | VARCHAR(255) | Email du client. |
| `customer_phone`| VARCHAR(20) | Téléphone pour la livraison. |
| `customer_city` | VARCHAR(100) | Ville. |
| `customer_address`| TEXT | Adresse complète. |
| `total_amount` | DECIMAL(10,2) | Montant total. |
| `status` | VARCHAR(255) | 'pending', 'processing', 'completed', 'cancelled'. |
| `payment_method` | VARCHAR(255) | 'cod' (Cash on Delivery), etc. |
| `acompte_paid` | BOOLEAN | Si l'acompte de 100DH a été réglé. |
| `created_at` | TIMESTAMP | Date de la commande. |

## 4. Table `order_items`
Détails des produits à l'intérieur d'une commande (Relation Many-to-Many).

| Colonne | Type | Description |
| :--- | :--- | :--- |
| `id` | BIGINT (PK) | Identifiant de ligne. |
| `order_id` | BIGINT (FK) | Référence à la commande. |
| `product_id` | BIGINT (FK) | Référence au produit. |
| `quantity` | INT | Quantité achetée. |
| `price` | DECIMAL(10,2) | Prix unitaire au moment de l'achat. |

## 5. Table `users` (Authentification)
Gestion des accès administrateurs et vendeurs.

| Colonne | Type | Description |
| :--- | :--- | :--- |
| `id` | BIGINT (PK) | ID utilisateur. |
| `name` | VARCHAR(255) | Nom de l'utilisateur. |
| `email` | VARCHAR(255) | Email (Login). |
| `password` | VARCHAR(255) | Mot de passe (Hashé). |
| `role` | VARCHAR(50) | 'admin', 'vendor', 'customer'. |

---

### Commandes MySQL pour la création rapide (Laravel)
Si vous utilisez Laravel, exécutez simplement :
```bash
php artisan migrate
```
Les migrations ont déjà été configurées dans le dossier `database/migrations/` pour correspondre à cette structure.
