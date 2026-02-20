
import React, { useState, useEffect, useMemo, useRef } from 'react';
import * as Icons from './components/Icons';
import { PasswordEntry, AppView, SettingsState, EntryType } from './types';
import { generatePassword, calculateStrength, getStrengthColor } from './utils/passwordUtils';
import { SecurityService } from './services/SecurityService';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';

const translations = {
  en: {
    appTitle: 'SecurePass',
    safeQuote: 'The safest place for everything',
    version: 'Version 2.2.0',
    createdBy: 'Created by Loong Lee',
    contactInfo: 'Zalo/Phone: 0964 855 899',
    unlockVault: 'Unlock',
    masterPassword: 'Master Password',
    biometricUnlock: 'Biometric Login',
    chooseDatabase: 'Select Data File',
    unlockSubtitle: 'Local encrypted vault',
    searchPlaceholder: 'Search...',
    vaultTab: 'Vault',
    generatorTab: 'Generator',
    settingsTab: 'Settings',
    typesHeader: 'Category',
    foldersHeader: 'Folders',
    frequentHeader: 'Commonly Used',
    typeLogin: 'Login (ID)',
    typeCard: 'Card',
    typeContact: 'Contacts',
    typeDocument: 'Personal Docs',
    noEntries: 'No items yet',
    copySuccess: 'Copied to clipboard',
    deleteConfirm: 'Press 3 times to delete',
    addLogin: 'Login (ID)',
    addCard: 'Card',
    addContact: 'Contact',
    addDocument: 'Personal Doc',
    save: 'Save',
    cancel: 'Cancel',
    title: 'Title',
    titleHint: 'e.g. Account name...',
    username: 'Username',
    usernameHint: 'Phone number or Email',
    password: 'Password',
    pinCode: 'PIN Code',
    authCode: 'Google Auth',
    authCodeHint: 'Enter Google Auth code',
    msAuthCode: 'Microsoft Auth',
    msAuthCodeHint: 'Enter Microsoft Auth code',
    googleAuthQr: 'Import Google Auth QR',
    msAuthQr: 'Import MS Auth QR',
    recoveryInfo: 'Recovery Info',
    recoveryInfoHint: 'Enter recovery email or phone',
    advancedOptions: 'Advanced Options',
    url: 'URL',
    urlHint: 'e.g. https://gmail.com',
    notes: 'Notes',
    cardName: 'Cardholder Name',
    cardNameHint: 'NGUYỄN VĂN A',
    cardNumber: 'Card Number',
    cardType: 'Card Type',
    chooseCardType: '-Select Card-',
    expiryLabel: 'Expiry Duration',
    expiryHint: 'MM/YY',
    nickname: 'Nickname',
    nicknameHint: 'Nickname...',
    fullName: 'Full Name',
    fullNameHint: 'Full Name...',
    phone: 'Phone Number',
    phoneHint: 'Phone...',
    email: 'Email',
    emailHint: 'Email...',
    address: 'Address',
    addressHint: 'Address...',
    content: 'Content',
    genHistory: 'History',
    genLength: 'Length',
    genAZ: 'Uppercase (A-Z)',
    genaz: 'Lowercase (a-z)',
    gen09: 'Numbers (0-9)',
    genSpec: 'Special (!@#$%^&*():"<>?)',
    copyPassword: 'Copy Password',
    groupLabel: 'Group',
    subGroupLabel: 'Sub-group',
    editEntry: 'Edit Entry',
    newEntry: 'New Entry',
    languageLabel: 'Language',
    dataManagement: 'Data Management',
    importDb: 'Import Data',
    exportDb: 'Backup Data (.vpass)',
    resetVault: 'Reset Vault',
    settingsGroup: 'Create Group',
    settingsFolder: 'Create Folder',
    settingsSubFolder: 'Create Sub-folder',
    qrCode: 'QR Code',
    scanMe: 'Scan to copy',
    createMasterPass: 'Manage Master Password',
    newMasterPass: 'New Master Password',
    confirmMasterPass: 'Confirm Master Password',
    passwordRuleError: 'Use 8-30 chars with letters, numbers, and symbols.',
    passwordMismatch: 'Passwords do not match.',
    saveKeyFile: 'Save Key File (.vpass)',
    securitySettings: 'Security Settings',
    autoLock: 'Auto-lock app (1 min inactivity)',
    clearClipboard: 'Clear clipboard (30 sec)',
    noMasterPassYet: 'No master password?',
    createOne: 'Create Now',
    chooseKeyFile: 'Select File (.vpass)',
    keyFileDetected: 'Device Recognized!',
    firstTimeUnlock: 'Enter Password + Key File',
    expiryInterval: 'Expiry Duration',
    expiredWarning: 'Expired!',
    themeLabel: 'Appearance',
    themeDark: 'Dark Mode',
    themeLight: 'Light Mode',
    langEn: 'English',
    langVi: 'Vietnamese',
    createQRCode: 'Create QR Code',
    atmPin: 'ATM PIN (Withdrawal)',
    cvv: 'CVV/CVC',
    qrImage: 'Account QR',
    frontImage: 'Front Image',
    backImage: 'Back Image',
    postCode: 'Post Code',
    postCodeHint: 'Post Code...',
    frontImageBtn: 'Front Side',
    backImageBtn: 'Back Side',
    genModePassword: 'Password',
    genModeWifi: 'QR WiFi',
    genModeShare: 'QR Share',
    wifiSsid: 'WiFi SSID',
    wifiSecurity: 'Security',
    wifiPassword: 'Password',
    downloadQr: 'Download',
    saveToVault: 'Save',
    shareQr: 'Share',
    wifiHint: 'Scan to join',
    chooseSubGroup: '-- Choose Sub-group --',
    chooseDocType: '-- Document Type --',
    chooseBank: '-- Bank --',
    chooseGender: '-- Gender --',
    chooseClass: '-- Class --',
    detailedInfo: 'Thông tin chi tiết',
    shareQrPlaceholder: 'Enter content...',
    vaultCorrupted: 'Data corrupted.',
    linkedBank: 'Linked Bank',
    rechargeQr: 'Recharge QR',
    importFileErrorMsg: 'Invalid file.',
    wrongPassword: 'Invalid master password.',
    biometricError: 'Biometric error.',
    success: 'Success!',
    saveKeyWarning: 'Please keep your key file safe!',
    passwordStrength: 'Password Strength',
    saveKeyFileBtn: 'Save Key File',
    keyFileInstruction: 'Please save this key file in a safe place. You will need it to unlock your vault on new devices.',
    detailLogin: 'Login Details',
    detailCard: 'Card Details',
    detailContact: 'Contact Details',
    detailDoc: 'Document Details',
    residence: 'Residence',
    birthRegPlace: 'Birth Registration Place',
    hospital: 'Hospital',
    issuer: 'Issuer',
    issueDate: 'Issue Date',
    expiryDate: 'Expiry Date',
    nationality: 'Nationality',
    passportType: 'Passport Type',
    passportCode: 'Passport Code',
    insuranceId: 'Insurance ID',
    licenseId: 'License ID',
    passportId: 'Passport ID',
    classLabel: 'Class'
  },
  vi: {
    appTitle: 'SecurePass',
    safeQuote: 'Nơi lưu giữ tất cả mọi thứ an toàn nhất',
    version: 'Phiên bản 2.2.0',
    createdBy: 'Tạo bởi Loong Lee',
    contactInfo: 'Liên hệ sđt/zalo: 0964 855 899',
    unlockVault: 'Mở khóa',
    masterPassword: 'Mật khẩu chính',
    biometricUnlock: 'Vân tay / FaceID',
    chooseDatabase: 'Chọn tệp dữ liệu',
    unlockSubtitle: 'Kho lưu trữ cục bộ',
    searchPlaceholder: 'Tìm kiếm...',
    vaultTab: 'Kho Lưu Trữ',
    generatorTab: 'Trình tạo',
    settingsTab: 'Cài đặt',
    typesHeader: 'Loại',
    foldersHeader: 'Thư mục',
    frequentHeader: 'Thường dùng',
    typeLogin: 'Đăng nhập (ID)',
    typeCard: 'Thẻ (Card)',
    typeContact: 'Danh bạ',
    typeDocument: 'Giấy tờ cá nhân',
    noEntries: 'Chưa có dữ liệu',
    copySuccess: 'Đã sao chép',
    deleteConfirm: 'Chạm 3 lần để xóa',
    addLogin: 'Đăng nhập (ID)',
    addCard: 'Thẻ (Card)',
    addContact: 'Danh bạ',
    addDocument: 'Giấy tờ cá nhân',
    save: 'Lưu',
    cancel: 'Hủy',
    title: 'Tiêu đề',
    titleHint: 'Tên tài khoản...',
    username: 'Tên đăng nhập',
    usernameHint: 'Số điện thoại hoặc Email',
    password: 'Mật khẩu',
    pinCode: 'Mã PIN',
    authCode: 'Mã Google Auth',
    authCodeHint: 'Nhập mã xác thực Google Auth',
    msAuthCode: 'Mã Microsoft Authenticator',
    msAuthCodeHint: 'Nhập mã xác thực Microsoft Auth',
    googleAuthQr: 'Nhập mã QR Google Authenticator',
    msAuthQr: 'Nhập mã QR Microsoft Authenticator',
    recoveryInfo: 'Thông tin khôi phục',
    recoveryInfoHint: 'Nhập Email hoặc số điện thoại khôi phục',
    advancedOptions: 'Tùy chọn thêm',
    url: 'Đường dẫn (URL)',
    urlHint: 'https://gmail.com...',
    notes: 'Ghi chú',
    cardName: 'Tên trên thẻ',
    cardNameHint: 'NGUYỄN VĂN A',
    cardNumber: 'Số thẻ',
    cardType: 'Loại thẻ',
    chooseCardType: '-Chọn thẻ-',
    expiryLabel: 'Thời hạn',
    expiryHint: 'MM/YY',
    nickname: 'Tên thường gọi',
    nicknameHint: 'Giang còi, Anh A ... ',
    fullName: 'Tên đầy đủ',
    fullNameHint: 'Nguyễn Văn A',
    phone: 'Số điện thoại',
    phoneHint: '0964 xxx xxx',
    email: 'Email',
    emailHint: 'abc@email.com',
    address: 'Địa chỉ',
    addressHint: 'xã (phường), tỉnh',
    content: 'Nội dung',
    genHistory: 'Lịch sử',
    genLength: 'Độ dài',
    genAZ: 'Chữ hoa (A-Z)',
    genaz: 'Chữ thường (a-z)',
    gen09: 'Số (0-9)',
    genSpec: 'Ký tự (!@#$%^&*():"<>?)',
    copyPassword: 'Sao chép mật khẩu',
    groupLabel: 'Nhóm',
    subGroupLabel: 'Nhóm con',
    editEntry: 'Sửa mục',
    newEntry: 'Thêm mục mới',
    languageLabel: 'Ngôn ngữ',
    dataManagement: 'Quản lý dữ liệu',
    importDb: 'Nhập dữ liệu',
    exportDb: 'Sao lưu (.vpass)',
    resetVault: 'Xóa toàn bộ kho',
    settingsGroup: 'Tạo nhóm',
    settingsFolder: 'Tạo thư mục',
    settingsSubFolder: 'Tạo thư mục con',
    qrCode: 'Mã QR',
    scanMe: 'Quét để sao chép',
    createMasterPass: 'Quản lý mã khóa chủ',
    newMasterPass: 'Mật khẩu chủ mới',
    confirmMasterPass: 'Xác nhận mật khẩu chủ',
    passwordRuleError: 'Dùng 8-30 ký tự (chữ, số, ký tự đặc biệt).',
    passwordMismatch: 'Mật khẩu không khớp.',
    saveKeyFile: 'Lưu mã khóa chủ (.vpass)',
    securitySettings: 'Thiết lập bảo mật',
    autoLock: 'Tự động khóa app (1 phút không hoạt động)',
    clearClipboard: 'Xóa bộ nhớ đệm (30 giây)',
    noMasterPassYet: 'Bạn chưa có mật khẩu chủ?',
    createOne: 'Tạo mật khẩu chủ',
    chooseKeyFile: 'Chọn File Khóa (.vpass)',
    keyFileDetected: 'Đã nhận diện thiết bị!',
    firstTimeUnlock: 'Nhập Mật khẩu + File Khóa',
    expiryInterval: 'Thời hạn',
    expiredWarning: 'Đã hết hạn!',
    themeLabel: 'Giao diện',
    themeDark: 'Chế độ tối',
    themeLight: 'Chế độ sáng',
    langEn: 'Tiếng Anh',
    langVi: 'Tiếng Việt',
    createQRCode: 'Tạo QR Code',
    atmPin: 'Mật khẩu ATM (Tại cây rút tiền)',
    cvv: 'Mã CVV/CVC',
    qrImage: 'Mã QR tài khoản',
    frontImage: 'Ảnh mặt trước',
    backImage: 'Ảnh mặt sau',
    postCode: 'Mã bưu điện',
    postCodeHint: '527 0046',
    frontImageBtn: 'Ảnh mặt trước',
    backImageBtn: 'Ảnh mặt sau',
    genModePassword: 'Mật khẩu',
    genModeWifi: 'QR WiFi',
    genModeShare: 'QR Chia sẻ',
    wifiSsid: 'Tên wifi (SSID)',
    wifiSecurity: 'Bảo mật',
    wifiPassword: 'Mật khẩu',
    downloadQr: 'Tải xuống',
    saveToVault: 'Lưu',
    passwordStrength: 'Độ mạnh mật khẩu',
    saveKeyFileBtn: 'Lưu file khóa',
    keyFileInstruction: 'Vui lòng lưu file khóa này ở nơi an toàn. Bạn sẽ cần nó để mở khóa trên các thiết bị mới.',
    shareQr: 'Chia sẻ',
    wifiHint: 'Quét để kết nối',
    chooseSubGroup: '-- Chọn nhóm con --',
    chooseDocType: '-- Loại giấy tờ --',
    chooseBank: '-- Ngân hàng --',
    chooseGender: '-- Giới tính --',
    chooseClass: '-- Hạng --',
    detailedInfo: 'Thông tin chi tiết',
    shareQrPlaceholder: 'Nhập nội dung...',
    vaultCorrupted: 'Dữ liệu bị lỗi.',
    linkedBank: 'Ngân hàng liên kết',
    rechargeQr: 'QR nạp tiền',
    importFileErrorMsg: 'File không đúng.',
    wrongPassword: 'Mật khẩu không chính xác!',
    biometricError: 'Lỗi sinh trắc học.',
    success: 'Thành công!',
    saveKeyWarning: 'Vui lòng lưu file khóa cẩn thận!',
    detailLogin: 'Chi tiết Đăng nhập',
    detailCard: 'Chi tiết Thẻ',
    detailContact: 'Chi tiết Danh bạ',
    detailDoc: 'Chi tiết Giấy tờ',
    residence: 'Nơi cư trú',
    birthRegPlace: 'Nơi đăng ký khai sinh',
    hospital: 'Bệnh viện',
    issuer: 'Cơ quan cấp',
    issueDate: 'Ngày cấp',
    expiryDate: 'Ngày hết hạn',
    nationality: 'Quốc tịch',
    passportType: 'Loại hộ chiếu',
    passportCode: 'Mã số',
    insuranceId: 'Số Bảo hiểm',
    licenseId: 'Số giấy phép',
    passportId: 'Số hộ chiếu',
    classLabel: 'Hạng'
  }
};

