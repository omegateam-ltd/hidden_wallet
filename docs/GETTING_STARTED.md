# Быстрый старт

Это руководство поможет вам быстро начать работу с Hidden Wallet.

## Установка

### Требования

- Node.js 18+ 
- npm или yarn
- Solana кошелек (Phantom, Solflare и т.д.)

### Шаги установки

1. **Клонирование репозитория**

```bash
git clone https://github.com/your-org/hidden-wallet.git
cd hidden-wallet
```

2. **Установка зависимостей**

```bash
npm install
```

3. **Настройка окружения**

Скопируйте файл `.env.example` в `.env`:

```bash
cp .env.example .env
```

Отредактируйте `.env` и укажите необходимые параметры:

```env
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
NEXT_PUBLIC_SECURITY_LEVEL=standard
```

4. **Запуск приложения**

```bash
npm run dev
```

Приложение будет доступно по адресу `http://localhost:3000`

## Первое использование

### Подключение кошелька

1. Откройте приложение в браузере
2. Нажмите кнопку "Connect Wallet"
3. Выберите ваш Solana кошелек (Phantom, Solflare и т.д.)
4. Подтвердите подключение в кошельке

### Отправка транзакции

1. Убедитесь, что кошелек подключен
2. Введите адрес получателя
3. Укажите сумму в SOL
4. Выберите опцию "Hide transaction origin" для приватности
5. Нажмите "Send"

### Создание скрытого адреса

```typescript
import { useHiddenWallet } from '@/hooks/useHiddenWallet';

const { createHiddenAddress } = useHiddenWallet();

const hiddenAddress = await createHiddenAddress();
console.log('Hidden Address:', hiddenAddress);
```

## Уровни безопасности

### Базовый (Basic)

- Шифрование ключей AES-256
- Базовая обфускация адресов
- Прямые транзакции

**Использование:**
```typescript
const wallet = new HiddenWallet({
  securityLevel: 'basic'
});
```

### Стандартный (Standard)

- Расширенное шифрование
- Обфускация трафика
- Смешивание транзакций через один промежуточный адрес

**Использование:**
```typescript
const wallet = new HiddenWallet({
  securityLevel: 'standard'
});
```

### Высокий (High)

- Полное шифрование AES-256-GCM
- Многоуровневая обфускация
- Децентрализованная маршрутизация
- Многоуровневое смешивание транзакций

**Использование:**
```typescript
const wallet = new HiddenWallet({
  securityLevel: 'high'
});
```

## Примеры использования

### Базовый пример

```typescript
import { HiddenWallet } from '@/core/HiddenWallet';

// Создание экземпляра кошелька
const wallet = new HiddenWallet({
  network: 'mainnet-beta',
  securityLevel: 'standard'
});

// Подключение
await wallet.connect();

// Получение баланса
const balance = await wallet.getBalance();
console.log('Balance:', balance, 'SOL');

// Отправка транзакции
const signature = await wallet.sendTransaction({
  to: 'destination_address',
  amount: 1.5,
  hideOrigin: true
});

console.log('Transaction signature:', signature);
```

### Использование с React

```typescript
'use client';

import { useHiddenWallet } from '@/hooks/useHiddenWallet';

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
      <button
        onClick={() =>
          sendTransaction({
            to: 'destination_address',
            amount: 0.1,
            hideOrigin: true
          })
        }
      >
        Send Transaction
      </button>
    </div>
  );
}
```

## Следующие шаги

- Прочитайте [Архитектуру](./ARCHITECTURE.md) для понимания внутренней работы
- Изучите [Безопасность](./SECURITY.md) для лучших практик
- Посмотрите [API Reference](../README.md#api-reference) для полной документации

## Поддержка

Если у вас возникли проблемы:

1. Проверьте [FAQ](../README.md#faq)
2. Откройте issue на GitHub
3. Свяжитесь с поддержкой: support@hidden-wallet.com

