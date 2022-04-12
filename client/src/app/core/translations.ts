import { en_US, he_IL } from 'ng-zorro-antd/i18n';

export enum Language {
  English = 'en',
  Hebrew = 'he',
}

export const cusomTranslationEn = {
  ...en_US,
  Settings: {
    login: 'Login',
  },
  Todos: {
    todos: 'Todos',
  },
};

export const cusomTranslationHe = {
  ...he_IL,
  Settings: {
    login: 'כניסה מהירה',
  },
  Todos: {
    todos: 'משימות',
  },
};
