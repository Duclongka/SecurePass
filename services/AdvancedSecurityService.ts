
/**
 * AdvancedSecurityService
 * Xử lý mã hóa đa lớp, xác thực thiết bị và logic File khóa (.vpass)
 */
export class AdvancedSecurityService {
  private static ITERATIONS = 150000;
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
   * Tạo tệp khóa mới chứa Salt và dấu vân tay thiết bị
   */
  static async generateKeyFile(password: string): Promise<string> {
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const saltBase64 = this.bufToBase64(salt);
    const deviceId = this.getOrCreateDeviceId();
    
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

  static getOrCreateDeviceId(): string {
    let id = localStorage.getItem('securepass_device_id');
    if (!id) {
      id = 'DEV-' + Math.random().toString(36).substring(2, 15) + '-' + Date.now();
      localStorage.setItem('securepass_device_id', id);
    }
    return id;
  }

  /**
   * Lưu mật khẩu chủ vào thiết bị (mã hóa bằng Device ID + Salt của File khóa)
   */
  static async rememberMasterPassword(password: string, keyFile: any): Promise<void> {
    const deviceId = this.getOrCreateDeviceId();
    const salt = this.base64ToBuf(keyFile.salt);
    
    // Tạo khóa từ Device ID và Salt của File khóa
    const { encKey } = await this.deriveKeys(deviceId, salt);
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      encKey,
      new TextEncoder().encode(password)
    );

    const storageObj = {
      data: this.bufToBase64(encrypted),
      iv: this.bufToBase64(iv),
      keyFileFingerprint: keyFile.ownerFingerprint // Dùng để đối soát File khóa
    };

    localStorage.setItem('securepass_wrapped_master', JSON.stringify(storageObj));
  }

  /**
   * Khôi phục mật khẩu chủ từ bộ nhớ thiết bị
   */
  static async recoverMasterPassword(keyFile: any): Promise<string | null> {
    const wrapped = localStorage.getItem('securepass_wrapped_master');
    if (!wrapped) return null;

    try {
      const storageObj = JSON.parse(wrapped);
      // Kiểm tra xem File khóa hiện tại có khớp với File khóa lúc lưu hay không
      if (storageObj.keyFileFingerprint !== keyFile.ownerFingerprint) return null;

      const deviceId = this.getOrCreateDeviceId();
      const salt = this.base64ToBuf(keyFile.salt);
      const { encKey } = await this.deriveKeys(deviceId, salt);

      const decrypted = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: this.base64ToBuf(storageObj.iv) },
        encKey,
        this.base64ToBuf(storageObj.data)
      );

      return new TextDecoder().decode(decrypted);
    } catch (e) {
      console.error("Recovery failed", e);
      return null;
    }
  }

  static async verifyKeyFile(password: string, keyFile: any): Promise<boolean> {
    try {
      const salt = this.base64ToBuf(keyFile.salt);
      const { macKey } = await this.deriveKeys(password, salt);
      const deviceId = this.getOrCreateDeviceId();
      const fingerprint = await window.crypto.subtle.sign('HMAC', macKey, new TextEncoder().encode(deviceId));
      return this.bufToBase64(fingerprint) === keyFile.ownerFingerprint;
    } catch {
      return false;
    }
  }
}
