import * as crypto from 'crypto';

export interface EncryptionOptions {
  algorithm?: string;
  inputEncoding?: BufferEncoding;
  outputEncoding?: BufferEncoding;
}

export class SecurityUtils {
  // Generate cryptographically secure random string
  static generateSecureToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  // Hash password with salt
  static hashPassword(
    password: string, 
    salt?: string
  ): { 
    hashedPassword: string; 
    salt: string 
  } {
    // Use default salt if not provided
    const passwordSalt = salt || this.generateSecureToken(16);
    
    // Use PBKDF2 for secure password hashing
    const iterations = 100000;
    const keylen = 64;
    const digest = 'sha512';

    const hashedPassword = crypto.pbkdf2Sync(
      password, 
      passwordSalt, 
      iterations, 
      keylen, 
      digest
    ).toString('hex');

    return {
      hashedPassword,
      salt: passwordSalt
    };
  }

  // Verify password
  static verifyPassword(
    inputPassword: string, 
    storedHash: string, 
    salt: string
  ): boolean {
    const { hashedPassword } = this.hashPassword(inputPassword, salt);
    return crypto.timingSafeEqual(
      Buffer.from(hashedPassword),
      Buffer.from(storedHash)
    );
  }

  // Symmetric encryption
  static encrypt(
    data: string, 
    secretKey: string,
    options?: EncryptionOptions
  ): string {
    const defaultOptions: EncryptionOptions = {
      algorithm: 'aes-256-cbc',
      inputEncoding: 'utf8',
      outputEncoding: 'hex'
    };

    const mergedOptions = { ...defaultOptions, ...options };

    try {
      // Create initialization vector
      const iv = crypto.randomBytes(16);
      
      // Create cipher
      const cipher = crypto.createCipheriv(
        mergedOptions.algorithm, 
        Buffer.from(secretKey, 'hex'), 
        iv
      );

      // Encrypt data
      let encrypted = cipher.update(
        data, 
        mergedOptions.inputEncoding, 
        mergedOptions.outputEncoding
      );
      encrypted += cipher.final(mergedOptions.outputEncoding);

      // Return IV + encrypted data
      return iv.toString('hex') + ':' + encrypted;
    } catch (error) {
      console.error('Encryption failed', error);
      throw new Error('Encryption failed');
    }
  }

  // Symmetric decryption
  static decrypt(
    encryptedData: string, 
    secretKey: string,
    options?: EncryptionOptions
  ): string {
    const defaultOptions: EncryptionOptions = {
      algorithm: 'aes-256-cbc',
      inputEncoding: 'utf8',
      outputEncoding: 'hex'
    };

    const mergedOptions = { ...defaultOptions, ...options };

    try {
      // Split IV and encrypted data
      const [ivHex, encryptedText] = encryptedData.split(':');
      
      // Create decipher
      const decipher = crypto.createDecipheriv(
        mergedOptions.algorithm, 
        Buffer.from(secretKey, 'hex'), 
        Buffer.from(ivHex, 'hex')
      );

      // Decrypt data
      let decrypted = decipher.update(
        encryptedText, 
        mergedOptions.outputEncoding, 
        mergedOptions.inputEncoding
      );
      decrypted += decipher.final(mergedOptions.inputEncoding);

      return decrypted;
    } catch (error) {
      console.error('Decryption failed', error);
      throw new Error('Decryption failed');
    }
  }

  // Generate asymmetric key pair
  static generateKeyPair(
    type: 'rsa' | 'ec' = 'rsa', 
    options?: {
      modulusLength?: number;
      publicKeyEncoding?: crypto.KeyFormat;
      privateKeyEncoding?: crypto.KeyFormat;
    }
  ): {
    publicKey: string;
    privateKey: string;
  } {
    const defaultOptions = {
      modulusLength: 2048,
      publicKeyEncoding: 'pem' as crypto.KeyFormat,
      privateKeyEncoding: 'pem' as crypto.KeyFormat
    };

    const mergedOptions = { ...defaultOptions, ...options };

    const { publicKey, privateKey } = crypto.generateKeyPairSync(type, {
      modulusLength: mergedOptions.modulusLength,
      publicKeyEncoding: {
        type: 'spki',
        format: mergedOptions.publicKeyEncoding
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: mergedOptions.privateKeyEncoding,
        cipher: 'aes-256-cbc',
        passphrase: this.generateSecureToken()
      }
    });

    return {
      publicKey,
      privateKey
    };
  }

  // Sanitize input to prevent XSS
  static sanitizeInput(input: string): string {
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  // Generate secure random number
  static generateSecureRandomNumber(
    min: number, 
    max: number
  ): number {
    const range = max - min + 1;
    const bytesNeeded = Math.ceil(Math.log2(range) / 8);
    const cutoff = Math.floor((256 ** bytesNeeded) / range) * range;
    
    const bytes = crypto.randomBytes(bytesNeeded);
    const randomValue = bytes.readUIntBE(0, bytesNeeded);

    if (randomValue < cutoff) {
      return min + (randomValue % range);
    } else {
      return this.generateSecureRandomNumber(min, max);
    }
  }
}

// Example usage
const secureToken = SecurityUtils.generateSecureToken();

const { hashedPassword, salt } = SecurityUtils.hashPassword('mySecurePassword');

const encryptionKey = SecurityUtils.generateSecureToken(32);
const encryptedData = SecurityUtils.encrypt(
  'Sensitive Information', 
  encryptionKey
);

const decryptedData = SecurityUtils.decrypt(
  encryptedData, 
  encryptionKey
);

const { publicKey, privateKey } = SecurityUtils.generateKeyPair();