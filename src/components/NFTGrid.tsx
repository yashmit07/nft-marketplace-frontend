import { useEffect, useState } from 'react';
import { useAccount, useContractRead } from 'wagmi';
import { NFT_ABI, NFT_ADDRESS } from '@/constants/contracts';
import NFTCard from './NFTCard';

const NFTGrid = () => {
  const { address } = useAccount();
  const [userNFTs, setUserNFTs] = useState([]);

  // Get total supply of NFTs
  const { data: totalSupply } = useContractRead({
    address: NFT_ADDRESS,
    abi: NFT_ABI,
    functionName: 'totalSupply',
  });

  // Get all NFTs owned by the user
  useEffect(() => {
    const fetchUserNFTs = async () => {
      if (!address || !totalSupply) return;
      
      const nfts = [];
      for (let i = 1; i <= totalSupply; i++) {
        const owner = await NFT_ABI.ownerOf(i);
        if (owner.toLowerCase() === address.toLowerCase()) {
          nfts.push(i);
        }
      }
      setUserNFTs(nfts);
    };

    fetchUserNFTs();
  }, [address, totalSupply]);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Your NFTs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {userNFTs.map((tokenId) => (
          <NFTCard key={tokenId} tokenId={tokenId} owner={true} />
        ))}
      </div>
      
      <h2 className="text-2xl font-bold mb-4 mt-8">Marketplace</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: Number(totalSupply || 0) }, (_, i) => i + 1).map((tokenId) => (
          <NFTCard key={tokenId} tokenId={tokenId} owner={false} />
        ))}
      </div>
    </div>
  );
};

export default NFTGrid;