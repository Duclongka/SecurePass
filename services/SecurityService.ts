import CryptoJS from 'crypto-js';

export class SecurityService {
  private static ITERATIONS = 100000;
  private static VERSION = '4.0.0';

  // Helper to generate random salt
  static generateSalt(size = 32): string {
    return CryptoJS.lib.WordArray.random(size).toString(CryptoJS.enc.Hex);
  }

  // Generate a key from password and salt using PBKDF2
  private static async deriveKey(password: string, salt: string, iterations: number): Promise<CryptoJS.lib.WordArray> {
    return new Promise((resolve) => {
      const passwordWA = CryptoJS.enc.Utf8.parse(password);
      const saltWA = CryptoJS.enc.Hex.parse(salt);
      const key = CryptoJS.PBKDF2(passwordWA, saltWA, {
        keySize: 256 / 32,
        iterations: iterations,
        hasher: CryptoJS.algo.SHA256
      });
      resolve(key);
    });
  }

  // Step 1: Onboarding / Create Master Auth
  static async initMasterAuth(password: string): Promise<{ salt: string; authHash: string; iterations: number }> {
    return new Promise(async (resolve) => {
      const salt = SecurityService.generateSalt();
      const key = await SecurityService.deriveKey(password, salt, SecurityService.ITERATIONS);
      const authHash = CryptoJS.SHA256(key).toString(CryptoJS.enc.Hex);
      resolve({ salt, authHash, iterations: SecurityService.ITERATIONS });
    });
  }

  // Step 2: Verify Access with Key File
  static async verifyAccess(password: string, keyFileData: string | any): Promise<{ success: boolean; error?: string; salt?: string; authHash?: string }> {
    try {
      const keyFile = typeof keyFileData === 'string' ? JSON.parse(keyFileData) : keyFileData;
      if (!keyFile || keyFile.type !== 'MASTER_KEY_FILE') {
        return { success: false, error: 'ERR_INVALID_FILE_TYPE' };
      }
      
      const salt = keyFile.salt;
      const iterations = Number(keyFile.iterations) || SecurityService.ITERATIONS;
      const key = await SecurityService.deriveKey(password, salt, iterations);
      const authHash = CryptoJS.SHA256(key).toString(CryptoJS.enc.Hex);
      
      if (authHash === keyFile.authHash) {
        return { success: true, salt, authHash };
      } else {
        return { success: false, error: 'ERR_INVALID_PASSWORD' };
      }
    } catch (e) {
      return { success: false, error: 'ERR_FILE_CORRUPTED' };
    }
  }

  // Step 3: Re-key System (Change Master Password)
  static async reKeySystem(oldPassword: string, newPassword: string, currentVaultEncrypted: any): Promise<{ success: boolean; newVault?: any; newKeyFile?: any; error?: string }> {
    try {
      // 1. Decrypt vault with old password
      const decryptedVault = await this.decryptVault(currentVaultEncrypted, oldPassword);
      if (decryptedVault === null) return { success: false, error: 'ERR_INVALID_PASSWORD' };

      // 2. Create new salt and key from new password
      const { salt, authHash, iterations } = await this.initMasterAuth(newPassword);

      // 3. Encrypt vault with new password
      const newVault = await this.encryptVault(decryptedVault, newPassword);

      // 4. Create new Key File
      const newKeyFile = {
        type: 'MASTER_KEY_FILE',
        version: this.VERSION,
        salt,
        iterations,
        authHash,
        createdAt: Date.now()
      };

      return { success: true, newVault, newKeyFile };
    } catch (e) {
      return { success: false, error: 'ERR_REKEY_FAILED' };
    }
  }

  // Step 4: Backup & Import
  static async exportVault(vaultData: any, password: string): Promise<string> {
    const encrypted = await this.encryptVault(JSON.stringify(vaultData), password);
    const dataToHash = JSON.stringify(encrypted);
    const checksum = CryptoJS.SHA256(dataToHash).toString();
    
    const backup = {
      type: 'SECUREPASS_BACKUP',
      version: this.VERSION,
      header: {
        salt: encrypted.salt,
        iterations: encrypted.iterations,
        checksum
      },
      data: encrypted
    };
    return JSON.stringify(backup);
  }

