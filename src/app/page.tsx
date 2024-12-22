import { Navbar } from '@/components/Navbar';

export default function Home() {
  return (
    <main>
      <Navbar />
      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-4xl font-bold">Welcome to NFT Marketplace</h1>
      </div>
    </main>
  );
}