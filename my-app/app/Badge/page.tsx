'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Trophy, Download, Award, Shield, Star } from 'lucide-react';
import { getUserCertificateStats } from '@/utils/db/actions';
import { jsPDF } from 'jspdf';

const getBadgeIcon = (type) => {
  switch(type) {
    case 'gold': return <Trophy className="w-12 h-12 text-yellow-500" />;
    case 'silver': return <Award className="w-12 h-12 text-gray-400" />;
    case 'bronze': return <Shield className="w-12 h-12 text-orange-400" />;
    default: return <Star className="w-12 h-12 text-slate-400" />;
  }
};

const getCertificateType = (points: number, reported: number, collected: number) => {
  if (points === 0 && reported === 0 && collected === 0) return 'iron';
  if (points > 200 && reported > 100 && collected > 60) return 'gold';
  if (points >= 100 && reported >= 50 && collected >= 30) return 'silver';
  return 'bronze';
};

const colorSchemes = {
  gold: { bg: 'bg-yellow-50', border: 'border-yellow-500', text: 'text-yellow-700' },
  silver: { bg: 'bg-gray-50', border: 'border-gray-400', text: 'text-gray-700' },
  bronze: { bg: 'bg-orange-50', border: 'border-orange-400', text: 'text-orange-700' },
  iron: { bg: 'bg-slate-50', border: 'border-slate-400', text: 'text-slate-700' }
};

const CertificatePage = () => {
  const [userData, setUserData] = useState({
    points: 0,
    reportedWastes: 0,
    collectedWastes: 0,
    name: '',
    date: new Date().toLocaleDateString()
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = 1; // Replace with actual user ID from your auth system
        const stats = await getUserCertificateStats(userId);
        setUserData(stats);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const certificateType = getCertificateType(
    userData.points,
    userData.reportedWastes,
    userData.collectedWastes
  );

  const colors = colorSchemes[certificateType];

  const downloadCertificate = () => {
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });
  
    const width = pdf.internal.pageSize.getWidth();
    const height = pdf.internal.pageSize.getHeight();
  
    // Set background color based on the certificate type
    let bgColor = { r: 255, g: 255, b: 255 }; // Default white background
    let textColor = { r: 0, g: 0, b: 0 }; // Default black text
  
    if (certificateType === 'gold') {
      bgColor = { r: 255, g: 239, b: 150 };
      textColor = { r: 139, g: 69, b: 19 };
    } else if (certificateType === 'silver') {
      bgColor = { r: 220, g: 220, b: 220 };
      textColor = { r: 128, g: 128, b: 128 };
    } else if (certificateType === 'bronze') {
      bgColor = { r: 210, g: 180, b: 140 };
      textColor = { r: 139, g: 69, b: 19 };
    } else if (certificateType === 'iron') {
      bgColor = { r: 211, g: 211, b: 211 };
      textColor = { r: 105, g: 105, b: 105 };
    }
  
    // Draw the background
    pdf.setFillColor(bgColor.r, bgColor.g, bgColor.b);
    pdf.rect(0, 0, width, height, 'F');
  
    // Set text color
    pdf.setTextColor(textColor.r, textColor.g, textColor.b);
  
    // Add certificate content
    pdf.setFontSize(40);
    pdf.text('Certificate of Achievement', width / 2, 40, { align: 'center' });
  
    pdf.setFontSize(30);
    pdf.text(`${certificateType.toUpperCase()} Level Recycler`, width / 2, 60, { align: 'center' });
  
    pdf.setFontSize(20);
    pdf.text(userData.name, width / 2, 100, { align: 'center' });
  
    pdf.setFontSize(16);
    pdf.text(`Total Points: ${userData.points}`, width / 2, 130, { align: 'center' });
    pdf.text(`Wastes Reported: ${userData.reportedWastes}`, width / 2, 140, { align: 'center' });
    pdf.text(`Wastes Collected: ${userData.collectedWastes}`, width / 2, 150, { align: 'center' });
  
    pdf.setFontSize(12);
    pdf.text(`Issued on ${userData.date}`, width / 2, height - 20, { align: 'center' });
  
    // Save the PDF
    pdf.save(`${certificateType}_certificate.pdf`);
  };
  

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className={`w-full max-w-3xl ${colors.bg} ${colors.border} border-2 p-8 relative`}>
        <div className="absolute top-4 right-4">
          <Trophy className={`w-8 h-8 ${colors.text}`} />
        </div>
        
        <div className="text-center space-y-6">
          <h1 className="text-3xl font-bold">Certificate of Achievement</h1>
          <h2 className={`text-2xl ${colors.text} capitalize`}>
            {certificateType} Level Recycler
          </h2>
          
          <p className="text-lg">This certifies that</p>
          <p className="text-2xl font-bold">{userData.name}</p>
          
          <div className="space-y-2 my-6">
            <p>Has achieved:</p>
            <p className="font-semibold">Total Points: {userData.points}</p>
            <p className="font-semibold">Wastes Reported: {userData.reportedWastes}</p>
            <p className="font-semibold">Wastes Collected: {userData.collectedWastes}</p>
          </div>
          
          <p className="text-sm">Issued on {userData.date}</p>
        </div>

        <button
          onClick={downloadCertificate}
          className="absolute bottom-4 right-4 p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600"
        >
          <Download className="w-6 h-6" />
        </button>
      </Card>
    </div>
  );
};

export default CertificatePage;