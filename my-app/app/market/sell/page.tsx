// app/market/sell/page.tsx
'use client';

import { useState, useCallback, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { Upload, CheckCircle, Loader, Navigation, MapPin, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GoogleGenerativeAI } from "@google/generative-ai"
import { createUser, getUserByEmail } from '@/utils/db/actions'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { OpenStreetMapProvider } from 'leaflet-geosearch'

// Dynamically import the Map component with no SSR
const MapComponent = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-100">
      <Loader className="animate-spin h-8 w-8 text-gray-400" />
    </div>
  )
})

const provider = new OpenStreetMapProvider();
const geminiApiKey = 'AIzaSyCzHLO9DjXs1deBPkvfJbhTbWxqFmTN7SE';

interface WasteListing {
  id: number;
  title: string;
  wasteType: string;
  quantity: string;
  price: number;
  location: string;
  description: string;
  createdAt: string;
}

export default function SellWastePage() {
  const [user, setUser] = useState<{ id: number; email: string; name: string } | null>(null);
  const router = useRouter();
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [searchResult, setSearchResult] = useState(null);
  const mapRef = useRef(null);
  
  const [newListing, setNewListing] = useState({
    title: '',
    description: '',
    location: '',
    type: '',
    quantity: '',
    price: '',
  });

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'success' | 'failure'>('idle');
  const [verificationResult, setVerificationResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLocationSearch = async () => {
    if (!newListing.location) return;

    try {
      const results = await provider.search({ query: newListing.location });
      if (results.length > 0) {
        const { x, y, label } = results[0];
        setSearchResult(results[0]);
        setPosition([y, x]);
        setNewListing(prev => ({ ...prev, location: label }));
      }
    } catch (error) {
      console.error('Error searching location:', error);
      toast.error('Failed to find location. Please try again.');
    }
  };

  const handleCurrentLocation = () => {
    if (mapRef.current) {
      mapRef.current.locate();
    }
  };

  const handleLocationFound = (latlng: { lat: number; lng: number }) => {
    setPosition([latlng.lat, latlng.lng]);
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`)
      .then(res => res.json())
      .then(data => {
        setNewListing(prev => ({ 
          ...prev, 
          location: data.display_name 
        }));
      });
  };

  const handleMapClick = (latlng: { lat: number; lng: number }) => {
    setPosition([latlng.lat, latlng.lng]);
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`)
      .then(res => res.json())
      .then(data => {
        setNewListing(prev => ({ 
          ...prev, 
          location: data.display_name 
        }));
      });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleVerify = async () => {
    if (!file) return;
  
    setVerificationStatus('verifying');
  
    try {
      const genAI = new GoogleGenerativeAI(geminiApiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
      const base64Data = await readFileAsBase64(file);
  
      const imageParts = [
        {
          inlineData: {
            data: base64Data.split(',')[1],
            mimeType: file.type,
          },
        },
      ];
  
      const prompt = `You are an expert in waste management and recycling. Analyze this image and provide:
        1. The type of waste (e.g., plastic, paper, glass, metal, organic)
        2. An estimate of the quantity or amount (in kg or liters)
        3. A suggested price range in BDT (Bangladeshi Taka) based on market rates
        4. Your confidence level in this assessment (as a percentage)
  
        Respond in JSON format like this:
        {
          "wasteType": "type of waste",
          "quantity": "estimated quantity with unit",
          "suggestedPrice": "price range in BDT",
          "confidence": confidence level as a number between 0 and 1
        }`;
  
      const result = await model.generateContent([prompt, ...imageParts]);
      const response = result.response;
      
      if (response?.candidates?.[0]?.content?.parts?.[0]?.text) {
        const jsonContent = response.candidates[0].content.parts[0].text.replace(/```json\n|\n```/g, '').trim();
  
        try {
          const parsedResult = JSON.parse(jsonContent);
  
          if (parsedResult.wasteType && parsedResult.quantity && parsedResult.confidence !== undefined) {
            setVerificationResult(parsedResult);
            setVerificationStatus('success');
            setNewListing(prev => ({
              ...prev,
              type: parsedResult.wasteType,
              quantity: parsedResult.quantity,
              price: parsedResult.suggestedPrice,
            }));
          } else {
            setVerificationStatus('failure');
          }
        } catch (parseError) {
          console.error('Failed to parse JSON response:', parseError);
          setVerificationStatus('failure');
        }
      } else {
        setVerificationStatus('failure');
      }
    } catch (error) {
      console.error('Error verifying waste:', error);
      setVerificationStatus('failure');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !position || !newListing.title || !newListing.type || !newListing.quantity || !newListing.price) {
      toast.error('Please fill in all required fields and verify the waste.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const listingData = {
        userId: user.id,
        title: newListing.title,
        description: newListing.description,
        location: newListing.location,
        latitude: position[0],
        longitude: position[1],
        wasteType: newListing.type,
        quantity: newListing.quantity,
        price: parseFloat(newListing.price),
        image: preview,
        verificationResult: verificationResult ? JSON.stringify(verificationResult) : undefined
      };

      // Add createWasteListing to your actions.ts file and schema.ts
      const listing = await createWasteListing(listingData);
      
      if (listing) {
        setNewListing({
          title: '',
          description: '',
          location: '',
          type: '',
          quantity: '',
          price: '',
        });
        setFile(null);
        setPreview(null);
        setVerificationStatus('idle');
        setVerificationResult(null);
        setPosition(null);
        
        toast.success('Waste listing created successfully!');
        router.push('/market'); // Redirect to marketplace
      } else {
        throw new Error('Failed to create listing');
      }
    } catch (error) {
      console.error('Error creating listing:', error);
      toast.error('Failed to create listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      const email = localStorage.getItem('userEmail');
      if (email) {
        let user = await getUserByEmail(email);
        if (!user) {
          user = await createUser(email, 'Anonymous User');
        }
        setUser(user);
      } else {
        router.push('/login');
      }
    };
    checkUser();
  }, [router]);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">Sell Your Waste</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg mb-12">
        {/* Title and Description */}
        <div className="grid grid-cols-1 gap-6 mb-8">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Listing Title*
            </label>
            <input
              type="text"
              id="title"
              value={newListing.title}
              onChange={(e) => setNewListing(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g., Clean Plastic Bottles for Recycling"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={newListing.description}
              onChange={(e) => setNewListing(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              rows={4}
              placeholder="Describe your waste materials in detail..."
            />
          </div>
        </div>

        {/* Image Upload Section */}
        <div className="mb-8">
          <label htmlFor="waste-image" className="block text-lg font-medium text-gray-700 mb-2">
            Upload Waste Image*
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-green-500 transition-colors duration-300">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="waste-image"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-green-500"
                >
                  <span>Upload a file</span>
                  <input 
                    id="waste-image" 
                    name="waste-image" 
                    type="file" 
                    className="sr-only" 
                    onChange={handleFileChange} 
                    accept="image/*" 
                    required
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
        </div>

        {/* Preview uploaded image */}
        {preview && (
          <div className="mt-4 mb-8">
            <img src={preview} alt="Waste preview" className="max-w-full h-auto rounded-xl shadow-md" />
          </div>
        )}

        {/* Verify Button */}
        <Button 
          type="button" 
          onClick={handleVerify} 
          className="w-full mb-8 bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg rounded-xl transition-colors duration-300" 
          disabled={!file || verificationStatus === 'verifying'}
        >
          {verificationStatus === 'verifying' ? (
            <>
              <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
              Verifying...
            </>
          ) : 'Verify Waste'}
        </Button>

        {/* Verification Result */}
        {verificationStatus === 'success' && verificationResult && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-8 rounded-r-xl">
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-green-400 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-green-800">Verification Successful</h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>Waste Type: {verificationResult.wasteType}</p>
                  <p>Quantity: {verificationResult.quantity}</p>
                  <p>Suggested Price: {verificationResult.suggestedPrice}</p>
                  <p>Confidence: {(verificationResult.confidence * 100).toFixed(2)}%</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Location and Map Section */}
        <div className="mb-8">
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location*
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={newListing.location}
                  onChange={(e) => setNewListing(prev => ({ ...prev, location: e.target.value }))}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter your location"
                  required
                />
                <Button 
                  type="button" 
                  onClick={handleLocationSearch}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Search
                </Button>
                <Button
                  type="button"
                  onClick={handleCurrentLocation}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Navigation className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="h-96 rounded-xl overflow-hidden border border-gray-300">
            <MapComponent
              position={position}
              onLocationFound={handleLocationFound}
              onMapClick={handleMapClick}
              mapRef={mapRef}
            />
          </div>
        </div>

        {/* Submit Button */}
        <Button 
          type="submit" 
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg rounded-xl transition-colors duration-300 flex items-center justify-center"
          disabled={isSubmitting || !position || !newListing.title || !newListing.type || !newListing.quantity || !newListing.price}
        >
          {isSubmitting ? (
            <>
              <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
              Creating Listing...
            </>
          ) : 'Create Listing'}
        </Button>
      </form>
      </div>
    );
  }