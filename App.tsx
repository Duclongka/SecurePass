
import React, { useState, useEffect, useMemo, useRef } from 'react';
import * as Icons from './components/Icons';
import { PasswordEntry, AppView, SettingsState, EntryType } from './types';
import { generatePassword, calculateStrength, getStrengthColor } from './utils/passwordUtils';
import { SecurityService } from './services/SecurityService';
import { QRCodeSVG } from 'qrcode.react';

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
    usernameHint: 'e.g. abc@gmail.com, 09xx...',
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
    createQRCode: 'Create QR Code'
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
    username: 'Tên đăng nhập',
    usernameHint: 'abc@gmail.com, số điện thoại...',
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
    createQRCode: 'Tạo QR Code'
  }
};

const DEFAULT_FOLDERS = [
  'Mạng xã hội (Facebook, Tiktok, Zalo ...)',
  'Thư điện tử (Email)',
  'Ngân hàng',
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
  'Mạng xã hội (Facebook, Tiktok, Zalo ...)': ['Facebook', 'Tiktok', 'Zalo', 'Instagram', 'X', 'Line', 'Telegram', 'whatsapp'],
  'Thư điện tử (Email)': ['Gmail', 'Hotmail', 'Outlook'],
  'Điện thoại': ['Iphone (icloud)', 'Samsung', 'Xiaomi', 'Poco', 'Google Pixel', 'Vivo', 'Realme', 'Oppo', 'Huawei'],
  'Camera': ['Imou', 'Xiaomi', 'Ezviz', 'FPT', 'Hikvision', 'Dahua', 'Eufy', 'Tapo'],
  'Mạng Internet': ['Viettel', 'VNPT', 'FPT'],
  'Mua sắm online': ['Shopee', 'Lazada', 'Tiktok shop', 'Tiki', 'Sendo', 'Amazon', 'Alibaba', 'Temu', 'Shein', 'Rakuten', 'Mercari'],
  'Lưu trữ trực tuyến (Online Data)': ['Microsoft OneDrive', 'Google Drive', 'Mega', 'Dropbox']
};

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('login');
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

  const autoLockTimer = useRef<number | null>(null);
  const clipboardTimer = useRef<number | null>(null);

  const [settings, setSettings] = useState<SettingsState>(() => {
    const saved = localStorage.getItem('securepass_settings');
    const defaultSettings: SettingsState = {
      autoLockMinutes: 1,
      clearClipboardSeconds: 30,
      autoLockEnabled: true,
      clearClipboardEnabled: true,
      biometricEnabled: true,
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
  };

  const handleLogin = async (e?: React.FormEvent, providedPass?: string) => {
    e?.preventDefault();
    const passToUse = providedPass || masterPassword;
    if (!passToUse) return;

    const verificationToken = localStorage.getItem('securepass_master_hash');
    
    if (verificationToken) {
      try {
        await SecurityService.decrypt(JSON.parse(verificationToken), passToUse);
      } catch {
        setToast(t.wrongPassword);
        return;
      }
    }

    try {
      const encryptedVault = localStorage.getItem('securepass_vault');
      if (encryptedVault) {
        const decrypted = await SecurityService.decrypt(JSON.parse(encryptedVault), passToUse);
        setEntries(JSON.parse(decrypted));
      }
      setIsLocked(false);
      setView('vault');
      setMasterPassword(passToUse);
    } catch (err) {
      console.error("Vault decryption error:", err);
      setToast(t.wrongPassword);
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
    const encrypted = await SecurityService.encrypt(JSON.stringify(updated), masterPassword);
    localStorage.setItem('securepass_vault', JSON.stringify(encrypted));
  };

  const handleMasterPasswordChange = async (newPassword: string) => {
    const verification = await SecurityService.encrypt("VALID_SESSION", newPassword);
    localStorage.setItem('securepass_master_hash', JSON.stringify(verification));

    if (!isLocked && entries.length > 0) {
      const encrypted = await SecurityService.encrypt(JSON.stringify(entries), newPassword);
      localStorage.setItem('securepass_vault', JSON.stringify(encrypted));
    } else if (isLocked) {
      localStorage.removeItem('securepass_vault');
      setEntries([]);
    }

    setMasterPassword(newPassword);
    setSettings(prev => ({ ...prev, hasMasterPassword: true }));
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

  return (
    <div className={`h-full flex flex-col overflow-hidden selection:bg-[#4CAF50]/20 selection:text-[#4CAF50] transition-colors duration-500 ${isDark ? 'bg-[#0d0d0d] text-[#E0E0E0]' : 'bg-[#f5f5f5] text-[#1a1a1a]'}`}>
      {isLocked ? (
        <LoginScreen 
          t={t} 
          isDark={isDark}
          masterPassword={masterPassword} 
          setMasterPassword={setMasterPassword} 
          handleLogin={handleLogin} 
          handleKeyFileLogin={handleKeyFileLogin}
          setIsMasterModalOpen={setIsMasterModalOpen}
        />
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
              settings={settings}
              setView={setView}
            />
          )}
          {view === 'generator' && (
            <GeneratorScreen 
              t={t} 
              isDark={isDark}
              genPass={genPass} 
              genConfig={genConfig} 
              setGenConfig={setGenConfig} 
              handleGenerator={handleGenerator} 
              copy={copy} 
              genHistory={genHistory} 
              showGenHistory={showGenHistory} 
              setShowGenHistory={setShowGenHistory} 
            />
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
            />
          )}

          {showPlusMenu && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-[60] flex items-center justify-center p-6" onClick={() => setShowPlusMenu(false)}>
              <div className="space-y-3 flex flex-col items-center animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                <button onClick={() => { setIsAdding('login'); setShowPlusMenu(false); }} className="w-56 bg-[#4CAF50] text-white px-6 py-4 rounded-3xl font-bold shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all">
                  <Icons.User size={20} /> {t.addLogin}
                </button>
                <button onClick={() => { setIsAdding('card'); setShowPlusMenu(false); }} className="w-56 bg-[#4CAF50] text-white px-6 py-4 rounded-3xl font-bold shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all">
                  <Icons.CreditCard size={20} /> {t.addCard}
                </button>
                <button onClick={() => { setIsAdding('document'); setShowPlusMenu(false); }} className="w-56 bg-[#4CAF50] text-white px-6 py-4 rounded-3xl font-bold shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all">
                  <Icons.FileText size={20} /> {t.addDocument}
                </button>
                <button onClick={() => { setIsAdding('contact'); setShowPlusMenu(false); }} className="w-56 bg-[#4CAF50] text-white px-6 py-4 rounded-3xl font-bold shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all">
                  <Icons.Smartphone size={20} /> {t.addContact}
                </button>
                <button onClick={() => setShowPlusMenu(false)} className={`mt-4 w-12 h-12 ${isDark ? 'bg-white/10' : 'bg-black/10'} rounded-full flex items-center justify-center ${isDark ? 'text-white' : 'text-black'} active:scale-90 transition-all shadow-lg`}>
                  <Icons.X size={24} />
                </button>
              </div>
            </div>
          )}

          <nav className={`h-16 border-t flex items-center justify-around px-4 sticky bottom-0 z-[70] pb-safe transition-colors duration-500 ${isDark ? 'bg-[#111] border-white/5' : 'bg-white border-black/5'}`}>
            <button onClick={() => setView('vault')} className={`flex flex-col items-center p-3 transition-colors ${view === 'vault' ? 'text-[#4CAF50]' : (isDark ? 'text-gray-700' : 'text-gray-400')}`}>
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
            <EntryModal 
              t={t} 
              isDark={isDark}
              settings={settings}
              mode={isEditing ? 'edit' : isAdding ? 'add' : 'view'} 
              entry={isEditing || selectedEntry || undefined} 
              addType={isAdding || undefined}
              onClose={() => { setIsAdding(null); setIsEditing(null); setSelectedEntry(null); }}
              onSave={isAdding ? onAddEntry : onEditEntry}
              copy={copy}
            />
          )}
        </div>
      )}

      {isMasterModalOpen && (
        <MasterPasswordModal 
          t={t} 
          isDark={isDark}
          onClose={() => setIsMasterModalOpen(false)} 
          setMasterPassword={handleMasterPasswordChange} 
          masterPassword={masterPassword}
        />
      )}

      {toast && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 bg-[#4CAF50] text-white px-6 py-2 rounded-full text-xs font-bold shadow-2xl z-[100] animate-in fade-in slide-in-from-top-10">
          {toast}
        </div>
      )}
    </div>
  );
};

