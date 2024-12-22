import { useAccount } from 'wagmi';
import { Navbar } from '@/components/Navbar';
import NFTGrid from '@/components/NFTGrid';
import { Button } from '@/components/ui/button';

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <main>
      <Navbar />
      <div className="max-w-7xl mx-auto p-4">
        {isConnected ? (
          <NFTGrid />
        ) : (
          <div className="text-center mt-20">
            <h1 className="text-4xl font-bold">Welcome to NFT Marketplace</h1>
            <p className="mt-4 text-xl">Please connect your wallet to continue</p>
          </div>
        )}
      </div>
    </main>
  );
}