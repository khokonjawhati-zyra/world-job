import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { SecurityService } from '../security/security.service';

@Injectable()
export class PaymentConfigService {
    private readonly logger = new Logger(PaymentConfigService.name);
    private readonly DATA_FILE = path.join(process.cwd(), 'data', 'payment_gateways_encrypted.json');

    constructor(private securityService: SecurityService) { }

    async saveConfig(config: any) {
        // Encrypt sensitive fields
        const encryptedConfig = {
            isSandbox: config.isSandbox,
            sslcommerz: {
                storeId: this.securityService.encrypt(config.sslcommerz?.storeId || ''),
                password: this.securityService.encrypt(config.sslcommerz?.password || ''),
            },
            stripe: {
                publicKey: this.securityService.encrypt(config.stripe?.publicKey || ''),
                secretKey: this.securityService.encrypt(config.stripe?.secretKey || ''),
            },
            updatedAt: new Date(),
        };

        try {
            fs.writeFileSync(this.DATA_FILE, JSON.stringify(encryptedConfig, null, 2));
            this.logger.log('Payment Gateway Configuration Saved & Encrypted');
            return { success: true };
        } catch (error) {
            this.logger.error('Failed to save config', error);
            throw error;
        }
    }

    async getConfig(showSecrets = false) {
        if (!fs.existsSync(this.DATA_FILE)) {
            return { isSandbox: true, sslcommerz: {}, stripe: {} }; // Defaults
        }

        try {
            const data = JSON.parse(fs.readFileSync(this.DATA_FILE, 'utf8'));

            // Decrypt for internal use or return masked for UI
            if (showSecrets) {
                return {
                    isSandbox: data.isSandbox,
                    sslcommerz: {
                        storeId: this.decryptSafe(data.sslcommerz?.storeId),
                        password: this.decryptSafe(data.sslcommerz?.password)
                    },
                    stripe: {
                        publicKey: this.decryptSafe(data.stripe?.publicKey),
                        secretKey: this.decryptSafe(data.stripe?.secretKey)
                    }
                };
            }

            // Return Masked
            return {
                isSandbox: data.isSandbox,
                sslcommerz: {
                    storeId: this.mask(this.decryptSafe(data.sslcommerz?.storeId)),
                    password: '••••••••',
                },
                stripe: {
                    publicKey: this.mask(this.decryptSafe(data.stripe?.publicKey)),
                    secretKey: '••••••••',
                },
            };

        } catch (error) {
            this.logger.error('Failed to read config', error);
            return {};
        }
    }

    private decryptSafe(encrypted: string): string {
        if (!encrypted) return '';
        try {
            return this.securityService.decrypt(encrypted);
        } catch (e) {
            return '';
        }
    }

    private mask(text: string): string {
        if (!text || text.length < 8) return '****';
        return text.substring(0, 4) + '****' + text.substring(text.length - 4);
    }
}
