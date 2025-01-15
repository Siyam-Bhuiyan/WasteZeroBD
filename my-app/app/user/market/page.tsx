// pages/WasteMarketplace.tsx
'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function WasteMarketplace() {
  const router = useRouter();
  const [choice, setChoice] = useState('');

  const handleSelect = (option: string) => {
    setChoice(option);
    if (option === 'buy') {
      router.push('/market/buy');
    } else if (option === 'sell') {
      router.push('/market/sell');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      <h1 className="text-5xl font-extrabold mb-8 text-green-700">Welcome to Waste Marketplace</h1>
      <p className="text-gray-700 mb-12 text-lg">Choose whether you want to Buy or Sell waste below:</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <button
          onClick={() => handleSelect('buy')}
          className="flex flex-col items-center justify-center w-72 h-72 bg-white border-4 border-green-400 rounded-lg shadow-lg hover:scale-105 hover:shadow-2xl transition-transform duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-20 w-20 text-green-500 mb-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 10h11M9 21V3m3.5 6.5L3 3"
            />
          </svg>
          <span className="text-2xl font-semibold text-green-600">Buy Waste</span>
        </button>

        <button
          onClick={() => handleSelect('sell')}
          className="flex flex-col items-center justify-center w-72 h-72 bg-white border-4 border-yellow-400 rounded-lg shadow-lg hover:scale-105 hover:shadow-2xl transition-transform duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-20 w-20 text-yellow-500 mb-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3v18m9-9H3m6 6l-6-6 6-6"
            />
          </svg>
          <span className="text-2xl font-semibold text-yellow-600">Sell Waste</span>
        </button>
      </div>
    </div>
  );
}
