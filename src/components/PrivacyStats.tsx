'use client';

import { useState, useEffect } from 'react';
import { useHiddenWallet } from '../hooks/useHiddenWallet';
import { Shield, Eye, Lock, Zap } from 'lucide-react';

interface PrivacyStats {
  totalTransactions: number;
  hiddenTransactions: number;
  mixingPoolSize: number;
  proxyNodes: number;
}

export function PrivacyStats() {
  const { wallet } = useHiddenWallet();
  const [stats, setStats] = useState<PrivacyStats>({
    totalTransactions: 0,
    hiddenTransactions: 0,
    mixingPoolSize: 0,
    proxyNodes: 0
  });

  useEffect(() => {
    // Load stats from localStorage or calculate from wallet
    const loadStats = () => {
      const saved = localStorage.getItem('privacy-stats');
      if (saved) {
        try {
          setStats(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to load privacy stats:', e);
        }
      }
    };

    loadStats();
    
    // Update stats periodically
    const interval = setInterval(loadStats, 5000);
    return () => clearInterval(interval);
  }, [wallet]);

  const privacyScore = stats.totalTransactions > 0
    ? Math.round((stats.hiddenTransactions / stats.totalTransactions) * 100)
    : 0;

  const statCards = [
    {
      label: 'Privacy Score',
      value: `${privacyScore}%`,
      icon: <Shield className="h-5 w-5" />,
      description: 'Transactions protected'
    },
    {
      label: 'Total Transactions',
      value: stats.totalTransactions.toString(),
      icon: <Zap className="h-5 w-5" />,
      description: 'All transactions'
    },
    {
      label: 'Hidden Transactions',
      value: stats.hiddenTransactions.toString(),
      icon: <Eye className="h-5 w-5" />,
      description: 'With privacy enabled'
    },
    {
      label: 'Mixing Pool',
      value: stats.mixingPoolSize.toString(),
      icon: <Lock className="h-5 w-5" />,
      description: 'Available addresses'
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Privacy Statistics</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="p-4 border rounded-lg bg-card"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-muted-foreground">
                {stat.icon}
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
            <p className="text-sm font-medium">{stat.label}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {stat.description}
            </p>
          </div>
        ))}
      </div>

      {privacyScore < 50 && (
        <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <p className="text-sm text-yellow-600 dark:text-yellow-400">
            ⚠️ Your privacy score is low. Consider enabling privacy for more transactions.
          </p>
        </div>
      )}
    </div>
  );
}

