
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
    version: 'Version 2.1.0',
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
    titleHint: 'e.g. Vietcombank, Techcombank...',
    loginTitleHint: 'Facebook account, Gmail, Camera account...',
    username: 'Username',
    usernameHint: 'Phone number or Email',
    password: 'Password',
    pinCode: 'PIN Code',
    authCode: 'Google/Microsoft Auth',
    recoveryInfo: 'Recovery Code/Email',
    advancedOptions: 'Advanced Options',
    url: 'URL',
    urlHint: 'e.g. https://gmail.com',
    notes: 'Notes',
    cardName: 'Cardholder Name',
    cardNameHint: 'LE DUC LONG',
    cardNumber: 'Card Number',
    cardType: 'Card Type',
    expiryMonth: 'Duration',
    expiryYear: 'Expiry Year',
    nickname: 'Nickname',
    nicknameHint: 'Long Thanh, Giang coi...',
    fullName: 'Full Name',
    fullNameHint: 'Nguyen Van A...',
    phone: 'Phone Number',
    email: 'Email',
    address: 'Address',
    addressHint: 'Thôn Bắc Châu, P. Sông Trí, Hà Tĩnh',
    content: 'Content',
    genHistory: 'History',
    genLength: 'Length',
    genAZ: 'Uppercase (A-Z)',
    genaz: 'Lowercase (a-z)',
    gen09: 'Numbers (0-9)',
    genSpec: 'Special (!@#$%^&*)',
    genMinDigits: 'Min Digits',
    genMinSpec: 'Min Special',
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
    deleteFolder: 'Delete Folder',
    settingsInfo: 'Information',
    qrCode: 'QR Code',
    scanMe: 'Scan to copy',
    createMasterPass: 'Manage Master Password',
    newMasterPass: 'New Master Password',
    confirmMasterPass: 'Confirm Master Password',
    passwordRuleError: 'Must include letters, numbers, special characters, and be 8-30 characters long.',
    passwordMismatch: 'Passwords do not match.',
    saveKeyFile: 'Save Key File (.vpass)',
    changeMasterPass: 'Change Master Password',
    securitySettings: 'Security Settings',
    autoLock: 'Auto-lock (1 min inactivity)',
    clearClipboard: 'Clear clipboard (30 sec)',
    noMasterPassYet: 'Don\'t have a master password?',
    createOne: 'Create Now',
    chooseKeyFile: 'Choose Key File (.vpass)',
    expiryInterval: 'Expiry Duration',
    expiredWarning: 'Password expired! Please change.',
    day: '1 Day',
    month: '1 Month',
    sixMonths: '6 Months',
    year: '1 Year',
    success: 'Success',
    saveKeyWarning: 'Remember your password or store the key file in a safe place. If lost, you cannot access the app.',
    wrongPassword: 'Incorrect Master Password',
    seeMore: 'See More',
    seeLess: 'See Less',
    resetWarning: 'WARNING: This will delete ALL your passwords forever. Are you absolutely sure?',
    docType: 'Document Type',
    idCard: 'ID Card',
    healthInsurance: 'Health Insurance',
    drivingLicense: 'Driving License',
    passport: 'Passport',
    residenceCard: 'Residence Card',
    idNumber: 'ID Number',
    dob: 'Date of Birth',
    hometown: 'Hometown',
    residence: 'Residence',
    issuer: 'Issuer',
    issueDate: 'Issue Date',
    recognition: 'Recognition',
    gender: 'Gender',
    hospital: 'Hospital',
    nationality: 'Nationality',
    class: 'Class',
    issueAuthority: 'Issuing Authority',
    placeOfBirth: 'Place of Birth',
    idNo12Warning: 'Must enter exactly 12 digits!',
    idNo10Warning: 'Must enter exactly 10 digits!',
    uppercaseWarning: 'Please enter UPPERCASE letters',
    indefinite: 'Indefinite',
    chooseDocType: '-- Choose Document Type --',
    chooseCardType: '-Choose Card Type-',
    chooseGender: '-- Choose Gender --',
    chooseClass: '-- Choose Class --',
    themeLabel: 'Appearance',
    themeDark: 'Dark Mode',
    themeLight: 'Light Mode',
    langEn: 'English',
    langVi: 'Vietnamese',
    createQRCode: 'Create QR Code',
    atmPin: 'ATM PIN (at ATM)',
    cvv: 'PIN or CVV/CVC on card',
    qrImage: 'Account QR Image',
    frontImage: 'Front Side Image',
    backImage: 'Back Side Image',
    postCode: 'Post Code',
    frontImageBtn: 'Front Image',
    backImageBtn: 'Back Image',
    biometricNotAvailable: 'Biometrics not available on this device',
    biometricEnrollSuccess: 'Biometric identification linked successfully!',
    biometricError: 'Biometric error. Please use password.',
    genModePassword: 'Password',
    genModeWifi: 'QR WiFi',
    genModeShare: 'QR Share',
    wifiSsid: 'WiFi Name (SSID)',
    wifiSecurity: 'Security Type',
    wifiPassword: 'WiFi Password',
    downloadQr: 'Download',
    saveToVault: 'Save to Vault',
    shareQr: 'Share',
    wifiHint: 'Scan to join WiFi',
    chooseSubGroup: '-- Choose Sub-group --',
    chooseExpiry: '-- Choose Duration --',
    detailedInfo: 'Detailed Information',
    detailLogin: 'Login Details',
    detailCard: 'Card Details',
    detailDoc: 'Document Details',
    detailContact: 'Contact Details',
    shareQrInstruction: 'Write the content you want to quickly share with friends or family and click "Create QR Code" to share quickly and conveniently.',
    shareQrPlaceholder: 'Enter content to share...',
    vaultCorrupted: 'Vault data appears to be incompatible or corrupted.',
    linkedBank: 'Linked Bank',
    rechargeQr: 'Recharge QR Code'
  },
  vi: {
    appTitle: 'SecurePass',
    safeQuote: 'Nơi lưu giữ tất cả mọi thứ an toàn nhất',
    version: 'Phiên bản 2.1.0',
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
    copySuccess: 'Đã sao chép vào bộ nhớ đệm',
    deleteConfirm: 'Chạm 3 lần để xóa',
    addLogin: 'Đăng nhập (ID)',
    addCard: 'Thẻ (Card)',
    addContact: 'Danh bạ',
    addDocument: 'Giấy tờ cá nhân',
    save: 'Lưu',
    cancel: 'Hủy',
    title: 'Tiêu đề',
    titleHint: 'Vietcombank, Techcombank...',
    loginTitleHint: 'Tài khoản facebook, Gmail, TK camera ...',
    username: 'Tên đăng nhập (Số điện thoại hoặc Email)',
    usernameHint: 'Số điện thoại hoặc Email',
    password: 'Mật khẩu',
    pinCode: 'Mã PIN',
    authCode: 'Mã Google Auth/Authenticator (Microsoft)',
    recoveryInfo: 'Mã Khôi phục/ Email khôi phục',
    advancedOptions: 'Tùy chọn thêm',
    url: 'Đường dẫn (URL)',
    urlHint: 'https://gmail.com...',
    notes: 'Ghi chú',
    cardName: 'Tên trên thẻ',
    cardNameHint: 'LÊ ĐỨC LONG',
    cardNumber: 'Số thẻ',
    cardType: 'Loại thẻ',
    expiryMonth: 'Thời hạn',
    expiryYear: 'Năm hết hạn',
    nickname: 'Tên thường gọi',
    nicknameHint: 'Long Thanh, Giang còi...',
    fullName: 'Tên đầy đủ',
    fullNameHint: 'Nguyễn Văn A...',
    phone: 'Số điện thoại',
    email: 'Email',
    address: 'Địa chỉ',
    addressHint: 'Thôn Bắc Châu, P. Sông Trí, Hà Tĩnh',
    content: 'Nội dung',
    genHistory: 'Lịch sử',
    genLength: 'Độ dài ký tự',
    genAZ: 'A-Z',
    genaz: 'a-z',
    gen09: '0-9',
    genSpec: 'Ký tự (!@#$%^&*)',
    genMinDigits: 'Số chữ số tối thiểu',
    genMinSpec: 'Số ký tự đặc biệt tối thiểu',
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
    deleteFolder: 'Xóa Thư mục',
    settingsInfo: 'Thông tin',
    qrCode: 'Mã QR',
    scanMe: 'Quét để sao chép',
    createMasterPass: 'Quản lý mã khóa chủ',
    newMasterPass: 'Mật khẩu chủ mới',
    confirmMasterPass: 'Xác nhận mật khẩu chủ',
    passwordRuleError: 'Mật khẩu phải bao gồm chữ, số, ký tự đặc biệt và dài từ 8-30 ký tự.',
    passwordMismatch: 'Mật khẩu xác nhận không khớp.',
    saveKeyFile: 'Lưu mã khóa chủ (.vpass)',
    changeMasterPass: 'Thay đổi mã khóa chủ',
    securitySettings: 'Thiết lập bảo mật',
    autoLock: 'Tự động khóa app (1 phút không hoạt động)',
    clearClipboard: 'Xóa bộ nhớ đệm (30 giây)',
    noMasterPassYet: 'Bạn chưa có mật khẩu chủ?',
    createOne: 'Tạo mật khẩu chủ',
    chooseKeyFile: 'Chọn file khóa mật khẩu chủ (.vpass)',
    expiryInterval: 'Thời hạn',
    expiredWarning: 'Mật khẩu đã hết hạn! Vui lòng đổi.',
    day: '1 Ngày',
    month: '1 Tháng',
    sixMonths: '6 Tháng',
    year: '1 Năm',
    success: 'Tạo mật khẩu thành công',
    saveKeyWarning: 'Ghi nhớ mật khẩu đã tạo hoặc lưu file mật khẩu chủ nơi an toàn, tránh bị xóa hoặc làm mất. Nếu không sẽ không thể vào được app.',
    wrongPassword: 'Mật khẩu chính không chính xác',
    seeMore: 'Xem thêm',
    seeLess: 'Thu gọn',
    resetWarning: 'CẢNH BÁO: Thao tác này sẽ xóa vĩnh viễn TOÀN BỘ mật khẩu của bạn. Bạn có chắc chắn không?',
    docType: 'Loại giấy tờ',
    idCard: 'Thẻ Căn cước',
    healthInsurance: 'Thẻ BHYT',
    drivingLicense: 'Giấy phép lái xe',
    passport: 'Sổ Hộ chiếu',
    residenceCard: 'Thẻ cư trú',
    idNumber: 'Số Căn cước',
    dob: 'Ngày sinh',
    hometown: 'Quê quán',
    residence: 'Nơi cư trú',
    issuer: 'Nơi cấp',
    issueDate: 'Ngày cấp',
    recognition: 'Đặc điểm nhận dạng',
    gender: 'Giới tính',
    hospital: 'Nơi ĐK KCB BĐ',
    nationality: 'Quốc tịch',
    class: 'Hạng',
    issueAuthority: 'Cơ quan cấp',
    placeOfBirth: 'Nơi sinh',
    idNo12Warning: 'Bạn phải nhập đúng 12 chữ số!',
    idNo10Warning: 'Bạn phải nhập đúng 10 chữ số!',
    uppercaseWarning: 'Hãy nhập chữ in HOA',
    indefinite: 'Không thời hạn',
    chooseDocType: '-- Chọn loại giấy tờ --',
    chooseCardType: '-Chọn Loại thẻ-',
    chooseGender: '-- Chọn giới tính --',
    chooseClass: '-- Chọn hạng --',
    themeLabel: 'Giao diện',
    themeDark: 'Chế độ tối',
    themeLight: 'Chế độ sáng',
    langEn: 'Tiếng Anh',
    langVi: 'Tiếng Việt',
    createQRCode: 'Tạo QR Code',
    atmPin: 'Mật khẩu (Tại cây rút tiền ATM)',
    cvv: 'Mã PIN hoặc Mã CVV/CVC trên thẻ',
    qrImage: 'Ảnh mã QR tài khoản',
    frontImage: 'Ảnh mặt trước',
    backImage: 'Ảnh mặt sau',
    postCode: 'Mã bưu điện (Post code)',
    frontImageBtn: 'Ảnh mặt trước',
    backImageBtn: 'Ảnh mặt sau',
    biometricNotAvailable: 'Thiết bị không hỗ trợ sinh trắc học',
    biometricEnrollSuccess: 'Đã liên kết nhận diện sinh trắc học!',
    biometricError: 'Lỗi sinh trắc học. Hãy dùng mật khẩu.',
    genModePassword: 'Mật khẩu',
    genModeWifi: 'QR WiFi',
    genModeShare: 'QR Chia sẻ',
    wifiSsid: 'Tên wifi (SSID)',
    wifiSecurity: 'Loại bảo mật',
    wifiPassword: 'Mật khẩu WiFi',
    downloadQr: 'Tải xuống',
    saveToVault: 'Lưu vào Kho',
    shareQr: 'Chia sẻ',
    wifiHint: 'Quét để kết nối WiFi',
    chooseSubGroup: '-- Chọn nhóm con --',
    chooseExpiry: '-- Chọn thời hạn --',
    detailedInfo: 'Thông tin chi tiết',
    detailLogin: 'Thông tin chi tiết Đăng nhập',
    detailCard: 'Thông tin chi tiết Thẻ (Card)',
    detailDoc: 'Thông tin chi tiết Giấy tờ',
    detailContact: 'Thông tin chi tiết Danh bạ',
    shareQrInstruction: 'Hãy viết nội dung bạn muốn chia sẻ nhanh với bạn bè, người thân và nhấn nút "Tạo mã QR" để chia sẻ một cách nhanh chóng, tiện lợi.',
    shareQrPlaceholder: 'Nhập nội dung cần chia sẻ...',
    vaultCorrupted: 'Dữ liệu kho có vẻ không tương thích hoặc bị lỗi.',
    linkedBank: 'Liên kết tới ngân hàng',
    rechargeQr: 'Ảnh mã QR nạp tiền'
  }
};

const DEFAULT_FOLDERS = [
  'Mạng xã hội (Facebook, Tiktok, Zalo ...)',
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
  'Lưu trữ trực tuyến (Online Data)'
];

