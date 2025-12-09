'use client';

import { useState, useEffect } from 'react';
import { useHiddenWallet } from '../hooks/useHiddenWallet';
import { Button } from './ui/button';
import { History, ExternalLink, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Transaction {
  signature: string;
  amount?: number;
  date?: Date;
  status?: 'confirmed' | 'pending' | 'failed';
}

export function TransactionHistory() {
  const { getTransactionHistory } = useHiddenWallet();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const history = await getTransactionHistory({ limit: 20 });
      setTransactions(history);
    } catch (err) {
      setError('Failed to load transaction history');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const formatAddress = (address: string) => {
    if (address.length <= 8) return address;
    return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-500';
      case 'pending':
        return 'text-yellow-500';
      case 'failed':
        return 'text-red-500';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <History className="h-5 w-5" />
          Transaction History
        </h3>
        <Button
          onClick={loadHistory}
          disabled={loading}
          variant="outline"
          size="sm"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Loading...
            </>
          ) : (
            'Refresh'
          )}
        </Button>
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
          {error}
        </div>
      )}

      {loading && transactions.length === 0 ? (
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading transactions...</p>
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No transactions yet.</p>
          <p className="text-sm mt-2">Your transaction history will appear here.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {transactions.map((tx, index) => (
            <div
              key={tx.signature || index}
              className="p-3 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-mono truncate">
                      {formatAddress(tx.signature)}
                    </p>
                    {tx.status && (
                      <span className={`text-xs ${getStatusColor(tx.status)}`}>
                        {tx.status}
                      </span>
                    )}
                  </div>
                  {tx.amount !== undefined && (
                    <p className="text-sm text-muted-foreground">
                      {tx.amount} SOL
                    </p>
                  )}
                  {tx.date && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(tx.date, { addSuffix: true })}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    window.open(
                      `https://solscan.io/tx/${tx.signature}`,
                      '_blank'
                    );
                  }}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

