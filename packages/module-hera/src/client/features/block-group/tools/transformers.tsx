import { CurrencyFormat } from '../settings/CurrencyFormat';

export const transformers = {
  option: [
    {
      label: 'Percent',
      value: 'pertent',
      component: (val: number, locale = 'en-US') =>
        new Intl.NumberFormat(locale, { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
          val,
        ),
    },
    {
      label: 'Currency',
      value: 'currency',
      component: CurrencyFormat,
    },
    {
      label: 'CurrencyNegative',
      value: 'currencyNegative',
      component: (val: number, locale = 'en-US') => CurrencyFormat(val, locale, true),
    },
    { label: 'Exponential', value: 'exponential', component: (val: number | string) => (+val)?.toExponential() },
    {
      label: 'Abbreviation',
      value: 'abbreviation',
      component: (val: number, locale = 'en-US') => new Intl.NumberFormat(locale, { notation: 'compact' }).format(val),
    },
    {
      label: 'Decimal',
      value: 'decimal',
      childrens: [
        {
          label: '1.0',
          value: 'OneDigits',
          component: (val: number) =>
            new Intl.NumberFormat('en-US', {
              style: 'decimal',
              minimumFractionDigits: 1,
              maximumFractionDigits: 1,
            }).format(val),
        },
        {
          label: '1.00',
          value: 'TwoDigits',
          component: (val: number) =>
            new Intl.NumberFormat('en-US', {
              style: 'decimal',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(val),
        },
        {
          label: '1.000',
          value: 'ThreeDigits',
          component: (val: number) =>
            new Intl.NumberFormat('en-US', {
              style: 'decimal',
              minimumFractionDigits: 3,
              maximumFractionDigits: 3,
            }).format(val),
        },
        {
          label: '1.0000',
          value: 'FourDigits',
          component: (val: number) =>
            new Intl.NumberFormat('en-US', {
              style: 'decimal',
              minimumFractionDigits: 4,
              maximumFractionDigits: 4,
            }).format(val),
        },
        {
          label: '1.00000',
          value: 'FiveDigits',
          component: (val: number) =>
            new Intl.NumberFormat('en-US', {
              style: 'decimal',
              minimumFractionDigits: 5,
              maximumFractionDigits: 5,
            }).format(val),
        },
      ],
    },
  ],
};
