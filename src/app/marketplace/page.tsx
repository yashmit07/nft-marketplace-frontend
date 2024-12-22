'use client';

import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import NFTGrid from '@/components/NFTGrid';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs.tsx";

export default function MarketplacePage() {
  const { isConnected } = useAccount();
  const router = useRouter();

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
        <Tabs defaultValue="marketplace" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 lg:w-[600px]">
            <TabsTrigger value="marketplace">All NFTs</TabsTrigger>
            <TabsTrigger value="owned">Your NFTs</TabsTrigger>
            <TabsTrigger value="listed">Listed NFTs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="marketplace">
            <NFTGrid view="all" />
          </TabsContent>
          
          <TabsContent value="owned">
            <NFTGrid view="owned" />
          </TabsContent>

          <TabsContent value="listed">
            <NFTGrid view="listed" />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}