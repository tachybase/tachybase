export const CurrencyFormat = (val: number, locale = 'en-US', isNeedNegative = false) => {
  const currency = {
    'zh-CN': 'CNY',
    'en-US': 'USD',
    'ja-JP': 'JPY',
    'ko-KR': 'KRW',
    'pt-BR': 'BRL',
    'ru-RU': 'RUB',
    'tr-TR': 'TRY',
    'es-ES': 'EUR',
  }[locale];
  if (isNeedNegative && !!val) {
    val = -val;
  }
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(val);
};
