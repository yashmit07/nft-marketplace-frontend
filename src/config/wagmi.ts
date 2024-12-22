import { createConfig, http } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { injected, metaMask, coinbaseWallet, walletConnect } from 'wagmi/connectors';

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;

if (!projectId) {
  throw new Error('Missing projectId');
}

export const config = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http()
  },
  connectors: [
    metaMask(),
    coinbaseWallet({
      appName: 'NFT Marketplace',
    }),
    walletConnect({
      projectId,
      metadata: {
        name: 'NFT Marketplace',
        description: 'NFT Marketplace Application',
        url: 'https://nftmarketplace.com',
        icons: ['https://avatars.githubusercontent.com/u/37784886']
      }
    })
  ]
});