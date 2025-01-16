'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';

export default function ResidentialServiceForm() {
  const [location, setLocation] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserId = localStorage.getItem('userId');
      setUserId(storedUserId);
    }
  }, []);

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
          folder: "residential_waste_management", // Override folder
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


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!location || uploadedFiles.length === 0) {
      setStatus('Please fill in all fields and upload an image.');
      return;
    }

    try {
      const response = await fetch('/user/api/residential/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location,
          fileUrls: uploadedFiles,
          userId, // Include the authenticated user ID
        }),
      });

      const data = await response.json();
      console.log(data)
      if (response.ok) {
        setStatus('Service requested successfully!');
      } else {
        setStatus(`Error: ${data.error}`);
      }
    } catch (error) {
      setStatus('Failed to request service. Please try again later.');
    }
  };

  const removeImage = (indexToRemove: number) => {
    setUploadedFiles((files) => files.filter((_, index) => index !== indexToRemove));
  };

  return (
    <>
      <Script src="https://widget.cloudinary.com/v2.0/global/all.js" strategy="beforeInteractive" />

      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-2xl font-semibold text-green-600">Request a Residential Service</h2>

        <div>
          <label className="block text-gray-700 font-medium">Location</label>
          <input
            type="text"
            placeholder="Enter your location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full mt-1 p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Waste Image</label>
          <button
            type="button"
            className="w-full mt-1 bg-blue-600 text-white font-medium py-2 rounded-md hover:bg-blue-700"
            onClick={openCloudinaryWidget}
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
          Request Service
        </button>

        {status && (
          <p
            className={`mt-2 text-center text-sm ${
              status.includes('Error') || status.includes('Failed')
                ? 'text-red-600'
                : 'text-green-600'
            }`}
          >
            {status}
          </p>
        )}
      </form>
    </>
  );
}
