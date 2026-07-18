import {
  getCountries,
  getCountryCallingCode,
  isSupportedCountry,
  AsYouType,
  validatePhoneNumberLength,
  parsePhoneNumberFromString,
  type CountryCode,
} from 'libphonenumber-js';

export type PhoneCountryOption = {
  code: CountryCode;
  dialCode: string;
  flag: string;
  nameAr: string;
  nameEn: string;
};

export const DEFAULT_PHONE_COUNTRY: CountryCode = 'EG';

const arabicDigits = '٠١٢٣٤٥٦٧٨٩';
const easternArabicDigits = '۰۱۲۳۴۵۶۷۸۹';

export function normalizePhoneInput(value: string) {
  return [...value].map(character => {
    const arabicIndex = arabicDigits.indexOf(character);
    if (arabicIndex >= 0) return String(arabicIndex);
    const easternIndex = easternArabicDigits.indexOf(character);
    return easternIndex >= 0 ? String(easternIndex) : character;
  }).join('').replace(/[()\s.-]/g, '');
}

export function parseWhatsAppPhone(value: string, country: CountryCode = DEFAULT_PHONE_COUNTRY) {
  try {
    const normalized = normalizePhoneInput(value);
    if (validatePhoneNumberLength(normalized, country)) return null;
    const parsed = parsePhoneNumberFromString(normalized, country);
    if (!parsed?.isValid()) return null;
    // Egypt mobile numbers are always 10 digits after +20 (11 digits locally,
    // including the leading zero). The library also accepts legacy 9-digit
    // ranges, but those are not valid WhatsApp mobile numbers for this form.
    if (country === 'EG' && /^1[0125]/.test(parsed.nationalNumber) && parsed.nationalNumber.length !== 10) return null;
    return parsed.number;
  } catch {
    return null;
  }
}

export function formatPhoneInput(value: string, country: CountryCode = DEFAULT_PHONE_COUNTRY) {
  const normalized = normalizePhoneInput(value);
  if (!normalized) return '';
  try {
    return new AsYouType(country).input(normalized);
  } catch {
    return value;
  }
}

function displayCountryName(code: string, locale: string) {
  try {
    return new Intl.DisplayNames([locale], { type: 'region' }).of(code) || code;
  } catch {
    return code;
  }
}

export function getPhoneCountryOptions(): PhoneCountryOption[] {
  return getCountries().map(code => ({
    code,
    dialCode: `+${getCountryCallingCode(code)}`,
    flag: [...code].map(character => String.fromCodePoint(character.charCodeAt(0) + 127397)).join(''),
    nameAr: displayCountryName(code, 'ar'),
    nameEn: displayCountryName(code, 'en'),
  })).sort((a, b) => a.nameAr.localeCompare(b.nameAr, 'ar'));
}

export function getLocaleCountry(): CountryCode | null {
  try {
    const language = typeof navigator !== 'undefined' ? navigator.language : 'ar-EG';
    const region = new Intl.Locale(language).region;
    return region && getCountries().includes(region as CountryCode) ? region as CountryCode : null;
  } catch {
    return null;
  }
}

export function isValidPhoneCountry(value: string | null | undefined): value is CountryCode {
  return Boolean(value && isSupportedCountry(value as CountryCode));
}
