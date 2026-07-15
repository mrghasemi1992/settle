import { useLocaleStore } from '@/stores';
import { en } from './locales/en';
import { fa } from './locales/fa';

const dictionaries = { en, fa };

/** Reads the active locale's dictionary — for currency/number formatting,
 * see `formatAmount`/`formatNumber`, also exported from here. */
export function useTranslation() {
  const locale = useLocaleStore((state) => state.locale);
  return { locale, t: dictionaries[locale] };
}

export { formatAmount, formatNumber } from './format';
