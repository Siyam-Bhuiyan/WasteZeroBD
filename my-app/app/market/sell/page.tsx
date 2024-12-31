//app/buy/page.tsx
'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { Upload, CheckCircle, Loader, Navigation, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GoogleGenerativeAI } from "@google/generative-ai"
import { createUser, getUserByEmail, createBuyRequest, getRecentBuyRequests } from '@/utils/db/actions'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { OpenStreetMapProvider, SearchResult, RawResult } from 'leaflet-geosearch'

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
const geminiApiKey = 'AIzaSyBQ-KCx7JC2ksgGCEIKosnfDNqzl6qgf2w';

interface BuyRequest {
  id: number;
  location: string;
  wasteType: string;
  amount: string;
  money: string;
  createdAt: string;
  imageUrl?: string | null;
  status?: string;
  recyclingRecommendations?: unknown;
  collectorId?: number | null;
  userId?: number;
  verificationResult?: unknown;
}

export default function BuyWastePage() {
  const [user, setUser] = useState<{ id: number; email: string; name: string } | null>(null);
  const router = useRouter();
  const [buyRequests, setBuyRequests] = useState<BuyRequest[]>([]);
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [searchResult, setSearchResult] = useState<SearchResult<RawResult> | null>(null);
  const mapRef = useRef(null);
  
  const [newBuyRequest, setNewBuyRequest] = useState({
    location: '',
    type: '',
    amount: '',
    money: '',
  });

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'success' | 'failure'>('idle');

  interface VerificationResult {
    wasteType: string;
    quantity: string;
    confidence: number;
  }

  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLocationSearch = async () => {
    if (!newBuyRequest.location) return;

    try {
      const results = await provider.search({ query: newBuyRequest.location });
      if (results.length > 0) {
        const { x, y, label } = results[0];
        setSearchResult(results[0]);
        setPosition([y, x]);
        setNewBuyRequest(prev => ({ ...prev, location: label }));
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
        setNewBuyRequest(prev => ({ 
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
        setNewBuyRequest(prev => ({ 
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
        3. Your confidence level in this assessment (as a percentage)
  
        Respond in JSON format like this:
        {
          "wasteType": "type of waste",
          "quantity": "estimated quantity with unit",
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
            setNewBuyRequest(prev => ({
              ...prev,
              type: parsedResult.wasteType,
              amount: parsedResult.quantity,
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
    if (verificationStatus !== 'success' || !user || !position) {
    toast.error('Please verify the waste and select a location before submitting.');
    return;
  }

  setIsSubmitting(true);
  try {
    const buyRequest = await createBuyRequest({
      userId: user.id,
      location: newBuyRequest.location,
      wasteType: newBuyRequest.type,
      amount: newBuyRequest.amount,
      money: newBuyRequest.money, 
      image: preview ?? undefined,
      verificationResult: verificationResult ? JSON.stringify(verificationResult) : undefined,
    });

    if (!buyRequest) throw new Error('Failed to save the buy request.');

    const formattedBuyRequest = {
      id: buyRequest.id,
      location: buyRequest.location,
      wasteType: buyRequest.wasteType,
      amount: buyRequest.amount,
      money: buyRequest.money,
      createdAt: new Date(buyRequest.createdAt).toISOString().split('T')[0],
    };

    setBuyRequests([formattedBuyRequest, ...buyRequests]);
    resetForm(); // Function to clear form state
    toast.success('Buy request submitted successfully!');
  } catch (error) {
    console.error('Error submitting buy request:', error);
    toast.error('Failed to submit buy request. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
};

const resetForm = () => {
  setNewBuyRequest({ location: '', type: '', amount: '', money: '' });
  setFile(null);
  setPreview(null);
  setVerificationStatus('idle');
  setVerificationResult(null);
  setPosition(null);
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
        
        const recentBuyRequests = await getRecentBuyRequests();
        const formattedBuyRequests = recentBuyRequests.map(request => ({
          id: request.id,
          location: request.location,
          wasteType: request.wasteType,
          amount: request.amount,
          money: request.money,
          createdAt: new Date(request.createdAt).toISOString().split('T')[0]
        }));
        setBuyRequests(formattedBuyRequests);
      } else {
        router.push('/login'); 
      }
    };
    checkUser();
  }, [router]);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">Buy Waste</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg mb-12">
        <div className="mb-8">
          <label htmlFor="waste-image" className="block text-lg font-medium text-gray-700 mb-2">
            Upload Waste Image
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
                  <input id="waste-image" name="waste-image" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
        </div>
        
        {preview && (
          <div className="mt-4 mb-8">
            <img src={preview} alt="Waste preview" className="max-w-full h-auto rounded-xl shadow-md" />
          </div>
        )}
        
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

        {verificationStatus === 'success' && verificationResult && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-8 rounded-r-xl">
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-green-400 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-green-800">Verification Successful</h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>Waste Type: {verificationResult.wasteType}</p>
                  <p>Quantity: {verificationResult.quantity}</p>
                  <p>Confidence: {(verificationResult.confidence * 100).toFixed(2)}%</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Map Section */}
        <div className="mb-8">
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={newBuyRequest.location}
                  onChange={(e) => setNewBuyRequest(prev => ({ ...prev, location: e.target.value }))}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter location"
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
              searchResult={searchResult}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Waste Type</label>
            <input
              type="text"
              id="type"
              name="type"
              value={newBuyRequest.type}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 bg-gray-100"
              placeholder="Verified waste type"
              readOnly
            />
          </div>
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Estimated Amount</label>
            <input
              type="text"
              id="amount"
              name="amount"
              value={newBuyRequest.amount}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 bg-gray-100"
              placeholder="Verified amount"
              readOnly
            />
          </div>
          <div>
            <label htmlFor="money" className="block text-sm font-medium text-gray-700 mb-1">Money Offered</label>
            <input
              type="text"
              id="money"
              name="money"
              value={newBuyRequest.money}
              onChange={(e) => setNewBuyRequest(prev => ({ ...prev, money: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
              placeholder="Enter the amount of money"
            />
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg rounded-xl transition-colors duration-300 flex items-center justify-center"
          disabled={isSubmitting || !position || verificationStatus !== 'success'}
        >
          {isSubmitting ? (
            <>
              <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
              Submitting...
            </>
          ) : 'Submit Buy Request'}
        </Button>
      </form>

      <h2 className="text-3xl font-semibold mb-6 text-gray-800">Recent Buy Requests</h2>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="max-h-96 overflow-y-auto">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Money</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {buyRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <MapPin className="inline-block w-4 h-4 mr-2 text-green-500" />
                    {request.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.wasteType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.money}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}