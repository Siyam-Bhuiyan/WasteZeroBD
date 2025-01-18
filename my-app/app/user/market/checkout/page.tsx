"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import axios, { AxiosResponse } from "axios";
import { toast } from "react-hot-toast";

const CheckoutForm = () => {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    setUserEmail(localStorage.getItem("userEmail"));
  }, []);

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSslCommerz = async (e: React.FormEvent) => {
    // Prevent the default form submission behavior
    e.preventDefault();

    setLoading(true);

    try {
        console.log(userEmail)
      const result: AxiosResponse<{ success: boolean; url: string }> = await axios.post(
        "/user/api/sslcommerz-intent/sslcommerz/market",
        {
          amount: 500,
          userEmail: userEmail,
          userName: "bhuiyan",
          type: "buySell",
        }
      );

      if (result.data.success && result.data.url) {
        window.location.href = result.data.url;
      } else {
        toast.error("Something went wrong during the payment initiation.");
      }
    } catch (error: any) {
      console.error("Error during payment:", error);
      toast.error(error.response?.data?.message || "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <button
          onClick={() => router.back()}
          className="flex items-center text-green-600 hover:text-green-700 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Cart
        </button>

        <Card className="p-6">
          <div className="flex items-center mb-8">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-600 text-white" />
              <span className="ml-2">Information</span>
            </div>
          </div>

          <form onSubmit={handleSslCommerz}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className={`w-full mt-6 py-2 rounded-lg text-white transition-colors ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
              }`}
              disabled={loading}
            >
              {loading ? "Processing..." : "Confirm Order"}
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CheckoutForm;