const DEFAULT_SUBFOLDERS: Record<string, string[]> = {
  'Ngân hàng': ['Vietcombank', 'Techcombank', 'Agribank', 'BIDV', 'ACB', 'Viettinbank', 'MBB'],
  'Ví điện tử': ['Momo', 'Zalopay', 'ShopeePay', 'VNPay', 'Viettel Money', 'VinID', 'VNPT Money', 'PayPal'],
  'Mạng xã hội (Facebook, Tiktok, Zalo ...)': ['Facebook', 'Tiktok', 'Zalo', 'Instagram', 'X', 'Line', 'Telegram', 'whatsapp'],
  'Thư điện tử (Email)': ['Gmail', 'Hotmail', 'Outlook'],
  'Điện thoại': ['Iphone (icloud)', 'Samsung', 'Xiaomi', 'Poco', 'Google Pixel', 'Vivo', 'Realme', 'Oppo', 'Huawei'],
  'Camera': ['Imou', 'Xiaomi', 'Ezviz', 'FPT', 'Hikvision', 'Dahua', 'Eufy', 'Tapo'],
  'Mạng Internet': ['Viettel', 'VNPT', 'FPT'],
  'Mua sắm online': ['Shopee', 'Lazada', 'Tiktok shop', 'Tiki', 'Sendo', 'Amazon', 'Alibaba', 'Temu', 'Shein', 'Rakuten', 'Mercari'],
  'Lưu trữ trực tuyến (Online Data)': ['Microsoft OneDrive', 'Google Drive', 'Mega', 'Dropbox']
};

const WALLET_LIST = ['Momo', 'Zalopay', 'ShopeePay', 'VNPay', 'Viettel Money', 'VinID', 'VNPT Money', 'PayPal'];

const shareData = async (title: string, text: string, base64Image?: string) => {
  try {
    const data: any = { title, text };
    if (base64Image) {
      const res = await fetch(base64Image);
      const blob = await res.blob();
      const file = new File([blob], 'share.png', { type: blob.type });
      data.files = [file];
    }
    if (navigator.canShare && navigator.canShare(data)) {
      await navigator.share(data);
    } else {
      alert("Sharing not supported on this browser.");
    }
  } catch (err) {
    console.error("Share failed", err);
  }
};

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('login');
  const [settingsSubView, setSettingsSubView] = useState<'main' | 'data' | 'folders' | 'security' | 'theme' | 'language'>('main');
  const [isLocked, setIsLocked] = useState(true);
  const [masterPassword, setMasterPassword] = useState('');
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
  const [lastVaultTap, setLastVaultTap] = useState(0);

  const [genPass, setGenPass] = useState('');
  const [genConfig, setGenConfig] = useState({
    length: 16,
    useAZ: true,
    useaz: true,
    use09: true,
    useSpec: true,
    minDigits: 1,
    minSpec: 1
  });
  const [genHistory, setGenHistory] = useState<string[]>([]);
  const [showGenHistory, setShowGenHistory] = useState(false);

  const touchStartX = useRef(0);
  const autoLockTimer = useRef<number | null>(null);
  const clipboardTimer = useRef<number | null>(null);

  const [settings, setSettings] = useState<SettingsState>(() => {
    const saved = localStorage.getItem('securepass_settings');
    const defaultSettings: SettingsState = {
      autoLockMinutes: 1,
      clearClipboardSeconds: 30,
      autoLockEnabled: true,
      clearClipboardEnabled: true,
      biometricEnabled: false,
      language: 'vi',
      theme: 'dark',
      groups: ['Banking', 'Shopping', 'Study', 'Game'],
      folders: DEFAULT_FOLDERS,
      subFolders: DEFAULT_SUBFOLDERS,
      hasMasterPassword: !!localStorage.getItem('securepass_master_hash')
    };
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  });

  const isDark = settings.theme === 'dark';
  const t = translations[settings.language];

  useEffect(() => {
    if (isLocked && settings.biometricEnabled && localStorage.getItem('securepass_biometric_id')) {
      setTimeout(() => {
        handleBiometricLogin();
      }, 800);
    }
  }, []);

  useEffect(() => {
    if (isLocked || !settings.autoLockEnabled) {
      if (autoLockTimer.current) clearTimeout(autoLockTimer.current);
      return;
    }
    const resetTimer = () => {
      if (autoLockTimer.current) clearTimeout(autoLockTimer.current);
      autoLockTimer.current = window.setTimeout(() => {
        handleLock();
      }, settings.autoLockMinutes * 60000);
    };
    resetTimer();
    const activityEvents = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
    activityEvents.forEach(name => document.addEventListener(name, resetTimer));
    return () => {
      if (autoLockTimer.current) clearTimeout(autoLockTimer.current);
      activityEvents.forEach(name => document.removeEventListener(name, resetTimer));
    };
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
    setSettingsSubView('main');
  };

  const handleLogin = async (e?: React.FormEvent, providedPass?: string) => {
    e?.preventDefault();
    const passToUse = providedPass || masterPassword;
    if (!passToUse) return;

    const verificationToken = localStorage.getItem('securepass_master_hash');
    if (verificationToken) {
      try {
        const parsedToken = JSON.parse(verificationToken);
        await SecurityService.decrypt(parsedToken, passToUse);
      } catch (err: any) {
        setToast(t.wrongPassword);
        return;
      }
    }

    try {
      const encryptedVault = localStorage.getItem('securepass_vault');
      let decryptedEntries: PasswordEntry[] = [];
      if (encryptedVault) {
        try {
          const parsedVault = JSON.parse(encryptedVault);
          const decrypted = await SecurityService.decrypt(parsedVault, passToUse);
          decryptedEntries = JSON.parse(decrypted);
        } catch (err: any) {
          setToast(t.vaultCorrupted);
          return;
        }
      }

      setEntries(decryptedEntries);
      setIsLocked(false);
      setView('vault');
      setMasterPassword(passToUse);

      if (!verificationToken) {
        const newHash = await SecurityService.encrypt("VALID_SESSION", passToUse);
        localStorage.setItem('securepass_master_hash', JSON.stringify(newHash));
        setSettings(prev => ({ ...prev, hasMasterPassword: true }));
      }
    } catch (err) {
      setToast(t.wrongPassword);
    }
  };

  const handleBiometricLogin = async () => {
    try {
      const decryptedPass = await SecurityService.authenticateBiometric();
      if (decryptedPass) {
        handleLogin(undefined, decryptedPass);
      }
    } catch (err: any) {
      if (err.name !== 'NotAllowedError' && err.name !== 'AbortError') {
        setToast(t.biometricError);
      }
    }
  };

  const handleKeyFileLogin = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = JSON.parse(event.target?.result as string);
        const decryptedPass = await SecurityService.decrypt(content, "SECUREPASS_INTERNAL_KEYFILE_SEED");
        handleLogin(undefined, decryptedPass);
      } catch {
        setToast('File không hợp lệ');
      }
    };
    reader.readAsText(file);
  };

  const saveVault = async (updated: PasswordEntry[]) => {
    if (!masterPassword) return;
    try {
      const encrypted = await SecurityService.encrypt(JSON.stringify(updated), masterPassword);
      localStorage.setItem('securepass_vault', JSON.stringify(encrypted));
    } catch (err) {
      setToast("Lỗi lưu trữ: Dữ liệu quá lớn hoặc bộ nhớ đầy");
    }
  };

  const handleMasterPasswordChange = async (newPassword: string) => {
    const verification = await SecurityService.encrypt("VALID_SESSION", newPassword);
    localStorage.setItem('securepass_master_hash', JSON.stringify(verification));

    if (!isLocked) {
      const encrypted = await SecurityService.encrypt(JSON.stringify(entries), newPassword);
      localStorage.setItem('securepass_vault', JSON.stringify(encrypted));
    } else if (isLocked) {
      localStorage.removeItem('securepass_vault');
      setEntries([]);
    }

    setMasterPassword(newPassword);
    setSettings(prev => ({ ...prev, hasMasterPassword: true }));
    if (settings.biometricEnabled) {
      try { await SecurityService.enableBiometric(newPassword); } catch(e) {}
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        JSON.parse(content);
        localStorage.setItem('securepass_vault', content);
        setToast('Đã nhập dữ liệu. Vui lòng mở khóa lại.');
        handleLock();
      } catch (err) {
        alert('File dữ liệu không hợp lệ');
      }
    };
    reader.readAsText(file);
  };

  const handleExport = () => {
    const data = localStorage.getItem('securepass_vault');
    if (!data) {
      alert('Chưa có dữ liệu để xuất');
      return;
    }
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `securepass_backup_${new Date().toISOString().split('T')[0]}.vpass`;
    a.click();
    URL.revokeObjectURL(url);
    setToast('Đã sao lưu cơ sở dữ liệu');
  };

  const copy = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setToast(t.copySuccess);
    if (settings.clearClipboardEnabled) {
      if (clipboardTimer.current) clearTimeout(clipboardTimer.current);
      clipboardTimer.current = window.setTimeout(() => {
        navigator.clipboard.writeText('');
        setToast('Đã xóa bộ nhớ đệm');
      }, settings.clearClipboardSeconds * 1000);
    }
  };

  const deleteEntry = (id: string) => {
    if (deleteClickCount.id === id && deleteClickCount.count >= 2) {
      const updated = entries.filter(e => e.id !== id);
      setEntries(updated);
      saveVault(updated);
      setDeleteClickCount({ id: '', count: 0 });
      setSelectedEntry(null);
    } else if (deleteClickCount.id === id) {
      setDeleteClickCount({ id, count: deleteClickCount.count + 1 });
      setToast(t.deleteConfirm);
    } else {
      setDeleteClickCount({ id, count: 1 });
      setToast(t.deleteConfirm);
    }
  };

  const handleGenerator = () => {
    const p = generatePassword(genConfig.length, genConfig);
    setGenPass(p);
    setGenHistory(prev => [p, ...prev].slice(0, 10));
  };

  const onAddEntry = (data: any) => {
    const n: PasswordEntry = { 
      ...data, 
      id: Math.random().toString(36).substring(2, 9), 
      createdAt: Date.now(),
      strength: calculateStrength(data.password || ''),
      isFrequent: true
    };
    const updated = [n, ...entries];
    setEntries(updated);
    saveVault(updated);
    setIsAdding(null);
  };

  const onEditEntry = (data: any) => {
    const updated = entries.map(e => e.id === data.id ? { ...data, strength: calculateStrength(data.password || '') } : e);
    setEntries(updated);
    saveVault(updated);
    setIsEditing(null);
  };

  const handleSwipeBack = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].screenX;
    const diff = touchEndX - touchStartX.current;
    if (diff > 80) {
      if (selectedEntry || isAdding || isEditing) {
        setSelectedEntry(null);
        setIsAdding(null);
        setIsEditing(null);
      } else if (view === 'settings' && settingsSubView !== 'main') {
        setSettingsSubView('main');
      } else if (view !== 'vault' && !isLocked) {
        setView('vault');
      }
    }
  };

  const handleVaultTabClick = () => {
    const now = Date.now();
    if (now - lastVaultTap < 300) {
      setActiveCategory(null);
      setSearchQuery('');
      const main = document.querySelector('main');
      if (main) main.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setView('vault');
    }
    setLastVaultTap(now);
  };

  return (
    <div 
      className={`h-full flex flex-col overflow-hidden selection:bg-[#4CAF50]/20 selection:text-[#4CAF50] transition-colors duration-500 ${isDark ? 'bg-[#0d0d0d] text-[#E0E0E0]' : 'bg-[#f5f5f5] text-[#1a1a1a]'}`}
      onTouchStart={(e) => { touchStartX.current = e.touches[0].screenX; }}
      onTouchEnd={handleSwipeBack}
    >
      {isLocked ? (
        <LoginScreen t={t} isDark={isDark} masterPassword={masterPassword} setMasterPassword={setMasterPassword} handleLogin={handleLogin} handleBiometricLogin={handleBiometricLogin} handleKeyFileLogin={handleKeyFileLogin} setIsMasterModalOpen={setIsMasterModalOpen} />
      ) : (
        <div className="flex-1 flex flex-col relative overflow-hidden">
          {view === 'vault' && (
            <VaultScreen 
              t={t} 
              isDark={isDark} 
              entries={entries} 
              searchQuery={searchQuery} 
              setSearchQuery={setSearchQuery} 
              activeCategory={activeCategory} 
              setActiveCategory={setActiveCategory} 
              setSelectedEntry={setSelectedEntry} 
              setIsEditing={setIsEditing} 
              copy={copy} 
              deleteEntry={deleteEntry} 
              deleteClickCount={deleteClickCount}
              settings={settings} 
              setView={setView} 
            />
          )}
          {view === 'generator' && (
            <GeneratorScreen t={t} isDark={isDark} genPass={genPass} genConfig={genConfig} setGenConfig={setGenConfig} handleGenerator={handleGenerator} copy={copy} genHistory={genHistory} showGenHistory={showGenHistory} setShowGenHistory={setShowGenHistory} setToast={setToast} onAddEntry={onAddEntry} />
          )}
          {view === 'settings' && (
            <SettingsScreen 
              t={t} 
              isDark={isDark} 
              settings={settings} 
              setSettings={setSettings} 
              handleLock={handleLock} 
              setView={setView} 
              setIsMasterModalOpen={setIsMasterModalOpen} 
              masterPassword={masterPassword} 
              handleImport={handleImport} 
              handleExport={handleExport} 
              setToast={setToast}
              subView={settingsSubView}
              setSubView={setSettingsSubView}
            />
          )}
          {showPlusMenu && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-[60] flex items-center justify-center p-6" onClick={() => setShowPlusMenu(false)}>
              <div className="space-y-3 flex flex-col items-center animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                <button onClick={() => { setIsAdding('login'); setShowPlusMenu(false); }} className="w-64 bg-[#4CAF50] text-white px-6 py-5 rounded-3xl font-bold shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all">
                  <Icons.User size={20} /> {t.addLogin}
                </button>
                <button onClick={() => { setIsAdding('card'); setShowPlusMenu(false); }} className="w-64 bg-[#4CAF50] text-white px-6 py-5 rounded-3xl font-bold shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all">
                  <Icons.CreditCard size={20} /> {t.addCard}
                </button>
                <button onClick={() => { setIsAdding('document'); setShowPlusMenu(false); }} className="w-64 bg-[#4CAF50] text-white px-6 py-5 rounded-3xl font-bold shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all">
                  <Icons.FileText size={20} /> {t.addDocument}
                </button>
                <button onClick={() => { setIsAdding('contact'); setShowPlusMenu(false); }} className="w-64 bg-[#4CAF50] text-white px-6 py-5 rounded-3xl font-bold shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all">
                  <Icons.Smartphone size={20} /> {t.addContact}
                </button>
                <button onClick={() => setShowPlusMenu(false)} className={`mt-6 w-14 h-14 ${isDark ? 'bg-white/10' : 'bg-black/10'} rounded-full flex items-center justify-center ${isDark ? 'text-white' : 'text-black'} active:scale-90 transition-all shadow-lg`}>
                  <Icons.X size={28} />
                </button>
              </div>
            </div>
          )}
          <nav className={`h-16 border-t flex items-center justify-around px-4 sticky bottom-0 z-[70] pb-safe transition-colors duration-500 ${isDark ? 'bg-[#111] border-white/5' : 'bg-white border-black/5'}`}>
            <button onClick={handleVaultTabClick} className={`flex flex-col items-center p-3 transition-colors ${view === 'vault' ? 'text-[#4CAF50]' : (isDark ? 'text-gray-700' : 'text-gray-400')}`}>
              <Icons.Database size={24} />
            </button>
            <div className="relative">
               <button onClick={() => setShowPlusMenu(!showPlusMenu)} className={`w-16 h-16 bg-[#4CAF50] rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-[#4CAF50]/20 -translate-y-6 active:scale-90 transition-all border-4 ${isDark ? 'border-[#0d0d0d]' : 'border-[#f5f5f5]'}`}>
                <Icons.Plus size={32} className={`transition-transform duration-300 ${showPlusMenu ? 'rotate-45' : ''}`} />
              </button>
            </div>
            <button onClick={() => { setView('generator'); if(!genPass) handleGenerator(); }} className={`flex flex-col items-center p-3 transition-colors ${view === 'generator' ? 'text-[#4CAF50]' : (isDark ? 'text-gray-700' : 'text-gray-400')}`}>
              <Icons.RefreshCw size={24} />
            </button>
          </nav>
          {(isAdding || isEditing || selectedEntry) && (
            <EntryModal t={t} isDark={isDark} settings={settings} mode={isEditing ? 'edit' : isAdding ? 'add' : 'view'} entry={isEditing || selectedEntry || undefined} addType={isAdding || undefined} onClose={() => { setIsAdding(null); setIsEditing(null); setSelectedEntry(null); }} onSave={isAdding ? onAddEntry : onEditEntry} copy={copy} />
          )}
        </div>
      )}
      {isMasterModalOpen && (
        <MasterPasswordModal t={t} isDark={isDark} onClose={() => setIsMasterModalOpen(false)} setMasterPassword={handleMasterPasswordChange} masterPassword={masterPassword} />
      )}
      {toast && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 bg-[#4CAF50] text-white px-6 py-2 rounded-full text-xs font-bold shadow-2xl z-[100] animate-in fade-in slide-in-from-top-10">
          {toast}
        </div>
      )}
    </div>
  );
};

