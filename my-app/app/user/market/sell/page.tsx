//sell
"use client";

import React, { useState, useEffect } from 'react';
import { ShoppingCart, Package, User, Search, Filter, Upload, Trash2, Edit2, MapPin } from 'lucide-react';
import { createWasteListing, getUserByEmail } from '@/utils/db/actions';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react';

const SellWaste = () => {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isCloudinaryReady, setIsCloudinaryReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session } = useSession();

  const [formData, setFormData] = useState({
    title: '',
    category: 'plastic',
    price: '',
    quantity: '',
    location: '',
    description: ''
  });

  const [myListings, setMyListings] = useState([
    { 
      id: 1, 
      name: 'Mixed Plastic Waste', 
      category: 'plastic', 
      price: '200', 
      quantity: '500 kg', 
      location: 'Mumbai',
      description: 'Clean sorted plastic waste',
      status: 'active',
      image: '/api/placeholder/300/200'
    },
    {
      id: 2,
      name: 'Scrap Metal Collection',
      category: 'metal',
      price: '350',
      quantity: '750 kg',
      location: 'Delhi',
      description: 'Mixed metal scrap',
      status: 'active',
      image: '/api/placeholder/300/200'
    }
  ]);

  const categories = ['all', 'plastic', 'metal', 'paper', 'electronic', 'organic'];

  // Initialize Cloudinary
  useEffect(() => {
    const loadCloudinary = () => {
      const script = document.createElement('script');
      script.src = 'https://upload-widget.cloudinary.com/global/all.js';
      script.async = true;
      script.onload = () => setIsCloudinaryReady(true);
      document.body.appendChild(script);
    };
    loadCloudinary();
  }, []);

  const openCloudinaryWidget = () => {
    if (!isCloudinaryReady) {
      toast.error('Image upload is still initializing. Please try again in a moment.');
      return;
    }

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: "dugx8scku",
        uploadPreset: "okayish",
        folder: "waste_management",
        multiple: false,
        sources: ['local', 'camera'],
        resourceType: "image",
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          setImageUrl(result.info.secure_url);
          toast.success('Image uploaded successfully!');
        }
      }
    );
    widget.open();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session) {
      toast.error('Please sign in to create a listing');
      return;
    }

    const user = await getUserByEmail(session.user.email);
    if (!user) {
      toast.error('User not found');
      return;
    }

    const listing = await createWasteListing(
      user.id,
      formData.title,
      formData.description,
      formData.location,
      formData.category,
      formData.quantity,
      parseInt(formData.price),
      imageUrl
    );

      setMyListings([newListing, ...myListings]);
      
if (listing) {
      toast.success('Listing created successfully!');
      setFormData({
        title: '',
        category: 'plastic',
        price: '',
        quantity: '',
        location: '',
        description: ''
      });
      setImageUrl('');
      
    } else {
      toast.error('Failed to create listing');
    }
  };

  const deleteListing = (id) => {
    setMyListings(myListings.filter(listing => listing.id !== id));
    toast.success('Listing deleted successfully');
  };

  const filteredListings = myListings.filter(listing => 
    (selectedCategory === 'all' || listing.category === selectedCategory) &&
    listing.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-gradient-to-r from-green-600 to-green-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold">EcoTrade Market</h1>
              <span className="ml-2 text-sm bg-green-500 px-3 py-1 rounded-full">Seller Portal</span>
            </div>
            <div className="flex items-center space-x-6">
              <button className="flex items-center space-x-2 hover:text-green-200 transition-colors">
                <Package className="w-5 h-5" />
                <span>My Listings</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Create New Listing Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Create New Listing</h2>
            <span className="text-sm text-gray-500">All fields are required</span>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Listing Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow"
                    placeholder="Enter a descriptive title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow"
                    required
                  >
                    {categories.filter(cat => cat !== 'all').map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-4 py-3 pl-10 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow"
                      placeholder="Enter your location"
                      required
                    />
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow"
                    placeholder="Enter price per unit"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                  <input
                    type="text"
                    value={formData.quantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow"
                    placeholder="e.g., 500 kg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image Upload</label>
                  <button
                    type="button"
                    onClick={openCloudinaryWidget}
                    className="w-full px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center justify-center space-x-2"
                    disabled={!isCloudinaryReady}
                  >
                    <Upload className="w-5 h-5" />
                    <span>{isCloudinaryReady ? 'Upload Image' : 'Loading...'}</span>
                  </button>
                  {imageUrl && (
                    <div className="mt-3">
                      <img src={imageUrl} alt="Upload preview" className="w-full h-40 object-cover rounded-xl" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow"
                rows={4}
                placeholder="Provide details about your waste material..."
                required
              />
            </div>

            <button 
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 disabled:from-gray-400 disabled:to-gray-500"
              disabled={isSubmitting || !imageUrl}
            >
              {isSubmitting ? 'Creating Listing...' : 'Create Listing'}
            </button>
          </form>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search your listings..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="text-gray-400 w-5 h-5" />
              <select
                className="px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* My Listings Grid */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">My Listings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map(listing => (
              <div key={listing.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative">
                  <img src={listing.image} alt={listing.name} className="w-full h-48 object-cover" />
                  <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 bg-green-500 text-white text-sm rounded-full">
                      {listing.status}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{listing.name}</h3>
                  <div className="space-y-2 text-gray-600">
                    <p className="flex items-center">
                      <span className="font-medium mr-2">Category:</span> {listing.category}
                    </p>
                    <p className="flex items-center">
                      <span className="font-medium mr-2">Quantity:</span> {listing.quantity}
                    </p>
                    <p className="flex items-center">
                    <span className="font-medium mr-2">Price:</span> ₹{listing.price}/unit
                    </p>
                    <p className="flex items-center">
                      <span className="font-medium mr-2">Location:</span> {listing.location}
                    </p>
                    <p className="text-sm mt-3">{listing.description}</p>
                  </div>
                  <div className="flex justify-end space-x-3 mt-4">
                    <button
                      onClick={() => {
                        setFormData({
                          title: listing.name,
                          category: listing.category,
                          price: listing.price,
                          quantity: listing.quantity,
                          location: listing.location,
                          description: listing.description
                        });
                        setImageUrl(listing.image);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => deleteListing(listing.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredListings.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No listings found matching your criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellWaste;