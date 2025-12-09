# Hidden Wallet

**Security Layer for Your Solana Wallet**

Hidden Wallet is an additional security layer that hides your main Solana wallet, ensuring privacy and transaction protection.

## 🎯 Key Features

- **Transaction Privacy**: Hiding the real wallet address
- **Data Encryption**: Protection of private keys and data
- **Traffic Obfuscation**: Masking network activity
- **Multi-layer Protection**: Multiple security layers
- **Decentralized Architecture**: No single point of failure

## 📚 Documentation

Full documentation is available in the [docs](./docs/) folder:

- **[Overview](./docs/OVERVIEW.md)** - Introduction to Hidden Wallet and core concepts
- **[Features](./docs/FEATURES.md)** - Complete list of features and capabilities
- **[Getting Started](./docs/GETTING_STARTED.md)** - Installation and first use guide
- **[Architecture](./docs/ARCHITECTURE.md)** - Detailed system architecture description
- **[API Reference](./docs/API.md)** - Complete API documentation
- **[Integration](./docs/INTEGRATION.md)** - Integration guide for your application
- **[Examples](./docs/EXAMPLES.md)** - Usage examples and code samples
- **[Security](./docs/SECURITY.md)** - Security guide

### Quick Start

1. **Install Dependencies**
```bash
npm install
```

2. **Environment Setup**
```bash
cp .env.example .env
# Fill in the necessary environment variables
```

3. **Run Application**
```bash
npm run dev
```

### Architecture

Hidden Wallet consists of the following components:

#### 1. Wallet Layer
- Managing connection to Solana wallet
- Transaction processing
- Key management

#### 2. Security Layer
- Private key encryption
- Address obfuscation
- Protection against traffic analysis

#### 3. Privacy Layer
- Transaction mixing
- Hiding connections between addresses
- Metadata protection

#### 4. Proxy Layer
- Transaction routing
- Load distribution
- Request anonymization

### Usage

#### Connecting Wallet

```typescript
import { HiddenWallet } from '@hidden-wallet/core';

const wallet = new HiddenWallet({
  provider: 'phantom', // or 'solflare', 'ledger'
  network: 'mainnet-beta',
  securityLevel: 'high'
});

await wallet.connect();
```

#### Creating Hidden Address

```typescript
const hiddenAddress = await wallet.createHiddenAddress();
console.log('Hidden Address:', hiddenAddress);
```

#### Sending Transaction

```typescript
const transaction = await wallet.sendTransaction({
  to: 'destination_address',
  amount: 1.5, // SOL
  hideOrigin: true // Hide transaction origin
});
```

#### Getting Balance

```typescript
const balance = await wallet.getBalance();
console.log('Balance:', balance);
```

### Security

#### Protection Levels

1. **Basic**
   - Key encryption
   - Basic obfuscation

2. **Standard**
   - Advanced encryption
   - Traffic obfuscation
   - Transaction mixing

3. **High**
   - Full encryption
   - Multi-layer obfuscation
   - Decentralized routing
   - Analysis protection

#### Security Recommendations

- ✅ Always use strong passwords
- ✅ Store seed phrase in a secure location
- ✅ Regularly update the application
- ✅ Use hardware wallets for large amounts
- ✅ Enable two-factor authentication
- ❌ Don't share private keys
- ❌ Don't use the same password for all services
- ❌ Don't store keys in the cloud without encryption

### API Reference

#### HiddenWallet Class

##### Constructor

```typescript
new HiddenWallet(options: WalletOptions)
```

**Parameters:**
- `provider`: Provider type ('phantom' | 'solflare' | 'ledger' | 'custom')
- `network`: Solana network ('mainnet-beta' | 'devnet' | 'testnet')
- `securityLevel`: Security level ('basic' | 'standard' | 'high')

##### Methods

**connect()**
Connects wallet to the application.

```typescript
await wallet.connect();
```

**disconnect()**
Disconnects wallet.

```typescript
await wallet.disconnect();
```

**createHiddenAddress()**
Creates a new hidden address.

```typescript
const address = await wallet.createHiddenAddress();
```

**sendTransaction(options)**
Sends a transaction through the hidden layer.

```typescript
const tx = await wallet.sendTransaction({
  to: string,
  amount: number,
  hideOrigin?: boolean,
  priorityFee?: number
});
```

**getBalance()**
Gets wallet balance.

```typescript
const balance = await wallet.getBalance();
```

**getTransactionHistory()**
Gets transaction history.

```typescript
const history = await wallet.getTransactionHistory({
  limit?: number,
  before?: string
});
```

### Configuration

#### Environment Variables

```env
# Solana Network
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com

# Security
NEXT_PUBLIC_SECURITY_LEVEL=high
NEXT_PUBLIC_ENABLE_ENCRYPTION=true

# Privacy
NEXT_PUBLIC_ENABLE_MIXING=true
NEXT_PUBLIC_MIXING_POOL_SIZE=100

# Proxy
NEXT_PUBLIC_PROXY_ENABLED=true
NEXT_PUBLIC_PROXY_NODES=https://proxy1.example.com,https://proxy2.example.com
```

### Development

#### Project Structure

```
hidden-wallet/
├── src/
│   ├── core/           # Core logic
│   ├── security/       # Security layer
│   ├── privacy/        # Privacy layer
│   ├── proxy/          # Proxy layer
│   ├── wallet/         # Wallet integration
│   ├── components/     # UI components
│   └── hooks/          # React hooks
├── docs/               # Documentation
├── tests/              # Tests
└── public/             # Static files
```

#### Running Tests

```bash
npm test
```

#### Building

```bash
npm run build
```

### FAQ

**Q: Is it safe to use Hidden Wallet?**
A: Hidden Wallet uses proven cryptographic methods and does not store your private keys. All operations are performed locally.

**Q: Can I use my existing wallet?**
A: Yes, Hidden Wallet works as a layer on top of your existing Solana wallet.

**Q: Does this affect transaction speed?**
A: Additional security layers may slightly increase transaction processing time, but this is usually negligible.

**Q: Is Hidden Wallet compatible with other applications?**
A: Hidden Wallet is compatible with standard Solana wallets and applications.

### License

MIT License

### Support

For questions and support:
- GitHub Issues: [github.com/hidden-wallet/issues](https://github.com/hidden-wallet/issues)
- Email: support@hidden-wallet.com
- Discord: [discord.gg/hidden-wallet](https://discord.gg/hidden-wallet)
