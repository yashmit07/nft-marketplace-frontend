# NFT Marketplace Frontend

A modern NFT marketplace built with Next.js, RainbowKit, and Wagmi. This application allows users to connect their Web3 wallets, browse NFTs, and interact with the NFT marketplace smart contracts.

## Features

- 🌈 Modern UI with Tailwind CSS
- 👛 Web3 Wallet Integration using RainbowKit
- ⛓️ Blockchain Interaction with Wagmi and Viem
- 🎨 NFT Display and Management
- 🔄 Real-time Updates
- 📱 Responsive Design

## Tech Stack

- [Next.js](https://nextjs.org/) - React Framework
- [RainbowKit](https://www.rainbowkit.com/) - Wallet Connection
- [Wagmi](https://wagmi.sh/) - Web3 Hooks
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Radix UI](https://www.radix-ui.com/) - UI Components
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [TypeScript](https://www.typescriptlang.org/) - Type Safety

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- A Web3 wallet (e.g., MetaMask)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd nft-marketplace-frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory and add your environment variables:
```env
NEXT_PUBLIC_ALCHEMY_ID=your_alchemy_id
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
├── src/
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   ├── config/          # Configuration files
│   └── lib/             # Utility functions
├── public/              # Static assets
└── components/ui/       # UI components
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
