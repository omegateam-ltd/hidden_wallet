# Примеры использования Hidden Wallet

## Базовые примеры

### Подключение кошелька

```typescript
import { HiddenWallet } from '@hidden-wallet/core';

// Создание экземпляра
const wallet = new HiddenWallet({
  network: 'mainnet-beta',
  securityLevel: 'standard'
});

// Подключение
try {
  await wallet.connect();
  console.log('Wallet connected:', wallet.getPublicKey());
} catch (error) {
  console.error('Connection failed:', error);
}
```

### Отправка транзакции

```typescript
// Простая транзакция
const signature = await wallet.sendTransaction({
  to: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
  amount: 1.5,
  hideOrigin: true
});

console.log('Transaction signature:', signature);
```

### Получение баланса

```typescript
const balance = await wallet.getBalance();
console.log('Balance:', balance, 'SOL');
```

### История транзакций

```typescript
const history = await wallet.getTransactionHistory({
  limit: 20
});

history.forEach(tx => {
  console.log('Transaction:', tx.signature);
  console.log('Amount:', tx.amount);
  console.log('Date:', tx.date);
});
```

## React примеры

### Базовый компонент

```typescript
'use client';

import { useHiddenWallet } from '@hidden-wallet/react';
import { useState } from 'react';

export function WalletComponent() {
  const {
    isConnected,
    publicKey,
    balance,
    connect,
    disconnect,
    sendTransaction
  } = useHiddenWallet();

  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');

  if (!isConnected) {
    return (
      <div>
        <button onClick={connect}>Connect Wallet</button>
      </div>
    );
  }

  const handleSend = async () => {
    try {
      const signature = await sendTransaction({
        to: recipient,
        amount: parseFloat(amount),
        hideOrigin: true
      });
      console.log('Transaction sent:', signature);
    } catch (error) {
      console.error('Transaction failed:', error);
    }
  };

  return (
    <div>
      <p>Address: {publicKey}</p>
      <p>Balance: {balance} SOL</p>
      
      <div>
        <input
          type="text"
          placeholder="Recipient address"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button onClick={handleSend}>Send</button>
      </div>
      
      <button onClick={disconnect}>Disconnect</button>
    </div>
  );
}
```

### Компонент с обработкой ошибок

```typescript
'use client';

import { useHiddenWallet } from '@hidden-wallet/react';
import { useState, useEffect } from 'react';

export function WalletWithErrorHandling() {
  const {
    isConnected,
    publicKey,
    balance,
    error,
    connect,
    sendTransaction
  } = useHiddenWallet();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (error) {
      setMessage(`Error: ${error.message}`);
    }
  }, [error]);

  const handleConnect = async () => {
    setLoading(true);
    setMessage('');
    try {
      await connect();
      setMessage('Wallet connected successfully!');
    } catch (err) {
      setMessage(`Connection failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {message && <div>{message}</div>}
      
      {!isConnected ? (
        <button onClick={handleConnect} disabled={loading}>
          {loading ? 'Connecting...' : 'Connect Wallet'}
        </button>
      ) : (
        <div>
          <p>Address: {publicKey}</p>
          <p>Balance: {balance} SOL</p>
        </div>
      )}
    </div>
  );
}
```

## Продвинутые примеры

### Создание скрытого адреса

```typescript
// Создание нового скрытого адреса
const hiddenAddress = await wallet.createHiddenAddress();
console.log('Hidden address:', hiddenAddress);

// Использование скрытого адреса для транзакции
const signature = await wallet.sendTransaction({
  to: 'destination',
  amount: 1.0,
  hideOrigin: true,
  useHiddenAddress: hiddenAddress
});
```

### Настройка уровня безопасности

```typescript
// Базовый уровень
const basicWallet = new HiddenWallet({
  securityLevel: 'basic'
});

// Стандартный уровень
const standardWallet = new HiddenWallet({
  securityLevel: 'standard'
});

// Высокий уровень
const highSecurityWallet = new HiddenWallet({
  securityLevel: 'high'
});
```

### Кастомная конфигурация

```typescript
const wallet = new HiddenWallet({
  network: 'mainnet-beta',
  securityLevel: 'high',
  rpcUrl: 'https://custom-rpc.com',
  proxyNodes: [
    { url: 'https://proxy1.com', weight: 1 },
    { url: 'https://proxy2.com', weight: 2 }
  ]
});
```

## Интеграция с DeFi

### Обмен токенов

```typescript
import { HiddenWallet } from '@hidden-wallet/core';
import { TokenSwap } from '@solana/spl-token';

const wallet = new HiddenWallet({
  network: 'mainnet-beta',
  securityLevel: 'standard'
});

await wallet.connect();

// Создание транзакции обмена
const swapTransaction = await TokenSwap.createSwapTransaction({
  fromToken: 'USDC',
  toToken: 'SOL',
  amount: 100,
  slippage: 0.01
});

// Отправка через Hidden Wallet
const signature = await wallet.sendTransaction({
  transaction: swapTransaction,
  hideOrigin: true
});
```

### Стейкинг

```typescript
const stakeTransaction = await createStakeTransaction({
  amount: 10,
  validator: 'validator-address'
});

