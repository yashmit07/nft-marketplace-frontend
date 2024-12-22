import { WalletConnectButton } from './ConnectButton';

export function Navbar() {
  return (
    <nav className="w-full border-b">
      <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
        <h1 className="text-xl font-bold">NFT Marketplace</h1>
        <WalletConnectButton />
      </div>
    </nav>
  );
}