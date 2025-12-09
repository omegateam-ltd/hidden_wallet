# Интеграция Hidden Wallet

## Быстрая интеграция

### Установка

```bash
npm install @hidden-wallet/core @hidden-wallet/react
# или
yarn add @hidden-wallet/core @hidden-wallet/react
```

### Базовое использование

```typescript
import { HiddenWallet } from '@hidden-wallet/core';

const wallet = new HiddenWallet({
  network: 'mainnet-beta',
  securityLevel: 'standard'
});

await wallet.connect();
```

## React интеграция

### Использование хука

```typescript
'use client';

import { useHiddenWallet } from '@hidden-wallet/react';

function MyComponent() {
  const {
    isConnected,
    publicKey,
    balance,
    connect,
    sendTransaction
  } = useHiddenWallet({
    network: 'mainnet-beta',
    securityLevel: 'standard'
  });

  if (!isConnected) {
    return <button onClick={connect}>Connect Wallet</button>;
  }

  return (
    <div>
      <p>Address: {publicKey}</p>
      <p>Balance: {balance} SOL</p>
    </div>
  );
}
```

### Provider компонент

```typescript
'use client';

import { HiddenWalletProvider } from '@hidden-wallet/react';

export default function App() {
  return (
    <HiddenWalletProvider
      network="mainnet-beta"
      securityLevel="standard"
    >
      <MyComponent />
    </HiddenWalletProvider>
  );
}
```

## Next.js интеграция

### Настройка провайдера

```typescript
// app/providers.tsx
'use client';

import { HiddenWalletProvider } from '@hidden-wallet/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HiddenWalletProvider
      network={process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'mainnet-beta'}
      securityLevel={process.env.NEXT_PUBLIC_SECURITY_LEVEL || 'standard'}
    >
      {children}
    </HiddenWalletProvider>
  );
}
```

### Использование в layout

```typescript
// app/layout.tsx
import { Providers } from './providers';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

## Vue.js интеграция

### Плагин (планируется)

```typescript
import { createApp } from 'vue';
import HiddenWallet from '@hidden-wallet/vue';

const app = createApp(App);
app.use(HiddenWallet, {
  network: 'mainnet-beta',
  securityLevel: 'standard'
});
```

### Композабл

```typescript
import { useHiddenWallet } from '@hidden-wallet/vue';

export default {
  setup() {
    const {
      isConnected,
      publicKey,
      balance,
      connect,
      sendTransaction
    } = useHiddenWallet();

    return {
      isConnected,
      publicKey,
      balance,
      connect,
      sendTransaction
    };
  }
};
```

## Vanilla JavaScript

### Базовое использование

```javascript
import { HiddenWallet } from '@hidden-wallet/core';

const wallet = new HiddenWallet({
  network: 'mainnet-beta',
  securityLevel: 'standard'
});

// Подключение
await wallet.connect();

// Отправка транзакции
const signature = await wallet.sendTransaction({
  to: 'destination_address',
  amount: 1.5,
  hideOrigin: true
});
```

## Node.js интеграция

### Серверное использование

```typescript
import { HiddenWallet } from '@hidden-wallet/core';

const wallet = new HiddenWallet({
  network: 'mainnet-beta',
  securityLevel: 'high',
  rpcUrl: 'https://your-rpc-url.com'
});

// Работа с кошельком
await wallet.connect();
```

## Интеграция с существующими приложениями

### Замена стандартного кошелька

```typescript
// Было
import { useWallet } from '@solana/wallet-adapter-react';

// Стало
import { useHiddenWallet } from '@hidden-wallet/react';

// API совместимо, просто замените импорт
```

### Миграция

```typescript
// Старый код
const { publicKey, sendTransaction } = useWallet();

// Новый код
const { publicKey, sendTransaction } = useHiddenWallet();
```

## Кастомизация

### Кастомный провайдер

```typescript
import { HiddenWallet } from '@hidden-wallet/core';
import { CustomWalletAdapter } from './custom-adapter';

