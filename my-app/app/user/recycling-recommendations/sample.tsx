'use client';

import { useState } from 'react';
import { Upload, Loader, CheckCircle, Download, Camera, History, Trash2, Recycle, Info, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { jsPDF } from 'jspdf';
import { toast } from 'react-hot-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const geminiApiKey = 'AIzaSyBQ-KCx7JC2ksgGCEIKosnfDNqzl6qgf2w';

interface RecyclingRecommendation {
  method: string;
  facilities: string;
  environmentalImpact: string;
  recommendations: string;
}

interface HistoryItem {
  timestamp: Date;
  recommendation: RecyclingRecommendation;
  imageUrl: string;
}

export default function RecyclingRecommendationsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<RecyclingRecommendation | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

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

  



  const captureImage = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      
      video.srcObject = stream;
      await video.play();
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d')?.drawImage(video, 0, 0);
      
      const blob = await new Promise<Blob>((resolve) => canvas.toBlob(blob => resolve(blob!)));
      const capturedFile = new File([blob], 'captured-image.jpg', { type: 'image/jpeg' });
      
      setFile(capturedFile);
      setPreview(canvas.toDataURL('image/jpeg'));
      
      stream.getTracks().forEach(track => track.stop());
      toast.success('Image captured successfully!');
    } catch (error) {
      console.error('Error capturing image:', error);
      toast.error('Failed to capture image. Please try uploading instead.');
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

  const generateRecommendation = async () => {
    if (!file) {
      toast.error('Please upload or capture a waste image first.');
      return;
    }

    setLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(geminiApiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const base64Data = await readFileAsBase64(file);

      const imageParts = [{
        inlineData: {
          data: base64Data.split(',')[1],
          mimeType: file.type,
        },
      }];

      const prompt = `You are an expert in waste management and recycling. Analyze this image and provide detailed recycling recommendations:

1. Identify the type of waste and suggest the most appropriate recycling method
2. Recommend specific recycling facilities or disposal methods
3. Explain the environmental impact of proper recycling vs improper disposal
4. Provide practical recommendations for handling and preparing the waste for recycling

Respond in JSON format like this:
{
  "method": "detailed description of recycling method",
  "facilities": "specific facilities and how to find them",
  "environmentalImpact": "detailed environmental impact analysis",
  "recommendations": "specific practical steps for recycling this waste"
}`;

      const result = await model.generateContent([prompt, ...imageParts]);
      const response = result.response;
      
      if (response?.candidates?.[0]?.content?.parts?.[0]?.text) {
        const jsonContent = response.candidates[0].content.parts[0].text.replace(/```json\n|\n```/g, '').trim();
        
        try {
          const parsedResult = JSON.parse(jsonContent);
          setRecommendation(parsedResult);
          setHistory(prev => [...prev, {
            timestamp: new Date(),
            recommendation: parsedResult,
            imageUrl: preview!
          }]);
          toast.success('Recycling recommendations generated successfully!');
        } catch (parseError) {
          console.error('Failed to parse AI response:', parseError);
          toast.error('Failed to process recommendations. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error generating recommendations:', error);
      toast.error('Failed to generate recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    if (!recommendation) {
      toast.error('No recommendations to download.');
      return;
    }

    try {
      const doc = new jsPDF();
      let yPosition = 20;
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const contentWidth = pageWidth - (2 * margin);

      // Helper function to add text with automatic page breaks
      const addText = (text: string, fontSize: number, isBold: boolean = false) => {
        doc.setFontSize(fontSize);
        doc.setFont(undefined, isBold ? 'bold' : 'normal');
        
        const lines = doc.splitTextToSize(text, contentWidth);
        
        // Check if we need a new page
        if (yPosition + (lines.length * (fontSize * 0.5)) > doc.internal.pageSize.getHeight() - margin) {
          doc.addPage();
          yPosition = margin;
        }
        
        doc.text(lines, margin, yPosition);
        yPosition += lines.length * (fontSize * 0.5) + 10;
      };

      // Title
      doc.setTextColor(0, 100, 0);
      addText('Recycling Recommendations Report', 24, true);
      
      // Date
      doc.setTextColor(100, 100, 100);
      addText(`Generated on: ${new Date().toLocaleDateString()}`, 12);
      
      // Content sections
      doc.setTextColor(0, 0, 0);
      
      // Add preview image if available
      if (preview) {
        const imgWidth = 160;
        const imgHeight = 100;
        
        if (yPosition + imgHeight > doc.internal.pageSize.getHeight() - margin) {
          doc.addPage();
          yPosition = margin;
        }
        
        doc.addImage(preview, 'JPEG', margin, yPosition, imgWidth, imgHeight);
        yPosition += imgHeight + 20;
      }

      // Sections
      addText('Recycling Method:', 16, true);
      addText(recommendation.method, 12);

      addText('Recommended Facilities:', 16, true);
      addText(recommendation.facilities, 12);

      addText('Environmental Impact:', 16, true);
      addText(recommendation.environmentalImpact, 12);

      addText('Practical Recommendations:', 16, true);
      addText(recommendation.recommendations, 12);

      // Footer
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.text(
          `Page ${i} of ${pageCount}`,
          doc.internal.pageSize.getWidth() / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: 'center' }
        );
      }

      doc.save('recycling_recommendations.pdf');
      toast.success('PDF report downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF. Please try again.');
    }
  };

  const clearAll = () => {
    setFile(null);
    setPreview(null);
    setRecommendation(null);
    toast.success('All data cleared successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="border-none shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Waste Management Assistant
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Get expert recycling recommendations for your waste materials
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="flex gap-4 mb-6">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => setShowHistory(!showHistory)}
                      variant="outline"
                      className="w-full"
                    >
                      <History className="mr-2 h-5 w-5" />
                      {showHistory ? 'Hide History' : 'Show History'}
                    </Button>
                  </TooltipTrigger>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={captureImage}
                      variant="outline"
                      className="w-full"
                    >
                      <Camera className="mr-2 h-5 w-5" />
                      Capture Image
                    </Button>
                  </TooltipTrigger>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={clearAll}
                      variant="outline"
                      className="w-full"
                    >
                      <Trash2 className="mr-2 h-5 w-5" />
                      Clear All
                    </Button>
                  </TooltipTrigger>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="relative">
              <label
                htmlFor="file-upload"
                className="block p-8 border-2 border-dashed border-green-300 rounded-xl bg-green-50/50 hover:bg-green-50 transition-colors duration-300 cursor-pointer group"
              >
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-green-400 group-hover:text-green-500 transition-colors duration-300" />
                  <div className="mt-4">
                    <span className="font-medium text-green-600 hover:text-green-500">
                      Click to upload
                    </span>
                    {" or drag and drop"}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </label>
            </div>

            {preview && (
              <div className="relative group">
                <img
                  src={preview}
                  alt="Waste preview"
                  className="w-full h-auto rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-[1.02]"
                />
              </div>
            )}

            <Button
              onClick={generateRecommendation}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Loader className="animate-spin mr-2" />
                  Analyzing Waste...
                </div>
              ) : (
                'Get Recommendations'
              )}
            </Button>

            {recommendation && (
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center text-green-800">
                    <CheckCircle className="mr-2" />
                    Recycling Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(recommendation).map(([key, value]) => (
                    <div key={key} className="p-4 bg-white rounded-lg shadow-sm">
                      <h4 className="font-semibold text-green-700 capitalize mb-2">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </h4>
                      <p className="text-gray-600">{value}</p>
                    </div>
                  ))}
                  
                  <Button
                    onClick={downloadPDF}
                    className="w-full mt-4 bg-green-600 hover:bg-green-700"
                  >
                    <Download className="mr-2" />
                    Download PDF Report
                  </Button>
                </CardContent>
              </Card>
            )}

            {showHistory && history.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Analysis History</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {history.map((item, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center gap-4 mb-4">
                      <img 
                          src={item.imageUrl} 
                          alt="Historical waste" 
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div>
                          <p className="text-sm text-gray-500">
                            {item.timestamp.toLocaleDateString()} at{' '}
                            {item.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(item.recommendation).map(([key, value]) => (
                          <div key={key} className="p-3 bg-gray-50 rounded-lg">
                            <h5 className="font-medium text-gray-700 capitalize mb-1">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </h5>
                            <p className="text-sm text-gray-600 line-clamp-2">{value}</p>
                          </div>
                        ))}
                      </div>
                      
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}