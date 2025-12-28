<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    // List all products
    public function index(Request $request)
    {
        $query = Product::with(['category', 'seller']);

        // Filter by Price
        if ($request->has('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        // Filter by State
        if ($request->has('states')) {
            $states = explode(',', $request->states);
            $query->whereIn('state', $states);
        }

        // Filter by Brand (Search in name)
        if ($request->has('brands')) {
            $brands = explode(',', $request->brands);
            $query->where(function ($q) use ($brands) {
                foreach ($brands as $brand) {
                    $q->orWhere('name', 'LIKE', "%{$brand}%");
                }
            });
        }

        // Filter by Category
        if ($request->has('category')) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        // Filter by Featured
        if ($request->has('featured')) {
            $query->where('is_featured', true);
        }

        // Filter by Promo
        if ($request->has('promo')) {
            $query->where('promo', '>', 0);
        }

        // Filter by Stock
        if ($request->has('in_stock')) {
            $query->where('stock', '>', 0);
        }

        // Global Search (Name or Description)
        if ($request->has('search') && !empty($request->search)) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'LIKE', "%{$searchTerm}%")
                  ->orWhere('description', 'LIKE', "%{$searchTerm}%")
                  ->orWhere('slug', 'LIKE', "%{$searchTerm}%");
            });
        }

        return response()->json($query->orderBy('created_at', 'desc')->paginate(100));
    }

    // Get single product details
    public function show($id)
    {
        $product = Product::with(['category', 'seller'])->findOrFail($id);
        return response()->json($product);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'category_id' => 'required|exists:categories,id',
                'price' => 'required|numeric',
                'stock' => 'required|integer',
                'image' => 'required|string',
                'description' => 'nullable|string',
                'state' => 'nullable|string',
                'is_featured' => 'nullable|boolean',
                'old_price' => 'nullable|numeric',
            ]);

            // Auto-generate slug if not provided
            if (!$request->has('slug')) {
                $validated['slug'] = \Illuminate\Support\Str::slug($validated['name']) . '-' . rand(100, 999);
            }

            $product = Product::create($validated);
            return response()->json($product, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Les données fournies sont invalides.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Une erreur est survenue lors de l\'enregistrement.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        $product->update($request->all());
        return response()->json($product);
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();
        return response()->json(['message' => 'Produit supprimé']);
    }
}
