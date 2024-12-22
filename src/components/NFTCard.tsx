import { useState } from 'react';
import { useContractRead, useContractWrite, useWaitForTransaction } from 'wagmi';
import { parseEther } from 'viem';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { NFT_ABI, NFT_ADDRESS, MARKETPLACE_ABI, MARKETPLACE_ADDRESS } from '@/constants/contracts';

const NFTCard = ({ tokenId, owner }) => {
  const [listingPrice, setListingPrice] = useState('');
  
  // Read NFT metadata
  const { data: tokenURI } = useContractRead({
    address: NFT_ADDRESS,
    abi: NFT_ABI,
    functionName: 'tokenURI',
    args: [tokenId],
  });

  // Read if NFT is listed
  const { data: listing } = useContractRead({
    address: MARKETPLACE_ADDRESS,
    abi: MARKETPLACE_ABI,
    functionName: 'getListing',
    args: [tokenId],
  });

  // Approve NFT for marketplace
  const { write: approveNFT, data: approveData } = useContractWrite({
    address: NFT_ADDRESS,
    abi: NFT_ABI,
    functionName: 'approve',
    args: [MARKETPLACE_ADDRESS, tokenId],
  });

  const { isLoading: isApprovePending } = useWaitForTransaction({
    hash: approveData?.hash,
  });

  // List NFT
  const { write: listNFT, data: listData } = useContractWrite({
    address: MARKETPLACE_ADDRESS,
    abi: MARKETPLACE_ABI,
    functionName: 'listNFT',
    args: [tokenId, parseEther(listingPrice || '0')],
  });

  const { isLoading: isListPending } = useWaitForTransaction({
    hash: listData?.hash,
  });

  // Buy NFT
  const { write: buyNFT, data: buyData } = useContractWrite({
    address: MARKETPLACE_ADDRESS,
    abi: MARKETPLACE_ABI,
    functionName: 'buyNFT',
    args: [tokenId],
    value: listing?.price,
  });

  const { isLoading: isBuyPending } = useWaitForTransaction({
    hash: buyData?.hash,
  });

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>NFT #{tokenId}</CardTitle>
        <CardDescription>Owner: {owner}</CardDescription>
      </CardHeader>
      <CardContent>
        {listing && listing.price ? (
          <div className="space-y-2">
            <p>Listed Price: {listing.price} ETH</p>
            <Button 
              onClick={() => buyNFT?.()} 
              disabled={isBuyPending}
              className="w-full"
            >
              {isBuyPending ? 'Buying...' : 'Buy NFT'}
            </Button>
          </div>
        ) : owner === true ? (
          <div className="space-y-2">
            <Input
              type="number"
              placeholder="Price in ETH"
              value={listingPrice}
              onChange={(e) => setListingPrice(e.target.value)}
              min="0"
              step="0.01"
            />
            <Button 
              onClick={() => approveNFT?.()} 
              disabled={isApprovePending}
              className="w-full mb-2"
            >
              {isApprovePending ? 'Approving...' : 'Approve'}
            </Button>
            <Button 
              onClick={() => listNFT?.()} 
              disabled={isListPending || !listingPrice}
              className="w-full"
            >
              {isListPending ? 'Listing...' : 'List NFT'}
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default NFTCard;