// components/Navbar.tsx
'use client';

import Link from 'next/link';
import ConnectButton from './ConnectButton';

export default function Navbar() {
  return (
    <nav className="border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/marketplace" className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            NFT Marketplace
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/marketplace" className="text-gray-300 hover:text-white">
              Browse
            </Link>
            <ConnectButton />
          </div>
        </div>
      </div>
    </nav>
  );
}