/* --- Login Screen --- */
const LoginScreen = ({ t, isDark, masterPassword, setMasterPassword, handleLogin, handleKeyFileLogin, setIsMasterModalOpen }: any) => (
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
        <input 
          autoFocus
          type="password"
          placeholder={t.masterPassword}
          value={masterPassword}
          onChange={(e) => setMasterPassword(e.target.value)}
          className={`w-full border rounded-2xl py-4 px-6 text-sm focus:border-[#4CAF50]/40 transition-all outline-none ${isDark ? 'bg-[#1a1a1a] border-white/5 text-white' : 'bg-gray-100 border-gray-200 text-gray-900'}`}
        />
        <button type="submit" className="w-full bg-[#4CAF50] hover:bg-[#45a049] text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2">
          <Icons.Unlock size={18} /> {t.unlockVault}
        </button>
        <button type="button" onClick={() => handleLogin()} className={`w-full font-bold py-4 rounded-2xl flex items-center justify-center gap-2 border transition-all text-sm mt-2 ${isDark ? 'bg-white/5 hover:bg-white/10 text-white border-white/5' : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200'}`}>
          <Icons.Fingerprint size={20} className="text-[#4CAF50]" /> {t.biometricUnlock}
        </button>
        
        <div className="pt-4 space-y-3">
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

/* --- Vault Screen --- */
const VaultScreen = ({ t, isDark, entries, searchQuery, setSearchQuery, activeCategory, setActiveCategory, setSelectedEntry, setIsEditing, copy, deleteEntry, settings, setView }: any) => {
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
      list = list.filter((e: any) => 
        (e.title && e.title.toLowerCase().includes(q)) || 
        (e.username && e.username.toLowerCase().includes(q)) ||
        (e.nickname && e.nickname.toLowerCase().includes(q))
      );
    }
    return list;
  }, [entries, activeCategory, searchQuery]);

  const frequentEntriesFull = entries.filter((e: any) => e.isFrequent);
  const frequentEntries = showMoreFrequent ? frequentEntriesFull : frequentEntriesFull.slice(0, 5);

  const folderCounts: Record<string, number> = {};
  settings.folders.forEach((f: string) => folderCounts[f] = entries.filter((e: any) => e.group === f).length);

  return (
    <div className="flex-1 flex flex-col h-full">
      <header className={`sticky top-0 z-40 h-16 border-b flex items-center px-6 justify-between backdrop-blur-xl transition-colors duration-500 ${isDark ? 'bg-[#111]/90 border-white/5' : 'bg-white/90 border-black/5'}`}>
        <div className="flex-1 max-sm relative">
          <Icons.Search className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-700' : 'text-gray-400'}`} size={16} />
          <input 
            type="text" 
            placeholder={t.searchPlaceholder} 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full border rounded-full py-2.5 pl-12 pr-4 text-xs focus:outline-none focus:border-[#4CAF50]/40 transition-all ${isDark ? 'bg-[#1a1a1a] border-white/5 text-white' : 'bg-gray-100 border-gray-200 text-gray-900'}`}
          />
        </div>
        <button onClick={() => setView('settings')} className={`ml-4 p-2 transition-colors ${isDark ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-gray-900'}`}><Icons.Settings size={22} /></button>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 pb-32">
        {(activeCategory || searchQuery) ? (
          <div className="space-y-4">
            <button onClick={() => { setActiveCategory(null); setSearchQuery(''); }} className="flex items-center gap-2 text-[#4CAF50] text-sm font-bold mb-4">
              <Icons.ChevronLeft size={18} /> {searchQuery ? 'Back' : activeCategory.val}
            </button>
            {filteredEntries.map((entry: any) => (
              <EntryItem key={entry.id} isDark={isDark} entry={entry} isExpired={isExpired(entry)} t={t} setSelectedEntry={setSelectedEntry} setIsEditing={setIsEditing} copy={copy} deleteEntry={deleteEntry} />
            ))}
          </div>
        ) : (
          <>
            <section>
              <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2 px-1 ${isDark ? 'text-gray-700' : 'text-gray-400'}`}><Icons.Star size={12}/> {t.frequentHeader}</h3>
              <div className="space-y-2">
                {frequentEntries.map((entry: any) => (
                  <EntryItem key={entry.id} isDark={isDark} entry={entry} isExpired={isExpired(entry)} t={t} setSelectedEntry={setSelectedEntry} setIsEditing={setIsEditing} copy={copy} deleteEntry={deleteEntry} />
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
              <div className="space-y-2">
                {['login', 'card', 'document', 'contact'].map(id => (
                  <button key={id} onClick={() => setActiveCategory({ type: 'type', val: id })} className={`w-full flex items-center justify-between p-4 rounded-2xl border hover:border-[#4CAF50]/30 transition-all active:scale-[0.98] ${isDark ? 'bg-[#161616] border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
                    <div className="flex items-center gap-3">
                      <div className="text-[#4CAF50]">
                        {id === 'login' ? <Icons.User size={18}/> : id === 'card' ? <Icons.CreditCard size={18}/> : id === 'contact' ? <Icons.Smartphone size={18}/> : <Icons.FileText size={18}/>}
                      </div>
                      <span className={`text-sm font-bold capitalize ${isDark ? 'text-white' : 'text-gray-800'}`}>{t[`type${id.charAt(0).toUpperCase() + id.slice(1)}` as keyof typeof t] || id}</span>
                    </div>
                    <span className={`text-[11px] font-bold w-8 h-8 flex items-center justify-center rounded-xl ${isDark ? 'text-gray-500 bg-white/5' : 'text-gray-400 bg-gray-100'}`}>{entries.filter((e: any) => e.type === id).length}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className={`border rounded-3xl p-0.5 shadow-lg ${isDark ? 'bg-[#161616] border-white/5' : 'bg-white border-gray-200'}`}>
              <button 
                onClick={() => setIsFoldersOpen(!isFoldersOpen)}
                className="w-full flex items-center justify-between py-3 px-6"
              >
                <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ${isDark ? 'text-gray-700' : 'text-gray-400'}`}><Icons.Folder size={12}/> {t.foldersHeader}</h3>
                <Icons.ChevronDown size={22} className={`transition-transform duration-300 ${isDark ? 'text-gray-500' : 'text-gray-400'} ${isFoldersOpen ? '' : '-rotate-90'}`} />
              </button>
              
              {isFoldersOpen && (
                <div className="space-y-1 px-1.5 pb-2 animate-in slide-in-from-top-1 duration-200">
                  {settings.folders.map((f: string) => (
                    <button key={f} onClick={() => setActiveCategory({ type: 'folder', val: f })} className={`w-full flex items-center justify-between py-2 px-4 rounded-xl border border-transparent hover:border-[#4CAF50]/10 transition-all active:scale-[0.98] ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
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

/* --- Entry Item --- */
const EntryItem = ({ isDark, entry, isExpired, t, setSelectedEntry, setIsEditing, copy, deleteEntry }: any) => (
  <div 
    onClick={() => setSelectedEntry(entry)}
    className={`border rounded-2xl p-4 flex items-center justify-between group hover:border-[#4CAF50]/30 transition-all cursor-pointer ${isDark ? 'bg-[#181818]' : 'bg-white shadow-sm'} ${isExpired ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.15)]' : (isDark ? 'border-white/5' : 'border-gray-200')}`}
  >
    <div className="flex items-center gap-3 overflow-hidden">
      <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${isExpired ? 'text-red-500' : 'text-[#4CAF50]'} ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}>
        {entry.type === 'login' ? <Icons.User size={20} /> : entry.type === 'card' ? <Icons.CreditCard size={20} /> : entry.type === 'contact' ? <Icons.Smartphone size={20} /> : <Icons.FileText size={20} />}
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
      <button onClick={(e) => { e.stopPropagation(); setIsEditing(entry); }} className="p-2 text-gray-500 hover:text-[#4CAF50] transition-colors"><Icons.Pencil size={16} /></button>
      <button onClick={(e) => { e.stopPropagation(); copy(entry.password || entry.cardNumber || entry.phone || entry.idNumber || ''); }} className="p-2 text-gray-500 hover:text-[#4CAF50] transition-colors"><Icons.Copy size={16} /></button>
      <button onClick={(e) => { e.stopPropagation(); deleteEntry(entry.id); }} className="p-2 text-gray-500 hover:text-red-500 transition-colors"><Icons.Trash2 size={16} /></button>
    </div>
  </div>
);

/* --- Master Password Modal --- */
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
        <div className={`w-full max-w-md rounded-[2.5rem] border p-8 space-y-6 shadow-2xl scale-in-center ${isDark ? 'bg-[#121212] border-white/10' : 'bg-white border-black/5'}`}>
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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[120] flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className={`w-full max-w-md rounded-[2.5rem] border p-8 space-y-6 shadow-2xl scale-in-center ${isDark ? 'bg-[#121212] border-white/10' : 'bg-white border-black/5'}`}>
        <div className="flex justify-between items-center">
          <h2 className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>{t.createMasterPass}</h2>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-[#4CAF50]"><Icons.X size={24}/></button>
        </div>
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="relative">
              <input 
                type={showMP ? "text" : "password"} 
                placeholder={t.newMasterPass} 
                value={newMP} 
                onChange={e => { setNewMP(e.target.value); setIsGenerated(false); }} 
                className={`w-full border rounded-2xl py-4 pl-12 pr-24 text-sm outline-none transition-all ${newMP && !passwordRegex.test(newMP) ? 'border-red-500/50' : (isDark ? 'bg-[#1a1a1a] border-white/5 text-white focus:border-[#4CAF50]/40' : 'bg-gray-100 border-gray-200 text-gray-900 focus:border-[#4CAF50]/40')}`}
              />
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
                <input 
                  type={showConfirmMP ? "text" : "password"} 
                  placeholder={t.confirmMasterPass} 
                  value={confirmMP} 
                  onChange={e => setConfirmMP(e.target.value)} 
                  className={`w-full border rounded-2xl py-4 px-6 text-sm outline-none transition-all ${confirmMP && newMP !== confirmMP ? 'border-red-500/50' : (isDark ? 'bg-[#1a1a1a] border-white/5 text-white focus:border-[#4CAF50]/40' : 'bg-gray-100 border-gray-200 text-gray-900 focus:border-[#4CAF50]/40')}`}
                />
                <button onClick={() => setShowConfirmMP(!showConfirmMP)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-[#4CAF50]">{showConfirmMP ? <Icons.EyeOff size={16}/> : <Icons.Eye size={16}/>}</button>
              </div>
              {confirmMP && newMP !== confirmMP && <p className="text-[10px] text-red-500 font-bold px-1">{t.passwordMismatch}</p>}
            </div>
          )}
          <button 
            onClick={handleSubmit} 
            disabled={!passwordRegex.test(newMP) || (!isGenerated && newMP !== confirmMP) || isProcessing}
            className="w-full bg-[#4CAF50] text-white py-4 rounded-3xl font-bold uppercase tracking-widest text-xs shadow-lg active:scale-95 disabled:opacity-30 disabled:grayscale flex items-center justify-center"
          >
            {isProcessing ? <Icons.RefreshCw className="animate-spin" size={18}/> : t.save}
          </button>
        </div>
      </div>
    </div>
  );
};

/* --- Settings Screen --- */
const SettingsScreen = ({ t, isDark, settings, setSettings, handleLock, setView, setIsMasterModalOpen, masterPassword, handleImport, handleExport }: any) => {
  const [newF, setNewF] = useState('');
  const [newSub, setNewSub] = useState('');
  const [selectedRoot, setSelectedRoot] = useState('');

  const exportKeyFile = async () => {
    if (!masterPassword) { alert('Vui lòng tạo mật khẩu chủ trước'); return; }
    const encrypted = await SecurityService.encrypt(masterPassword, "SECUREPASS_INTERNAL_KEYFILE_SEED");
    const blob = new Blob([JSON.stringify(encrypted)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `master_key.vpass`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAddFolder = () => {
    if(!newF) return;
    setSettings({...settings, folders: [...settings.folders, newF]});
    setNewF('');
  };

  const handleDeleteFolder = (folder: string) => {
    if (confirm(`Xóa thư mục "${folder}" và tất cả thư mục con liên quan?`)) {
      const { [folder]: _, ...remainingSubs } = settings.subFolders;
      setSettings({
        ...settings,
        folders: settings.folders.filter(f => f !== folder),
        subFolders: remainingSubs
      });
    }
  };

  const handleAddSubFolder = () => {
    if(!newSub || !selectedRoot) return;
    const currentSubs = settings.subFolders[selectedRoot] || [];
    setSettings({
      ...settings,
      subFolders: {
        ...settings.subFolders,
        [selectedRoot]: [...currentSubs, newSub]
      }
    });
    setNewSub('');
  };

  const handleDeleteSubFolder = (root: string, sub: string) => {
    const currentSubs = settings.subFolders[root] || [];
    setSettings({
      ...settings,
      subFolders: {
        ...settings.subFolders,
        [root]: currentSubs.filter(s => s !== sub)
      }
    });
  };

  const resetVault = () => {
    if (confirm(t.resetWarning)) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <header className={`sticky top-0 z-40 h-16 border-b flex items-center px-6 justify-between backdrop-blur-xl transition-colors duration-500 ${isDark ? 'bg-[#111]/90 border-white/5' : 'bg-white/90 border-black/5'}`}>
        <button onClick={() => setView('vault')} className={`p-2 transition-colors ${isDark ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-gray-900'}`}><Icons.ChevronLeft size={24} /></button>
        <h2 className={`text-lg font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>{t.settingsTab}</h2>
        <div className="w-10"></div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 pb-32">
        <div className="max-w-xl mx-auto space-y-6">
          <section className={`rounded-[2.5rem] p-8 border text-center shadow-lg transition-colors duration-500 ${isDark ? 'bg-[#161616] border-white/5' : 'bg-white border-gray-200'}`}>
            <h4 className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>{t.appTitle}</h4>
            <p className="text-[11px] text-gray-600 font-medium italic">"{t.safeQuote}"</p>
            <div className={`h-px w-full my-2 ${isDark ? 'bg-white/5' : 'bg-gray-100'}`} />
            <div className="space-y-1">
              <p className={`text-[9px] font-bold uppercase tracking-widest ${isDark ? 'text-gray-700' : 'text-gray-400'}`}>{t.version}</p>
              <p className={`text-[13px] font-bold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{t.createdBy}</p>
              <p className="text-[13px] text-[#4CAF50] font-bold">{t.contactInfo}</p>
            </div>
          </section>

          {/* Restored Master Password Management */}
          <section className={`rounded-[2.5rem] p-6 border shadow-xl transition-colors duration-500 ${isDark ? 'bg-[#161616] border-white/5' : 'bg-white border-gray-200'}`}>
            <h3 className="text-[10px] font-black text-[#4CAF50] uppercase tracking-widest flex items-center gap-2 mb-4"><Icons.Lock size={14}/> {t.createMasterPass}</h3>
            <button onClick={() => setIsMasterModalOpen(true)} className="w-full bg-[#4CAF50] text-white py-4 rounded-2xl font-bold text-sm shadow-lg active:scale-95 flex items-center justify-center gap-2 transition-all">
              <Icons.Shield size={18}/> {t.changeMasterPass}
            </button>
          </section>

          <section className={`rounded-[2.5rem] p-6 border shadow-xl transition-colors duration-500 ${isDark ? 'bg-[#161616] border-white/5' : 'bg-white border-gray-200'}`}>
            <h3 className="text-[10px] font-black text-[#4CAF50] uppercase tracking-widest flex items-center gap-2 mb-4 px-1"><Icons.Folder size={14}/> {t.foldersHeader}</h3>
            <div className="space-y-4">
              <div className="flex gap-2">
                <input value={newF} onChange={e => setNewF(e.target.value)} placeholder={t.settingsFolder} className={`flex-1 border rounded-2xl px-4 py-3 text-sm focus:border-[#4CAF50]/30 outline-none transition-all ${isDark ? 'bg-black/30 border-white/5 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`} />
                <button onClick={handleAddFolder} className="bg-[#4CAF50] p-3 rounded-2xl text-white active:scale-95"><Icons.Plus size={20}/></button>
              </div>

              <div className="space-y-2 max-h-40 overflow-y-auto">
                {settings.folders.map(f => (
                  <div key={f} className={`flex items-center justify-between p-3 border rounded-2xl group transition-all ${isDark ? 'bg-black/20 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                    <span className={`text-[11px] font-bold truncate pr-4 ${isDark ? 'text-white/70' : 'text-gray-700'}`}>{f}</span>
                    <button onClick={() => handleDeleteFolder(f)} className="p-2 text-gray-700 hover:text-red-500 transition-colors"><Icons.Trash2 size={16}/></button>
                  </div>
                ))}
              </div>

              <div className={`pt-4 border-t space-y-3 ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
                <p className={`text-[10px] font-black uppercase tracking-widest px-1 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{t.settingsSubFolder}</p>
                <div className="space-y-2">
                   <select 
                    value={selectedRoot} 
                    onChange={e => setSelectedRoot(e.target.value)} 
                    className={`w-full border rounded-2xl px-4 py-3 text-sm outline-none transition-all ${isDark ? 'bg-black/30 border-white/5' : 'bg-gray-50 border-gray-200'} ${selectedRoot === "" ? "text-gray-500" : (isDark ? "text-white" : "text-gray-900")}`}
                   >
                     <option value="" className={isDark ? 'bg-[#161616]' : 'bg-white'}>--Chọn thư mục gốc--</option>
                     {settings.folders.map(f => <option key={f} value={f} className={isDark ? 'bg-[#161616]' : 'bg-white'}>{f}</option>)}
                   </select>
                   <div className="flex gap-2">
                    <input value={newSub} onChange={e => setNewSub(e.target.value)} placeholder={t.settingsSubFolder} className={`flex-1 border rounded-2xl px-4 py-3 text-sm focus:border-[#4CAF50]/30 outline-none transition-all ${isDark ? 'bg-black/30 border-white/5 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`} />
                    <button onClick={handleAddSubFolder} className="bg-[#4CAF50] p-3 rounded-2xl text-white active:scale-95"><Icons.Plus size={20}/></button>
                  </div>
                </div>

                {selectedRoot && (settings.subFolders[selectedRoot] || []).length > 0 && (
                  <div className="space-y-2 max-h-40 overflow-y-auto mt-2">
                    {(settings.subFolders[selectedRoot] || []).map(sub => (
                      <div key={sub} className={`flex items-center justify-between p-2.5 border rounded-xl transition-all ${isDark ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                        <span className={`text-[10px] font-medium ${isDark ? 'text-white/60' : 'text-gray-600'}`}>{sub}</span>
                        <button onClick={() => handleDeleteSubFolder(selectedRoot, sub)} className="p-1.5 text-gray-700 hover:text-red-500 transition-colors"><Icons.Trash2 size={14}/></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className={`rounded-[2.5rem] p-6 border shadow-xl transition-colors duration-500 ${isDark ? 'bg-[#161616] border-white/5' : 'bg-white border-gray-200'}`}>
            <h3 className="text-[10px] font-black text-[#4CAF50] uppercase tracking-widest flex items-center gap-2"><Icons.Settings size={14}/> {t.securitySettings}</h3>
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>{t.autoLock}</span>
                <button onClick={() => setSettings({...settings, autoLockEnabled: !settings.autoLockEnabled})} className={`w-12 h-6 rounded-full relative transition-all ${settings.autoLockEnabled ? 'bg-[#4CAF50]' : 'bg-gray-300'}`}><div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all ${settings.autoLockEnabled ? 'right-1' : 'left-1'}`}/></button>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>{t.clearClipboard}</span>
                <button onClick={() => setSettings({...settings, clearClipboardEnabled: !settings.clearClipboardEnabled})} className={`w-12 h-6 rounded-full relative transition-all ${settings.clearClipboardEnabled ? 'bg-[#4CAF50]' : 'bg-gray-300'}`}><div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all ${settings.clearClipboardEnabled ? 'right-1' : 'left-1'}`}/></button>
              </div>
            </div>

            <div className={`mt-6 pt-4 border-t space-y-4 ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
              <h4 className="text-[10px] font-black text-[#4CAF50] uppercase tracking-widest flex items-center gap-2"><Icons.Monitor size={14}/> {t.themeLabel}</h4>
              <div className="flex gap-2">
                <button 
                  onClick={() => setSettings({...settings, theme: 'light'})}
                  className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2 ${settings.theme === 'light' ? 'bg-[#4CAF50] text-white shadow-lg' : (isDark ? 'bg-white/5 text-gray-500' : 'bg-gray-100 text-gray-400')}`}
                >
                  <Icons.Eye size={14}/> {t.themeLight}
                </button>
                <button 
                  onClick={() => setSettings({...settings, theme: 'dark'})}
                  className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2 ${settings.theme === 'dark' ? 'bg-[#4CAF50] text-white shadow-lg' : (isDark ? 'bg-white/5 text-gray-500' : 'bg-gray-100 text-gray-400')}`}
                >
                  <Icons.EyeOff size={14}/> {t.themeDark}
                </button>
              </div>
            </div>

            <div className={`mt-6 pt-4 border-t space-y-4 ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
              <h4 className="text-[10px] font-black text-[#4CAF50] uppercase tracking-widest flex items-center gap-2"><Icons.Globe size={14}/> {t.languageLabel}</h4>
              <div className="flex gap-2">
                <button 
                  onClick={() => setSettings({...settings, language: 'vi'})}
                  className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2 ${settings.language === 'vi' ? 'bg-[#4CAF50] text-white shadow-lg' : (isDark ? 'bg-white/5 text-gray-500' : 'bg-gray-100 text-gray-400')}`}
                >
                  {t.langVi}
                </button>
                <button 
                  onClick={() => setSettings({...settings, language: 'en'})}
                  className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2 ${settings.language === 'en' ? 'bg-[#4CAF50] text-white shadow-lg' : (isDark ? 'bg-white/5 text-gray-500' : 'bg-gray-100 text-gray-400')}`}
                >
                  {t.langEn}
                </button>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className={`text-[10px] font-black uppercase tracking-widest px-1 ${isDark ? 'text-gray-700' : 'text-gray-400'}`}>{t.dataManagement}</h3>
            <div className="grid grid-cols-2 gap-4">
               <button onClick={handleExport} className={`flex flex-col items-center justify-center p-6 border rounded-[2.5rem] hover:border-[#4CAF50]/30 transition-all shadow-sm ${isDark ? 'bg-[#161616] border-white/5' : 'bg-white border-gray-200'}`}>
                <Icons.Upload className="text-[#4CAF50] mb-2.5" size={24} />
                <span className={`text-[9px] font-black uppercase tracking-[0.2em] text-center ${isDark ? 'text-white' : 'text-gray-800'}`}>{t.exportDb}</span>
              </button>
              <label className={`flex flex-col items-center justify-center p-6 border rounded-[2.5rem] hover:border-[#4CAF50]/30 transition-all cursor-pointer shadow-sm ${isDark ? 'bg-[#161616] border-white/5' : 'bg-white border-gray-200'}`}>
                <Icons.Download className="text-[#4CAF50] mb-2.5" size={24} />
                <span className={`text-[9px] font-black uppercase tracking-[0.2em] text-center ${isDark ? 'text-white' : 'text-gray-800'}`}>{t.importDb}</span>
                <input type="file" accept=".vpass" onChange={handleImport} className="hidden" />
              </label>
            </div>
          </section>
          
          <div className="space-y-3">
            <button onClick={handleLock} className={`w-full font-black text-[10px] uppercase tracking-[0.3em] py-5 rounded-3xl border active:scale-95 transition-all ${isDark ? 'bg-white/5 text-gray-500 border-white/5' : 'bg-gray-200 text-gray-600 border-gray-300'}`}>LOG OUT / LOCK APP</button>
            <button onClick={resetVault} className={`w-full bg-red-500/5 hover:bg-red-500/10 text-red-500 font-black text-[10px] uppercase tracking-[0.3em] py-5 rounded-3xl border border-red-500/10 active:scale-95 transition-all`}>{t.resetVault}</button>
          </div>
        </div>
      </main>
    </div>
  );
};

/* --- Entry Modal --- */
const EntryModal = ({ t, isDark, settings, mode, entry, onClose, onSave, copy, addType }: any) => {
  const [localData, setLocalData] = useState<any>(() => {
    if (entry) return { ...entry };
    return { 
      type: addType || 'login', group: '---', title: '', username: '', password: '', 
      cardNumber: '', cardHolder: '', cardType: '', expiryMonth: '', expiryYear: '',
      nickname: '', fullName: '', phone: '', email: '', address: '', 
      content: '', notes: '', strength: 0, pin: '', authCode: '', recoveryInfo: '', url: '', expiryInterval: '6m',
      documentType: ''
    };
  });
  
  const [showPass, setShowPass] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const isView = mode === 'view';

  const typeLabels: Record<string, string> = {
    login: t.typeLogin,
    card: t.typeCard,
    contact: t.typeContact,
    document: t.typeDocument
  };

  const currentSubFolders = settings.subFolders[localData.group] || [];

  const copyableField = (label: string, field: string, value: string, type: string = "text", placeholder: string = "", validation?: (val: string) => string | null) => {
    const error = validation ? validation(value) : null;
    return (
      <div className="space-y-1">
        <label className={`text-[9px] font-black uppercase tracking-widest ml-1 mb-1.5 block ${isDark ? 'text-gray-700' : 'text-gray-400'}`}>{label}</label>
        <div className="relative">
          <input 
            disabled={isView} type={type} value={value} 
            onChange={e => setLocalData({...localData, [field]: e.target.value})} 
            className={`w-full border rounded-2xl py-4 pl-6 pr-14 text-sm focus:border-[#4CAF50]/40 outline-none transition-all disabled:opacity-70 ${isDark ? 'bg-[#1a1a1a] text-white placeholder-gray-700' : 'bg-gray-100 text-gray-900 placeholder-gray-400'} ${error ? 'border-red-500/50' : (isDark ? 'border-white/5' : 'border-gray-200')}`}
            placeholder={placeholder}
          />
          <button type="button" onClick={() => copy(value)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-[#4CAF50] transition-colors">
            <Icons.Copy size={18}/>
          </button>
        </div>
        {error && <p className="text-[9px] text-red-500 font-bold px-1 mt-1">{error}</p>}
      </div>
    );
  };

  const renderDocumentFields = () => {
    const isResidence = localData.documentType === 'residence_card';
    switch (localData.documentType) {
      case 'id_card':
      case 'residence_card':
        return (
          <>
            {copyableField(isResidence ? 'Số' : t.idNumber, 'idNumber', localData.idNumber || "", "text", "123456789012", val => val.length > 12 ? t.idNo12Warning : null)}
            {copyableField(t.fullName, 'fullName', localData.fullName || "", "text", "LÊ ĐỨC LONG", val => (val && val !== val.toUpperCase()) ? t.uppercaseWarning : null)}
            {copyableField(t.dob, 'dob', localData.dob || "", "text", "dd/mm/yyyy")}
            {copyableField(t.hometown, 'hometown', localData.hometown || "", "text", "Kỳ Châu, Kỳ Anh, Hà Tĩnh")}
            {copyableField(t.residence, 'residence', localData.residence || "", "text", "P.Sông Trí, Hà Tĩnh")}
            {copyableField('Có giá trị đến ngày', 'expiryDate', localData.expiryDate || "", "text", "dd/mm/yyyy")}
            {!isResidence && copyableField(t.recognition, 'recognition', localData.recognition || "", "text", "Nốt ruồi bên sau mép ...")}
            {copyableField(t.issuer, 'issuer', localData.issuer || "", "text", "Cục trưởng cục cảnh sát QLHC về TTXH")}
            {copyableField(t.issueDate, 'issueDate', localData.issueDate || "", "text", "dd/mm/yyyy")}
          </>
        );
      case 'health_insurance':
        return (
          <>
            {copyableField('Mã số', 'idNumber', localData.idNumber || "", "text", "1234567890", val => val.length > 10 ? t.idNo10Warning : null)}
            {copyableField(t.fullName, 'fullName', localData.fullName || "", "text", "LÊ ĐỨC LONG", val => (val && val !== val.toUpperCase()) ? t.uppercaseWarning : null)}
            {copyableField(t.dob, 'dob', localData.dob || "", "text", "dd/mm/yyyy")}
            <div className="space-y-1">
              <label className={`text-[9px] font-black uppercase tracking-widest ml-1 mb-1.5 block ${isDark ? 'text-gray-700' : 'text-gray-400'}`}>{t.gender}</label>
              <select 
                disabled={isView} 
                value={localData.gender} 
                onChange={e => setLocalData({...localData, gender: e.target.value})} 
                className={`w-full border rounded-2xl py-4 px-6 text-sm outline-none transition-all ${isDark ? 'bg-[#1a1a1a] border-white/5 text-white' : 'bg-gray-100 border-gray-200 text-gray-900'} ${!isView && !localData.gender ? 'text-gray-500' : ''}`}
              >
                <option value="" className={isDark ? 'bg-[#161616]' : 'bg-white'}>{t.chooseGender}</option>
                <option value="Nam" className={isDark ? 'bg-[#161616]' : 'bg-white'}>Nam</option>
                <option value="Nữ" className={isDark ? 'bg-[#161616]' : 'bg-white'}>Nữ</option>
                <option value="Khác" className={isDark ? 'bg-[#161616]' : 'bg-white'}>Khác</option>
              </select>
            </div>
            {copyableField(t.hospital, 'hospital', localData.hospital || "", "text", "Bệnh viện đa khoa...")}
            {copyableField('Thời hạn (năm)', 'expiryYear', localData.expiryYear || "", "text", "5")}
            {copyableField('Ngày bắt đầu', 'issueDate', localData.issueDate || "", "text", "dd/mm/yyyy")}
            {copyableField('Nơi cấp, đổi thẻ BHYT', 'issuer', localData.issuer || "", "text", "BHXH Hà Tĩnh")}
          </>
        );
      case 'driving_license':
        return (
          <>
            {copyableField('Số/No', 'idNumber', localData.idNumber || "", "text", "123456789012", val => val.length > 12 ? t.idNo12Warning : null)}
            {copyableField(t.fullName, 'fullName', localData.fullName || "", "text", "LÊ ĐỨC LONG", val => (val && val !== val.toUpperCase()) ? t.uppercaseWarning : null)}
            {copyableField(t.dob, 'dob', localData.dob || "", "text", "dd/mm/yyyy")}
            {copyableField('Quốc tịch', 'nationality', localData.nationality || "", "text", "Việt Nam")}
            {copyableField(t.residence, 'residence', localData.residence || "", "text", "Hà Tĩnh")}
            <div className="space-y-1">
              <label className={`text-[9px] font-black uppercase tracking-widest ml-1 mb-1.5 block ${isDark ? 'text-gray-700' : 'text-gray-400'}`}>{t.class}</label>
              <select 
                disabled={isView} 
                value={localData.class} 
                onChange={e => {
                  const isNoTerm = ['A1', 'A2', 'A3'].includes(e.target.value);
                  setLocalData({...localData, class: e.target.value, expiryDate: isNoTerm ? t.indefinite : localData.expiryDate});
                }} 
                className={`w-full border rounded-2xl py-4 px-6 text-sm outline-none transition-all ${isDark ? 'bg-[#1a1a1a] border-white/5 text-white' : 'bg-gray-100 border-gray-200 text-gray-900'} ${!isView && !localData.class ? 'text-gray-500' : ''}`}
              >
                <option value="" className={isDark ? 'bg-[#161616]' : 'bg-white'}>{t.chooseClass}</option>
                {['A1', 'A2', 'A3', 'B1', 'B2', 'C', 'D', 'E', 'Khác'].map(c => <option key={c} value={c} className={isDark ? 'bg-[#161616]' : 'bg-white'}>{c}</option>)}
              </select>
            </div>
            {copyableField('Thời hạn', 'expiryDate', localData.expiryDate || "", "text", "dd/mm/yyyy")}
            {copyableField('Cơ quan cấp', 'issuer', localData.issuer || "", "text", "Sở Giao thông vận tải...")}
            {copyableField('Ngày cấp', 'issueDate', localData.issueDate || "", "text", "dd/mm/yyyy")}
          </>
        );
      case 'passport':
        return (
          <>
             <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1"><label className={`text-[9px] font-black uppercase tracking-widest ml-1 mb-1.5 block ${isDark ? 'text-gray-700' : 'text-gray-400'}`}>Loại (Type)</label><input disabled={isView} value={localData.passportType || 'P'} onChange={e => setLocalData({...localData, passportType: e.target.value})} className={`w-full border rounded-2xl py-4 px-6 text-sm outline-none ${isDark ? 'bg-[#1a1a1a] border-white/5 text-white' : 'bg-gray-100 border-gray-200 text-gray-900'}`} /></div>
              <div className="space-y-1"><label className={`text-[9px] font-black uppercase tracking-widest ml-1 mb-1.5 block ${isDark ? 'text-gray-700' : 'text-gray-400'}`}>Mã số (Code)</label><input disabled={isView} value={localData.passportCode || 'VNM'} onChange={e => setLocalData({...localData, passportCode: e.target.value})} className={`w-full border rounded-2xl py-4 px-6 text-sm outline-none ${isDark ? 'bg-[#1a1a1a] border-white/5 text-white' : 'bg-gray-100 border-gray-200 text-gray-900'}`} /></div>
            </div>
            {copyableField('Số hộ chiếu', 'idNumber', localData.idNumber || "", "text", "P1234567")}
            {copyableField(t.fullName, 'fullName', localData.fullName || "", "text", "NGUYEN VAN A")}
            {copyableField('Quốc tịch', 'nationality', localData.nationality || "", "text", "VIỆT NAM / VIETNAMESE")}
            {copyableField(t.dob, 'dob', localData.dob || "", "text", "dd/mm/yyyy")}
            <div className="space-y-1">
              <label className={`text-[9px] font-black uppercase tracking-widest ml-1 mb-1.5 block ${isDark ? 'text-gray-700' : 'text-gray-400'}`}>{t.gender}</label>
              <select 
                disabled={isView} 
                value={localData.gender} 
                onChange={e => setLocalData({...localData, gender: e.target.value})} 
                className={`w-full border rounded-2xl py-4 px-6 text-sm outline-none transition-all ${isDark ? 'bg-[#1a1a1a] border-white/5 text-white' : 'bg-gray-100 border-gray-200 text-gray-900'} ${!isView && !localData.gender ? 'text-gray-500' : ''}`}
              >
                <option value="" className={isDark ? 'bg-[#161616]' : 'bg-white'}>{t.chooseGender}</option>
                <option value="M" className={isDark ? 'bg-[#161616]' : 'bg-white'}>Nam (M)</option>
                <option value="F" className={isDark ? 'bg-[#161616]' : 'bg-white'}>Nữ (F)</option>
              </select>
            </div>
            {copyableField('Số định danh cá nhân', 'pin', localData.pin || "", "text", "12 số Căn cước")}
            {copyableField('Nơi sinh', 'placeOfBirth', localData.placeOfBirth || "", "text", "Hà Tĩnh")}
            {copyableField('Ngày cấp', 'issueDate', localData.issueDate || "", "text", "dd/mm/yyyy")}
            {copyableField('Ngày hết hạn', 'expiryDate', localData.expiryDate || "", "text", "dd/mm/yyyy")}
            {copyableField('Cơ quan cấp', 'issuer', localData.issuer || "", "text", "Cục Quản lý xuất nhập cảnh")}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col animate-in slide-in-from-bottom-5 transition-colors duration-500 ${isDark ? 'bg-[#0d0d0d]' : 'bg-[#f5f5f5]'}`}>
      <header className={`h-16 border-b flex items-center px-4 justify-between transition-colors duration-500 ${isDark ? 'bg-[#111] border-white/5' : 'bg-white border-black/5'}`}>
        <button onClick={onClose} className="p-2 text-gray-500 hover:text-[#4CAF50]"><Icons.ChevronLeft size={24} /></button>
        <h2 className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {localData.type === 'document' ? t.addDocument : typeLabels[localData.type]}
        </h2>
        {!isView ? <button onClick={() => onSave(localData)} className="bg-[#4CAF50] text-white px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase shadow-lg shadow-[#4CAF50]/20">{t.save}</button> : <div className="w-10"/>}
      </header>
      <main className="flex-1 overflow-y-auto p-6 space-y-5 pb-safe">
        <div className="max-w-md mx-auto space-y-4">
          
          {localData.type === 'login' && (
            <>
              <div className="space-y-1">
                <label className={`text-[9px] font-black uppercase tracking-widest ml-1 mb-1.5 block ${isDark ? 'text-gray-700' : 'text-gray-400'}`}>{t.title}*</label>
                <input disabled={isView} value={localData.title} onChange={e => setLocalData({...localData, title: e.target.value})} className={`w-full border rounded-2xl py-4 px-6 text-sm focus:border-[#4CAF50]/40 outline-none ${isDark ? 'bg-[#1a1a1a] border-white/5 text-white' : 'bg-gray-100 border-gray-200 text-gray-900'}`} placeholder={t.loginTitleHint} />
              </div>
              <div className="space-y-1">
                <label className={`text-[9px] font-black uppercase tracking-widest ml-1 mb-1.5 block ${isDark ? 'text-gray-700' : 'text-gray-400'}`}>{t.groupLabel}</label>
                <select disabled={isView} value={localData.group} onChange={e => setLocalData({...localData, group: e.target.value, subGroup: ''})} className={`w-full border rounded-2xl py-4 px-6 text-sm outline-none ${isDark ? 'bg-[#1a1a1a] border-white/5 text-white' : 'bg-gray-100 border-gray-200 text-gray-900'}`}>
                  <option value="---" className={isDark ? 'bg-[#161616]' : 'bg-white'}>---</option>
                  {settings.folders.map(f => <option key={f} value={f} className={isDark ? 'bg-[#161616]' : 'bg-white'}>{f}</option>)}
                </select>
              </div>
              {currentSubFolders.length > 0 && (
                <div className="space-y-1">
                  <label className={`text-[9px] font-black uppercase tracking-widest ml-1 mb-1.5 block ${isDark ? 'text-gray-700' : 'text-gray-400'}`}>{t.subGroupLabel}</label>
                  <select disabled={isView} value={localData.subGroup} onChange={e => setLocalData({...localData, subGroup: e.target.value})} className={`w-full border rounded-2xl py-4 px-6 text-sm outline-none transition-all ${isDark ? 'bg-[#1a1a1a] border-white/5 text-white' : 'bg-gray-100 border-gray-200 text-gray-900'} ${!isView && !localData.subGroup ? 'text-gray-500 font-medium' : ''}`}>
                    <option value="" className={isDark ? 'bg-[#161616]' : 'bg-white'}>-- Chọn nhóm con --</option>
                    {currentSubFolders.map((s: string) => <option key={s} value={s} className={isDark ? 'bg-[#161616]' : 'bg-white'}>{s}</option>)}
                  </select>
                </div>
              )}
              {copyableField(t.username, 'username', localData.username || "")}
              <div className="space-y-1">
                <label className={`text-[9px] font-black uppercase tracking-widest ml-1 mb-1.5 block ${isDark ? 'text-gray-700' : 'text-gray-400'}`}>{t.password}</label>
                <div className="relative">
                  <input disabled={isView} type={showPass ? "text" : "password"} value={localData.password} onChange={e => setLocalData({...localData, password: e.target.value})} className={`w-full border rounded-2xl py-4 pl-6 pr-24 font-mono text-sm outline-none transition-all ${isDark ? 'bg-[#1a1a1a] border-white/5 text-white placeholder-gray-700' : 'bg-gray-100 border-gray-200 text-gray-900 placeholder-gray-400'}`}/>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-gray-600">
                    <button type="button" onClick={() => setShowPass(!showPass)}>{showPass ? <Icons.EyeOff size={18}/> : <Icons.Eye size={18}/>}</button>
                    <button type="button" onClick={() => copy(localData.password)}><Icons.Copy size={18}/></button>
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <label className={`text-[9px] font-black uppercase tracking-widest ml-1 mb-1.5 block ${isDark ? 'text-gray-700' : 'text-gray-400'}`}>{t.expiryInterval}</label>
                <select disabled={isView} value={localData.expiryInterval} onChange={e => setLocalData({...localData, expiryInterval: e.target.value})} className={`w-full border rounded-2xl py-4 px-6 text-sm outline-none transition-all ${isDark ? 'bg-[#1a1a1a] border-white/5 text-white' : 'bg-gray-100 border-gray-200 text-gray-900'} ${!isView && localData.expiryInterval === '6m' ? 'text-gray-500 font-medium' : ''}`}>
                  <option value="1d" className={isDark ? 'bg-[#161616]' : 'bg-white'}>{t.day}</option>
                  <option value="1m" className={isDark ? 'bg-[#161616]' : 'bg-white'}>{t.month}</option>
                  <option value="6m" className={isDark ? 'bg-[#161616]' : 'bg-white'}>{t.sixMonths}</option>
                  <option value="1y" className={isDark ? 'bg-[#161616]' : 'bg-white'}>{t.year}</option>
                </select>
              </div>
              <div className="pt-2">
                <button type="button" onClick={() => setAdvancedOpen(!advancedOpen)} className="flex items-center gap-2 text-[10px] font-black text-[#4CAF50] uppercase tracking-widest px-1">{advancedOpen ? <Icons.ChevronDown size={14}/> : <Icons.ChevronRight size={14}/>} {t.advancedOptions}</button>
                {advancedOpen && (
                  <div className="mt-4 space-y-4 animate-in slide-in-from-top-2">
                    {copyableField(t.pinCode, 'pin', localData.pin || "")}
                    {copyableField(t.authCode, 'authCode', localData.authCode || "")}
                    {copyableField(t.recoveryInfo, 'recoveryInfo', localData.recoveryInfo || "")}
                    <div className="space-y-1">
                      <label className={`text-[9px] font-black uppercase tracking-widest ml-1 mb-1.5 block ${isDark ? 'text-gray-700' : 'text-gray-400'}`}>{t.url}</label>
                      <div className="relative">
                        <input disabled={isView} value={localData.url} onChange={e => setLocalData({...localData, url: e.target.value})} className={`w-full border rounded-2xl py-4 pl-6 pr-14 text-sm outline-none focus:border-[#4CAF50]/30 ${isDark ? 'bg-[#1a1a1a] border-white/5 text-white' : 'bg-gray-100 border-gray-200 text-gray-900'}`} placeholder={t.urlHint} />
                        {localData.url && (
                          <a href={localData.url} target="_blank" className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4CAF50] p-1"><Icons.ExternalLink size={18}/></a>
                        )}
                      </div>
                    </div>
                    <div className="space-y-1"><label className={`text-[9px] font-black uppercase tracking-widest ml-1 mb-1.5 block ${isDark ? 'text-gray-700' : 'text-gray-400'}`}>{t.notes}</label><textarea disabled={isView} rows={4} value={localData.notes} onChange={e => setLocalData({...localData, notes: e.target.value})} className={`w-full border rounded-2xl p-6 text-sm resize-none outline-none focus:border-[#4CAF50]/30 ${isDark ? 'bg-[#1a1a1a] border-white/5 text-white' : 'bg-gray-100 border-gray-200 text-gray-900'}`} /></div>
                  </div>
                )}
              </div>
            </>
          )}

          {localData.type === 'card' && (
            <>
              <div className="space-y-1">
                <label className={`text-[9px] font-black uppercase tracking-widest ml-1 mb-1.5 block ${isDark ? 'text-gray-700' : 'text-gray-400'}`}>{t.title}</label>
                <select disabled={isView} value={localData.title} onChange={e => setLocalData({...localData, title: e.target.value})} className={`w-full border rounded-2xl py-4 px-6 text-sm outline-none transition-all ${isDark ? 'bg-[#1a1a1a] border-white/5 text-white' : 'bg-gray-100 border-gray-200 text-gray-900'} ${!isView && !localData.title ? 'text-gray-500 font-medium' : ''}`}>
                  <option value="" className={isDark ? 'bg-[#161616]' : 'bg-white'}>-- Chọn ngân hàng --</option>
                  {(settings.subFolders['Ngân hàng'] || []).map((b: string) => <option key={b} value={b} className={isDark ? 'bg-[#161616]' : 'bg-white'}>{b}</option>)}
                  <option value="Khác" className={isDark ? 'bg-[#161616]' : 'bg-white'}>Khác</option>
                </select>
              </div>
              {localData.title === 'Khác' && (
                <div className="space-y-1">
                  <label className={`text-[9px] font-black uppercase tracking-widest ml-1 mb-1.5 block ${isDark ? 'text-gray-700' : 'text-gray-400'}`}>{t.title} (Chi tiết)</label>
                  <input disabled={isView} value={localData.customTitle} onChange={e => setLocalData({...localData, customTitle: e.target.value})} className={`w-full border rounded-2xl py-4 px-6 text-sm outline-none ${isDark ? 'bg-[#1a1a1a] border-white/5 text-white' : 'bg-gray-100 border-gray-200 text-gray-900'}`} placeholder="Thẻ Siêu thị Winmart, Thẻ tích điểm ..." />
                </div>
              )}
              {copyableField(t.cardNumber, 'cardNumber', localData.cardNumber || "", "text", "0000 0000 0000 0000")}
              {copyableField(t.cardName, 'cardHolder', localData.cardHolder || "", "text", t.cardNameHint)}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className={`text-[9px] font-black uppercase tracking-widest ml-1 mb-1.5 block ${isDark ? 'text-gray-700' : 'text-gray-400'}`}>{t.cardType}</label>
                  <select 
                    disabled={isView} 
                    value={localData.cardType} 
                    onChange={e => setLocalData({...localData, cardType: e.target.value})} 
                    className={`w-full border rounded-2xl py-4 px-6 text-sm outline-none transition-all ${isDark ? 'bg-[#1a1a1a] border-white/5 text-white' : 'bg-gray-100 border-gray-200 text-gray-900'} ${!isView && !localData.cardType ? 'text-gray-500' : ''}`}
                  >
                    <option value="" className={isDark ? 'bg-[#161616]' : 'bg-white'}>{t.chooseCardType}</option>
                    <option value="Thường" className={isDark ? 'bg-[#161616]' : 'bg-white'}>Thường</option>
                    <option value="Visa" className={isDark ? 'bg-[#161616]' : 'bg-white'}>Visa</option>
                    <option value="Debit" className={isDark ? 'bg-[#161616]' : 'bg-white'}>Debit</option>
                    <option value="Master" className={isDark ? 'bg-[#161616]' : 'bg-white'}>Master</option>
                    <option value="Tích điểm" className={isDark ? 'bg-[#161616]' : 'bg-white'}>Tích điểm</option>
                    <option value="Gold" className={isDark ? 'bg-[#161616]' : 'bg-white'}>Gold</option>
                    <option value="Diamon" className={isDark ? 'bg-[#161616]' : 'bg-white'}>Diamon</option>
                    <option value="Khác" className={isDark ? 'bg-[#161616]' : 'bg-white'}>Khác</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className={`text-[9px] font-black uppercase tracking-widest ml-1 mb-1.5 block ${isDark ? 'text-gray-700' : 'text-gray-400'}`}>{t.expiryMonth}</label>
                  <input disabled={isView} value={localData.expiryMonth} onChange={e => setLocalData({...localData, expiryMonth: e.target.value})} className={`w-full border rounded-2xl py-4 px-6 text-sm outline-none ${isDark ? 'bg-[#1a1a1a] border-white/5 text-white' : 'bg-gray-100 border-gray-200 text-gray-900'}`} placeholder="MM/YY" />
                </div>
              </div>
              <div className="space-y-1"><label className={`text-[9px] font-black uppercase tracking-widest ml-1 mb-1.5 block ${isDark ? 'text-gray-700' : 'text-gray-400'}`}>{t.notes}</label><textarea disabled={isView} rows={3} value={localData.notes} onChange={e => setLocalData({...localData, notes: e.target.value})} className={`w-full border rounded-2xl p-6 text-sm resize-none outline-none focus:border-[#4CAF50]/30 ${isDark ? 'bg-[#1a1a1a] border-white/5 text-white' : 'bg-gray-100 border-gray-200 text-gray-900'}`} /></div>
            </>
          )}
          
          {localData.type === 'contact' && (
            <>
              <div className="space-y-1">
                <label className={`text-[9px] font-black uppercase tracking-widest ml-1 mb-1.5 block ${isDark ? 'text-gray-700' : 'text-gray-400'}`}>{t.nickname} <span className="text-red-500 font-bold">*</span></label>
                <input disabled={isView} value={localData.nickname} onChange={e => setLocalData({...localData, nickname: e.target.value, title: e.target.value})} className={`w-full border rounded-2xl py-4 px-6 text-sm focus:border-[#4CAF50]/40 outline-none ${isDark ? 'bg-[#1a1a1a] border-white/5 text-white' : 'bg-gray-100 border-gray-200 text-gray-900'}`} placeholder={t.nicknameHint} />
              </div>
              <div className="space-y-1">
                <label className={`text-[9px] font-black uppercase tracking-widest ml-1 mb-1.5 block ${isDark ? 'text-gray-700' : 'text-gray-400'}`}>{t.fullName}</label>
                <input disabled={isView} value={localData.fullName} onChange={e => setLocalData({...localData, fullName: e.target.value})} className={`w-full border rounded-2xl py-4 px-6 text-sm outline-none ${isDark ? 'bg-[#1a1a1a] border-white/5 text-white' : 'bg-gray-100 border-gray-200 text-gray-900'}`} placeholder={t.fullNameHint} />
              </div>
              {copyableField(t.phone, 'phone', localData.phone || "")}
              {copyableField(t.email, 'email', localData.email || "")}
              {copyableField(t.address, 'address', localData.address || "", "text", t.addressHint)}
              <div className="space-y-1"><label className={`text-[9px] font-black uppercase tracking-widest ml-1 mb-1.5 block ${isDark ? 'text-gray-700' : 'text-gray-400'}`}>{t.notes}</label><textarea disabled={isView} rows={3} value={localData.notes} onChange={e => setLocalData({...localData, notes: e.target.value})} className={`w-full border rounded-2xl p-6 text-sm resize-none outline-none focus:border-[#4CAF50]/30 ${isDark ? 'bg-[#1a1a1a] border-white/5 text-white' : 'bg-gray-100 border-gray-200 text-gray-900'}`} /></div>
            </>
          )}

          {localData.type === 'document' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <label className={`text-[9px] font-black uppercase tracking-widest ml-1 mb-1.5 block ${isDark ? 'text-gray-700' : 'text-gray-400'}`}>{t.docType}</label>
                <select 
                  disabled={isView} 
                  value={localData.documentType} 
                  onChange={e => setLocalData({...localData, documentType: e.target.value})} 
                  className={`w-full border rounded-2xl py-4 px-6 text-sm outline-none transition-all ${isDark ? 'bg-[#1a1a1a] border-white/5 text-white' : 'bg-gray-100 border-gray-200 text-gray-900'} ${!isView && !localData.documentType ? 'text-gray-500' : ''}`}
                >
                  <option value="" className={isDark ? 'bg-[#161616]' : 'bg-white'}>{t.chooseDocType}</option>
                  <option value="id_card" className={isDark ? 'bg-[#161616]' : 'bg-white'}>{t.idCard}</option>
                  <option value="health_insurance" className={isDark ? 'bg-[#161616]' : 'bg-white'}>{t.healthInsurance}</option>
                  <option value="driving_license" className={isDark ? 'bg-[#161616]' : 'bg-white'}>{t.drivingLicense}</option>
                  <option value="passport" className={isDark ? 'bg-[#161616]' : 'bg-white'}>{t.passport}</option>
                  <option value="residence_card" className={isDark ? 'bg-[#161616]' : 'bg-white'}>{t.residenceCard}</option>
                </select>
              </div>
              <div className={`h-px w-full my-4 ${isDark ? 'bg-white/5' : 'bg-gray-200'}`} />
              {renderDocumentFields()}
              <div className="space-y-1"><label className={`text-[9px] font-black uppercase tracking-widest ml-1 mb-1.5 block ${isDark ? 'text-gray-700' : 'text-gray-400'}`}>{t.notes}</label><textarea disabled={isView} rows={3} value={localData.notes} onChange={e => setLocalData({...localData, notes: e.target.value})} className={`w-full border rounded-2xl p-6 text-sm resize-none outline-none focus:border-[#4CAF50]/30 ${isDark ? 'bg-[#1a1a1a] border-white/5 text-white' : 'bg-gray-100 border-gray-200 text-gray-900'}`} /></div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

/* --- Generator Screen --- */
const GeneratorScreen = ({ t, isDark, genPass, genConfig, setGenConfig, handleGenerator, copy, genHistory, showGenHistory, setShowGenHistory }: any) => {
  const [showQR, setShowQR] = useState(false);
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <header className={`sticky top-0 z-40 h-16 border-b flex items-center px-6 justify-between backdrop-blur-xl transition-colors duration-500 ${isDark ? 'bg-[#111]/90 border-white/5' : 'bg-white/90 border-black/5'}`}>
        <h2 className={`text-lg font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>{t.generatorTab}</h2>
        <div className="flex items-center gap-1">
          <button onClick={() => setShowGenHistory(!showGenHistory)} className={`p-2 transition-all ${showGenHistory ? 'text-[#4CAF50]' : 'text-gray-500 hover:opacity-100'}`}><Icons.History size={22} /></button>
        </div>
      </header>
      <main className="flex-1 flex overflow-hidden">
        {showGenHistory && (
          <aside className={`w-64 border-r overflow-y-auto p-4 hidden md:block animate-in slide-in-from-left-5 transition-colors duration-500 ${isDark ? 'border-white/5 bg-[#111]/50' : 'border-black/5 bg-white/50'}`}>
            <h3 className={`text-[10px] font-black uppercase tracking-widest mb-4 px-2 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{t.genHistory}</h3>
            <div className="space-y-1.5">
              {genHistory.map((p: string, idx: number) => (
                <button key={idx} onClick={() => copy(p)} className={`w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#4CAF50]/10 transition-all text-left group ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}>
                  <span className="font-mono text-[10px] text-[#4CAF50] truncate pr-2">{p}</span>
                  <Icons.Copy size={12} className="text-gray-600 group-hover:text-[#4CAF50]"/>
                </button>
              ))}
            </div>
          </aside>
        )}

        <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-32">
          <div className="space-y-4 text-center">
            <input readOnly value={genPass} className={`w-full border rounded-3xl p-6 text-center text-xl font-mono text-[#4CAF50] tracking-wider outline-none ${isDark ? 'bg-[#1a1a1a] border-white/5' : 'bg-white border-gray-200'}`} />
            {showQR && genPass && (
              <div className="bg-white p-6 rounded-3xl inline-block mx-auto mb-4 animate-in zoom-in-95"><QRCodeSVG value={genPass} size={180} /></div>
            )}
            <div className="space-y-3">
              <div className="flex gap-3">
                <button onClick={() => copy(genPass)} className={`flex-1 font-bold flex items-center justify-center gap-2 border active:scale-95 transition-all py-4 rounded-3xl ${isDark ? 'bg-white/5 text-white border-white/5' : 'bg-white text-gray-700 border-gray-200 shadow-sm'}`}><Icons.Copy size={18} /> {t.copyPassword}</button>
                <button onClick={handleGenerator} className="bg-[#4CAF50] text-white p-4 rounded-3xl active:scale-95 transition-all shadow-lg shadow-[#4CAF50]/20"><Icons.RefreshCw size={24} /></button>
              </div>
              <button 
                onClick={() => setShowQR(!showQR)} 
                className={`w-full font-bold flex items-center justify-center gap-2 border active:scale-95 transition-all py-4 rounded-3xl ${showQR ? 'bg-[#4CAF50] text-white border-[#4CAF50]' : (isDark ? 'bg-white/5 text-white border-white/5' : 'bg-white text-gray-700 border-gray-200 shadow-sm')}`}
              >
                <Icons.Camera size={18} /> {t.createQRCode}
              </button>
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
      </main>

      {showGenHistory && (
        <div className="md:hidden fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-6" onClick={() => setShowGenHistory(false)}>
          <div className={`w-full max-w-md rounded-[2rem] p-6 border shadow-2xl scale-in-center transition-colors duration-500 ${isDark ? 'bg-[#121212] border-white/10' : 'bg-white border-black/5'}`} onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6 px-1">
              <h3 className={`font-bold uppercase text-[11px] tracking-widest ${isDark ? 'text-white' : 'text-gray-900'}`}>{t.genHistory}</h3>
              <button onClick={() => setShowGenHistory(false)}><Icons.X size={20} className="text-gray-500 hover:text-[#4CAF50]"/></button>
            </div>
            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
              {genHistory.map((p: string, idx: number) => (
                <div key={idx} className={`flex items-center justify-between p-4 rounded-2xl group hover:bg-[#4CAF50]/5 transition-all ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}>
                  <span className="font-mono text-xs text-[#4CAF50] truncate pr-4">{p}</span>
                  <button onClick={() => copy(p)} className="text-gray-500 hover:text-[#4CAF50] transition-all"><Icons.Copy size={16} /></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
