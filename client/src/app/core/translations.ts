import { en_US, he_IL } from 'ng-zorro-antd/i18n';

export enum Language {
  English = 'en',
  Hebrew = 'he',
}

export const LanguageToDirection = {
  [Language.English]: 'ltr',
  [Language.Hebrew]: 'rtl',
};

export const cusomTranslationEn = {
  ...en_US,
  Settings: {
    login: 'Login',
    logout: 'Logout',
    dark_mode: 'Dark Mode',
    language: 'Language',
    right_to_left: 'Right to Left',
  },
  Todos: {
    todos: 'Todos',
    input_placeholder: 'What needs to be done?',
  },
};

export const cusomTranslationHe = {
  ...he_IL,
  Settings: {
    login: 'כניסה מהירה',
    logout: 'יציאה',
    dark_mode: 'מצב לילה',
    language: 'שפה',
    right_to_left: 'כיוון ימין לשמאל',
  },
  Todos: {
    todos: 'משימות',
    input_placeholder: 'מה תרצה לעשות היום?',
  },
};

export function getLocaleByLanguageCode(code: string) {
  switch (code) {
    case Language.English:
      return cusomTranslationEn;
    case Language.Hebrew:
      return cusomTranslationHe;
    default:
      return cusomTranslationEn;
  }
}
