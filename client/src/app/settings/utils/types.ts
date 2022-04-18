import { Language } from '../../core/translations';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  isAdmin: boolean;
}

export interface Settings {
  locale: Language;
  user: User | null;
  loggedIn: boolean;
  challenge: string;
  darkMode: boolean;
}
