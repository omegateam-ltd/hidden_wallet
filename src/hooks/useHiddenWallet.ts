'use client';

import { useState, useEffect, useCallback } from 'react';
import { HiddenWallet, type WalletOptions, type TransactionOptions } from '../core/HiddenWallet';

export interface UseHiddenWalletReturn {
  wallet: HiddenWallet | null;
  isConnected: boolean;
  publicKey: string | null;
  balance: number | null;
  isLoading: boolean;
  error: Error | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  sendTransaction: (options: TransactionOptions) => Promise<string>;
  getBalance: () => Promise<void>;
  createHiddenAddress: () => Promise<string>;
  getTransactionHistory: (options?: { limit?: number; before?: string }) => Promise<any[]>;
  refresh: () => Promise<void>;
}

export function useHiddenWallet(options: WalletOptions = {}): UseHiddenWalletReturn {
  const [wallet, setWallet] = useState<HiddenWallet | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Initialize wallet
  useEffect(() => {
    const initWallet = () => {
      try {
        const walletInstance = new HiddenWallet(options);
        setWallet(walletInstance);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to initialize wallet'));
      }
    };

    initWallet();
  }, []);

  // Connect wallet
  const connect = useCallback(async () => {
    if (!wallet) {
      setError(new Error('Wallet not initialized'));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await wallet.connect();
      setIsConnected(true);
      setPublicKey(wallet.getPublicKey());
      await getBalance();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to connect wallet'));
      setIsConnected(false);
      setPublicKey(null);
    } finally {
      setIsLoading(false);
    }
  }, [wallet]);

  // Disconnect wallet
  const disconnect = useCallback(async () => {
    if (!wallet) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await wallet.disconnect();
      setIsConnected(false);
      setPublicKey(null);
      setBalance(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to disconnect wallet'));
    } finally {
      setIsLoading(false);
    }
  }, [wallet]);

  // Send transaction
  const sendTransaction = useCallback(async (options: TransactionOptions): Promise<string> => {
    if (!wallet || !isConnected) {
      throw new Error('Wallet not connected');
    }

    setIsLoading(true);
    setError(null);

    try {
      const signature = await wallet.sendTransaction(options);
      // Refresh balance after transaction
      await getBalance();
      return signature;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Transaction failed');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [wallet, isConnected]);

  // Get balance
  const getBalance = useCallback(async () => {
    if (!wallet || !isConnected) {
      return;
    }

    try {
      const walletBalance = await wallet.getBalance();
      setBalance(walletBalance);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to get balance'));
    }
  }, [wallet, isConnected]);

  // Create hidden address
  const createHiddenAddress = useCallback(async (): Promise<string> => {
    if (!wallet) {
      throw new Error('Wallet not initialized');
    }

    setIsLoading(true);
    setError(null);

    try {
      const address = await wallet.createHiddenAddress();
      return address;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create hidden address');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [wallet]);

  // Get transaction history
  const getTransactionHistory = useCallback(async (options?: { limit?: number; before?: string }): Promise<any[]> => {
    if (!wallet || !isConnected) {
      return [];
    }

    try {
      const history = await wallet.getTransactionHistory(options);
      return history;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to get transaction history'));
      return [];
    }
  }, [wallet, isConnected]);

  // Refresh wallet state
  const refresh = useCallback(async () => {
    if (!wallet || !isConnected) {
      return;
    }

    setIsLoading(true);
    try {
      await getBalance();
      setPublicKey(wallet.getPublicKey());
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to refresh'));
    } finally {
      setIsLoading(false);
    }
  }, [wallet, isConnected, getBalance]);

  // Auto-refresh balance on connection
  useEffect(() => {
    if (isConnected && wallet) {
      getBalance();
      // Refresh balance every 30 seconds
      const interval = setInterval(() => {
        getBalance();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [isConnected, wallet, getBalance]);

  return {
    wallet,
    isConnected,
    publicKey,
    balance,
    isLoading,
    error,
    connect,
    disconnect,
    sendTransaction,
    getBalance,
    createHiddenAddress,
    getTransactionHistory,
    refresh
  };
}

