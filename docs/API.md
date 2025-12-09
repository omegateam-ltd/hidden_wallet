# API Reference

## HiddenWallet Class

Основной класс для работы с Hidden Wallet.

### Constructor

```typescript
new HiddenWallet(options?: WalletOptions)
```

**Параметры:**

- `options` (optional): Объект конфигурации
  - `provider?: 'phantom' | 'solflare' | 'ledger' | 'custom'` - Тип провайдера кошелька
  - `network?: 'mainnet-beta' | 'devnet' | 'testnet'` - Сеть Solana (по умолчанию: 'mainnet-beta')
  - `securityLevel?: 'basic' | 'standard' | 'high'` - Уровень безопасности (по умолчанию: 'standard')
  - `rpcUrl?: string` - Кастомный RPC URL
  - `customAdapter?: WalletAdapter` - Кастомный адаптер кошелька

**Пример:**

```typescript
const wallet = new HiddenWallet({
  network: 'mainnet-beta',
  securityLevel: 'high'
});
```

### Методы

#### connect()

Подключает кошелек к приложению.

```typescript
await wallet.connect(): Promise<void>
```

**Возвращает:** Promise, который разрешается при успешном подключении

**Выбрасывает:** Error, если подключение не удалось

**Пример:**

```typescript
try {
  await wallet.connect();
  console.log('Wallet connected!');
} catch (error) {
  console.error('Connection failed:', error);
}
```

#### disconnect()

Отключает кошелек от приложения.

```typescript
await wallet.disconnect(): Promise<void>
```

**Возвращает:** Promise, который разрешается при успешном отключении

**Пример:**

```typescript
await wallet.disconnect();
```

#### createHiddenAddress()

Создает новый скрытый адрес.

```typescript
await wallet.createHiddenAddress(): Promise<string>
```

**Возвращает:** Promise с публичным ключом нового скрытого адреса

**Пример:**

```typescript
const hiddenAddress = await wallet.createHiddenAddress();
console.log('Hidden address:', hiddenAddress);
```

#### sendTransaction()

Отправляет транзакцию через скрытый слой.

```typescript
await wallet.sendTransaction(options: TransactionOptions): Promise<string>
```

**Параметры:**

- `options`: Объект с параметрами транзакции
  - `to: string` - Адрес получателя
  - `amount: number` - Сумма в SOL
  - `hideOrigin?: boolean` - Скрыть источник транзакции (по умолчанию: true)
  - `priorityFee?: number` - Приоритетная комиссия
  - `memo?: string` - Мемо для транзакции

**Возвращает:** Promise с подписью транзакции

**Пример:**

```typescript
const signature = await wallet.sendTransaction({
  to: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
  amount: 1.5,
  hideOrigin: true
});

console.log('Transaction signature:', signature);
```

#### getBalance()

Получает баланс кошелька.

```typescript
await wallet.getBalance(): Promise<number>
```

**Возвращает:** Promise с балансом в SOL

**Пример:**

```typescript
const balance = await wallet.getBalance();
console.log('Balance:', balance, 'SOL');
```

#### getTransactionHistory()

Получает историю транзакций.

```typescript
await wallet.getTransactionHistory(options?: {
  limit?: number;
  before?: string;
}): Promise<any[]>
```

**Параметры:**

- `options` (optional):
  - `limit?: number` - Максимальное количество транзакций (по умолчанию: 10)
  - `before?: string` - Подпись транзакции для пагинации

**Возвращает:** Promise с массивом транзакций

**Пример:**

```typescript
const history = await wallet.getTransactionHistory({
  limit: 20
});

history.forEach(tx => {
  console.log('Transaction:', tx.signature);
});
```

#### getPublicKey()

Получает публичный ключ подключенного кошелька.

```typescript
wallet.getPublicKey(): string | null
```

**Возвращает:** Публичный ключ или null, если кошелек не подключен

**Пример:**

```typescript
const publicKey = wallet.getPublicKey();
if (publicKey) {
  console.log('Public key:', publicKey);
}
```

#### isConnected()

Проверяет, подключен ли кошелек.

```typescript
wallet.isConnected(): boolean
```

**Возвращает:** true, если кошелек подключен, иначе false

**Пример:**

```typescript
if (wallet.isConnected()) {
  console.log('Wallet is connected');
}
```

## useHiddenWallet Hook

React hook для работы с Hidden Wallet.

### Использование

```typescript
const {
  wallet,
  isConnected,
  publicKey,
  balance,
  isLoading,
  error,
  connect,
  disconnect,
  sendTransaction,
  getBalance,
  createHiddenAddress,
  refresh
} = useHiddenWallet(options?: WalletOptions);
```

### Параметры

- `options` (optional): Те же параметры, что и для конструктора HiddenWallet

### Возвращаемые значения

- `wallet: HiddenWallet | null` - Экземпляр кошелька
- `isConnected: boolean` - Статус подключения
- `publicKey: string | null` - Публичный ключ
- `balance: number | null` - Баланс в SOL
- `isLoading: boolean` - Статус загрузки
- `error: Error | null` - Ошибка, если есть
- `connect: () => Promise<void>` - Функция подключения
- `disconnect: () => Promise<void>` - Функция отключения
- `sendTransaction: (options: TransactionOptions) => Promise<string>` - Функция отправки транзакции
- `getBalance: () => Promise<void>` - Функция обновления баланса
- `createHiddenAddress: () => Promise<string>` - Функция создания скрытого адреса
- `refresh: () => Promise<void>` - Функция обновления состояния

### Пример

```typescript
'use client';

import { useHiddenWallet } from '@/hooks/useHiddenWallet';

function WalletComponent() {
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
    return <button onClick={connect}>Connect</button>;
  }

  return (
    <div>
      <p>Address: {publicKey}</p>
      <p>Balance: {balance} SOL</p>
      <button
        onClick={() =>
          sendTransaction({
            to: 'destination',
            amount: 0.1
          })
        }
      >
        Send
      </button>
    </div>
  );
}
```

## EncryptionService

Сервис для шифрования данных.

### Методы

#### encrypt()

Шифрует данные.

```typescript
await encryptionService.encrypt(data: string, key?: string): Promise<string>
```

#### decrypt()

Дешифрует данные.

```typescript
await encryptionService.decrypt(encryptedData: string, key?: string): Promise<string>
```

#### hash()

Хеширует данные.

```typescript
encryptionService.hash(data: string): string
```

## PrivacyService

Сервис для обеспечения приватности транзакций.

### Методы

#### createPrivateTransaction()

Создает приватную транзакцию.

```typescript
await privacyService.createPrivateTransaction(options: PrivacyTransactionOptions): Promise<Transaction>
```

## ProxyService

Сервис для маршрутизации через прокси.

### Методы

#### getConnection()

Получает соединение через прокси.

```typescript
proxyService.getConnection(originalConnection: Connection): Connection
```

#### sendTransaction()

Отправляет транзакцию через прокси.

```typescript
await proxyService.sendTransaction(transaction: Transaction, originalConnection: Connection): Promise<string>
```

