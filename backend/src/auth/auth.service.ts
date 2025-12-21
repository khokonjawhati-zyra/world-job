import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  private users = new Map<string, any>(); // Mock DB

  constructor(private jwtService: JwtService) {
    // Seed a mock user
    this.register({
      email: 'test@example.com',
      password: 'password123',
      role: 'WORKER',
      fullName: 'Test User',
    });

    // Seed Mock Buyer (201)
    this.users.set('buyer@example.com', {
      userId: '201',
      email: 'buyer@example.com',
      passwordHash: 'mockHash',
      role: 'BUYER',
      fullName: 'Mock Buyer',
      agreedToTerms: true,
      referralCount: 0,
      referralEarnings: 0
    });

    // Seed Mock Worker (101)
    this.users.set('worker@example.com', {
      userId: '101',
      email: 'worker@example.com',
      passwordHash: 'mockHash',
      role: 'WORKER',
      fullName: 'Alice Developer',
      agreedToTerms: true,
      referralCount: 0,
      referralEarnings: 0
    });

    // Seed Mock Worker (102)
    this.users.set('worker2@example.com', {
      userId: '102',
      email: 'worker2@example.com',
      passwordHash: 'mockHash',
      role: 'WORKER',
      fullName: 'Bob Backend',
      agreedToTerms: true,
      referralCount: 0,
      referralEarnings: 0
    });

    // Seed Mock Admin via register to ensure hash is correct
    this.register({
      email: 'admin',
      password: 'admin123',
      role: 'ADMIN',
      fullName: 'Super Admin',
      agreedToTerms: true
    }).catch(e => console.log('Admin seed error:', e.message)); // Catch if already exists
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = this.users.get(email);
    if (user && (await bcrypt.compare(pass, user.passwordHash))) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.userId, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: { ...user, passwordHash: undefined },
    };
  }

  generateReferralCode(name: string): string {
    const safeName = name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().substring(0, 4);
    const random = Math.floor(1000 + Math.random() * 9000);
    return `${safeName}${random}`;
  }

  async register(registrationDto: any) {
    if (this.users.has(registrationDto.email)) {
      throw new UnauthorizedException('User already exists');
    }
    const hashedPassword = await bcrypt.hash(registrationDto.password, 10);

    // Resolve Referrer
    let referredBy = null;
    if (registrationDto.referralCode) {
      // Find user with this code
      for (const [email, user] of this.users.entries()) {
        if (user.referralCode === registrationDto.referralCode) {
          referredBy = user.userId;
          // Increment referrer count
          user.referralCount = (user.referralCount || 0) + 1;
          break;
        }
      }
    }

    const newUser = {
      userId: uuidv4(),
      email: registrationDto.email,
      passwordHash: hashedPassword,
      role: registrationDto.role,
      fullName: registrationDto.fullName,
      referralCode: this.generateReferralCode(registrationDto.fullName),
      referredBy: referredBy,
      referralCount: 0,
      referralEarnings: 0,
      agreedToTerms: registrationDto.agreedToTerms || false,
      agreedToTermsAt: registrationDto.agreedToTermsAt || null,
      createdAt: new Date(),
    };
    this.users.set(newUser.email, newUser);
    return this.login(newUser);
  }

  // Referral Helpers
  getUserById(userId: string) {
    for (const user of this.users.values()) {
      if (user.userId === userId) return user;
    }
    return null;
  }

  getUserByReferralCode(code: string) {
    for (const user of this.users.values()) {
      if (user.referralCode === code) return user;
    }
    return null;
  }

  async trackReferralEarning(userId: string, amount: number) {
    const user = this.getUserById(userId);
    if (user) {
      user.referralEarnings = (user.referralEarnings || 0) + amount;
    }
  }

  // 2FA Mock
  // 2FA Mock
  async enable2FA(userId: string) {
    // Mock generating 2FA secret
    return { secret: 'MOCK_2FA_SECRET_QR_CODE' };
  }

  getAllUsers() {
    return Array.from(this.users.values()).map(u => {
      const { passwordHash, ...safeUser } = u;
      return safeUser;
    });
  }

  async updateUser(userId: string, updates: any) {
    const user = this.getUserById(userId);
    if (!user) throw new Error("User not found");

    // Merge updates
    const { passwordHash, userId: uid, email, ...safeUpdates } = updates;
    Object.assign(user, safeUpdates);
    return { success: true, user: this.getUserById(userId) };
  }

  async banUser(userId: string) {
    const user = this.getUserById(userId);
    if (!user) throw new Error("User not found");
    user.status = 'BANNED';
    return { success: true };
  }
}
