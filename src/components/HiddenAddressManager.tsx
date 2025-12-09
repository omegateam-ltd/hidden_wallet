'use client';

import { useState, useEffect } from 'react';
import { useHiddenWallet } from '../hooks/useHiddenWallet';
import { Button } from './ui/button';
import { Shield, Plus, Trash2, Copy, Check } from 'lucide-react';

export function HiddenAddressManager() {
  const { createHiddenAddress } = useHiddenWallet();
  const [hiddenAddresses, setHiddenAddresses] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    // Load saved addresses from localStorage
    const saved = localStorage.getItem('hidden-addresses');
    if (saved) {
      try {
        setHiddenAddresses(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load hidden addresses:', e);
      }
    }
  }, []);

  const saveAddresses = (addresses: string[]) => {
    localStorage.setItem('hidden-addresses', JSON.stringify(addresses));
    setHiddenAddresses(addresses);
  };

  const handleCreateAddress = async () => {
    setLoading(true);
    try {
      const address = await createHiddenAddress();
      saveAddresses([...hiddenAddresses, address]);
    } catch (error) {
      console.error('Failed to create hidden address:', error);
      alert('Failed to create hidden address');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = (address: string) => {
    if (confirm('Are you sure you want to delete this hidden address?')) {
      saveAddresses(hiddenAddresses.filter(addr => addr !== address));
    }
  };

  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopied(address);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Hidden Addresses
        </h3>
        <Button
          onClick={handleCreateAddress}
          disabled={loading}
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          {loading ? 'Creating...' : 'Create New'}
        </Button>
      </div>

      {hiddenAddresses.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>No hidden addresses yet.</p>
          <p className="text-sm mt-2">Create one to start using hidden transactions.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {hiddenAddresses.map((address, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 border rounded-lg bg-card"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-mono truncate">{address}</p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(address)}
                >
                  {copied === address ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteAddress(address)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

