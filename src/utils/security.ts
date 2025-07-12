// Security utilities for payment processing - Browser Compatible Version
export class SecurityUtils {
  // Generate secure random tokens using Web Crypto API
  static generateSecureToken(length: number = 32): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // Simple hash function for browser compatibility
  static async hashData(data: string, salt?: string): Promise<string> {
    const actualSalt = salt || this.generateSecureToken(16);
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data + actualSalt);
    
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return `${actualSalt}:${hashHex}`;
  }

  // Verify hashed data
  static async verifyHash(data: string, hash: string): Promise<boolean> {
    try {
      const [salt, originalHash] = hash.split(':');
      const newHash = await this.hashData(data, salt);
      const [, newHashValue] = newHash.split(':');
      return originalHash === newHashValue;
    } catch (error) {
      console.error('Hash verification error:', error);
      return false;
    }
  }

  // Simple encryption using Web Crypto API
  static async encrypt(text: string, password: string): Promise<string> {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      
      // Generate a key from password
      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        encoder.encode(password),
        { name: 'PBKDF2' },
        false,
        ['deriveBits', 'deriveKey']
      );
      
      const salt = crypto.getRandomValues(new Uint8Array(16));
      const key = await crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: salt,
          iterations: 100000,
          hash: 'SHA-256',
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt']
      );
      
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: iv },
        key,
        data
      );
      
      // Combine salt, iv, and encrypted data
      const result = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
      result.set(salt, 0);
      result.set(iv, salt.length);
      result.set(new Uint8Array(encrypted), salt.length + iv.length);
      
      return Array.from(result, byte => byte.toString(16).padStart(2, '0')).join('');
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Encryption failed');
    }
  }

  // Simple decryption using Web Crypto API
  static async decrypt(encryptedData: string, password: string): Promise<string> {
    try {
      const data = new Uint8Array(encryptedData.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
      
      const salt = data.slice(0, 16);
      const iv = data.slice(16, 28);
      const encrypted = data.slice(28);
      
      const encoder = new TextEncoder();
      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        encoder.encode(password),
        { name: 'PBKDF2' },
        false,
        ['deriveBits', 'deriveKey']
      );
      
      const key = await crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: salt,
          iterations: 100000,
          hash: 'SHA-256',
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['decrypt']
      );
      
      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: iv },
        key,
        encrypted
      );
      
      const decoder = new TextDecoder();
      return decoder.decode(decrypted);
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Decryption failed');
    }
  }

  // Validate credit card number using Luhn algorithm
  static validateCreditCard(cardNumber: string): boolean {
    const num = cardNumber.replace(/\D/g, '');
    let sum = 0;
    let isEven = false;
    
    for (let i = num.length - 1; i >= 0; i--) {
      let digit = parseInt(num.charAt(i), 10);
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    return sum % 10 === 0;
  }

  // Mask sensitive data for logging
  static maskCardNumber(cardNumber: string): string {
    const num = cardNumber.replace(/\D/g, '');
    if (num.length < 4) return '****';
    
    const firstFour = num.substring(0, 4);
    const lastFour = num.substring(num.length - 4);
    const middle = '*'.repeat(num.length - 8);
    
    return `${firstFour}${middle}${lastFour}`;
  }

  // Generate CSRF token
  static generateCSRFToken(): string {
    return this.generateSecureToken(32);
  }

  // Validate request origin
  static validateOrigin(origin: string, allowedOrigins: string[]): boolean {
    return allowedOrigins.includes(origin);
  }

  // Rate limiting check
  static checkRateLimit(identifier: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // In a real implementation, this would use Redis or a database
    const requests = JSON.parse(localStorage.getItem(`rate_limit_${identifier}`) || '[]');
    const validRequests = requests.filter((timestamp: number) => timestamp > windowStart);
    
    if (validRequests.length >= maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    localStorage.setItem(`rate_limit_${identifier}`, JSON.stringify(validRequests));
    
    return true;
  }

  // Simple password hashing for browser compatibility
  static hashPassword(password: string): string {
    // Simple hash implementation for demo purposes
    // In production, use a proper password hashing library
    let hash = 0;
    const salt = this.generateSecureToken(8);
    const combined = password + salt;
    
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return `${salt}:${Math.abs(hash).toString(16)}`;
  }

  // Verify simple password hash
  static verifyPassword(password: string, hash: string): boolean {
    try {
      const [salt, originalHash] = hash.split(':');
      const combined = password + salt;
      let newHash = 0;
      
      for (let i = 0; i < combined.length; i++) {
        const char = combined.charCodeAt(i);
        newHash = ((newHash << 5) - newHash) + char;
        newHash = newHash & newHash;
      }
      
      return originalHash === Math.abs(newHash).toString(16);
    } catch (error) {
      return false;
    }
  }
}