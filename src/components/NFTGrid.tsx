'use client';

import { useEffect, useState } from 'react';
import { useAccount, usePublicClient } from 'wagmi';
import { readContract, writeContract } from '@wagmi/core';
import { NFT_ABI, NFT_ADDRESS, MARKETPLACE_ABI, MARKETPLACE_ADDRESS } from '@/constants/contracts';
import { config } from '@/config/wagmi';
import NFTCard from './NFTCard';
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Skeleton } from "../../components/ui/skeleton";
import { Button } from "../../components/ui/button";
import { useToast } from "../../components/ui/use-toast";
import { type Address } from 'viem';

interface NFTGridProps {
  view: 'all' | 'owned' | 'listed';
}

interface NFTListing {
  seller: Address;
  price: bigint;
}

export default function NFTGrid({ view }: NFTGridProps) {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { toast } = useToast();
  const [userNFTs, setUserNFTs] = useState<bigint[]>([]);
  const [listedNFTs, setListedNFTs] = useState<bigint[]>([]);
  const [totalSupply, setTotalSupply] = useState<bigint>(0n);
  const [isLoading, setIsLoading] = useState(true);
  const [isMinting, setIsMinting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNFTData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch total supply
      const supply = await readContract(config, {
        address: NFT_ADDRESS,
        abi: NFT_ABI,
        functionName: 'totalSupply',
      }) as bigint;
      
      setTotalSupply(supply);

      // Fetch listed NFTs if supply exists
      if (supply > 0n) {
        const listedTokens: bigint[] = [];
        
        // Use Promise.all for parallel requests
        const listingPromises = Array.from({ length: Number(supply) }, (_, i) => 
          readContract(config, {
            address: MARKETPLACE_ADDRESS,
            abi: MARKETPLACE_ABI,
            functionName: 'getListing',
            args: [NFT_ADDRESS, BigInt(i + 1)],
          }).catch(err => {
            console.error(`Error checking listing for token ${i + 1}:`, err);
            return null;
          })
        );

        const listings = await Promise.all(listingPromises);
        listings.forEach((listing, index) => {
          if (listing && (listing as NFTListing).price > 0n) {
            listedTokens.push(BigInt(index + 1));
          }
        });
        
        setListedNFTs(listedTokens);
      }

      // Fetch user's NFTs if connected and supply exists
      if (address && supply > 0n) {
        const balance = await readContract(config, {
          address: NFT_ADDRESS,
          abi: NFT_ABI,
          functionName: 'balanceOf',
          args: [address],
        }) as bigint;

        if (balance > 0n) {
          const tokenPromises = Array.from({ length: Number(balance) }, (_, i) =>
            readContract(config, {
              address: NFT_ADDRESS,
              abi: NFT_ABI,
              functionName: 'tokenOfOwnerByIndex',
              args: [address, BigInt(i)],
            })
          );

          const tokens = await Promise.all(tokenPromises);
          setUserNFTs(tokens as bigint[]);
        }
      }
    } catch (err) {
      console.error('Error fetching NFT data:', err);
      setError('Error fetching NFT data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMint = async () => {
    if (!address) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please connect your wallet first",
      });
      return;
    }
    
    try {
      setIsMinting(true);
      setError(null);
      
      const hash = await writeContract(config, {
        address: NFT_ADDRESS,
        abi: NFT_ABI,
        functionName: 'safeMint',
        args: [address, "ipfs://QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/1"],
      });
      
      toast({
        title: "Transaction Submitted",
        description: "Please wait for confirmation...",
      });
      
      const receipt = await publicClient.waitForTransactionReceipt({
        hash,
      });
      
      toast({
        title: "NFT Minted Successfully!",
        description: `Transaction hash: ${hash}`,
        duration: 5000,
      });
      
      await fetchNFTData();
    } catch (err: any) {
      console.error('Minting error:', err);
      setError(err?.message || 'Error minting NFT. Please try again.');
      
      toast({
        variant: "destructive",
        title: "Minting Failed",
        description: err.message || 'Error minting NFT',
      });
    } finally {
      setIsMinting(false);
    }
  };

  useEffect(() => {
    fetchNFTData();
  }, [address]);

  const renderMintSection = () => {
    if (view !== 'all') return null;

    return (
      <div className="flex flex-col items-center justify-center py-8">
        {error && (
          <Alert variant="destructive" className="mb-6 max-w-lg mx-auto">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Button 
          onClick={handleMint} 
          disabled={isMinting}
          size="lg"
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-6 px-12 rounded-lg shadow-lg transform transition-all hover:scale-105"
        >
          {isMinting ? 'Minting...' : 'Mint New NFT'}
        </Button>
        <p className="mt-4 text-gray-400 text-sm">
          Mint your unique NFT to get started with trading
        </p>
      </div>
    );
  };

  const allTokenIds = Array.from(
    { length: Number(totalSupply) },
    (_, i) => BigInt(i + 1)
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-[300px] rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {renderMintSection()}
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {!error && totalSupply === 0n && (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-white mb-2">No NFTs Yet</h3>
          <p className="text-gray-400">Be the first one to mint an NFT!</p>
        </div>
      )}
      
      {!error && totalSupply > 0n && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {view === 'all' && allTokenIds.map((tokenId) => (
            <NFTCard 
              key={tokenId.toString()} 
              tokenId={tokenId} 
              owner={userNFTs.includes(tokenId)} 
            />
          ))}
          {view === 'owned' && userNFTs.map((tokenId) => (
            <NFTCard 
              key={tokenId.toString()} 
              tokenId={tokenId} 
              owner={true} 
            />
          ))}
          {view === 'listed' && listedNFTs.map((tokenId) => (
            <NFTCard 
              key={tokenId.toString()} 
              tokenId={tokenId} 
              owner={userNFTs.includes(tokenId)} 
            />
          ))}
        </div>
      )}
    </div>
  );
}