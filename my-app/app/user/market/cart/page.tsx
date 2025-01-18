"use client";

import React, { useState, useEffect } from "react";
import { Trash2, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

// Define the TypeScript type for cart items
interface CartItem {
  id: number;
  title: string;
  description: string;
  location: string;
  wasteType: string;
  price: number;
  quantity: number;
  seller: string;
  sellerEmail: string;
  imageUrl: string;
}

const Cart = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState<CartItem[]>([]);

  // Fetch all waste listings from the backend
  const fetchListings = async () => {
    try {
      const response = await fetch("/user/api/market/buy", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const data = await response.json();
        setListings(data);
      } else {
        console.error("Failed to fetch listings");
        toast.error("Failed to fetch listings");
      }
    } catch (error) {
      console.error("Error fetching listings:", error);
      toast.error("Error fetching listings");
    }
  };

  // Sync cart items from localStorage and decorate with listing details
  useEffect(() => {
    const savedCart = localStorage.getItem("cartItems");
    if (savedCart) {
      const cart = JSON.parse(savedCart) as CartItem[];
      setCartItems(cart);
    }
    fetchListings().finally(() => setLoading(false));
  }, []);

  const getDecoratedCartItems = () => {
    return cartItems.map((cartItem) => {
      const matchedListing = listings.find((listing) => listing.id === cartItem.id);
      return matchedListing
        ? { ...cartItem, imageUrl: matchedListing.imageUrl || "/placeholder.jpg" }
        : cartItem; // Fallback to cart item if listing not found
    });
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    const updatedCart = cartItems.map((item) =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
  };

  const removeItem = (productId: number) => {
    const updatedCart = cartItems.filter((item) => item.id !== productId);
    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  const decoratedCartItems = getDecoratedCartItems();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <button
            onClick={() => router.push("/market/buy")}
            className="flex items-center text-green-600 hover:text-green-700"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Shopping
          </button>
        </div>

        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        {decoratedCartItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">Your cart is empty</p>
            <button
              onClick={() => router.push("/market/buy")}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {decoratedCartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-md p-6 mb-4"
                >
                  <div className="flex items-center">
                    <img
                      src={item.imageUrl || "/placeholder.jpg"} // Use `imageUrl` directly
                      alt={item.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="ml-6 flex-grow">
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                      <p className="text-gray-600">Category: {item.wasteType}</p>
                      <p className="text-green-600 font-semibold">
                        ₹{item.price}/unit
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="bg-gray-200 px-3 py-1 rounded-lg"
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="bg-gray-200 px-3 py-1 rounded-lg"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <div className="space-y-4">
                  {decoratedCartItems.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span>
                        {item.title} (x{item.quantity})
                      </span>
                      <span>Tk{item.price * item.quantity}</span>
                    </div>
                  ))}
                  <div className="border-t pt-4">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>Tk.{calculateTotal()}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => router.push("/user/market/checkout")}
                  className="w-full mt-6 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
