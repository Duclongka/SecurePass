
export type EntryType = 'login' | 'card' | 'contact' | 'note';

export type Language = 'en' | 'vi';

export interface PasswordEntry {
  id: string;
  type: EntryType;
  title: string;
  group: string;
  username?: string;
  password?: string;
  pin?: string;
  authCode?: string;
  recoveryInfo?: string;
  url?: string;
  notes?: string;
  expiryDate?: string; // Specific date string
  expiryMonth?: string;
  expiryYear?: string;
  expiryInterval?: '1d' | '1m' | '6m' | '1y'; // New field for logic
  cardNumber?: string;
  cardHolder?: string;
  cardType?: string;
  nickname?: string;
  fullName?: string;
  phone?: string;
  email?: string;
  address?: string;
  content?: string;
  strength: number;
  createdAt: number;
  isFrequent?: boolean;
}

export type AppView = 'login' | 'vault' | 'generator' | 'settings';

export interface SettingsState {
  autoLockMinutes: number;
  clearClipboardSeconds: number;
  autoLockEnabled: boolean; // New toggle
  clearClipboardEnabled: boolean; // New toggle
  biometricEnabled: boolean;
  language: Language;
  groups: string[];
  folders: string[];
  hasMasterPassword?: boolean;
}
