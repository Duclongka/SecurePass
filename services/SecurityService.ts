import CryptoJS from 'crypto-js';

export class SecurityService {
  private static ITERATIONS = 100000;
  private static VERSION = '3.0.0';

  // Helper to generate random salt
  static generateSalt(size = 32): string {
    return CryptoJS.lib.WordArray.random(size).toString(CryptoJS.enc.Hex);
  }

  // Step 1: Onboarding
  static async initMasterAuth(password: string): Promise<{ salt: string; authHash: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const salt = SecurityService.generateSalt();
        const passwordWA = CryptoJS.enc.Utf8.parse(password);
        const saltWA = CryptoJS.enc.Hex.parse(salt);
        
        const key = CryptoJS.PBKDF2(passwordWA, saltWA, {
          keySize: 256 / 32,
          iterations: SecurityService.ITERATIONS,
          hasher: CryptoJS.algo.SHA256
        });
        
        const authHash = CryptoJS.SHA256(key).toString(CryptoJS.enc.Hex);
        resolve({ salt, authHash });
      }, 100);
    });
  }

  // Step 2: Verify Access & Device Migration
  static async verifyAccess(password: string, keyFileData: string | any): Promise<{ success: boolean; error?: string; salt?: string; authHash?: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          const keyFile = typeof keyFileData === 'string' ? JSON.parse(keyFileData) : keyFileData;
          if (!keyFile || keyFile.type !== 'MASTER_KEY_FILE') {
            return resolve({ success: false, error: 'ERR_INVALID_FILE_TYPE' });
          }
          
          const salt = keyFile.salt;
          const iterations = Number(keyFile.iterations) || SecurityService.ITERATIONS;
          const passwordWA = CryptoJS.enc.Utf8.parse(password);
          
          let saltWA;
          try {
            if (/^[0-9a-fA-F]+$/.test(salt)) {
              saltWA = CryptoJS.enc.Hex.parse(salt);
            } else {
              saltWA = CryptoJS.enc.Base64.parse(salt);
            }
          } catch (e) {
            saltWA = CryptoJS.enc.Base64.parse(salt);
          }
          
          const key = CryptoJS.PBKDF2(passwordWA, saltWA, {
            keySize: 256 / 32,
            iterations: iterations,
            hasher: CryptoJS.algo.SHA256
          });
          
          const authHash = CryptoJS.SHA256(key).toString(CryptoJS.enc.Hex);
          
          if (authHash === keyFile.authHash) {
            resolve({ success: true, salt, authHash });
          } else {
            console.warn("AuthHash mismatch", { computed: authHash, stored: keyFile.authHash });
            resolve({ success: false, error: 'ERR_INVALID_PASSWORD' });
          }
        } catch (e) {
          console.error("VerifyAccess Error", e);
          resolve({ success: false, error: 'ERR_FILE_CORRUPTED' });
        }
      }, 100);
    });
  }

  // Step 3: Re-key System
  static async reKeySystem(oldPassword: string, newPassword: string, currentVault: any): Promise<{ success: boolean; newVault?: any; newKeyFile?: any; error?: string }> {
    return new Promise((resolve) => {
      setTimeout(async () => {
        try {
          // 1. Decrypt vault with old password
          const decryptedVault = await this.decryptVault(currentVault, oldPassword);
          if (!decryptedVault) return resolve({ success: false, error: 'ERR_INVALID_PASSWORD' });

          // 2. Create new salt and key from new password
          const { salt, authHash } = await this.initMasterAuth(newPassword);

          // 3. Encrypt vault with new password
          const newVault = await this.encryptVault(decryptedVault, newPassword);

          // 4. Create new Key File
          const newKeyFile = {
            type: 'MASTER_KEY_FILE',
            version: this.VERSION,
            salt,
            iterations: this.ITERATIONS,
            authHash,
            createdAt: Date.now()
          };

          resolve({ success: true, newVault, newKeyFile });
        } catch (e) {
          resolve({ success: false, error: 'ERR_REKEY_FAILED' });
        }
      }, 0);
    });
  }

  // Step 4: Backup & Import
  static async exportVault(vaultData: any, password: string): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(async () => {
        const encrypted = await this.encryptVault(JSON.stringify(vaultData), password);
        const checksum = CryptoJS.SHA256(JSON.stringify(encrypted)).toString();
        const backup = {
          type: 'SECUREPASS_BACKUP',
          version: this.VERSION,
          header: {
            salt: encrypted.salt,
            iterations: this.ITERATIONS,
            checksum
          },
          data: encrypted
        };
        resolve(JSON.stringify(backup));
      }, 0);
    });
  }

  static async importVault(backupFileContent: string, currentPassword: string): Promise<{ success: boolean; data?: any; error?: string; needsPassword?: boolean; authHash?: string; salt?: string }> {
    return new Promise((resolve) => {
      setTimeout(async () => {
        try {
          const backup = JSON.parse(backupFileContent);
          if (backup.type !== 'SECUREPASS_BACKUP') return resolve({ success: false, error: 'ERR_INVALID_FILE_TYPE' });

          // Check integrity
          const checksum = CryptoJS.SHA256(JSON.stringify(backup.data)).toString();
          if (checksum !== backup.header.checksum) return resolve({ success: false, error: 'ERR_FILE_CORRUPTED' });

          // Try decrypt with current password
          try {
            const decrypted = await this.decryptVault(backup.data, currentPassword);
            if (decrypted) {
              // Compute authHash for the new device to establish master key
              const salt = backup.header.salt;
              const iterations = backup.header.iterations || SecurityService.ITERATIONS;
              const passwordWA = CryptoJS.enc.Utf8.parse(currentPassword);
              
              let saltWA;
              try {
                if (/^[0-9a-fA-F]+$/.test(salt)) {
                  saltWA = CryptoJS.enc.Hex.parse(salt);
                } else {
                  saltWA = CryptoJS.enc.Base64.parse(salt);
                }
              } catch (e) {
                saltWA = CryptoJS.enc.Base64.parse(salt);
              }

              const key = CryptoJS.PBKDF2(passwordWA, saltWA, {
                keySize: 256 / 32,
                iterations: iterations,
                hasher: CryptoJS.algo.SHA256
              });
              
              const authHash = CryptoJS.SHA256(key).toString(CryptoJS.enc.Hex);

              return resolve({ 
                success: true, 
                data: JSON.parse(decrypted),
                authHash,
                salt
              });
            }
          } catch (e) {
            // If failed, it might be a different password
          }

          resolve({ success: false, needsPassword: true });
        } catch (e) {
          resolve({ success: false, error: 'ERR_FILE_CORRUPTED' });
        }
      }, 0);
    });
  }

  // Core Encryption/Decryption Logic (AES-CBC + HMAC)
  static async encryptVault(data: string, password: string): Promise<{ ciphertext: string; iv: string; salt: string; hmac: string; iterations: number }> {
    const salt = SecurityService.generateSalt();
    const passwordWA = CryptoJS.enc.Utf8.parse(password);
    const saltWA = CryptoJS.enc.Hex.parse(salt);
    
    const key = CryptoJS.PBKDF2(passwordWA, saltWA, {
      keySize: 256 / 32,
      iterations: SecurityService.ITERATIONS,
      hasher: CryptoJS.algo.SHA256
    });
    
    const iv = CryptoJS.lib.WordArray.random(16);
    const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(data), key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    const ciphertextWA = encrypted.ciphertext;
    const ciphertextBase64 = ciphertextWA.toString(CryptoJS.enc.Base64);
    const hmac = CryptoJS.HmacSHA256(ciphertextWA, key).toString(CryptoJS.enc.Base64);

    return {
      ciphertext: ciphertextBase64,
      iv: iv.toString(CryptoJS.enc.Base64),
      salt,
      hmac,
      iterations: SecurityService.ITERATIONS
    };
  }

  static async decryptVault(encryptedData: any, password: string): Promise<string | null> {
    try {
      if (!encryptedData || !encryptedData.ciphertext || !encryptedData.salt) {
        console.error("DecryptVault: Missing required data fields");
        return null;
      }

      const { ciphertext, iv, salt, hmac } = encryptedData;
      const iterations = Number(encryptedData.iterations) || SecurityService.ITERATIONS;
      const passwordWA = CryptoJS.enc.Utf8.parse(password);
      
      let saltWA;
      try {
        // Try Hex first (new format)
        if (/^[0-9a-fA-F]+$/.test(salt)) {
          saltWA = CryptoJS.enc.Hex.parse(salt);
        } else {
          // Fallback to Base64 (old format)
          saltWA = CryptoJS.enc.Base64.parse(salt);
        }
      } catch (e) {
        saltWA = CryptoJS.enc.Base64.parse(salt);
      }
      
      const key = CryptoJS.PBKDF2(passwordWA, saltWA, {
        keySize: 256 / 32,
        iterations: iterations,
        hasher: CryptoJS.algo.SHA256
      });

      const ciphertextWA = CryptoJS.enc.Base64.parse(ciphertext);

      // Verify HMAC if present
      if (hmac) {
        const expectedHmac = CryptoJS.HmacSHA256(ciphertextWA, key).toString(CryptoJS.enc.Base64);
        if (hmac !== expectedHmac) {
          // Try legacy HMAC (where ciphertext was stringified before HMAC)
          const legacyHmac = CryptoJS.HmacSHA256(ciphertext, key).toString(CryptoJS.enc.Base64);
          if (hmac !== legacyHmac) {
            console.error("DecryptVault: HMAC verification failed");
            return null;
          }
        }
      }

      const decrypted = CryptoJS.AES.decrypt(
        { ciphertext: ciphertextWA } as any,
        key,
        {
          iv: CryptoJS.enc.Base64.parse(iv),
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
        }
      );

      try {
        const result = decrypted.toString(CryptoJS.enc.Utf8);
        if (!result && ciphertextWA.sigBytes > 0) {
          console.error("DecryptVault: Decryption resulted in empty string (likely wrong password)");
          return null;
        }
        return result;
      } catch (utf8Error) {
        console.error("DecryptVault: Malformed UTF-8 data (likely wrong password or corrupted data)");
        return null;
      }
    } catch (e) {
      console.error("DecryptVault: Unexpected error during decryption process", e);
      return null;
    }
  }

  // --- Biometric Support (Legacy/Compatibility) ---
  static async isBiometricAvailable(): Promise<boolean> {
    return !!(
      window.PublicKeyCredential &&
      window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable &&
      await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
    );
  }

  static async setupBiometric(masterPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      const available = await this.isBiometricAvailable();
      if (!available) return { success: false, error: 'NOT_SUPPORTED' };
      
      // Encrypt the master password with a fixed internal key
      // This allows the biometric unlock to "retrieve" the master password
      const encrypted = await this.encryptVault(masterPassword, "BIO_INTERNAL_KEY");
      localStorage.setItem('securepass_biometric_vault', JSON.stringify(encrypted));
      return { success: true };
    } catch (e) {
      console.error("Biometric Setup Error", e);
      return { success: false, error: 'SETUP_FAILED' };
    }
  }

  static async disableBiometric(): Promise<void> {
    localStorage.removeItem('securepass_biometric_vault');
  }

  static async authenticateBiometric(): Promise<string> {
    const bioVault = localStorage.getItem('securepass_biometric_vault');
    if (!bioVault) throw new Error("Biometrics not setup");
    const decrypted = await this.decryptVault(JSON.parse(bioVault), "BIO_INTERNAL_KEY");
    if (!decrypted) throw new Error("Biometric decryption failed");
    return decrypted;
  }
}
