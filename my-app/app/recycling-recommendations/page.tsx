'use client';
import { useState } from 'react';
import { Upload, Loader, CheckCircle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { jsPDF } from 'jspdf';
import { toast } from 'react-hot-toast';

export default function RecyclingRecommendationsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<{
    method: string;
    facilities: string;
    environmentalImpact: string;
    recommendations: string;
  } | null>(null);

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

  const generateRecommendation = async () => {
    if (!file) {
      toast.error('Please upload a file first.');
      return;
    }

    setLoading(true);
    try {
      // Simulating AI-based recommendation generation
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Mock API call delay
      const mockRecommendation = {
        method: 'Recycle through specialized facilities',
        facilities: 'Nearby recycling centers',
        environmentalImpact: 'Reduces carbon footprint by 50%',
        recommendations: 'Sort plastics and metals separately',
      };
      setRecommendation(mockRecommendation);
      toast.success('Recommendation generated successfully!');
    } catch (error) {
      console.error('Error generating recommendation:', error);
      toast.error('Failed to generate recommendation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    if (!recommendation) {
      toast.error('No recommendation to download.');
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Recycling Recommendation', 10, 10);
    doc.setFontSize(12);
    doc.text(`Method: ${recommendation.method}`, 10, 30);
    doc.text(`Facilities: ${recommendation.facilities}`, 10, 40);
    doc.text(`Environmental Impact: ${recommendation.environmentalImpact}`, 10, 50);
    doc.text(`Recommendations: ${recommendation.recommendations}`, 10, 60);
    doc.save('recycling_recommendation.pdf');
    toast.success('PDF downloaded successfully!');
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">Recycling Recommendations</h1>

      <div className="bg-white p-8 rounded-2xl shadow-lg mb-12">
        <div className="mb-8">
          <label htmlFor="file-upload" className="block text-lg font-medium text-gray-700 mb-2">
            Upload Waste Image
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-green-500 transition-colors duration-300">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-green-500"
                >
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
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
          onClick={generateRecommendation}
          className="w-full mb-8 bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg rounded-xl transition-colors duration-300"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
              Generating Recommendation...
            </>
          ) : (
            'Generate Recommendation'
          )}
        </Button>

        {recommendation && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-8 rounded-r-xl">
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-green-400 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-green-800">Recommendation</h3>
                <div className="mt-2 text-sm text-green-700">
                  <p><strong>Method:</strong> {recommendation.method}</p>
                  <p><strong>Facilities:</strong> {recommendation.facilities}</p>
                  <p><strong>Environmental Impact:</strong> {recommendation.environmentalImpact}</p>
                  <p><strong>Recommendations:</strong> {recommendation.recommendations}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {recommendation && (
          <Button
            type="button"
            onClick={downloadPDF}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg rounded-xl transition-colors duration-300"
          >
            <Download className="mr-2 h-5 w-5" />
            Download as PDF
          </Button>
        )}
      </div>
    </div>
  );
}
