import CryptoJS from 'crypto-js';

export type SecurityLevel = 'basic' | 'standard' | 'high';

export class EncryptionService {
  private securityLevel: SecurityLevel;
  private masterKey: string;

  constructor(securityLevel: SecurityLevel = 'standard') {
    this.securityLevel = securityLevel;
    this.masterKey = this.generateMasterKey();
  }

  /**
   * Шифрование данных
   */
  async encrypt(data: string, key?: string): Promise<string> {
    try {
      const encryptionKey = key || this.masterKey;
      
      switch (this.securityLevel) {
        case 'basic':
          return this.encryptAES(data, encryptionKey);
        case 'standard':
          return this.encryptAES256(data, encryptionKey);
        case 'high':
          return this.encryptAES256GCM(data, encryptionKey);
        default:
          return this.encryptAES256(data, encryptionKey);
      }
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  /**
   * Дешифрование данных
   */
  async decrypt(encryptedData: string, key?: string): Promise<string> {
    try {
      const encryptionKey = key || this.masterKey;
      
      switch (this.securityLevel) {
        case 'basic':
          return this.decryptAES(encryptedData, encryptionKey);
        case 'standard':
          return this.decryptAES256(encryptedData, encryptionKey);
        case 'high':
          return this.decryptAES256GCM(encryptedData, encryptionKey);
        default:
          return this.decryptAES256(encryptedData, encryptionKey);
      }
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  /**
   * Генерация мастер-ключа
   */
  private generateMasterKey(): string {
    if (typeof window !== 'undefined') {
      // Use Web Crypto API if available
      const array = new Uint8Array(32);
      crypto.getRandomValues(array);
      return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }
    // Fallback for Node.js
    return CryptoJS.lib.WordArray.random(32).toString();
  }

  /**
   * AES шифрование (базовый уровень)
   */
  private encryptAES(data: string, key: string): string {
    const encrypted = CryptoJS.AES.encrypt(data, key).toString();
    return encrypted;
  }

  /**
   * AES дешифрование (базовый уровень)
   */
  private decryptAES(encryptedData: string, key: string): string {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, key);
    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  /**
   * AES-256 шифрование (стандартный уровень)
   */
  private encryptAES256(data: string, key: string): string {
    const keyHash = CryptoJS.SHA256(key);
    const encrypted = CryptoJS.AES.encrypt(data, keyHash, {
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }).toString();
    return encrypted;
  }

  /**
   * AES-256 дешифрование (стандартный уровень)
   */
  private decryptAES256(encryptedData: string, key: string): string {
    const keyHash = CryptoJS.SHA256(key);
    const decrypted = CryptoJS.AES.decrypt(encryptedData, keyHash, {
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  /**
   * AES-256-GCM шифрование (высокий уровень)
   */
  private async encryptAES256GCM(data: string, key: string): Promise<string> {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      // Use Web Crypto API for GCM
      const keyBuffer = await this.deriveKey(key);
      const dataBuffer = new TextEncoder().encode(data);
      const iv = crypto.getRandomValues(new Uint8Array(12));
      
      const encrypted = await crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: iv
        },
        keyBuffer,
        dataBuffer
      );

      // Combine IV and encrypted data
      const combined = new Uint8Array(iv.length + encrypted.byteLength);
      combined.set(iv, 0);
      combined.set(new Uint8Array(encrypted), iv.length);

      return btoa(String.fromCharCode(...combined));
    } else {
      // Fallback to standard AES-256
      return this.encryptAES256(data, key);
    }
  }

  /**
   * AES-256-GCM дешифрование (высокий уровень)
   */
  private async decryptAES256GCM(encryptedData: string, key: string): Promise<string> {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      // Use Web Crypto API for GCM
      const keyBuffer = await this.deriveKey(key);
      const combined = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
      
      const iv = combined.slice(0, 12);
      const encrypted = combined.slice(12);

      const decrypted = await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: iv
        },
        keyBuffer,
        encrypted
      );

      return new TextDecoder().decode(decrypted);
    } else {
      // Fallback to standard AES-256
      return this.decryptAES256(encryptedData, key);
    }
  }

  /**
   * Производный ключ для Web Crypto API
   */
  private async deriveKey(password: string): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveBits', 'deriveKey']
    );

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: encoder.encode('hidden-wallet-salt'),
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Хеширование данных
   */
  hash(data: string): string {
    return CryptoJS.SHA256(data).toString();
  }

  /**
   * Генерация случайных данных
   */
  generateRandomBytes(length: number): string {
    if (typeof window !== 'undefined') {
      const array = new Uint8Array(length);
      crypto.getRandomValues(array);
      return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }
    return CryptoJS.lib.WordArray.random(length).toString();
  }
}