const DEFAULT_FOLDERS = [
  'Mạng xã hội',
  'Thư điện tử (Email)',
  'Ngân hàng',
  'Ví điện tử',
  'Điện thoại',
  'Ứng dụng (App)',
  'Camera',
  'Mạng Internet',
  'Trang web',
  'Mua sắm online',
  'Học tập',
  'Lưu trữ trực tuyến'
];

const DEFAULT_SUBFOLDERS: Record<string, string[]> = {
  'Ngân hàng': ['Vietcombank', 'Techcombank', 'Agribank', 'BIDV', 'ACB', 'Viettinbank', 'MBB'],
  'Ví điện tử': ['Momo', 'Zalopay', 'ShopeePay', 'VNPay', 'Viettel Money', 'VinID', 'PayPal'],
  'Mạng xã hội': ['Facebook', 'Tiktok', 'Zalo', 'Instagram', 'X', 'Telegram', 'WhatsApp'],
  'Thư điện tử (Email)': ['Gmail', 'Hotmail', 'Outlook'],
  'Điện thoại': ['iPhone (iCloud)', 'Samsung', 'Xiaomi', 'Oppo'],
  'Camera': ['Imou', 'Xiaomi', 'Ezviz', 'Hikvision'],
  'Mạng Internet': ['Viettel', 'VNPT', 'FPT']
};

const WALLET_LIST = ['Momo', 'Zalopay', 'ShopeePay', 'VNPay', 'Viettel Money', 'VinID', 'PayPal'];

