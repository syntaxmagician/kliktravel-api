export type AppLocale = 'id' | 'en';

export function parseLocale(value?: string): AppLocale {
  return value === 'en' ? 'en' : 'id';
}

export function pickLocale<T>(locale: AppLocale, idValue: T, enValue: T): T {
  return locale === 'en' ? enValue : idValue;
}
