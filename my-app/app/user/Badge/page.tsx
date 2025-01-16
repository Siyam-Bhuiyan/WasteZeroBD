"use client";
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Trophy, Download, Award, Shield, Star, Leaf, Globe, Recycle, TreePine } from 'lucide-react';
import { getUserCertificateStats } from '@/utils/db/actions';
import logo1 from '@/app/user/Badge/logo1.png';
import logo2 from '@/app/user/Badge/logo2.png';
import signature1 from '@/app/user/Badge/signature1.png';
import signature2 from '@/app/user/Badge/signature2.png';
import signature3 from '@/app/user/Badge/signature3.png'
// Enhanced Decorative Border SVG Component
const DecorativeBorder = ({ color }) => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
    <defs>
      <pattern id="leafPattern" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
        <path d="M2,5 Q5,2 8,5 T2,5" fill="none" stroke={color} strokeWidth="0.2" />
      </pattern>
    </defs>

    {/* Outer Frame */}
    <path
      d="M 10,0 L 90,0 Q 100,0 100,10 L 100,90 Q 100,100 90,100 L 10,100 Q 0,100 0,90 L 0,10 Q 0,0 10,0"
      fill="none"
      stroke={color}
      strokeWidth="0.5"
      vectorEffect="non-scaling-stroke"
    />

    {/* Inner Frame */}
    <path
      d="M 20,5 L 80,5 Q 95,5 95,20 L 95,80 Q 95,95 80,95 L 20,95 Q 5,95 5,80 L 5,20 Q 5,5 20,5"
      fill="none"
      stroke={color}
      strokeWidth="0.3"
      vectorEffect="non-scaling-stroke"
    />

    {/* Corner Decorations */}
    {[0, 90].map(x => [0, 90].map(y => (
      <circle key={`${x}-${y}`} cx={x + 5} cy={y + 5} r="3" fill="url(#leafPattern)" />
    )))}
  </svg>
);

// Enhanced Certificate Seal Component
const CertificateSeal = ({ type, className }) => (
  <div className={`relative ${className}`}>
    <div className="absolute inset-0 rounded-full border-4 border-current opacity-20 animate-pulse" />
    <div className="absolute inset-2 rounded-full border-2 border-current opacity-30" />
    <div className="absolute inset-4 rounded-full border border-current opacity-40" />
    <div className="relative z-10 p-2">
      {getBadgeIcon(type)}
    </div>
  </div>
);

const getBadgeIcon = (type) => {
  switch (type) {
    case 'platinum': return <Globe className="w-16 h-16 text-indigo-400 drop-shadow-lg" />;
    case 'gold': return <Trophy className="w-16 h-16 text-yellow-500 drop-shadow-lg" />;
    case 'silver': return <Award className="w-16 h-16 text-gray-400 drop-shadow-lg" />;
    case 'bronze': return <Shield className="w-16 h-16 text-orange-400 drop-shadow-lg" />;
    default: return <Leaf className="w-16 h-16 text-slate-400 drop-shadow-lg" />;
  }
};

const getCertificateType = (points: number, reported: number, collected: number) => {
  if (points === 0 && reported === 0 && collected === 0) return 'starter';
  if (points > 300 && reported > 150 && collected > 90) return 'platinum';
  if (points > 200 && reported > 100 && collected > 60) return 'gold';
  if (points >= 100 && reported >= 50 && collected >= 30) return 'silver';
  return 'bronze';
};

const colorSchemes = {
  platinum: {
    bg: 'bg-gradient-to-br from-indigo-50 via-white to-purple-50',
    border: 'text-indigo-400',
    text: 'text-indigo-700',
    gradient: 'bg-gradient-to-r from-indigo-500 via-purple-300 to-indigo-500'
  },
  gold: {
    bg: 'bg-gradient-to-br from-yellow-50 via-white to-amber-50',
    border: 'text-yellow-500',
    text: 'text-yellow-700',
    gradient: 'bg-gradient-to-r from-yellow-500 via-amber-300 to-yellow-500'
  },
  silver: {
    bg: 'bg-gradient-to-br from-gray-50 via-white to-blue-50',
    border: 'text-gray-400',
    text: 'text-gray-700',
    gradient: 'bg-gradient-to-r from-gray-400 via-blue-200 to-gray-400'
  },
  bronze: {
    bg: 'bg-gradient-to-br from-orange-50 via-white to-rose-50',
    border: 'text-orange-400',
    text: 'text-orange-700',
    gradient: 'bg-gradient-to-r from-orange-400 via-rose-300 to-orange-400'
  },
  starter: {
    bg: 'bg-gradient-to-br from-emerald-50 via-white to-teal-50',
    border: 'text-emerald-400',
    text: 'text-emerald-700',
    gradient: 'bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400'
  }
};

