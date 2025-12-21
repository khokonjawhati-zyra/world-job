import {
  Injectable,
  Logger,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class SecurityService {
  private readonly logger = new Logger(SecurityService.name);
  private readonly encryptionKey = crypto.scryptSync(
    'my-super-secret-password',
    'salt',
    32,
  ); // AES-256 requires 32-byte key
  private readonly algorithm = 'aes-256-cbc';
  private readonly iv = crypto.randomBytes(16); // IV should usually be unique per encryption, stored with data. For demo, simplified.

  // In-memory store for IP blocking (Use Redis in production)
  private ipAttemptMap: Map<string, { count: number; expires: number }> =
    new Map();
  private bannedIps: Set<string> = new Set();

  // Simulated Cold Storage
  private coldStorageBalance = 0;
  private hotWalletThreshold = 10000; // Keep only $10k in hot wallet

  // --- 1. End-to-End Encryption (E2EE) ---

  encrypt(text: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
      this.algorithm,
      this.encryptionKey,
      iv,
    );
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    // Store IV with the encrypted data (iv:encryptedContent)
    return `${iv.toString('hex')}:${encrypted}`;
  }

  decrypt(text: string): string {
    const parts = text.split(':');
    if (parts.length !== 2) throw new Error('Invalid encrypted format');

    const iv = Buffer.from(parts[0], 'hex');
    const encryptedText = parts[1];

    const decipher = crypto.createDecipheriv(
      this.algorithm,
      this.encryptionKey,
      iv,
    );
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  // --- 2. Blockchain-Style Ledger Hashing ---

  generateTransactionHash(prevHash: string, data: any): string {
    const payload = prevHash + JSON.stringify(data) + Date.now().toString();
    return crypto.createHash('sha256').update(payload).digest('hex');
  }

  verifyLedgerIntegrity(chain: any[]): boolean {
    for (let i = 1; i < chain.length; i++) {
      const current = chain[i];
      const previous = chain[i - 1];
      if (current.prevHash !== previous.hash) return false;
      // In real blockchain, we'd also re-calculate current.hash to ensure data hasn't changed.
    }
    return true;
  }

  // --- 3. Multi-Factor Authentication (MFA) ---

  // Mock generating a secret
  generateMFASecret(userId: string) {
    // In real app: use 'otplib'
    const secret = crypto.randomBytes(10).toString('hex');
    const otpAuthUrl = `otpauth://totp/WorldJobMarket:${userId}?secret=${secret}&issuer=WorldJobMarket`;
    return { secret, otpAuthUrl };
  }

  verifyMFA(token: string, secret: string): boolean {
    // Mock Verification: Accept '123456' or simple check
    // In real app: otplib.authenticator.check(token, secret);
    if (token === '123456') return true;
    return false;
  }

  // --- 4. Brute Force & IP Shunning ---

  checkIpRateLimit(ip: string): boolean {
    if (this.bannedIps.has(ip)) {
      throw new UnauthorizedException(
        'Access Denied: IP Banned for 24 Hours due to suspicious activity.',
      );
    }

    const record = this.ipAttemptMap.get(ip) || {
      count: 0,
      expires: Date.now() + 3600000,
    };

    // Reset if expired
    if (Date.now() > record.expires) {
      record.count = 0;
      record.expires = Date.now() + 3600000;
    }

    // Check Limit (3 attempts)
    if (record.count >= 3) {
      this.bannedIps.add(ip);
      this.logger.warn(
        `Security Alert: IP ${ip} has been BANNED for brute force attempts.`,
      );

      // Unban after 24 hours
      setTimeout(() => this.bannedIps.delete(ip), 24 * 60 * 60 * 1000);

      throw new UnauthorizedException('Access Denied: IP Banned for 24 Hours.');
    }

    return true;
  }

  recordFailedAttempt(ip: string) {
    const record = this.ipAttemptMap.get(ip) || {
      count: 0,
      expires: Date.now() + 3600000,
    };
    record.count += 1;
    this.ipAttemptMap.set(ip, record);
    this.logger.warn(
      `Security Warning: Failed attempt from ${ip} (${record.count}/3)`,
    );
  }

  // --- 5. Cold Storage Logic ---

  processColdStorageSweep(currentHotBalance: number): number {
    if (currentHotBalance > this.hotWalletThreshold) {
      const excess = currentHotBalance * 0.9; // Move 90%
      const remaining = currentHotBalance - excess;
      this.coldStorageBalance += excess;

      this.logger.log(
        `❄️ COLD STORAGE SWEEP: Moved $${excess.toFixed(2)} to Cold Wallet.`,
      );
      this.logger.log(`   - New Hot Wallet Balance: $${remaining.toFixed(2)}`);
      this.logger.log(
        `   - Total Cold Storage: $${this.coldStorageBalance.toFixed(2)}`,
      );

      return remaining;
    }
    return currentHotBalance;
  }
}
