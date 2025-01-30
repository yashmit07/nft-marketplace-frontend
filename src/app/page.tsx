'use client';

import { useAccount } from 'wagmi';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import WalletModal from '@/components/WalletModal';

export default function HomePage() {
  const { isConnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (isConnected) {
      router.push('/marketplace');
    }
  }, [isConnected, router]);

  return (
    <div style={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#000000',
      padding: '1rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '320px',
        background: 'linear-gradient(145deg, rgba(25, 25, 25, 0.8), rgba(10, 10, 10, 0.9))',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '28px',
        textAlign: 'center',
        boxShadow: '0 4px 32px rgba(0, 0, 0, 0.4)'
      }}>
        <h1 style={{
          background: 'linear-gradient(to right, #c042ff, #8a2be2)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          color: 'transparent',
          fontSize: '28px',
          fontWeight: 'bold',
          marginBottom: '12px'
        }}>
          NFT Marketplace
        </h1>
        <p style={{
          color: '#999999',
          fontSize: '14px',
          marginBottom: '28px',
          lineHeight: '1.5'
        }}>
          Discover, collect, and trade unique NFTs
        </p>
        <WalletModal />
      </div>
    </div>
  );
}