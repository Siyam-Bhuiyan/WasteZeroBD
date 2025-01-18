"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { ShoppingCart, Search, Filter, MapPin, Package, User } from "lucide-react";
import { useRouter } from "next/navigation";

interface WasteProduct {
  id: number;
  title: string;
  description: string;
  location: string;
  wasteType: string;
  price: number;
  seller: string;
  sellerEmail: string;
  imageUrl: string;
}

const BuyWaste = () => {
  const router = useRouter();
  const [wasteProducts, setWasteProducts] = useState<WasteProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cartItems, setCartItems] = useState<WasteProduct[]>([]);

  const fetchWasteProducts = async () => {
    try {
      const response = await fetch("/user/api/market/buy", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const data = await response.json();
        setWasteProducts(data);
      } else {
        toast.error("Failed to load products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Error fetching products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWasteProducts();

    // Load cart items from localStorage
    const savedCart = localStorage.getItem("cartItems");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  const filteredProducts = wasteProducts.filter(
    (product) =>
      (selectedCategory === "all" || product.wasteType === selectedCategory) &&
      (product.title?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  const addToCart = (product: WasteProduct) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
  
      if (existingItem) {
        // Increment the quantity if the item already exists in the cart
        const updatedItems = prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
        localStorage.setItem("cartItems", JSON.stringify(updatedItems));
        return updatedItems;
      }
  
      // Add the item with an initial quantity of 1 if it's not in the cart
      const newItems = [...prevItems, { ...product, quantity: 1 }];
      localStorage.setItem("cartItems", JSON.stringify(newItems));
      return newItems;
    });
  
    toast.success("Added to cart!");
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-gradient-to-r from-green-600 to-green-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold">EcoTrade Market</h1>
              <span className="ml-2 text-sm bg-green-500 px-3 py-1 rounded-full">Buyer Portal</span>
            </div>
            <div className="flex items-center space-x-6">
              <button className="flex items-center space-x-2 hover:text-green-200 transition-colors">
                <Package className="w-5 h-5" />
                <span>Orders</span>
              </button>
              <button className="flex items-center space-x-2 hover:text-green-200 transition-colors">
                <User className="w-5 h-5" />
                <span>Profile</span>
              </button>
              <button
                className="flex items-center space-x-2 hover:text-green-200 transition-colors"
                onClick={() => router.push("/user/market/cart")}
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Cart ({cartItems.length})</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search waste products..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="text-gray-400 w-5 h-5" />
              <select
                className="px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All</option>
                <option value="plastic">Plastic</option>
                <option value="metal">Metal</option>
                <option value="paper">Paper</option>
                <option value="electronic">Electronic</option>
                <option value="organic">Organic</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative">
                <img
                  src={product.imageUrl || "/placeholder.jpg"} // Use `imageUrl` directly
                  alt={product.title || "Product Image"}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 right-3">
                  <span className="px-3 py-1 bg-green-500 text-white text-sm rounded-full">
                    {product.wasteType}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{product.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{product.description}</p>
                <div className="space-y-2 text-gray-600">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Seller:</span>
                    <span>{product.seller}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Location:</span>
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {product.location}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-lg font-bold text-green-600">
                    <span>Price:</span>
                    <span>Tk.{product.price}/unit</span>
                  </div>
                </div>
                <button
                  onClick={() => addToCart(product)}
                  className="w-full mt-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyWaste;
