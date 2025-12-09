import { Connection, Transaction, Commitment } from '@solana/web3.js';

export interface ProxyNode {
  url: string;
  weight: number;
  latency?: number;
}

export class ProxyService {
  private proxyNodes: ProxyNode[] = [];
  private currentIndex: number = 0;

  constructor() {
    // Initialize with default proxy nodes
    this.initializeDefaultNodes();
  }

  /**
   * Инициализация узлов по умолчанию
   */
  private initializeDefaultNodes(): void {
    // In production, these would be actual proxy node URLs
    const defaultNodes: ProxyNode[] = [
      {
        url: process.env.NEXT_PUBLIC_PROXY_NODE_1 || 'https://api.mainnet-beta.solana.com',
        weight: 1,
        latency: 0
      },
      {
        url: process.env.NEXT_PUBLIC_PROXY_NODE_2 || 'https://api.mainnet-beta.solana.com',
        weight: 1,
        latency: 0
      }
    ];

    this.proxyNodes = defaultNodes;
  }

  /**
   * Добавление прокси-узла
   */
  addProxyNode(node: ProxyNode): void {
    this.proxyNodes.push(node);
  }

  /**
   * Удаление прокси-узла
   */
  removeProxyNode(url: string): void {
    this.proxyNodes = this.proxyNodes.filter(node => node.url !== url);
  }

  /**
   * Получение соединения через прокси
   */
  getConnection(originalConnection: Connection): Connection {
    const selectedNode = this.selectProxyNode();
    return new Connection(selectedNode.url, originalConnection.commitment || 'confirmed');
  }

  /**
   * Получение соединения через случайный прокси
   */
  getRandomConnection(originalConnection: Connection): Connection {
    if (this.proxyNodes.length === 0) {
      return originalConnection;
    }
    
    const randomIndex = Math.floor(Math.random() * this.proxyNodes.length);
    const node = this.proxyNodes[randomIndex];
    return new Connection(node.url, originalConnection.commitment || 'confirmed');
  }

  /**
   * Получение соединения через лучший прокси (по задержке)
   */
  async getBestConnection(originalConnection: Connection): Promise<Connection> {
    if (this.proxyNodes.length === 0) {
      return originalConnection;
    }

    // Update latencies if needed
    await this.updateLatencies();

    // Sort by latency and select the best
    const sortedNodes = [...this.proxyNodes].sort((a, b) => {
      const latencyA = a.latency || Infinity;
      const latencyB = b.latency || Infinity;
      return latencyA - latencyB;
    });

    const bestNode = sortedNodes[0];
    return new Connection(bestNode.url, originalConnection.commitment || 'confirmed');
  }

  /**
   * Выбор прокси-узла
   */
  private selectProxyNode(): ProxyNode {
    if (this.proxyNodes.length === 0) {
      throw new Error('No proxy nodes available');
    }

    // Try weighted selection first, fallback to round-robin
    try {
      return this.selectProxyNodeByWeight();
    } catch {
      // Round-robin selection as fallback
      const node = this.proxyNodes[this.currentIndex];
      this.currentIndex = (this.currentIndex + 1) % this.proxyNodes.length;
      return node;
    }
  }

  /**
   * Выбор прокси-узла по весу
   */
  private selectProxyNodeByWeight(): ProxyNode {
    if (this.proxyNodes.length === 0) {
      throw new Error('No proxy nodes available');
    }

    // Calculate total weight
    const totalWeight = this.proxyNodes.reduce((sum, node) => sum + node.weight, 0);
    
    // Random selection based on weight
    let random = Math.random() * totalWeight;
    
    for (const node of this.proxyNodes) {
      random -= node.weight;
      if (random <= 0) {
        return node;
      }
    }

    // Fallback to first node
    return this.proxyNodes[0];
  }

  /**
   * Отправка транзакции через прокси с автоматическим retry
   */
  async sendTransaction(
    transaction: Transaction,
    originalConnection: Connection,
    maxRetries: number = 3
  ): Promise<string> {
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        // Try to get best connection, fallback to random
        const proxyConnection = attempt === 0 
          ? await this.getBestConnection(originalConnection)
          : this.getRandomConnection(originalConnection);
        
        const signature = await proxyConnection.sendRawTransaction(
          transaction.serialize(),
          {
            skipPreflight: false,
            preflightCommitment: 'confirmed' as Commitment
          }
        );

        // Wait for confirmation
        await proxyConnection.confirmTransaction(signature, 'confirmed');
        
        return signature;
      } catch (error) {
        lastError = error as Error;
        console.error(`Proxy transaction attempt ${attempt + 1} failed:`, error);
        
        // If not last attempt, wait before retry
        if (attempt < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
        }
      }
    }
    
    // If all retries failed, throw last error
    throw new Error(`Failed to send transaction after ${maxRetries} attempts: ${lastError?.message}`);
  }

  /**
   * Измерение задержки узла
   */
  async measureLatency(node: ProxyNode): Promise<number> {
    const startTime = Date.now();
    
    try {
      const connection = new Connection(node.url, 'confirmed');
      await connection.getSlot();
      const latency = Date.now() - startTime;
      node.latency = latency;
      return latency;
    } catch (error) {
      console.error(`Failed to measure latency for ${node.url}:`, error);
      return Infinity;
    }
  }

  /**
   * Обновление задержек всех узлов
   */
  async updateLatencies(): Promise<void> {
    const promises = this.proxyNodes.map(node => this.measureLatency(node));
    await Promise.all(promises);
    
    // Sort nodes by latency
    this.proxyNodes.sort((a, b) => {
      const latencyA = a.latency || Infinity;
      const latencyB = b.latency || Infinity;
      return latencyA - latencyB;
    });
  }

  /**
   * Получение списка узлов
   */
  getNodes(): ProxyNode[] {
    return [...this.proxyNodes];
  }

  /**
   * Проверка доступности узла
   */
  async checkNodeHealth(node: ProxyNode): Promise<boolean> {
    try {
      const connection = new Connection(node.url, 'confirmed');
      await connection.getSlot();
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Проверка здоровья всех узлов
   */
  async checkAllNodesHealth(): Promise<Map<string, boolean>> {
    const healthMap = new Map<string, boolean>();
    
    const promises = this.proxyNodes.map(async (node) => {
      const isHealthy = await this.checkNodeHealth(node);
      healthMap.set(node.url, isHealthy);
    });

    await Promise.all(promises);
    return healthMap;
  }
}