const shareData = async (title: string, text: string, dataUrl?: string) => {
  try {
    const shareParams: any = { title, text };
    if (dataUrl && dataUrl.startsWith('data:')) {
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], 'securepass_share.png', { type: blob.type });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        shareParams.files = [file];
      }
    }
    if (navigator.share) {
      await navigator.share(shareParams);
    } else {
      await navigator.clipboard.writeText(dataUrl || text);
    }
  } catch (err) {
    if ((err as Error).name !== 'AbortError') {
      console.error('Error sharing:', err);
    }
  }
};

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('login');
  const [settingsSubView, setSettingsSubView] = useState<'main' | 'data' | 'folders' | 'security' | 'theme' | 'language'>('main');
  const [isLocked, setIsLocked] = useState(true);
  const [masterPassword, setMasterPassword] = useState('');
  const [uploadedKeyFile, setUploadedKeyFile] = useState<any>(null);
  const [isKeyFileRemembered, setIsKeyFileRemembered] = useState(false);
  const [pendingImportData, setPendingImportData] = useState<any>(null);
  const [isVerifyingImport, setIsVerifyingImport] = useState(false);
  
  const [entries, setEntries] = useState<PasswordEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<{ type: string; val: string } | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<PasswordEntry | null>(null);
  const [isAdding, setIsAdding] = useState<EntryType | null>(null);
  const [isEditing, setIsEditing] = useState<PasswordEntry | null>(null);
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [deleteClickCount, setDeleteClickCount] = useState<{ id: string; count: number }>({ id: '', count: 0 });
  const [isMasterModalOpen, setIsMasterModalOpen] = useState(false);

  const [genPass, setGenPass] = useState('');
  const [genConfig, setGenConfig] = useState({
    length: 16,
    useAZ: true,
    useaz: true,
    use09: true,
    useSpec: true
  });
  const [genHistory, setGenHistory] = useState<string[]>([]);
  const [showGenHistory, setShowGenHistory] = useState(false);
  const [showAllFolders, setShowAllFolders] = useState(false);
  const [showAllSubFolders, setShowAllSubFolders] = useState(false);

  const touchStartX = useRef<number | null>(null);

  const [settings, setSettings] = useState<SettingsState>(() => {
    try {
      const saved = localStorage.getItem('securepass_settings');
      const defaults: SettingsState = {
        autoLockMinutes: 1,
        clearClipboardSeconds: 30,
        autoLockEnabled: true,
        clearClipboardEnabled: true,
        biometricEnabled: false,
        language: 'vi',
        theme: 'dark',
        groups: ['Banking', 'Shopping', 'Study'],
        folders: DEFAULT_FOLDERS,
        subFolders: DEFAULT_SUBFOLDERS,
        hasMasterPassword: !!localStorage.getItem('securepass_master_hash')
      };
      return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
    } catch {
      return { folders: DEFAULT_FOLDERS, subFolders: DEFAULT_SUBFOLDERS, language: 'vi', theme: 'dark' } as any;
    }
  });

  const isDark = settings.theme === 'dark';
  const t = translations[settings.language] || translations.vi;

  useEffect(() => {
    if (isLocked && settings.biometricEnabled && localStorage.getItem('securepass_biometric_id')) {
      setTimeout(() => handleBiometricLogin(), 800);
    }
  }, []);

  useEffect(() => {
    if (isLocked || !settings.autoLockEnabled) return;
    const resetTimer = () => {
      const timer = window.setTimeout(() => handleLock(), settings.autoLockMinutes * 60000);
      return () => clearTimeout(timer);
    };
    resetTimer();
  }, [isLocked, settings.autoLockEnabled, settings.autoLockMinutes]);

  useEffect(() => {
    localStorage.setItem('securepass_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleLock = () => {
    setIsLocked(true);
    setEntries([]);
    setMasterPassword('');
    setView('login');
    setUploadedKeyFile(null);
    setIsKeyFileRemembered(false);
    setSettingsSubView('main');
  };

  const handleSwipeBack = () => {
    if (isLocked) return;
    
    if (view === 'settings') {
      if (settingsSubView !== 'main') {
        setSettingsSubView('main');
      } else {
        setView('vault');
      }
    } else if (view === 'generator') {
      setView('vault');
    } else if (view === 'vault') {
      if (activeCategory) {
        setActiveCategory(null);
      } else if (searchQuery) {
        setSearchQuery('');
      }
    }
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartX.current;
    if (diff > 100) { // Swipe right threshold
      handleSwipeBack();
    }
    touchStartX.current = null;
  };

  const [isUnlocking, setIsUnlocking] = useState(false);

  const handleLogin = async (e?: React.FormEvent, providedPass?: string) => {
    e?.preventDefault();
    if (isUnlocking) return;
    
    let passToUse = providedPass || masterPassword;
    
    // If no password provided, try to use remembered password if key file is present
    if (!passToUse) {
      const remembered = localStorage.getItem('securepass_remembered_mp');
      const hasKeyFile = !!localStorage.getItem('securepass_master_hash') || !!uploadedKeyFile;
      if (remembered && hasKeyFile) {
        passToUse = remembered;
      }
    }

    if (!passToUse) {
        setToast(t.wrongPassword);
        return;
    }

    setIsUnlocking(true);

    try {
      if (isVerifyingImport && pendingImportData) {
        const result = await SecurityService.importVault(JSON.stringify(pendingImportData), passToUse);
        if (result.success) {
          setEntries(result.data);
          setIsLocked(false);
          setView('vault');
          setMasterPassword(passToUse);
          setPendingImportData(null);
          setIsVerifyingImport(false);
          setToast(t.success);
          
          if (pendingImportData.header) {
             const kf = {
               type: 'MASTER_KEY_FILE',
               version: '3.0.0',
               salt: pendingImportData.header.salt,
               iterations: pendingImportData.header.iterations,
               authHash: pendingImportData.header.authHash || '',
               createdAt: Date.now()
             };
             localStorage.setItem('securepass_master_hash', JSON.stringify(kf));
             // Also remember this password for the device
             localStorage.setItem('securepass_remembered_mp', passToUse);
          }
          return;
        } else {
          throw new Error("Import failed");
        }
      }

      const masterHashStr = localStorage.getItem('securepass_master_hash');
      let keyFileToUse = masterHashStr;
      if (uploadedKeyFile) {
        keyFileToUse = JSON.stringify(uploadedKeyFile);
      }

      if (!keyFileToUse) {
        setToast(t.chooseKeyFile);
        return;
      }

      const result = await SecurityService.verifyAccess(passToUse, keyFileToUse);
      if (!result.success) {
        setToast(t.wrongPassword);
        return;
      }

      if (uploadedKeyFile) {
        localStorage.setItem('securepass_master_hash', keyFileToUse);
      }
      
      // Ensure password is remembered for this device
      localStorage.setItem('securepass_remembered_mp', passToUse);

      const encryptedVault = localStorage.getItem('securepass_vault');
      let decryptedEntries: PasswordEntry[] = [];
      if (encryptedVault) {
        const decrypted = await SecurityService.decryptVault(JSON.parse(encryptedVault), passToUse);
        if (decrypted) decryptedEntries = JSON.parse(decrypted);
        else throw new Error("Decryption failed");
      }

      setEntries(decryptedEntries);
      setIsLocked(false);
      setView('vault');
      setMasterPassword(passToUse);
      setSettings(prev => ({ ...prev, hasMasterPassword: true }));
    } catch (err) {
      console.error("Login error", err);
      setToast(t.wrongPassword);
    } finally {
      setIsUnlocking(false);
    }
  };

  const handleBiometricLogin = async () => {
    try {
      const decryptedPass = await SecurityService.authenticateBiometric();
      if (decryptedPass) handleLogin(undefined, decryptedPass);
    } catch (err: any) {
      setToast(t.biometricError);
    }
  };

  const handleKeyFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = JSON.parse(event.target?.result as string);
        if (content.type !== 'MASTER_KEY_FILE') throw new Error();
        setUploadedKeyFile(content);
        setToast(t.keyFileDetected);
      } catch {
        setToast('File không hợp lệ');
        setUploadedKeyFile(null);
      }
    };
    reader.readAsText(file);
  };

  const handleExport = async () => {
    if (!masterPassword) return;
    const backup = await SecurityService.exportVault(entries, masterPassword);
    const blob = new Blob([backup], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `securepass_backup_${new Date().toISOString().split('T')[0]}.vpass`;
    link.click();
    URL.revokeObjectURL(url);
    setToast(t.exportDb + " OK");
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = JSON.parse(event.target?.result as string);
        if (content.type === 'SECUREPASS_BACKUP') {
          setPendingImportData(content);
          setIsVerifyingImport(true);
          setToast("Vui lòng nhập mật khẩu của dữ liệu mới.");
          handleLock();
        } else { setToast(t.importFileErrorMsg); }
      } catch (err) { setToast(t.importFileErrorMsg); }
    };
    reader.readAsText(file);
  };

  const saveVault = async (updated: PasswordEntry[]) => {
    if (!masterPassword) return;
    try {
      const encrypted = await SecurityService.encryptVault(JSON.stringify(updated), masterPassword);
      localStorage.setItem('securepass_vault', JSON.stringify(encrypted));
    } catch { setToast("Lỗi lưu trữ."); }
  };

  const copy = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setToast(t.copySuccess);
  };

  const deleteEntry = (id: string) => {
    if (deleteClickCount.id === id && deleteClickCount.count >= 2) {
      const updated = entries.filter(e => e.id !== id);
      setEntries(updated);
      saveVault(updated);
      setDeleteClickCount({ id: '', count: 0 });
      setSelectedEntry(null);
    } else {
      setDeleteClickCount({ id, count: (deleteClickCount.id === id ? deleteClickCount.count + 1 : 1) });
      setToast(t.deleteConfirm);
    }
  };

  const handleGenerator = () => {
    const p = generatePassword(genConfig.length, genConfig);
    setGenPass(p);
    setGenHistory(prev => [p, ...prev].slice(0, 15));
  };

  return (
    <div 
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      className={`h-[100dvh] w-full flex flex-col overflow-hidden transition-colors duration-500 ${isDark ? 'bg-[#0d0d0d] text-[#E0E0E0]' : 'bg-[#f5f5f5] text-[#1a1a1a]'}`}
    >
      {isLocked ? (
        <LoginScreen t={t} isDark={isDark} masterPassword={masterPassword} setMasterPassword={setMasterPassword} handleLogin={handleLogin} handleBiometricLogin={handleBiometricLogin} handleKeyFileSelection={handleKeyFileSelection} setIsMasterModalOpen={setIsMasterModalOpen} uploadedKeyFile={uploadedKeyFile} isKeyFileRemembered={isKeyFileRemembered} isVerifyingImport={isVerifyingImport} isUnlocking={isUnlocking} />
      ) : (
        <div className="flex-1 flex flex-col relative overflow-hidden h-full">
          {view === 'vault' && <VaultScreen t={t} isDark={isDark} entries={entries} searchQuery={searchQuery} setSearchQuery={setSearchQuery} activeCategory={activeCategory} setActiveCategory={setActiveCategory} setSelectedEntry={setSelectedEntry} setIsEditing={setIsEditing} copy={copy} deleteEntry={deleteEntry} deleteClickCount={deleteClickCount} settings={settings} setView={setView} />}
          {view === 'generator' && <GeneratorScreen t={t} isDark={isDark} genPass={genPass} genConfig={genConfig} setGenConfig={setGenConfig} handleGenerator={handleGenerator} copy={copy} genHistory={genHistory} showGenHistory={showGenHistory} setShowGenHistory={setShowGenHistory} setToast={setToast} onSave={(d: any) => { const n = { ...d, id: Math.random().toString(36).substring(2, 9), createdAt: Date.now(), strength: calculateStrength(d.password || '') }; const up = [n, ...entries]; setEntries(up); saveVault(up); }} />}
          {view === 'settings' && <SettingsScreen t={t} isDark={isDark} settings={settings} setSettings={setSettings} handleLock={handleLock} setView={setView} setIsMasterModalOpen={setIsMasterModalOpen} masterPassword={masterPassword} handleImport={handleImport} handleExport={handleExport} setToast={setToast} subView={settingsSubView} setSubView={setSettingsSubView} showAllFolders={showAllFolders} setShowAllFolders={setShowAllFolders} showAllSubFolders={showAllSubFolders} setShowAllSubFolders={setShowAllSubFolders} />}
          
          {showPlusMenu && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[80] flex items-center justify-center p-6" onClick={() => setShowPlusMenu(false)}>
              <div className="space-y-4 flex flex-col items-center animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                <button onClick={() => { setIsAdding('login'); setShowPlusMenu(false); }} className="w-64 bg-[#4CAF50] text-white px-6 py-5 rounded-3xl font-bold shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all"><Icons.User size={20} /> {t.addLogin}</button>
                <button onClick={() => { setIsAdding('card'); setShowPlusMenu(false); }} className="w-64 bg-[#4CAF50] text-white px-6 py-5 rounded-3xl font-bold shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all"><Icons.CreditCard size={20} /> {t.addCard}</button>
                <button onClick={() => { setIsAdding('document'); setShowPlusMenu(false); }} className="w-64 bg-[#4CAF50] text-white px-6 py-5 rounded-3xl font-bold shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all"><Icons.FileText size={20} /> {t.addDocument}</button>
                <button onClick={() => { setIsAdding('contact'); setShowPlusMenu(false); }} className="w-64 bg-[#4CAF50] text-white px-6 py-5 rounded-3xl font-bold shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all"><Icons.Smartphone size={20} /> {t.addContact}</button>
                <button onClick={() => setShowPlusMenu(false)} className={`mt-4 w-14 h-14 ${isDark ? 'bg-white/10' : 'bg-black/10'} rounded-full flex items-center justify-center ${isDark ? 'text-white' : 'text-black'} active:scale-90 transition-all shadow-lg`}><Icons.X size={28} /></button>
              </div>
            </div>
          )}

          <nav className={`h-16 border-t flex items-center justify-around px-4 sticky bottom-0 z-[70] pb-safe transition-colors duration-500 ${isDark ? 'bg-[#111] border-white/5' : 'bg-white border-black/5'}`}>
            <button onClick={() => setView('vault')} className={`flex flex-col items-center p-3 transition-colors ${view === 'vault' ? 'text-[#4CAF50]' : (isDark ? 'text-gray-700' : 'text-gray-400')}`}><Icons.Database size={24} /></button>
            <div className="relative"><button onClick={() => setShowPlusMenu(!showPlusMenu)} className={`w-16 h-16 bg-[#4CAF50] rounded-[2rem] flex items-center justify-center text-white shadow-xl -translate-y-6 active:scale-90 transition-all border-4 ${isDark ? 'border-[#0d0d0d]' : 'border-[#f5f5f5]'}`}><Icons.Plus size={32} className={`transition-transform duration-300 ${showPlusMenu ? 'rotate-45' : ''}`} /></button></div>
            <button onClick={() => { setView('generator'); if(!genPass) handleGenerator(); }} className={`flex flex-col items-center p-3 transition-colors ${view === 'generator' ? 'text-[#4CAF50]' : (isDark ? 'text-gray-700' : 'text-gray-400')}`}><Icons.RefreshCw size={24} /></button>
          </nav>

          {(isAdding || isEditing || selectedEntry) && (
            <EntryModal t={t} isDark={isDark} settings={settings} mode={isEditing ? 'edit' : isAdding ? 'add' : 'view'} entry={isEditing || selectedEntry || undefined} addType={isAdding || undefined} onClose={() => { setIsAdding(null); setIsEditing(null); setSelectedEntry(null); }} onSave={(d: any) => { if (isAdding) { const n = { ...d, id: Math.random().toString(36).substring(2, 9), createdAt: Date.now(), strength: calculateStrength(d.password || ''), isFrequent: true }; const up = [n, ...entries]; setEntries(up); saveVault(up); setIsAdding(null); } else { const up = entries.map(e => e.id === d.id ? { ...d, strength: calculateStrength(d.password || '') } : e); setEntries(up); saveVault(up); setIsEditing(null); } }} copy={copy} setIsEditing={setIsEditing} deleteEntry={deleteEntry} deleteClickCount={deleteClickCount} />
          )}
        </div>
      )}
      {isMasterModalOpen && <MasterPasswordModal t={t} isDark={isDark} onClose={() => setIsMasterModalOpen(false)} setMasterPassword={async (np: string, kf: any) => { 
        localStorage.setItem('securepass_master_hash', JSON.stringify(kf)); 
        // Always encrypt current entries (empty if locked) with new password
        const enc = await SecurityService.encryptVault(JSON.stringify(entries), np); 
        localStorage.setItem('securepass_vault', JSON.stringify(enc)); 
        setMasterPassword(np); 
        setSettings(p => ({ ...p, hasMasterPassword: true })); 
      }} masterPassword={masterPassword} />}
      {toast && <div className="fixed top-12 left-1/2 -translate-x-1/2 bg-[#4CAF50] text-white px-6 py-2 rounded-full text-xs font-bold shadow-2xl z-[200] animate-in fade-in slide-in-from-top-10">{toast}</div>}
    </div>
  );
};