await wallet.sendTransaction({
  transaction: stakeTransaction,
  hideOrigin: true
});
```

## NFT примеры

### Покупка NFT

```typescript
const buyNFT = async (nftAddress: string, price: number) => {
  const signature = await wallet.sendTransaction({
    to: nftAddress,
    amount: price,
    hideOrigin: true,
    memo: `Buying NFT: ${nftAddress}`
  });
  
  return signature;
};
```

### Продажа NFT

```typescript
const sellNFT = async (nftAddress: string, price: number) => {
  // Создание транзакции продажи
  const sellTransaction = await createSellTransaction({
    nft: nftAddress,
    price: price
  });
  
  const signature = await wallet.sendTransaction({
    transaction: sellTransaction,
    hideOrigin: true
  });
  
  return signature;
};
```

## Batch транзакции

### Отправка нескольких транзакций

```typescript
const recipients = [
  { address: 'addr1', amount: 1.0 },
  { address: 'addr2', amount: 2.0 },
  { address: 'addr3', amount: 0.5 }
];

const signatures = await Promise.all(
  recipients.map(recipient =>
    wallet.sendTransaction({
      to: recipient.address,
      amount: recipient.amount,
      hideOrigin: true
    })
  )
);

console.log('All transactions sent:', signatures);
```

## Мониторинг транзакций

### Отслеживание статуса

```typescript
const sendAndTrack = async (to: string, amount: number) => {
  const signature = await wallet.sendTransaction({
    to,
    amount,
    hideOrigin: true
  });
  
  // Отслеживание подтверждения
  let confirmed = false;
  while (!confirmed) {
    const status = await wallet.getTransactionStatus(signature);
    if (status === 'confirmed') {
      confirmed = true;
      console.log('Transaction confirmed!');
    } else {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return signature;
};
```

## Обработка событий

### Подписка на события

```typescript
wallet.on('connect', () => {
  console.log('Wallet connected');
});

wallet.on('disconnect', () => {
  console.log('Wallet disconnected');
});

wallet.on('transaction', (signature) => {
  console.log('New transaction:', signature);
});

wallet.on('balanceChange', (balance) => {
  console.log('Balance changed:', balance);
});

wallet.on('error', (error) => {
  console.error('Error:', error);
});
```

## Работа с разными сетями

### Переключение сетей

```typescript
// Mainnet
const mainnetWallet = new HiddenWallet({
  network: 'mainnet-beta'
});

// Devnet
const devnetWallet = new HiddenWallet({
  network: 'devnet'
});

// Testnet
const testnetWallet = new HiddenWallet({
  network: 'testnet'
});
```

## Оптимизация производительности

### Кэширование

```typescript
import { useMemo } from 'react';

function OptimizedComponent() {
  const wallet = useMemo(
    () => new HiddenWallet({
      network: 'mainnet-beta',
      securityLevel: 'standard'
    }),
    []
  );
  
  // Использование wallet...
}
```

### Ленивая загрузка

```typescript
import { lazy, Suspense } from 'react';

const HiddenWalletComponent = lazy(() => 
  import('./HiddenWalletComponent')
);

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HiddenWalletComponent />
    </Suspense>
  );
}
```

## Тестирование

### Unit тесты

```typescript
import { HiddenWallet } from '@hidden-wallet/core';

describe('HiddenWallet', () => {
  let wallet: HiddenWallet;
  
  beforeEach(() => {
    wallet = new HiddenWallet({
      network: 'devnet',
      securityLevel: 'basic'
    });
  });
  
  test('should connect wallet', async () => {
    await wallet.connect();
    expect(wallet.isConnected()).toBe(true);
  });
  
  test('should get balance', async () => {
    await wallet.connect();
    const balance = await wallet.getBalance();
    expect(balance).toBeGreaterThanOrEqual(0);
  });
});
```

## Полный пример приложения

```typescript
'use client';

import { useHiddenWallet } from '@hidden-wallet/react';
import { useState } from 'react';

export default function HiddenWalletApp() {
  const {
    isConnected,
    publicKey,
    balance,
    connect,
    disconnect,
    sendTransaction,
    createHiddenAddress
  } = useHiddenWallet({
    network: 'mainnet-beta',
    securityLevel: 'standard'
  });

  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!recipient || !amount) return;
    
    setLoading(true);
    try {
      const signature = await sendTransaction({
        to: recipient,
        amount: parseFloat(amount),
        hideOrigin: true
      });
      alert(`Transaction sent: ${signature}`);
      setRecipient('');
      setAmount('');
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateHiddenAddress = async () => {
    try {
      const address = await createHiddenAddress();
      alert(`Hidden address created: ${address}`);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="container">
      <h1>Hidden Wallet</h1>
      
      {!isConnected ? (
        <button onClick={connect}>Connect Wallet</button>
      ) : (
        <div>
          <div>
            <p>Address: {publicKey}</p>
            <p>Balance: {balance} SOL</p>
          </div>
          
          <div>
            <h2>Send Transaction</h2>
            <input
              type="text"
              placeholder="Recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <button onClick={handleSend} disabled={loading}>
              {loading ? 'Sending...' : 'Send'}
            </button>
          </div>
          
          <div>
            <button onClick={handleCreateHiddenAddress}>
              Create Hidden Address
            </button>
          </div>
          
          <button onClick={disconnect}>Disconnect</button>
        </div>
      )}
    </div>
  );
}
```

## Дополнительные ресурсы

- [API Reference](./API.md)
- [Architecture](./ARCHITECTURE.md)
- [Security](./SECURITY.md)
- [Getting Started](./GETTING_STARTED.md)

