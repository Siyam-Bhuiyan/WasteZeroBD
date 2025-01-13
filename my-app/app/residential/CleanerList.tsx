'use client';

import { useEffect, useState } from 'react';

export default function CleanerList() {
  const [location, setLocation] = useState('');
  const [cleaners, setCleaners] = useState([]);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const fetchCleaners = async () => {
      try {
        // Correct API fetch URL
        const res = await fetch(`/api/residential/cleaners?location=${location}`);
        const data = await res.json();
        setCleaners(data);
        if (data.length === 0) {
          setStatus('No cleaners available in this location.');
        } else {
          setStatus(null);
        }
      } catch (error) {
        setStatus('Failed to fetch cleaners. Please try again later.');
      }
    };

    if (location) {
      fetchCleaners();
    } else {
      setCleaners([]);
      setStatus(null);
    }
  }, [location]);

  return (
    <div>
      <h2 className="text-2xl font-semibold text-green-600">Available Cleaners</h2>
      <input
        type="text"
        placeholder="Enter location to search"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="w-full mt-2 p-2 border rounded-md"
      />
      {status && <p className="mt-2 text-center text-sm text-red-600">{status}</p>}
      <ul className="mt-4 space-y-2">
        {cleaners.map((cleaner: any) => (
          <li key={cleaner.id} className="p-4 border rounded-md shadow-sm bg-gray-50">
            <p className="font-medium text-gray-800">{cleaner.name}</p>
            <p className="text-sm text-gray-600">{cleaner.location}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
