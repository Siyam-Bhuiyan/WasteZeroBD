"use client";
import React, { useState } from 'react';
import { Alert, AlertDescription, Calendar, Phone, Trash2, Clock, MapPin, Info, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import ResidentialServiceForm from '@/app/user/residential/ResidentialServiceForm';

export default function ResidentialPage() {
  const [formStatus, setFormStatus] = useState('idle');

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Compact Hero Section */}
      <div className="relative bg-gradient-to-r from-green-600 to-green-700 text-white py-6">
        <div className="absolute inset-0 bg-black opacity-10 pattern-grid-lg"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center justify-center gap-4 sm:gap-6">
            <div className="p-2 bg-white/10 rounded-full backdrop-blur-sm">
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Residential Waste Collection
              </h1>
              <p className="text-sm sm:text-base text-green-50">
                Professional and eco-conscious waste management services for your home
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left Column - Service Request Form */}
          <div className="lg:w-2/3">
            <Card className="bg-white shadow-xl rounded-xl overflow-hidden border-0">
              <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white p-8">
                <CardTitle className="text-3xl font-bold text-gray-800">
                  Request Collection Service
                </CardTitle>
                <p className="text-gray-600 text-lg mt-2">
                  Schedule your waste collection service with our easy-to-use form. 
                  We'll confirm your booking within 24 hours.
                </p>
              </CardHeader>
              <CardContent className="p-10 space-y-10">
                {/* Service Description */}
                <div className="bg-gray-50/50 p-6 rounded-2xl">
                  <label className="block text-base font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <Info className="h-5 w-5 text-green-600" />
                    Service Description
                  </label>
                  <textarea
                    rows={4}
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
                    placeholder="Describe the waste collection service you need... (e.g., household waste, garden waste, bulk items)"
                  />
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Preferred Date */}
                  <div className="bg-gray-50/50 p-6 rounded-2xl">
                    <label className="block text-base font-medium text-gray-700 mb-3 flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-green-600" />
                      Preferred Collection Date
                    </label>
                    <input
                      type="date"
                      className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
                    />
                  </div>

                  {/* Contact Number */}
                  <div className="bg-gray-50/50 p-6 rounded-2xl">
                    <label className="block text-base font-medium text-gray-700 mb-3 flex items-center gap-2">
                      <Phone className="h-5 w-5 text-green-600" />
                      Contact Number
                    </label>
                    <input
                      type="tel"
                      className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
                      placeholder="Enter your contact number"
                    />
                  </div>
                </div>

                {/* Estimated Cost */}
                <div className="bg-gray-50/50 p-6 rounded-2xl">
                  <label className="block text-base font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <div className="h-5 w-5 text-green-600 flex items-center justify-center font-bold">$</div>
                    Estimated Cost
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      className="w-full p-4 pl-8 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
                      placeholder="Enter estimated cost"
                    />
                  </div>
                </div>

                {/* Status Alerts */}
                {formStatus === 'success' && (
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <AlertDescription className="text-green-700">
                      Your service request has been submitted successfully!
                    </AlertDescription>
                  </Alert>
                )}

                {/* Service Form Component */}
                <ResidentialServiceForm />

              </CardContent>
            </Card>
          </div>

          {/* Right Column - Information Cards */}
          <div className="lg:w-1/3 space-y-8">
            <Card className="bg-white shadow-xl rounded-xl overflow-hidden border-0">
              <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white p-6">
                <CardTitle className="text-2xl font-bold text-gray-800">
                  Service Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                {/* Service Hours Card */}
                <div className="group bg-gradient-to-br from-green-50 to-white p-6 rounded-xl border border-green-100 hover:shadow-lg transition-all duration-300">
                  <h3 className="text-xl font-semibold text-green-800 mb-4 flex items-center gap-2">
                    <Clock className="h-6 w-6 text-green-600" />
                    Service Hours
                  </h3>
                  <div className="space-y-3 text-green-700">
                    <p className="flex justify-between items-center">
                      <span>Monday - Friday</span>
                      <span className="font-medium">8:00 AM - 6:00 PM</span>
                    </p>
                    <p className="flex justify-between items-center">
                      <span>Saturday</span>
                      <span className="font-medium">9:00 AM - 4:00 PM</span>
                    </p>
                    <p className="flex justify-between items-center text-green-600">
                      <span>Sunday</span>
                      <span className="font-medium">Closed</span>
                    </p>
                  </div>
                </div>

                {/* Emergency Contact Card */}
                <div className="group bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-blue-100 hover:shadow-lg transition-all duration-300">
                  <h3 className="text-xl font-semibold text-blue-800 mb-4 flex items-center gap-2">
                    <Phone className="h-6 w-6 text-blue-600" />
                    24/7 Support
                  </h3>
                  <div className="space-y-4 text-blue-700">
                    <p className="flex items-center gap-3">
                      <Phone className="h-5 w-5" />
                      <span className="font-medium">(555) 123-4567</span>
                    </p>
                    <p className="flex items-center gap-3">
                      <AlertCircle className="h-5 w-5" />
                      <span>Emergency Response Available</span>
                    </p>
                    <p className="text-sm text-blue-600 mt-2">
                      Email: support@waste-service.com
                    </p>
                  </div>
                </div>

                {/* Service Area Card */}
                <div className="group bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <MapPin className="h-6 w-6 text-gray-600" />
                    Coverage Areas
                  </h3>
                  <div className="space-y-3 text-gray-700">
                    <p className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      Dhanmondi
                    </p>
                    <p className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      Mohammadpur
                    </p>
                    <p className="text-sm text-gray-600 mt-4">
                      We currently serve limited areas only.
                      Contact us to verify service availability in your area.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}