const LoginScreen = ({ t, isDark, masterPassword, setMasterPassword, handleLogin, handleBiometricLogin, handleKeyFileLogin, setIsMasterModalOpen }: any) => (
  <div className={`h-full w-full flex flex-col items-center justify-center p-6 transition-colors duration-500 ${isDark ? 'bg-[#0a0a0a]' : 'bg-[#f0f0f0]'}`}>
    <div className={`w-full max-sm rounded-[2.5rem] p-8 border shadow-2xl transition-colors duration-500 ${isDark ? 'bg-[#121212] border-white/5' : 'bg-white border-black/5'}`}>
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 bg-[#4CAF50] rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-[#4CAF50]/10">
          <Icons.Lock className="text-white w-8 h-8" />
        </div>
        <h1 className={`text-2xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>{t.appTitle}</h1>
        <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mt-1 text-center">{t.unlockSubtitle}</p>
      </div>
      <form onSubmit={handleLogin} className="space-y-4">
        <input autoFocus type="password" placeholder={t.masterPassword} value={masterPassword} onChange={(e) => setMasterPassword(e.target.value)} className={`w-full border rounded-2xl py-4 px-6 text-[16px] placeholder:text-[13px] focus:border-[#4CAF50]/40 transition-all outline-none ${isDark ? 'bg-[#1a1a1a] border-white/5 text-white' : 'bg-gray-100 border-gray-200 text-gray-900'}`} />
        <button type="submit" className="w-full bg-[#4CAF50] hover:bg-[#45a049] text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2">
          <Icons.Unlock size={18} /> {t.unlockVault}
        </button>
        <button type="button" onClick={handleBiometricLogin} className={`w-full font-bold py-4 rounded-2xl flex items-center justify-center gap-2 border transition-all text-sm mt-2 active:scale-95 ${isDark ? 'bg-white/5 hover:bg-white/10 text-white border-white/5' : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200'}`}>
          <Icons.Fingerprint size={22} className="text-[#4CAF50]" /> {t.biometricUnlock}
        </button>
        <div className="pt-4 space-y-4">
          <label className={`flex items-center justify-center gap-2 text-xs font-bold cursor-pointer hover:opacity-80 transition-all ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            <Icons.Database size={16} className="text-[#4CAF50]" /> {t.chooseKeyFile}
            <input type="file" className="hidden" accept=".vpass" onChange={handleKeyFileLogin} />
          </label>
          <div className="text-center pt-2">
            <p className={`text-[10px] uppercase font-bold tracking-widest ${isDark ? 'text-gray-700' : 'text-gray-400'}`}>{t.noMasterPassYet}</p>
            <button type="button" onClick={() => setIsMasterModalOpen(true)} className="text-[#4CAF50] text-xs font-black mt-1 hover:underline">{t.createOne}</button>
          </div>
        </div>
      </form>
    </div>
  </div>
);

const VaultScreen = ({ t, isDark, entries, searchQuery, setSearchQuery, activeCategory, setActiveCategory, setSelectedEntry, setIsEditing, copy, deleteEntry, deleteClickCount, settings, setView }: any) => {
  const [isFoldersOpen, setIsFoldersOpen] = useState(false);
  const [showMoreFrequent, setShowMoreFrequent] = useState(false);
  const isExpired = (entry: PasswordEntry) => {
    if (!entry.expiryInterval || entry.type !== 'login') return false;
    let ms = 0;
    switch(entry.expiryInterval) {
      case '1d': ms = 24 * 60 * 60 * 1000; break;
      case '1m': ms = 30 * 24 * 60 * 60 * 1000; break;
      case '6m': ms = 180 * 24 * 60 * 60 * 1000; break;
      case '1y': ms = 365 * 24 * 60 * 60 * 1000; break;
    }
    return Date.now() > entry.createdAt + ms;
  };
  const filteredEntries = useMemo(() => {
    let list = entries;
    if (activeCategory) {
      list = list.filter((e: any) => activeCategory.type === 'type' ? e.type === activeCategory.val : e.group === activeCategory.val);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter((e: any) => (e.title && e.title.toLowerCase().includes(q)) || (e.username && e.username.toLowerCase().includes(q)) || (e.nickname && e.nickname.toLowerCase().includes(q)));
    }
    return list;
  }, [entries, activeCategory, searchQuery]);
  const frequentEntriesFull = entries.filter((e: any) => e.isFrequent);
  const frequentEntries = showMoreFrequent ? frequentEntriesFull : frequentEntriesFull.slice(0, 5);
  const folderCounts: Record<string, number> = {};
  settings.folders.forEach((f: string) => folderCounts[f] = entries.filter((e: any) => e.group === f).length);
  return (
    <div className="flex-1 flex flex-col h-full">
      <header className={`sticky top-0 z-40 h-16 border-b flex items-center px-4 justify-between backdrop-blur-xl transition-colors duration-500 ${isDark ? 'bg-[#111]/90 border-white/5' : 'bg-white/90 border-black/5'}`}>
        <div className="flex-1 relative">
          <Icons.Search className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-700' : 'text-gray-400'}`} size={16} />
          <input type="text" placeholder={t.searchPlaceholder} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={`w-full border rounded-full py-2.5 pl-12 pr-4 text-[16px] placeholder:text-[13px] focus:outline-none focus:border-[#4CAF50]/40 transition-all ${isDark ? 'bg-[#1a1a1a] border-white/5 text-white' : 'bg-gray-100 border-gray-200 text-gray-900'}`} />
        </div>
        <button onClick={() => setView('settings')} className={`ml-3 p-2 transition-colors ${isDark ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-gray-900'}`}><Icons.Settings size={22} /></button>
      </header>
      <main className="flex-1 overflow-y-auto p-4 space-y-6 pb-32">
        {(activeCategory || searchQuery) ? (
          <div className="space-y-4">
            <button onClick={() => { setActiveCategory(null); setSearchQuery(''); }} className="flex items-center gap-2 text-[#4CAF50] text-sm font-bold mb-4">
              <Icons.ChevronLeft size={18} /> {searchQuery ? 'Back' : activeCategory.val}
            </button>
            {filteredEntries.map((entry: any) => (
              <EntryItem key={entry.id} isDark={isDark} entry={entry} isExpired={isExpired(entry)} t={t} setSelectedEntry={setSelectedEntry} setIsEditing={setIsEditing} copy={copy} deleteEntry={deleteEntry} deleteClickCount={deleteClickCount} />
            ))}
          </div>
        ) : (
          <>
            <section>
              <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2 px-1 ${isDark ? 'text-gray-700' : 'text-gray-400'}`}><Icons.Star size={12}/> {t.frequentHeader}</h3>
              <div className="space-y-2">
                {frequentEntries.map((entry: any) => (
                  <EntryItem key={entry.id} isDark={isDark} entry={entry} isExpired={isExpired(entry)} t={t} setSelectedEntry={setSelectedEntry} setIsEditing={setIsEditing} copy={copy} deleteEntry={deleteEntry} deleteClickCount={deleteClickCount} />
                ))}
                {frequentEntriesFull.length > 5 && (
                  <button onClick={() => setShowMoreFrequent(!showMoreFrequent)} className={`w-full py-3 text-[#4CAF50] text-[10px] font-black uppercase tracking-widest rounded-2xl border border-dashed flex items-center justify-center gap-2 active:scale-95 transition-all ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-100 border-gray-300'}`}>
                    {showMoreFrequent ? <><Icons.ChevronUp size={14}/> {t.seeLess}</> : <><Icons.ChevronDown size={14}/> {t.seeMore}</>}
                  </button>
                )}
              </div>
            </section>
            <section>
              <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2 px-1 ${isDark ? 'text-gray-700' : 'text-gray-400'}`}><Icons.Shield size={12}/> {t.typesHeader}</h3>
              <div className="grid grid-cols-2 gap-3">
                {['login', 'card', 'document', 'contact'].map(id => (
                  <button key={id} onClick={() => setActiveCategory({ type: 'type', val: id })} className={`flex flex-col items-center justify-center p-5 rounded-3xl border transition-all active:scale-[0.96] shadow-sm text-center ${isDark ? 'bg-[#161616] border-white/5' : 'bg-white border-gray-200'}`}>
                    <div className="text-[#4CAF50] mb-3">
                      {id === 'login' ? <Icons.User size={26}/> : id === 'card' ? <Icons.CreditCard size={26}/> : id === 'contact' ? <Icons.Smartphone size={26}/> : <Icons.FileText size={26}/>}
                    </div>
                    <span className={`text-[11px] font-black uppercase tracking-widest mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>{t[`type${id.charAt(0).toUpperCase() + id.slice(1)}` as keyof typeof t] || id}</span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${isDark ? 'text-gray-600 bg-white/5' : 'text-gray-400 bg-gray-100'}`}>{entries.filter((e: any) => e.type === id).length}</span>
                  </button>
                ))}
              </div>
            </section>
            <section className={`border rounded-3xl p-0.5 shadow-lg ${isDark ? 'bg-[#161616] border-white/5' : 'bg-white border-gray-200'}`}>
              <button onClick={() => setIsFoldersOpen(!isFoldersOpen)} className="w-full flex items-center justify-between py-4 px-6">
                <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ${isDark ? 'text-gray-700' : 'text-gray-400'}`}><Icons.Folder size={12}/> {t.foldersHeader}</h3>
                <Icons.ChevronDown size={22} className={`transition-transform duration-300 ${isDark ? 'text-gray-500' : 'text-gray-400'} ${isFoldersOpen ? '' : '-rotate-90'}`} />
              </button>
              {isFoldersOpen && (
                <div className="space-y-1 px-1.5 pb-3 animate-in slide-in-from-top-1 duration-200">
                  {settings.folders.map((f: string) => (
                    <button key={f} onClick={() => setActiveCategory({ type: 'folder', val: f })} className={`w-full flex items-center justify-between py-3 px-4 rounded-xl border border-transparent hover:border-[#4CAF50]/10 transition-all active:scale-[0.98] ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                      <div className="flex items-center gap-2.5">
                        <Icons.Folder size={14} className="text-[#4CAF50]" />
                        <span className={`text-[11px] font-bold ${isDark ? 'text-white/70' : 'text-gray-700'}`}>{f}</span>
                      </div>
                      <span className={`text-[9px] font-bold px-2 h-5 flex items-center justify-center rounded-md ${isDark ? 'text-gray-500 bg-white/5' : 'text-gray-400 bg-gray-200'}`}>{folderCounts[f]}</span>
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

const EntryItem = ({ isDark, entry, isExpired, t, setSelectedEntry, setIsEditing, copy, deleteEntry, deleteClickCount }: any) => (
  <div onClick={() => setSelectedEntry(entry)} className={`border rounded-2xl p-4 flex items-center justify-between group hover:border-[#4CAF50]/30 transition-all cursor-pointer no-select ${isDark ? 'bg-[#181818]' : 'bg-white shadow-sm'} ${isExpired ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.15)]' : (isDark ? 'border-white/5' : 'border-gray-200')}`}>
    <div className="flex items-center gap-3 overflow-hidden">
      <div className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${isExpired ? 'text-red-500' : 'text-[#4CAF50]'} ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}>
        {entry.type === 'login' ? <Icons.User size={22} /> : entry.type === 'card' ? <Icons.CreditCard size={22} /> : entry.type === 'contact' ? <Icons.Smartphone size={22} /> : <Icons.FileText size={22} />}
      </div>
      <div className="overflow-hidden">
        <h4 className={`text-sm font-bold truncate leading-tight flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {entry.title || entry.nickname || entry.fullName || (entry.documentType ? t[entry.documentType] : 'Item')}
          {isExpired && <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"/>}
        </h4>
        <p className={`text-[10px] uppercase tracking-tighter mt-1 truncate ${isExpired ? 'text-red-500 font-bold' : (isDark ? 'text-gray-600' : 'text-gray-400')}`}>
          {isExpired ? t.expiredWarning : (entry.username || entry.nickname || entry.cardHolder || entry.idNumber || '...')}
        </p>
      </div>
    </div>
    <div className="flex items-center gap-1 shrink-0">
      <button onClick={(e) => { e.stopPropagation(); setIsEditing(entry); }} className="p-2 text-gray-500 hover:text-[#4CAF50] transition-colors"><Icons.Pencil size={18} /></button>
      <button onClick={(e) => { e.stopPropagation(); copy(entry.password || entry.cardNumber || entry.phone || entry.idNumber || ''); }} className="p-2 text-gray-500 hover:text-[#4CAF50] transition-colors"><Icons.Copy size={18} /></button>
      <button 
        onClick={(e) => { e.stopPropagation(); deleteEntry(entry.id); }} 
        className={`p-2 transition-all duration-300 rounded-lg ${deleteClickCount.id === entry.id ? (deleteClickCount.count === 1 ? 'text-orange-500 scale-110 bg-orange-500/5' : 'text-red-500 scale-125 animate-pulse bg-red-500/5') : 'text-gray-500 hover:text-red-500'}`}
      >
        <Icons.Trash2 size={18} />
      </button>
    </div>
  </div>
);

const MasterPasswordModal = ({ t, isDark, onClose, setMasterPassword, masterPassword }: any) => {
  const [newMP, setNewMP] = useState('');
  const [confirmMP, setConfirmMP] = useState('');
  const [showMP, setShowMP] = useState(false);
  const [showConfirmMP, setShowConfirmMP] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+~`|}{[\]:;?><,./-]).{8,30}$/;
  const handleSubmit = async () => {
    if (!passwordRegex.test(newMP) || isProcessing) return;
    if (!isGenerated && newMP !== confirmMP) return;
    setIsProcessing(true);
    try {
      await setMasterPassword(newMP);
      setIsSuccess(true);
    } catch (err) {
      console.error("Failed to set master password:", err);
    } finally {
      setIsProcessing(false);
    }
  };
  const handleRandom = () => {
    const p = generatePassword(16);
    setNewMP(p);
    setIsGenerated(true);
    setShowMP(true);
  };
  const exportKeyFile = async () => {
    const encrypted = await SecurityService.encrypt(newMP, "SECUREPASS_INTERNAL_KEYFILE_SEED");
    const blob = new Blob([JSON.stringify(encrypted)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `master_key.vpass`;
    a.click();
    URL.revokeObjectURL(url);
    onClose();
  };
  if (isSuccess) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[120] flex items-center justify-center p-6 animate-in fade-in duration-300 text-center">
        <div className={`w-full max-sm rounded-[2.5rem] border p-8 space-y-6 shadow-2xl scale-in-center ${isDark ? 'bg-[#121212] border-white/10' : 'bg-white border-black/5'}`}>
          <div className="w-16 h-16 bg-[#4CAF50]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icons.Check className="text-[#4CAF50]" size={32}/>
          </div>
          <h2 className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>{t.success}</h2>
          <p className="text-xs text-gray-500 leading-relaxed font-medium px-4">{t.saveKeyWarning}</p>
          <div className="space-y-3 pt-4">
            <button onClick={exportKeyFile} className="w-full bg-[#4CAF50] text-white py-4 rounded-3xl font-bold uppercase tracking-widest text-xs active:scale-95 shadow-lg shadow-[#4CAF50]/20 flex items-center justify-center gap-2">
              <Icons.Download size={16}/> {t.saveKeyFile}
            </button>
            <button onClick={onClose} className={`w-full py-4 rounded-3xl font-bold uppercase tracking-widest text-[10px] border ${isDark ? 'bg-white/5 text-gray-400 border-white/5' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
              CLOSE
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[120] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className={`w-full max-w-md rounded-[2.5rem] border p-8 space-y-6 shadow-2xl scale-in-center ${isDark ? 'bg-[#121212] border-white/10' : 'bg-white border-black/5'}`}>
        <div className="flex justify-between items-center">
          <h2 className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>{t.createMasterPass}</h2>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-[#4CAF50]"><Icons.X size={24}/></button>
        </div>
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="relative">
              <input type={showMP ? "text" : "password"} placeholder={t.newMasterPass} value={newMP} onChange={e => { setNewMP(e.target.value); setIsGenerated(false); }} className={`w-full border rounded-2xl py-4 pl-12 pr-24 text-[16px] placeholder:text-[13px] outline-none transition-all ${newMP && !passwordRegex.test(newMP) ? 'border-red-500/50' : (isDark ? 'bg-[#1a1a1a] border-white/5 text-white focus:border-[#4CAF50]/40' : 'bg-gray-100 border-gray-200 text-gray-900 focus:border-[#4CAF50]/40')}`} />
              <Icons.Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700" size={16}/>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button onClick={() => setShowMP(!showMP)} className="p-2 text-gray-600 hover:text-[#4CAF50]">{showMP ? <Icons.EyeOff size={16}/> : <Icons.Eye size={16}/>}</button>
                <button onClick={handleRandom} className="p-2 text-[#4CAF50] active:rotate-180 transition-transform"><Icons.RefreshCw size={16}/></button>
              </div>
            </div>
            {newMP && !passwordRegex.test(newMP) && <p className="text-[10px] text-red-500 font-bold px-1">{t.passwordRuleError}</p>}
            {newMP && (
              <div className="px-1 pt-1">
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full transition-all duration-500" style={{ width: `${calculateStrength(newMP)}%`, backgroundColor: getStrengthColor(calculateStrength(newMP)) }} />
                </div>
              </div>
            )}
          </div>
          {!isGenerated && (
            <div className="space-y-1">
              <div className="relative">
                <input type={showConfirmMP ? "text" : "password"} placeholder={t.confirmMasterPass} value={confirmMP} onChange={e => setConfirmMP(e.target.value)} className={`w-full border rounded-2xl py-4 px-6 text-[16px] placeholder:text-[13px] outline-none transition-all ${confirmMP && newMP !== confirmMP ? 'border-red-500/50' : (isDark ? 'bg-[#1a1a1a] border-white/5 text-white focus:border-[#4CAF50]/40' : 'bg-gray-100 border-gray-200 text-gray-900 focus:border-[#4CAF50]/40')}`} />
                <button onClick={() => setShowConfirmMP(!showConfirmMP)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-[#4CAF50]">{showConfirmMP ? <Icons.EyeOff size={16}/> : <Icons.Eye size={16}/>}</button>
              </div>
              {confirmMP && newMP !== confirmMP && <p className="text-[10px] text-red-500 font-bold px-1">{t.passwordMismatch}</p>}
            </div>
          )}
          <button onClick={handleSubmit} disabled={!passwordRegex.test(newMP) || (!isGenerated && newMP !== confirmMP) || isProcessing} className="w-full bg-[#4CAF50] text-white py-4 rounded-3xl font-bold uppercase tracking-widest text-xs shadow-lg active:scale-95 disabled:opacity-30 disabled:grayscale flex items-center justify-center">
            {isProcessing ? <Icons.RefreshCw className="animate-spin" size={18}/> : t.save}
          </button>
        </div>
      </div>
    </div>
  );
};

const SettingsScreen = ({ t, isDark, settings, setSettings, handleLock, setView, setIsMasterModalOpen, masterPassword, handleImport, handleExport, setToast, subView, setSubView }: any) => {
  const [newF, setNewF] = useState('');
  const [newSub, setNewSub] = useState('');
  const [selectedRoot, setSelectedRoot] = useState('');

  const handleAddFolder = () => {
    if(!newF) return;
    setSettings({...settings, folders: [...settings.folders, newF]});
    setNewF('');
  };
  const handleDeleteFolder = (folder: string) => {
    if (confirm(`Xóa thư mục "${folder}" và tất cả thư mục con liên quan?`)) {
      const { [folder]: _, ...remainingSubs } = settings.subFolders;
      setSettings({ ...settings, folders: settings.folders.filter(f => f !== folder), subFolders: remainingSubs });
    }
  };
  const toggleBiometric = async () => {
    if (!settings.biometricEnabled) {
      if (!masterPassword) {
        setToast("Please login first to enable biometrics");
        return;
      }
      try {
        await SecurityService.enableBiometric(masterPassword);
        setSettings({ ...settings, biometricEnabled: true });
        setToast(t.biometricEnrollSuccess);
      } catch (err: any) {
        setToast(err.message === "Biometrics not supported" ? t.biometricNotAvailable : t.biometricError);
      }
    } else {
      setSettings({ ...settings, biometricEnabled: false });
      localStorage.removeItem('securepass_biometric_id');
      localStorage.removeItem('securepass_biometric_vault');
    }
  };
  const handleAddSubFolder = () => {
    if(!newSub || !selectedRoot) return;
    const currentSubs = settings.subFolders[selectedRoot] || [];
    setSettings({ ...settings, subFolders: { ...settings.subFolders, [selectedRoot]: [...currentSubs, newSub] } });
    setNewSub('');
  };
  const handleDeleteSubFolder = (root: string, sub: string) => {
    const currentSubs = settings.subFolders[root] || [];
    setSettings({ ...settings, subFolders: { ...settings.subFolders, [root]: currentSubs.filter(s => s !== sub) } });
  };
  const resetVault = () => {
    if (confirm(t.resetWarning)) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const renderMainList = () => (
    <div className="space-y-4 animate-in fade-in duration-300">
      <section className={`rounded-[2.5rem] p-8 border text-center shadow-lg transition-colors duration-500 ${isDark ? 'bg-[#161616] border-white/5' : 'bg-white border-gray-200'}`}>
        <h4 className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>{t.appTitle}</h4>
        <p className="text-[11px] text-gray-600 font-medium italic">"{t.safeQuote}"</p>
        <div className={`h-px w-full my-4 ${isDark ? 'bg-white/5' : 'bg-gray-100'}`} />
        <div className="space-y-1">
          <p className={`text-[9px] font-bold uppercase tracking-widest ${isDark ? 'text-gray-700' : 'text-gray-400'}`}>{t.version}</p>
          <p className={`text-[13px] font-bold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{t.createdBy}</p>
          <p className="text-[13px] text-[#4CAF50] font-bold">{t.contactInfo}</p>
        </div>
      </section>

      <div className={`rounded-[2.5rem] overflow-hidden border transition-colors duration-500 ${isDark ? 'bg-[#161616] border-white/5' : 'bg-white border-gray-200'}`}>
        {[
          { id: 'data', icon: <Icons.Database size={18}/>, label: t.dataManagement },
          { id: 'folders', icon: <Icons.Folder size={18}/>, label: t.foldersHeader },
          { id: 'security', icon: <Icons.Shield size={18}/>, label: t.securitySettings },
          { id: 'theme', icon: <Icons.Monitor size={18}/>, label: t.themeLabel },
          { id: 'language', icon: <Icons.Globe size={18}/>, label: t.languageLabel },
        ].map((item) => (
          <button 
            key={item.id} 
            onClick={() => setSubView(item.id)} 
            className={`w-full flex items-center justify-between p-5 border-b last:border-0 hover:bg-[#4CAF50]/5 transition-all ${isDark ? 'border-white/5' : 'border-gray-50'}`}
          >
            <div className="flex items-center gap-4">
              <div className="text-[#4CAF50]">{item.icon}</div>
              <span className={`text-sm font-bold ${isDark ? 'text-white/80' : 'text-gray-700'}`}>{item.label}</span>
            </div>
            <Icons.ChevronRight size={18} className="text-gray-600" />
          </button>
        ))}
      </div>

      <div className="space-y-3 pt-2">
        <button onClick={handleLock} className={`w-full font-black text-[10px] uppercase tracking-[0.3em] py-5 rounded-3xl border active:scale-95 transition-all ${isDark ? 'bg-white/5 text-gray-500 border-white/5' : 'bg-gray-200 text-gray-600 border-gray-300'}`}>LOG OUT / LOCK APP</button>
      </div>
    </div>
  );

  const renderSubView = () => {
    switch(subView) {
      case 'data':
        return (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <section className={`rounded-[2.5rem] p-6 border shadow-xl ${isDark ? 'bg-[#161616] border-white/5' : 'bg-white border-gray-200'}`}>
              <h3 className="text-[10px] font-black text-[#4CAF50] uppercase tracking-widest flex items-center gap-2 mb-4"><Icons.Lock size={14}/> {t.createMasterPass}</h3>
              <button onClick={() => setIsMasterModalOpen(true)} className="w-full bg-[#4CAF50] text-white py-4 rounded-2xl font-bold text-sm shadow-lg active:scale-95 flex items-center justify-center gap-2 mb-6">
                <Icons.Shield size={18}/> {t.changeMasterPass}
              </button>
              <h3 className={`text-[10px] font-black uppercase tracking-widest px-1 mb-4 ${isDark ? 'text-gray-700' : 'text-gray-400'}`}>{t.dataManagement}</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <button onClick={handleExport} className={`flex flex-col items-center justify-center p-6 border rounded-[2.5rem] hover:border-[#4CAF50]/30 transition-all ${isDark ? 'bg-black/20 border-white/5' : 'bg-white border-gray-100'}`}>
                  <Icons.Upload className="text-[#4CAF50] mb-2.5" size={24} />
                  <span className={`text-[9px] font-black uppercase tracking-[0.2em] text-center ${isDark ? 'text-white' : 'text-gray-800'}`}>{t.exportDb}</span>
                </button>
                <label className={`flex flex-col items-center justify-center p-6 border rounded-[2.5rem] hover:border-[#4CAF50]/30 transition-all cursor-pointer ${isDark ? 'bg-black/20 border-white/5' : 'bg-white border-gray-100'}`}>
                  <Icons.Download className="text-[#4CAF50] mb-2.5" size={24} />
                  <span className={`text-[9px] font-black uppercase tracking-[0.2em] text-center ${isDark ? 'text-white' : 'text-gray-800'}`}>{t.importDb}</span>
                  <input type="file" accept=".vpass" onChange={handleImport} className="hidden" />
                </label>
              </div>
              <button onClick={resetVault} className="w-full bg-red-500/5 hover:bg-red-500/10 text-red-500 font-black text-[10px] uppercase tracking-[0.3em] py-5 rounded-3xl border border-red-500/10 transition-all">{t.resetVault}</button>
            </section>
          </div>
        );
      case 'folders':
        return (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            {/* Top-level Folders Section */}
            <section className={`rounded-[2.5rem] p-6 border shadow-xl ${isDark ? 'bg-[#161616] border-white/5' : 'bg-white border-gray-200'}`}>
              <h3 className="text-[10px] font-black text-[#4CAF50] uppercase tracking-widest flex items-center gap-2 mb-4 px-1"><Icons.Folder size={14}/> {t.foldersHeader}</h3>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input value={newF} onChange={e => setNewF(e.target.value)} placeholder={t.settingsFolder} className={`flex-1 border rounded-2xl px-4 py-3 text-[16px] placeholder:text-[13px] outline-none ${isDark ? 'bg-black/30 border-white/5 text-white' : 'bg-gray-50 border-gray-200'}`} />
                  <button onClick={handleAddFolder} className="bg-[#4CAF50] p-4 rounded-2xl text-white"><Icons.Plus size={20}/></button>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {settings.folders.map(f => (
                    <div key={f} className={`flex items-center justify-between p-3 border rounded-2xl ${isDark ? 'bg-black/20 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                      <span className={`text-[11px] font-bold truncate pr-4 ${isDark ? 'text-white/70' : 'text-gray-700'}`}>{f}</span>
                      <button onClick={() => handleDeleteFolder(f)} className="p-2 text-gray-700 hover:text-red-500"><Icons.Trash2 size={16}/></button>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Sub-folders Section */}
            <section className={`rounded-[2.5rem] p-6 border shadow-xl ${isDark ? 'bg-[#161616] border-white/5' : 'bg-white border-gray-200'}`}>
              <h3 className="text-[10px] font-black text-[#4CAF50] uppercase tracking-widest flex items-center gap-2 mb-4 px-1"><Icons.Network size={14}/> {t.settingsSubFolder}</h3>
              <div className="space-y-4">
                <select 
                  value={selectedRoot} 
                  onChange={e => setSelectedRoot(e.target.value)} 
                  className={`w-full border rounded-2xl py-3 px-4 text-[15px] font-medium outline-none transition-all ${isDark ? 'bg-black/30 border-white/5 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                >
                  <option value="">-- {t.foldersHeader} --</option>
                  {settings.folders.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
                
                {selectedRoot && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-200 space-y-4">
                    <div className="flex gap-2">
                      <input 
                        value={newSub} 
                        onChange={e => setNewSub(e.target.value)} 
                        placeholder={t.settingsSubFolder} 
                        className={`flex-1 border rounded-2xl px-4 py-3 text-[16px] placeholder:text-[13px] outline-none ${isDark ? 'bg-black/30 border-white/5 text-white' : 'bg-gray-50 border-gray-200'}`} 
                      />
                      <button onClick={handleAddSubFolder} className="bg-[#4CAF50] p-4 rounded-2xl text-white"><Icons.Plus size={20}/></button>
                    </div>
                    
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {(settings.subFolders[selectedRoot] || []).map(sub => (
                        <div key={sub} className={`flex items-center justify-between p-3 border rounded-2xl ${isDark ? 'bg-black/20 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                          <span className={`text-[11px] font-bold truncate pr-4 ${isDark ? 'text-white/70' : 'text-gray-700'}`}>{sub}</span>
                          <button onClick={() => handleDeleteSubFolder(selectedRoot, sub)} className="p-2 text-gray-700 hover:text-red-500"><Icons.Trash2 size={16}/></button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        );
      case 'security':
        return (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <section className={`rounded-[2.5rem] p-6 border shadow-xl ${isDark ? 'bg-[#161616] border-white/5' : 'bg-white border-gray-200'}`}>
              <h3 className="text-[10px] font-black text-[#4CAF50] uppercase tracking-widest flex items-center gap-2 mb-6 px-1"><Icons.Shield size={14}/> {t.securitySettings}</h3>
              <div className="space-y-5">
                {[
                  { label: t.autoLock, value: settings.autoLockEnabled, toggle: () => setSettings({...settings, autoLockEnabled: !settings.autoLockEnabled}) },
                  { label: t.clearClipboard, value: settings.clearClipboardEnabled, toggle: () => setSettings({...settings, clearClipboardEnabled: !settings.clearClipboardEnabled}) },
                  { label: t.biometricUnlock, value: settings.biometricEnabled, toggle: toggleBiometric },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>{item.label}</span>
                    <button onClick={item.toggle} className={`w-12 h-6 rounded-full relative transition-all ${item.value ? 'bg-[#4CAF50]' : 'bg-gray-300'}`}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all ${item.value ? 'right-1' : 'left-1'}`}/>
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        );
      case 'theme':
        return (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <section className={`rounded-[2.5rem] p-6 border shadow-xl ${isDark ? 'bg-[#161616] border-white/5' : 'bg-white border-gray-200'}`}>
              <h4 className="text-[10px] font-black text-[#4CAF50] uppercase tracking-widest flex items-center gap-2 mb-6"><Icons.Monitor size={14}/> {t.themeLabel}</h4>
              <div className="flex flex-col gap-3">
                <button onClick={() => setSettings({...settings, theme: 'light'})} className={`w-full py-5 rounded-3xl text-[11px] font-black uppercase transition-all flex items-center justify-center gap-3 ${settings.theme === 'light' ? 'bg-[#4CAF50] text-white shadow-lg' : (isDark ? 'bg-white/5 text-gray-500' : 'bg-gray-100 text-gray-400')}`}><Icons.Eye size={16}/> {t.themeLight}</button>
                <button onClick={() => setSettings({...settings, theme: 'dark'})} className={`w-full py-5 rounded-3xl text-[11px] font-black uppercase transition-all flex items-center justify-center gap-3 ${settings.theme === 'dark' ? 'bg-[#4CAF50] text-white shadow-lg' : (isDark ? 'bg-white/5 text-gray-500' : 'bg-gray-100 text-gray-400')}`}><Icons.EyeOff size={16}/> {t.themeDark}</button>
              </div>
            </section>
          </div>
        );
      case 'language':
        return (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <section className={`rounded-[2.5rem] p-6 border shadow-xl ${isDark ? 'bg-[#161616] border-white/5' : 'bg-white border-gray-200'}`}>
              <h4 className="text-[10px] font-black text-[#4CAF50] uppercase tracking-widest flex items-center gap-2 mb-6"><Icons.Globe size={14}/> {t.languageLabel}</h4>
              <div className="flex flex-col gap-3">
                <button onClick={() => setSettings({...settings, language: 'vi'})} className={`w-full py-5 rounded-3xl text-[11px] font-black uppercase transition-all flex items-center justify-center gap-3 ${settings.language === 'vi' ? 'bg-[#4CAF50] text-white shadow-lg' : (isDark ? 'bg-white/5 text-gray-500' : 'bg-gray-100 text-gray-400')}`}>{t.langVi}</button>
                <button onClick={() => setSettings({...settings, language: 'en'})} className={`w-full py-5 rounded-3xl text-[11px] font-black uppercase transition-all flex items-center justify-center gap-3 ${settings.language === 'en' ? 'bg-[#4CAF50] text-white shadow-lg' : (isDark ? 'bg-white/5 text-gray-500' : 'bg-gray-100 text-gray-400')}`}>{t.langEn}</button>
              </div>
            </section>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <header className={`sticky top-0 z-40 h-16 border-b flex items-center px-4 justify-between backdrop-blur-xl transition-colors duration-500 ${isDark ? 'bg-[#111]/90 border-white/5' : 'bg-white/90 border-black/5'}`}>
        <button 
          onClick={() => {
            if (subView === 'main') setView('vault');
            else setSubView('main');
          }} 
          className={`p-2 transition-colors ${isDark ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-gray-900'}`}
        >
          <Icons.ChevronLeft size={24} />
        </button>
        <h2 className={`text-lg font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {subView === 'main' ? t.settingsTab : t[subView as keyof typeof t] || subView}
        </h2>
        <div className="w-10"></div>
      </header>
      <main className="flex-1 overflow-y-auto p-4 pb-32">
        <div className="max-w-xl mx-auto">
          {subView === 'main' ? renderMainList() : renderSubView()}
        </div>
      </main>
    </div>
  );
};

const EntryModal = ({ t, isDark, settings, mode, entry, onClose, onSave, copy, addType }: any) => {
  const [localData, setLocalData] = useState<any>(() => {
    if (entry) return { ...entry };
    return { 
      type: addType || 'login', group: '---', title: '', username: '', password: '', 
      cardNumber: '', cardHolder: '', cardType: '', expiryMonth: '', expiryYear: '',
      nickname: '', fullName: '', phone: '', email: '', address: '', 
      content: '', notes: '', strength: 0, pin: '', authCode: '', recoveryInfo: '', url: '', expiryInterval: '6m',
      documentType: '', atmPin: '', qrImage: '', frontImage: '', backImage: '', postCode: '', cvv: '', linkedBank: ''
    };
  });
  const [showPass, setShowPass] = useState(false);
  const [showAtmPin, setShowAtmPin] = useState(false);
  const [showCvv, setShowCvv] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [showContactQR, setShowContactQR] = useState(false);
  const [visibleFields, setVisibleFields] = useState<Record<string, boolean>>({});

  const isView = mode === 'view';
  const typeLabels: Record<string, string> = { login: t.typeLogin, card: t.typeCard, contact: t.typeContact, document: t.typeDocument };
  const currentSubFolders = settings.subFolders[localData.group] || [];
  const bankSubfolders = settings.subFolders['Ngân hàng'] || [];
  
  const isWallet = localData.type === 'card' && WALLET_LIST.includes(localData.title);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLocalData({ ...localData, [field]: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const copyableField = (label: string, field: string, value: string, type: string = "text", placeholder: string = "", validation?: (val: string) => string | null, center: boolean = false) => {
    const error = validation ? validation(value) : null;
    return (
      <div className="space-y-1.5 w-full">
        <label className={`text-[10px] font-black uppercase tracking-widest ml-1 block ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{label}</label>
        <div className="relative w-full">
          <input 
            disabled={isView} 
            type={type} 
            value={value} 
            onChange={e => setLocalData({...localData, [field]: e.target.value})} 
            className={`w-full border rounded-2xl py-3.5 pl-4 pr-12 text-[15px] font-medium focus:border-[#4CAF50]/60 outline-none transition-all disabled:opacity-80 ${center ? 'text-center' : ''} ${isDark ? 'bg-[#181818] border-white/5 text-white placeholder-gray-800' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 shadow-sm'} ${type === 'date' && !value ? (isDark ? 'text-gray-800' : 'text-gray-400') : ''} ${error ? 'border-red-500/50' : ''} [&::-webkit-calendar-picker-indicator]:opacity-40 ${isDark ? '[&::-webkit-calendar-picker-indicator]:invert' : ''}`}
            placeholder={placeholder}
          />
          <button type="button" onClick={() => copy(value)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#4CAF50] transition-colors p-1">
            <Icons.Copy size={16}/>
          </button>
        </div>
        {error && <p className="text-[9px] text-red-500 font-bold px-1 mt-0.5">{error}</p>}
      </div>
    );
  };

  const renderDocImageRow = (field: string, label: string) => (
    <div className="space-y-2 w-full">
      <div className="flex items-center justify-between px-1">
        <label className={`text-[10px] font-black uppercase tracking-widest block ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{label}</label>
        {localData[field] && (
          <button onClick={() => shareData(label, "Shared document image", localData[field])} className="text-[#4CAF50] p-1"><Icons.Share2 size={16}/></button>
        )}
      </div>
      <label className={`w-full aspect-[1.6/1] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all relative ${isDark ? 'bg-black/40 border-white/10 hover:border-[#4CAF50]/40' : 'bg-white border-gray-200 hover:border-[#4CAF50]/40 shadow-sm'}`}>
        {localData[field] ? (
          <img src={localData[field]} alt={field} className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center p-4">
            <Icons.Plus className="text-gray-500 mb-2" size={24} />
            <span className="text-[10px] text-gray-500 font-bold uppercase text-center">{label}</span>
          </div>
        )}
        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, field)} className="hidden" disabled={isView} />
      </label>
    </div>
  );

  const renderDocumentFields = () => {
    const isResidence = localData.documentType === 'residence_card';
    switch (localData.documentType) {
      case 'id_card':
      case 'residence_card':
        return (
          <div className="space-y-5 animate-in fade-in duration-300">
            {copyableField(isResidence ? 'Số' : t.idNumber, 'idNumber', localData.idNumber || "", "text", "00109000xxxx", val => val.length > 12 ? t.idNo12Warning : null)}
            {copyableField(t.fullName, 'fullName', localData.fullName || "", "text", "LÊ ĐỨC LONG", val => (val && val !== val.toUpperCase()) ? t.uppercaseWarning : null)}
            <div className="grid grid-cols-2 gap-3">
               {copyableField(t.dob, 'dob', localData.dob || "", "date")}
               <div className="space-y-1.5">
                  <label className={`text-[10px] font-black uppercase tracking-widest ml-1 block ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{t.gender}</label>
                  <select disabled={isView} value={localData.gender} onChange={e => setLocalData({...localData, gender: e.target.value})} className={`w-full border rounded-2xl py-3.5 px-4 text-[15px] font-medium outline-none transition-all ${isDark ? 'bg-[#181818] border-white/5 text-white' : 'bg-white border-gray-200 text-gray-900 shadow-sm'} ${!isView && !localData.gender ? 'text-gray-500' : ''}`}>
                    <option value="">-- {t.gender} --</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
               </div>
            </div>
            {copyableField(t.hometown, 'hometown', localData.hometown || "", "text", "Hà Tĩnh, Việt Nam")}
            {copyableField(t.residence, 'residence', localData.residence || "", "text", "P. Sông Trí, Kỳ Anh, Hà Tĩnh")}
            <div className="grid grid-cols-2 gap-3">
               {copyableField('Giá trị đến', 'expiryDate', localData.expiryDate || "", "date")}
               {copyableField(t.issueDate, 'issueDate', localData.issueDate || "", "date")}
            </div>
            {copyableField(t.issuer, 'issuer', localData.issuer || "", "text", "Cục trưởng cục cảnh sát...")}
            {renderDocImageRow('frontImage', t.frontImageBtn)}
            {renderDocImageRow('backImage', t.backImageBtn)}
          </div>
        );
      case 'health_insurance':
        return (
          <div className="space-y-5 animate-in fade-in duration-300">
            {copyableField('Số sổ', 'idNumber', localData.idNumber || "", "text", "1234567890", val => val.length > 10 ? t.idNo10Warning : null)}
            {copyableField(t.fullName, 'fullName', localData.fullName || "", "text", "NGUYỄN VĂN A", val => (val && val !== val.toUpperCase()) ? t.uppercaseWarning : null)}
            <div className="grid grid-cols-2 gap-3">
               {copyableField(t.dob, 'dob', localData.dob || "", "date")}
               <div className="space-y-1.5">
                  <label className={`text-[10px] font-black uppercase tracking-widest ml-1 block ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{t.gender}</label>
                  <select disabled={isView} value={localData.gender} onChange={e => setLocalData({...localData, gender: e.target.value})} className={`w-full border rounded-2xl py-3.5 px-4 text-[15px] font-medium outline-none transition-all ${isDark ? 'bg-[#181818] border-white/5 text-white' : 'bg-white border-gray-200 text-gray-900 shadow-sm'}`}>
                    <option value="">-- {t.gender} --</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
               </div>
            </div>
            {copyableField(t.hospital, 'hospital', localData.hospital || "", "text", "Bệnh viện Đa khoa Kỳ Anh")}
            {copyableField('Nơi cấp', 'issuer', localData.issuer || "", "text", "BHXH Tỉnh Hà Tĩnh")}
            {renderDocImageRow('frontImage', t.frontImageBtn)}
          </div>
        );
      case 'driving_license':
        return (
          <div className="space-y-5 animate-in fade-in duration-300">
            {copyableField('Số bằng lái', 'idNumber', localData.idNumber || "", "text", "12 chữ số")}
            {copyableField(t.fullName, 'fullName', localData.fullName || "", "text", "LÊ ĐỨC LONG", val => (val && val !== val.toUpperCase()) ? t.uppercaseWarning : null)}
            <div className="grid grid-cols-2 gap-3">
               {copyableField(t.dob, 'dob', localData.dob || "", "date")}
               <div className="space-y-1.5">
                  <label className={`text-[10px] font-black uppercase tracking-widest ml-1 block ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{t.class}</label>
                  <select disabled={isView} value={localData.class} onChange={e => setLocalData({...localData, class: e.target.value})} className={`w-full border rounded-2xl py-3.5 px-4 text-[15px] font-medium outline-none transition-all ${isDark ? 'bg-[#181818] border-white/5 text-white' : 'bg-white border-gray-200 text-gray-900 shadow-sm'}`}>
                    <option value="">-- Hạng --</option>
                    {['A1', 'A2', 'B1', 'B2', 'C', 'D', 'E'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
               </div>
            </div>
            {copyableField(t.residence, 'residence', localData.residence || "", "text", "Kỳ Anh, Hà Tĩnh")}
            <div className="grid grid-cols-2 gap-3">
               {copyableField('Ngày cấp', 'issueDate', localData.issueDate || "", "date")}
               {copyableField('Hết hạn', 'expiryDate', localData.expiryDate || "", "date")}
            </div>
            {copyableField('Cơ quan cấp', 'issuer', localData.issuer || "", "text", "Sở GTVT Hà Tĩnh")}
            {renderDocImageRow('frontImage', t.frontImageBtn)}
            {renderDocImageRow('backImage', t.backImageBtn)}
          </div>
        );
      case 'passport':
        return (
          <div className="space-y-5 animate-in fade-in duration-300">
            {copyableField('Số hộ chiếu', 'idNumber', localData.idNumber || "", "text", "P01234567")}
            {copyableField(t.fullName, 'fullName', localData.fullName || "", "text", "NGUYEN VAN A")}
            <div className="grid grid-cols-2 gap-3">
               {copyableField(t.dob, 'dob', localData.dob || "", "date")}
               {copyableField('Quốc tịch', 'nationality', localData.nationality || "", "text", "VIETNAMESE")}
            </div>
            <div className="grid grid-cols-2 gap-3">
               {copyableField('Ngày cấp', 'issueDate', localData.issueDate || "", "date")}
               {copyableField('Hết hạn', 'expiryDate', localData.expiryDate || "", "date")}
            </div>
            {copyableField('Nơi cấp', 'issuer', localData.issuer || "", "text", "Cục QLXNC")}
            {renderDocImageRow('frontImage', t.frontImageBtn)}
          </div>
        );
      default: return null;
    }
  };

  const renderViewRow = (label: string, value: string, isSecret: boolean = false, fieldKey?: string, hideCopy: boolean = false) => {
    if (!value || value === '---') return null;
    const isVisible = fieldKey ? !!visibleFields[fieldKey] : true;
    return (
      <div className={`p-4 border-b last:border-0 transition-all ${isDark ? 'border-white/5 hover:bg-white/5' : 'border-gray-50 hover:bg-gray-100/50'}`}>
        <div className="flex justify-between items-start">
          <div className="space-y-1.5 overflow-hidden flex-1">
            <span className={`text-[10px] font-black uppercase tracking-widest block ${isDark ? 'text-gray-700' : 'text-gray-400'}`}>{label}</span>
            <div className="flex items-center gap-2">
              <span className={`text-[15px] font-bold truncate ${isDark ? 'text-white' : 'text-gray-900'} ${isSecret && !isVisible ? 'blur-sm select-none' : ''}`}>
                {isSecret && !isVisible ? '••••••••' : value}
              </span>
              {isSecret && (
                <button 
                  onClick={() => setVisibleFields(prev => ({...prev, [fieldKey!]: !prev[fieldKey!]}))}
                  className="text-gray-500 hover:text-[#4CAF50] p-1"
                >
                  {isVisible ? <Icons.EyeOff size={14}/> : <Icons.Eye size={14}/>}
                </button>
              )}
            </div>
          </div>
          {!hideCopy && <button onClick={() => copy(value)} className="p-2 text-gray-500 hover:text-[#4CAF50] transition-colors"><Icons.Copy size={16}/></button>}
        </div>
      </div>
    );
  };

  const renderViewOnly = () => {
    return (
      <div className="max-w-md mx-auto space-y-4 animate-in fade-in duration-300 pb-12">
        <div className={`rounded-3xl border overflow-hidden shadow-lg ${isDark ? 'bg-[#181818] border-white/5' : 'bg-white border-gray-200'}`}>
          {localData.type === 'login' && (
            <>
              {renderViewRow(t.title, localData.title, false, undefined, true)}
              {renderViewRow(t.groupLabel, localData.group, false, undefined, true)}
              {renderViewRow(t.subGroupLabel, localData.subGroup, false, undefined, true)}
              {renderViewRow(t.username, localData.username)}
              {renderViewRow(t.password, localData.password, true, 'password')}
              {renderViewRow(t.pinCode, localData.pin, true, 'pin')}
              {renderViewRow(t.authCode, localData.authCode)}
              {renderViewRow(t.recoveryInfo, localData.recoveryInfo, true, 'recoveryInfo')}
              {renderViewRow(t.url, localData.url)}
              {renderViewRow(t.expiryInterval, t[localData.expiryInterval as keyof typeof t] || localData.expiryInterval, false, undefined, true)}
              {renderViewRow(t.notes, localData.notes, false, undefined, true)}
            </>
          )}

          {localData.type === 'card' && (
            <>
              {renderViewRow(t.title, localData.title, false, undefined, true)}
              {!isWallet ? (
                <>
                  {renderViewRow(t.cardNumber, localData.cardNumber)}
                  {renderViewRow(t.cardName, localData.cardHolder)}
                  {renderViewRow(t.cardType, localData.cardType, false, undefined, true)}
                  {renderViewRow(t.expiryMonth, localData.expiryMonth, false, undefined, true)}
                  {renderViewRow(t.atmPin, localData.atmPin, true, 'atmPin')}
                  {renderViewRow(t.cvv, localData.cvv, true, 'cvv')}
                </>
              ) : (
                <>
                  {renderViewRow(t.phone, localData.phone)}
                  {renderViewRow(t.password, localData.password, true, 'password')}
                  {renderViewRow(t.pinCode, localData.pin, true, 'pin')}
                  {renderViewRow(t.linkedBank, localData.linkedBank, false, undefined, true)}
                </>
              )}
              {renderViewRow(t.notes, localData.notes, false, undefined, true)}
            </>
          )}

          {localData.type === 'contact' && (
            <>
              {renderViewRow(t.nickname, localData.nickname, false, undefined, true)}
              {renderViewRow(t.fullName, localData.fullName)}
              {renderViewRow(t.phone, localData.phone)}
              {renderViewRow(t.email, localData.email)}
              {renderViewRow(t.postCode, localData.postCode)}
              {renderViewRow(t.address, localData.address)}
              {renderViewRow(t.notes, localData.notes, false, undefined, true)}
            </>
          )}

          {localData.type === 'document' && (
            <>
              {renderViewRow(t.docType, t[localData.documentType as keyof typeof t] || localData.documentType, false, undefined, true)}
              {renderViewRow(t.idNumber, localData.idNumber)}
              {renderViewRow(t.fullName, localData.fullName)}
              {renderViewRow(t.dob, localData.dob)}
              {renderViewRow(t.gender, localData.gender)}
              {renderViewRow(t.hometown, localData.hometown)}
              {renderViewRow(t.residence, localData.residence)}
              {renderViewRow(t.expiryDate, localData.expiryDate)}
              {renderViewRow(t.recognition, localData.recognition)}
              {renderViewRow(t.hospital, localData.hospital)}
              {renderViewRow(t.nationality, localData.nationality)}
              {renderViewRow(t.class, localData.class)}
              {renderViewRow(t.issuer, localData.issuer)}
              {renderViewRow(t.issueDate, localData.issueDate)}
              {renderViewRow(t.notes, localData.notes, false, undefined, true)}
            </>
          )}
        </div>

        {localData.qrImage && (
          <div className={`p-4 rounded-3xl border shadow-lg ${isDark ? 'bg-[#181818] border-white/5' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between mb-4">
              <span className={`text-[10px] font-black uppercase tracking-widest block ${isDark ? 'text-gray-700' : 'text-gray-400'}`}>
                {isWallet ? t.rechargeQr : t.qrImage}
              </span>
              <button onClick={() => shareData(isWallet ? t.rechargeQr : t.qrImage, "Shared QR Code", localData.qrImage)} className="text-[#4CAF50] p-1.5 bg-[#4CAF50]/10 rounded-xl">
                <Icons.Share2 size={16}/>
              </button>
            </div>
            <div className="bg-white p-4 rounded-2xl flex items-center justify-center">
               <img src={localData.qrImage} alt="QR" className="w-full h-48 object-contain" />
            </div>
          </div>
        )}

        {(localData.frontImage || localData.backImage) && localData.type === 'document' && (
          <div className="space-y-4">
             {localData.frontImage && (
               <div className={`p-4 rounded-3xl border shadow-lg ${isDark ? 'bg-[#181818] border-white/5' : 'bg-white border-gray-200'}`}>
                <span className={`text-[10px] font-black uppercase tracking-widest block mb-4 ${isDark ? 'text-gray-700' : 'text-gray-400'}`}>{t.frontImageBtn}</span>
                <img src={localData.frontImage} alt="Front" className="w-full rounded-2xl object-cover aspect-[1.6/1]" />
               </div>
             )}
             {localData.backImage && (
               <div className={`p-4 rounded-3xl border shadow-lg ${isDark ? 'bg-[#181818] border-white/5' : 'bg-white border-gray-200'}`}>
                <span className={`text-[10px] font-black uppercase tracking-widest block mb-4 ${isDark ? 'text-gray-700' : 'text-gray-400'}`}>{t.backImageBtn}</span>
                <img src={localData.backImage} alt="Back" className="w-full rounded-2xl object-cover aspect-[1.6/1]" />
               </div>
             )}
          </div>
        )}
      </div>
    );
  };

  const contactDataForQR = JSON.stringify({ name: localData.fullName || localData.nickname, phone: localData.phone, email: localData.email, addr: localData.address });

  const getDetailTitle = () => {
    if (!isView) return typeLabels[localData.type];
    if (localData.type === 'login') return t.detailLogin;
    if (localData.type === 'card') return t.detailCard;
    if (localData.type === 'contact') return t.detailContact;
    if (localData.type === 'document') {
      if (localData.documentType === 'id_card' || localData.documentType === 'residence_card') return "Chi tiết Thẻ Căn cước";
      if (localData.documentType === 'health_insurance') return "Chi tiết Thẻ BHYT";
      if (localData.documentType === 'driving_license') return "Chi tiết Giấy phép lái xe";
      if (localData.documentType === 'passport') return "Chi tiết Hộ chiếu";
      return t.detailDoc;
    }
    return t.detailedInfo;
  };

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col animate-in slide-in-from-bottom-5 transition-colors duration-500 ${isDark ? 'bg-[#0d0d0d]' : 'bg-[#f5f5f5]'}`}>
      <header className={`h-16 border-b flex items-center px-4 justify-between transition-colors duration-500 sticky top-0 z-[110] ${isDark ? 'bg-[#111]/95 border-white/5' : 'bg-white/95 border-black/5 shadow-sm'}`}>
        <button onClick={onClose} className="p-2 text-gray-500 hover:text-[#4CAF50]"><Icons.ChevronLeft size={24} /></button>
        <h2 className={`text-[11px] font-black uppercase tracking-widest text-center px-2 flex-1 truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {getDetailTitle()}
        </h2>
        {!isView ? (
          <button onClick={() => onSave(localData)} className="bg-[#4CAF50] text-white px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase shadow-lg shadow-[#4CAF50]/30 active:scale-95 transition-all">
            {t.save}
          </button>
        ) : (
          <div className="w-10"/>
        )}
      </header>
      <main className="flex-1 overflow-y-auto p-4 space-y-6 pb-24">
        {isView ? renderViewOnly() : (
          <div className="max-w-md mx-auto space-y-5">
            {localData.type === 'login' && (
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className={`text-[10px] font-black uppercase tracking-widest ml-1 block ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{t.title}*</label>
                  <input value={localData.title} onChange={e => setLocalData({...localData, title: e.target.value})} className={`w-full border rounded-2xl py-3.5 px-4 text-[15px] font-medium outline-none transition-all ${isDark ? 'bg-[#181818] border-white/5 text-white placeholder-gray-800' : 'bg-white border-gray-200 text-gray-900 shadow-sm placeholder-gray-400'}`} placeholder={t.loginTitleHint} />
                </div>
                <div className="space-y-1.5">
                  <label className={`text-[10px] font-black uppercase tracking-widest ml-1 block ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{t.groupLabel}</label>
                  <select value={localData.group} onChange={e => setLocalData({...localData, group: e.target.value, subGroup: ''})} className={`w-full border rounded-2xl py-3.5 px-4 text-[15px] font-medium outline-none transition-all ${isDark ? 'bg-[#181818] border-white/5 text-white' : 'bg-white border-gray-200 text-gray-900 shadow-sm'}`}>
                    <option value="---">---</option>
                    {settings.folders.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                {currentSubFolders.length > 0 && (
                  <div className="space-y-1.5">
                    <label className={`text-[10px] font-black uppercase tracking-widest ml-1 block ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{t.subGroupLabel}</label>
                    <select value={localData.subGroup} onChange={e => setLocalData({...localData, subGroup: e.target.value})} className={`w-full border rounded-2xl py-3.5 px-4 text-[15px] font-medium outline-none transition-all ${isDark ? 'bg-[#181818] border-white/5 text-white' : 'bg-white border-gray-200 text-gray-900 shadow-sm'}`}>
                      <option value="">{t.chooseSubGroup}</option>
                      {currentSubFolders.map((s: string) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                )}
                {copyableField(t.username, 'username', localData.username || "", "text", t.usernameHint)}
                <div className="space-y-1.5">
                  <label className={`text-[10px] font-black uppercase tracking-widest ml-1 block ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{t.password}</label>
                  <div className="relative">
                    <input type={showPass ? "text" : "password"} value={localData.password} onChange={e => setLocalData({...localData, password: e.target.value})} className={`w-full border rounded-2xl py-3.5 pl-4 pr-24 font-mono text-[15px] font-medium outline-none transition-all ${isDark ? 'bg-[#181818] border-white/5 text-white' : 'bg-white border-gray-200 text-gray-900 shadow-sm'}`}/>
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-2 text-gray-500">
                      <button type="button" onClick={() => setShowPass(!showPass)} className="p-1">{showPass ? <Icons.EyeOff size={16}/> : <Icons.Eye size={16}/>}</button>
                      <button type="button" onClick={() => copy(localData.password)} className="p-1"><Icons.Copy size={16}/></button>
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className={`text-[10px] font-black uppercase tracking-widest ml-1 block ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{t.expiryInterval}</label>
                  <select value={localData.expiryInterval} onChange={e => setLocalData({...localData, expiryInterval: e.target.value})} className={`w-full border rounded-2xl py-3.5 px-4 text-[15px] font-medium outline-none transition-all ${isDark ? 'bg-[#181818] border-white/5 text-white' : 'bg-white border-gray-200 text-gray-900 shadow-sm'}`}>
                    <option value="1d">{t.day}</option>
                    <option value="1m">{t.month}</option>
                    <option value="6m">{t.sixMonths}</option>
                    <option value="1y">{t.year}</option>
                  </select>
                </div>
                <div className="pt-2">
                  <button type="button" onClick={() => setAdvancedOpen(!advancedOpen)} className="flex items-center gap-2 text-[11px] font-black text-[#4CAF50] uppercase tracking-widest px-1 py-2">{advancedOpen ? <Icons.ChevronDown size={14}/> : <Icons.ChevronRight size={14}/>} {t.advancedOptions}</button>
                  {advancedOpen && (
                    <div className="mt-4 space-y-5 animate-in slide-in-from-top-2">
                      {copyableField(t.pinCode, 'pin', localData.pin || "")}
                      {copyableField(t.authCode, 'authCode', localData.authCode || "")}
                      {copyableField(t.recoveryInfo, 'recoveryInfo', localData.recoveryInfo || "")}
                      <div className="space-y-1.5">
                        <label className={`text-[10px] font-black uppercase tracking-widest ml-1 block ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{t.url}</label>
                        <div className="relative">
                          <input value={localData.url} onChange={e => setLocalData({...localData, url: e.target.value})} className={`w-full border rounded-2xl py-3.5 px-4 text-[15px] font-medium outline-none transition-all ${isDark ? 'bg-[#181818] border-white/5 text-white' : 'bg-white border-gray-200 text-gray-900 shadow-sm'}`} placeholder={t.urlHint} />
                          {localData.url && <a href={localData.url} target="_blank" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4CAF50] p-1.5"><Icons.ExternalLink size={18}/></a>}
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className={`text-[10px] font-black uppercase tracking-widest ml-1 block ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{t.notes}</label>
                        <textarea rows={4} value={localData.notes} onChange={e => setLocalData({...localData, notes: e.target.value})} className={`w-full border rounded-2xl p-4 text-[15px] font-medium resize-none outline-none transition-all ${isDark ? 'bg-[#181818] border-white/5 text-white' : 'bg-white border-gray-200 text-gray-900 shadow-sm'}`} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {localData.type === 'card' && (
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className={`text-[10px] font-black uppercase tracking-widest ml-1 block ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{t.title}</label>
                  <select value={localData.title} onChange={e => setLocalData({...localData, title: e.target.value})} className={`w-full border rounded-2xl py-3.5 px-4 text-[15px] font-medium outline-none transition-all ${isDark ? 'bg-[#181818] border-white/5 text-white' : 'bg-white border-gray-200 text-gray-900 shadow-sm'}`}>
                    <option value="">-- Ngân hàng / Ví --</option>
                    {(settings.subFolders['Ngân hàng'] || []).concat(settings.subFolders['Ví điện tử'] || []).map((b: string) => <option key={b} value={b}>{b}</option>)}
                    <option value="Khác">Khác</option>
                  </select>
                </div>

                {!isWallet ? (
                  <>
                    {copyableField(t.cardNumber, 'cardNumber', localData.cardNumber || "", "text", "0000 0000 0000 0000")}
                    {copyableField(t.cardName, 'cardHolder', localData.cardHolder || "", "text", "NGUYEN VAN A")}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className={`text-[10px] font-black uppercase tracking-widest ml-1 block ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{t.cardType}</label>
                        <select value={localData.cardType} onChange={e => setLocalData({...localData, cardType: e.target.value})} className={`w-full border rounded-2xl py-3.5 px-4 text-[15px] font-medium outline-none transition-all ${isDark ? 'bg-[#181818] border-white/5 text-white' : 'bg-white border-gray-200 text-gray-900 shadow-sm'}`}>
                          <option value="">-- {t.cardType} --</option>
                          <option value="ATM">ATM</option>
                          <option value="Visa">Visa</option>
                          <option value="Debit">Debit</option>
                          <option value="Master">Master</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className={`text-[10px] font-black uppercase tracking-widest ml-1 block ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{t.expiryMonth}</label>
                        <input value={localData.expiryMonth} onChange={e => setLocalData({...localData, expiryMonth: e.target.value})} className={`w-full border rounded-2xl py-3.5 px-4 text-[15px] font-medium outline-none transition-all text-center ${isDark ? 'bg-[#181818] border-white/5 text-white' : 'bg-white border-gray-200 text-gray-900 shadow-sm'}`} placeholder="MM/YY" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className={`text-[10px] font-black uppercase tracking-widest ml-1 block ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{t.atmPin}</label>
                      <div className="relative">
                        <input type={showAtmPin ? "text" : "password"} value={localData.atmPin} onChange={e => setLocalData({...localData, atmPin: e.target.value})} className={`w-full border rounded-2xl py-3.5 px-4 font-mono text-[15px] font-medium outline-none transition-all ${isDark ? 'bg-[#181818] border-white/5 text-white' : 'bg-white border-gray-200 text-gray-900 shadow-sm'}`}/>
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-2 text-gray-500">
                          <button type="button" onClick={() => setShowAtmPin(!showAtmPin)} className="p-1">{showAtmPin ? <Icons.EyeOff size={16}/> : <Icons.Eye size={16}/>}</button>
                          <button type="button" onClick={() => copy(localData.atmPin)} className="p-1"><Icons.Copy size={16}/></button>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {copyableField(t.phone, 'phone', localData.phone || "", "number", "09xxxxxxxx")}
                    <div className="space-y-1.5">
                      <label className={`text-[10px] font-black uppercase tracking-widest ml-1 block ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{t.password}</label>
                      <div className="relative">
                        <input type={showPass ? "text" : "password"} value={localData.password} onChange={e => setLocalData({...localData, password: e.target.value})} className={`w-full border rounded-2xl py-3.5 pl-4 pr-24 font-mono text-[15px] font-medium outline-none transition-all ${isDark ? 'bg-[#181818] border-white/5 text-white' : 'bg-white border-gray-200 text-gray-900 shadow-sm'}`}/>
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-2 text-gray-500">
                          <button type="button" onClick={() => setShowPass(!showPass)} className="p-1">{showPass ? <Icons.EyeOff size={16}/> : <Icons.Eye size={16}/>}</button>
                          <button type="button" onClick={() => copy(localData.password)} className="p-1"><Icons.Copy size={16}/></button>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className={`text-[10px] font-black uppercase tracking-widest ml-1 block ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{t.pinCode}</label>
                      <div className="relative">
                        <input type={showCvv ? "text" : "password"} value={localData.pin} onChange={e => setLocalData({...localData, pin: e.target.value})} className={`w-full border rounded-2xl py-3.5 pl-4 pr-24 font-mono text-[15px] font-medium outline-none transition-all ${isDark ? 'bg-[#181818] border-white/5 text-white' : 'bg-white border-gray-200 text-gray-900 shadow-sm'}`}/>
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-2 text-gray-500">
                          <button type="button" onClick={() => setShowCvv(!showCvv)} className="p-1">{showCvv ? <Icons.EyeOff size={16}/> : <Icons.Eye size={16}/>}</button>
                          <button type="button" onClick={() => copy(localData.pin)} className="p-1"><Icons.Copy size={16}/></button>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className={`text-[10px] font-black uppercase tracking-widest ml-1 block ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{t.linkedBank}</label>
                      <select value={localData.linkedBank} onChange={e => setLocalData({...localData, linkedBank: e.target.value})} className={`w-full border rounded-2xl py-3.5 px-4 text-[15px] font-medium outline-none transition-all ${isDark ? 'bg-[#181818] border-white/5 text-white' : 'bg-white border-gray-200 text-gray-900 shadow-sm'}`}>
                        <option value="">-- {t.linkedBank} --</option>
                        {bankSubfolders.map((b: string) => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                  </>
                )}
                {renderDocImageRow('qrImage', isWallet ? t.rechargeQr : t.qrImage)}
                <div className="space-y-1.5">
                  <label className={`text-[10px] font-black uppercase tracking-widest ml-1 block ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{t.notes}</label>
                  <textarea rows={3} value={localData.notes} onChange={e => setLocalData({...localData, notes: e.target.value})} className={`w-full border rounded-2xl p-4 text-[15px] font-medium resize-none outline-none transition-all ${isDark ? 'bg-[#181818] border-white/5 text-white' : 'bg-white border-gray-200 text-gray-900 shadow-sm'}`} />
                </div>
              </div>
            )}

            {localData.type === 'contact' && (
              <div className="space-y-5">
                {copyableField(t.nickname, 'nickname', localData.nickname || "", "text", "Anh Long")}
                {copyableField(t.fullName, 'fullName', localData.fullName || "", "text", "Nguyễn Văn A")}
                {copyableField(t.phone, 'phone', localData.phone || "", "text", "0964xxxxxx")}
                {copyableField(t.email, 'email', localData.email || "", "text", "example@gmail.com")}
                {copyableField(t.postCode, 'postCode', localData.postCode || "", "text", "100000")}
                {copyableField(t.address, 'address', localData.address || "", "text", "Hà Tĩnh")}
                <button type="button" onClick={() => setShowContactQR(!showContactQR)} className="w-full bg-[#4CAF50] text-white py-4 rounded-3xl font-bold text-[11px] uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"><Icons.Share2 size={16} /> {t.createQRCode}</button>
                {showContactQR && (
                  <div className="flex flex-col items-center p-6 bg-white rounded-[2.5rem] animate-in zoom-in-95 shadow-xl">
                    <QRCodeSVG value={contactDataForQR} size={200} />
                    <p className="text-gray-400 text-[10px] mt-4 font-bold uppercase tracking-widest">{t.scanMe}</p>
                  </div>
                )}
              </div>
            )}

            {localData.type === 'document' && (
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className={`text-[10px] font-black uppercase tracking-widest ml-1 block ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{t.docType}</label>
                  <select value={localData.documentType} onChange={e => setLocalData({...localData, documentType: e.target.value})} className={`w-full border rounded-2xl py-3.5 px-4 text-[15px] font-medium outline-none transition-all ${isDark ? 'bg-[#181818] border-white/5 text-white' : 'bg-white border-gray-200 text-gray-900 shadow-sm'}`}>
                    <option value="">-- {t.chooseDocType} --</option>
                    <option value="id_card">{t.idCard}</option>
                    <option value="health_insurance">{t.healthInsurance}</option>
                    <option value="driving_license">{t.drivingLicense}</option>
                    <option value="passport">{t.passport}</option>
                  </select>
                </div>
                <div className={`h-px w-full my-2 ${isDark ? 'bg-white/5' : 'bg-gray-100'}`} />
                {renderDocumentFields()}
                <div className="space-y-1.5 pt-2">
                  <label className={`text-[10px] font-black uppercase tracking-widest ml-1 block ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{t.notes}</label>
                  <textarea rows={3} value={localData.notes} onChange={e => setLocalData({...localData, notes: e.target.value})} className={`w-full border rounded-2xl p-4 text-[15px] font-medium resize-none outline-none transition-all ${isDark ? 'bg-[#181818] border-white/5 text-white' : 'bg-white border-gray-200 text-gray-900 shadow-sm'}`} />
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

const GeneratorScreen = ({ t, isDark, genPass, genConfig, setGenConfig, handleGenerator, copy, genHistory, showGenHistory, setShowGenHistory, setToast, onAddEntry }: any) => {
  const [showQR, setShowQR] = useState(false);
  const [genMode, setGenMode] = useState<'password' | 'wifi' | 'share'>('password');
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiSecurity, setWifiSecurity] = useState('WPA');
  const [wifiPassword, setWifiPassword] = useState('');
  const [showWifiPass, setShowWifiPass] = useState(false);
  const [shareText, setShareText] = useState('');
  const [showShareQR, setShowShareQR] = useState(false);

  const wifiValue = useMemo(() => {
    if (wifiSecurity === 'RAW') return wifiPassword;
    if (wifiSecurity === 'NONE') return `WIFI:S:${wifiSsid};T:nopass;;`;
    return `WIFI:S:${wifiSsid};T:${wifiSecurity};P:${wifiPassword};;`;
  }, [wifiSsid, wifiSecurity, wifiPassword]);

  const handleDownload = () => {
    const canvas = document.querySelector('.qr-canvas-target canvas') as HTMLCanvasElement;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `qr-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    setToast(t.success);
  };

  const handleSaveToVault = () => {
    const canvas = document.querySelector('.qr-canvas-target canvas') as HTMLCanvasElement;
    if (!canvas) return;
    const qrBase64 = canvas.toDataURL('image/png');
    
    onAddEntry({
      type: 'login',
      title: `QR Wifi: ${wifiSsid || 'Unknown'}`,
      group: 'Mạng Internet',
      qrImage: qrBase64,
      notes: t.wifiHint,
      password: wifiPassword,
      username: wifiSsid
    });
    setToast(t.success);
  };

  const handleShare = async () => {
    const canvas = document.querySelector('.qr-canvas-target canvas') as HTMLCanvasElement;
    if (!canvas) return;
    const base64 = canvas.toDataURL('image/png');
    if (genMode === 'wifi') {
      await shareData(`WiFi: ${wifiSsid}`, t.wifiHint, base64);
    } else if (genMode === 'share') {
      await shareData('SecurePass QR Share', shareText, base64);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <header className={`sticky top-0 z-40 h-16 border-b flex items-center px-6 justify-between backdrop-blur-xl transition-colors duration-500 ${isDark ? 'bg-[#111]/90 border-white/5' : 'bg-white/90 border-black/5'}`}>
        <h2 className={`text-lg font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>{t.generatorTab}</h2>
        <div className="flex items-center gap-1">
          <button onClick={() => setShowGenHistory(!showGenHistory)} className={`p-2 transition-all ${showGenHistory ? 'text-[#4CAF50]' : 'text-gray-500 hover:opacity-100'}`}><Icons.History size={22} /></button>
        </div>
      </header>
      <div className={`p-2 flex gap-1 border-b transition-colors duration-500 ${isDark ? 'bg-black/20 border-white/5' : 'bg-gray-100 border-gray-200'}`}>
        <button onClick={() => setGenMode('password')} className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${genMode === 'password' ? 'bg-[#4CAF50] text-white shadow-lg' : 'text-gray-500'}`}>{t.genModePassword}</button>
        <button onClick={() => setGenMode('wifi')} className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${genMode === 'wifi' ? 'bg-[#4CAF50] text-white shadow-lg' : 'text-gray-500'}`}>{t.genModeWifi}</button>
        <button onClick={() => setGenMode('share')} className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${genMode === 'share' ? 'bg-[#4CAF50] text-white shadow-lg' : 'text-gray-500'}`}>{t.genModeShare}</button>
      </div>
      <main className="flex-1 flex overflow-hidden">
        {showGenHistory && genMode === 'password' && (
          <aside className={`w-64 border-r overflow-y-auto p-4 hidden md:block animate-in slide-in-from-left-5 transition-colors duration-500 ${isDark ? 'border-white/5 bg-[#111]/50' : 'border-black/5 bg-white/50'}`}>
            <h3 className={`text-[10px] font-black uppercase tracking-widest mb-4 px-2 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{t.genHistory}</h3>
            <div className="space-y-1.5">
              {genHistory.map((p: string, idx: number) => (
                <button key={idx} onClick={() => copy(p)} className={`w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#4CAF50]/10 transition-all text-left group ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}><span className="font-mono text-[10px] text-[#4CAF50] truncate pr-2">{p}</span><Icons.Copy size={12} className="text-gray-600 group-hover:text-[#4CAF50]"/></button>
              ))}
            </div>
          </aside>
        )}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-32">
          {genMode === 'password' && (
            <div className="space-y-6">
              <div className="space-y-4 text-center">
                <input readOnly value={genPass} className={`w-full border rounded-3xl p-6 text-center text-xl font-mono text-[#4CAF50] tracking-wider outline-none ${isDark ? 'bg-[#1a1a1a] border-white/5' : 'bg-white border-gray-200'}`} />
                {showQR && genPass && <div className="bg-white p-6 rounded-3xl inline-block mx-auto mb-4 animate-in zoom-in-95"><QRCodeSVG value={genPass} size={180} /></div>}
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <button onClick={() => copy(genPass)} className={`flex-1 font-bold flex items-center justify-center gap-2 border active:scale-95 transition-all py-4 rounded-3xl ${isDark ? 'bg-white/5 text-white border-white/5' : 'bg-white text-gray-700 border-gray-200 shadow-sm'}`}><Icons.Copy size={18} /> {t.copyPassword}</button>
                    <button onClick={handleGenerator} className="bg-[#4CAF50] text-white p-4 rounded-3xl active:scale-95 transition-all shadow-lg shadow-[#4CAF50]/20"><Icons.RefreshCw size={24} /></button>
                  </div>
                  <button onClick={() => setShowQR(!showQR)} className={`w-full font-bold flex items-center justify-center gap-2 border active:scale-95 transition-all py-4 rounded-3xl ${showQR ? 'bg-[#4CAF50] text-white border-[#4CAF50]' : (isDark ? 'bg-white/5 text-white border-white/5' : 'bg-white text-gray-700 border-gray-200 shadow-sm')}`}><Icons.Camera size={18} /> {t.createQRCode}</button>
                </div>
              </div>
              <div className={`rounded-[2.5rem] border p-6 space-y-4 max-w-lg mx-auto shadow-lg transition-colors duration-500 ${isDark ? 'bg-[#161616] border-white/5' : 'bg-white border-gray-200'}`}>
                <div className="flex justify-between items-center"><label className="text-xs font-bold text-gray-500">{t.genLength}</label><span className="font-bold text-[#4CAF50]">{genConfig.length}</span></div>
                <input type="range" min="4" max="64" value={genConfig.length} onChange={e => setGenConfig({...genConfig, length: parseInt(e.target.value)})} className="w-full accent-[#4CAF50]" />
                {[{ id: 'useAZ', label: t.genAZ }, { id: 'useaz', label: t.genaz }, { id: 'use09', label: t.gen09 }, { id: 'useSpec', label: t.genSpec }].map(opt => (
                  <div key={opt.id} className="flex items-center justify-between">
                    <span className={`text-xs ${isDark ? 'text-white' : 'text-gray-800'}`}>{opt.label}</span>
                    <button onClick={() => setGenConfig({...genConfig, [opt.id]: !(genConfig as any)[opt.id]})} className={`w-12 h-6 rounded-full relative transition-all ${ (genConfig as any)[opt.id] ? 'bg-[#4CAF50]' : 'bg-gray-300'}`}><div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${(genConfig as any)[opt.id] ? 'right-1' : 'left-1'}`} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {genMode === 'wifi' && (
            <div className="space-y-6 max-w-lg mx-auto">
              <div className="flex flex-col items-center bg-white p-6 rounded-[2.5rem] shadow-xl space-y-4 qr-canvas-target">
                 <QRCodeCanvas value={wifiValue} size={220} includeMargin={true} level="H" />
                 <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">{wifiSsid || 'WiFi Name'}</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className={`text-[10px] font-black uppercase tracking-widest ml-1 block ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{t.wifiSsid}</label>
                  <input value={wifiSsid} onChange={e => setWifiSsid(e.target.value)} className={`w-full border rounded-2xl py-3.5 px-4 text-[15px] font-medium focus:border-[#4CAF50]/60 outline-none ${isDark ? 'bg-[#181818] border-white/5 text-white placeholder-gray-800' : 'bg-white border-gray-200 text-gray-900 shadow-sm placeholder-gray-400'}`} placeholder="WiFi Name" />
                </div>
                <div className="space-y-1.5">
                  <label className={`text-[10px] font-black uppercase tracking-widest ml-1 block ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{t.wifiSecurity}</label>
                  <select value={wifiSecurity} onChange={e => setWifiSecurity(e.target.value)} className={`w-full border rounded-2xl py-3.5 px-4 text-[15px] font-medium outline-none transition-all ${isDark ? 'bg-[#181818] border-white/5 text-white' : 'bg-white border-gray-200 text-gray-900 shadow-sm'}`}>
                    <option value="WPA">WPA/WPA2</option>
                    <option value="WPA3">WPA3</option>
                    <option value="WEP">WEP</option>
                    <option value="NONE">NONE</option>
                    <option value="RAW">RAW (Text Only)</option>
                  </select>
                </div>
                {wifiSecurity !== 'NONE' && (
                  <div className="space-y-1.5">
                    <label className={`text-[10px] font-black uppercase tracking-widest ml-1 block ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{t.wifiPassword}</label>
                    <div className="relative">
                      <input type={showWifiPass ? "text" : "password"} value={wifiPassword} onChange={e => setWifiPassword(e.target.value)} className={`w-full border rounded-2xl py-3.5 px-4 font-mono text-[15px] font-medium outline-none transition-all ${isDark ? 'bg-[#181818] border-white/5 text-white' : 'bg-white border-gray-200 text-gray-900 shadow-sm'}`}/>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 text-gray-500">
                        <button type="button" onClick={() => setShowWifiPass(!showWifiPass)} className="p-1.5">{showWifiPass ? <Icons.EyeOff size={18}/> : <Icons.Eye size={18}/>}</button>
                        <button type="button" onClick={() => copy(wifiPassword)} className="p-1.5"><Icons.Copy size={18}/></button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-3 pt-4">
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={handleDownload} className="bg-[#4CAF50] text-white py-4 rounded-3xl font-bold text-[11px] uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"><Icons.Download size={18} /> {t.downloadQr}</button>
                  <button onClick={handleSaveToVault} className={`py-4 rounded-3xl font-bold text-[11px] uppercase tracking-widest border flex items-center justify-center gap-2 active:scale-95 transition-all ${isDark ? 'bg-white/5 border-white/10 text-[#4CAF50]' : 'bg-white border-gray-200 text-[#4CAF50] shadow-sm'}`}><Icons.Save size={18} /> {t.saveToVault}</button>
                </div>
                <button onClick={handleShare} className={`w-full py-4 rounded-3xl font-bold text-[11px] uppercase tracking-widest border flex items-center justify-center gap-2 active:scale-95 transition-all ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-700 shadow-sm'}`}><Icons.Share2 size={18} /> {t.shareQr}</button>
              </div>
            </div>
          )}

          {genMode === 'share' && (
            <div className="space-y-6 max-w-lg mx-auto">
              <div className="flex items-start gap-3 px-1">
                <Icons.Lightbulb className="text-[#4CAF50] shrink-0" size={18} />
                <p className={`text-[13px] leading-relaxed font-normal italic ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {t.shareQrInstruction}
                </p>
              </div>
              
              <div className="space-y-1.5">
                <label className={`text-[10px] font-black uppercase tracking-widest ml-1 block ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{t.content}</label>
                <div className="relative">
                  <textarea 
                    rows={5}
                    value={shareText} 
                    onChange={e => { setShareText(e.target.value); setShowShareQR(false); }} 
                    className={`w-full border rounded-[2rem] p-5 text-[15px] font-medium resize-none outline-none focus:border-[#4CAF50]/60 transition-all ${isDark ? 'bg-[#181818] border-white/5 text-white placeholder-gray-800' : 'bg-white border-gray-200 text-gray-900 shadow-sm placeholder-gray-400'}`} 
                    placeholder={t.shareQrPlaceholder}
                  />
                  <button type="button" onClick={() => copy(shareText)} className="absolute right-4 bottom-4 text-gray-500 hover:text-[#4CAF50] p-2 bg-black/5 rounded-xl">
                    <Icons.Copy size={18}/>
                  </button>
                </div>
              </div>

              {showShareQR && shareText && (
                <div className="flex flex-col items-center bg-white p-6 rounded-[2.5rem] shadow-xl space-y-4 qr-canvas-target animate-in zoom-in-95">
                  <QRCodeCanvas value={shareText} size={200} includeMargin={true} level="H" />
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest truncate max-w-full px-4">{shareText.substring(0, 30)}...</p>
                </div>
              )}

              <div className="space-y-3 pt-4">
                <button 
                  onClick={() => setShowShareQR(true)} 
                  disabled={!shareText}
                  className={`w-full bg-[#4CAF50] text-white py-4 rounded-3xl font-bold text-[11px] uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-30`}
                >
                  <Icons.Camera size={18} /> {t.createQRCode}
                </button>
                
                {showShareQR && (
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={handleDownload} className={`py-4 rounded-3xl font-bold text-[11px] uppercase tracking-widest border flex items-center justify-center gap-2 active:scale-95 transition-all ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-700 shadow-sm'}`}>
                      <Icons.Download size={18} /> {t.downloadQr}
                    </button>
                    <button onClick={handleShare} className={`py-4 rounded-3xl font-bold text-[11px] uppercase tracking-widest border flex items-center justify-center gap-2 active:scale-95 transition-all ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-700 shadow-sm'}`}>
                      <Icons.Share2 size={18} /> {t.shareQr}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      {showGenHistory && genMode === 'password' && (
        <div className="md:hidden fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-6" onClick={() => setShowGenHistory(false)}>
          <div className={`w-full max-sm rounded-[2.5rem] p-6 border shadow-2xl scale-in-center transition-colors duration-500 ${isDark ? 'bg-[#121212] border-white/10' : 'bg-white border-black/5'}`} onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6 px-1"><h3 className={`font-black uppercase text-[11px] tracking-widest ${isDark ? 'text-white' : 'text-gray-900'}`}>{t.genHistory}</h3><button onClick={() => setShowGenHistory(false)}><Icons.X size={22} className="text-gray-500 hover:text-[#4CAF50]"/></button></div>
            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
              {genHistory.map((p: string, idx: number) => (
                <div key={idx} className={`flex items-center justify-between p-4 rounded-2xl transition-all ${isDark ? 'bg-white/5' : 'bg-gray-50 shadow-sm'}`}><span className="font-mono text-xs text-[#4CAF50] truncate pr-4">{p}</span><button onClick={() => copy(p)} className="text-gray-500 hover:text-[#4CAF50] transition-all p-1"><Icons.Copy size={16} /></button></div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