const LoginScreen = ({ t, isDark, masterPassword, setMasterPassword, handleLogin, handleBiometricLogin, handleKeyFileSelection, setIsMasterModalOpen, uploadedKeyFile, isKeyFileRemembered, isVerifyingImport, isUnlocking }: any) => {
  const hasKeyFile = uploadedKeyFile || isKeyFileRemembered;
  
  return (
    <div className={`h-full w-full flex flex-col items-center justify-center p-6 transition-colors duration-500 ${isDark ? 'bg-[#0a0a0a]' : 'bg-[#f0f0f0]'}`}>
      <div className={`w-full max-w-sm rounded-[2.5rem] p-8 border shadow-2xl transition-colors duration-500 ${isDark ? 'bg-[#121212] border-white/5' : 'bg-white border-black/5'}`}>
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-[#4CAF50] rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-[#4CAF50]/10"><Icons.Lock className="text-white w-8 h-8" /></div>
          <h1 className={`text-2xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>{t.appTitle}</h1>
          <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mt-1">{t.unlockSubtitle}</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-4">
            {!hasKeyFile ? (
              <div className="relative">
                <input 
                  autoFocus 
                  type="password" 
                  placeholder={t.masterPassword} 
                  value={masterPassword} 
                  onChange={(e) => setMasterPassword(e.target.value)} 
                  className={`w-full border rounded-2xl py-4 px-6 outline-none transition-all ${isDark ? 'bg-[#1a1a1a] border-white/5 text-white focus:border-[#4CAF50]/50' : 'bg-gray-100 border-gray-200 text-gray-900 focus:border-[#4CAF50]/50'}`} 
                />
              </div>
            ) : (
              <div className={`p-4 rounded-2xl border flex items-center gap-3 ${isDark ? 'bg-[#4CAF50]/5 border-[#4CAF50]/20' : 'bg-[#4CAF50]/5 border-[#4CAF50]/10'}`}>
                <div className="w-10 h-10 bg-[#4CAF50] rounded-xl flex items-center justify-center shadow-lg shadow-[#4CAF50]/20">
                  <Icons.FileCheck className="text-white" size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-black uppercase text-[#4CAF50] truncate">Đã chọn File Khóa</p>
                </div>
              </div>
            )}
          </div>

          <button type="submit" disabled={isUnlocking} className="w-full bg-[#4CAF50] hover:bg-[#45a049] text-white font-bold py-4 rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
            {isUnlocking ? <Icons.Loader2 className="animate-spin" size={18} /> : <Icons.Unlock size={18} />} 
            {isUnlocking ? 'Đang xác thực...' : t.unlockVault}
          </button>
          
          {!isVerifyingImport && (
            <button type="button" disabled={isUnlocking} onClick={handleBiometricLogin} className={`w-full font-bold py-4 rounded-2xl flex items-center justify-center gap-2 border transition-all text-sm disabled:opacity-50 ${isDark ? 'bg-white/5 border-white/5 text-white' : 'bg-gray-100 border-gray-200 text-gray-700'}`}><Icons.Fingerprint size={22} className="text-[#4CAF50]" /> {t.biometricUnlock}</button>
          )}
          
          <div className="pt-4 space-y-4 text-center">
            <label className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-2xl py-6 px-4 cursor-pointer transition-all ${isDark ? 'bg-black/20 border-white/5 text-gray-500 hover:border-[#4CAF50]/30' : 'bg-gray-50 border-gray-200 text-gray-400 hover:border-[#4CAF50]/30'} ${uploadedKeyFile ? 'border-[#4CAF50]/40 bg-[#4CAF50]/5' : ''}`}>
              <Icons.Database size={24} className={uploadedKeyFile ? 'text-[#4CAF50]' : ''} />
              <span className={`text-xs font-bold uppercase ${uploadedKeyFile ? 'text-[#4CAF50]' : ''}`}>{uploadedKeyFile ? "Thay đổi File Khóa" : t.chooseKeyFile}</span>
              <input type="file" className="hidden" accept=".vpass" onChange={handleKeyFileSelection} />
            </label>
            
            <div className="mt-4">
              <p className="text-[10px] uppercase font-bold text-gray-500">{t.noMasterPassYet}</p>
              <button type="button" onClick={() => setIsMasterModalOpen(true)} className="text-[#4CAF50] text-xs font-black mt-1 uppercase tracking-wider">{t.createOne}</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const VaultScreen = ({ t, isDark, entries, searchQuery, setSearchQuery, activeCategory, setActiveCategory, setSelectedEntry, setIsEditing, copy, deleteEntry, deleteClickCount, settings, setView }: any) => {
  const [isFoldersOpen, setIsFoldersOpen] = useState(false);
  const filteredEntries = useMemo(() => {
    let list = entries;
    if (activeCategory) list = list.filter((e: any) => activeCategory.type === 'type' ? e.type === activeCategory.val : e.group === activeCategory.val);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter((e: any) => (e.username?.toLowerCase().includes(q)) || (e.nickname?.toLowerCase().includes(q)) || (e.cardHolder?.toLowerCase().includes(q)) || (e.fullName?.toLowerCase().includes(q)));
    }
    return list;
  }, [entries, activeCategory, searchQuery]);
  const frequentEntries = entries.filter((e: any) => e.isFrequent).slice(0, 6);
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <header className={`sticky top-0 z-40 h-16 border-b flex items-center px-4 justify-between transition-colors duration-500 ${isDark ? 'bg-[#111]/90 border-white/5' : 'bg-white/90 border-black/5'}`}>
        <div className="flex-1 relative">
          <Icons.Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input type="text" placeholder={t.searchPlaceholder} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={`w-full border rounded-full py-2.5 pl-12 pr-4 outline-none ${isDark ? 'bg-[#1a1a1a] border-white/5 text-white' : 'bg-gray-100 border-gray-200 text-gray-900'}`} />
        </div>
        <button onClick={() => setView('settings')} className="ml-3 p-2 text-gray-500"><Icons.Settings size={22} /></button>
      </header>
      <main className="flex-1 overflow-y-auto p-4 space-y-6 pb-24 no-scrollbar">
        {(activeCategory || searchQuery) ? (
          <div className="space-y-4">
            <button onClick={() => { setActiveCategory(null); setSearchQuery(''); }} className="flex items-center gap-2 text-[#4CAF50] text-sm font-bold mb-4"><Icons.ChevronLeft size={18} /> Back</button>
            {filteredEntries.map((e: any) => <EntryItem key={e.id} isDark={isDark} entry={e} t={t} setSelectedEntry={setSelectedEntry} setIsEditing={setIsEditing} copy={copy} deleteEntry={deleteEntry} deleteClickCount={deleteClickCount} />)}
          </div>
        ) : (
          <>
            <section>
              <h3 className="text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2 px-1 text-gray-500"><Icons.Star size={12}/> {t.frequentHeader}</h3>
              <div className="space-y-2">{frequentEntries.map((e: any) => <EntryItem key={e.id} isDark={isDark} entry={e} t={t} setSelectedEntry={setSelectedEntry} setIsEditing={setIsEditing} copy={copy} deleteEntry={deleteEntry} deleteClickCount={deleteClickCount} />)}</div>
            </section>
            <section>
              <h3 className="text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2 px-1 text-gray-500"><Icons.Shield size={12}/> {t.typesHeader}</h3>
              <div className="grid grid-cols-2 gap-3">
                {['login', 'card', 'document', 'contact'].map(id => (
                  <button key={id} onClick={() => setActiveCategory({ type: 'type', val: id })} className={`flex flex-col items-center justify-center p-5 rounded-3xl border transition-all active:scale-95 ${isDark ? 'bg-[#161616] border-white/5' : 'bg-white border-gray-200'}`}>
                    <div className="text-[#4CAF50] mb-3">{id === 'login' ? <Icons.User size={26}/> : id === 'card' ? <Icons.CreditCard size={26}/> : id === 'contact' ? <Icons.Smartphone size={26}/> : <Icons.FileText size={26}/>}</div>
                    <span className="text-[11px] font-black uppercase tracking-widest text-white">{t[`type${id.charAt(0).toUpperCase() + id.slice(1)}` as keyof typeof t] || id}</span>
                  </button>
                ))}
              </div>
            </section>
            <section className={`border rounded-3xl p-0.5 ${isDark ? 'bg-[#161616] border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
              <button onClick={() => setIsFoldersOpen(!isFoldersOpen)} className="w-full flex items-center justify-between py-4 px-6">
                <h3 className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-gray-500"><Icons.Folder size={12}/> {t.foldersHeader}</h3>
                <Icons.ChevronDown size={22} className={`transition-transform duration-300 ${isFoldersOpen ? '' : '-rotate-90'}`} />
              </button>
              {isFoldersOpen && (
                <div className="space-y-1 px-1.5 pb-3 animate-in slide-in-from-top-1">
                  {settings.folders.map((f: string) => (
                    <button key={f} onClick={() => setActiveCategory({ type: 'folder', val: f })} className={`w-full flex items-center justify-between py-3 px-4 rounded-xl transition-all ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                      <div className="flex items-center gap-2.5"><Icons.Folder size={14} className="text-[#4CAF50]" /><span className="text-[11px] font-bold">{f}</span></div>
                      <span className="text-[9px] font-bold px-2 rounded-md bg-white/5">{entries.filter((e: any) => e.group === f).length}</span>
                    </button>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
};

const EntryItem = ({ isDark, entry, t, setSelectedEntry, setIsEditing, copy, deleteEntry, deleteClickCount }: any) => {
  const getMainText = () => {
    if (entry.group === 'Mạng Internet' && entry.type === 'login') return "Mật khẩu Wifi";
    switch (entry.type) {
      case 'login': return entry.subGroup || entry.username || 'Item';
      case 'card': return entry.title || 'Item';
      case 'document': return entry.documentType ? (t[entry.documentType] || entry.documentType) : 'Item';
      case 'contact': return entry.nickname || entry.fullName || 'Item';
      default: return entry.title || 'Item';
    }
  };

  const getSubText = () => {
    if (entry.group === 'Mạng Internet' && entry.type === 'login') return entry.username || '...';
    switch (entry.type) {
      case 'login': return entry.username || '...';
      case 'card': return entry.cardHolder || '...';
      case 'document': return entry.fullName || '...';
      case 'contact': return entry.fullName || '...';
      default: return entry.username || entry.cardNumber || entry.phone || '...';
    }
  };

  return (
    <div onClick={() => setSelectedEntry(entry)} className={`border rounded-2xl p-4 flex items-center justify-between transition-all cursor-pointer ${isDark ? 'bg-[#181818] border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
      <div className="flex items-center gap-3 overflow-hidden">
        <div className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-[#4CAF50] ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}>
          {entry.type === 'login' ? <Icons.User size={22} /> : entry.type === 'card' ? <Icons.CreditCard size={22} /> : entry.type === 'contact' ? <Icons.Smartphone size={22} /> : <Icons.FileText size={22} />}
        </div>
        <div className="overflow-hidden">
          <h4 className="text-sm font-bold truncate leading-tight">{getMainText()}</h4>
          <p className="text-[10px] uppercase tracking-tighter mt-1 text-gray-500 truncate">{getSubText()}</p>
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button onClick={(e) => { e.stopPropagation(); setIsEditing(entry); }} className="p-2 text-gray-500 hover:text-[#4CAF50] transition-colors"><Icons.Pencil size={18} /></button>
        <button onClick={(e) => { e.stopPropagation(); deleteEntry(entry.id); }} className={`p-2 transition-all ${deleteClickCount.id === entry.id ? 'text-red-500' : 'text-gray-500'}`}><Icons.Trash2 size={18} /></button>
      </div>
    </div>
  );
};

const MasterPasswordModal = ({ t, isDark, onClose, setMasterPassword }: any) => {
  const [newMP, setNewMP] = useState('');
  const [confirmMP, setConfirmMP] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [showBioSetup, setShowBioSetup] = useState(false);
  const [keyFile, setKeyFile] = useState<any>(null);
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+~`|}{[\]:;?><,./-]).{8,30}$/;
  
  const strength = calculateStrength(newMP);
  const isValid = passwordRegex.test(newMP);

  const handleSave = async () => {
    const { salt, authHash } = await SecurityService.initMasterAuth(newMP);
    const kf = {
      type: 'MASTER_KEY_FILE',
      version: '3.0.0',
      salt,
      iterations: 100000,
      authHash,
      createdAt: Date.now()
    };
    setKeyFile(kf);
    // Store the password for "remembered" device access
    localStorage.setItem('securepass_remembered_mp', newMP);
    await setMasterPassword(newMP, kf);
    setIsSuccess(true);
  };

  const downloadKeyFile = () => {
    if (!keyFile) return;
    const blob = new Blob([JSON.stringify(keyFile, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `securepass_key_${new Date().toISOString().split('T')[0]}.vpass`;
    link.click();
    URL.revokeObjectURL(url);
    setShowBioSetup(true);
  };

  const handleEnableBio = async () => {
    try {
      await SecurityService.enableBiometric(newMP);
      onClose();
    } catch (err) {
      onClose();
    }
  };

  if (showBioSetup) return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[120] flex items-center justify-center p-6 animate-in fade-in">
      <div className={`w-full max-w-sm rounded-[2.5rem] border p-8 space-y-6 text-center ${isDark ? 'bg-[#121212] border-white/10' : 'bg-white border-black/5'}`}>
        <div className="w-20 h-20 bg-[#4CAF50]/10 rounded-full flex items-center justify-center mx-auto mb-2">
          <Icons.Fingerprint className="text-[#4CAF50]" size={40}/>
        </div>
        <h2 className="text-xl font-black">Thiết lập Sinh trắc học</h2>
        <p className="text-xs text-gray-500 leading-relaxed">Sử dụng vân tay hoặc khuôn mặt để mở khóa nhanh chóng mà không cần nhập mật khẩu.</p>
        <div className="space-y-3">
          <button onClick={handleEnableBio} className="w-full bg-[#4CAF50] text-white py-4 rounded-3xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-[#4CAF50]/20 flex items-center justify-center gap-2">
            <Icons.Shield size={16}/> Thiết lập ngay
          </button>
          <button onClick={onClose} className={`w-full py-4 rounded-3xl font-bold uppercase tracking-widest text-xs border transition-all ${isDark ? 'bg-white/5 border-white/5 text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
            Để sau
          </button>
        </div>
      </div>
    </div>
  );

  if (isSuccess) return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[120] flex items-center justify-center p-6 animate-in fade-in">
      <div className={`w-full max-sm rounded-[2.5rem] border p-8 space-y-6 text-center ${isDark ? 'bg-[#121212] border-white/10' : 'bg-white border-black/5'}`}>
        <Icons.CircleCheck className="text-[#4CAF50] mx-auto" size={48}/>
        <h2 className="text-xl font-black">{t.success}</h2>
        <p className="text-xs text-gray-500">{t.keyFileInstruction}</p>
        <button onClick={downloadKeyFile} className="w-full bg-[#4CAF50] text-white py-4 rounded-3xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-[#4CAF50]/20 flex items-center justify-center gap-2"><Icons.Download size={16}/> {t.saveKeyFileBtn}</button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[120] flex items-center justify-center p-4 animate-in fade-in">
      <div className={`w-full max-w-md rounded-[2.5rem] border p-8 space-y-6 shadow-2xl ${isDark ? 'bg-[#121212] border-white/10' : 'bg-white border-black/5'}`}>
        <div className="flex justify-between items-center"><h2 className="text-xl font-black">{t.createMasterPass}</h2><button onClick={onClose} className="text-gray-500 hover:text-[#4CAF50] transition-colors"><Icons.X size={24}/></button></div>
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-500 ml-1">{t.newMasterPass}</label>
            <input type="password" value={newMP} onChange={e => setNewMP(e.target.value)} className={`w-full border rounded-2xl py-4 px-6 outline-none transition-all ${isDark ? 'bg-[#1a1a1a] border-white/5 text-white focus:border-[#4CAF50]/50' : 'bg-gray-100 border-gray-200 text-gray-900 focus:border-[#4CAF50]/50'}`} />
            
            {/* Strength Meter */}
            <div className="mt-2 px-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[9px] font-bold uppercase text-gray-500">{t.passwordStrength}</span>
                <span className="text-[9px] font-bold" style={{ color: getStrengthColor(strength) }}>{strength}%</span>
              </div>
              <div className="h-1.5 w-full bg-gray-200 dark:bg-white/5 rounded-full overflow-hidden">
                <div className="h-full transition-all duration-500" style={{ width: `${strength}%`, backgroundColor: getStrengthColor(strength) }} />
              </div>
            </div>

            {/* Validation Warning */}
            {!isValid && newMP.length > 0 && (
              <p className="text-[10px] text-red-500 font-bold mt-2 ml-1 leading-tight">{t.passwordRuleError}</p>
            )}
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-500 ml-1">{t.confirmMasterPass}</label>
            <input type="password" value={confirmMP} onChange={e => setConfirmMP(e.target.value)} className={`w-full border rounded-2xl py-4 px-6 outline-none transition-all ${isDark ? 'bg-[#1a1a1a] border-white/5 text-white focus:border-[#4CAF50]/50' : 'bg-gray-100 border-gray-200 text-gray-900 focus:border-[#4CAF50]/50'}`} />
            {newMP !== confirmMP && confirmMP.length > 0 && (
              <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">{t.passwordMismatch}</p>
            )}
          </div>
          <button onClick={handleSave} disabled={!isValid || newMP !== confirmMP} className="w-full bg-[#4CAF50] text-white py-4 rounded-3xl font-bold uppercase tracking-widest text-xs disabled:opacity-30 active:scale-95 transition-all shadow-lg shadow-[#4CAF50]/20">{t.save}</button>
        </div>
      </div>
    </div>
  );
};

const SettingsScreen = ({ t, isDark, settings, setSettings, handleLock, setView, setIsMasterModalOpen, handleImport, handleExport, setToast, subView, setSubView, showAllFolders, setShowAllFolders, showAllSubFolders, setShowAllSubFolders }: any) => {
  const [newF, setNewF] = useState('');
  const [newSub, setNewSub] = useState('');
  const [selectedRoot, setSelectedRoot] = useState('');

  const renderMainList = () => (
    <div className="space-y-4 animate-in fade-in">
      <section className={`rounded-[2.5rem] p-8 border text-center ${isDark ? 'bg-[#161616] border-white/5' : 'bg-white border-gray-200 shadow-lg'}`}>
        <h4 className="text-xl font-black">{t.appTitle}</h4>
        <p className="text-[11px] text-gray-500 italic">"{t.safeQuote}"</p>
        <div className="h-px w-full my-4 bg-white/5" />
        <p className="text-[9px] font-bold text-gray-500 uppercase">{t.version}</p>
        <p className="text-[13px] font-bold text-[#4CAF50]">{t.contactInfo}</p>
      </section>
      <div className={`rounded-[2.5rem] overflow-hidden border ${isDark ? 'bg-[#161616] border-white/5' : 'bg-white border-gray-200 shadow-md'}`}>
        {[{ id: 'data', icon: <Icons.Database size={18}/>, label: t.dataManagement }, 
          { id: 'folders', icon: <Icons.Folder size={18}/>, label: 'Quản lý thư mục' },
          { id: 'security', icon: <Icons.Shield size={18}/>, label: t.securitySettings }, 
          { id: 'theme', icon: <Icons.Monitor size={18}/>, label: t.themeLabel }, 
          { id: 'language', icon: <Icons.Globe size={18}/>, label: t.languageLabel }].map((item) => (
          <button key={item.id} onClick={() => setSubView(item.id as any)} className="w-full flex items-center justify-between p-5 hover:bg-[#4CAF50]/5 transition-all">
            <div className="flex items-center gap-4"><div className="text-[#4CAF50]">{item.icon}</div><span className="text-sm font-bold">{item.label}</span></div><Icons.ChevronRight size={18} className="text-gray-600" />
          </button>
        ))}
      </div>
      <button onClick={handleLock} className={`w-full font-black text-[10px] uppercase tracking-[0.3em] py-5 rounded-3xl border active:scale-95 transition-all ${isDark ? 'bg-white/5 text-gray-500 border-white/5' : 'bg-gray-200 text-gray-600 border-gray-300 shadow-sm'}`}>LOG OUT / LOCK APP</button>
    </div>
  );

  const renderSubView = () => {
    switch(subView) {
      case 'data': return (
        <div className="space-y-6 animate-in slide-in-from-right">
          <section className={`rounded-[2.5rem] p-6 border shadow-xl ${isDark ? 'bg-[#161616] border-white/5' : 'bg-white border-gray-200'}`}>
            <button onClick={() => setIsMasterModalOpen(true)} className="w-full bg-[#4CAF50] text-white py-4 rounded-2xl font-bold mb-6 flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg"><Icons.Shield size={18}/> {t.createMasterPass}</button>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button onClick={handleExport} className={`flex flex-col items-center justify-center p-6 border rounded-[2.5rem] active:scale-95 transition-all ${isDark ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}><Icons.Upload className="text-[#4CAF50] mb-2" size={24} /><span className="text-[9px] font-black uppercase text-center">{t.exportDb}</span></button>
              <label className={`flex flex-col items-center justify-center p-6 border rounded-[2.5rem] cursor-pointer active:scale-95 transition-all ${isDark ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}><Icons.Download className="text-[#4CAF50] mb-2" size={24} /><span className="text-[9px] font-black uppercase text-center">{t.importDb}</span><input type="file" accept=".vpass" onChange={handleImport} className="hidden" /></label>
            </div>
            <button onClick={() => { if(confirm("Xác nhận xóa sạch toàn bộ dữ liệu?")) { localStorage.clear(); window.location.reload(); } }} className="w-full bg-red-500/10 text-red-500 font-black text-[10px] uppercase tracking-widest py-5 rounded-3xl border border-red-500/20 active:scale-95 transition-all">{t.resetVault}</button>
          </section>
        </div>
      );
      case 'folders': return (
        <div className="space-y-6 animate-in slide-in-from-right">
          <section className={`rounded-[2.5rem] p-6 border shadow-xl ${isDark ? 'bg-[#161616] border-white/5' : 'bg-white border-gray-200'}`}>
            <h3 className="text-[10px] font-black uppercase text-[#4CAF50] tracking-widest mb-4 flex items-center gap-2"><Icons.Folder size={14}/> THƯ MỤC</h3>
            <div className="flex gap-2 mb-4">
              <input value={newF} onChange={e => setNewF(e.target.value)} placeholder="Tạo thư mục" className={`flex-1 border rounded-2xl px-4 py-3 outline-none transition-all ${isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-gray-50 border-gray-200'}`} />
              <button onClick={() => { if(newF) { setSettings({...settings, folders: [...settings.folders, newF]}); setNewF(''); } }} className="bg-[#4CAF50] text-white p-4 rounded-2xl active:scale-90 transition-transform"><Icons.Plus size={20}/></button>
            </div>
            <div className="space-y-2">
              {(showAllFolders ? settings.folders : settings.folders.slice(0, 4)).map((f: string) => (
                <div key={f} className={`flex items-center justify-between p-4 border rounded-2xl transition-colors ${isDark ? 'bg-black/20 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                  <span className="text-xs font-bold truncate max-w-[200px]">{f}</span>
                  <button onClick={() => { if(confirm("Xóa thư mục này?")) setSettings({...settings, folders: settings.folders.filter(x => x !== f)}); }} className="text-gray-600 hover:text-red-500 transition-colors"><Icons.Trash2 size={16}/></button>
                </div>
              ))}
              {settings.folders.length > 4 && (
                <button onClick={() => setShowAllFolders(!showAllFolders)} className="w-full py-2 text-[10px] font-black uppercase text-[#4CAF50] tracking-widest text-center">
                  {showAllFolders ? 'Thu gọn' : 'Xem thêm'}
                </button>
              )}
            </div>
          </section>
          <section className={`rounded-[2.5rem] p-6 border shadow-xl ${isDark ? 'bg-[#161616] border-white/5' : 'bg-white border-gray-200'}`}>
            <h3 className="text-[10px] font-black uppercase text-[#4CAF50] tracking-widest mb-4 flex items-center gap-2"><Icons.Network size={14}/> TẠO THƯ MỤC CON</h3>
            <select value={selectedRoot} onChange={e => setSelectedRoot(e.target.value)} className={`w-full border rounded-2xl py-3 px-4 outline-none mb-4 transition-all ${isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-gray-50 border-gray-200'}`}><option value="">-- Thư mục --</option>{settings.folders.map(f => <option key={f} value={f}>{f}</option>)}</select>
            {selectedRoot && (
              <div className="animate-in fade-in space-y-4">
                <div className="flex gap-2">
                  <input value={newSub} onChange={e => setNewSub(e.target.value)} placeholder="Tên thư mục con" className={`flex-1 border rounded-2xl px-4 py-3 outline-none ${isDark ? 'bg-black/40 border-white/10' : 'bg-gray-50'}`} />
                  <button onClick={() => { if(newSub) { const currentSubs = settings.subFolders[selectedRoot] || []; setSettings({...settings, subFolders: {...settings.subFolders, [selectedRoot]: [...currentSubs, newSub]}}); setNewSub(''); } }} className="bg-[#4CAF50] text-white p-4 rounded-2xl"><Icons.Plus size={20}/></button>
                </div>
                <div className="space-y-2">
                  {(showAllSubFolders ? (settings.subFolders[selectedRoot] || []) : (settings.subFolders[selectedRoot] || []).slice(0, 4)).map((s: string) => (
                    <div key={s} className={`flex items-center justify-between p-3 border rounded-2xl ${isDark ? 'bg-black/20 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                      <span className="text-[11px] font-bold">{s}</span>
                      <button onClick={() => setSettings({...settings, subFolders: {...settings.subFolders, [selectedRoot]: settings.subFolders[selectedRoot].filter(x => x !== s)}})} className="text-gray-600 hover:text-red-500"><Icons.Trash2 size={16}/></button>
                    </div>
                  ))}
                  {(settings.subFolders[selectedRoot] || []).length > 4 && (
                    <button onClick={() => setShowAllSubFolders(!showAllSubFolders)} className="w-full py-2 text-[10px] font-black uppercase text-[#4CAF50] tracking-widest text-center">
                      {showAllSubFolders ? 'Thu gọn' : 'Xem thêm'}
                    </button>
                  )}
                </div>
              </div>
            )}
          </section>
        </div>
      );
      case 'security': return (
        <div className="space-y-6 animate-in slide-in-from-right">
          <section className={`rounded-[2.5rem] p-6 border shadow-xl ${isDark ? 'bg-[#161616] border-white/5' : 'bg-white border-gray-200'}`}>
            <h3 className="text-[10px] font-black uppercase text-[#4CAF50] tracking-widest mb-6 flex items-center gap-2"><Icons.Shield size={14}/> THIẾT LẬP BẢO MẬT</h3>
            <div className="space-y-5">
              {[
                { label: t.autoLock, key: 'autoLockEnabled' },
                { label: t.clearClipboard, key: 'clearClipboardEnabled' },
                { label: 'Vân tay / FaceID', key: 'biometricEnabled' }
              ].map(opt => (
                <div key={opt.key} className="flex items-center justify-between">
                  <span className="text-xs font-bold leading-relaxed">{opt.label}</span>
                  <button onClick={async () => {
                    if(opt.key === 'biometricEnabled' && !settings.biometricEnabled) {
                      try { await SecurityService.enableBiometric("vault_key"); setSettings({...settings, biometricEnabled: true}); } catch(err) { setToast(t.biometricError); }
                    } else { setSettings({...settings, [opt.key]: !(settings as any)[opt.key]}); }
                  }} className={`w-12 h-6 rounded-full relative transition-all ${ (settings as any)[opt.key] ? 'bg-[#4CAF50]' : 'bg-gray-300'}`}><div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${(settings as any)[opt.key] ? 'right-1' : 'left-1'}`} /></button>
                </div>
              ))}
            </div>
          </section>
        </div>
      );
      case 'language': return (
        <div className="space-y-4 animate-in slide-in-from-right">
          {['vi', 'en'].map(l => <button key={l} onClick={() => setSettings({...settings, language: l as any})} className={`w-full py-5 rounded-3xl text-[11px] font-black uppercase transition-all ${settings.language === l ? 'bg-[#4CAF50] text-white shadow-lg' : (isDark ? 'bg-white/5 text-gray-500' : 'bg-gray-200 text-gray-600')}`}>{l === 'vi' ? t.langVi : t.langEn}</button>)}
        </div>
      );
      case 'theme': return (
        <div className="space-y-4 animate-in slide-in-from-right">
          {['light', 'dark'].map(th => <button key={th} onClick={() => setSettings({...settings, theme: th as any})} className={`w-full py-5 rounded-3xl text-[11px] font-black uppercase transition-all ${settings.theme === th ? 'bg-[#4CAF50] text-white shadow-lg' : (isDark ? 'bg-white/5 text-gray-500' : 'bg-gray-200 text-gray-600')}`}>{th === 'light' ? t.themeLight : t.themeDark}</button>)}
        </div>
      );
      default: return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <header className={`h-16 border-b flex items-center px-4 justify-between sticky top-0 z-40 transition-colors ${isDark ? 'bg-[#111]/90 border-white/5' : 'bg-white/90 border-black/5 shadow-sm'}`}>
        <button onClick={() => subView === 'main' ? setView('vault') : setSubView('main')} className="p-2 text-gray-500 hover:text-[#4CAF50] transition-colors"><Icons.ChevronLeft size={24} /></button>
        <h2 className="text-lg font-bold">{subView === 'main' ? t.settingsTab : (subView === 'folders' ? 'Thư mục' : t[subView as keyof typeof t] || subView)}</h2><div className="w-10"/>
      </header>
      <main className="flex-1 overflow-y-auto p-4 pb-24 no-scrollbar">{subView === 'main' ? renderMainList() : renderSubView()}</main>
    </div>
  );
};

const EntryModal = ({ t, isDark, settings, mode, entry, onClose, onSave, copy, addType, setIsEditing, deleteEntry, deleteClickCount }: any) => {
  const [localData, setLocalData] = useState<any>(() => {
    if (entry) return { ...entry };
    return { type: addType || 'login', group: '---', subGroup: '', username: '', password: '', notes: '', atmPin: '', cardType: '', expiryMonth: '', cardNumber: '', cardHolder: '', frontImage: '', backImage: '', fullName: '', phone: '', email: '', postCode: '', address: '', documentType: '', idNumber: '', dob: '', gender: '', residence: '', birthRegPlace: '', hospital: '', issuer: '', issueDate: '', expiryDate: '', nationality: '', passportType: '', passportCode: '', class: '', msAuthCode: '', googleAuthQr: '', msAuthQr: '' };
  });
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const isView = mode === 'view';
  const typeLabels: Record<string, string> = { login: t.typeLogin, card: t.typeCard, contact: t.typeContact, document: t.typeDocument };
  
  const handleImage = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLocalData({ ...localData, [field]: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const copyableField = (label: string, field: string, value: string, type: string = "text", placeholder: string = "") => {
    if (isView && !value) return null;
    return (
      <div className="space-y-1 w-full min-w-0">
        <label className="text-[10px] font-black uppercase text-gray-500 ml-1 truncate block">{label}</label>
        <div className="relative">
          <input 
            disabled={isView} 
            type={type} 
            value={value} 
            onChange={e => setLocalData({...localData, [field]: e.target.value})} 
            className={`w-full border rounded-2xl py-3 px-4 font-medium outline-none transition-all text-base ${isDark ? 'bg-[#181818] border-white/5 text-white focus:border-[#4CAF50]/50' : 'bg-white border-gray-200 shadow-sm text-gray-900 focus:border-[#4CAF50]/50'}`} 
            placeholder={placeholder} 
          />
          {!isView && <button type="button" onClick={() => copy(value)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#4CAF50] p-2 transition-colors"><Icons.Copy size={14}/></button>}
        </div>
      </div>
    );
  };

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col h-[100dvh] transition-colors ${isDark ? 'bg-[#0d0d0d]' : 'bg-[#f5f5f5]'}`}>
      <header className={`h-16 border-b flex items-center px-4 justify-between sticky top-0 z-[110] ${isDark ? 'bg-[#111]/95 border-white/5' : 'bg-white/95 border-black/5 shadow-sm'}`}>
        <button onClick={onClose} className="p-2 text-gray-500 hover:text-[#4CAF50] transition-colors"><Icons.ChevronLeft size={24} /></button>
        <h2 className="text-[11px] font-black uppercase tracking-widest truncate flex-1 text-center">{isView ? t.detailedInfo : typeLabels[localData.type]}</h2><div className="w-10"/>
      </header>
      <main className="flex-1 overflow-y-auto p-4 space-y-5 pb-24 no-scrollbar">
        <div className="max-w-md mx-auto space-y-5">
          {localData.type === 'login' && (
            <>
              {(!isView || (localData.group && localData.group !== '---')) && <div className="space-y-1"><label className="text-[10px] font-black uppercase text-gray-500 ml-1">{t.groupLabel}</label><select disabled={isView} value={localData.group} onChange={e => setLocalData({...localData, group: e.target.value, subGroup: ''})} className={`w-full border rounded-2xl py-3 px-4 outline-none transition-all text-base ${isDark ? 'bg-[#181818] border-white/5 text-white' : 'bg-white border-gray-200'}`}><option value="---">---</option>{settings.folders.map(f => <option key={f} value={f}>{f}</option>)}</select></div>}
              {(!isView || localData.subGroup) && settings.subFolders[localData.group] && <div className="space-y-1 animate-in slide-in-from-top-1"><label className="text-[10px] font-black uppercase text-gray-500 ml-1">{t.subGroupLabel}</label><select disabled={isView} value={localData.subGroup} onChange={e => setLocalData({...localData, subGroup: e.target.value})} className={`w-full border rounded-2xl py-3 px-4 outline-none transition-all text-base ${isDark ? 'bg-[#181818] border-white/5 text-white' : 'bg-white border-gray-200'}`}><option value="">{t.chooseSubGroup}</option>{settings.subFolders[localData.group].map(s => <option key={s} value={s}>{s}</option>)}</select></div>}
              {copyableField(t.username, 'username', localData.username || "", "text", t.usernameHint)}
              {copyableField(t.password, 'password', localData.password || "", "password")}
              
              {!isView && <button type="button" onClick={() => setAdvancedOpen(!advancedOpen)} className="flex items-center gap-2 text-[11px] font-black text-[#4CAF50] uppercase tracking-widest py-2 px-1">{advancedOpen ? <Icons.ChevronDown size={14}/> : <Icons.ChevronRight size={14}/>} {t.advancedOptions}</button>}
              {(advancedOpen || isView) && (
                <div className="space-y-5 animate-in slide-in-from-top-2">
                  {copyableField(t.url, 'url', localData.url || "", "text", t.urlHint)}
                  {copyableField(t.pinCode, 'pin', localData.pin || "", "password")}
                  
                  <div className="space-y-5">
                    {copyableField(t.authCode, 'authCode', localData.authCode || "", "password", t.authCodeHint)}
                    {(!isView || localData.googleAuthQr) && (
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-500 ml-1">{localData.group === 'Mạng Internet' ? "Mã QR WiFi" : t.googleAuthQr}</label>
                        <label className={`w-full aspect-[2/1] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all ${isDark ? 'bg-black/40 border-white/10 hover:border-[#4CAF50]/50' : 'bg-white border-gray-200 hover:border-[#4CAF50]/50 shadow-sm'}`}>
                          {localData.googleAuthQr ? <img src={localData.googleAuthQr} className="w-full h-full object-contain" /> : <div className="text-center text-gray-500"><Icons.Plus className="mx-auto mb-1" size={24} /><span className="text-[10px] font-bold uppercase">{t.googleAuthQr}</span></div>}
                          <input type="file" className="hidden" accept="image/*" onChange={e => handleImage(e, 'googleAuthQr')} disabled={isView} />
                        </label>
                      </div>
                    )}
                  </div>

                  <div className="space-y-5">
                    {copyableField(t.msAuthCode, 'msAuthCode', localData.msAuthCode || "", "password", t.msAuthCodeHint)}
                    {(!isView || localData.msAuthQr) && (
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-500 ml-1">{t.msAuthQr}</label>
                        <label className={`w-full aspect-[2/1] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all ${isDark ? 'bg-black/40 border-white/10 hover:border-[#4CAF50]/50' : 'bg-white border-gray-200 hover:border-[#4CAF50]/50 shadow-sm'}`}>
                          {localData.msAuthQr ? <img src={localData.msAuthQr} className="w-full h-full object-contain" /> : <div className="text-center text-gray-500"><Icons.Plus className="mx-auto mb-1" size={24} /><span className="text-[10px] font-bold uppercase">{t.msAuthQr}</span></div>}
                          <input type="file" className="hidden" accept="image/*" onChange={e => handleImage(e, 'msAuthQr')} disabled={isView} />
                        </label>
                      </div>
                    )}
                  </div>

                  {copyableField(t.recoveryInfo, 'recoveryInfo', localData.recoveryInfo || "", "password", t.recoveryInfoHint)}
                  
                  {(!isView || localData.notes) && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-500 ml-1">{t.notes}</label>
                      <textarea disabled={isView} rows={3} value={localData.notes} onChange={e => setLocalData({...localData, notes: e.target.value})} className={`w-full border rounded-2xl p-4 text-[15px] resize-none outline-none transition-all ${isDark ? 'bg-[#181818] border-white/5 text-white focus:border-[#4CAF50]/50' : 'bg-white border-gray-200 shadow-sm focus:border-[#4CAF50]/50'}`} />
                    </div>
                  )}
                </div>
              )}
            </>
          )}
          {localData.type === 'card' && (
            <>
              {(!isView || localData.title) && <div className="space-y-1"><label className="text-[10px] font-black uppercase text-gray-500 ml-1">{t.title}</label><select disabled={isView} value={localData.title} onChange={e => setLocalData({...localData, title: e.target.value})} className={`w-full border rounded-2xl py-3 px-4 outline-none transition-all text-base ${isDark ? 'bg-[#181818] border-white/5 text-white' : 'bg-white border-gray-200'} ${!localData.title ? 'text-gray-400' : ''}`}><option value="">{t.chooseBank}</option>{(settings.subFolders['Ngân hàng'] || []).filter(b => !WALLET_LIST.includes(b)).map(b => <option key={b} value={b}>{b}</option>)}<option value="Khác">Khác</option></select></div>}
              {!WALLET_LIST.includes(localData.title) ? (
                <>
                  {(!isView || localData.cardType || localData.expiryMonth) && (
                    <div className="space-y-5">
                      {(!isView || localData.cardType) && <div className="space-y-1"><label className="text-[10px] font-black uppercase text-gray-500 ml-1">{t.cardType}</label><select disabled={isView} value={localData.cardType} onChange={e => setLocalData({...localData, cardType: e.target.value})} className={`w-full border rounded-2xl py-3 px-4 outline-none transition-all text-base ${isDark ? 'bg-[#181818] border-white/5 text-white' : 'bg-white border-gray-200'} ${!localData.cardType ? 'text-gray-400' : ''}`}><option value="" disabled>{t.chooseCardType}</option><option value="ATM">ATM</option><option value="Visa">Visa</option><option value="Debit">Debit</option><option value="Master">Master</option></select></div>}
                      {copyableField(t.expiryLabel, 'expiryMonth', localData.expiryMonth || "", "text", t.expiryHint)}
                    </div>
                  )}
                  {copyableField(t.cardNumber, 'cardNumber', localData.cardNumber || "", "text", "0000 0000 0000 0000")}
                  {copyableField(t.cardName, 'cardHolder', localData.cardHolder || "", "text", t.cardNameHint)}
                  {copyableField(t.atmPin, 'atmPin', localData.atmPin || "", "password")}
                </>
              ) : (
                <>{copyableField(t.phone, 'phone', localData.phone || "", "text", t.phoneHint)}{copyableField(t.password, 'password', localData.password || "", "password")}</>
              )}
              {['frontImage', 'backImage'].map(f => (
                (!isView || localData[f]) && (
                  <div key={f} className="space-y-2">
                    <div className="flex justify-between items-center"><label className="text-[10px] font-black uppercase text-gray-500">{t[f as keyof typeof t]}</label>{localData[f] && <button onClick={() => shareData(t[f as keyof typeof t] as string, "Card Image", localData[f])} className="text-[#4CAF50] active:scale-90 transition-transform"><Icons.Share2 size={16}/></button>}</div>
                    <label className={`w-full aspect-[1.6/1] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all ${isDark ? 'bg-black/40 border-white/10 hover:border-[#4CAF50]/50' : 'bg-white border-gray-200 hover:border-[#4CAF50]/50 shadow-sm'}`}>
                      {localData[f] ? <img src={localData[f]} className="w-full h-full object-cover" /> : <div className="text-center text-gray-500"><Icons.Plus className="mx-auto mb-1" size={24} /><span className="text-[10px] font-bold uppercase">{t[f as keyof typeof t]}</span></div>}
                      <input type="file" className="hidden" accept="image/*" onChange={e => handleImage(e, f)} disabled={isView} />
                    </label>
                  </div>
                )
              ))}
            </>
          )}
          {localData.type === 'contact' && (
            <>
              {copyableField(t.nickname, 'nickname', localData.nickname || "", "text", t.nicknameHint)}
              {copyableField(t.fullName, 'fullName', localData.fullName || "", "text", t.fullNameHint)}
              {copyableField(t.phone, 'phone', localData.phone || "", "text", t.phoneHint)}
              {copyableField(t.email, 'email', localData.email || "", "text", t.emailHint)}
              {copyableField(t.postCode, 'postCode', localData.postCode || "", "text", t.postCodeHint)}
              {copyableField(t.address, 'address', localData.address || "", "text", t.addressHint)}
              {(!isView || localData.notes) && <div className="space-y-1"><label className="text-[10px] font-black uppercase text-gray-500 ml-1">{t.notes}</label><textarea disabled={isView} rows={3} value={localData.notes} onChange={e => setLocalData({...localData, notes: e.target.value})} className={`w-full border rounded-2xl p-4 text-[15px] resize-none outline-none transition-all ${isDark ? 'bg-[#181818] border-white/5 text-white focus:border-[#4CAF50]/50' : 'bg-white border-gray-200 shadow-sm focus:border-[#4CAF50]/50'}`} /></div>}
              <button type="button" onClick={() => setShowQR(!showQR)} className="w-full bg-[#4CAF50] text-white py-4 rounded-3xl font-bold text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"><Icons.Camera size={16} /> {t.createQRCode}</button>
              {showQR && <div className="flex flex-col items-center p-6 bg-white rounded-[2.5rem] animate-in zoom-in-95 shadow-2xl space-y-4">
                  <QRCodeCanvas id="contact-qr-canvas" value={`BEGIN:VCARD\nFN:${localData.fullName}\nTEL:${localData.phone}\nEMAIL:${localData.email}\nADR:;;${localData.address};;;;${localData.postCode}\nEND:VCARD`} size={200} includeMargin level="H" />
                  <div className="flex gap-4"><button onClick={() => shareData(localData.fullName || "Contact", "vCard QR", (document.getElementById('contact-qr-canvas') as HTMLCanvasElement).toDataURL())} className="text-[#4CAF50] font-black text-[11px] uppercase tracking-widest px-4 py-2 bg-[#4CAF50]/10 rounded-full">SHARE</button></div>
              </div>}
            </>
          )}
          {localData.type === 'document' && (
            <>
              {(!isView || localData.documentType) && <div className="space-y-1"><label className="text-[10px] font-black uppercase text-gray-500 ml-1">{t.docType}</label><select disabled={isView} value={localData.documentType} onChange={e => setLocalData({...localData, documentType: e.target.value})} className={`w-full border rounded-2xl py-3 px-4 outline-none transition-all text-base ${isDark ? 'bg-[#181818] border-white/5 text-white' : 'bg-white border-gray-200'}`}><option value="">{t.chooseDocType}</option><option value="id_card">Thẻ Căn cước</option><option value="health_insurance">Thẻ BHYT</option><option value="driving_license">Giấy phép lái xe</option><option value="passport">Sổ Hộ chiếu</option></select></div>}
              {localData.documentType && (
                <div className="space-y-5 animate-in fade-in">
                  {/* Common document header fields */}
                  <div className="space-y-4">
                    {localData.documentType === 'health_insurance' ? copyableField(t.insuranceId, 'idNumber', localData.idNumber || "", "text", "...") :
                     localData.documentType === 'driving_license' ? copyableField(t.licenseId, 'idNumber', localData.idNumber || "", "text", "...") :
                     localData.documentType === 'passport' ? copyableField(t.passportId, 'idNumber', localData.idNumber || "", "text", "...") :
                     copyableField("Số định danh", 'idNumber', localData.idNumber || "", "text", "Số hiệu định danh...")}
                    
                    {copyableField(t.fullName, 'fullName', localData.fullName || "", "text", "Họ và tên in hoa...")}
                    
                    <div className="grid grid-cols-2 gap-3">
                        {copyableField("Ngày sinh", 'dob', localData.dob || "", "date")}
                        {(!isView || localData.gender) && (
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-gray-500 ml-1">Giới tính</label>
                            <select disabled={isView} value={localData.gender} onChange={e => setLocalData({...localData, gender: e.target.value})} className={`w-full border rounded-2xl py-3 px-4 outline-none transition-all text-sm ${isDark ? 'bg-[#181818] border-white/5 text-white' : 'bg-white border-gray-200'}`}>
                              <option value="">--</option>
                              <option value="Nam">Nam</option>
                              <option value="Nữ">Nữ</option>
                            </select>
                          </div>
                        )}
                    </div>
                  </div>

                  {/* Residence and specific fields by type */}
                  {localData.documentType === 'id_card' && (
                    <div className="space-y-4">
                      {copyableField(t.birthRegPlace, 'birthRegPlace', localData.birthRegPlace || "", "text", "...")}
                      {copyableField(t.residence, 'residence', localData.residence || "", "text", "...")}
                    </div>
                  )}

                  {localData.documentType === 'health_insurance' && (
                    <div className="space-y-4">
                      {copyableField(t.residence, 'residence', localData.residence || "", "text", "Địa chỉ...")}
                      {copyableField(t.hospital, 'hospital', localData.hospital || "", "text", "Nơi đăng ký KCB...")}
                      <div className="grid grid-cols-2 gap-3">
                        {copyableField(t.issueDate, 'issueDate', localData.issueDate || "", "date")}
                        {copyableField(t.expiryDate, 'expiryDate', localData.expiryDate || "", "date")}
                      </div>
                    </div>
                  )}

                  {localData.documentType === 'driving_license' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        {copyableField(t.classLabel, 'class', localData.class || "", "text", "Hạng...")}
                        {copyableField(t.issuer, 'issuer', localData.issuer || "", "text", "Cơ quan cấp...")}
                      </div>
                      {copyableField(t.residence, 'residence', localData.residence || "", "text", "Địa chỉ cư trú...")}
                      <div className="grid grid-cols-2 gap-3">
                        {copyableField(t.issueDate, 'issueDate', localData.issueDate || "", "date")}
                        {copyableField(t.expiryDate, 'expiryDate', localData.expiryDate || "", "date")}
                      </div>
                    </div>
                  )}

                  {localData.documentType === 'passport' && (
                    <div className="space-y-4">
                      {copyableField(t.residence, 'residence', localData.residence || "", "text", "Địa chỉ cư trú...")}
                      <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-1">{copyableField(t.passportType, 'passportType', localData.passportType || "", "text", "P")}</div>
                        <div className="col-span-2">{copyableField(t.nationality, 'nationality', localData.nationality || "", "text", "VIỆT NAM")}</div>
                      </div>
                      {copyableField(t.issueDate, 'issueDate', localData.issueDate || "", "date")}
                    </div>
                  )}

                  {['frontImage', 'backImage'].map(f => (
                    (!isView || localData[f]) && (
                      <div key={f} className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-500 ml-1">{t[f as keyof typeof t]}</label>
                        <label className={`w-full aspect-[1.6/1] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all ${isDark ? 'bg-black/40 border-white/10 hover:border-[#4CAF50]/50' : 'bg-white border-gray-200 hover:border-[#4CAF50]/50 shadow-sm'}`}>
                          {localData[f] ? <img src={localData[f]} className="w-full h-full object-cover" /> : <div className="text-center text-gray-500"><Icons.Plus className="mx-auto mb-1" size={24} /><span className="text-[10px] font-bold uppercase">{t[f as keyof typeof t]}</span></div>}
                          <input type="file" className="hidden" accept="image/*" onChange={e => handleImage(e, f)} disabled={isView} />
                        </label>
                      </div>
                    )
                  ))}

                  {/* Notes for specific types */}
                  {(localData.documentType === 'passport' || localData.documentType === 'id_card') && (!isView || localData.notes) && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-500 ml-1">{t.notes}</label>
                      <textarea disabled={isView} rows={3} value={localData.notes} onChange={e => setLocalData({...localData, notes: e.target.value})} className={`w-full border rounded-2xl p-4 text-[15px] resize-none outline-none transition-all ${isDark ? 'bg-[#181818] border-white/5 text-white focus:border-[#4CAF50]/50' : 'bg-white border-gray-200 shadow-sm focus:border-[#4CAF50]/50'}`} />
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      {!isView ? (
        <div className={`sticky bottom-0 left-0 right-0 p-4 border-t z-[120] transition-colors ${isDark ? 'bg-[#111] border-white/5' : 'bg-white border-black/5 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]'}`}><button onClick={() => onSave(localData)} className="w-full max-w-md mx-auto block bg-[#4CAF50] text-white py-4 rounded-3xl text-[12px] font-black uppercase tracking-[0.2em] shadow-lg shadow-[#4CAF50]/30 active:scale-95 transition-all">{t.save}</button></div>
      ) : (
        <div className={`sticky bottom-0 left-0 right-0 p-4 border-t z-[120] transition-colors ${isDark ? 'bg-[#111] border-white/5' : 'bg-white border-black/5 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]'}`}>
          <div className="max-w-md mx-auto flex items-center justify-around gap-2">
            <button onClick={() => { onClose(); setIsEditing(localData); }} className="flex-1 flex flex-col items-center gap-1 p-2 text-gray-500 hover:text-[#4CAF50] transition-all"><Icons.Pencil size={20}/><span className="text-[9px] font-bold uppercase">Sửa</span></button>
            <button onClick={() => copy(localData.password || localData.cardNumber || localData.phone || '')} className="flex-1 flex flex-col items-center gap-1 p-2 text-gray-500 hover:text-[#4CAF50] transition-all"><Icons.Copy size={20}/><span className="text-[9px] font-bold uppercase">Sao chép</span></button>
            <button onClick={() => deleteEntry(localData.id)} className={`flex-1 flex flex-col items-center gap-1 p-2 transition-all ${deleteClickCount.id === localData.id ? 'text-red-500' : 'text-gray-500'}`}><Icons.Trash2 size={20}/><span className="text-[9px] font-bold uppercase">Xóa</span></button>
          </div>
        </div>
      )}
    </div>
  );
};

const GeneratorScreen = ({ t, isDark, genPass, genConfig, setGenConfig, handleGenerator, copy, genHistory, showGenHistory, setShowGenHistory, setToast, onSave }: any) => {
  const [showQR, setShowQR] = useState(false);
  const [genMode, setGenMode] = useState<'password' | 'wifi' | 'share'>('password');
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiSecurity, setWifiSecurity] = useState('WPA');
  const [wifiPassword, setWifiPassword] = useState('');
  const [shareText, setShareText] = useState('');
  const [showShareQR, setShowShareQR] = useState(false);

  const wifiValue = useMemo(() => {
    if (wifiSecurity === 'NONE') return `WIFI:S:${wifiSsid};T:nopass;;`;
    return `WIFI:S:${wifiSsid};T:${wifiSecurity};P:${wifiPassword};;`;
  }, [wifiSsid, wifiSecurity, wifiPassword]);

  const handleSaveWifi = () => {
    if (!wifiSsid) {
      setToast("Vui lòng nhập tên WiFi");
      return;
    }
    const canvas = document.getElementById('wifi-qr-canvas') as HTMLCanvasElement;
    const qrDataUrl = canvas ? canvas.toDataURL() : '';
    
    const wifiEntry = {
      type: 'login',
      group: 'Mạng Internet',
      subGroup: 'WiFi',
      username: wifiSsid,
      password: wifiPassword,
      googleAuthQr: qrDataUrl,
      notes: `Security: ${wifiSecurity}`,
      isFrequent: true
    };
    
    onSave(wifiEntry);
    setToast(t.success);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <header className={`sticky top-0 z-40 h-16 border-b flex items-center px-6 justify-between transition-colors ${isDark ? 'bg-[#111]/90 border-white/5' : 'bg-white/90 border-black/5 shadow-sm'}`}>
        <h2 className="text-lg font-bold">{t.generatorTab}</h2>
        <button onClick={() => setShowGenHistory(!showGenHistory)} className={`p-2 transition-all ${showGenHistory ? 'text-[#4CAF50]' : 'text-gray-500'}`}><Icons.History size={22} /></button>
      </header>
      <div className={`p-2 flex gap-1 border-b transition-colors ${isDark ? 'bg-black/20 border-white/5' : 'bg-gray-100 border-gray-200'}`}>
        {['password', 'wifi', 'share'].map((m: any) => (<button key={m} onClick={() => setGenMode(m)} className={`flex-1 py-2 text-[10px] font-black uppercase rounded-xl transition-all ${genMode === m ? 'bg-[#4CAF50] text-white shadow-lg' : 'text-gray-500'}`}>{t[`genMode${m.charAt(0).toUpperCase() + m.slice(1)}` as keyof typeof t]}</button>))}
      </div>
      <main className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-32 no-scrollbar">
          {genMode === 'password' && (
            <div className="space-y-6 max-w-lg mx-auto text-center">
              <input readOnly value={genPass} className={`w-full border rounded-3xl p-6 text-center text-xl font-mono text-[#4CAF50] outline-none transition-all ${isDark ? 'bg-[#1a1a1a] border-white/5' : 'bg-white border-gray-200 shadow-sm'}`} />
              {showQR && genPass && <div className="bg-white p-6 rounded-3xl inline-block mx-auto animate-in zoom-in-95 shadow-xl"><QRCodeSVG id="pass-qr" value={genPass} size={180} /></div>}
              <div className="flex gap-3"><button onClick={() => copy(genPass)} className={`flex-1 font-bold py-4 rounded-3xl flex items-center justify-center gap-2 border active:scale-95 transition-all ${isDark ? 'bg-white/5 text-white border-white/5' : 'bg-white text-gray-700 border-gray-200 shadow-sm'}`}><Icons.Copy size={18}/> {t.copyPassword}</button><button onClick={handleGenerator} className="bg-[#4CAF50] text-white p-4 rounded-3xl shadow-lg active:scale-95 transition-all"><Icons.RefreshCw size={24}/></button></div>
              <button onClick={() => setShowQR(!showQR)} className={`w-full font-bold py-4 rounded-3xl flex items-center justify-center gap-2 border active:scale-95 transition-all ${showQR ? 'bg-[#4CAF50] text-white border-transparent shadow-lg' : (isDark ? 'bg-white/5 text-white border-white/5' : 'bg-white text-gray-700 border-gray-200 shadow-sm')}`}><Icons.Camera size={18}/> {t.createQRCode}</button>
              <div className={`rounded-[2.5rem] border p-6 space-y-4 text-left transition-colors ${isDark ? 'bg-[#161616] border-white/5' : 'bg-white border-gray-200 shadow-lg'}`}>
                <div className="flex justify-between items-center"><label className="text-xs font-bold text-gray-500">{t.genLength}</label><span className="font-bold text-[#4CAF50]">{genConfig.length}</span></div>
                <input type="range" min="4" max="64" value={genConfig.length} onChange={e => setGenConfig({...genConfig, length: parseInt(e.target.value)})} className="w-full accent-[#4CAF50]" />
                {[{ id: 'useAZ', label: t.genAZ }, { id: 'useaz', label: t.genaz }, { id: 'use09', label: t.gen09 }, { id: 'useSpec', label: t.genSpec }].map(opt => (
                  <div key={opt.id} className="flex items-center justify-between"><span className="text-xs">{opt.label}</span><button onClick={() => setGenConfig({...genConfig, [opt.id]: !(genConfig as any)[opt.id]})} className={`w-12 h-6 rounded-full relative transition-all ${ (genConfig as any)[opt.id] ? 'bg-[#4CAF50]' : 'bg-gray-300'}`}><div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${(genConfig as any)[opt.id] ? 'right-1' : 'left-1'}`} /></button></div>
                ))}
              </div>
            </div>
          )}
          {genMode === 'wifi' && (
            <div className="space-y-6 max-w-lg mx-auto">
              <div className="flex flex-col items-center bg-white p-6 rounded-[2.5rem] shadow-xl qr-canvas-target"><QRCodeCanvas id="wifi-qr-canvas" value={wifiValue} size={200} includeMargin level="H" /><p className="text-gray-400 text-[10px] font-bold uppercase mt-4 tracking-widest">{wifiSsid || 'WiFi Name'}</p></div>
              <div className="space-y-4">
                <div className="space-y-1"><label className="text-[10px] font-black uppercase text-gray-500 ml-1">{t.wifiSsid}</label><input value={wifiSsid} onChange={e => setWifiSsid(e.target.value)} className={`w-full border rounded-2xl py-3 px-4 outline-none ${isDark ? 'bg-[#181818] border-white/5 text-white' : 'bg-white border-gray-200 shadow-sm'}`} /></div>
                <div className="space-y-1"><label className="text-[10px] font-black uppercase text-gray-500 ml-1">{t.wifiPassword}</label><input type="password" value={wifiPassword} onChange={e => setWifiPassword(e.target.value)} className={`w-full border rounded-2xl py-3 px-4 outline-none ${isDark ? 'bg-[#181818] border-white/5 text-white' : 'bg-white border-gray-200 shadow-sm'}`} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => { const link = document.createElement('a'); link.download = `wifi-${wifiSsid}.png`; link.href = (document.getElementById('wifi-qr-canvas') as HTMLCanvasElement).toDataURL(); link.click(); }} className="bg-[#4CAF50] text-white py-2.5 rounded-2xl font-bold text-[10px] uppercase shadow-md active:scale-95 transition-all flex items-center justify-center gap-2">
                  <Icons.Download size={14}/> {t.downloadQr}
                </button>
                <button onClick={handleSaveWifi} className={`py-2.5 rounded-2xl font-bold text-[10px] uppercase border active:scale-95 transition-all flex items-center justify-center gap-2 ${isDark ? 'bg-white/5 border-white/10 text-[#4CAF50]' : 'bg-white border-gray-200 text-[#4CAF50] shadow-sm'}`}>
                  <Icons.Save size={14}/> {t.saveToVault}
                </button>
              </div>
            </div>
          )}
          {genMode === 'share' && (
            <div className="space-y-6 max-w-lg mx-auto">
              <textarea rows={5} value={shareText} onChange={e => { setShareText(e.target.value); setShowShareQR(false); }} className={`w-full border rounded-[2rem] p-5 text-[15px] resize-none outline-none transition-all ${isDark ? 'bg-[#181818] border-white/5 text-white focus:border-[#4CAF50]/50' : 'bg-white border-gray-200 shadow-sm focus:border-[#4CAF50]/50'}`} placeholder={t.shareQrPlaceholder} />
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setShowShareQR(true)} disabled={!shareText} className="bg-[#4CAF50] text-white py-4 rounded-3xl font-bold text-[11px] uppercase shadow-lg disabled:opacity-30 active:scale-95 transition-all flex items-center justify-center gap-2"><Icons.Camera size={18}/> {t.createQRCode}</button>
                <button onClick={() => shareData("Shared Text", shareText)} disabled={!shareText} className={`py-4 rounded-3xl font-bold text-[11px] uppercase border active:scale-95 transition-all flex items-center justify-center gap-2 ${isDark ? 'bg-white/5 border-white/5 text-white' : 'bg-white border-gray-200 shadow-sm'}`}><Icons.Share2 size={18}/> {t.shareQr}</button>
              </div>
              {showShareQR && <div className="flex flex-col items-center bg-white p-6 rounded-[2.5rem] shadow-xl qr-canvas-target animate-in zoom-in-95 space-y-4">
                  <QRCodeCanvas id="share-qr-canvas" value={shareText} size={200} includeMargin level="H" />
                  <div className="flex gap-4">
                    <button onClick={() => { const link = document.createElement('a'); link.download = 'shared-qr.png'; link.href = (document.getElementById('share-qr-canvas') as HTMLCanvasElement).toDataURL(); link.click(); }} className="text-[#4CAF50] font-black text-[11px] uppercase tracking-widest">{t.downloadQr}</button>
                    <button onClick={() => shareData("QR Code", shareText, (document.getElementById('share-qr-canvas') as HTMLCanvasElement).toDataURL())} className="text-[#4CAF50] font-black text-[11px] uppercase tracking-widest">SHARE QR</button>
                  </div>
              </div>}
            </div>
          )}
        </div>
        {showGenHistory && (
          <aside className="fixed inset-y-0 right-0 w-64 bg-[#111] border-l border-white/5 z-[90] animate-in slide-in-from-right duration-300 p-4 shadow-2xl flex flex-col transition-colors">
            <div className="flex justify-between items-center mb-6"><h3 className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em]">{t.genHistory}</h3><button onClick={() => setShowGenHistory(false)} className="text-gray-500 hover:text-white p-1"><Icons.X size={20}/></button></div>
            <div className="space-y-2 overflow-y-auto flex-1 no-scrollbar">{genHistory.map((p: string, idx: number) => <div key={idx} onClick={() => copy(p)} className="p-3 bg-white/5 rounded-xl text-[10px] font-mono text-[#4CAF50] truncate cursor-pointer active:bg-white/10 transition-colors border border-transparent hover:border-[#4CAF50]/20">{p}</div>)}</div>
          </aside>
        )}
      </main>
    </div>
  );
};

export default App;
