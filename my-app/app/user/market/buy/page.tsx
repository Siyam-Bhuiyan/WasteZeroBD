"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { ShoppingCart, Search, Filter } from "lucide-react";

const BuyWaste = () => {
  const [wasteProducts, setWasteProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

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
  }, []);

  const filteredProducts = wasteProducts.filter(
    (product) =>
      (selectedCategory === "all" || product.wasteType === selectedCategory) &&
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Buy Waste</h1>

      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search waste products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center mt-4 md:mt-0">
          <Filter className="text-gray-400 w-5 h-5 mr-2" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500"
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

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
          >
            <img
              src={product.imageUrl || "/placeholder.jpg"} // Placeholder image for listings without images
              alt={product.title}
              className="w-full h-48 object-cover rounded-lg"
            />
            <div className="mt-4">
              <h2 className="text-lg font-semibold">{product.title}</h2>
              <p className="text-sm text-gray-600">{product.description}</p>
              <p className="text-sm text-gray-600">
                Location: {product.location}
              </p>
              <p className="text-sm text-gray-600">
                Category: {product.wasteType}
              </p>
              <p className="text-lg font-bold text-green-600 mt-2">
                ₹{product.price}/unit
              </p>
              <button
                onClick={() => toast.success("Added to cart!")}
                className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
              >
                <ShoppingCart className="w-5 h-5 inline mr-2" />
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No products found matching your criteria
          </p>
        </div>
      )}
    </div>
  );
};

export default BuyWaste;
