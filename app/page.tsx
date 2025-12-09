'use client';

import { useState } from 'react';
import { WalletConnection } from '@/components/WalletConnection';
import { SendTransaction } from '@/components/SendTransaction';
import { HiddenAddressManager } from '@/components/HiddenAddressManager';
import { SecuritySettings } from '@/components/SecuritySettings';
import { TransactionHistory } from '@/components/TransactionHistory';
import { PrivacyStats } from '@/components/PrivacyStats';
import { BackendPanel } from '@/components/BackendPanel';
import { Shield, Lock, Eye, Zap, Menu, X, ArrowRight } from 'lucide-react';
// import Image from 'next/image'; // Uncomment when you add the actual image

export default function Home() {
  const [securityLevel, setSecurityLevel] = useState<'basic' | 'standard' | 'high'>('standard');
  const [showBackendPanel, setShowBackendPanel] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0F1E32] text-white relative overflow-hidden animated-gradient">
      {/* Grid Pattern Background */}
      <div className="fixed inset-0 grid-pattern pointer-events-none opacity-30"></div>
      
      {/* Gradient Overlay */}
      <div className="fixed inset-0 gradient-bg pointer-events-none"></div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-[#64C8FF] rounded-full shadow-[0_0_8px_rgba(100,200,255,0.8)]"></div>
                <div className="w-2 h-2 bg-[#64C8FF] rounded-full mt-1 shadow-[0_0_8px_rgba(100,200,255,0.8)]"></div>
                <div className="w-2 h-2 bg-[#64C8FF] rounded-full shadow-[0_0_8px_rgba(100,200,255,0.8)]"></div>
              </div>
              <span className="text-xl font-bold tracking-tight neon-glow">HIDDEN WALLET</span>
            </div>
            
            <nav className="hidden md:flex items-center gap-8 text-sm">
              <a href="#features" className="hover:text-[#64C8FF] transition-colors">FEATURES</a>
              <a href="#security" className="hover:text-[#64C8FF] transition-colors">SECURITY</a>
              <a href="#docs" className="hover:text-[#64C8FF] transition-colors">DOCS</a>
              <button 
                onClick={() => setShowBackendPanel(true)}
                className="btn-secondary text-sm"
              >
                BACKEND PANEL
              </button>
            </nav>

            <button 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-[#0F1717] z-50 p-6">
          <div className="flex flex-col gap-6">
            <a href="#features" className="text-lg" onClick={() => setMobileMenuOpen(false)}>FEATURES</a>
            <a href="#security" className="text-lg" onClick={() => setMobileMenuOpen(false)}>SECURITY</a>
            <a href="#docs" className="text-lg" onClick={() => setMobileMenuOpen(false)}>DOCS</a>
            <button 
              onClick={() => {
                setShowBackendPanel(true);
                setMobileMenuOpen(false);
              }}
              className="btn-secondary text-left"
            >
              BACKEND PANEL
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="neon-glow">Hidden</span>
              <br />
              <span className="neon-glow-green">Wallet</span>
            </h1>
          
            <div className="space-y-4 mb-8 text-lg md:text-xl text-white/80">
              <p>
                Hidden Wallet built the foundation for private Solana transactions—powering everything from encrypted keys to transaction mixing.
              </p>
              <p>
                Now with advanced privacy layers, we're showcasing the fusion of breakthrough security infrastructure and zero-knowledge privacy: real-time protection, unleashed.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="btn-primary">
                CONNECT WALLET
                <ArrowRight className="inline ml-2" size={18} />
              </button>
              <button className="btn-secondary">
                JOIN THE COMMUNITY
              </button>
            </div>
          </div>

          {/* Wallet Image */}
          <div className="relative">
            <div className="relative w-full aspect-[4/3] flex items-center justify-center">
              {/* Placeholder for the wallet image - user should replace with actual image */}
              <div className="relative w-full h-full max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1E2850] to-[#0F1E32] rounded-2xl glow-border transform rotate-[-5deg] shadow-[0_0_40px_rgba(100,200,255,0.3)]"></div>
                <div className="relative w-full h-full bg-gradient-to-br from-[#1E2850]/80 to-[#141E3C]/80 rounded-2xl p-8 flex flex-col items-center justify-center">
                  <div className="text-6xl font-bold neon-glow mb-4">HW</div>
                  <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#64C8FF] to-transparent mb-4"></div>
                  <div className="text-sm text-[#64C8FF]/60 font-mono">HIDDEN WALLET</div>
                  <div className="absolute bottom-4 left-4 right-4 h-12 bg-[#0F1E32]/50 rounded-lg border border-[#64C8FF]/30 flex items-center justify-center">
                    <div className="w-8 h-8 bg-[#64C8FF]/20 rounded border border-[#64C8FF]/40"></div>
                  </div>
                </div>
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#64C8FF]/20 via-transparent to-[#64FFC8]/20 blur-xl"></div>
              </div>
            </div>
            {/* Note: Replace the div above with actual image when available */}
            {/* <Image 
              src="/images/hidden-wallet.png" 
              alt="Hidden Wallet" 
              width={600} 
              height={450}
              className="relative z-10 drop-shadow-[0_0_30px_rgba(100,200,255,0.5)]"
            /> */}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Get started</h2>
          <p className="text-xl text-white/60">Which role will you play?</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {/* Feature 01: Secure */}
          <div className="glass rounded-lg p-6 hover:bg-white/10 transition-all">
            <div className="text-2xl font-bold mb-2 text-white/40">01</div>
            <div className="w-12 h-12 mb-4 bg-[#64C8FF]/20 rounded-lg flex items-center justify-center glow-border">
              <Shield className="text-[#64C8FF]" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">Secure</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              Explore the possibilities of securing your Solana wallet. Access guides and a variety of security resources.
            </p>
          </div>

          {/* Feature 02: Private */}
          <div className="glass rounded-lg p-6 hover:bg-white/10 transition-all">
            <div className="text-2xl font-bold mb-2 text-white/40">02</div>
            <div className="w-12 h-12 mb-4 bg-[#64C8FF]/20 rounded-lg flex items-center justify-center glow-border">
              <Eye className="text-[#64C8FF]" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">Private</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              Run transactions through our privacy layer to facilitate mixing and obfuscation, earning enhanced privacy in return.
            </p>
          </div>

          {/* Feature 03: Decentralized */}
          <div className="glass rounded-lg p-6 hover:bg-white/10 transition-all">
            <div className="text-2xl font-bold mb-2 text-white/40">03</div>
            <div className="w-12 h-12 mb-4 bg-[#64C8FF]/20 rounded-lg flex items-center justify-center glow-border">
              <Lock className="text-[#64C8FF]" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">Decentralized</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              Contribute to the network's security by using proxy nodes and mixing pools, earning enhanced privacy protection.
            </p>
          </div>

          {/* Feature 04: Fast */}
          <div className="glass rounded-lg p-6 hover:bg-white/10 transition-all">
            <div className="text-2xl font-bold mb-2 text-white/40">04</div>
            <div className="w-12 h-12 mb-4 bg-[#64C8FF]/20 rounded-lg flex items-center justify-center glow-border">
              <Zap className="text-[#64C8FF]" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">Fast</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              Explore and shape the future of private transactions by participating in network optimization and more.
            </p>
          </div>
        </div>
      </section>

      {/* Main Dashboard Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="glass rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Your Wallet Dashboard</h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-6">
              <div className="glass rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">Wallet Connection</h3>
                <WalletConnection />
              </div>

              <div className="glass rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">Send Transaction</h3>
                <SendTransaction />
              </div>
            </div>

            <div className="space-y-6">
              <div className="glass rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">Privacy Statistics</h3>
                <PrivacyStats />
              </div>

              <div className="glass rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">Transaction History</h3>
                <TransactionHistory />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Hidden Addresses</h3>
              <HiddenAddressManager />
            </div>

            <div className="glass rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Security Settings</h3>
              <SecuritySettings
                currentLevel={securityLevel}
                onLevelChange={setSecurityLevel}
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Curious for more?</h2>
          <button className="btn-primary mt-6">
            JOIN THE COMMUNITY
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-[#0F1E32]/50 border-t border-[#64C8FF]/20 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-5 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-[#64C8FF] rounded-full shadow-[0_0_6px_rgba(100,200,255,0.8)]"></div>
                  <div className="w-2 h-2 bg-[#64C8FF] rounded-full mt-1 shadow-[0_0_6px_rgba(100,200,255,0.8)]"></div>
                  <div className="w-2 h-2 bg-[#64C8FF] rounded-full shadow-[0_0_6px_rgba(100,200,255,0.8)]"></div>
                </div>
                <span className="font-bold neon-glow">HIDDEN WALLET</span>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-3">NETWORK</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><a href="#" className="hover:text-white">SOLANA</a></li>
                <li><a href="#" className="hover:text-white">DELEGATE</a></li>
                <li><a href="#" className="hover:text-white">ORCHESTRATE</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-3">BUILD</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><a href="#docs" className="hover:text-white">DOCS</a></li>
                <li><a href="#" className="hover:text-white">SUPPORT</a></li>
                <li><a href="#" className="hover:text-white">GITHUB</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-3">CONNECT</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><a href="#" className="hover:text-white">DISCORD</a></li>
                <li><a href="#" className="hover:text-white">TWITTER</a></li>
                <li><a href="#" className="hover:text-white">TELEGRAM</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-3">ABOUT</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><a href="#" className="hover:text-white">WHAT IS HIDDEN WALLET</a></li>
                <li><a href="#" className="hover:text-white">BLOG</a></li>
                <li><a href="#" className="hover:text-white">MEDIA KIT</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 text-sm text-white/60">
            <p>COPYRIGHT © 2025 HIDDEN WALLET, INC.</p>
          </div>
        </div>
      </footer>

      {/* Backend Panel Modal */}
      {showBackendPanel && (
        <BackendPanel onClose={() => setShowBackendPanel(false)} />
      )}
    </div>
  );
}
