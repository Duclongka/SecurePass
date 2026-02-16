
export class SecurityService {
  private static ITERATIONS = 100000;
  private static KEY_LEN = 256;
  private static BIO_STORAGE_KEY = "SECUREPASS_BIO_VAULT_INTERNAL_V2";

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
    if (!encryptedData || !encryptedData.salt || !encryptedData.iv || !encryptedData.ciphertext) {
      throw new Error('Malformed encryption data');
    }
    
    let salt: Uint8Array;
    let iv: Uint8Array;
    let ciphertext: Uint8Array;

    try {
      salt = this.base64ToBuf(encryptedData.salt);
      iv = this.base64ToBuf(encryptedData.iv);
      ciphertext = this.base64ToBuf(encryptedData.ciphertext);
    } catch (e) {
      console.error("Base64 Decode Error:", e);
      throw new Error('Malformed data format');
    }

    const key = await this.deriveKey(password, salt);

    try {
      const decrypted = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        ciphertext
      );
      return new TextDecoder().decode(decrypted);
    } catch (e: any) {
      // Explicitly log the error name and message to catch OperationError or DataError
      const errorMsg = e instanceof Error ? e.message : (e.name || 'Unknown Crypto Error');
      console.error("SubtleCrypto Decryption Error:", errorMsg, e);
      
      // In AES-GCM, any change to ciphertext, IV, or Key results in a failure.
      // We throw a user-friendly error.
      throw new Error('Invalid Master Password');
    }
  }

  // --- Biometric (WebAuthn / BiometricPrompt / FaceID) Support ---

  static async isBiometricAvailable(): Promise<boolean> {
    return !!(
      window.PublicKeyCredential &&
      window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable &&
      await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
    );
  }

  /**
   * Enrolls the device biometrics.
   * On iOS/Android, this will trigger the system FaceID or BiometricPrompt.
   */
  static async enableBiometric(masterPassword: string): Promise<void> {
    if (!await this.isBiometricAvailable()) throw new Error("Biometrics not supported");

    const challenge = window.crypto.getRandomValues(new Uint8Array(32));
    const userId = window.crypto.getRandomValues(new Uint8Array(16));

    const credential = await navigator.credentials.create({
      publicKey: {
        challenge,
        rp: { name: "SecurePass" },
        user: {
          id: userId,
          name: "user@securepass.local",
          displayName: "SecurePass User"
        },
        pubKeyCredParams: [{ alg: -7, type: "public-key" }], // ES256
        authenticatorSelection: { 
          authenticatorAttachment: "platform",
          userVerification: "required" 
        },
        timeout: 60000
      }
    }) as PublicKeyCredential;

    if (!credential) throw new Error("Enrollment failed");

    const encrypted = await this.encrypt(masterPassword, this.BIO_STORAGE_KEY);
    
    localStorage.setItem('securepass_biometric_id', credential.id);
    localStorage.setItem('securepass_biometric_vault', JSON.stringify(encrypted));
  }

  static async authenticateBiometric(): Promise<string> {
    const credentialId = localStorage.getItem('securepass_biometric_id');
    const bioVault = localStorage.getItem('securepass_biometric_vault');
    
    if (!credentialId || !bioVault) throw new Error("Biometrics not setup");

    const challenge = window.crypto.getRandomValues(new Uint8Array(32));
    const rawId = Uint8Array.from(atob(credentialId.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));

    const assertion = await navigator.credentials.get({
      publicKey: {
        challenge,
        allowCredentials: [{
          id: rawId,
          type: 'public-key'
        }],
        userVerification: "required"
      }
    });

    if (!assertion) throw new Error("Authentication failed");

    return await this.decrypt(JSON.parse(bioVault), this.BIO_STORAGE_KEY);
  }

  /**
   * Stack-safe conversion from ArrayBuffer to Base64.
   * String.fromCharCode(...spread) fails for buffers > ~65KB.
   */
  private static bufToBase64(buf: ArrayBuffer | Uint8Array): string {
    const bytes = new Uint8Array(buf);
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  /**
   * Stack-safe conversion from Base64 to Uint8Array.
   */
  private static base64ToBuf(base64: string): Uint8Array {
    const binary = atob(base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }
}
