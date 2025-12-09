'use client';

import { Button } from './ui/button';
import { useHiddenWallet } from '../hooks/useHiddenWallet';
import { Wallet, LogOut, Loader2 } from 'lucide-react';

export function WalletConnection() {
  const {
    isConnected,
    publicKey,
    balance,
    isLoading,
    error,
    connect,
    disconnect
  } = useHiddenWallet({
    network: 'mainnet-beta',
    securityLevel: 'standard'
  });

  const formatAddress = (address: string | null) => {
    if (!address) return '';
    return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
  };

  if (isConnected) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <div className="text-sm font-medium text-white">{formatAddress(publicKey)}</div>
          {balance !== null && (
            <div className="text-xs text-white/60">
              {balance.toFixed(4)} SOL
            </div>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={disconnect}
          disabled={isLoading}
          className="border-white/20 text-white hover:bg-white/10"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <LogOut className="h-4 w-4 mr-2" />
              Disconnect
            </>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <Button
        onClick={connect}
        disabled={isLoading}
        className="bg-[#64C8FF] text-[#0F1E32] border border-[#64C8FF] hover:bg-[#4AB8FF] font-medium"
        style={{
          boxShadow: '0 0 15px rgba(100, 200, 255, 0.5), 0 0 30px rgba(100, 200, 255, 0.3)'
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <Wallet className="h-4 w-4 mr-2" />
        )}
        Connect Wallet
      </Button>
      {error && (
        <div className="text-sm text-red-400">
          {error.message}
        </div>
      )}
    </div>
  );
}

