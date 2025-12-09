'use client';

import { useState } from 'react';
import { X, Send, Database, Settings, Activity, Key, Network } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface BackendPanelProps {
  onClose: () => void;
}

export function BackendPanel({ onClose }: BackendPanelProps) {
  const [activeTab, setActiveTab] = useState<'transactions' | 'network' | 'security' | 'logs'>('transactions');
  const [apiEndpoint, setApiEndpoint] = useState('https://api.hidden-wallet.com');
  const [apiKey, setApiKey] = useState('');
  const [requestBody, setRequestBody] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const tabs = [
    { id: 'transactions', label: 'Transactions', icon: Send },
    { id: 'network', label: 'Network', icon: Network },
    { id: 'security', label: 'Security', icon: Key },
    { id: 'logs', label: 'Logs', icon: Activity },
  ];

  const handleApiRequest = async (method: string, endpoint: string, body?: any) => {
    setLoading(true);
    try {
      const response = await fetch(`${apiEndpoint}${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: body ? JSON.stringify(body) : undefined,
      });
      
      const data = await response.json();
      setResponse(data);
    } catch (error) {
      setResponse({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Panel */}
      <div className="relative w-full max-w-6xl max-h-[90vh] bg-[#0F1E32] border border-[#64C8FF]/30 rounded-2xl overflow-hidden flex flex-col glow-border">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#64C8FF]/20">
          <div>
            <h2 className="text-2xl font-bold">Backend Panel</h2>
            <p className="text-sm text-white/60 mt-1">Interact with Hidden Wallet backend API</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#64C8FF]/20">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#64C8FF] text-[#64C8FF]'
                    : 'border-transparent text-white/60 hover:text-[#64C8FF]'
                }`}
              >
                <Icon size={18} />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Transactions Tab */}
          {activeTab === 'transactions' && (
            <div className="space-y-6">
              <div className="glass rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4">Send Transaction</h3>
                <div className="space-y-4">
                  <div>
                    <Label>To Address</Label>
                    <Input
                      placeholder="Enter recipient address"
                      className="bg-white/5 border-white/20"
                    />
                  </div>
                  <div>
                    <Label>Amount (SOL)</Label>
                    <Input
                      type="number"
                      placeholder="0.0"
                      className="bg-white/5 border-white/20"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleApiRequest('POST', '/api/transactions/send', {
                        to: '',
                        amount: 0,
                      })}
                      className="bg-[#64C8FF] hover:bg-[#4AB8FF] text-[#0F1E32] font-medium"
                      style={{
                        boxShadow: '0 0 15px rgba(100, 200, 255, 0.5)'
                      }}
                    >
                      Send Transaction
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleApiRequest('GET', '/api/transactions')}
                    >
                      Get History
                    </Button>
                  </div>
                </div>
              </div>

              <div className="glass rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4">Transaction Status</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-[#64C8FF]/10 rounded glow-border">
                    <span className="text-sm">Pending Transactions</span>
                    <span className="text-[#64C8FF] font-bold">0</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#64C8FF]/10 rounded glow-border">
                    <span className="text-sm">Confirmed Transactions</span>
                    <span className="text-white font-bold">0</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#64C8FF]/10 rounded glow-border">
                    <span className="text-sm">Failed Transactions</span>
                    <span className="text-red-400 font-bold">0</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Network Tab */}
          {activeTab === 'network' && (
            <div className="space-y-6">
              <div className="glass rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4">Proxy Nodes</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded">
                    <div>
                      <span className="font-medium">Node 1</span>
                      <p className="text-sm text-white/60">https://proxy1.hidden-wallet.com</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#64C8FF] rounded-full shadow-[0_0_6px_rgba(100,200,255,0.8)]"></div>
                      <span className="text-sm text-[#64C8FF]">Online</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded">
                    <div>
                      <span className="font-medium">Node 2</span>
                      <p className="text-sm text-white/60">https://proxy2.hidden-wallet.com</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#64C8FF] rounded-full shadow-[0_0_6px_rgba(100,200,255,0.8)]"></div>
                      <span className="text-sm text-[#64C8FF]">Online</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4">Network Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-[#64C8FF]/10 rounded glow-border">
                    <p className="text-sm text-white/60 mb-1">Total Requests</p>
                    <p className="text-2xl font-bold">1,234</p>
                  </div>
                  <div className="p-4 bg-[#64C8FF]/10 rounded glow-border">
                    <p className="text-sm text-white/60 mb-1">Avg Latency</p>
                    <p className="text-2xl font-bold">45ms</p>
                  </div>
                  <div className="p-4 bg-[#64C8FF]/10 rounded glow-border">
                    <p className="text-sm text-white/60 mb-1">Success Rate</p>
                    <p className="text-2xl font-bold text-[#64C8FF]">99.8%</p>
                  </div>
                  <div className="p-4 bg-[#64C8FF]/10 rounded glow-border">
                    <p className="text-sm text-white/60 mb-1">Active Nodes</p>
                    <p className="text-2xl font-bold">12</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="glass rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4">API Configuration</h3>
                <div className="space-y-4">
                  <div>
                    <Label>API Endpoint</Label>
                    <Input
                      value={apiEndpoint}
                      onChange={(e) => setApiEndpoint(e.target.value)}
                      className="bg-white/5 border-white/20"
                    />
                  </div>
                  <div>
                    <Label>API Key</Label>
                    <Input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Enter your API key"
                      className="bg-white/5 border-white/20"
                    />
                  </div>
                  <Button 
                    className="bg-[#64C8FF] hover:bg-[#4AB8FF] text-[#0F1E32] font-medium"
                    style={{
                      boxShadow: '0 0 15px rgba(100, 200, 255, 0.5)'
                    }}
                  >
                    Save Configuration
                  </Button>
                </div>
              </div>

              <div className="glass rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4">Security Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-[#64C8FF]/10 rounded glow-border">
                    <span className="text-sm">Encryption</span>
                    <span className="text-[#64C8FF] font-bold">Active</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#64C8FF]/10 rounded glow-border">
                    <span className="text-sm">Proxy Routing</span>
                    <span className="text-[#64C8FF] font-bold">Enabled</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#64C8FF]/10 rounded glow-border">
                    <span className="text-sm">Transaction Mixing</span>
                    <span className="text-[#64C8FF] font-bold">Active</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Logs Tab */}
          {activeTab === 'logs' && (
            <div className="space-y-6">
              <div className="glass rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4">API Request</h3>
                <div className="space-y-4">
                  <div>
                    <Label>Request Body (JSON)</Label>
                    <textarea
                      value={requestBody}
                      onChange={(e) => setRequestBody(e.target.value)}
                      className="w-full h-32 p-3 bg-white/5 border border-white/20 rounded-lg text-sm font-mono"
                      placeholder='{"method": "GET", "endpoint": "/api/status"}'
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        try {
                          const body = requestBody ? JSON.parse(requestBody) : {};
                          handleApiRequest('POST', '/api/execute', body);
                        } catch (e) {
                          setResponse({ error: 'Invalid JSON' });
                        }
                      }}
                      className="bg-[#64C8FF] hover:bg-[#4AB8FF] text-[#0F1E32] font-medium"
                      style={{
                        boxShadow: '0 0 15px rgba(100, 200, 255, 0.5)'
                      }}
                      disabled={loading}
                    >
                      {loading ? 'Sending...' : 'Execute Request'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setRequestBody('')}
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              </div>

              <div className="glass rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4">Response</h3>
                <div className="p-4 bg-black/30 rounded-lg">
                  <pre className="text-xs font-mono text-white/80 overflow-x-auto">
                    {response ? JSON.stringify(response, null, 2) : 'No response yet...'}
                  </pre>
                </div>
              </div>

              <div className="glass rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4">Activity Logs</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {[
                    { time: '10:23:45', level: 'info', message: 'Transaction sent successfully' },
                    { time: '10:23:40', level: 'info', message: 'Wallet connected' },
                    { time: '10:23:35', level: 'warning', message: 'Proxy node latency high' },
                  ].map((log, i) => (
                    <div key={i} className="flex items-start gap-3 p-2 bg-white/5 rounded text-sm">
                      <span className="text-white/40 font-mono">{log.time}</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        log.level === 'info' ? 'bg-[#64C8FF]/20 text-[#64C8FF]' :
                        log.level === 'warning' ? 'bg-yellow-500/20 text-yellow-500' :
                        'bg-red-500/20 text-red-500'
                      }`}>
                        {log.level}
                      </span>
                      <span className="text-white/80">{log.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

