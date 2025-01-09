'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import { readContract, writeContract } from '@wagmi/core';
import { parseEther, formatEther, type Address } from 'viem';
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Skeleton } from "../../components/ui/skeleton";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { NFT_ABI, NFT_ADDRESS, MARKETPLACE_ABI, MARKETPLACE_ADDRESS } from '@/constants/contracts';
import { config } from '@/config/wagmi';

interface NFTCardProps {
  tokenId: bigint;
  owner: boolean;
}

interface NFTListing {
  seller: Address;
  price: bigint;
}

export default function NFTCard({ tokenId, owner }: NFTCardProps) {
  const { address } = useAccount();
  const [listingPrice, setListingPrice] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenData, setTokenData] = useState<{ uri: string; listing: NFTListing | null }>({
    uri: '',
    listing: null
  });

  const fetchNFTData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [uri, listing] = await Promise.all([
        readContract(config, {
          address: NFT_ADDRESS,
          abi: NFT_ABI,
          functionName: 'tokenURI',
          args: [tokenId],
        }),
        readContract(config, {
          address: MARKETPLACE_ADDRESS,
          abi: MARKETPLACE_ABI,
          functionName: 'getListing',
          args: [NFT_ADDRESS, tokenId],
        }),
      ]);

      let metadata = null;
      try {
        const response = await fetch(uri as string);
        metadata = await response.json();
      } catch (err) {
        console.error('Error fetching metadata:', err);
      }

      setTokenData({
        uri: uri as string,
        listing: listing as NFTListing,
        metadata,
      });
    } catch (err) {
      setError('Error fetching NFT data');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await writeContract(config, {
        address: NFT_ADDRESS,
        abi: NFT_ABI,
        functionName: 'approve',
        args: [MARKETPLACE_ADDRESS, tokenId],
      });
      
      console.log('Approval submitted:', result);
    } catch (err) {
      setError('Error approving NFT');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleList = async () => {
    if (!listingPrice) return;
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await writeContract(config, {
        address: MARKETPLACE_ADDRESS,
        abi: MARKETPLACE_ABI,
        functionName: 'listItem',
        args: [NFT_ADDRESS, tokenId, parseEther(listingPrice)],
      });
      
      console.log('Listing submitted:', result);
      setListingPrice('');
      await fetchNFTData(); // Refresh data
    } catch (err) {
      setError('Error listing NFT');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuy = async () => {
    if (!tokenData.listing) return;
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await writeContract(config, {
        address: MARKETPLACE_ADDRESS,
        abi: MARKETPLACE_ABI,
        functionName: 'buyItem',
        args: [NFT_ADDRESS, tokenId],
        value: tokenData.listing.price,
      });
      
      console.log('Purchase submitted:', result);
      await fetchNFTData(); // Refresh data
    } catch (err) {
      setError('Error buying NFT');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-4 w-[250px]" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-full" />
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>NFT #{tokenId.toString()}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {tokenData.metadata?.image && (
          <img 
            src={tokenData.metadata.image} 
            alt={tokenData.metadata?.name || `NFT #${tokenId.toString()}`}
            className="w-full h-48 object-cover rounded-lg"
          />
        )}

        {tokenData.listing && !owner ? (
          <div className="space-y-4">
            <p className="font-semibold">
              Listed for {formatEther(tokenData.listing.price)} ETH
            </p>
            <Button 
              onClick={handleBuy} 
              disabled={isLoading || tokenData.listing.seller === address}
              className="w-full"
            >
              {isLoading ? 'Processing...' : 'Buy Now'}
            </Button>
          </div>
        ) : owner && (
          <div className="space-y-4">
            <Input
              type="number"
              placeholder="List price in ETH"
              value={listingPrice}
              onChange={(e) => setListingPrice(e.target.value)}
              min="0"
              step="0.001"
            />
            <div className="space-y-2">
              <Button 
                onClick={handleApprove} 
                disabled={isLoading}
                className="w-full"
                variant="outline"
              >
                {isLoading ? 'Approving...' : 'Approve'}
              </Button>
              <Button 
                onClick={handleList} 
                disabled={isLoading || !listingPrice}
                className="w-full"
              >
                {isLoading ? 'Listing...' : 'List NFT'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}