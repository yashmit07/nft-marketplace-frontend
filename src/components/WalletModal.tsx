// components/WalletModal.tsx
'use client';

import { useState } from 'react';
import { useConnect } from 'wagmi';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";

export default function WalletModal() {
  const [open, setOpen] = useState(false);
  const { connect, connectors, error, isPending } = useConnect();

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          width: '100%',
          background: 'linear-gradient(to right, #c042ff, #8a2be2)',
          color: '#FFFFFF',
          padding: '12px 20px',
          borderRadius: '12px',
          border: 'none',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 600,
          transition: 'all 0.2s ease',
          boxShadow: '0 4px 12px rgba(138, 43, 226, 0.25)'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(138, 43, 226, 0.35)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(138, 43, 226, 0.25)';
        }}
      >
        Connect Wallet
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent style={{
          backgroundColor: 'rgba(18, 18, 18, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: 0,
          color: '#FFFFFF',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
        }}>
          <DialogHeader style={{
            padding: '20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <DialogTitle style={{
              color: '#FFFFFF',
              fontSize: '18px',
              fontWeight: 600
            }}>
              Connect your wallet
            </DialogTitle>
          </DialogHeader>
          
          <div style={{ padding: '12px' }}>
            {connectors.map((connector) => (
              <button
                key={connector.uid}
                onClick={() => {
                  connect({ connector });
                  setOpen(false);
                }}
                disabled={isPending}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '14px 18px',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  fontSize: '14px',
                  marginBottom: '8px',
                  transition: 'all 0.2s ease',
                  opacity: isPending ? 0.5 : 1
                }}
                onMouseOver={(e) => {
                  if (!isPending) {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.07)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isPending) {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                {connector.name}
                {isPending && ' (connecting...)'}
              </button>
            ))}
          </div>

          {error && (
            <div style={{
              padding: '16px 20px',
              color: '#ff4d4d',
              fontSize: '14px',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(255, 77, 77, 0.1)'
            }}>
              {error.message}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}