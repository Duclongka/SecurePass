
/**
 * AdvancedSecurityService
 * Handles multi-layered encryption, HMAC integrity, and Key-File logic.
 * Standard: AES-GCM (256-bit) + HMAC-SHA256 (256-bit)
 */
export class AdvancedSecurityService {
  private static ITERATIONS = 150000; // Increased for better security
  private static KEY_LEN = 256;

  private static bufToBase64(buf: ArrayBuffer | Uint8Array): string {
    const bytes = new Uint8Array(buf);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  private static base64ToBuf(base64: string): Uint8Array {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  private static async deriveKeys(password: string, salt: Uint8Array): Promise<{ encKey: CryptoKey; macKey: CryptoKey }> {
    const encoder = new TextEncoder();
    const baseKey = await window.crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveKey']
    );

    const encKey = await window.crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt, iterations: this.ITERATIONS, hash: 'SHA-256' },
      baseKey,
      { name: 'AES-GCM', length: this.KEY_LEN },
      false,
      ['encrypt', 'decrypt']
    );

    const macKey = await window.crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt, iterations: this.ITERATIONS, hash: 'SHA-256' },
      baseKey,
      { name: 'HMAC', hash: 'SHA-256', length: 256 },
      false,
      ['sign', 'verify']
    );

    return { encKey, macKey };
  }

  /**
   * Verifies if a password matches a Key File
   */
  static async verifyPasswordWithKeyFile(password: string, keyFile: any): Promise<boolean> {
    try {
      const salt = this.base64ToBuf(keyFile.salt);
      const { macKey } = await this.deriveKeys(password, salt);
      const fingerprint = await window.crypto.subtle.sign('HMAC', macKey, new TextEncoder().encode(keyFile.deviceToken));
      return this.bufToBase64(fingerprint) === keyFile.ownerFingerprint;
    } catch {
      return false;
    }
  }

  /**
   * Encrypts vault data tied to password and salt from keyfile
   */
  static async encryptVault(data: string, password: string, saltBase64: string): Promise<string> {
    const salt = this.base64ToBuf(saltBase64);
    const { encKey, macKey } = await this.deriveKeys(password, salt);
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encoder = new TextEncoder();
    
    const ciphertext = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      encKey,
      encoder.encode(data)
    );

    const signature = await window.crypto.subtle.sign(
      'HMAC',
      macKey,
      ciphertext
    );

    return JSON.stringify({
      v: '2.1',
      data: this.bufToBase64(ciphertext),
      iv: this.bufToBase64(iv),
      hmac: this.bufToBase64(signature),
      ts: Date.now()
    });
  }

  /**
   * Decrypts vault data with integrity verification
   */
  static async decryptVault(payloadStr: string, password: string, saltBase64: string): Promise<string> {
    const payload = JSON.parse(payloadStr);
    const salt = this.base64ToBuf(saltBase64);
    const { encKey, macKey } = await this.deriveKeys(password, salt);

    const ciphertext = this.base64ToBuf(payload.data);
    const signature = this.base64ToBuf(payload.hmac);
    const iv = this.base64ToBuf(payload.iv);

    const isValid = await window.crypto.subtle.verify('HMAC', macKey, signature, ciphertext);
    if (!isValid) throw new Error("INTEGRITY_FAILURE");

    const decrypted = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      encKey,
      ciphertext
    );

    return new TextDecoder().decode(decrypted);
  }

  static generateDeviceId(): string {
    let id = localStorage.getItem('securepass_device_id');
    if (!id) {
      id = 'DEV-' + Math.random().toString(36).substring(2, 15) + '-' + Date.now();
      localStorage.setItem('securepass_device_id', id);
    }
    return id;
  }

  /**
   * Generates a Key File content (.vpass)
   */
  static async generateKeyFile(password: string): Promise<string> {
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const saltBase64 = this.bufToBase64(salt);
    const deviceId = this.generateDeviceId();
    
    const { macKey } = await this.deriveKeys(password, salt);
    const fingerprint = await window.crypto.subtle.sign('HMAC', macKey, new TextEncoder().encode(deviceId));

    return JSON.stringify({
      type: 'MASTER_KEY_FILE',
      version: '2.1',
      salt: saltBase64,
      deviceToken: deviceId,
      ownerFingerprint: this.bufToBase64(fingerprint)
    });
  }

  /**
   * Encrypts the password for local storage fallback (same device fallback)
   */
  static async encryptPasswordForFallback(password: string, keyFile: any): Promise<string> {
    const salt = this.base64ToBuf(keyFile.salt);
    const { encKey } = await this.deriveKeys(keyFile.deviceToken, salt); // Use deviceToken as key to wrap pass
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encoder = new TextEncoder();
    const encrypted = await window.crypto.subtle.encrypt({ name: 'AES-GCM', iv }, encKey, encoder.encode(password));
    return JSON.stringify({ data: this.bufToBase64(encrypted), iv: this.bufToBase64(iv) });
  }

  /**
   * Decrypts the password using keyfile salt and device token (same device fallback)
   */
  static async decryptPasswordForFallback(encryptedPassJson: string, keyFile: any): Promise<string> {
    const payload = JSON.parse(encryptedPassJson);
    const salt = this.base64ToBuf(keyFile.salt);
    const { encKey } = await this.deriveKeys(keyFile.deviceToken, salt);
    const decrypted = await window.crypto.subtle.decrypt({ name: 'AES-GCM', iv: this.base64ToBuf(payload.iv) }, encKey, this.base64ToBuf(payload.data));
    return new TextDecoder().decode(decrypted);
  }
}
