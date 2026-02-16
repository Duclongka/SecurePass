
import React, { useState, useEffect, useMemo, useRef } from 'react';
import * as Icons from './components/Icons';
import { PasswordEntry, AppView, SettingsState, EntryType } from './types';
import { generatePassword, calculateStrength, getStrengthColor } from './utils/passwordUtils';
import { AdvancedSecurityService } from './services/AdvancedSecurityService';
import { QRCodeCanvas } from 'qrcode.react';

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
    titleHint: 'e.g. Vietcombank, Techcombank...',
    loginTitleHint: 'Facebook, Gmail, Camera account...',
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
    expiryMonth: 'Expiry (MM/YY)',
    nickname: 'Nickname',
    nicknameHint: 'Long Thanh, Giang coi...',
    fullName: 'Full Name',
    fullNameHint: 'Nguyen Van A...',
    phone: 'Phone Number',
    email: 'Email',
    address: 'Address',
    addressHint: 'Street, District, City',
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
    wrongPassword: 'Incorrect Master Password or Key File',
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
    chooseCardType: '-Choose Bank/Card-',
    chooseGender: '-- Choose Gender --',
    chooseClass: '-- Choose Class --',
    themeLabel: 'Appearance',
    themeDark: 'Dark Mode',
    themeLight: 'Light Mode',
    langEn: 'English',
    langVi: 'Vietnamese',
    createQRCode: 'Create QR Code',
    atmPin: 'ATM PIN',
    cvv: 'PIN/CVV/CVC',
    qrImage: 'Account QR Image',
    frontImage: 'Front Side Image',
    backImage: 'Back Side Image',
    postCode: 'Post Code',
    frontImageBtn: 'Front Image',
    backImageBtn: 'Back Image',
    biometricNotAvailable: 'Biometrics not available on this device',
    biometricEnrollSuccess: 'Biometric identification linked successfully!',
    biometricError: 'Biometric error. Please use key file.',
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
    shareQrInstruction: 'Enter content to share via QR code conveniently.',
    shareQrPlaceholder: 'Enter content to share...',
    vaultCorrupted: 'Vault data appears to be incompatible or corrupted.',
    linkedBank: 'Linked Bank',
    rechargeQr: 'Recharge QR Code',
    setupBiometrics: 'Setup Biometrics',
    setupBiometricsDesc: 'Enable biometrics for faster access on this device.',
    keyFileMissing: 'Key file required',
    keyFileLoaded: 'Key file loaded',
    fallbackSuccess: 'Device recognized - Password restored',
    newDeviceDetected: 'New device! Please enter master password.'
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
    username: 'Tên đăng nhập',
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
    expiryMonth: 'Hạn dùng (MM/YY)',
    nickname: 'Tên thường gọi',
    nicknameHint: 'Long Thanh, Giang còi...',
    fullName: 'Tên đầy đủ',
    fullNameHint: 'Nguyễn Văn A...',
    phone: 'Số điện thoại',
    email: 'Email',
    address: 'Địa chỉ',
    addressHint: 'Thôn, Phường, Thành phố...',
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
    saveKeyWarning: 'Ghi nhớ mật khẩu đã tạo hoặc lưu file mật khẩu chủ nơi an toàn. Nếu không sẽ không thể vào được app.',
    wrongPassword: 'Mật khẩu chính hoặc File khóa không chính xác',
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
    chooseCardType: '-Chọn Ngân hàng-',
    chooseGender: '-- Chọn giới tính --',
    chooseClass: '-- Chọn hạng --',
    themeLabel: 'Giao diện',
    themeDark: 'Chế độ tối',
    themeLight: 'Chế độ sáng',
    langEn: 'Tiếng Anh',
    langVi: 'Tiếng Việt',
    createQRCode: 'Tạo QR Code',
    atmPin: 'Mã PIN rút tiền',
    cvv: 'Mã PIN / CVV / CVC',
    qrImage: 'Ảnh mã QR tài khoản',
    frontImage: 'Ảnh mặt trước',
    backImage: 'Ảnh mặt sau',
    postCode: 'Mã bưu điện (Post code)',
    frontImageBtn: 'Ảnh mặt trước',
    backImageBtn: 'Ảnh mặt sau',
    biometricNotAvailable: 'Thiết bị không hỗ trợ sinh trắc học',
    biometricEnrollSuccess: 'Đã liên kết nhận diện sinh trắc học!',
    biometricError: 'Lỗi sinh trắc học. Hãy dùng file khóa.',
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
    shareQrInstruction: 'Hãy viết nội dung bạn muốn chia sẻ nhanh và nhấn nút "Tạo mã QR" để chia sẻ một cách nhanh chóng, tiện lợi.',
    shareQrPlaceholder: 'Nhập nội dung cần chia sẻ...',
    vaultCorrupted: 'Dữ liệu kho có vẻ không tương thích hoặc bị lỗi.',
    linkedBank: 'Liên kết tới ngân hàng',
    rechargeQr: 'Ảnh mã QR nạp tiền',
    setupBiometrics: 'Thiết lập Sinh trắc học',
    setupBiometricsDesc: 'Bật sinh trắc học để truy cập nhanh hơn trên thiết bị này.',
    keyFileMissing: 'Yêu cầu file khóa',
    keyFileLoaded: 'Đã tải file khóa',
    fallbackSuccess: 'Nhận diện thiết bị - Mật khẩu đã được khôi phục',
    newDeviceDetected: 'Thiết bị mới! Vui lòng nhập mật khẩu chủ.'
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
  const [isBiometricPromptOpen, setIsBiometricPromptOpen] = useState(false);
  const [lastVaultTap, setLastVaultTap] = useState(0);

  const [keyFileData, setKeyFileData] = useState<any>(null);
  const [keyFileName, setKeyFileName] = useState<string | null>(null);
  const [isKeyFileMatched, setIsKeyFileMatched] = useState(false);

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
      hasMasterPassword: !!localStorage.getItem('securepass_device_token')
    };
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  });

  const isDark = settings.theme === 'dark';
  const t = translations[settings.language];

  useEffect(() => {
    if (isLocked && settings.biometricEnabled) {
      setTimeout(() => { handleBiometricLogin(); }, 800);
    }
  }, []);

  useEffect(() => {
    if (isLocked || !settings.autoLockEnabled) {
      if (autoLockTimer.current) clearTimeout(autoLockTimer.current);
      return;
    }
    const resetTimer = () => {
      if (autoLockTimer.current) clearTimeout(autoLockTimer.current);
      autoLockTimer.current = window.setTimeout(() => { handleLock(); }, settings.autoLockMinutes * 60000);
    };
    resetTimer();
    const activityEvents = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
    activityEvents.forEach(name => document.addEventListener(name, resetTimer));
    return () => {
      if (autoLockTimer.current) clearTimeout(autoLockTimer.current);
      activityEvents.forEach(name => document.removeEventListener(name, resetTimer));
    };
  }, [isLocked, settings.autoLockEnabled, settings.autoLockMinutes]);

  useEffect(() => { localStorage.setItem('securepass_settings', JSON.stringify(settings)); }, [settings]);
  useEffect(() => { if (toast) { const timer = setTimeout(() => setToast(null), 2000); return () => clearTimeout(timer); } }, [toast]);

  const handleLock = () => { setIsLocked(true); setEntries([]); setMasterPassword(''); setView('login'); setSettingsSubView('main'); setIsKeyFileMatched(false); };

  const handleLogin = async (e?: React.FormEvent, providedPass?: string, providedKeyFile?: any) => {
    e?.preventDefault();
    const keyFileToUse = providedKeyFile || keyFileData;
    if (!keyFileToUse) { setToast(t.keyFileMissing); return; }

    const deviceId = AdvancedSecurityService.generateDeviceId();
    const isSameDevice = keyFileToUse.deviceToken === deviceId;
    let actualPass = providedPass || masterPassword;

    if (!actualPass && isSameDevice) {
      const fallbackEnc = localStorage.getItem('securepass_fallback_pass');
      if (fallbackEnc) {
        try {
          actualPass = await AdvancedSecurityService.decryptPasswordForFallback(fallbackEnc, keyFileToUse);
          setToast(t.fallbackSuccess);
        } catch (err) { }
      }
    }

    if (!actualPass) {
      if (isSameDevice) setToast(t.masterPassword + " " + (settings.language === 'vi' ? 'là bắt buộc' : 'is required'));
      else setToast(t.newDeviceDetected);
      return;
    }

    const isVerified = await AdvancedSecurityService.verifyPasswordWithKeyFile(actualPass, keyFileToUse);
    if (!isVerified) { setToast(t.wrongPassword); return; }

    try {
      const encryptedVault = localStorage.getItem('securepass_vault');
      let decryptedEntries: PasswordEntry[] = [];
      if (encryptedVault) {
        try { const decrypted = await AdvancedSecurityService.decryptVault(encryptedVault, actualPass, keyFileToUse.salt); decryptedEntries = JSON.parse(decrypted); }
        catch (err: any) { setToast(t.vaultCorrupted); return; }
      }
      setEntries(decryptedEntries); setIsLocked(false); setView('vault'); setMasterPassword(actualPass); setKeyFileData(keyFileToUse);
      if (!localStorage.getItem('securepass_fallback_pass')) {
        const fallbackEnc = await AdvancedSecurityService.encryptPasswordForFallback(actualPass, keyFileToUse);
        localStorage.setItem('securepass_fallback_pass', fallbackEnc);
      }
      if (!settings.biometricEnabled) { setIsBiometricPromptOpen(true); }
    } catch (err) { setToast(t.wrongPassword); }
  };

  const handleBiometricLogin = async () => {
    try {
      const bioId = localStorage.getItem('securepass_biometric_id');
      const bioVault = localStorage.getItem('securepass_biometric_vault');
      if (!bioId || !bioVault) { if (keyFileData) { handleLogin(undefined, undefined, keyFileData); } return; }
      const challenge = window.crypto.getRandomValues(new Uint8Array(32));
      const rawId = Uint8Array.from(atob(bioId.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
      const assertion = await navigator.credentials.get({ publicKey: { challenge, allowCredentials: [{ id: rawId, type: 'public-key' }], userVerification: "required" } });
      if (assertion) {
        const decryptedPass = await AdvancedSecurityService.decryptVault(bioVault, "INTERNAL_BIO_KEY", "INTERNAL_BIO_SALT");
        if (keyFileData) { handleLogin(undefined, decryptedPass, keyFileData); } else { setToast(t.keyFileMissing); }
      }
    } catch (err: any) { if (err.name !== 'NotAllowedError' && err.name !== 'AbortError') { if (keyFileData) handleLogin(undefined, undefined, keyFileData); else setToast(t.biometricError); } }
  };

  const handleKeyFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return; setKeyFileName(file.name);
    const reader = new FileReader(); reader.onload = (event) => {
      try {
        const content = JSON.parse(event.target?.result as string);
        if (content.type !== 'MASTER_KEY_FILE') throw new Error();
        setKeyFileData(content); setToast(t.keyFileLoaded);
        const deviceId = AdvancedSecurityService.generateDeviceId();
        if (content.deviceToken === deviceId) { setIsKeyFileMatched(true); handleLogin(undefined, undefined, content); } else { setIsKeyFileMatched(false); }
      } catch { setToast('File không hợp lệ'); setKeyFileName(null); setKeyFileData(null); setIsKeyFileMatched(false); }
    }; reader.readAsText(file);
  };

  const saveVault = async (updated: PasswordEntry[]) => {
    if (!masterPassword || !keyFileData) return;
    try { const encrypted = await AdvancedSecurityService.encryptVault(JSON.stringify(updated), masterPassword, keyFileData.salt); localStorage.setItem('securepass_vault', encrypted); }
    catch (err) { setToast("Lỗi lưu trữ: Dữ liệu quá lớn hoặc bộ nhớ đầy"); }
  };

  const handleMasterPasswordSetup = async (newPassword: string) => {
    const keyFileJson = await AdvancedSecurityService.generateKeyFile(newPassword);
    const keyFileObj = JSON.parse(keyFileJson);
    localStorage.setItem('securepass_device_token', keyFileObj.deviceToken);
    const fallbackEnc = await AdvancedSecurityService.encryptPasswordForFallback(newPassword, keyFileObj);
    localStorage.setItem('securepass_fallback_pass', fallbackEnc);
    if (!isLocked) { const encrypted = await AdvancedSecurityService.encryptVault(JSON.stringify(entries), newPassword, keyFileObj.salt); localStorage.setItem('securepass_vault', encrypted); }
    setMasterPassword(newPassword); setKeyFileData(keyFileObj); setSettings(prev => ({ ...prev, hasMasterPassword: true })); return keyFileJson;
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader(); reader.onload = (event) => {
      try {
        const content = event.target?.result as string; const parsed = JSON.parse(content); if (!parsed.data || !parsed.hmac) throw new Error();
        localStorage.setItem('securepass_vault', content); setToast('Đã nhập dữ liệu. Vui lòng mở khóa lại bằng đúng Pass/Key cũ.'); handleLock();
      } catch (err) { alert('File dữ liệu không hợp lệ'); }
    }; reader.readAsText(file);
  };

  const handleExport = () => {
    const data = localStorage.getItem('securepass_vault'); if (!data) { alert('Chưa có dữ liệu để xuất'); return; }
    const blob = new Blob([data], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a');
    const now = new Date(); const dateStr = `${now.getDate().toString().padStart(2, '0')}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getFullYear()}`;
    a.href = url; a.download = `Data_SecurePass_${dateStr}.vpass`; a.click(); URL.revokeObjectURL(url); setToast('Đã sao lưu cơ sở dữ liệu');
  };

  const copy = (text: string) => {
    if (!text) return; navigator.clipboard.writeText(text); setToast(t.copySuccess);
    if (settings.clearClipboardEnabled) {
      if (clipboardTimer.current) clearTimeout(clipboardTimer.current);
      clipboardTimer.current = window.setTimeout(() => { navigator.clipboard.writeText(''); setToast('Đã xóa bộ nhớ đệm'); }, settings.clearClipboardSeconds * 1000);
    }
  };

  const deleteEntry = (id: string) => {
    if (deleteClickCount.id === id && deleteClickCount.count >= 2) { const updated = entries.filter(e => e.id !== id); setEntries(updated); saveVault(updated); setDeleteClickCount({ id: '', count: 0 }); setSelectedEntry(null); }
    else if (deleteClickCount.id === id) { setDeleteClickCount({ id, count: deleteClickCount.count + 1 }); setToast(t.deleteConfirm); }
    else { setDeleteClickCount({ id, count: 1 }); setToast(t.deleteConfirm); }
  };

  const handleGenerator = () => { const p = generatePassword(genConfig.length, genConfig); setGenPass(p); setGenHistory(prev => [p, ...prev].slice(0, 10)); };

  const onAddEntry = (data: any) => {
    const n: PasswordEntry = { ...data, id: Math.random().toString(36).substring(2, 9), createdAt: Date.now(), strength: calculateStrength(data.password || ''), isFrequent: true };
    const updated = [n, ...entries]; setEntries(updated); saveVault(updated); setIsAdding(null);
  };

  const onEditEntry = (data: any) => {
    const updated = entries.map(e => e.id === data.id ? { ...data, strength: calculateStrength(data.password || '') } : e);
    setEntries(updated); saveVault(updated); setIsEditing(null);
  };

  const handleSwipeBack = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].screenX; const diff = touchEndX - touchStartX.current;
    if (diff > 80) { if (selectedEntry || isAdding || isEditing) { setSelectedEntry(null); setIsAdding(null); setIsEditing(null); } else if (view === 'settings' && settingsSubView !== 'main') { setSettingsSubView('main'); } else if (view !== 'vault' && !isLocked) { setView('vault'); } }
  };

  const handleVaultTabClick = () => {
    const now = Date.now();
    if (now - lastVaultTap < 300) { setActiveCategory(null); setSearchQuery(''); const main = document.querySelector('main'); if (main) main.scrollTo({ top: 0, behavior: 'smooth' }); }
    else { setView('vault'); }
    setLastVaultTap(now);
  };

  const toggleBiometric = async () => {
    if (!settings.biometricEnabled) {
      if (!masterPassword) { setToast("Please login first to enable biometrics"); return; }
      try {
        const challenge = window.crypto.getRandomValues(new Uint8Array(32)); const userId = window.crypto.getRandomValues(new Uint8Array(16));
        const credential = await navigator.credentials.create({ publicKey: { challenge, rp: { name: "SecurePass" }, user: { id: userId, name: "user", displayName: "User" }, pubKeyCredParams: [{ alg: -7, type: "public-key" }], authenticatorSelection: { authenticatorAttachment: "platform", userVerification: "required" }, timeout: 60000 } }) as PublicKeyCredential;
        if (credential) {
          const encryptedPass = await AdvancedSecurityService.encryptVault(masterPassword, "INTERNAL_BIO_KEY", "INTERNAL_BIO_SALT");
          localStorage.setItem('securepass_biometric_id', credential.id); localStorage.setItem('securepass_biometric_vault', encryptedPass);
          setSettings({ ...settings, biometricEnabled: true }); setToast(t.biometricEnrollSuccess);
        }
      } catch (err: any) { setToast(t.biometricNotAvailable); }
    } else { setSettings({ ...settings, biometricEnabled: false }); localStorage.removeItem('securepass_biometric_id'); localStorage.removeItem('securepass_biometric_vault'); }
  };

  return (
    <div className={`h-full flex flex-col overflow-hidden transition-colors duration-500 ${isDark ? 'bg-[#0d0d0d] text-[#E0E0E0]' : 'bg-[#f5f5f5] text-[#1a1a1a]'}`} onTouchStart={(e) => { touchStartX.current = e.touches[0].screenX; }} onTouchEnd={handleSwipeBack}>
      {isLocked ? (
        <LoginScreen t={t} isDark={isDark} masterPassword={masterPassword} setMasterPassword={setMasterPassword} handleLogin={handleLogin} handleBiometricLogin={handleBiometricLogin} handleKeyFileSelect={handleKeyFileSelect} keyFileName={keyFileName} setIsMasterModalOpen={setIsMasterModalOpen} isKeyFileMatched={isKeyFileMatched} />
      ) : (
        <div className="flex-1 flex flex-col relative overflow-hidden">
          {view === 'vault' && ( <VaultScreen t={t} isDark={isDark} entries={entries} searchQuery={searchQuery} setSearchQuery={setSearchQuery} activeCategory={activeCategory} setActiveCategory={setActiveCategory} setSelectedEntry={setSelectedEntry} setIsEditing={setIsEditing} copy={copy} deleteEntry={deleteEntry} deleteClickCount={deleteClickCount} settings={settings} setView={setView} /> )}
          {view === 'generator' && ( <GeneratorScreen t={t} isDark={isDark} genPass={genPass} genConfig={genConfig} setGenConfig={setGenConfig} handleGenerator={handleGenerator} copy={copy} genHistory={genHistory} showGenHistory={showGenHistory} setShowGenHistory={setShowGenHistory} setToast={setToast} onAddEntry={onAddEntry} /> )}
          {view === 'settings' && ( <SettingsScreen t={t} isDark={isDark} settings={settings} setSettings={setSettings} handleLock={handleLock} setView={setView} setIsMasterModalOpen={setIsMasterModalOpen} masterPassword={masterPassword} handleImport={handleImport} handleExport={handleExport} setToast={setToast} subView={settingsSubView} setSubView={setSettingsSubView} toggleBiometric={toggleBiometric} /> )}
          {showPlusMenu && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-[60] flex items-center justify-center p-6" onClick={() => setShowPlusMenu(false)}>
              <div className="space-y-3 flex flex-col items-center animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                {['login', 'card', 'document', 'contact'].map((type) => (
                  <button key={type} onClick={() => { setIsAdding(type as EntryType); setShowPlusMenu(false); }} className="w-64 bg-[#4CAF50] text-white px-6 py-5 rounded-3xl font-bold shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all">
                    {type === 'login' ? <Icons.User size={20} /> : type === 'card' ? <Icons.CreditCard size={20} /> : type === 'document' ? <Icons.FileText size={20} /> : <Icons.Smartphone size={20} />}
                    {t[`add${type.charAt(0).toUpperCase() + type.slice(1)}` as keyof typeof t] || type}
                  </button>
                ))}
                <button onClick={() => setShowPlusMenu(false)} className={`mt-6 w-14 h-14 ${isDark ? 'bg-white/10' : 'bg-black/10'} rounded-full flex items-center justify-center ${isDark ? 'text-white' : 'text-black'} active:scale-90 transition-all shadow-lg`}> <Icons.X size={28} /> </button>
              </div>
            </div>
          )}
          <nav className={`h-16 border-t flex items-center justify-around px-4 sticky bottom-0 z-[70] pb-safe transition-colors duration-500 ${isDark ? 'bg-[#111] border-white/5' : 'bg-white border-black/5'}`}>
            <button onClick={handleVaultTabClick} className={`flex flex-col items-center p-3 transition-colors ${view === 'vault' ? 'text-[#4CAF50]' : (isDark ? 'text-gray-700' : 'text-gray-400')}`}> <Icons.Database size={24} /> </button>
            <div className="relative">
               <button onClick={() => setShowPlusMenu(!showPlusMenu)} className={`w-16 h-16 bg-[#4CAF50] rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-[#4CAF50]/20 -translate-y-6 active:scale-90 transition-all border-4 ${isDark ? 'border-[#0d0d0d]' : 'border-[#f5f5f5]'}`}> <Icons.Plus size={32} className={`transition-transform duration-300 ${showPlusMenu ? 'rotate-45' : ''}`} /> </button>
            </div>
            <button onClick={() => { setView('generator'); if(!genPass) handleGenerator(); }} className={`flex flex-col items-center p-3 transition-colors ${view === 'generator' ? 'text-[#4CAF50]' : (isDark ? 'text-gray-700' : 'text-gray-400')}`}> <Icons.RefreshCw size={24} /> </button>
          </nav>
          {(isAdding || isEditing || selectedEntry) && ( <EntryModal t={t} isDark={isDark} settings={settings} mode={isEditing ? 'edit' : isAdding ? 'add' : 'view'} entry={isEditing || selectedEntry || undefined} addType={isAdding || undefined} onClose={() => { setIsAdding(null); setIsEditing(null); setSelectedEntry(null); }} onSave={isAdding ? onAddEntry : onEditEntry} copy={copy} /> )}
        </div>
      )}
      {isMasterModalOpen && ( <MasterPasswordModal t={t} isDark={isDark} onClose={() => setIsMasterModalOpen(false)} handleMasterPasswordSetup={handleMasterPasswordSetup} masterPassword={masterPassword} /> )}
      {isBiometricPromptOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[130] flex items-center justify-center p-6">
          <div className={`w-full max-sm rounded-[2.5rem] p-8 border text-center shadow-2xl transition-colors ${isDark ? 'bg-[#121212] border-white/10' : 'bg-white border-black/5'}`}>
             <Icons.Fingerprint className="text-[#4CAF50] mx-auto mb-4" size={48} />
             <h3 className={`text-xl font-black mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{t.setupBiometrics}</h3>
             <p className="text-xs text-gray-500 mb-6">{t.setupBiometricsDesc}</p>
             <div className="space-y-3">
               <button onClick={() => { toggleBiometric(); setIsBiometricPromptOpen(false); }} className="w-full bg-[#4CAF50] text-white py-4 rounded-3xl font-bold uppercase tracking-widest text-xs active:scale-95">{t.save}</button>
               <button onClick={() => setIsBiometricPromptOpen(false)} className="w-full text-gray-500 text-[10px] font-bold uppercase tracking-widest">{t.cancel}</button>
             </div>
          </div>
        </div>
      )}
      {toast && ( <div className="fixed top-12 left-1/2 -translate-x-1/2 bg-[#4CAF50] text-white px-6 py-2 rounded-full text-xs font-bold shadow-2xl z-[150] animate-in fade-in slide-in-from-top-10"> {toast} </div> )}
    </div>
  );
};

const LoginScreen = ({ t, isDark, masterPassword, setMasterPassword, handleLogin, handleBiometricLogin, handleKeyFileSelect, keyFileName, setIsMasterModalOpen, isKeyFileMatched }: any) => (
  <div className={`h-full w-full flex flex-col items-center justify-center p-6 transition-colors duration-500 ${isDark ? 'bg-[#0a0a0a]' : 'bg-[#f0f0f0]'}`}>
    <div className={`w-full max-sm rounded-[2.5rem] p-8 border shadow-2xl transition-colors duration-500 ${isDark ? 'bg-[#121212] border-white/5' : 'bg-white border-black/5'}`}>
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 bg-[#4CAF50] rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-[#4CAF50]/10"> <Icons.Lock className="text-white w-8 h-8" /> </div>
        <h1 className={`text-2xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>{t.appTitle}</h1>
        <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mt-1 text-center">{t.unlockSubtitle}</p>
      </div>
      <form onSubmit={handleLogin} className="space-y-4">
        <label className={`w-full flex items-center justify-between py-4 px-6 border rounded-2xl cursor-pointer transition-all active:scale-[0.98] ${keyFileName ? 'border-[#4CAF50] bg-[#4CAF50]/5' : (isDark ? 'bg-white/5 border-white/5' : 'bg-gray-100 border-gray-200')}`}>
           <div className="flex items-center gap-3"> <Icons.Database size={18} className={keyFileName ? 'text-[#4CAF50]' : 'text-gray-500'} /> <span className={`text-[13px] font-bold ${keyFileName ? 'text-[#4CAF50]' : 'text-gray-500'}`}> {keyFileName || t.chooseKeyFile} </span> </div>
           {keyFileName && <Icons.Check size={16} className="text-[#4CAF50]" />}
           <input type="file" className="hidden" accept=".vpass" onChange={handleKeyFileSelect} />
        </label>
        {(!isKeyFileMatched || !keyFileName) && (
          <div className="relative animate-in slide-in-from-top-2 duration-300"> 
            <input type="password" placeholder={t.masterPassword} value={masterPassword} onChange={(e) => setMasterPassword(e.target.value)} className={`w-full border rounded-2xl py-4 px-6 text-[16px] placeholder:text-[13px] focus:border-[#4CAF50]/40 transition-all outline-none ${isDark ? 'bg-[#1a1a1a] border-white/5 text-white' : 'bg-gray-100 border-gray-200 text-gray-900'}`} /> 
          </div>
        )}
        {isKeyFileMatched && keyFileName && (
          <div className="bg-[#4CAF50]/10 py-3 px-4 rounded-xl flex items-center gap-3 border border-[#4CAF50]/20 animate-in zoom-in-95 duration-300">
            <Icons.Check className="text-[#4CAF50]" size={16} />
            <span className="text-[11px] font-bold text-[#4CAF50] uppercase tracking-wider">{t.fallbackSuccess}</span>
          </div>
        )}
        <button type="submit" className="w-full bg-[#4CAF50] hover:bg-[#45a049] text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"> <Icons.Unlock size={18} /> {t.unlockVault} </button>
        <button type="button" onClick={handleBiometricLogin} className={`w-full font-bold py-4 rounded-2xl flex items-center justify-center gap-2 border transition-all text-sm mt-2 active:scale-95 ${isDark ? 'bg-white/5 hover:bg-white/10 text-white border-white/5' : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200'}`}> <Icons.Fingerprint size={22} className="text-[#4CAF50]" /> {t.biometricUnlock} </button>
        <div className="pt-2 text-center"> <p className={`text-[10px] uppercase font-bold tracking-widest ${isDark ? 'text-gray-700' : 'text-gray-400'}`}>{t.noMasterPassYet}</p> <button type="button" onClick={() => setIsMasterModalOpen(true)} className="text-[#4CAF50] text-xs font-black mt-1 hover:underline">{t.createOne}</button> </div>
      </form>
    </div>
  </div>
);

const VaultScreen = ({ t, isDark, entries, searchQuery, setSearchQuery, activeCategory, setActiveCategory, setSelectedEntry, setIsEditing, copy, deleteEntry, deleteClickCount, settings, setView }: any) => {
  const [isFoldersOpen, setIsFoldersOpen] = useState(false);
  const [showMoreFrequent, setShowMoreFrequent] = useState(false);
  const isExpired = (entry: PasswordEntry) => { if (!entry.expiryInterval || entry.type !== 'login') return false; let ms = 0; switch(entry.expiryInterval) { case '1d': ms = 24 * 60 * 60 * 1000; break; case '1m': ms = 30 * 24 * 60 * 60 * 1000; break; case '6m': ms = 180 * 24 * 60 * 60 * 1000; break; case '1y': ms = 365 * 24 * 60 * 60 * 1000; break; } return Date.now() > entry.createdAt + ms; };
  const filteredEntries = useMemo(() => {
    let list = entries; if (activeCategory) { list = list.filter((e: any) => activeCategory.type === 'type' ? e.type === activeCategory.val : e.group === activeCategory.val); }
    if (searchQuery) { const q = searchQuery.toLowerCase(); list = list.filter((e: any) => (e.title && e.title.toLowerCase().includes(q)) || (e.username && e.username.toLowerCase().includes(q)) || (e.nickname && e.nickname.toLowerCase().includes(q))); } return list;
  }, [entries, activeCategory, searchQuery]);
  const frequentEntriesFull = entries.filter((e: any) => e.isFrequent);
  const frequentEntries = showMoreFrequent ? frequentEntriesFull : frequentEntriesFull.slice(0, 5);
  const folderCounts: Record<string, number> = {}; settings.folders.forEach((f: string) => folderCounts[f] = entries.filter((e: any) => e.group === f).length);
  return (
    <div className="flex-1 flex flex-col h-full">
      <header className={`sticky top-0 z-40 h-16 border-b flex items-center px-4 justify-between backdrop-blur-xl transition-colors duration-500 ${isDark ? 'bg-[#111]/90 border-white/5' : 'bg-white/90 border-black/5'}`}>
        <div className="flex-1 relative"> <Icons.Search className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-700' : 'text-gray-400'}`} size={16} /> <input type="text" placeholder={t.searchPlaceholder} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={`w-full border rounded-full py-2.5 pl-12 pr-4 text-[16px] placeholder:text-[13px] focus:outline-none focus:border-[#4CAF50]/40 transition-all ${isDark ? 'bg-[#1a1a1a] border-white/5 text-white' : 'bg-gray-100 border-gray-200 text-gray-900'}`} /> </div>
        <button onClick={() => setView('settings')} className={`ml-3 p-2 transition-colors ${isDark ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-gray-900'}`}><Icons.Settings size={22} /></button>
      </header>
      <main className="flex-1 overflow-y-auto p-4 space-y-6 pb-32">
        {(activeCategory || searchQuery) ? (
          <div className="space-y-4">
            <button onClick={() => { setActiveCategory(null); setSearchQuery(''); }} className="flex items-center gap-2 text-[#4CAF50] text-sm font-bold mb-4"> <Icons.ChevronLeft size={18} /> {searchQuery ? 'Back' : activeCategory.val} </button>
            {filteredEntries.map((entry: any) => ( <EntryItem key={entry.id} isDark={isDark} entry={entry} isExpired={isExpired(entry)} t={t} setSelectedEntry={setSelectedEntry} setIsEditing={setIsEditing} copy={copy} deleteEntry={deleteEntry} deleteClickCount={deleteClickCount} /> ))}
          </div>
        ) : (
          <>
            <section>
              <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2 px-1 ${isDark ? 'text-gray-700' : 'text-gray-400'}`}><Icons.Star size={12}/> {t.frequentHeader}</h3>
              <div className="space-y-2">
                {frequentEntries.map((entry: any) => ( <EntryItem key={entry.id} isDark={isDark} entry={entry} isExpired={isExpired(entry)} t={t} setSelectedEntry={setSelectedEntry} setIsEditing={setIsEditing} copy={copy} deleteEntry={deleteEntry} deleteClickCount={deleteClickCount} /> ))}
                {frequentEntriesFull.length > 5 && ( <button onClick={() => setShowMoreFrequent(!showMoreFrequent)} className={`w-full py-3 text-[#4CAF50] text-[10px] font-black uppercase tracking-widest rounded-2xl border border-dashed flex items-center justify-center gap-2 active:scale-95 transition-all ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-100 border-gray-300'}`}> {showMoreFrequent ? <><Icons.ChevronUp size={14}/> {t.seeLess}</> : <><Icons.ChevronDown size={14}/> {t.seeMore}</>} </button> )}
              </div>
            </section>
            <section>
              <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2 px-1 ${isDark ? 'text-gray-700' : 'text-gray-400'}`}><Icons.Shield size={12}/> {t.typesHeader}</h3>
              <div className="grid grid-cols-2 gap-3">
                {['login', 'card', 'document', 'contact'].map(id => (
                  <button key={id} onClick={() => setActiveCategory({ type: 'type', val: id })} className={`flex flex-col items-center justify-center p-5 rounded-3xl border transition-all active:scale-[0.96] shadow-sm text-center ${isDark ? 'bg-[#161616] border-white/5' : 'bg-white border-gray-200'}`}>
                    <div className="text-[#4CAF50] mb-3"> {id === 'login' ? <Icons.User size={26}/> : id === 'card' ? <Icons.CreditCard size={26}/> : id === 'contact' ? <Icons.Smartphone size={26}/> : <Icons.FileText size={26}/>} </div>
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
                      <div className="flex items-center gap-2.5"> <Icons.Folder size={14} className="text-[#4CAF50]" /> <span className={`text-[11px] font-bold ${isDark ? 'text-white/70' : 'text-gray-700'}`}>{f}</span> </div>
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
      <div className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${isExpired ? 'text-red-500' : 'text-[#4CAF50]'} ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}> {entry.type === 'login' ? <Icons.User size={22} /> : entry.type === 'card' ? <Icons.CreditCard size={22} /> : entry.type === 'contact' ? <Icons.Smartphone size={22} /> : <Icons.FileText size={22} />} </div>
      <div className="overflow-hidden">
        <h4 className={`text-sm font-bold truncate leading-tight flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}> {entry.title || entry.nickname || entry.fullName || (entry.documentType ? t[entry.documentType] : 'Item')} {isExpired && <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"/>} </h4>
        <p className={`text-[10px] uppercase tracking-tighter mt-1 truncate ${isExpired ? 'text-red-500 font-bold' : (isDark ? 'text-gray-600' : 'text-gray-400')}`}> {isExpired ? t.expiredWarning : (entry.username || entry.nickname || entry.cardHolder || entry.idNumber || '...')} </p>
      </div>
    </div>
    <div className="flex items-center gap-1 shrink-0">
      <button onClick={(e) => { e.stopPropagation(); setIsEditing(entry); }} className="p-2 text-gray-500 hover:text-[#4CAF50] transition-colors"><Icons.Pencil size={18} /></button>
      <button onClick={(e) => { e.stopPropagation(); copy(entry.password || entry.cardNumber || entry.phone || entry.idNumber || ''); }} className="p-2 text-gray-500 hover:text-[#4CAF50] transition-colors"><Icons.Copy size={18} /></button>
      <button onClick={(e) => { e.stopPropagation(); deleteEntry(entry.id); }} className={`p-2 transition-all duration-300 rounded-lg ${deleteClickCount.id === entry.id ? (deleteClickCount.count === 1 ? 'text-orange-500 scale-110 bg-orange-500/5' : 'text-red-500 scale-125 animate-pulse bg-red-500/5') : 'text-gray-500 hover:text-red-500'}`}> <Icons.Trash2 size={18} /> </button>
    </div>
  </div>
);

const MasterPasswordModal = ({ t, isDark, onClose, handleMasterPasswordSetup, masterPassword }: any) => {
  const [newMP, setNewMP] = useState(''); const [confirmMP, setConfirmMP] = useState(''); const [showMP, setShowMP] = useState(false); const [showConfirmMP, setShowConfirmMP] = useState(false); const [isGenerated, setIsGenerated] = useState(false); const [isSuccess, setIsSuccess] = useState(false); const [isProcessing, setIsProcessing] = useState(false); const [keyFileData, setKeyFileData] = useState<string | null>(null);
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+~`|}{[\]:;?><,./-]).{8,30}$/;
  const handleSubmit = async () => {
    if (!passwordRegex.test(newMP) || isProcessing) return; if (!isGenerated && newMP !== confirmMP) return; setIsProcessing(true);
    try { const keyFile = await handleMasterPasswordSetup(newMP); setKeyFileData(keyFile); setIsSuccess(true); } catch (err) { console.error(err); } finally { setIsProcessing(false); }
  };
  const handleRandom = () => { const p = generatePassword(16); setNewMP(p); setIsGenerated(true); setShowMP(true); };
  const exportKeyFile = () => { if (!keyFileData) return; const blob = new Blob([keyFileData], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `Key_SecurePass.vpass`; a.click(); URL.revokeObjectURL(url); onClose(); };
  if (isSuccess) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[120] flex items-center justify-center p-6 animate-in fade-in duration-300 text-center">
        <div className={`w-full max-sm rounded-[2.5rem] border p-8 space-y-6 shadow-2xl scale-in-center ${isDark ? 'bg-[#121212] border-white/10' : 'bg-white border-black/5'}`}>
          <div className="w-16 h-16 bg-[#4CAF50]/10 rounded-full flex items-center justify-center mx-auto mb-4"> <Icons.Check className="text-[#4CAF50]" size={32}/> </div>
          <h2 className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>{t.success}</h2>
          <p className="text-xs text-gray-500 leading-relaxed font-medium px-4">{t.saveKeyWarning}</p>
          <div className="space-y-3 pt-4">
            <button onClick={exportKeyFile} className="w-full bg-[#4CAF50] text-white py-4 rounded-3xl font-bold uppercase tracking-widest text-xs active:scale-95 shadow-lg shadow-[#4CAF50]/20 flex items-center justify-center gap-2"> <Icons.Download size={16}/> {t.saveKeyFile} </button>
            <button onClick={onClose} className={`w-full py-4 rounded-3xl font-bold uppercase tracking-widest text-[10px] border ${isDark ? 'bg-white/5 text-gray-400 border-white/5' : 'bg-gray-100 text-gray-600 border-gray-200'}`}> CLOSE </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[120] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className={`w-full max-w-md rounded-[2.5rem] border p-8 space-y-6 shadow-2xl scale-in-center ${isDark ? 'bg-[#121212] border-white/10' : 'bg-white border-black/5'}`}>
        <div className="flex justify-between items-center"> <h2 className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>{t.createMasterPass}</h2> <button onClick={onClose} className="p-2 text-gray-500 hover:text-[#4CAF50]"><Icons.X size={24}/></button> </div>
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
          <button onClick={handleSubmit} disabled={!passwordRegex.test(newMP) || (!isGenerated && newMP !== confirmMP) || isProcessing} className="w-full bg-[#4CAF50] text-white py-4 rounded-3xl font-bold uppercase tracking-widest text-xs shadow-lg active:scale-95 disabled:opacity-30 disabled:grayscale flex items-center justify-center"> {isProcessing ? <Icons.RefreshCw className="animate-spin" size={18}/> : t.save} </button>
        </div>
      </div>
    </div>
  );
};

const SettingsScreen = ({ t, isDark, settings, setSettings, handleLock, setView, setIsMasterModalOpen, masterPassword, handleImport, handleExport, setToast, subView, setSubView, toggleBiometric }: any) => {
  const [newF, setNewF] = useState(''); 
  const [newSub, setNewSub] = useState('');
  const [selectedRoot, setSelectedRoot] = useState('');
  const handleAddFolder = () => { if(!newF) return; setSettings({...settings, folders: [...settings.folders, newF]}); setNewF(''); };
  const handleDeleteFolder = (folder: string) => { if (confirm(`Xóa thư mục "${folder}"?`)) { const { [folder]: _, ...remainingSubs } = settings.subFolders; setSettings({ ...settings, folders: settings.folders.filter(f => f !== folder), subFolders: remainingSubs }); } };
  const handleAddSubFolder = () => { if(!newSub || !selectedRoot) return; const currentSubs = settings.subFolders[selectedRoot] || []; setSettings({ ...settings, subFolders: { ...settings.subFolders, [selectedRoot]: [...currentSubs, newSub] } }); setNewSub(''); };
  const handleDeleteSubFolder = (root: string, sub: string) => { const currentSubs = settings.subFolders[root] || []; setSettings({ ...settings, subFolders: { ...settings.subFolders, [root]: currentSubs.filter(s => s !== sub) } }); };
  const resetVault = () => { if (confirm(t.resetWarning)) { localStorage.clear(); window.location.reload(); } };
  
  const renderMainList = () => (
    <div className="space-y-4 animate-in fade-in duration-300">
      <section className={`rounded-[2.5rem] p-8 border text-center shadow-lg transition-colors duration-500 ${isDark ? 'bg-[#161616] border-white/5' : 'bg-white border-gray-200'}`}> <h4 className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>{t.appTitle}</h4> <p className="text-[11px] text-gray-600 font-medium italic">"{t.safeQuote}"</p> <div className={`h-px w-full my-4 ${isDark ? 'bg-white/5' : 'bg-gray-100'}`} /> <div className="space-y-1"> <p className={`text-[9px] font-bold uppercase tracking-widest ${isDark ? 'text-gray-700' : 'text-gray-400'}`}>{t.version}</p> <p className={`text-[13px] font-bold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{t.createdBy}</p> <p className="text-[13px] text-[#4CAF50] font-bold">{t.contactInfo}</p> </div> </section>
      <div className={`rounded-[2.5rem] overflow-hidden border transition-colors duration-500 ${isDark ? 'bg-[#161616] border-white/5' : 'bg-white border-gray-200'}`}>
        {[ 
          { id: 'data', icon: <Icons.Database size={18}/>, label: t.dataManagement }, 
          { id: 'folders', icon: <Icons.Folder size={18}/>, label: t.foldersHeader }, 
          { id: 'security', icon: <Icons.Shield size={18}/>, label: t.securitySettings }, 
          { id: 'theme', icon: <Icons.Monitor size={18}/>, label: t.themeLabel }, 
          { id: 'language', icon: <Icons.Globe size={18}/>, label: t.languageLabel }, 
        ].map((item) => (
          <button key={item.id} onClick={() => setSubView(item.id)} className={`w-full flex items-center justify-between p-5 border-b last:border-0 hover:bg-[#4CAF50]/5 transition-all ${isDark ? 'border-white/5' : 'border-gray-50'}`}> <div className="flex items-center gap-4"> <div className="text-[#4CAF50]">{item.icon}</div> <span className={`text-sm font-bold ${isDark ? 'text-white/80' : 'text-gray-700'}`}>{item.label}</span> </div> <Icons.ChevronRight size={18} className="text-gray-600" /> </button>
        ))}
      </div>
      <div className="space-y-3 pt-2"> <button onClick={handleLock} className={`w-full font-black text-[10px] uppercase tracking-[0.3em] py-5 rounded-3xl border active:scale-95 transition-all ${isDark ? 'bg-white/5 text-gray-500 border-white/5' : 'bg-gray-200 text-gray-600 border-gray-300'}`}>LOG OUT / LOCK APP</button> </div>
    </div>
  );

  const renderSubView = () => {
    switch(subView) {
      case 'data':
        return (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <section className={`rounded-[2.5rem] p-6 border shadow-xl ${isDark ? 'bg-[#161616] border-white/5' : 'bg-white border-gray-200'}`}>
              <h3 className="text-[10px] font-black text-[#4CAF50] uppercase tracking-widest flex items-center gap-2 mb-4 px-1"><Icons.Lock size={14}/> {t.createMasterPass}</h3>
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
            <section className={`rounded-[2.5rem] p-6 border shadow-xl ${isDark ? 'bg-[#161616] border-white/5' : 'bg-white border-gray-200'}`}>
              <h3 className="text-[10px] font-black text-[#4CAF50] uppercase tracking-widest flex items-center gap-2 mb-4 px-1"><Icons.Folder size={14}/> {t.foldersHeader}</h3>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input value={newF} onChange={e => setNewF(e.target.value)} placeholder={t.settingsFolder} className={`flex-1 border rounded-2xl px-4 py-3 text-[14px] outline-none ${isDark ? 'bg-black/30 border-white/5 text-white' : 'bg-gray-50 border-gray-200'}`} />
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
            <section className={`rounded-[2.5rem] p-6 border shadow-xl ${isDark ? 'bg-[#161616] border-white/5' : 'bg-white border-gray-200'}`}>
              <h3 className="text-[10px] font-black text-[#4CAF50] uppercase tracking-widest flex items-center gap-2 mb-4 px-1"><Icons.Network size={14}/> {t.settingsSubFolder}</h3>
              <div className="space-y-4">
                <select value={selectedRoot} onChange={e => setSelectedRoot(e.target.value)} className={`w-full border rounded-xl py-3 px-3 text-[14px] outline-none transition-all ${isDark ? 'bg-[#181818] border-white/5 text-white' : 'bg-white border-gray-200 shadow-sm'}`}>
                  <option value="">-- {t.foldersHeader} --</option>
                  {settings.folders.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
                {selectedRoot && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-200 space-y-4">
                    <div className="flex gap-2">
                      <input value={newSub} onChange={e => setNewSub(e.target.value)} placeholder={t.settingsSubFolder} className={`flex-1 border rounded-2xl px-4 py-3 text-[14px] outline-none ${isDark ? 'bg-black/30 border-white/5 text-white' : 'bg-gray-50 border-gray-200'}`} />
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
        <button onClick={() => { if (subView === 'main') setView('vault'); else setSubView('main'); }} className={`p-2 transition-colors ${isDark ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-gray-900'}`}><Icons.ChevronLeft size={24} /></button>
        <h2 className="text-lg font-bold tracking-tight">{subView === 'main' ? t.settingsTab : t[subView as keyof typeof t] || subView}</h2> <div className="w-10"></div>
      </header>
      <main className="flex-1 overflow-y-auto p-4 pb-32"> <div className="max-w-xl mx-auto">{subView === 'main' ? renderMainList() : renderSubView()}</div> </main>
    </div>
  );
};

const EntryModal = ({ t, isDark, settings, mode, entry, onClose, onSave, copy, addType }: any) => {
  const [localData, setLocalData] = useState<any>(() => {
    if (entry) return { ...entry };
    return { type: addType || 'login', group: '---', title: '', username: '', password: '', cardNumber: '', cardHolder: '', cardType: '', expiryMonth: '', expiryYear: '', nickname: '', fullName: '', phone: '', email: '', address: '', content: '', notes: '', strength: 0, pin: '', authCode: '', recoveryInfo: '', url: '', expiryInterval: '6m', documentType: '', atmPin: '', qrImage: '', frontImage: '', backImage: '', postCode: '', cvv: '', linkedBank: '' };
  });
  const [showPass, setShowPass] = useState(false);
  const [showAtmPin, setShowAtmPin] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [visibleFields, setVisibleFields] = useState<Record<string, boolean>>({});
  const isView = mode === 'view';
  const typeLabels: Record<string, string> = { login: t.typeLogin, card: t.typeCard, contact: t.typeContact, document: t.typeDocument };
  const currentSubFolders = settings.subFolders[localData.group] || [];
  const bankSubs = settings.subFolders['Ngân hàng'] || [];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (file) { const reader = new FileReader(); reader.onloadend = () => setLocalData({ ...localData, [field]: reader.result as string }); reader.readAsDataURL(file); }
  };

  const copyableField = (label: string, field: string, value: string, type: string = "text", placeholder: string = "") => {
    return (
      <div className="space-y-1 w-full">
        <label className={`text-[10px] font-bold uppercase tracking-widest ml-1 block ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{label}</label>
        <div className="relative w-full">
          <input disabled={isView} type={type} value={value} onChange={e => setLocalData({...localData, [field]: e.target.value})} className={`w-full border rounded-xl py-3 px-4 text-[14px] font-medium placeholder:text-[11px] placeholder:text-gray-500/50 outline-none transition-all ${isDark ? 'bg-[#181818] border-white/5 text-white' : 'bg-white border-gray-200 text-gray-900 shadow-sm'}`} placeholder={placeholder} />
          <button type="button" onClick={() => copy(value)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#4CAF50] p-1"><Icons.Copy size={14}/></button>
        </div>
      </div>
    );
  };

  const renderDocImageRow = (field: string, label: string) => (
    <div className="space-y-2 w-full">
      <label className="text-[10px] font-bold uppercase tracking-widest block px-1 text-gray-500">{label}</label>
      <label className={`w-full aspect-[1.6/1] border-2 border-dashed rounded-2xl flex items-center justify-center cursor-pointer overflow-hidden relative ${isDark ? 'bg-black/20 border-white/5' : 'bg-white border-gray-200'}`}>
        {localData[field] ? <img src={localData[field]} className="w-full h-full object-cover" /> : <Icons.Camera className="text-gray-400" size={24} />}
        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, field)} className="hidden" disabled={isView} />
      </label>
    </div>
  );

  const renderDocumentEditor = () => {
    switch (localData.documentType) {
      case 'id_card':
      case 'residence_card':
        return (
          <div className="space-y-4 animate-in fade-in duration-300">
            {copyableField(t.idNumber, 'idNumber', localData.idNumber, "text", "00109000xxxx")}
            {copyableField(t.fullName, 'fullName', localData.fullName, "text", "NGUYEN VAN A")}
            <div className="grid grid-cols-2 gap-3">
              {copyableField(t.dob, 'dob', localData.dob, "date")}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{t.gender}</label>
                <select value={localData.gender} onChange={e => setLocalData({...localData, gender: e.target.value})} className={`w-full border rounded-xl py-3 px-3 text-[14px] outline-none ${isDark ? 'bg-[#181818] border-white/5 text-white' : 'bg-white border-gray-200 shadow-sm'}`}>
                  <option value="">{t.chooseGender}</option><option value="Nam">Nam</option><option value="Nữ">Nữ</option>
                </select>
              </div>
            </div>
            {copyableField(t.hometown, 'hometown', localData.hometown, "text", "Quê quán")}
            {copyableField(t.residence, 'residence', localData.residence, "text", "Nơi cư trú")}
            <div className="grid grid-cols-2 gap-3">
              {copyableField(t.issueDate, 'issueDate', localData.issueDate, "date")}
              {copyableField('Giá trị đến', 'expiryDate', localData.expiryDate, "date")}
            </div>
            {copyableField(t.issuer, 'issuer', localData.issuer, "text", "Cơ quan cấp")}
            {renderDocImageRow('frontImage', t.frontImageBtn)}
            {renderDocImageRow('backImage', t.backImageBtn)}
          </div>
        );
      case 'health_insurance':
        return (
          <div className="space-y-4 animate-in fade-in duration-300">
            {copyableField('Số sổ/thẻ BHYT', 'idNumber', localData.idNumber, "text", "10 hoặc 15 ký tự")}
            {copyableField(t.fullName, 'fullName', localData.fullName, "text", "NGUYEN VAN A")}
            <div className="grid grid-cols-2 gap-3">
              {copyableField(t.dob, 'dob', localData.dob, "date")}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-gray-500">{t.gender}</label>
                <select value={localData.gender} onChange={e => setLocalData({...localData, gender: e.target.value})} className={`w-full border rounded-xl py-3 px-3 text-[14px] outline-none ${isDark ? 'bg-[#181818] border-white/5 text-white' : 'bg-white border-gray-200 shadow-sm'}`}>
                  <option value="">{t.chooseGender}</option><option value="Nam">Nam</option><option value="Nữ">Nữ</option>
                </select>
              </div>
            </div>
            {copyableField(t.hospital, 'hospital', localData.hospital, "text", "Nơi ĐK KCB BĐ")}
            {copyableField('Giá trị từ', 'issueDate', localData.issueDate, "date")}
            {renderDocImageRow('frontImage', t.frontImageBtn)}
          </div>
        );
      case 'driving_license':
        return (
          <div className="space-y-4 animate-in fade-in duration-300">
            {copyableField('Số bằng lái', 'idNumber', localData.idNumber, "text", "12 chữ số")}
            {copyableField(t.fullName, 'fullName', localData.fullName, "text", "NGUYEN VAN A")}
            <div className="grid grid-cols-2 gap-3">
              {copyableField(t.dob, 'dob', localData.dob, "date")}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-gray-500">{t.class}</label>
                <select value={localData.class} onChange={e => setLocalData({...localData, class: e.target.value})} className={`w-full border rounded-xl py-3 px-3 text-[14px] outline-none ${isDark ? 'bg-[#181818] border-white/5 text-white' : 'bg-white border-gray-200 shadow-sm'}`}>
                  <option value="">{t.chooseClass}</option>{['A1','A2','B1','B2','C','D','E'].map(c=><option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            {copyableField(t.residence, 'residence', localData.residence)}
            <div className="grid grid-cols-2 gap-3">
              {copyableField('Ngày cấp', 'issueDate', localData.issueDate, "date")}
              {copyableField('Hết hạn', 'expiryDate', localData.expiryDate, "date")}
            </div>
            {copyableField('Cơ quan cấp', 'issuer', localData.issuer)}
            {renderDocImageRow('frontImage', t.frontImageBtn)}
            {renderDocImageRow('backImage', t.backImageBtn)}
          </div>
        );
      case 'passport':
        return (
          <div className="space-y-4 animate-in fade-in duration-300">
            {copyableField('Số hộ chiếu', 'idNumber', localData.idNumber, "text", "P01234567")}
            {copyableField(t.fullName, 'fullName', localData.fullName)}
            <div className="grid grid-cols-2 gap-3">
              {copyableField(t.dob, 'dob', localData.dob, "date")}
              {copyableField('Quốc tịch', 'nationality', localData.nationality)}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {copyableField('Ngày cấp', 'issueDate', localData.issueDate, "date")}
              {copyableField('Hết hạn', 'expiryDate', localData.expiryDate, "date")}
            </div>
            {copyableField('Cơ quan cấp', 'issuer', localData.issuer)}
            {renderDocImageRow('frontImage', t.frontImageBtn)}
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col animate-in slide-in-from-bottom-5 ${isDark ? 'bg-[#0d0d0d]' : 'bg-[#f5f5f5]'}`}>
      <header className={`h-16 border-b flex items-center px-4 justify-between sticky top-0 z-[110] ${isDark ? 'bg-[#111]/95 border-white/5' : 'bg-white/95 border-black/5 shadow-sm'}`}>
        <button onClick={onClose} className="p-2 text-gray-500"><Icons.ChevronLeft size={24} /></button>
        <h2 className="text-[11px] font-black uppercase tracking-widest flex-1 text-center truncate px-2">{isView ? t.detailedInfo : typeLabels[localData.type]}</h2>
        {!isView ? <button onClick={() => onSave(localData)} className="bg-[#4CAF50] text-white px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase">{t.save}</button> : <div className="w-10"/>}
      </header>
      <main className="flex-1 overflow-y-auto p-4 space-y-5 pb-24">
        {!isView ? (
          <div className="max-w-md mx-auto space-y-4">
            {localData.type === 'login' && (
              <>
                {copyableField(t.title, 'title', localData.title, "text", t.loginTitleHint)}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-500">{t.groupLabel}</label>
                    <select value={localData.group} onChange={e => setLocalData({...localData, group: e.target.value, subGroup: ''})} className={`w-full border rounded-xl py-3 px-3 text-[14px] outline-none ${isDark ? 'bg-[#181818] border-white/5 text-white' : 'bg-white border-gray-200 shadow-sm'}`}>
                      <option value="---">---</option>{settings.folders.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-500">{t.subGroupLabel}</label>
                    <select value={localData.subGroup} onChange={e => setLocalData({...localData, subGroup: e.target.value})} className={`w-full border rounded-xl py-3 px-3 text-[14px] outline-none ${isDark ? 'bg-[#181818] border-white/5 text-white' : 'bg-white border-gray-200 shadow-sm'}`}>
                      <option value="">{t.chooseSubGroup}</option>{currentSubFolders.map((s: string) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                {copyableField(t.username, 'username', localData.username, "text", t.usernameHint)}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-gray-500">{t.password}</label>
                  <div className="relative">
                    <input type={showPass ? "text" : "password"} value={localData.password} onChange={e => setLocalData({...localData, password: e.target.value})} className={`w-full border rounded-xl py-3 pl-4 pr-12 text-[14px] font-mono outline-none ${isDark ? 'bg-[#181818] border-white/5 text-white' : 'bg-white border-gray-200 shadow-sm'}`} />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500">{showPass ? <Icons.EyeOff size={14}/> : <Icons.Eye size={14}/>}</button>
                  </div>
                </div>
                <button onClick={() => setShowAdvanced(!showAdvanced)} className="flex items-center gap-2 text-[#4CAF50] text-[10px] font-bold uppercase tracking-widest pt-2"> <Icons.Plus size={14} className={`transition-transform ${showAdvanced ? 'rotate-45' : ''}`} /> {t.advancedOptions} </button>
                {showAdvanced && (
                  <div className="space-y-4 animate-in slide-in-from-top-2 duration-200">
                    {copyableField(t.pinCode, 'pin', localData.pin, "text", "Mã PIN mở ứng dụng")}
                    {copyableField(t.authCode, 'authCode', localData.authCode, "text", "2FA / Google Auth")}
                    {copyableField(t.recoveryInfo, 'recoveryInfo', localData.recoveryInfo, "text", "Khôi phục / Backup code")}
                    {copyableField(t.url, 'url', localData.url, "text", t.urlHint)}
                    {copyableField(t.notes, 'notes', localData.notes, "text", "Ghi chú thêm...")}
                  </div>
                )}
              </>
            )}
            {localData.type === 'card' && (
              <>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-gray-500">Ngân hàng / Đơn vị phát hành</label>
                  <select value={localData.title} onChange={e => setLocalData({...localData, title: e.target.value})} className={`w-full border rounded-xl py-3 px-3 text-[14px] outline-none ${isDark ? 'bg-[#181818] border-white/5 text-white' : 'bg-white border-gray-200 shadow-sm'}`}>
                    <option value="">{t.chooseCardType}</option>{bankSubs.map((b:string) => <option key={b} value={b}>{b}</option>)}<option value="Other">Khác...</option>
                  </select>
                </div>
                {localData.title === 'Other' && copyableField(t.title, 'title', localData.title, "text", "Nhập tên đơn vị...")}
                {copyableField(t.cardNumber, 'cardNumber', localData.cardNumber, "text", "0000 0000 0000 0000")}
                {copyableField(t.cardName, 'cardHolder', localData.cardHolder, "text", "NGUYEN VAN A")}
                <div className="grid grid-cols-2 gap-3">
                   {copyableField(t.expiryMonth, 'expiryMonth', localData.expiryMonth, "text", "MM/YY")}
                   <div className="space-y-1">
                     <label className="text-[10px] font-bold uppercase text-gray-500">{t.atmPin}</label>
                     <div className="relative">
                       <input type={showAtmPin ? "text" : "password"} value={localData.atmPin} onChange={e => setLocalData({...localData, atmPin: e.target.value})} className={`w-full border rounded-xl py-3 px-3 text-[14px] outline-none ${isDark ? 'bg-[#181818] border-white/5 text-white' : 'bg-white border-gray-200 shadow-sm'}`} />
                       <button type="button" onClick={() => setShowAtmPin(!showAtmPin)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500"><Icons.Eye size={14}/></button>
                     </div>
                   </div>
                </div>
                {renderDocImageRow('qrImage', t.qrImage)}
                {copyableField(t.notes, 'notes', localData.notes)}
              </>
            )}
            {localData.type === 'contact' && (
              <>
                {copyableField(t.nickname, 'nickname', localData.nickname, "text", "Tên thường gọi")}
                {copyableField(t.fullName, 'fullName', localData.fullName)}
                {copyableField(t.phone, 'phone', localData.phone)}
                {copyableField(t.email, 'email', localData.email)}
                {copyableField(t.address, 'address', localData.address)}
                {copyableField(t.notes, 'notes', localData.notes)}
              </>
            )}
            {localData.type === 'document' && (
              <>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-gray-500">{t.docType}</label>
                  <select value={localData.documentType} onChange={e => setLocalData({...localData, documentType: e.target.value})} className={`w-full border rounded-xl py-3 px-3 text-[14px] outline-none ${isDark ? 'bg-[#181818] border-white/5 text-white' : 'bg-white border-gray-200 shadow-sm'}`}>
                    <option value="">{t.chooseDocType}</option>
                    <option value="id_card">{t.idCard}</option>
                    <option value="health_insurance">{t.healthInsurance}</option>
                    <option value="driving_license">{t.drivingLicense}</option>
                    <option value="passport">{t.passport}</option>
                    <option value="residence_card">{t.residenceCard}</option>
                  </select>
                </div>
                {renderDocumentEditor()}
              </>
            )}
          </div>
        ) : (
          <div className="max-w-md mx-auto animate-in fade-in duration-300 pb-12">
            <div className={`rounded-3xl border overflow-hidden shadow-lg ${isDark ? 'bg-[#181818] border-white/5' : 'bg-white border-gray-200'}`}>
              {Object.keys(localData).map(key => {
                if (['id', 'type', 'createdAt', 'strength', 'isFrequent', 'frontImage', 'backImage', 'qrImage', 'documentType'].includes(key)) return null;
                const val = localData[key]; if (!val || val === '---' || val === '') return null;
                const isSecret = ['password', 'pin', 'atmPin', 'cvv', 'recoveryInfo'].includes(key);
                const isVisible = !!visibleFields[key];
                return (
                  <div key={key} className={`p-4 border-b last:border-0 ${isDark ? 'border-white/5' : 'border-gray-50'}`}>
                    <span className="text-[10px] font-bold uppercase text-gray-500 block mb-1">{t[key as keyof typeof t] || key}</span>
                    <div className="flex items-center justify-between">
                      <span className={`text-[15px] font-bold ${isDark ? 'text-white' : 'text-gray-900'} ${isSecret && !isVisible ? 'blur-sm select-none' : ''}`}> {isSecret && !isVisible ? '••••••••' : val} </span>
                      <div className="flex items-center gap-1">
                        {isSecret && ( <button onClick={() => setVisibleFields(prev => ({...prev, [key]: !isVisible}))} className="p-2 text-gray-500"> {isVisible ? <Icons.EyeOff size={14}/> : <Icons.Eye size={14}/>} </button> )}
                        <button onClick={() => copy(val)} className="p-2 text-gray-500 hover:text-[#4CAF50]"><Icons.Copy size={16}/></button>
                      </div>
                    </div>
                  </div>
                );
              })}
              {localData.documentType && ( <div className={`p-4 border-b last:border-0 ${isDark ? 'border-white/5' : 'border-gray-50'}`}> <span className="text-[10px] font-bold uppercase text-gray-500 block mb-1">{t.docType}</span> <span className={`text-[15px] font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{t[localData.documentType as keyof typeof t] || localData.documentType}</span> </div> )}
            </div>
            {localData.qrImage && (
              <div className={`mt-4 p-6 rounded-3xl border text-center shadow-lg ${isDark ? 'bg-[#181818] border-white/5' : 'bg-white border-gray-200'}`}>
                <img src={localData.qrImage} className="mx-auto w-48 h-48 object-contain bg-white p-2 rounded-xl mb-4" />
                <button onClick={() => shareData('QR Code', 'Shared from SecurePass', localData.qrImage)} className="text-[#4CAF50] font-bold text-xs uppercase flex items-center justify-center gap-2 mx-auto"><Icons.Share2 size={16}/> {t.shareQr}</button>
              </div>
            )}
            {(localData.frontImage || localData.backImage) && (
              <div className="mt-4 space-y-4">
                {localData.frontImage && <img src={localData.frontImage} className="w-full rounded-2xl border border-white/5 shadow-md" />}
                {localData.backImage && <img src={localData.backImage} className="w-full rounded-2xl border border-white/5 shadow-md" />}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

const GeneratorScreen = ({ t, isDark, genPass, genConfig, setGenConfig, handleGenerator, copy, genHistory, showGenHistory, setShowGenHistory, setToast, onAddEntry }: any) => {
  const [genMode, setGenMode] = useState<'password' | 'wifi' | 'share'>('password');
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiSecurity, setWifiSecurity] = useState('WPA');
  const [wifiPassword, setWifiPassword] = useState('');
  const [shareText, setShareText] = useState('');
  
  // Ensure a password exists if we're in password mode
  useEffect(() => {
    if (genMode === 'password' && !genPass) {
      handleGenerator();
    }
  }, [genMode]);

  const wifiValue = useMemo(() => {
    if (wifiSecurity === 'NONE') return `WIFI:S:${wifiSsid};T:nopass;;`;
    return `WIFI:S:${wifiSsid};T:${wifiSecurity};P:${wifiPassword};;`;
  }, [wifiSsid, wifiSecurity, wifiPassword]);

  const handleDownload = () => {
    const canvas = document.querySelector('.qr-canvas-target canvas') as HTMLCanvasElement;
    if (!canvas) return; const link = document.createElement('a'); link.download = `qr-${Date.now()}.png`; link.href = canvas.toDataURL('image/png'); link.click(); setToast(t.success);
  };
  const handleSaveToVault = () => {
    const canvas = document.querySelector('.qr-canvas-target canvas') as HTMLCanvasElement;
    if (!canvas) return; const qrBase64 = canvas.toDataURL('image/png');
    if (genMode === 'wifi') onAddEntry({ type: 'login', title: `WiFi: ${wifiSsid}`, group: 'Mạng Internet', qrImage: qrBase64, password: wifiPassword, username: wifiSsid });
    else onAddEntry({ type: 'document', title: `QR Share: ${shareText.slice(0, 15)}...`, group: '---', qrImage: qrBase64, notes: shareText });
    setToast(t.success);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <header className={`sticky top-0 z-40 h-16 border-b flex items-center px-6 justify-between backdrop-blur-xl transition-colors duration-500 ${isDark ? 'bg-[#111]/90 border-white/5' : 'bg-white/90 border-black/5'}`}>
        <h2 className="text-lg font-bold tracking-tight">{t.generatorTab}</h2>
        <button onClick={() => setShowGenHistory(!showGenHistory)} className={`p-2 transition-all ${showGenHistory ? 'text-[#4CAF50]' : 'text-gray-500'}`}><Icons.History size={22} /></button>
      </header>
      <div className={`p-2 flex gap-1 border-b ${isDark ? 'bg-black/20 border-white/5' : 'bg-gray-100 border-gray-200'}`}>
        {['password', 'wifi', 'share'].map(m => ( <button key={m} onClick={() => setGenMode(m as any)} className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${genMode === m ? 'bg-[#4CAF50] text-white' : 'text-gray-500'}`}> {m === 'password' ? t.genModePassword : m === 'wifi' ? t.genModeWifi : t.genModeShare} </button> ))}
      </div>
      <main className="flex-1 overflow-y-auto p-6 pb-32">
        {genMode === 'password' && (
          <div className="space-y-6 max-w-lg mx-auto">
            <input readOnly value={genPass} className={`w-full border rounded-3xl p-6 text-center text-xl font-mono text-[#4CAF50] outline-none ${isDark ? 'bg-[#1a1a1a] border-white/5' : 'bg-white border-gray-200 shadow-inner'}`} />
            <div className="flex gap-3">
              <button onClick={() => copy(genPass)} className={`flex-1 font-bold py-4 rounded-3xl border active:scale-[0.98] transition-all ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-gray-200 shadow-sm hover:border-[#4CAF50]/30'}`}>{t.copyPassword}</button>
              <button onClick={handleGenerator} className="bg-[#4CAF50] text-white p-4 rounded-3xl shadow-lg active:scale-95 transition-all"><Icons.RefreshCw size={24} /></button>
            </div>
            <div className={`rounded-[2.5rem] border p-6 space-y-4 shadow-lg ${isDark ? 'bg-[#161616] border-white/5' : 'bg-white border-gray-200'}`}>
              <div className="flex justify-between font-bold text-xs mb-2"><span>{t.genLength}</span><span className="text-[#4CAF50]">{genConfig.length}</span></div>
              <input type="range" min="4" max="64" value={genConfig.length} onChange={e => setGenConfig({...genConfig, length: parseInt(e.target.value)})} className="w-full accent-[#4CAF50]" />
              {[{ id: 'useAZ', label: t.genAZ }, { id: 'useaz', label: t.genaz }, { id: 'use09', label: t.gen09 }, { id: 'useSpec', label: t.genSpec }].map(opt => (
                <div key={opt.id} className="flex items-center justify-between py-1">
                  <span className="text-xs font-bold text-gray-500">{opt.label}</span>
                  <button onClick={() => setGenConfig({...genConfig, [opt.id]: !(genConfig as any)[opt.id]})} className={`w-10 h-5 rounded-full relative transition-all ${(genConfig as any)[opt.id] ? 'bg-[#4CAF50]' : 'bg-gray-300'}`}> <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${(genConfig as any)[opt.id] ? 'right-0.5' : 'left-0.5'}`} /> </button>
                </div>
              ))}
            </div>
          </div>
        )}
        {genMode === 'wifi' && (
          <div className="space-y-6 max-w-lg mx-auto">
            <div className="flex flex-col items-center bg-white p-6 rounded-[2rem] shadow-lg qr-canvas-target"> <QRCodeCanvas value={wifiValue} size={200} includeMargin={true} level="H" /> </div>
            <div className="space-y-4">
              <div className="space-y-1"> <label className="text-[10px] font-bold text-gray-500 uppercase px-1">{t.wifiSsid}</label> <input value={wifiSsid} onChange={e => setWifiSsid(e.target.value)} className={`w-full border rounded-xl py-3 px-4 outline-none ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-gray-200'}`} placeholder="Tên mạng WiFi..." /> </div>
              <div className="space-y-1"> <label className="text-[10px] font-bold text-gray-500 uppercase px-1">{t.wifiPassword}</label> <input type="password" value={wifiPassword} onChange={e => setWifiPassword(e.target.value)} className={`w-full border rounded-xl py-3 px-4 outline-none ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-gray-200'}`} placeholder="Mật khẩu..." /> </div>
              <div className="space-y-1"> <label className="text-[10px] font-bold text-gray-500 uppercase px-1">{t.wifiSecurity}</label> <select value={wifiSecurity} onChange={e => setWifiSecurity(e.target.value)} className={`w-full border rounded-xl py-3 px-4 outline-none ${isDark ? 'bg-black border-white/5' : 'bg-white border-gray-200'}`}> <option value="WPA">WPA/WPA2</option><option value="WEP">WEP</option><option value="NONE">No Password</option> </select> </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button onClick={handleDownload} className="bg-[#4CAF50] text-white py-4 rounded-2xl font-bold uppercase text-[10px] shadow-lg">{t.downloadQr}</button>
                <button onClick={handleSaveToVault} className={`py-4 rounded-2xl border font-bold uppercase text-[10px] ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-gray-200'}`}>{t.saveToVault}</button>
              </div>
            </div>
          </div>
        )}
        {genMode === 'share' && (
           <div className="space-y-6 max-w-lg mx-auto">
             <div className="flex flex-col items-center bg-white p-6 rounded-[2rem] shadow-lg qr-canvas-target"> <QRCodeCanvas value={shareText || "SecurePass"} size={200} includeMargin={true} level="H" /> </div>
             <p className="text-[10px] text-gray-500 text-center uppercase tracking-widest font-bold px-4">{t.shareQrInstruction}</p>
             <textarea value={shareText} onChange={e => setShareText(e.target.value)} placeholder={t.shareQrPlaceholder} className={`w-full border rounded-2xl py-4 px-4 outline-none text-sm min-h-[120px] ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-gray-200'}`} />
             <div className="grid grid-cols-2 gap-3">
               <button onClick={handleDownload} className="bg-[#4CAF50] text-white py-4 rounded-2xl font-bold uppercase text-[10px] shadow-lg">{t.downloadQr}</button>
               <button onClick={handleSaveToVault} className={`py-4 rounded-2xl border font-bold uppercase text-[10px] ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-gray-200'}`}>{t.saveToVault}</button>
             </div>
           </div>
        )}
      </main>
    </div>
  );
};

export default App;
