'use client';

import { useState } from 'react';

export default function ResidentialServiceForm() {
  const [location, setLocation] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [status, setStatus] = useState<string | null>(null);

  const openCloudinaryWidget = () => {
    const widget = (window as any).cloudinary.createUploadWidget(
      {
        cloudName: "dugx8scku", // Replace with your Cloudinary cloud name
        uploadPreset: "okayish", // Replace with your Cloudinary upload preset
        folder: "residential_waste_management", // Optional: Specify folder
        multiple: false,
        resourceType: "image",
      },
      (error: any, result: any) => {
        if (!error && result && result.event === "success") {
          const fileUrl = result.info.secure_url;
          setUploadedFiles((prev) => [...prev, fileUrl]);
          setStatus("File uploaded successfully!");
        } else if (error) {
          setStatus("Failed to upload file. Please try again.");
        }
      }
    );
    widget.open();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!location || uploadedFiles.length === 0) {
      setStatus('Please fill in all fields and upload an image.');
      return;
    }

    try {
      // API call to send location data and uploaded file URL(s)
      const response = await fetch('/api/residential/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location,
          fileUrls: uploadedFiles,
          userId: 'user123', // Replace with actual authenticated user ID
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setStatus('Service requested successfully!');
      } else {
        setStatus(`Error: ${data.error}`);
      }
    } catch (error) {
      setStatus('Failed to request service. Please try again later.');
    }
  };

  return (
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
        <ul className="mt-2">
          {uploadedFiles.map((file, index) => (
            <li key={index}>
              <a href={file} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                {file}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <button
        type="submit"
        className="w-full bg-green-600 text-white font-medium py-2 rounded-md hover:bg-green-700"
      >
        Request Service
      </button>
      {status && <p className="mt-2 text-center text-sm text-red-600">{status}</p>}
    </form>
  );
}
