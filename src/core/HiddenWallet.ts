import { Connection, PublicKey, Transaction, Keypair, sendAndConfirmTransaction } from '@solana/web3.js';
import { EncryptionService } from '../security/EncryptionService';
import { PrivacyService } from '../privacy/PrivacyService';
import { ProxyService } from '../proxy/ProxyService';
import type { WalletAdapter } from '@solana/wallet-adapter-base';

export interface WalletOptions {
  provider?: 'phantom' | 'solflare' | 'ledger' | 'custom';
  network?: 'mainnet-beta' | 'devnet' | 'testnet';
  securityLevel?: 'basic' | 'standard' | 'high';
  rpcUrl?: string;
  customAdapter?: WalletAdapter;
}

export interface TransactionOptions {
  to: string;
  amount: number;
  hideOrigin?: boolean;
  priorityFee?: number;
  memo?: string;
}

export interface HiddenAddress {
  publicKey: string;
  encryptedPrivateKey: string;
  createdAt: Date;
}

export class HiddenWallet {
  private connection: Connection;
  private encryptionService: EncryptionService;
  private privacyService: PrivacyService;
  private proxyService: ProxyService;
  private walletAdapter: WalletAdapter | null = null;
  private publicKey: PublicKey | null = null;
  private securityLevel: 'basic' | 'standard' | 'high';
  private hiddenAddresses: Map<string, HiddenAddress> = new Map();

  constructor(options: WalletOptions = {}) {
    const {
      network = 'mainnet-beta',
      securityLevel = 'standard',
      rpcUrl,
      customAdapter
    } = options;

    this.securityLevel = securityLevel;
    
    // Initialize connection
    const endpoint = rpcUrl || this.getRpcEndpoint(network);
    this.connection = new Connection(endpoint, 'confirmed');

    // Initialize services
    this.encryptionService = new EncryptionService(securityLevel);
    this.privacyService = new PrivacyService(securityLevel);
    this.proxyService = new ProxyService();
  }

  /**
   * Подключение кошелька
   */
  async connect(): Promise<void> {
    try {
      if (typeof window === 'undefined') {
        throw new Error('Wallet connection requires browser environment');
      }

      // Try to connect to Phantom first
      if (typeof window !== 'undefined' && (window as any).solana && (window as any).solana.isPhantom) {
        await (window as any).solana.connect();
        this.publicKey = new PublicKey((window as any).solana.publicKey.toString());
      } else {
        throw new Error('No Solana wallet found. Please install Phantom or Solflare.');
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  }

  /**
   * Отключение кошелька
   */
  async disconnect(): Promise<void> {
    try {
      if (typeof window !== 'undefined' && (window as any).solana && (window as any).solana.isPhantom) {
        await (window as any).solana.disconnect();
      }
      this.publicKey = null;
      this.walletAdapter = null;
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
      throw error;
    }
  }

  /**
   * Создание скрытого адреса
   */
  async createHiddenAddress(): Promise<string> {
    try {
      // Generate new keypair
      const keypair = Keypair.generate();
      const publicKey = keypair.publicKey.toString();

      // Encrypt private key
      const privateKeyBytes = keypair.secretKey;
      const encryptedPrivateKey = await this.encryptionService.encrypt(
        Buffer.from(privateKeyBytes).toString('base64')
      );

      // Store hidden address
      const hiddenAddress: HiddenAddress = {
        publicKey,
        encryptedPrivateKey,
        createdAt: new Date()
      };

      this.hiddenAddresses.set(publicKey, hiddenAddress);

      return publicKey;
    } catch (error) {
      console.error('Failed to create hidden address:', error);
      throw error;
    }
  }

  /**
   * Отправка транзакции через скрытый слой
   */
  async sendTransaction(options: TransactionOptions): Promise<string> {
    try {
      if (!this.publicKey) {
        throw new Error('Wallet not connected');
      }

      const { to, amount, hideOrigin = true, priorityFee, memo } = options;

      // Create transaction
      let transaction: Transaction;

      if (hideOrigin && this.securityLevel !== 'basic') {
        // Use privacy layer for transaction mixing
        transaction = await this.privacyService.createPrivateTransaction({
          from: this.publicKey,
          to: new PublicKey(to),
          amount,
          connection: this.connection
        });
      } else {
        // Direct transaction
        transaction = new Transaction().add(
          await this.connection.getLatestBlockhash()
        );
      }

      // Sign transaction
      if (typeof window !== 'undefined' && (window as any).solana && (window as any).solana.isPhantom) {
        const signed = await (window as any).solana.signTransaction(transaction);
        
        // Send through proxy if enabled
        if (this.securityLevel === 'high') {
          const signature = await this.proxyService.sendTransaction(
            signed,
            this.connection
          );
          return signature;
        } else {
          const signature = await this.connection.sendRawTransaction(
            signed.serialize()
          );
          await this.connection.confirmTransaction(signature);
          return signature;
        }
      } else {
        throw new Error('Wallet not available');
      }
    } catch (error) {
      console.error('Failed to send transaction:', error);
      throw error;
    }
  }

  /**
   * Получение баланса
   */
  async getBalance(): Promise<number> {
    try {
      if (!this.publicKey) {
        throw new Error('Wallet not connected');
      }

      // Use proxy for high security level
      const connection = this.securityLevel === 'high' 
        ? this.proxyService.getConnection(this.connection)
        : this.connection;

      const balance = await connection.getBalance(this.publicKey);
      return balance / 1e9; // Convert lamports to SOL
    } catch (error) {
      console.error('Failed to get balance:', error);
      throw error;
    }
  }

  /**
   * Получение истории транзакций
   */
  async getTransactionHistory(options: {
    limit?: number;
    before?: string;
  } = {}): Promise<any[]> {
    try {
      if (!this.publicKey) {
        throw new Error('Wallet not connected');
      }

      const { limit = 10, before } = options;

      const connection = this.securityLevel === 'high'
        ? this.proxyService.getConnection(this.connection)
        : this.connection;

      const signatures = await connection.getSignaturesForAddress(
        this.publicKey,
        { limit, before: before ? new PublicKey(before) : undefined }
      );

      // Fetch transaction details
      const transactions = await Promise.all(
        signatures.map(sig => 
          connection.getTransaction(sig.signature, {
            maxSupportedTransactionVersion: 0
          })
        )
      );

      return transactions.filter(tx => tx !== null);
    } catch (error) {
      console.error('Failed to get transaction history:', error);
      throw error;
    }
  }

  /**
   * Получение публичного ключа
   */
  getPublicKey(): string | null {
    return this.publicKey?.toString() || null;
  }

  /**
   * Проверка подключения
   */
  isConnected(): boolean {
    return this.publicKey !== null;
  }

  /**
   * Получение RPC endpoint
   */
  private getRpcEndpoint(network: string): string {
    const endpoints: Record<string, string> = {
      'mainnet-beta': 'https://api.mainnet-beta.solana.com',
      'devnet': 'https://api.devnet.solana.com',
      'testnet': 'https://api.testnet.solana.com'
    };

    return endpoints[network] || endpoints['mainnet-beta'];
  }
}

// Note: Window interface extension is handled via type casting in the code

