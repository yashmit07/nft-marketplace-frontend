import { 
  createConfig, 
  http, 
  fallback
} from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { 
  metaMask,
  coinbaseWallet,
  walletConnect,
  injected
} from 'wagmi/connectors';

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;

if (!projectId) {
  throw new Error('Missing NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID');
}

// Transport configuration with fallback
const transport = http();

export const config = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: transport
  },
  connectors: [
    injected(),
    metaMask(),
    coinbaseWallet({
      appName: 'NFT Marketplace',
      chainId: sepolia.id,
    }),
    walletConnect({
      projectId,
      metadata: {
        name: 'NFT Marketplace',
        description: 'NFT Marketplace Application',
        url: 'http://localhost:3000',
        icons: ['https://avatars.githubusercontent.com/u/37784886']
      }
    })
  ]
});

// Export config instance
export default config;