const wallet = new HiddenWallet({
  customAdapter: new CustomWalletAdapter(),
  network: 'mainnet-beta'
});
```

### Кастомные настройки

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

## Webhook интеграция

### Настройка webhook

```typescript
wallet.on('transaction', (data) => {
  // Отправка webhook
  fetch('https://your-api.com/webhook', {
    method: 'POST',
    body: JSON.stringify(data)
  });
});
```

### События

```typescript
wallet.on('connect', () => {
  console.log('Wallet connected');
});

wallet.on('disconnect', () => {
  console.log('Wallet disconnected');
});

wallet.on('transaction', (signature) => {
  console.log('Transaction:', signature);
});
```

## API интеграция

### REST API

```typescript
// Получение баланса
const response = await fetch('/api/wallet/balance', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const { balance } = await response.json();
```

### WebSocket API

```typescript
const ws = new WebSocket('wss://api.hidden-wallet.com');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Update:', data);
};
```

## Примеры интеграции

### DeFi приложение

```typescript
import { useHiddenWallet } from '@hidden-wallet/react';

function DeFiApp() {
  const { sendTransaction, isConnected } = useHiddenWallet();

  const swapTokens = async () => {
    // Создание транзакции обмена
    const transaction = await createSwapTransaction();
    
    // Отправка через Hidden Wallet
    await sendTransaction({
      transaction,
      hideOrigin: true
    });
  };

  return <button onClick={swapTokens}>Swap</button>;
}
```

### NFT маркетплейс

```typescript
import { useHiddenWallet } from '@hidden-wallet/react';

function NFTMarketplace() {
  const { sendTransaction } = useHiddenWallet();

  const buyNFT = async (nftAddress: string) => {
    await sendTransaction({
      to: nftAddress,
      amount: 1.5,
      hideOrigin: true
    });
  };

  return <button onClick={() => buyNFT('nft-address')}>Buy NFT</button>;
}
```

## Обработка ошибок

### Try-catch блоки

```typescript
try {
  await wallet.connect();
} catch (error) {
  if (error instanceof WalletConnectionError) {
    console.error('Connection failed:', error.message);
  }
}
```

### Обработчики ошибок

```typescript
wallet.on('error', (error) => {
  console.error('Wallet error:', error);
  // Показать уведомление пользователю
});
```

## Тестирование

### Моки для тестов

```typescript
import { mockHiddenWallet } from '@hidden-wallet/testing';

const wallet = mockHiddenWallet({
  publicKey: 'test-public-key',
  balance: 10
});
```

### Unit тесты

```typescript
import { renderHook } from '@testing-library/react';
import { useHiddenWallet } from '@hidden-wallet/react';

test('should connect wallet', async () => {
  const { result } = renderHook(() => useHiddenWallet());
  
  await result.current.connect();
  
  expect(result.current.isConnected).toBe(true);
});
```

## Производительность

### Оптимизация

```typescript
// Ленивая загрузка
const HiddenWallet = lazy(() => import('@hidden-wallet/core'));

// Кэширование
const wallet = useMemo(
  () => new HiddenWallet({ network: 'mainnet-beta' }),
  []
);
```

### Мониторинг

```typescript
wallet.on('performance', (metrics) => {
  console.log('Transaction time:', metrics.transactionTime);
  console.log('Network latency:', metrics.networkLatency);
});
```

## Безопасность

### Валидация

```typescript
import { validateAddress } from '@hidden-wallet/utils';

const address = 'destination-address';
if (!validateAddress(address)) {
  throw new Error('Invalid address');
}
```

### Санитизация

```typescript
import { sanitizeInput } from '@hidden-wallet/utils';

const userInput = sanitizeInput(rawInput);
```

## Поддержка

- **Документация**: [docs.hidden-wallet.com](https://docs.hidden-wallet.com)
- **GitHub**: [github.com/hidden-wallet](https://github.com/hidden-wallet)
- **Discord**: [discord.gg/hidden-wallet](https://discord.gg/hidden-wallet)
- **Email**: support@hidden-wallet.com

