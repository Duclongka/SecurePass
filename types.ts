
export type EntryType = 'login' | 'card' | 'contact' | 'document';

export type Language = 'en' | 'vi';

export interface PasswordEntry {
  id: string;
  type: EntryType;
  title: string;
  group: string;
  subGroup?: string;
  username?: string;
  password?: string;
  pin?: string;
  authCode?: string;
  msAuthCode?: string; // New field for Microsoft Authenticator
  googleAuthQr?: string; // New field for Google Auth QR image
  msAuthQr?: string; // New field for Microsoft Auth QR image
  recoveryInfo?: string;
  url?: string;
  notes?: string;
  expiryDate?: string;
  expiryMonth?: string;
  expiryYear?: string;
  expiryInterval?: '1d' | '1m' | '6m' | '1y';
  cardNumber?: string;
  cardHolder?: string;
  cardType?: string;
  atmPin?: string; // New field for ATM withdrawal password
  customerSince?: string; // New field for Card
  cvv?: string; // New field for Card
  qrImage?: string; // Base64 image for account QR
  nickname?: string;
  fullName?: string;
  phone?: string;
  email?: string;
  address?: string;
  postCode?: string; // New field for contact postcode
  content?: string;
  strength: number;
  createdAt: number;
  isFrequent?: boolean;

  // Personal Document Fields
  documentType?: 'id_card' | 'health_insurance' | 'driving_license' | 'passport' | 'residence_card';
  idNumber?: string;
  dob?: string;
  hometown?: string;
  residence?: string;
  issuer?: string;
  issueDate?: string;
  recognition?: string;
  gender?: string;
  hospital?: string;
  nationality?: string;
  class?: string;
  passportType?: string;
  passportCode?: string;
  placeOfBirth?: string;
  issuePlace?: string; // New field for ID Card
  
  // Document Images
  frontImage?: string;
  backImage?: string;
}

export type AppView = 'login' | 'vault' | 'generator' | 'settings';

export interface SettingsState {
  autoLockMinutes: number;
  clearClipboardSeconds: number;
  autoLockEnabled: boolean;
  clearClipboardEnabled: boolean;
  biometricEnabled: boolean;
  language: Language;
  theme: 'light' | 'dark';
  groups: string[];
  folders: string[];
  subFolders: Record<string, string[]>; // Mapping of root folder to sub-folders
  hasMasterPassword?: boolean;
}
