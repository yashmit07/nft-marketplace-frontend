// components/WalletModal.tsx
'use client';

import { useState } from 'react';
import { useConnect } from 'wagmi';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";

export default function WalletModal() {
  const [open, setOpen] = useState(false);
  const { connect, connectors, error, isPending } = useConnect();

  return (
    <>
      <Button onClick={() => setOpen(true)} className="bg-gradient-to-r from-purple-500 to-pink-500">
        Connect Wallet
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect your wallet</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {connectors.map((connector) => (
              <Button
                key={connector.uid}
                onClick={() => {
                  connect({ connector });
                  setOpen(false);
                }}
                disabled={isPending}
                className="w-full justify-start gap-4"
              >
                {connector.name}
                {isPending && ' (connecting...)'}
              </Button>
            ))}
          </div>

          {error && (
            <div className="text-red-500 text-sm mt-2">
              {error.message}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}