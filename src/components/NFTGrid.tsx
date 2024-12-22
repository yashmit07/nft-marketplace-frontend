'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { readContract } from '@wagmi/core';
import { NFT_ABI, NFT_ADDRESS } from '@/constants/contracts';
import { config } from '@/config/wagmi';
import NFTCard from './NFTCard';
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Skeleton } from "../../components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";

export default function NFTGrid() {
  const { address } = useAccount();
  const [userNFTs, setUserNFTs] = useState<bigint[]>([]);
  const [totalSupply, setTotalSupply] = useState<bigint>(0n);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNFTData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Get total supply
        const supply = await readContract(config, {
          address: NFT_ADDRESS,
          abi: NFT_ABI,
          functionName: 'totalSupply',
        }) as bigint;
        
        setTotalSupply(supply);

        if (address) {
          // Batch fetch NFT owners
          const batchSize = 10n;
          const nfts: bigint[] = [];
          
          for (let i = 1n; i <= supply; i += batchSize) {
            const end = i + batchSize <= supply ? i + batchSize : supply + 1n;
            const promises = [];
            
            for (let j = i; j < end; j++) {
              promises.push(
                readContract(config, {
                  address: NFT_ADDRESS,
                  abi: NFT_ABI,
                  functionName: 'ownerOf',
                  args: [j],
                }).then(owner => ({
                  tokenId: j,
                  owner: owner as string
                })).catch(() => null)
              );
            }
            
            const results = await Promise.all(promises);
            results.forEach(result => {
              if (result && result.owner.toLowerCase() === address.toLowerCase()) {
                nfts.push(result.tokenId);
              }
            });
          }
          
          setUserNFTs(nfts);
        }
      } catch (err) {
        setError('Error fetching NFT data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNFTData();
  }, [address]);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-[300px] rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const allTokenIds = Array.from(
    { length: Number(totalSupply) },
    (_, i) => BigInt(i + 1)
  );

  return (
    <Tabs defaultValue="marketplace" className="space-y-8">
      <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
        <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
        <TabsTrigger value="owned">Your NFTs</TabsTrigger>
      </TabsList>
      
      <TabsContent value="marketplace" className="space-y-8">
        {totalSupply > 0n ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allTokenIds.map((tokenId) => (
              <NFTCard 
                key={tokenId.toString()} 
                tokenId={tokenId} 
                owner={userNFTs.includes(tokenId)} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No NFTs have been minted yet</p>
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="owned" className="space-y-8">
        {address ? (
          userNFTs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userNFTs.map((tokenId) => (
                <NFTCard 
                  key={tokenId.toString()} 
                  tokenId={tokenId} 
                  owner={true} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">You don't own any NFTs yet</p>
            </div>
          )
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Connect your wallet to view your NFTs</p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}