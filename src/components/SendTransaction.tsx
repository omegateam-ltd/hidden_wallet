'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import '@/app/globals.css';
import { useHiddenWallet } from '../hooks/useHiddenWallet';
import { Send, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export function SendTransaction() {
  const { sendTransaction, isConnected, isLoading } = useHiddenWallet();
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [hideOrigin, setHideOrigin] = useState(true);
  const [txSignature, setTxSignature] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!to || !amount) {
      toast.error('Please fill in all fields');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      const signature = await sendTransaction({
        to,
        amount: amountNum,
        hideOrigin
      });

      setTxSignature(signature);
      toast.success('Transaction sent successfully!');
      
      // Reset form
      setTo('');
      setAmount('');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Transaction failed');
    }
  };

  return (
    <div className="w-full space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="to" className="text-white/80">Recipient Address</Label>
          <Input
            id="to"
            type="text"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="Enter Solana address"
            disabled={isLoading || !isConnected}
            className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
          />
        </div>

        <div>
          <Label htmlFor="amount" className="text-white/80">Amount (SOL)</Label>
          <Input
            id="amount"
            type="number"
            step="0.000000001"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            disabled={isLoading || !isConnected}
            className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="hideOrigin"
            checked={hideOrigin}
            onChange={(e) => setHideOrigin(e.target.checked)}
            disabled={isLoading || !isConnected}
            className="rounded bg-white/5 border-white/20"
          />
          <Label htmlFor="hideOrigin" className="cursor-pointer text-white/80">
            Hide transaction origin
          </Label>
        </div>

        <Button
          type="submit"
          disabled={isLoading || !isConnected}
          className="w-full bg-[#64C8FF] hover:bg-[#4AB8FF] text-[#0F1E32] font-medium"
          style={{
            boxShadow: '0 0 15px rgba(100, 200, 255, 0.5), 0 0 30px rgba(100, 200, 255, 0.3)'
          }}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Send Transaction
            </>
          )}
        </Button>
      </form>

      {txSignature && (
        <div className="mt-4 p-4 bg-[#64C8FF]/20 border border-[#64C8FF]/30 rounded-lg glow-border">
          <div className="flex items-center gap-2 text-[#64C8FF]">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-sm font-medium">Transaction successful!</span>
          </div>
          <div className="mt-2 text-xs text-white/60 break-all font-mono">
            {txSignature}
          </div>
        </div>
      )}
    </div>
  );
}