  static async importVault(backupFileContent: string, password: string): Promise<{ success: boolean; data?: any; error?: string; salt?: string; authHash?: string; iterations?: number }> {
    try {
      const backup = JSON.parse(backupFileContent);
      if (backup.type !== 'SECUREPASS_BACKUP') return { success: false, error: 'ERR_INVALID_FILE_TYPE' };

      // Check integrity
      const dataToHash = JSON.stringify(backup.data);
      const checksum = CryptoJS.SHA256(dataToHash).toString();
      if (checksum !== backup.header.checksum) return { success: false, error: 'ERR_FILE_CORRUPTED' };

      // Try decrypt with provided password
      const decrypted = await this.decryptVault(backup.data, password);
      if (decrypted) {
        // Calculate authHash for the new key file
        const salt = backup.header.salt;
        const iterations = backup.header.iterations || SecurityService.ITERATIONS;
        const key = await SecurityService.deriveKey(password, salt, iterations);
        const authHash = CryptoJS.SHA256(key).toString(CryptoJS.enc.Hex);

        return { 
          success: true, 
          data: JSON.parse(decrypted),
          salt,
          authHash,
          iterations
        };
      } else {
        return { success: false, error: 'ERR_INVALID_PASSWORD' };
      }
    } catch (e) {
      return { success: false, error: 'ERR_FILE_CORRUPTED' };
    }
  }

  // Core Encryption Logic (AES-CBC + HMAC)
  static async encryptVault(data: string, password: string): Promise<{ ciphertext: string; iv: string; salt: string; hmac: string; iterations: number }> {
    const salt = SecurityService.generateSalt();
    const key = await SecurityService.deriveKey(password, salt, SecurityService.ITERATIONS);
    
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
        return null;
      }

      const { ciphertext, iv, salt, hmac } = encryptedData;
      const iterations = Number(encryptedData.iterations) || SecurityService.ITERATIONS;
      const key = await SecurityService.deriveKey(password, salt, iterations);

      const ciphertextWA = CryptoJS.enc.Base64.parse(ciphertext);

      // Verify HMAC
      if (hmac) {
        const expectedHmac = CryptoJS.HmacSHA256(ciphertextWA, key).toString(CryptoJS.enc.Base64);
        if (hmac !== expectedHmac) {
          return null;
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

      const result = decrypted.toString(CryptoJS.enc.Utf8);
      if (!result && ciphertextWA.sigBytes > 0) {
        return null;
      }
      return result;
    } catch (e) {
      return null;
    }
  }

  // --- Biometric Support ---
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

      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);
      const userID = new Uint8Array(16);
      window.crypto.getRandomValues(userID);

      const createOptions: PublicKeyCredentialCreationOptions = {
        challenge,
        rp: { name: "SecurePass", id: window.location.hostname },
        user: { id: userID, name: "user@securepass", displayName: "SecurePass User" },
        pubKeyCredParams: [{ alg: -7, type: "public-key" }, { alg: -257, type: "public-key" }],
        authenticatorSelection: { authenticatorAttachment: "platform", userVerification: "required", residentKey: "required" },
        timeout: 60000,
        attestation: "none"
      };

      const credential = await navigator.credentials.create({ publicKey: createOptions });
      if (!credential) return { success: false, error: 'CREDENTIAL_FAILED' };
      
      const encrypted = await this.encryptVault(masterPassword, "BIO_INTERNAL_KEY");
      localStorage.setItem('securepass_biometric_vault', JSON.stringify(encrypted));
      return { success: true };
    } catch (e) {
      return { success: false, error: 'SETUP_FAILED' };
    }
  }

  static async authenticateBiometric(): Promise<string | null> {
    try {
      const bioVault = localStorage.getItem('securepass_biometric_vault');
      if (!bioVault) return null;

      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      const getOptions: PublicKeyCredentialRequestOptions = {
        challenge,
        rpId: window.location.hostname,
        userVerification: "required",
        timeout: 60000
      };

      const assertion = await navigator.credentials.get({ publicKey: getOptions });
      if (!assertion) return null;

      const decrypted = await this.decryptVault(JSON.parse(bioVault), "BIO_INTERNAL_KEY");
      return decrypted;
    } catch (e) {
      return null;
    }
  }

  static async disableBiometric(): Promise<void> {
    localStorage.removeItem('securepass_biometric_vault');
  }
}

