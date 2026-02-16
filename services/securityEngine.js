import CryptoJS from 'crypto-js';

/**
 * 1. Hàm createMasterKeyFile(password):
 * - Tạo salt ngẫu nhiên và băm mật khẩu.
 */
export const createMasterKeyFile = (password) => {
  const salt = CryptoJS.lib.WordArray.random(128 / 8).toString();
  const hash = CryptoJS.PBKDF2(password, salt, {
    keySize: 256 / 32,
    iterations: 100000,
    hasher: CryptoJS.algo.SHA256
  }).toString();
  
  return {
    version: "1.0",
    salt: salt,
    hash: hash,
    iterations: 100000,
    createdAt: Date.now()
  };
};

/**
 * 2. Hàm encryptStorage(data, password, salt):
 * - Mã hóa database mật khẩu bằng AES-256 + HMAC.
 */
export const encryptStorage = (data, password, salt) => {
  const key = CryptoJS.PBKDF2(password, salt, {
    keySize: 256 / 32,
    iterations: 100000,
    hasher: CryptoJS.algo.SHA256
  });
  
  const ciphertext = CryptoJS.AES.encrypt(data, key, {
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  }).toString();
  
  const hmac = CryptoJS.HmacSHA256(ciphertext, key).toString();
  
  return {
    ciphertext: ciphertext,
    hmac: hmac,
    salt: salt,
    version: "1.0"
  };
};

/**
 * 3. Hàm decryptStorage(encryptedObj, password):
 * - Giải mã database và kiểm tra tính toàn vẹn (HMAC).
 */
export const decryptStorage = (encryptedObj, password) => {
  const { ciphertext, hmac, salt } = encryptedObj;
  const key = CryptoJS.PBKDF2(password, salt, {
    keySize: 256 / 32,
    iterations: 100000,
    hasher: CryptoJS.algo.SHA256
  });

  // Kiểm tra tính toàn vẹn
  const calculatedHmac = CryptoJS.HmacSHA256(ciphertext, key).toString();
  if (calculatedHmac !== hmac) {
    throw new Error("INTEGRITY_FAILURE");
  }

  const bytes = CryptoJS.AES.decrypt(ciphertext, key, {
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  
  return bytes.toString(CryptoJS.enc.Utf8);
};

/**
 * 4. Hàm verifyKeyFile(inputPassword, uploadedFileContent):
 * - Kiểm tra mật khẩu có khớp với hash trong file .vpass hay không.
 */
export const verifyKeyFile = (inputPassword, uploadedFileContent) => {
  if (!uploadedFileContent || !uploadedFileContent.salt || !uploadedFileContent.hash) {
    return false;
  }
  
  const { salt, hash, iterations } = uploadedFileContent;
  const derivedHash = CryptoJS.PBKDF2(inputPassword, salt, {
    keySize: 256 / 32,
    iterations: iterations || 100000,
    hasher: CryptoJS.algo.SHA256
  }).toString();
  
  return derivedHash === hash;
};
