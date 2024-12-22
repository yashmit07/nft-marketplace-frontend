// src/types/contracts.ts
export interface NFTListing {
    price: bigint;
    seller: string;
    isActive: boolean;
  }
  
  export interface NFTCardProps {
    tokenId: number;
    owner: boolean;
  }