const AchievementBadge = ({ icon: Icon, label, value, color }) => (
  <div className="flex flex-col items-center p-4 bg-white bg-opacity-60 rounded-lg backdrop-blur-sm border border-opacity-20 transform hover:scale-105 transition-transform">
    <Icon className={`w-8 h-8 ${color} mb-2`} />
    <p className="font-serif text-green-700 text-sm">{label}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

const CertificatePage = () => {
  const userEmail = localStorage.getItem('userName')
  const [userData, setUserData] = useState({
    points: 0,
    reportedWastes: 0,
    collectedWastes: 0,
    name: '',
    date: new Date().toLocaleDateString(),
    certificateNumber: Math.random().toString(36).substr(2, 9).toUpperCase()
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = 1;
        const stats = await getUserCertificateStats(userId);
        setUserData({
          ...stats,
          certificateNumber: Math.random().toString(36).substr(2, 9).toUpperCase()
        });
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-8">
      <Card className={`w-full max-w-4xl ${colors.bg} p-12 relative overflow-hidden shadow-2xl`}>
        <DecorativeBorder color={colors.border} />

        <div className="flex justify-between mb-8">
          <img src={logo1.src} alt="Organization Logo 1" className="h-20 w-auto" />
          <img src={logo2.src} alt="Organization Logo 2" className="h-20 w-auto" />
        </div>

        <div className="text-center space-y-8 relative z-10">
          <div className={`${colors.gradient} text-transparent bg-clip-text`}>
            <h1 className="text-5xl font-serif tracking-wider mb-2">Certificate of Excellence</h1>
            <h2 className="text-3xl font-serif">in Environmental Stewardship</h2>
          </div>

          <div className="flex flex-col items-center space-y-4">
            <CertificateSeal type={certificateType} className={colors.text} />
            <h2 className={`text-2xl ${colors.text} capitalize font-serif`}>
              {certificateType} Level Achievement
            </h2>
          </div>

          <div className="space-y-4 my-8">
            <p className="text-xl text-gray-600 font-serif">This certificate proudly recognizes</p>
            <p className="text-4xl font-script text-gray-800 italic mb-2">{userEmail}</p>
            <p className="text-lg text-gray-600 font-serif">for outstanding contributions to environmental conservation</p>
          </div>

          {/* <div className="grid grid-cols-3 gap-6 my-8">
            <AchievementBadge 
              icon={Trophy} 
              label="Total Points Earned"
              value={userData.points}
              color="text-yellow-500"
            />
            <AchievementBadge 
              icon={Globe} 
              label="Wastes Reported"
              value={userData.reportedWastes}
              color="text-blue-500"
            />
            <AchievementBadge 
              icon={Recycle} 
              label="Wastes Collected"
              value={userData.collectedWastes}
              color="text-green-500"
            />
          </div> */}

          <div className="max-w-2xl mx-auto">
            <p className="text-gray-600 italic font-serif text-lg leading-relaxed">
              "In recognition of exemplary dedication to environmental sustainability,
              waste reduction, and community leadership in promoting a cleaner,
              greener future for all."
            </p>
          </div>

          <div className="grid grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <img src={signature1.src} alt="Director's Signature" className="h-12 w-auto mx-auto mb-2" />
              <p className="text-sm text-gray-600 font-serif">Director of Sustainability</p>
              <p className="text-xs text-gray-500">Environmental Protection Division</p>
            </div>
            <div className="text-center">
              <img src={signature2.src} alt="Director's Signature" className="h-12 w-auto mx-auto mb-2" />
              <p className="text-sm text-gray-600 font-serif">Program Coordinator</p>
              <p className="text-xs text-gray-500">Zero Waste Initiative</p>
            </div>
            <div className="text-center">
              <img src={signature3.src} alt="Director's Signature" className="h-12 w-auto mx-auto mb-2" />
              <p className="text-sm text-gray-600 font-serif">Director of Renewable Resources</p>
              <p className="text-xs text-gray-500">Clean Energy Solutions Division</p>
            </div>
          </div>

          <div className="flex justify-between text-sm text-gray-600 mt-8">
            <div>
              <p>Certificate No: {userData.certificateNumber}</p>
              <p className="text-xs text-gray-500">Verify at: verify.zerowaste.org</p>
            </div>
            <div>
              <p>Issued on {userData.date}</p>
              <p className="text-xs text-gray-500">Valid for one year from issue date</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => { }}
          className="absolute bottom-4 right-4 p-3 rounded-full bg-green-600 text-white hover:bg-green-700 transition-colors shadow-lg group"
          aria-label="Download Certificate"
        >
          <Download className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>
      </Card>
    </div>
  );
};

export default CertificatePage;
