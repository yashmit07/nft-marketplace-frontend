'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { motion } from 'framer-motion';
import WalletModal from '@/components/WalletModal';

export default function AuthPage() {
  const router = useRouter();
  const { isConnected } = useAccount();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isConnected) {
    router.push('/marketplace');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-6 text-center"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent mb-4">
          Welcome to NFT Marketplace
        </h1>
        <p className="text-gray-400 mb-8">
          Connect your wallet to start trading NFTs
        </p>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity"
        >
          Connect Wallet
        </button>
      </motion.div>

      <WalletModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}