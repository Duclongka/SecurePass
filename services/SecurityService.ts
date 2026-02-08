
export class SecurityService {
  private static ITERATIONS = 100000;
  private static KEY_LEN = 256;

  static async generateSalt(): Promise<Uint8Array> {
    return window.crypto.getRandomValues(new Uint8Array(16));
  }

  private static async deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const baseKey = await window.crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveKey']
    );

    return window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: this.ITERATIONS,
        hash: 'SHA-256',
      },
      baseKey,
      { name: 'AES-GCM', length: this.KEY_LEN },
      false,
      ['encrypt', 'decrypt']
    );
  }

  static async encrypt(data: string, password: string): Promise<{ ciphertext: string; iv: string; salt: string }> {
    const salt = await this.generateSalt();
    const key = await this.deriveKey(password, salt);
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encoder = new TextEncoder();
    
    const encrypted = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encoder.encode(data)
    );

    return {
      ciphertext: this.bufToBase64(encrypted),
      iv: this.bufToBase64(iv),
      salt: this.bufToBase64(salt)
    };
  }

  static async decrypt(encryptedData: { ciphertext: string; iv: string; salt: string }, password: string): Promise<string> {
    const salt = this.base64ToBuf(encryptedData.salt);
    const iv = this.base64ToBuf(encryptedData.iv);
    const ciphertext = this.base64ToBuf(encryptedData.ciphertext);
    const key = await this.deriveKey(password, salt);

    try {
      const decrypted = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        ciphertext
      );
      return new TextDecoder().decode(decrypted);
    } catch (e) {
      throw new Error('Invalid Master Password');
    }
  }

  private static bufToBase64(buf: ArrayBuffer | Uint8Array): string {
    return btoa(String.fromCharCode(...new Uint8Array(buf)));
  }

  private static base64ToBuf(base64: string): Uint8Array {
    return Uint8Array.from(atob(base64), c => c.charCodeAt(0));
  }
}
