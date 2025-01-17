"use client";

import { useState, useEffect } from "react";
import Script from "next/script";
import { toast } from "react-hot-toast";

const SellWaste = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    wasteType: "plastic",
    quantity: "",
    price: "",
  });

  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]); // Holds Cloudinary URLs
  const [status, setStatus] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      setUserId(storedUserId);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openCloudinaryWidget = async () => {
    try {
      const response = await fetch("/user/api/generateSignature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          folder: "residential_waste_management",
          userId,
          uploadPreset: "okayish",
        }),
      });

      const { signature, timestamp } = await response.json();

      if (!(window as any).cloudinary) {
        alert("Cloudinary widget is not available");
        return;
      }

      const widget = (window as any).cloudinary.createUploadWidget(
        {
          cloudName: "dugx8scku",
          uploadPreset: "okayish",
          uploadSignature: signature,
          uploadSignatureTimestamp: timestamp,
          folder: "residential_waste_management",
          apiKey: "858892213842935",
          context: { custom: `userId=${userId}` },
          resourceType: "image",
        },
        (error: any, result: any) => {
          if (!error && result.event === "success") {
            console.log("Upload successful:", result.info);
            setUploadedFiles((prev) => [...prev, result.info.secure_url]);
          } else if (error) {
            console.error("Upload failed:", error);
          }
        }
      );

      widget.open();
    } catch (error) {
      console.error("Error opening Cloudinary widget:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.description ||
      !formData.location ||
      !formData.quantity ||
      !formData.price ||
      uploadedFiles.length === 0
    ) {
      setStatus("Please fill in all fields and upload an image.");
      return;
    }

    try {
      const response = await fetch("/user/api/market/sell", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          userId,
          fileUrls: uploadedFiles, // Include uploaded files
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("Listing created successfully!");
        toast.success("Listing created successfully!");
        setFormData({
          title: "",
          description: "",
          location: "",
          wasteType: "plastic",
          quantity: "",
          price: "",
        });
        setUploadedFiles([]);
      } else {
        setStatus(`Error: ${data.error}`);
      }
    } catch (error) {
      setStatus("Failed to create listing. Please try again later.");
    }
  };

  const removeImage = (indexToRemove: number) => {
    setUploadedFiles((files) =>
      files.filter((_, index) => index !== indexToRemove)
    );
  };

  return (
    <>
      <Script
        src="https://widget.cloudinary.com/v2.0/global/all.js"
        strategy="beforeInteractive"
      />

      <form
        onSubmit={handleSubmit}
        className="space-y-4 max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg"
      >
        <h1 className="text-2xl font-bold text-green-600">Sell Waste</h1>

        <div>
          <label className="block text-gray-700 font-medium">Title</label>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Description</label>
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Location</label>
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Waste Type</label>
          <select
            name="wasteType"
            value={formData.wasteType}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-md"
          >
            <option value="plastic">Plastic</option>
            <option value="metal">Metal</option>
            <option value="paper">Paper</option>
            <option value="electronic">Electronic</option>
            <option value="organic">Organic</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Quantity</label>
          <input
            type="text"
            name="quantity"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Price</label>
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">
            Upload Waste Image
          </label>
          <button
            type="button"
            onClick={openCloudinaryWidget}
            className="w-full mt-1 bg-blue-600 text-white font-medium py-2 rounded-md hover:bg-blue-700"
          >
            Upload File
          </button>

          <div className="mt-4 grid grid-cols-2 gap-4">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={file}
                  alt={`Uploaded waste ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white font-medium py-2 rounded-md hover:bg-green-700"
        >
          Create Listing
        </button>

        {status && (
          <p
            className={`mt-2 text-center text-sm ${
              status.includes("Error") || status.includes("Failed")
                ? "text-red-600"
                : "text-green-600"
            }`}
          >
            {status}
          </p>
        )}
      </form>
    </>
  );
};

export default SellWaste;
