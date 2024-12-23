'use client';

import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import NFTGrid from '@/components/NFTGrid';

export default function MarketplacePage() {
  const { isConnected } = useAccount();
  const router = useRouter();
  const [activeView, setActiveView] = useState('marketplace');

  useEffect(() => {
    if (!isConnected) {
      router.push('/');
    }
  }, [isConnected, router]);

  if (!isConnected) return null;

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setActiveView('marketplace')}
              className={`px-6 py-2 rounded-lg transition-colors ${
                activeView === 'marketplace'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              All NFTs
            </button>
            <button
              onClick={() => setActiveView('owned')}
              className={`px-6 py-2 rounded-lg transition-colors ${
                activeView === 'owned'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Your NFTs
            </button>
            <button
              onClick={() => setActiveView('listed')}
              className={`px-6 py-2 rounded-lg transition-colors ${
                activeView === 'listed'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Listed NFTs
            </button>
          </div>

          <div className="mt-8">
            {activeView === 'marketplace' && <NFTGrid view="all" />}
            {activeView === 'owned' && <NFTGrid view="owned" />}
            {activeView === 'listed' && <NFTGrid view="listed" />}
          </div>
        </div>
      </main>
    </div>
  );
}